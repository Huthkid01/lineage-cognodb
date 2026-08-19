import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import neo4j from "neo4j-driver";
import {
  artists,
  artworks,
  exhibitions,
  institutions,
  people,
  relationships,
} from "../src/data/graph";
import { ARTWORK_IMAGES } from "../src/data/images";

function loadEnvFile() {
  for (const file of [".env.local", ".env"]) {
    const path = resolve(process.cwd(), file);
    if (!existsSync(path)) continue;
    for (const line of readFileSync(path, "utf8").split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  }
}

loadEnvFile();

function env(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    console.error(`Missing ${name}. Copy .env.example to .env.local and fill in your CognoDB details.`);
    process.exit(1);
  }
  return value;
}

async function main() {
  const uri = env("COGNODB_URI");
  const user = process.env.COGNODB_USER?.trim() || "cognodb";
  const password = env("COGNODB_PASSWORD");
  const reset = process.env.SEED_RESET === "true";

  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password), {
    connectionTimeout: 12000,
  });

  const session = driver.session();
  try {
    await driver.verifyConnectivity();
    console.log("Connected to CognoDB.");

    if (reset) {
      await session.run("MATCH (n) DETACH DELETE n");
      console.log("Cleared existing graph (SEED_RESET=true).");
    }

    await session.run(
      `
      UNWIND $rows AS row
      MERGE (n:Artist {id: row.id})
      SET n.name = row.name, n.born = row.born, n.died = row.died,
          n.nationality = row.nationality, n.movement = row.movement
      `,
      { rows: artists },
    );

    await session.run(
      `
      UNWIND $rows AS row
      MERGE (n:Artwork {id: row.id})
      SET n.title = row.title, n.year = row.year, n.medium = row.medium,
          n.palette = row.palette, n.imageUrl = row.imageUrl, n.disputed = row.disputed, n.notes = row.notes
      `,
      { rows: artworks.map((row) => ({ ...row, imageUrl: ARTWORK_IMAGES[row.id] })) },
    );

    await session.run(
      `
      UNWIND $rows AS row
      MERGE (n:Institution {id: row.id})
      SET n.name = row.name, n.city = row.city, n.country = row.country, n.kind = row.kind
      `,
      { rows: institutions },
    );

    await session.run(
      `
      UNWIND $rows AS row
      MERGE (n:Person {id: row.id})
      SET n.name = row.name, n.role = row.role, n.city = row.city
      `,
      { rows: people },
    );

    await session.run(
      `
      UNWIND $rows AS row
      MERGE (n:Exhibition {id: row.id})
      SET n.name = row.name, n.year = row.year, n.city = row.city
      `,
      { rows: exhibitions },
    );

    const byType = new Map<string, typeof relationships>();
    for (const rel of relationships) {
      const list = byType.get(rel.type) ?? [];
      list.push(rel);
      byType.set(rel.type, list);
    }

    for (const [type, rows] of byType) {
      await session.run(
        `
        UNWIND $rows AS row
        MATCH (a {id: row.from})
        MATCH (b {id: row.to})
        MERGE (a)-[r:${type}]->(b)
        SET r += row.props
        `,
        {
          rows: rows.map((r) => ({
            from: r.from,
            to: r.to,
            props: r.props ?? {},
          })),
        },
      );
      console.log(`  ${type}: ${rows.length}`);
    }

    const counts = await session.run(
      `
      MATCH (n) WITH count(n) AS nodes
      MATCH ()-[r]->()
      RETURN nodes, count(r) AS rels
      `,
    );
    const rec = counts.records[0];
    console.log(
      `Seed complete: ${rec.get("nodes")} nodes, ${rec.get("rels")} relationships.`,
    );
  } finally {
    await session.close();
    await driver.close();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

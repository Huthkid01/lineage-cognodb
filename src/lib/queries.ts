import neo4j, { Node, Relationship } from "neo4j-driver";
import { asRecord, toNumber, withRead } from "./db";
import type {
  ArtworkCard,
  ArtworkDetail,
  ContagionHit,
  GraphEdge,
  GraphNode,
  NodeKind,
  ProvenanceEvent,
  RestorerHit,
  SearchHit,
  Stats,
} from "./types";

function kindOf(node: Node): NodeKind {
  const labels = node.labels as string[];
  if (labels.includes("Artwork")) return "Artwork";
  if (labels.includes("Artist")) return "Artist";
  if (labels.includes("Institution")) return "Institution";
  if (labels.includes("Exhibition")) return "Exhibition";
  return "Person";
}

function labelOf(node: Node): string {
  const p = node.properties;
  return String(p.title ?? p.name ?? p.id);
}

function hrefFor(kind: NodeKind, id: string): string {
  if (kind === "Artwork") return `/works/${id}`;
  if (kind === "Artist") return `/artists/${id}`;
  if (kind === "Institution") return `/institutions/${id}`;
  return `/search?q=${encodeURIComponent(id)}`;
}

function artworkCardFrom(art: Node, artist?: Node | null): ArtworkCard {
  const p = art.properties;
  const a = artist?.properties;
  return {
    id: String(p.id),
    title: String(p.title),
    year: toNumber(p.year),
    medium: String(p.medium ?? ""),
    palette: String(p.palette ?? "#6b6258"),
    imageUrl: p.imageUrl ? String(p.imageUrl) : undefined,
    disputed: Boolean(p.disputed),
    artistId: String(a?.id ?? ""),
    artistName: String(a?.name ?? "Unknown"),
  };
}

export async function getStats(): Promise<Stats> {
  return withRead(async (tx) => {
    const result = await tx.run(
      `
      MATCH (n)
      WITH
        sum(CASE WHEN n:Artwork THEN 1 ELSE 0 END) AS artworks,
        sum(CASE WHEN n:Artist THEN 1 ELSE 0 END) AS artists,
        sum(CASE WHEN n:Institution THEN 1 ELSE 0 END) AS institutions,
        sum(CASE WHEN n:Person THEN 1 ELSE 0 END) AS people,
        sum(CASE WHEN n:Exhibition THEN 1 ELSE 0 END) AS exhibitions,
        sum(CASE WHEN n:Artwork AND n.disputed THEN 1 ELSE 0 END) AS disputed
      MATCH ()-[r]->()
      RETURN artworks, artists, institutions, people, exhibitions, disputed, count(r) AS relationships
      `,
    );
    const rec = result.records[0];
    if (!rec) {
      return {
        artworks: 0,
        artists: 0,
        institutions: 0,
        people: 0,
        exhibitions: 0,
        relationships: 0,
        disputed: 0,
      };
    }
    return {
      artworks: toNumber(rec.get("artworks")),
      artists: toNumber(rec.get("artists")),
      institutions: toNumber(rec.get("institutions")),
      people: toNumber(rec.get("people")),
      exhibitions: toNumber(rec.get("exhibitions")),
      relationships: toNumber(rec.get("relationships")),
      disputed: toNumber(rec.get("disputed")),
    };
  });
}

export async function listFeatured(): Promise<ArtworkCard[]> {
  return withRead(async (tx) => {
    const result = await tx.run(
      `
      MATCH (artist:Artist)-[:CREATED]->(w:Artwork)
      RETURN w, artist
      ORDER BY w.disputed DESC, w.year
      LIMIT $limit
      `,
      { limit: neo4j.int(8) },
    );
    return result.records.map((r) => artworkCardFrom(r.get("w"), r.get("artist")));
  });
}

export async function searchGraph(q: string): Promise<SearchHit[]> {
  const query = q.trim();
  if (!query) return [];
  return withRead(async (tx) => {
    const result = await tx.run(
      `
      MATCH (n)
      WHERE toLower(coalesce(n.title, '')) CONTAINS toLower($q)
         OR toLower(coalesce(n.name, '')) CONTAINS toLower($q)
         OR toLower(coalesce(n.city, '')) CONTAINS toLower($q)
         OR toLower(coalesce(n.movement, '')) CONTAINS toLower($q)
      RETURN n
      LIMIT $limit
      `,
      { q: query, limit: neo4j.int(20) },
    );
    return result.records.map((r) => {
      const n = r.get("n") as Node;
      const kind = kindOf(n);
      const id = String(n.properties.id);
      const detail =
        kind === "Artwork"
          ? String(n.properties.medium ?? "")
          : kind === "Institution"
            ? `${n.properties.city}, ${n.properties.country}`
            : kind === "Artist"
              ? String(n.properties.movement ?? "")
              : String(n.properties.role ?? n.properties.city ?? "");
      return {
        id,
        kind,
        label: labelOf(n),
        detail,
        href: hrefFor(kind, id),
      };
    });
  });
}

export async function getArtwork(id: string): Promise<ArtworkDetail | null> {
  return withRead(async (tx) => {
    const result = await tx.run(
      `
      MATCH (artist:Artist)-[:CREATED]->(w:Artwork {id: $id})
      OPTIONAL MATCH (w)-[own:OWNED_BY]->(owner)
      WITH w, artist, collect(DISTINCT owner) AS ownerNodes, collect(DISTINCT own) AS ownerRels
      OPTIONAL MATCH (w)-[loan:LOANED_TO]->(loanInst:Institution)
      WITH w, artist, ownerNodes, ownerRels, collect(DISTINCT loanInst) AS loanNodes, collect(DISTINCT loan) AS loanRels
      OPTIONAL MATCH (w)-[ex:EXHIBITED_IN]->(show:Exhibition)
      WITH w, artist, ownerNodes, ownerRels, loanNodes, loanRels, collect(DISTINCT show) AS showNodes, collect(DISTINCT ex) AS showRels
      OPTIONAL MATCH (restorer:Person)-[rest:RESTORED]->(w)
      WITH w, artist, ownerNodes, ownerRels, loanNodes, loanRels, showNodes, showRels, collect(DISTINCT restorer) AS restNodes, collect(DISTINCT rest) AS restRels
      OPTIONAL MATCH (dealer:Person)-[deal:DEALT]->(w)
      RETURN w, artist, ownerNodes, ownerRels, loanNodes, loanRels, showNodes, showRels,
             restNodes, restRels, collect(DISTINCT dealer) AS dealNodes, collect(DISTINCT deal) AS dealRels
      `,
      { id },
    );
    const rec = result.records[0];
    if (!rec) return null;
    const w = rec.get("w") as Node;
    const artist = rec.get("artist") as Node;
    const events: ProvenanceEvent[] = [];

    events.push({
      kind: "created",
      year: toNumber(w.properties.year),
      until: null,
      title: `Created by ${artist.properties.name}`,
      subtitle: String(w.properties.medium ?? ""),
      href: `/artists/${artist.properties.id}`,
    });

    type Pair = { rel: Relationship | null; node: Node | null };
    const pushPairs = (
      pairs: Pair[],
      kind: ProvenanceEvent["kind"],
      verb: (node: Node, rel: Relationship) => { title: string; subtitle: string; href?: string },
    ) => {
      for (const pair of pairs) {
        if (!pair.rel || !pair.node) continue;
        const meta = verb(pair.node, pair.rel);
        events.push({
          kind,
          year: toNumber(pair.rel.properties.year ?? pair.rel.properties.from, 0) || null,
          until: pair.rel.properties.to != null ? toNumber(pair.rel.properties.to) : null,
          ...meta,
        });
      }
    };

    const zipPairs = (nodes: Node[], rels: Relationship[]): Pair[] => {
      const cleanNodes = nodes.filter(Boolean);
      const cleanRels = rels.filter(Boolean);
      const n = Math.min(cleanNodes.length, cleanRels.length);
      return Array.from({ length: n }, (_, i) => ({
        rel: cleanRels[i],
        node: cleanNodes[i],
      }));
    };

    pushPairs(zipPairs(rec.get("dealNodes"), rec.get("dealRels")), "dealt", (node, rel) => ({
      title: `Handled by dealer ${node.properties.name}`,
      subtitle: String(rel.properties.year ?? ""),
    }));
    pushPairs(zipPairs(rec.get("ownerNodes"), rec.get("ownerRels")), "owned", (node) => ({
      title: `Owned by ${node.properties.name}`,
      subtitle: [node.properties.city, node.properties.country || node.properties.role]
        .filter(Boolean)
        .join(" · "),
      href: node.labels.includes("Institution")
        ? `/institutions/${node.properties.id}`
        : undefined,
    }));
    pushPairs(zipPairs(rec.get("loanNodes"), rec.get("loanRels")), "loaned", (node, rel) => ({
      title: `Loaned to ${node.properties.name}`,
      subtitle: String(rel.properties.year ?? ""),
      href: `/institutions/${node.properties.id}`,
    }));
    pushPairs(zipPairs(rec.get("showNodes"), rec.get("showRels")), "exhibited", (node, rel) => ({
      title: `Shown in ${node.properties.name}`,
      subtitle: `${node.properties.city ?? ""} ${rel.properties.year ?? ""}`.trim(),
    }));
    pushPairs(zipPairs(rec.get("restNodes"), rec.get("restRels")), "restored", (node, rel) => ({
      title: `Restored by ${node.properties.name}`,
      subtitle: String(rel.properties.treatment ?? rel.properties.year ?? ""),
    }));

    events.sort((a, b) => (a.year ?? 0) - (b.year ?? 0));

    return {
      artwork: {
        ...artworkCardFrom(w, artist),
        notes: String(w.properties.notes ?? ""),
        movement: String(artist.properties.movement ?? ""),
      },
      artist: {
        id: String(artist.properties.id),
        name: String(artist.properties.name),
        lifespan: `${artist.properties.born}–${artist.properties.died ?? ""}`,
        nationality: String(artist.properties.nationality ?? ""),
        movement: String(artist.properties.movement ?? ""),
      },
      provenance: events,
    };
  });
}

export async function getNeighborhood(
  id: string,
  hops = 2,
): Promise<{ nodes: GraphNode[]; edges: GraphEdge[]; centerId: string }> {
  const depth = Math.min(Math.max(hops, 1), 3);
  return withRead(async (tx) => {
    const result = await tx.run(
      `
      MATCH (center {id: $id})
      MATCH p = (center)-[*1..3]-(n)
      WHERE length(p) <= $hops
      RETURN nodes(p) AS ns, relationships(p) AS rs, length(p) AS hops
      `,
      { id, hops: neo4j.int(depth) },
    );

    const nodes = new Map<string, GraphNode>();
    const edges = new Map<string, GraphEdge>();

    if (result.records.length === 0) {
      const center = await tx.run(`MATCH (n {id: $id}) RETURN n`, { id });
      const n = center.records[0]?.get("n") as Node | undefined;
      if (n) {
        nodes.set(String(n.properties.id), {
          id: String(n.properties.id),
          kind: kindOf(n),
          label: labelOf(n),
          hops: 0,
          disputed: Boolean(n.properties.disputed),
          props: asRecord(n.properties),
        });
      }
      return { nodes: [...nodes.values()], edges: [], centerId: id };
    }

    for (const rec of result.records) {
      const ns = rec.get("ns") as Node[];
      const rs = rec.get("rs") as Relationship[];
      const pathHops = toNumber(rec.get("hops"));
      ns.forEach((n, index) => {
        const nid = String(n.properties.id);
        const existing = nodes.get(nid);
        const thisHop = index === 0 ? 0 : Math.min(pathHops, index);
        if (!existing || (existing.hops ?? 99) > thisHop) {
          nodes.set(nid, {
            id: nid,
            kind: kindOf(n),
            label: labelOf(n),
            hops: nid === id ? 0 : thisHop,
            disputed: Boolean(n.properties.disputed),
            props: asRecord(n.properties),
          });
        }
      });
      ns.slice(0, -1).forEach((fromNode, i) => {
        const toNode = ns[i + 1];
        const rel = rs[i];
        if (!toNode || !rel) return;
        const fromId = String(fromNode.properties.id);
        const toId = String(toNode.properties.id);
        const eid = `${fromId}|${rel.type}|${toId}|${i}`;
        const key = `${fromId}-${rel.type}-${toId}`;
        if (!edges.has(key)) {
          edges.set(key, {
            id: eid,
            type: rel.type,
            from: fromId,
            to: toId,
            props: asRecord(rel.properties),
          });
        }
      });
    }

    const center = nodes.get(id);
    if (center) center.hops = 0;

    return { nodes: [...nodes.values()], edges: [...edges.values()], centerId: id };
  });
}

export async function disputeContagion(hops = 3): Promise<ContagionHit[]> {
  const depth = Math.min(Math.max(hops, 2), 4);
  return withRead(async (tx) => {
    const result = await tx.run(
      `
      MATCH (flagged:Artwork {disputed: true})
      MATCH p = (flagged)-[:OWNED_BY|LOANED_TO|EXHIBITED_IN|DEALT|RESTORED*1..4]-(other:Artwork)
      WHERE other.id <> flagged.id
        AND coalesce(other.disputed, false) = false
        AND length(p) <= $hops
      WITH other, flagged, min(length(p)) AS hops
      MATCH (artist:Artist)-[:CREATED]->(other)
      WITH other, artist, hops,
           collect(DISTINCT flagged.title)[0] AS via
      RETURN other, artist, hops, via
      ORDER BY hops, other.title
      `,
      { hops: neo4j.int(depth) },
    );
    return result.records.map((r) => ({
      artwork: artworkCardFrom(r.get("other"), r.get("artist")),
      hops: toNumber(r.get("hops")),
      via: String(r.get("via")),
    }));
  });
}

export async function shortestArtworkPath(fromId: string, toId: string) {
  return withRead(async (tx) => {
    const result = await tx.run(
      `
      MATCH (from:Artwork {id: $fromId}), (to:Artwork {id: $toId})
      MATCH p = (from)-[:OWNED_BY|LOANED_TO|EXHIBITED_IN|CREATED|HOSTED_BY|RESTORED|DEALT|TRAINED_UNDER|STUDIED_WITH|INSPIRED_BY*1..6]-(to)
      WITH p, length(p) AS hops
      ORDER BY hops
      LIMIT 1
      RETURN nodes(p) AS ns, relationships(p) AS rs, hops
      `,
      { fromId, toId },
    );
    const rec = result.records[0];
    if (!rec) return { nodes: [] as GraphNode[], edges: [] as GraphEdge[], hops: null as number | null };
    const ns = rec.get("ns") as Node[];
    const rs = rec.get("rs") as Relationship[];
    const nodes: GraphNode[] = ns.map((n, i) => ({
      id: String(n.properties.id),
      kind: kindOf(n),
      label: labelOf(n),
      hops: i,
      disputed: Boolean(n.properties.disputed),
      props: asRecord(n.properties),
    }));
    const edges: GraphEdge[] = rs.map((rel, i) => ({
      id: `p-${i}`,
      type: rel.type,
      from: nodes[i].id,
      to: nodes[i + 1].id,
      props: asRecord(rel.properties),
    }));
    return { nodes, edges, hops: toNumber(rec.get("hops")) };
  });
}

export async function restorerRecommendations(artworkId: string): Promise<RestorerHit[]> {
  return withRead(async (tx) => {
    const result = await tx.run(
      `
      MATCH (a:Artwork {id: $artworkId})
      OPTIONAL MATCH (direct:Person)-[:RESTORED]->(a)
      OPTIONAL MATCH (a)-[:OWNED_BY|LOANED_TO]->(:Institution)<-[:OWNED_BY|LOANED_TO]-(sib:Artwork)
      OPTIONAL MATCH (sibRestorer:Person)-[:RESTORED]->(sib)
      WITH a, collect(DISTINCT direct) + collect(DISTINCT sibRestorer) AS raw
      WITH a, [x IN raw WHERE x IS NOT NULL] AS known
      UNWIND known AS seed
      MATCH path = (seed)-[:TRAINED_UNDER*1..2]-(peer:Person)
      WHERE peer.role = 'restorer'
        AND peer <> seed
        AND NOT (peer)-[:RESTORED]->(a)
      OPTIONAL MATCH (peer)-[:RESTORED]->(w:Artwork)
      WITH peer, seed, min(length(path)) AS hops,
           count(DISTINCT w) AS worksRestored,
           sum(CASE WHEN w.disputed THEN 1 ELSE 0 END) AS disputedHandled
      RETURN peer.id AS id, peer.name AS name, peer.city AS city,
             hops, worksRestored, disputedHandled, seed.name AS viaMentor
      ORDER BY hops, worksRestored DESC
      LIMIT $limit
      `,
      { artworkId, limit: neo4j.int(8) },
    );
    return result.records.map((r) => ({
      id: String(r.get("id")),
      name: String(r.get("name")),
      city: String(r.get("city") ?? ""),
      hops: toNumber(r.get("hops")),
      worksRestored: toNumber(r.get("worksRestored")),
      disputedHandled: toNumber(r.get("disputedHandled")),
      viaMentor: String(r.get("viaMentor") ?? ""),
    }));
  });
}

export async function getArtist(id: string) {
  return withRead(async (tx) => {
    const result = await tx.run(
      `
      MATCH (artist:Artist {id: $id})
      OPTIONAL MATCH (artist)-[:CREATED]->(w:Artwork)
      OPTIONAL MATCH (artist)-[:STUDIED_WITH]->(mentor:Artist)
      OPTIONAL MATCH (student:Artist)-[:STUDIED_WITH]->(artist)
      RETURN artist,
             collect(DISTINCT w) AS works,
             collect(DISTINCT mentor) AS mentors,
             collect(DISTINCT student) AS students
      `,
      { id },
    );
    const rec = result.records[0];
    if (!rec) return null;
    const artist = rec.get("artist") as Node;
    const works = (rec.get("works") as Node[]).filter(Boolean).map((w) => artworkCardFrom(w, artist));
    return {
      id: String(artist.properties.id),
      name: String(artist.properties.name),
      born: toNumber(artist.properties.born),
      died: artist.properties.died != null ? toNumber(artist.properties.died) : null,
      nationality: String(artist.properties.nationality ?? ""),
      movement: String(artist.properties.movement ?? ""),
      works,
      mentors: (rec.get("mentors") as Node[]).filter(Boolean).map((n) => ({
        id: String(n.properties.id),
        name: String(n.properties.name),
      })),
      students: (rec.get("students") as Node[]).filter(Boolean).map((n) => ({
        id: String(n.properties.id),
        name: String(n.properties.name),
      })),
    };
  });
}

export async function getInstitution(id: string) {
  return withRead(async (tx) => {
    const result = await tx.run(
      `
      MATCH (i:Institution {id: $id})
      OPTIONAL MATCH (w:Artwork)-[:OWNED_BY]->(i)
      OPTIONAL MATCH (artist:Artist)-[:CREATED]->(w)
      OPTIONAL MATCH (loaned:Artwork)-[:LOANED_TO]->(i)
      OPTIONAL MATCH (show:Exhibition)-[:HOSTED_BY]->(i)
      RETURN i,
             collect(DISTINCT {w: w, artist: artist}) AS holdings,
             collect(DISTINCT loaned) AS loans,
             collect(DISTINCT show) AS shows
      `,
      { id },
    );
    const rec = result.records[0];
    if (!rec) return null;
    const i = rec.get("i") as Node;
    const holdings = (rec.get("holdings") as { w: Node | null; artist: Node | null }[])
      .filter((row) => row.w)
      .map((row) => artworkCardFrom(row.w as Node, row.artist));
    return {
      id: String(i.properties.id),
      name: String(i.properties.name),
      city: String(i.properties.city ?? ""),
      country: String(i.properties.country ?? ""),
      kind: String(i.properties.kind ?? ""),
      holdings,
      loanCount: (rec.get("loans") as Node[]).filter(Boolean).length,
      exhibitions: (rec.get("shows") as Node[])
        .filter(Boolean)
        .map((e) => ({
          id: String(e.properties.id),
          name: String(e.properties.name),
          year: toNumber(e.properties.year),
        })),
    };
  });
}

export async function listArtworks(): Promise<ArtworkCard[]> {
  return withRead(async (tx) => {
    const result = await tx.run(
      `
      MATCH (artist:Artist)-[:CREATED]->(w:Artwork)
      RETURN w, artist
      ORDER BY w.year
      `,
    );
    return result.records.map((r) => artworkCardFrom(r.get("w"), r.get("artist")));
  });
}

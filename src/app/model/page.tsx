export default function ModelPage() {
  const nodes = [
    { label: "Artwork", detail: "title, year, medium, disputed, notes" },
    { label: "Artist", detail: "name, lifespan, nationality, movement" },
    { label: "Institution", detail: "museum, gallery, or foundation" },
    { label: "Person", detail: "dealer, restorer, collector, curator" },
    { label: "Exhibition", detail: "name, year, city" },
  ];

  const rels = [
    "CREATED {year}",
    "OWNED_BY {from, to, mode}",
    "LOANED_TO {year}",
    "EXHIBITED_IN {year}",
    "HOSTED_BY",
    "DEALT {year}",
    "RESTORED {year, treatment}",
    "TRAINED_UNDER {year}",
    "STUDIED_WITH {year}",
    "INSPIRED_BY",
    "CURATED {year}",
  ];

  return (
    <div className="flex flex-col gap-10">
      <div className="max-w-2xl">
        <p className="text-[11px] uppercase tracking-[0.25em] text-copper">Schema</p>
        <h1 className="mt-2 font-serif text-4xl tracking-tight">Data model</h1>
        <p className="mt-3 leading-relaxed text-muted">
          Five node labels. Typed relationships. Dates and treatments live on
          the edge because they describe an event, not an object.
        </p>
      </div>

      <section>
        <h2 className="font-serif text-xl">Nodes</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {nodes.map((node) => (
            <div key={node.label} className="rounded-2xl border border-line bg-white/45 px-5 py-4">
              <p className="font-serif text-lg">{node.label}</p>
              <p className="mt-1 text-sm text-muted">{node.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-serif text-xl">Relationships</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {rels.map((rel) => (
            <li
              key={rel}
              className="rounded-full border border-line bg-white/50 px-3 py-1.5 font-mono text-xs"
            >
              {rel}
            </li>
          ))}
        </ul>
      </section>

      <pre className="overflow-x-auto rounded-2xl border border-line bg-[#16120e] p-5 font-mono text-[13px] leading-7 text-paper/90">
{`(:Artist)-[:CREATED]->(:Artwork)
(:Artwork)-[:OWNED_BY]->(:Institution|:Person)
(:Artwork)-[:LOANED_TO]->(:Institution)
(:Artwork)-[:EXHIBITED_IN]->(:Exhibition)
(:Exhibition)-[:HOSTED_BY]->(:Institution)
(:Person)-[:RESTORED|DEALT]->(:Artwork)
(:Person)-[:TRAINED_UNDER]->(:Person)`}
      </pre>

      <p className="max-w-2xl text-sm leading-relaxed text-muted">
        Seed data lives in <code className="font-mono text-ink">src/data/graph.ts</code>{" "}
        and loads with <code className="font-mono text-ink">npm run seed</code>.
        Application Cypher is parameterized in{" "}
        <code className="font-mono text-ink">src/lib/queries.ts</code>.
      </p>
    </div>
  );
}

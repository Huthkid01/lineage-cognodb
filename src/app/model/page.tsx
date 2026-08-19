import { PageHeader } from "@/components/page-header";

export default function ModelPage() {
  const nodes = [
    { label: "Artwork", detail: "The painting itself — title, year, medium, and whether the title is disputed." },
    { label: "Artist", detail: "Who made it, when they lived, and the movement they worked in." },
    { label: "Institution", detail: "A museum, gallery, or foundation that held or showed the work." },
    { label: "Person", detail: "A dealer, restorer, collector, or curator who touched the chain of title." },
    { label: "Exhibition", detail: "A show, with a year and a city, that several works may share." },
  ];

  const rels = [
    { from: "Artist", verb: "created", to: "Artwork" },
    { from: "Artwork", verb: "owned by", to: "Institution or collector" },
    { from: "Artwork", verb: "loaned to", to: "Institution" },
    { from: "Artwork", verb: "shown in", to: "Exhibition" },
    { from: "Exhibition", verb: "hosted by", to: "Institution" },
    { from: "Person", verb: "dealt or restored", to: "Artwork" },
    { from: "Person", verb: "trained under", to: "Person" },
    { from: "Artist", verb: "studied with", to: "Artist" },
  ];

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        kicker="How the collection is connected"
        title="How it works"
        lede="Lineage does not store a painting as a single row. It stores the people, places, and events around it, then draws the links between them. Dates sit on those links — when something was owned, loaned, restored, or shown — because the date belongs to the event, not the object."
      />

      <section
        className="rounded-3xl border border-line bg-[#16120e] px-4 py-8 sm:px-8"
        aria-label="How entities connect"
      >
        <p className="text-center text-[11px] uppercase tracking-[0.2em] text-paper/50">
          A work sits in the middle of a chain
        </p>
        <div className="mt-6 grid gap-3 text-center sm:grid-cols-3 sm:items-center">
          <DiagramChip label="Artist" hint="makes the work" />
          <div className="flex flex-col items-center gap-2">
            <p className="text-[10px] uppercase tracking-wider text-copper">creates</p>
            <DiagramChip label="Artwork" hint="the object under review" accent />
            <p className="text-[10px] uppercase tracking-wider text-copper">owned · loaned · shown · restored</p>
          </div>
          <div className="grid gap-2">
            <DiagramChip label="Institution" hint="museum or gallery" />
            <DiagramChip label="Person" hint="dealer, restorer, collector" />
            <DiagramChip label="Exhibition" hint="a shared show" />
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-serif text-2xl tracking-tight">What you can open</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {nodes.map((node) => (
            <div key={node.label} className="rounded-2xl border border-line bg-white/45 px-5 py-5">
              <p className="font-serif text-lg">{node.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{node.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-serif text-2xl tracking-tight">How they connect</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {rels.map((rel) => (
            <li
              key={`${rel.from}-${rel.verb}`}
              className="flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-white/40 px-4 py-3 text-sm"
            >
              <span className="font-medium">{rel.from}</span>
              <span className="text-[10px] uppercase tracking-wider text-copper">{rel.verb}</span>
              <span className="font-medium">{rel.to}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function DiagramChip({
  label,
  hint,
  accent = false,
}: {
  label: string;
  hint: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl px-4 py-4 ${
        accent ? "bg-paper text-ink" : "border border-white/15 bg-white/8 text-paper"
      }`}
    >
      <p className="font-serif text-lg">{label}</p>
      <p className={`mt-1 text-xs ${accent ? "text-muted" : "text-paper/55"}`}>{hint}</p>
    </div>
  );
}

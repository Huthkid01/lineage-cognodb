import Link from "next/link";
import { SearchBox, SearchHints } from "@/components/search-box";
import { ErrorPanel, WorkCard } from "@/components/work-card";
import { SectionTitle } from "@/components/page-header";
import { getStats, listFeatured } from "@/lib/queries";
import { tryDb } from "@/lib/safe";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const result = await tryDb(() => Promise.all([getStats(), listFeatured()]));
  if (!result.ok) {
    return (
      <div className="flex flex-col gap-8">
        <h1 className="font-serif text-4xl">Lineage</h1>
        <ErrorPanel message={result.message} />
      </div>
    );
  }

  const [stats, featured] = result.data;

  return (
    <div className="flex flex-col gap-10 sm:gap-14">
      <section className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-copper">
            Collections intelligence
          </p>
          <h1 className="mt-3 max-w-2xl font-serif text-[2rem] leading-[1.15] tracking-tight sm:text-[2.6rem] lg:text-5xl">
            See who a painting has touched — and who it should not sit beside.
          </h1>
          <p className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-muted">
            Lineage is a registrar&apos;s map: ownership, loans, exhibitions,
            dealers, and workshops, stored as a graph. Open a work, walk its
            past, then ask whether a dispute is closer than it looks.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/works/w-azure" className="btn-primary w-full sm:w-auto">
              Start with a disputed work
            </Link>
            <Link href="/investigate" className="btn-ghost w-full sm:w-auto">
              Run an investigation
            </Link>
          </div>
        </div>
        <div className="rounded-3xl border border-line bg-white/45 p-5 shadow-[0_20px_50px_-36px_rgba(26,21,16,0.45)]">
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-muted">
            Look up anything in the graph
          </p>
          <SearchBox size="hero" />
          <SearchHints />
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Artworks" value={stats.artworks} />
        <Stat label="Relationships" value={stats.relationships} />
        <Stat label="Institutions" value={stats.institutions} />
        <Stat label="Disputed works" value={stats.disputed} accent />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Step n="01" title="Open a work" body="Every painting has a timeline: who owned it, who showed it, who restored it." />
        <Step n="02" title="Read the neighborhood" body="The ring graph shows two hops out — museums, dealers, and people that share history." />
        <Step n="03" title="Ask a graph question" body="Contagion, shortest path, and restorer recommendations live under Investigate." />
      </section>

      <section>
        <SectionTitle
          title="Start with a work"
          lede="Disputed titles first. Click any canvas to open its provenance."
          action={
            <Link href="/works" className="hidden text-sm text-copper hover:underline sm:inline">
              View the full collection →
            </Link>
          }
        />
        {featured.length === 0 ? (
          <p className="text-sm text-muted">The collection has not loaded yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {featured.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white/40 px-5 py-5">
      <p className="text-[11px] uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className={`mt-2 font-serif text-3xl tabular-nums ${accent ? "text-flag" : ""}`}>
        {value}
      </p>
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white/35 px-5 py-5">
      <p className="font-serif text-sm text-copper">{n}</p>
      <h3 className="mt-2 font-serif text-xl">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}

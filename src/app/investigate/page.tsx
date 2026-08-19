import { EmptyState, ErrorPanel, WorkCard } from "@/components/work-card";
import { PathFinder, RestorerFinder } from "@/components/investigate-tools";
import {
  disputeContagion,
  listArtworks,
  restorerRecommendations,
  shortestArtworkPath,
} from "@/lib/queries";
import { PageHeader } from "@/components/page-header";
import { tryDb } from "@/lib/safe";

export const dynamic = "force-dynamic";

export default async function InvestigatePage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; artwork?: string }>;
}) {
  const { from = "w-azure", to = "w-harbor", artwork = "w-azure" } =
    await searchParams;

  const result = await tryDb(() =>
    Promise.all([
      listArtworks(),
      disputeContagion(3),
      shortestArtworkPath(from, to),
      restorerRecommendations(artwork),
    ]),
  );
  if (!result.ok) return <ErrorPanel message={result.message} />;
  const [works, contagion, path, restorers] = result.data;

  return (
    <div className="flex flex-col gap-10 sm:gap-16">
      <PageHeader
        kicker="Graph-native questions"
        title="Investigate"
        lede="Three questions a registrar cannot cheaply ask a spreadsheet: how far a dispute has spread, how two works are connected, and who in a workshop can treat an object without having touched it before."
      />

      <section className="flex flex-col gap-6">
        <div>
          <p className="font-serif text-sm text-copper">01</p>
          <h2 className="mt-1 font-serif text-2xl tracking-tight">Dispute contagion</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            From every disputed artwork, walk ownership, loans, exhibitions, dealers, and restorers
            up to three hops. Clean titles on those paths are the ones a recursive SQL join would
            miss unless you pre-declared every hop.
          </p>
        </div>
        {contagion.length === 0 ? (
          <EmptyState
            title="No adjacent titles"
            body="Nothing sits in this hop window. Seed the graph and try again."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {contagion.slice(0, 9).map((hit) => (
              <div key={hit.artwork.id} className="flex flex-col gap-2">
                <WorkCard work={hit.artwork} />
                <p className="px-1 text-xs text-muted">
                  {hit.hops} hop{hit.hops === 1 ? "" : "s"} from “{hit.via}”
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <PathFinder
        works={works}
        initialFrom={from}
        initialTo={to}
        initialPath={path}
      />
      <RestorerFinder
        works={works}
        initialArtwork={artwork}
        initialRestorers={restorers}
      />
    </div>
  );
}

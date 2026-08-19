import Link from "next/link";
import { EmptyState, ErrorPanel, WorkCard } from "@/components/work-card";
import { PageHeader } from "@/components/page-header";
import { listArtworks } from "@/lib/queries";
import { tryDb } from "@/lib/safe";

export const dynamic = "force-dynamic";

export default async function CollectionPage() {
  const result = await tryDb(() => listArtworks());
  if (!result.ok) return <ErrorPanel message={result.message} />;
  const works = result.data;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        kicker="The holdings"
        title="Collection"
        lede="Every work in the graph, oldest first. Open a canvas for provenance, then walk the neighborhood."
      />
      {works.length === 0 ? (
        <EmptyState
          title="Nothing loaded yet"
          body="The graph is empty. Ask whoever seeded CognoDB to run the loader, then refresh."
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {works.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
      )}
      <p className="text-sm text-muted">
        Prefer a question instead of a catalogue?{" "}
        <Link href="/investigate" className="text-copper hover:underline">
          Go to Investigate
        </Link>
        .
      </p>
    </div>
  );
}

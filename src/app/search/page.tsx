import Link from "next/link";
import { EmptyState, ErrorPanel } from "@/components/work-card";
import { SearchBox, SearchHints } from "@/components/search-box";
import { PageHeader } from "@/components/page-header";
import { searchGraph } from "@/lib/queries";
import { tryDb } from "@/lib/safe";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const result = await tryDb(async () => (q.trim() ? searchGraph(q) : []));
  if (!result.ok) return <ErrorPanel message={result.message} />;
  const hits = result.data;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        kicker="Look up"
        title="Search"
        lede="Names, titles, cities, and movements — anything stored on a node."
      />
      <div className="max-w-xl">
        <SearchBox initial={q} />
        <SearchHints />
      </div>
      {!q.trim() && (
        <EmptyState
          title="Ask the graph"
          body="Try “Voss”, “Hamburg”, “restorer”, or “Constructed colour”."
        />
      )}
      {q.trim() && hits.length === 0 && (
        <EmptyState
          title="Nothing matched"
          body={`No nodes contained “${q}”. Titles, names, cities, and movements are searched.`}
        />
      )}
      {hits.length > 0 && (
        <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white/40">
          {hits.map((hit) => (
            <li key={`${hit.kind}-${hit.id}`}>
              <Link
                href={hit.href}
                className="flex items-baseline justify-between gap-4 px-5 py-4 hover:bg-ink/5"
              >
                <div>
                  <p className="font-medium">{hit.label}</p>
                  <p className="text-sm text-muted">{hit.detail}</p>
                </div>
                <span className="text-xs uppercase tracking-wider text-muted">
                  {hit.kind}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

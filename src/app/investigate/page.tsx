import Link from "next/link";
import { GraphMap } from "@/components/graph-map";
import { EmptyState, ErrorPanel, WorkCard } from "@/components/work-card";
import {
  disputeContagion,
  listArtworks,
  restorerRecommendations,
  shortestArtworkPath,
} from "@/lib/queries";
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
  const selectedWork = works.find((w) => w.id === artwork);

  return (
    <div className="flex flex-col gap-10 sm:gap-16">
      <header className="max-w-2xl">
        <p className="text-[11px] uppercase tracking-[0.25em] text-copper">
          Graph-native questions
        </p>
        <h1 className="mt-2 font-serif text-3xl tracking-tight sm:text-4xl">Investigations</h1>
        <p className="mt-3 leading-relaxed text-muted">
          Three questions a registrar cannot cheaply ask a spreadsheet:
          how far a dispute has spread, how two works are connected, and who
          in a workshop can treat an object without having touched it before.
        </p>
      </header>

      <section className="flex flex-col gap-6">
        <SectionHead
          kicker="01"
          title="Dispute contagion"
          body="From every disputed artwork, walk ownership, loans, exhibitions, dealers, and restorers up to three hops. Clean titles on those paths are the ones a recursive SQL join would miss unless you pre-declared every hop."
        />
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

      <section className="flex flex-col gap-6">
        <SectionHead
          kicker="02"
          title="Shortest path between works"
          body="An undirected walk across mixed relationship types. In SQL this is a recursive CTE over a pile of unioned edge tables of unknown depth."
        />
        <form className="grid gap-3 rounded-2xl border border-line bg-white/40 p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <label className="flex flex-col gap-1.5 text-[11px] uppercase tracking-[0.16em] text-muted">
            From
            <select name="from" defaultValue={from} className="field rounded-xl">
              {works.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.title}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-[11px] uppercase tracking-[0.16em] text-muted">
            To
            <select name="to" defaultValue={to} className="field rounded-xl">
              {works.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.title}
                </option>
              ))}
            </select>
          </label>
          <input type="hidden" name="artwork" value={artwork} />
          <button className="btn-primary h-[42px] w-full px-6 sm:w-auto">Trace path</button>
        </form>
        {path.hops == null ? (
          <EmptyState
            title="No path of six hops or fewer"
            body="Pick two works that share a museum, dealer, restorer, or exhibition circuit."
          />
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted">
              {path.hops} relationship step{path.hops === 1 ? "" : "s"}
            </p>
            <ol className="flex flex-wrap items-center gap-2 text-sm">
              {path.nodes.map((node, i) => (
                <li key={`${node.id}-${i}`} className="flex items-center gap-2">
                  {i > 0 && (
                    <span className="text-[10px] uppercase tracking-wider text-copper">
                      {path.edges[i - 1]?.type.replaceAll("_", " ")}
                    </span>
                  )}
                  <span className="rounded-full border border-line bg-white/70 px-3 py-1">
                    {node.label}
                  </span>
                </li>
              ))}
            </ol>
            <GraphMap nodes={path.nodes} edges={path.edges} centerId={from} />
          </div>
        )}
      </section>

      <section className="flex flex-col gap-6">
        <SectionHead
          kicker="03"
          title="Workshop recommendation"
          body="Find restorers who have never treated this object, but sit one or two TRAINED_UNDER hops from someone who has — or from someone who treated a sibling work in the same collection."
        />
        <form className="grid gap-3 rounded-2xl border border-line bg-white/40 p-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <label className="flex flex-col gap-1.5 text-[11px] uppercase tracking-[0.16em] text-muted">
            Artwork
            <select name="artwork" defaultValue={artwork} className="field rounded-xl">
              {works.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.title}
                </option>
              ))}
            </select>
          </label>
          <input type="hidden" name="from" value={from} />
          <input type="hidden" name="to" value={to} />
          <button className="btn-primary h-[42px] w-full px-6 sm:w-auto">Recommend</button>
        </form>
        {restorers.length === 0 ? (
          <EmptyState
            title="No unused workshop cousins"
            body="Try The Azure Recital — its restorer trained under Josef Lang, who also trained Elias Crowe."
            action={{ href: "/works/w-azure", label: "Open The Azure Recital" }}
          />
        ) : (
          <ul className="overflow-hidden rounded-2xl border border-line bg-white/50">
            {restorers.map((r, index) => (
              <li
                key={r.id}
                className="flex flex-col gap-1 border-b border-line px-5 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">
                    <span className="mr-2 font-serif text-muted">{index + 1}</span>
                    {r.name}
                  </p>
                  <p className="text-sm text-muted">
                    {r.city} · {r.hops} hop{r.hops === 1 ? "" : "s"} via {r.viaMentor}
                    {selectedWork ? ` from ${selectedWork.title}` : ""}
                  </p>
                </div>
                <p className="text-xs uppercase tracking-wider text-muted">
                  {r.worksRestored} works
                  {r.disputedHandled ? ` · ${r.disputedHandled} disputed` : " · clean record"}
                </p>
              </li>
            ))}
          </ul>
        )}
        <p className="text-xs text-muted">
          Hint:{" "}
          <Link href="/works/w-azure" className="text-copper hover:underline">
            The Azure Recital
          </Link>{" "}
          is the flagged work the seed is built around.
        </p>
      </section>
    </div>
  );
}

function SectionHead({
  kicker,
  title,
  body,
}: {
  kicker: string;
  title: string;
  body: string;
}) {
  return (
    <div>
      <p className="font-serif text-sm text-copper">{kicker}</p>
      <h2 className="mt-1 font-serif text-2xl tracking-tight">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}

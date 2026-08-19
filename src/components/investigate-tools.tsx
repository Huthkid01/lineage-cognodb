"use client";

import { FormEvent, useState, useTransition } from "react";
import Link from "next/link";
import { GraphMap } from "@/components/graph-map";
import { EmptyState, ErrorPanel } from "@/components/work-card";
import { recommendRestorers, traceArtworkPath } from "@/lib/actions";
import type { ArtworkCard, GraphEdge, GraphNode, RestorerHit } from "@/lib/types";

type PathResult = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  hops: number | null;
};

export function PathFinder({
  works,
  initialFrom,
  initialTo,
  initialPath,
}: {
  works: ArtworkCard[];
  initialFrom: string;
  initialTo: string;
  initialPath: PathResult;
}) {
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [path, setPath] = useState(initialPath);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      const result = await traceArtworkPath(from, to);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setError(null);
      setPath(result.data);
    });
  }

  return (
    <section className="flex flex-col gap-6">
      <SectionHead
        kicker="02"
        title="Shortest path between works"
        body="An undirected walk across mixed relationship types. In SQL this is a recursive CTE over a pile of unioned edge tables of unknown depth."
      />
      <form
        onSubmit={onSubmit}
        className="grid gap-3 rounded-2xl border border-line bg-white/40 p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
      >
        <label className="flex flex-col gap-1.5 text-[11px] uppercase tracking-[0.16em] text-muted">
          From
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="field rounded-xl"
          >
            {works.map((w) => (
              <option key={w.id} value={w.id}>
                {w.title}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-[11px] uppercase tracking-[0.16em] text-muted">
          To
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="field rounded-xl"
          >
            {works.map((w) => (
              <option key={w.id} value={w.id}>
                {w.title}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          disabled={pending}
          className="btn-primary h-[42px] w-full px-6 sm:w-auto disabled:opacity-60"
        >
          {pending ? "Tracing…" : "Trace path"}
        </button>
      </form>
      {error ? (
        <ErrorPanel message={error} />
      ) : path.hops == null ? (
        <EmptyState
          title="No path of six hops or fewer"
          body="Pick two works that share a museum, dealer, restorer, or exhibition circuit."
        />
      ) : (
        <div className={`flex flex-col gap-4 ${pending ? "opacity-60" : ""}`}>
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
  );
}

export function RestorerFinder({
  works,
  initialArtwork,
  initialRestorers,
}: {
  works: ArtworkCard[];
  initialArtwork: string;
  initialRestorers: RestorerHit[];
}) {
  const [artwork, setArtwork] = useState(initialArtwork);
  const [restorers, setRestorers] = useState(initialRestorers);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const selectedWork = works.find((w) => w.id === artwork);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      const result = await recommendRestorers(artwork);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setError(null);
      setRestorers(result.data);
    });
  }

  return (
    <section className="flex flex-col gap-6">
      <SectionHead
        kicker="03"
        title="Workshop recommendation"
        body="Find restorers who have never treated this object, but sit one or two TRAINED_UNDER hops from someone who has — or from someone who treated a sibling work in the same collection."
      />
      <form
        onSubmit={onSubmit}
        className="grid gap-3 rounded-2xl border border-line bg-white/40 p-4 sm:grid-cols-[1fr_auto] sm:items-end"
      >
        <label className="flex flex-col gap-1.5 text-[11px] uppercase tracking-[0.16em] text-muted">
          Artwork
          <select
            value={artwork}
            onChange={(e) => setArtwork(e.target.value)}
            className="field rounded-xl"
          >
            {works.map((w) => (
              <option key={w.id} value={w.id}>
                {w.title}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          disabled={pending}
          className="btn-primary h-[42px] w-full px-6 sm:w-auto disabled:opacity-60"
        >
          {pending ? "Looking…" : "Recommend"}
        </button>
      </form>
      {error ? (
        <ErrorPanel message={error} />
      ) : restorers.length === 0 ? (
        <EmptyState
          title="No unused workshop cousins"
          body="Try The Azure Recital — its restorer trained under Josef Lang, who also trained Elias Crowe."
          action={{ href: "/works/w-azure", label: "Open The Azure Recital" }}
        />
      ) : (
        <ul
          className={`overflow-hidden rounded-2xl border border-line bg-white/50 ${pending ? "opacity-60" : ""}`}
        >
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

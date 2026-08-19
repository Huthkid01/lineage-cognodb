import Link from "next/link";
import { GraphMap } from "@/components/graph-map";
import { EmptyState, ErrorPanel } from "@/components/work-card";
import { WorkImage } from "@/components/work-image";
import { getArtwork, getNeighborhood } from "@/lib/queries";
import { tryDb } from "@/lib/safe";

export const dynamic = "force-dynamic";

export default async function WorkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await tryDb(() =>
    Promise.all([getArtwork(id), getNeighborhood(id, 2)]),
  );
  if (!result.ok) return <ErrorPanel message={result.message} />;

  const [detail, neighborhood] = result.data;
  if (!detail) {
    return (
      <EmptyState
        title="Work not found"
        body="That id is not in the seed graph."
        action={{ href: "/works", label: "Back to the collection" }}
      />
    );
  }

  const { artwork, artist, provenance } = detail;

  return (
    <div className="flex flex-col gap-12">
      <nav className="text-xs text-muted" aria-label="Breadcrumb">
        <Link href="/works" className="hover:text-ink">
          Collection
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/artists/${artist.id}`} className="hover:text-ink">
          {artist.name}
        </Link>
        <span className="mx-2 hidden sm:inline">/</span>
        <span className="mt-1 block text-ink sm:mt-0 sm:inline">{artwork.title}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-stretch lg:gap-8">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.4rem] shadow-[0_30px_60px_-40px_rgba(26,21,16,0.55)] sm:aspect-[5/4] lg:aspect-auto lg:min-h-[28rem]">
          <WorkImage
            id={artwork.id}
            title={artwork.title}
            palette={artwork.palette}
            imageUrl={artwork.imageUrl}
            className="h-full w-full"
            sizes="(max-width: 1024px) 100vw, 46vw"
            priority
          />
        </div>
        <div className="flex flex-col justify-center py-1">
          {artwork.disputed && (
            <p className="text-[11px] font-medium uppercase tracking-[0.26em] text-flag">
              Disputed title
            </p>
          )}
          <h1 className="mt-2 font-serif text-3xl tracking-tight sm:text-4xl lg:text-[2.7rem]">
            {artwork.title}
          </h1>
          <p className="mt-3 text-sm text-muted sm:text-base">
            <Link href={`/artists/${artist.id}`} className="text-ink underline-offset-4 hover:underline">
              {artist.name}
            </Link>
            <span>
              {" "}
              · {artist.lifespan} · {artwork.year} · {artwork.medium}
            </span>
          </p>
          <p className="mt-5 max-w-xl text-[1.02rem] leading-relaxed text-ink/80">
            {artwork.notes}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={`/investigate?from=${artwork.id}&to=w-harbor`}
              className="btn-primary w-full sm:w-auto"
            >
              Find a path
            </Link>
            <Link
              href={`/investigate?artwork=${artwork.id}`}
              className="btn-ghost w-full sm:w-auto"
            >
              Recommend a restorer
            </Link>
          </div>
        </div>
      </div>

      <section className="rounded-3xl border border-line bg-white/40 px-4 py-6 sm:px-8 sm:py-8">
        <h2 className="font-serif text-2xl tracking-tight">Provenance</h2>
        <p className="mt-1 text-sm text-muted">
          Events in year order — ownership, dealing, loans, exhibitions, restoration.
        </p>
        {provenance.length === 0 ? (
          <p className="mt-6 text-sm text-muted">No events recorded for this work.</p>
        ) : (
          <ol className="mt-6">
            {provenance.map((event, index) => (
              <li key={`${event.kind}-${index}`} className="flex flex-col gap-1 sm:flex-row sm:gap-5">
                <div className="w-auto shrink-0 pt-0.5 text-xs tabular-nums text-muted sm:w-20 sm:text-right">
                  {event.year ?? "—"}
                  {event.until ? `–${event.until}` : ""}
                </div>
                <div className="relative flex-1 border-l border-line pb-6 pl-4 sm:pb-7 sm:pl-5">
                  <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-copper" />
                  <p className="font-medium">
                    {event.href ? (
                      <Link href={event.href} className="hover:text-copper">
                        {event.title}
                      </Link>
                    ) : (
                      event.title
                    )}
                  </p>
                  {event.subtitle && (
                    <p className="mt-0.5 text-sm text-muted">{event.subtitle}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section>
        <div className="mb-4">
          <h2 className="font-serif text-2xl tracking-tight">Two-hop neighborhood</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            Everything within two relationship steps. Rings are hop distance from
            this work. Click a node to open it.
          </p>
        </div>
        <GraphMap
          nodes={neighborhood.nodes}
          edges={neighborhood.edges}
          centerId={neighborhood.centerId}
        />
      </section>
    </div>
  );
}

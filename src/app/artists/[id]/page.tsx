import Link from "next/link";
import { EmptyState, ErrorPanel, WorkCard } from "@/components/work-card";
import { getArtist } from "@/lib/queries";
import { tryDb } from "@/lib/safe";

export const dynamic = "force-dynamic";

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await tryDb(() => getArtist(id));
  if (!result.ok) return <ErrorPanel message={result.message} />;
  const artist = result.data;
  if (!artist) {
    return (
      <EmptyState
        title="Artist not found"
        body="That person is not in the seed graph."
        action={{ href: "/", label: "Back to the collection" }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-copper">Artist</p>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl">{artist.name}</h1>
        <p className="mt-2 text-muted">
          {artist.nationality} · {artist.born}–{artist.died ?? ""} · {artist.movement}
        </p>
        {(artist.mentors.length > 0 || artist.students.length > 0) && (
          <p className="mt-3 text-sm text-muted">
            {artist.mentors.length > 0 && (
              <>
                Studied with{" "}
                {artist.mentors.map((m) => (
                  <Link key={m.id} href={`/artists/${m.id}`} className="text-copper">
                    {m.name}
                  </Link>
                ))}
                {artist.students.length > 0 ? " · " : ""}
              </>
            )}
            {artist.students.length > 0 && (
              <>
                Taught{" "}
                {artist.students.map((s) => (
                  <Link key={s.id} href={`/artists/${s.id}`} className="text-copper">
                    {s.name}
                  </Link>
                ))}
              </>
            )}
          </p>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {artist.works.map((work) => (
          <WorkCard key={work.id} work={work} />
        ))}
      </div>
    </div>
  );
}

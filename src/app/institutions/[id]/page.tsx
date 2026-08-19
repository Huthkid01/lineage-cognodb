import { EmptyState, ErrorPanel, WorkCard } from "@/components/work-card";
import { getInstitution } from "@/lib/queries";
import { tryDb } from "@/lib/safe";

export const dynamic = "force-dynamic";

export default async function InstitutionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await tryDb(() => getInstitution(id));
  if (!result.ok) return <ErrorPanel message={result.message} />;
  const institution = result.data;
  if (!institution) {
    return (
      <EmptyState
        title="Institution not found"
        body="That museum or gallery is not in the seed graph."
        action={{ href: "/works", label: "Back to the collection" }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-copper">
          {institution.kind}
        </p>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl">{institution.name}</h1>
        <p className="mt-2 text-muted">
          {institution.city}, {institution.country}
          {institution.loanCount ? ` · ${institution.loanCount} recorded loans` : ""}
        </p>
      </div>
      {institution.exhibitions.length > 0 && (
        <ul className="flex flex-wrap gap-2 text-sm">
          {institution.exhibitions.map((show) => (
            <li
              key={show.id}
              className="rounded-full border border-line bg-white/40 px-3 py-1"
            >
              {show.name} ({show.year})
            </li>
          ))}
        </ul>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {institution.holdings.map((work) => (
          <WorkCard key={work.id} work={work} />
        ))}
      </div>
    </div>
  );
}

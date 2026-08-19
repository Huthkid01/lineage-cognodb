import Link from "next/link";
import type { ArtworkCard } from "@/lib/types";
import { WorkImage } from "@/components/work-image";

export function WorkCard({ work }: { work: ArtworkCard }) {
  return (
    <Link
      href={`/works/${work.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white/50 shadow-[0_1px_0_rgba(26,21,16,0.04)] transition duration-200 hover:-translate-y-1 hover:border-ink/18 hover:shadow-[0_22px_44px_-28px_rgba(26,21,16,0.5)]"
    >
      <div className="relative h-48 overflow-hidden sm:h-44">
        <WorkImage
          id={work.id}
          title={work.title}
          palette={work.palette}
          imageUrl={work.imageUrl}
          className="h-full w-full"
        />
        {work.disputed && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-flag px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-paper">
            Disputed
          </span>
        )}
        <span className="absolute bottom-3 right-3 z-10 font-serif text-sm text-paper">
          {work.year}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 px-4 py-4">
        <p className="font-serif text-[1.15rem] leading-snug transition-colors group-hover:text-copper">
          {work.title}
        </p>
        <p className="text-sm text-muted">{work.artistName}</p>
        <p className="mt-auto pt-3 text-[11px] uppercase tracking-[0.16em] text-muted">
          {work.medium}
        </p>
      </div>
    </Link>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-white/30 px-5 py-12 text-center sm:px-6 sm:py-16">
      <p className="font-serif text-2xl">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">{body}</p>
      {action && (
        <Link href={action.href} className="btn-ghost mt-5">
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function ErrorPanel({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-flag/25 bg-[rgba(154,47,42,0.06)] px-5 py-5"
    >
      <p className="font-medium text-flag">Cannot reach the graph database</p>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{message}</p>
      <p className="mt-3 text-xs text-muted">
        Check that your CognoDB instance is running and that{" "}
        <code className="font-mono text-ink">COGNODB_URI</code> /{" "}
        <code className="font-mono text-ink">COGNODB_PASSWORD</code> are set.
      </p>
    </div>
  );
}

import type { ReactNode } from "react";

export function PageHeader({
  kicker,
  title,
  lede,
}: {
  kicker?: string;
  title: string;
  lede?: string;
}) {
  return (
    <header className="max-w-3xl">
      {kicker && (
        <p className="text-[11px] uppercase tracking-[0.25em] text-copper">{kicker}</p>
      )}
      <h1 className={`font-serif text-3xl tracking-tight sm:text-4xl ${kicker ? "mt-2" : ""}`}>
        {title}
      </h1>
      {lede && <p className="mt-3 leading-relaxed text-muted">{lede}</p>}
    </header>
  );
}

export function SectionTitle({
  title,
  lede,
  action,
}: {
  title: string;
  lede?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="font-serif text-2xl tracking-tight sm:text-3xl">{title}</h2>
        {lede && <p className="mt-1 text-sm text-muted">{lede}</p>}
      </div>
      {action}
    </div>
  );
}

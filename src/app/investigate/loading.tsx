export default function InvestigateLoading() {
  return (
    <div className="animate-pulse space-y-8" aria-busy="true">
      <div className="h-10 w-48 rounded-full bg-ink/10" />
      <div className="h-24 rounded-2xl bg-ink/6" />
      <p className="text-sm text-muted">Loading investigations…</p>
    </div>
  );
}

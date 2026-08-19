export default function Loading() {
  return (
    <div className="animate-pulse space-y-8" aria-busy="true" aria-live="polite">
      <div className="space-y-3">
        <div className="h-3 w-28 rounded-full bg-ink/10" />
        <div className="h-12 w-2/3 rounded-full bg-ink/10" />
        <div className="h-4 w-1/2 rounded-full bg-ink/8" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <div className="h-24 rounded-2xl bg-ink/6" />
        <div className="h-24 rounded-2xl bg-ink/6" />
        <div className="h-24 rounded-2xl bg-ink/6" />
        <div className="h-24 rounded-2xl bg-ink/6" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="h-64 rounded-2xl bg-ink/6" />
        <div className="h-64 rounded-2xl bg-ink/6" />
        <div className="h-64 rounded-2xl bg-ink/6" />
        <div className="h-64 rounded-2xl bg-ink/6" />
      </div>
      <p className="text-sm text-muted">Loading the graph…</p>
    </div>
  );
}

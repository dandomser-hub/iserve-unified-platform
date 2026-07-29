export function RouteLoadingFallback() {
  return (
    <div
      className="min-h-[40vh] flex items-center justify-center px-6"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-forest/30 border-t-forest" />
        <span className="text-sm font-medium text-slate-600">Loading workspace…</span>
      </div>
    </div>
  );
}

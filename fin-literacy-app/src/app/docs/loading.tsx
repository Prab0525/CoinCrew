export default function Loading() {
  return (
    <div className="min-h-[60vh] w-full rounded-2xl border border-white/10 bg-black/20 p-6">
      <div className="h-6 w-44 animate-pulse rounded bg-white/10" />
      <div className="mt-4 h-4 w-80 animate-pulse rounded bg-white/10" />
      <div className="mt-8 h-[420px] w-full animate-pulse rounded-2xl bg-white/10" />
    </div>
  );
}

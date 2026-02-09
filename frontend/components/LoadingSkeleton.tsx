export function LoadingSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-zinc-800/50 ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

export function ChatMessageSkeleton() {
  return (
    <div className="space-y-3">
      <LoadingSkeleton className="h-16 w-[85%]" />
      <LoadingSkeleton className="ml-auto h-12 w-[75%]" />
      <LoadingSkeleton className="h-20 w-[85%]" />
    </div>
  );
}

export function RecommendationSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-3"
        >
          <LoadingSkeleton className="mb-2 h-4 w-3/4" />
          <LoadingSkeleton className="mb-2 h-3 w-1/2" />
          <LoadingSkeleton className="h-12 w-full" />
        </div>
      ))}
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <LoadingSkeleton className="mb-2 h-4 w-24" />
          <LoadingSkeleton className="h-10 w-full" />
        </div>
        <div>
          <LoadingSkeleton className="mb-2 h-4 w-24" />
          <LoadingSkeleton className="h-10 w-full" />
        </div>
      </div>
      <LoadingSkeleton className="h-10 w-32 ml-auto" />
    </div>
  );
}

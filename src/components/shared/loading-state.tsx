import { Building2, LoaderCircle } from "lucide-react";
import { cn } from "cn";
import { Skeleton } from "@/components/ui/skeleton";

interface BrandedLoaderProps {
  message?: string;
  className?: string;
}

export function BrandedLoader({
  message = "Loading your next creative space...",
  className,
}: BrandedLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex min-h-[calc(100vh-5rem)] items-center justify-center bg-[#09090B] px-4",
        className
      )}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="relative grid size-14 place-items-center rounded-2xl border border-amber-400/30 bg-amber-400/10">
          <Building2 aria-hidden="true" className="size-7 text-amber-400" />
          <LoaderCircle
            aria-hidden="true"
            className="absolute -right-1 -top-1 size-5 animate-spin text-amber-300"
          />
        </span>
        <span>
          <span className="block text-sm font-semibold text-white">StudioSpace</span>
          <span className="mt-1 block text-xs text-zinc-400">{message}</span>
        </span>
      </div>
    </div>
  );
}

interface StudioCardSkeletonGridProps {
  count?: number;
  className?: string;
}

export function StudioCardSkeletonGrid({
  count = 6,
  className,
}: StudioCardSkeletonGridProps) {
  return (
    <div
      role="status"
      aria-label="Loading studios"
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      <span className="sr-only">Loading studios...</span>
      {Array.from({ length: count }, (_, index) => (
        <article
          key={index}
          aria-hidden="true"
          className="overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/80"
        >
          <Skeleton className="h-52 w-full rounded-none bg-white/[0.06]" />
          <div className="space-y-4 p-5">
            <Skeleton className="h-3 w-2/5 bg-white/[0.06]" />
            <Skeleton className="h-5 w-3/4 bg-white/[0.06]" />
            <div className="flex items-center justify-between border-t border-white/[0.06] pt-4">
              <Skeleton className="h-8 w-20 bg-white/[0.06]" />
              <Skeleton className="h-9 w-28 rounded-xl bg-white/[0.06]" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

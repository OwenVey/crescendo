import { Skeleton } from '@/components/ui/skeleton';

export default function TrackGridLoading() {
  return (
    // <div className="grid grid-cols-[repeat(auto-fill,var(--card-width))] justify-between gap-8 overflow-y-auto p-8">
    <div className="flex flex-wrap gap-8 overflow-y-auto p-8">
      {[...Array(50)].map((_, index) => (
        <TrackCardSkeleton key={index} />
      ))}
    </div>
  );
}

function TrackCardSkeleton() {
  return (
    <div className="w-[--card-width]">
      <Skeleton className="aspect-square w-full rounded-2xl" />
      <Skeleton className="mt-2 h-5 w-full" />
      <Skeleton className="mt-1 h-4 w-3/4" />
    </div>
  );
}

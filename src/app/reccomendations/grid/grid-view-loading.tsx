import { Skeleton } from '@/components/ui/skeleton';

export function GridViewLoading() {
  return (
    // <div className="flex flex-wrap gap-8 overflow-y-auto p-8">
    <div className="grid grid-cols-[repeat(auto-fill,var(--card-width))] justify-around gap-8 overflow-y-auto p-8">
      {[...Array(100)].map((_, index) => (
        <GridTrackItemSkeleton key={index} />
      ))}
    </div>
  );
}

function GridTrackItemSkeleton() {
  return (
    <div className="w-[--card-width]">
      <Skeleton className="aspect-square w-full rounded-2xl" />
      <Skeleton className="mt-2 h-5 w-1/2" />
      <Skeleton className="mt-1 h-4 w-3/4" />
    </div>
  );
}

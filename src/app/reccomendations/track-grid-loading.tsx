import { Skeleton } from '@/components/ui';

export default function TrackGridLoading() {
  return (
    <div className="flex flex-wrap gap-8 overflow-y-auto p-8">
      {[...Array(50)].map((_, index) => (
        <TrackCardSkeleton key={index} />
      ))}
    </div>
  );
}

function TrackCardSkeleton() {
  return (
    <div className="">
      <Skeleton className="h-52 w-52 rounded-2xl" />
      <Skeleton className="mt-2 h-5 w-48" />
      <Skeleton className="mt-1 h-4 w-28" />
    </div>
  );
}

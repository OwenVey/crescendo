import { Skeleton } from '@/components/ui/skeleton';

export function ListViewLoading() {
  return (
    <div className="flex flex-col gap-2 p-8">
      <Skeleton className="mb-[72px] h-10 w-96" />
      {[...Array(100)].map((_, index) => (
        <ListTrackItemSkeleton key={index} />
      ))}
    </div>
  );
}

function ListTrackItemSkeleton() {
  return (
    <div>
      <Skeleton className="h-16 w-full" />
    </div>
  );
}

import { Skeleton } from './ui/skeleton';

export function LoadingArtist() {
  return (
    <div className="flex items-center justify-between rounded-md border border-gray-200 p-1 dark:border-gray-800">
      <div className="flex w-full items-center gap-x-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-3 w-1/2 rounded" />
      </div>
    </div>
  );
}

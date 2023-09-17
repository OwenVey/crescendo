import { Skeleton } from './ui/skeleton';

export function LoadingTrack() {
  return (
    <div className="flex items-center justify-between rounded-md border border-gray-200 p-1 dark:border-gray-800">
      <div className="flex flex-1 items-center gap-x-2 overflow-hidden">
        <Skeleton className="h-8 w-8 rounded" />

        <div className="flex w-full flex-col gap-1 pr-1">
          <Skeleton className="h-3 w-4/5 rounded" />
          <Skeleton className="h-3 w-1/2 rounded" />
        </div>
      </div>
    </div>
  );
}

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function GridViewLoading() {
  return (
    // <div className="flex flex-wrap gap-8 overflow-y-auto p-8">
    <div className="@container">
      <div
        className={cn('grid gap-8 overflow-y-auto p-8', [
          'grid-cols-[repeat(clamp(var(--min-cards,1),var(--cards-global,var(--cards)),var(--max-cards,1)),minmax(0,1fr))]',
          '@xs:[--min-cards:1] @xs:[--cards:2] @xs:[--max-cards:2]',
          '@sm:[--min-cards:1] @sm:[--cards:2] @sm:[--max-cards:3]',
          '@lg:[--min-cards:2] @lg:[--cards:3] @lg:[--max-cards:4]',
          '@2xl:[--min-cards:2] @2xl:[--cards:4] @2xl:[--max-cards:5]',
          '@4xl:[--min-cards:3] @4xl:[--cards:5] @4xl:[--max-cards:6]',
          '@6xl:[--min-cards:3] @6xl:[--cards:6] @6xl:[--max-cards:7]',
          '@8xl:[--min-cards:4] @8xl:[--cards:7] @8xl:[--max-cards:8]',
          '@10xl:[--min-cards:4] @10xl:[--cards:8] @10xl:[--max-cards:9]',
          '@12xl:[--min-cards:4] @12xl:[--cards:9] @12xl:[--max-cards:9]',
        ])}
      >
        {[...Array(100)].map((_, index) => (
          <GridTrackItemSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

function GridTrackItemSkeleton() {
  return (
    <div className="w-full">
      <Skeleton className="aspect-square w-full rounded-2xl" />
      <Skeleton className="mt-2 h-5 w-1/2" />
      <Skeleton className="mt-1 h-4 w-3/4" />
    </div>
  );
}

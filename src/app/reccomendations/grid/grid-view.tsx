'use client';

import { reccomendationsAtom } from '@/app/store';
import { cn } from '@/lib/utils';
import { useAtomValue } from 'jotai';
import { GridTrackItem } from './grid-track-item';

export function GridView() {
  const reccomendations = useAtomValue(reccomendationsAtom);

  return (
    // <div className="flex flex-wrap gap-8 overflow-y-auto p-8">
    <div className="overflow-y-auto p-8 @container">
      <div
        className={cn('grid gap-8', [
          'grid-cols-[repeat(clamp(var(--min-cards,1),var(--cards-global,var(--cards,1)),var(--max-cards,1)),minmax(0,1fr))]',
          '@xs:[--cards:2] @xs:[--max-cards:2] @xs:[--min-cards:1]',
          '@sm:[--cards:2] @sm:[--max-cards:3] @sm:[--min-cards:1]',
          '@lg:[--cards:3] @lg:[--max-cards:4] @lg:[--min-cards:2]',
          '@2xl:[--cards:4] @2xl:[--max-cards:5] @2xl:[--min-cards:2]',
          '@4xl:[--cards:5] @4xl:[--max-cards:6] @4xl:[--min-cards:3]',
          '@6xl:[--cards:6] @6xl:[--max-cards:7] @6xl:[--min-cards:3]',
          '@8xl:[--cards:7] @8xl:[--max-cards:8] @8xl:[--min-cards:4]',
          '@10xl:[--cards:8] @10xl:[--max-cards:9] @10xl:[--min-cards:4]',
          '@12xl:[--cards:9] @12xl:[--max-cards:9] @12xl:[--min-cards:4]',
          // '@xs:bg-teal-300',
          // '@sm:bg-red-300',
          // '@lg:bg-blue-300',
          // '@2xl:bg-orange-300',
          // '@4xl:bg-green-300',
          // '@6xl:bg-yellow-300',
          // '@8xl:bg-purple-300',
          // '@10xl:bg-gray-300',
          // '@12xl:bg-pink-300',
        ])}
      >
        {reccomendations.map((track, index) => (
          <GridTrackItem key={track.id} track={track} index={index} />
        ))}
      </div>
    </div>
  );
}

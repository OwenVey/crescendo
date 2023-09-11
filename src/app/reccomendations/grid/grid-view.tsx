'use client';

import { reccomendationsAtom } from '@/app/store';
import { useAtomValue } from 'jotai';
import { GridTrackItem } from './grid-track-item';

export function GridView() {
  const reccomendations = useAtomValue(reccomendationsAtom);

  return (
    // <div className="grid grid-cols-[repeat(auto-fill,var(--card-width))] justify-between gap-8 overflow-y-auto p-8">
    <div className="flex flex-wrap gap-8 overflow-y-auto p-8">
      {reccomendations.map((track, index) => (
        <GridTrackItem key={track.id} track={track} index={index} />
      ))}
    </div>
  );
}
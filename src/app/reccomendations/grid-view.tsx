'use client';

import { TrackCard } from '@/app/reccomendations/track-card';
import { useStore } from '../store';

export function GridView() {
  const { reccomendations } = useStore(({ reccomendations }) => ({ reccomendations }));

  return (
    // <div className="grid grid-cols-[repeat(auto-fill,var(--card-width))] justify-between gap-8 overflow-y-auto p-8">
    <div className="flex flex-wrap gap-8 overflow-y-auto p-8">
      {reccomendations.map((track, index) => (
        <TrackCard key={track.id} track={track} index={index} />
      ))}
    </div>
  );
}

export const dynamic = 'force-dynamic';

import SpotifyPlayer from '@/components/spotify-player';
import type { PageProps } from '@/types';
import { Suspense } from 'react';
import { TrackGrid } from './track-grid';
import TrackGridLoading from './track-grid-loading';

export default function ReccomendationsPage({ searchParams }: PageProps) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="absolute right-0 top-0 z-10 m-8 rounded-xl border bg-white/75 p-4 text-black backdrop-blur-lg">
        <div className="font-bold underline">searchParams</div>
        <pre className="text-xs">{JSON.stringify(searchParams, null, 2)}</pre>
      </div>

      <Suspense key={JSON.stringify(searchParams)} fallback={<TrackGridLoading />}>
        <TrackGrid searchParams={searchParams} />
      </Suspense>

      <SpotifyPlayer />
    </div>
  );
}

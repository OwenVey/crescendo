export const dynamic = 'force-dynamic';

import SpotifyPlayer from '@/components/spotify-player';
import { TrackAttributesSchema } from '@/lib/constants';
import type { PageProps } from '@/types';
import { Suspense } from 'react';
import { GridViewLoading } from './grid/grid-view-loading';
import { ListViewLoading } from './list/list-view-loading';
import { Recommendations } from './recommendations';
import { TopToolbar } from './top-toolbar';

export default function RecommendationsPage({ searchParams }: PageProps) {
  const trackAttributes = TrackAttributesSchema.parse(searchParams);

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* <div className="absolute right-0 top-0 z-10 m-8 rounded-xl border bg-white/75 p-4 text-black backdrop-blur-lg">
        <div className="font-bold underline">searchParams</div>
        <pre className="text-xs">{JSON.stringify(searchParams, null, 2)}</pre>
      </div> */}

      <TopToolbar view={trackAttributes.view} />

      <Suspense
        key={JSON.stringify(searchParams)}
        fallback={trackAttributes.view === 'grid' ? <GridViewLoading /> : <ListViewLoading />}
      >
        <Recommendations trackAttributes={trackAttributes} />
      </Suspense>

      <SpotifyPlayer />
    </div>
  );
}

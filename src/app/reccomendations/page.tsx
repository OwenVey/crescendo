export const dynamic = 'force-dynamic';

import SpotifyPlayer from '@/components/spotify-player';
import type { PageProps } from '@/types';
import { Suspense } from 'react';
import { z } from 'zod';
import { GridViewLoading } from './grid/grid-view-loading';
import { ListViewLoading } from './list/list-view-loading';
import { Recommendations } from './reccomendations';
import { TopToolbar } from './top-toolbar';

export type Attributes = z.infer<typeof AttributesSchema>;

const AttributesSchema = z.object({
  seed_artists: z
    .union([z.array(z.string()), z.string()])
    .optional()
    .transform((v) => (typeof v === 'string' ? [v] : v))
    .default([]),
  seed_tracks: z
    .union([z.array(z.string()), z.string()])
    .optional()
    .transform((v) => (typeof v === 'string' ? [v] : v))
    .default([]),
  seed_genres: z
    .union([z.array(z.string()), z.string()])
    .optional()
    .transform((v) => (typeof v === 'string' ? [v] : v))
    .default([]),
  min_acousticness: z.coerce.number().optional(),
  target_acousticness: z.coerce.number().optional(),
  max_acousticness: z.coerce.number().optional(),
  min_danceability: z.coerce.number().optional(),
  max_danceability: z.coerce.number().optional(),
  target_danceability: z.coerce.number().optional(),
  min_duration_ms: z.coerce.number().optional(),
  max_duration_ms: z.coerce.number().optional(),
  target_duration_ms: z.coerce.number().optional(),
  min_energy: z.coerce.number().optional(),
  max_energy: z.coerce.number().optional(),
  target_energy: z.coerce.number().optional(),
  min_instrumentalness: z.coerce.number().optional(),
  max_instrumentalness: z.coerce.number().optional(),
  target_instrumentalness: z.coerce.number().optional(),
  min_key: z.coerce.number().optional(),
  max_key: z.coerce.number().optional(),
  target_key: z.coerce.number().optional(),
  min_liveness: z.coerce.number().optional(),
  max_liveness: z.coerce.number().optional(),
  target_liveness: z.coerce.number().optional(),
  min_loudness: z.coerce.number().optional(),
  max_loudness: z.coerce.number().optional(),
  target_loudness: z.coerce.number().optional(),
  min_mode: z.coerce.number().optional(),
  max_mode: z.coerce.number().optional(),
  target_mode: z.coerce.number().optional(),
  min_popularity: z.coerce.number().optional(),
  max_popularity: z.coerce.number().optional(),
  target_popularity: z.coerce.number().optional(),
  min_speechiness: z.coerce.number().optional(),
  max_speechiness: z.coerce.number().optional(),
  target_speechiness: z.coerce.number().optional(),
  min_tempo: z.coerce.number().optional(),
  max_tempo: z.coerce.number().optional(),
  target_tempo: z.coerce.number().optional(),
  min_time_signature: z.coerce.number().optional(),
  max_time_signature: z.coerce.number().optional(),
  target_time_signature: z.coerce.number().optional(),
  min_valence: z.coerce.number().optional(),
  max_valence: z.coerce.number().optional(),
  target_valence: z.coerce.number().optional(),
  view: z.enum(['grid', 'list']).optional().default('grid'),
});

export default function ReccomendationsPage({ searchParams }: PageProps) {
  const attributes = AttributesSchema.parse(searchParams);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* <div className="absolute right-0 top-0 z-10 m-8 rounded-xl border bg-white/75 p-4 text-black backdrop-blur-lg">
        <div className="font-bold underline">searchParams</div>
        <pre className="text-xs">{JSON.stringify(searchParams, null, 2)}</pre>
      </div> */}

      <TopToolbar view={attributes.view} />

      <Suspense
        key={JSON.stringify(searchParams)}
        fallback={attributes.view === 'grid' ? <GridViewLoading /> : <ListViewLoading />}
      >
        <Recommendations attributes={attributes} />
      </Suspense>

      <SpotifyPlayer />
    </div>
  );
}

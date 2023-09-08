import { env } from '@/env.mjs';
import type { SearchParams } from '@/types';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { z } from 'zod';
import { RecommendationsView } from './reccomendations-view';

const SearchParamsSchema = z.object({
  seed_artists: z
    .union([z.array(z.string()), z.string()])
    .optional()
    .transform((v) => (typeof v === 'string' ? [v] : v)),
  seed_tracks: z
    .union([z.array(z.string()), z.string()])
    .optional()
    .transform((v) => (typeof v === 'string' ? [v] : v)),
  seed_genres: z
    .union([z.array(z.string()), z.string()])
    .optional()
    .transform((v) => (typeof v === 'string' ? [v] : v)),
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
});

type RecommendationsProps = {
  searchParams: SearchParams;
};

export async function Recommendations({ searchParams }: RecommendationsProps) {
  const sdk = SpotifyApi.withClientCredentials(env.SPOTIFY_CLIENT_ID, env.SPOTIFY_CLIENT_SECRET);

  const parsedParams = SearchParamsSchema.parse(searchParams);

  const numArtists = parsedParams.seed_artists?.length ?? 0;
  const numTracks = parsedParams.seed_tracks?.length ?? 0;
  const numGenres = parsedParams.seed_genres?.length ?? 0;
  const numSeeds = numArtists + numTracks + numGenres;

  if (numSeeds < 1) {
    throw Error('Must have at least 1 seed between Seed Artists, Seed Tracks, and Seed Genres');
  }

  if (numSeeds > 5) {
    throw Error('Max of 5 seed may be provided in any combination of Seed Artists, Seed Tracks, and Seed Genres');
  }

  await new Promise((resolve) => setTimeout(resolve, 2000));
  const recommendations = await sdk.recommendations.get({
    limit: 100,
    market: 'US',
    ...parsedParams,
  });

  return <RecommendationsView tracks={recommendations.tracks} />;
}

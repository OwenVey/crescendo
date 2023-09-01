import { TrackCard } from '@/components/track-card';
import { Button } from '@/components/ui';
import { env } from '@/env.mjs';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { RotateCcwIcon } from 'lucide-react';
import Link from 'next/link';
import { z } from 'zod';

type PageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

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

export default async function ReccomendationsPage({ searchParams }: PageProps) {
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

  // await new Promise((resolve) => setTimeout(resolve, 2000));
  const recommendations = await sdk.recommendations.get({
    limit: 100,
    market: 'US',
    ...parsedParams,
  });

  if (recommendations.tracks.length === 0)
    return (
      <div className="grid h-full place-items-center">
        <div className="absolute right-0 top-0 z-10 m-8 rounded-xl border bg-white/75 p-4 text-black backdrop-blur-lg">
          <div className="font-bold underline">searchParams</div>
          <pre className="text-xs">{JSON.stringify(searchParams, null, 2)}</pre>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-gray-700 dark:text-gray-400">
            Sorry, we could not find any reccomendations that fit the specified attributes.
          </p>
          <Button className="mt-4" asChild>
            <Link href="/">
              <RotateCcwIcon className="mr-2 h-4 w-4" />
              Restart
            </Link>
          </Button>
        </div>
      </div>
    );

  return (
    <div>
      <div className="absolute right-0 top-0 z-10 m-8 rounded-xl border bg-white/75 p-4 text-black backdrop-blur-lg">
        <div className="font-bold underline">searchParams</div>
        <pre className="text-xs">{JSON.stringify(searchParams, null, 2)}</pre>
      </div>

      <div className="flex flex-wrap gap-8">
        {recommendations.tracks.map((track, index) => (
          <TrackCard key={track.id} track={track} index={index} />
        ))}
      </div>
    </div>
  );
}

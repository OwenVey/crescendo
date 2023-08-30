import { TrackCard } from '@/components/track-card';
import { env } from '@/env.mjs';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';
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
});

export default async function ReccomendationsPage({ searchParams }: PageProps) {
  const sdk = SpotifyApi.withClientCredentials(env.SPOTIFY_CLIENT_ID, env.SPOTIFY_CLIENT_SECRET);

  const { seed_artists, seed_tracks, seed_genres, min_acousticness, target_acousticness, max_acousticness } =
    SearchParamsSchema.parse(searchParams);

  const numArtists = seed_artists?.length ?? 0;
  const numTracks = seed_tracks?.length ?? 0;
  const numGenres = seed_genres?.length ?? 0;
  const numSeeds = numArtists + numTracks + numGenres;

  if (numSeeds < 1) {
    throw Error('Must have at least 1 seed between Seed Artists, Seed Tracks, and Seed Genres');
  }

  if (numSeeds > 5) {
    throw Error('Max of 5 seed may be provided in any combination of Seed Artists, Seed Tracks, and Seed Genres');
  }

  // await new Promise((resolve) => setTimeout(resolve, 2000));
  const recommendations = await sdk.recommendations.get({
    limit: 50,
    market: 'US',
    seed_artists,
    seed_tracks,
    seed_genres,
    min_acousticness,
    target_acousticness,
    max_acousticness,
  });

  return (
    <div>
      <div className="absolute z-10 bg-white/75 backdrop-blur-lg border p-4 rounded-xl right-0 top-0 m-8">
        <div className="font-bold underline">searchParams</div>
        <pre className="text-xs">{JSON.stringify(searchParams, null, 2)}</pre>
      </div>

      <div className="flex flex-wrap gap-8">
        {recommendations.tracks.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}
      </div>
    </div>
  );
}

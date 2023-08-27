import { TrackCard } from '@/components/track-card';
import { env } from '@/env.mjs';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { z } from 'zod';

type PageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const SearchParamsSchema = z.object({
  genres: z.array(z.string()).optional(),
  min_acousticness: z.coerce.number().optional(),
  target_acousticness: z.coerce.number().optional(),
  max_acousticness: z.coerce.number().optional(),
});

export default async function ReccomendationsPage({ searchParams }: PageProps) {
  const sdk = SpotifyApi.withClientCredentials(env.SPOTIFY_CLIENT_ID, env.SPOTIFY_CLIENT_SECRET);

  const { genres, min_acousticness, target_acousticness, max_acousticness } = SearchParamsSchema.parse(searchParams);

  // await new Promise((resolve) => setTimeout(resolve, 2000));
  const recommendations = await sdk.recommendations.get({
    limit: 50,
    market: 'US',
    // seed_artists: ['4NHQUGzhtTLFvgF5SZesLK'],
    seed_tracks: ['0c6xIDDpzE81m2q797ordA'],
    seed_genres: genres,
    min_acousticness,
    target_acousticness,
    max_acousticness,
  });

  return (
    <div>
      <pre className="text-xs">{JSON.stringify(searchParams, null, 2)}</pre>

      <div className="flex flex-wrap gap-4">
        {recommendations.tracks.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}
      </div>
    </div>
  );
}

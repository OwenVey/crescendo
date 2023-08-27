import { env } from '@/env.mjs';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import Image from 'next/image';

type PageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};
export default async function ReccomendationsPage({ searchParams }: PageProps) {
  const sdk = SpotifyApi.withClientCredentials(env.SPOTIFY_CLIENT_ID, env.SPOTIFY_CLIENT_SECRET);
  const recommendations = await sdk.recommendations.get({
    limit: 50,
    // seed_genres: genres,
    market: 'US',
    // seed_artists: ['4NHQUGzhtTLFvgF5SZesLK'],
    seed_tracks: ['0c6xIDDpzE81m2q797ordA'],
    // min_acousticness: searchParams.min_acousticness,
    // max_acousticness: searchParams.max_acousticness,
  });

  return (
    <div>
      <pre className="text-xs">{JSON.stringify(searchParams, null, 2)}</pre>

      <div className="mx-auto flex max-w-lg flex-col gap-y-2">
        {recommendations.tracks.map((track) => (
          <div
            key={track.id}
            className="flex w-full items-center gap-2 rounded-lg border bg-white p-2 shadow-sm dark:border-gray-800 dark:bg-gray-950"
          >
            <Image
              className="rounded"
              src={track.album.images[0].url}
              width={50}
              height={50}
              alt={`Album cover for ${track.name}`}
            />
            <div className="flex w-full items-center justify-between">
              <div>
                <div className="font-semibold">{track.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {track.artists.map((a) => a.name).join(', ')}
                </div>
              </div>
              <div className="mr-2 text-sm font-medium text-gray-600 dark:text-gray-400">{track.popularity}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

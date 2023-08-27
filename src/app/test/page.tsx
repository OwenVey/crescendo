'use client';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui';
import { fetchReccomendations } from '@/app/actions';
import { useCallback, useEffect, useState } from 'react';
import type { Track } from '@spotify/web-api-ts-sdk';
import Image from 'next/image';

export default function Home() {
  const { data: session, status } = useSession({ required: true });
  const [recommendations, setRecommendations] = useState<Array<Track>>([]);
  const [genres, setGenres] = useState<Array<string>>([]);

  const getReccomendations = useCallback(async () => {
    if (genres.length === 0) return;
    const recs = await fetchReccomendations();
    setRecommendations(recs.tracks);
  }, [genres]);

  useEffect(() => {
    getReccomendations();
  }, [genres, getReccomendations]);

  if (status === 'loading') return <div>Loading...</div>;
  if (!session) return <div className="mt-24 text-center">Please sign in</div>;

  return (
    <main className="mx-auto mt-10 flex max-w-7xl flex-col px-4">
      <div>Signed in!</div>
      <pre className="text-xs">{JSON.stringify(session, null, 2)}</pre>

      <Button className="my-4" onClick={() => getReccomendations()}>
        Get Reccomendations
      </Button>

      <div className="mx-auto flex max-w-lg flex-col gap-y-2">
        {recommendations.map((track) => (
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
              <div className="mr-2 text-sm font-medium text-gray-600 dark:text-gray-400">{track.available_markets}</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

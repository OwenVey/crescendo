'use client';

import { Button } from '@/components/ui/button';
import type { Track } from '@spotify/web-api-ts-sdk';
import { RotateCcwIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { useStore } from '../store';
import { GridView } from './grid-view';
import { ListView } from './list-view';

type RecommendationsProps = {
  tracks: Array<Track>;
};

export function RecommendationsView({ tracks }: RecommendationsProps) {
  const { reccomendations, updateReccomendations, view } = useStore(
    ({ reccomendations, updateReccomendations, view }) => ({ reccomendations, updateReccomendations, view }),
  );

  useEffect(() => updateReccomendations(tracks), [tracks, updateReccomendations]);

  if (reccomendations.length === 0) {
    return (
      <div className="grid h-full place-items-center">
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
  }

  return view === 'grid' ? <GridView /> : <ListView />;
}

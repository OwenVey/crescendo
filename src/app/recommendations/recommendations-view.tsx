'use client';

import { recommendationsAtom } from '@/app/store';
import { Button } from '@/components/ui/button';
import type { Track } from '@spotify/web-api-ts-sdk';
import { useSetAtom } from 'jotai';
import { RotateCcwIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { GridView } from './grid/grid-view';
import { ListView } from './list/list-view';

type RecommendationsProps = {
  tracks: Array<Track>;
  view: 'grid' | 'list';
};

export function RecommendationsView({ tracks, view }: RecommendationsProps) {
  const setRecommendations = useSetAtom(recommendationsAtom);
  useEffect(() => setRecommendations(tracks), [setRecommendations, tracks]);

  if (tracks.length === 0) {
    return (
      <div className="grid h-full place-items-center">
        <div className="flex flex-col items-center">
          <p className="text-gray-700 dark:text-gray-400">
            Sorry, we could not find any recommendations that fit the specified attributes.
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

  return view === 'list' ? <ListView tracks={tracks} /> : <GridView tracks={tracks} />;
}

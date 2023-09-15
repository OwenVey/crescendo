import { Button } from '@/components/ui/button';
import type { Artist } from '@spotify/web-api-ts-sdk';
import { XIcon } from 'lucide-react';
import Image from 'next/image';

type SelectedArtistProps = {
  artist: Artist;
  remove: (artist: Artist) => void;
};

export function SelectedArtist({ artist, remove }: SelectedArtistProps) {
  return (
    <div
      key={artist.id}
      className="flex items-center justify-between rounded-md border border-gray-200 p-1 dark:border-gray-800"
    >
      <div className="flex items-center gap-x-2">
        {artist.images[0] ? (
          <Image
            className="h-6 w-6 rounded-full"
            width={32}
            height={32}
            src={artist.images[0].url}
            alt={`Picture of ${artist.name}`}
          />
        ) : (
          <span className="inline-block h-8 w-8 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-600">
            <svg className="h-full w-full text-gray-300 dark:text-gray-800" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </span>
        )}

        <span className="line-clamp-1 text-xs">{artist.name}</span>
      </div>

      <Button onClick={() => remove(artist)} variant="ghost" size="icon" className="h-5 w-5 rounded-full">
        <XIcon className="h-3 w-3" />
      </Button>
    </div>
  );
}

import { Button } from '@/components/ui/button';
import type { Track } from '@spotify/web-api-ts-sdk';
import { XIcon } from 'lucide-react';
import Image from 'next/image';

type SelectedTrackProps = {
  track: Track;
  remove: (track: Track) => void;
};

export function SelectedTrack({ track, remove }: SelectedTrackProps) {
  return (
    <div
      key={track.id}
      className="flex items-center justify-between rounded-md border border-gray-200 p-1 dark:border-gray-800"
    >
      <div className="flex flex-1 items-center gap-x-2 overflow-hidden">
        <Image
          className="h-8 w-8 rounded"
          width={32}
          height={32}
          src={track.album.images[0].url}
          alt={`Picture of the album "${track.album.name}"`}
          unoptimized
        />

        <div className="pr-1">
          <div className="line-clamp-1 text-xs">{track.name}</div>
          <div className="line-clamp-1 text-xs text-gray-600 dark:text-gray-400">{track.artists[0].name}</div>
        </div>
      </div>

      <Button onClick={() => remove(track)} variant="ghost" size="icon" className="h-5 w-5 rounded-full">
        <XIcon className="h-3 w-3" />
      </Button>
    </div>
  );
}

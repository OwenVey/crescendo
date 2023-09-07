'use client';

import vinylRecordDarkImg from '@/app/images/vinyl-record-dark.webp';
import vinylRecordImg from '@/app/images/vinyl-record.webp';
import { AudioWave } from '@/components/audio-wave';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSpotifyPlayer } from '@/lib/hooks/useSpotifyPlayer';
import { cn } from '@/lib/utils';
import type { Track } from '@spotify/web-api-ts-sdk';
import { AnimatePresence, motion } from 'framer-motion';
import { HeartIcon, InfoIcon, ListEndIcon, MoreVerticalIcon, PauseIcon, PlayIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useState } from 'react';

type TrackCardProps = {
  track: Track;
  index: number;
};

export function TrackCard({ track, index }: TrackCardProps) {
  const { player, playTrack, currentTrack, playbackState } = useSpotifyPlayer();
  const [imageLoading, setImageLoading] = useState(true);
  const { resolvedTheme } = useTheme();
  const isCurrentTrack = track.id === currentTrack?.id;

  return (
    <div className="group">
      <button
        className="relative block overflow-hidden rounded-2xl"
        onClick={() => (isCurrentTrack ? player?.togglePlay() : playTrack(track))}
      >
        <div
          className={cn(
            'absolute inset-0 grid place-items-center bg-black/50 text-white backdrop-blur-sm transition-opacity hover:opacity-100',
            isCurrentTrack ? 'opacity-100' : 'opacity-0',
          )}
        >
          {playbackState?.paused || !isCurrentTrack ? (
            <PlayIcon className="h-6 w-6" fill="white" strokeWidth={0} />
          ) : (
            <PauseIcon className="h-6 w-6" fill="white" strokeWidth={0} />
          )}
          <AnimatePresence>
            {isCurrentTrack && !playbackState?.paused && <AudioWave className="absolute mt-24 h-12 w-12 text-white" />}
          </AnimatePresence>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: imageLoading ? 0 : 1 }}>
          <Image
            className="h-52 w-52"
            src={
              track.album.images[0]
                ? track.album.images[0].url
                : resolvedTheme === 'dark'
                ? vinylRecordDarkImg
                : vinylRecordImg
            }
            width={208}
            height={208}
            alt={`Album cover for ${track.name}`}
            onLoad={() => setImageLoading(false)}
            // unoptimized
          />
        </motion.div>
      </button>

      <div className="mt-1 flex w-52 items-center justify-between">
        <div className="overflow-hidden text-left">
          <div className="truncate font-medium">{track.name}</div>

          <div className="flex items-center truncate">
            {track.explicit && (
              <span className="mr-1 grid h-4 w-4 place-items-center rounded bg-gray-300 text-[10px] dark:bg-gray-700">
                E
              </span>
            )}
            <span className="truncate text-sm text-gray-600 dark:text-gray-400">
              {track.artists.map((a) => a.name).join(', ')}
            </span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="-mr-1 text-gray-500 opacity-0 transition-colors hover:text-gray-950 group-hover:opacity-100 data-[state=open]:opacity-100 dark:text-gray-500 dark:hover:text-gray-200">
            <MoreVerticalIcon className="h-5 w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => console.log('Add to liked songs')}>
              <HeartIcon className="mr-2 h-4 w-4" />
              Add to liked songs
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => console.log('Add to queue')}>
              <ListEndIcon className="mr-2 h-4 w-4" />
              Add to queue
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => console.log('View audio features')}>
              <InfoIcon className="mr-2 h-4 w-4" />
              View audio features
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

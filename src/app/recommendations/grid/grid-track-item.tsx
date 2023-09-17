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
import { HeartIcon, InfoIcon, MoreVerticalIcon, PauseIcon, PlayIcon, RadioIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { AudioFeaturesModal } from '../audio-features-modal';

type GridTrackItemProps = {
  track: Track;
  index: number;
};

export function GridTrackItem({ track, index }: GridTrackItemProps) {
  const { player, playTrack, currentTrack, playbackState } = useSpotifyPlayer();
  const [imageLoading, setImageLoading] = useState(true);
  const { resolvedTheme } = useTheme();
  const isCurrentTrack = track.id === currentTrack?.id;
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div className="group">
      <button
        className="relative block w-full overflow-hidden rounded-2xl"
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
            {isCurrentTrack && !playbackState?.paused && (
              <div className="absolute mt-24">
                <AudioWave className="h-12 w-12 text-white" />
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="bg-gray-300/60 dark:bg-gray-800/60">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: imageLoading ? 0 : 1 }}>
            <Image
              className="aspect-square h-auto w-full"
              src={
                track.album.images[1]
                  ? track.album.images[1].url
                  : resolvedTheme === 'dark'
                  ? vinylRecordDarkImg
                  : vinylRecordImg
              }
              width={300}
              height={300}
              alt={`Album cover for ${track.name}`}
              onLoad={() => setImageLoading(false)}
              unoptimized
            />
          </motion.div>
        </div>
      </button>

      <div className="mt-1 flex w-full items-center justify-between">
        <div className="text-left">
          <div className="line-clamp-1 font-medium">{track.name}</div>

          <div className="flex items-center">
            {track.explicit && (
              <span className="mr-1 grid h-4 w-4 shrink-0 place-items-center rounded bg-gray-300 text-[10px] dark:bg-gray-700">
                E
              </span>
            )}
            <span className="line-clamp-1 text-sm text-gray-600 dark:text-gray-400">
              {track.artists.map((a) => a.name).join(', ')}
            </span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            ref={triggerRef}
            className="-mr-1 text-gray-500 opacity-100 transition-colors hover:text-gray-950 group-hover:opacity-100 data-[state=open]:opacity-100 dark:text-gray-500 dark:hover:text-gray-200 md:opacity-0"
          >
            <MoreVerticalIcon className="h-5 w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => console.log('Add to liked songs')}>
              <HeartIcon className="mr-2 h-4 w-4" />
              Add to liked songs
            </DropdownMenuItem>
            {/* <DropdownMenuItem onSelect={() => console.log('Add to queue')}>
              <ListEndIcon className="mr-2 h-4 w-4" />
              Add to queue
            </DropdownMenuItem> */}
            <AudioFeaturesModal track={track}>
              <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                <InfoIcon className="mr-2 h-4 w-4" />
                View audio features
              </DropdownMenuItem>
            </AudioFeaturesModal>

            <DropdownMenuItem asChild>
              <Link href={{ pathname: '/recommendations', query: { seed_tracks: track.id } }}>
                <RadioIcon className="mr-2 h-4 w-4" />
                Similar recommendations
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

'use client';

import vinylRecordDarkImg from '@/app/images/vinyl-record-dark.webp';
import vinylRecordImg from '@/app/images/vinyl-record.webp';
import { useSpotifyPlayer } from '@/lib/hooks/useSpotifyPlayer';
import { cn } from '@/lib/utils';
import type { Track } from '@spotify/web-api-ts-sdk';
import { AnimatePresence, motion } from 'framer-motion';
import { PauseIcon, PlayIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { AudioWave } from './audio-wave';

type TrackCardProps = {
  track: Track;
  index: number;
};

export function TrackCard({ track, index }: TrackCardProps) {
  const { player, playTrack, currentTrack, playbackState } = useSpotifyPlayer();
  const { resolvedTheme } = useTheme();
  const isCurrentTrack = track.id === currentTrack?.id;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <button
        className="relative block overflow-hidden rounded-2xl"
        onClick={() => (isCurrentTrack ? player?.togglePlay() : playTrack(track.uri))}
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
          unoptimized
        />
      </button>
      <div className="mt-1 w-52 text-left">
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
    </motion.div>
  );
}

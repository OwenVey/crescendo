'use client';

import { useSpotifyPlayer } from '@/lib/hooks/useSpotifyPlayer';
import type { Track } from '@spotify/web-api-ts-sdk';
import { AnimatePresence, motion } from 'framer-motion';
import { AudioWave } from './audio-wave';

type TrackCardProps = {
  track: Track;
  index: number;
};

export function TrackCard({ track, index }: TrackCardProps) {
  const { playTrack, currentTrack } = useSpotifyPlayer();
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <button onClick={() => playTrack(track.uri)} className="group">
        {track.album.images[0] ? (
          <div className="relative overflow-hidden rounded-2xl">
            <AnimatePresence>
              {track.id === currentTrack?.id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 grid place-items-center bg-black/50 opacity-100 backdrop-blur-sm"
                >
                  <AudioWave className="h-12 w-12 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="h-52 w-52"
              src={track.album.images[1]?.url}
              width={208}
              height={208}
              alt={`Album cover for ${track.name}`}
            />
          </div>
        ) : (
          <div className="h-52 w-52 rounded-2xl bg-red-200">no image</div>
        )}
        <div className="mt-1 w-52 text-left">
          <div className="truncate font-medium">{track.name}</div>
          <div className="truncate text-sm text-gray-600 dark:text-gray-400">
            {track.artists.map((a) => a.name).join(', ')}
          </div>
        </div>
      </button>
    </motion.div>
  );
}

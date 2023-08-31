'use client';

import type { Track } from '@spotify/web-api-ts-sdk';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { SpotifyLogo } from './spotify-logo';

type TrackCardProps = {
  track: Track;
  index: number;
};

export function TrackCard({ track, index }: TrackCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Link href={track.uri} className="group">
        {track.album.images[0] ? (
          <div className="relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 grid place-items-center bg-black/0 opacity-0 transition-all group-hover:bg-black/50 group-hover:opacity-100 group-hover:backdrop-blur-sm">
              <SpotifyLogo className="h-10 w-10 text-white" />
            </div>
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
        <div className="mt-1 w-52">
          <div className="text truncate font-medium">{track.name}</div>
          <div className="truncate text-sm text-gray-500 dark:text-gray-400">
            {track.artists.map((a) => a.name).join(', ')}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

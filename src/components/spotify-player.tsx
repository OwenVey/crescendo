'use client';

import { Button, Slider } from '@/components/ui';
import { useSpotifyPlayer } from '@/lib/hooks/useSpotifyPlayer';
import { millisecondsToMmSs } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
  HeartIcon,
  PauseIcon,
  PlayIcon,
  SkipBackIcon,
  SkipForwardIcon,
  Volume1Icon,
  Volume2Icon,
  VolumeIcon,
  VolumeXIcon,
} from 'lucide-react';
import Image from 'next/image';

export default function SpotifyPlayer() {
  const {
    player,
    currentTrack,
    playbackState,
    togglePlay,
    volume,
    setVolume,
    seek,
    position,
    setPosition,
    toggleSaveCurrentTrack,
    isCurrentTrackSaved,
  } = useSpotifyPlayer();

  function getVolumeIcon() {
    if (volume === 0) {
      return <VolumeXIcon className="h-5 w-5" />;
    } else if (volume <= 0.33) {
      return <VolumeIcon className="h-5 w-5" />;
    } else if (volume <= 0.66) {
      return <Volume1Icon className="h-5 w-5" />;
    } else {
      return <Volume2Icon className="h-5 w-5" />;
    }
  }

  function toggleMute() {
    if (volume > 0) {
      setVolume(0);
    } else {
      setVolume(0.5);
    }
  }

  return (
    <AnimatePresence>
      {player && currentTrack && (
        <motion.div
          initial={{ y: 64 }}
          animate={{ y: 0 }}
          exit={{ y: 64 }}
          // transition={{ duration: 3 }}
          className="z-50 flex h-auto flex-shrink-0 items-center justify-center border-t border-gray-200 bg-white px-2 py-2 dark:border-gray-800 dark:bg-gray-950 md:h-16 md:py-0"
        >
          <div className="flex w-full items-center justify-between">
            <div className="flex w-full items-center md:w-auto">
              <Image
                className="h-16 w-auto rounded md:h-12"
                width={48}
                height={48}
                src={currentTrack.album.images[0].url}
                alt={`Picture of the album "${currentTrack.album.name}"`}
              />
              <div className="ml-2 w-full">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-base font-medium md:text-sm">{currentTrack.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 md:text-xs">
                      {currentTrack.artists.map(({ name }) => name).join(', ')}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 md:hidden">
                    <Button onClick={toggleSaveCurrentTrack} variant="ghost" size="icon">
                      <HeartIcon className="h-5 w-5" fill={isCurrentTrackSaved ? 'currentColor' : undefined} />
                    </Button>
                    <Button onClick={togglePlay} className="h-8 w-8 rounded-full" variant="ghost" size="icon">
                      {playbackState?.paused ? (
                        <PlayIcon className="h-5 w-5" fill="currentColor" strokeWidth={0} />
                      ) : (
                        <PauseIcon className="h-5 w-5" fill="currentColor" strokeWidth={0} />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon">
                      <SkipForwardIcon className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="mt-1 flex md:hidden">
                  <Slider
                    className="w-full"
                    size="sm"
                    defaultValue={[0]}
                    min={0}
                    max={currentTrack.duration_ms}
                    step={1000}
                    value={[position]}
                    onValueChange={([position]) => setPosition(position)}
                    onValueCommit={(v) => seek(v[0])}
                  />
                  <div className="ml-2 text-sm tabular-nums text-gray-600 dark:text-gray-400">
                    <span>{millisecondsToMmSs(position)}/</span>
                    <span>{millisecondsToMmSs(currentTrack.duration_ms)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden max-w-md flex-grow items-center justify-center gap-2 md:flex">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon">
                  <SkipBackIcon className="h-5 w-5" />
                </Button>
                <Button onClick={togglePlay} className="h-11 w-11 flex-shrink-0 rounded-full" size="icon">
                  {playbackState?.paused ? (
                    <PlayIcon className="h-5 w-5" fill="currentColor" strokeWidth={0} />
                  ) : (
                    <PauseIcon className="h-5 w-5" fill="currentColor" strokeWidth={0} />
                  )}
                </Button>
                <Button variant="ghost" size="icon">
                  <SkipForwardIcon className="h-5 w-5" />
                </Button>
              </div>

              <Slider
                className="w-full"
                size="sm"
                defaultValue={[0]}
                min={0}
                max={currentTrack.duration_ms}
                step={1000}
                value={[position]}
                onValueChange={([position]) => setPosition(position)}
                onValueCommit={(v) => seek(v[0])}
              />
              <div className="text-sm tabular-nums text-gray-600 dark:text-gray-400">
                <span>{millisecondsToMmSs(position)}/</span>
                <span>{millisecondsToMmSs(currentTrack.duration_ms)}</span>
              </div>
            </div>

            <div className="hidden justify-center md:flex">
              <Button onClick={toggleSaveCurrentTrack} variant="ghost" size="icon">
                <HeartIcon className="h-5 w-5" fill={isCurrentTrackSaved ? 'currentColor' : undefined} />
              </Button>
              <Button className="ml-2" onClick={toggleMute} variant="ghost" size="icon">
                {getVolumeIcon()}
              </Button>
              <Slider
                className="w-24"
                size="sm"
                defaultValue={[0.5]}
                min={0}
                max={1}
                step={0.01}
                value={[volume]}
                onValueChange={([volume]) => setVolume(volume)}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

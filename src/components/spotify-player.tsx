'use client';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useSpotifyPlayer } from '@/lib/hooks/useSpotifyPlayer';
import { cn, millisecondsToMmSs } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
  HeartIcon,
  PauseIcon,
  PlayIcon,
  RefreshCwIcon,
  SkipBackIcon,
  SkipForwardIcon,
  Volume1Icon,
  Volume2Icon,
  VolumeIcon,
  VolumeXIcon,
} from 'lucide-react';
import Image from 'next/image';
import { Toggle } from './ui/toggle';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

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
    playPreviousSong,
    playNextSong,
    isAutoPlayEnabled,
    setIsAutoPlayEnabled,
    setIsScrubbing,
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
          transition={{ type: 'spring', bounce: 0, duration: 0.25 }}
          className="z-50 flex h-auto flex-shrink-0 items-center justify-center border-t border-gray-200 bg-white px-2 py-2 shadow-sm-up dark:border-gray-800 dark:bg-gray-950 md:h-16 md:py-0"
        >
          <div className="flex w-full items-center justify-between md:grid md:grid-cols-3">
            <div className="flex w-full items-center md:w-auto">
              <Image
                className="h-14 w-auto rounded md:h-12"
                width={56}
                height={56}
                src={currentTrack.album.images[0].url}
                alt={`Picture of the album "${currentTrack.album.name}"`}
              />
              <div className="ml-2 w-full">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="line-clamp-1 text-base font-medium md:text-sm">{currentTrack.name}</div>
                    <div className="line-clamp-1 text-sm text-gray-600 dark:text-gray-400 md:text-xs">
                      {currentTrack.artists.map(({ name }) => name).join(', ')}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 md:hidden">
                    <Button onClick={toggleSaveCurrentTrack} variant="ghost" size="icon">
                      <HeartIcon className="h-5 w-5" fill={isCurrentTrackSaved ? 'currentColor' : 'none'} />
                    </Button>
                    <Button onClick={togglePlay} className="h-8 w-8 rounded-full" variant="ghost" size="icon">
                      {playbackState?.paused ? (
                        <PlayIcon className="h-5 w-5" fill="currentColor" strokeWidth={0} />
                      ) : (
                        <PauseIcon className="h-5 w-5" fill="currentColor" strokeWidth={0} />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon">
                      <SkipForwardIcon onClick={playNextSong} className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="flex md:hidden">
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
                    onPointerDown={() => setIsScrubbing(true)}
                    onPointerUp={() => setIsScrubbing(false)}
                    thumbVisibility="never"
                    grow
                  />
                  <div className="ml-2 text-sm tabular-nums text-gray-600 dark:text-gray-400">
                    <span>{millisecondsToMmSs(position)}/</span>
                    <span>{millisecondsToMmSs(currentTrack.duration_ms)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden w-full max-w-lg flex-grow items-center justify-center gap-2 justify-self-center md:flex">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon">
                  <SkipBackIcon onClick={playPreviousSong} className="h-5 w-5" />
                </Button>
                <Button onClick={togglePlay} className="flex-shrink-0 rounded-full" size="icon">
                  {playbackState?.paused ? (
                    <PlayIcon className="h-5 w-5" fill="currentColor" strokeWidth={0} />
                  ) : (
                    <PauseIcon className="h-5 w-5" fill="currentColor" strokeWidth={0} />
                  )}
                </Button>
                <Button variant="ghost" size="icon">
                  <SkipForwardIcon onClick={playNextSong} className="h-5 w-5" />
                </Button>
              </div>

              <Slider
                className="min-w-[6rem] flex-1"
                size="sm"
                defaultValue={[0]}
                min={0}
                max={currentTrack.duration_ms}
                step={1000}
                value={[position]}
                onValueChange={([position]) => setPosition(position)}
                onValueCommit={(v) => seek(v[0])}
                onPointerDown={() => setIsScrubbing(true)}
                onPointerUp={() => setIsScrubbing(false)}
                thumbVisibility="never"
                grow
              />
              <div className="text-sm tabular-nums text-gray-600 dark:text-gray-400">
                <span>{millisecondsToMmSs(position)}/</span>
                <span>{millisecondsToMmSs(currentTrack.duration_ms)}</span>
              </div>
            </div>

            <div className="mr-24 hidden items-center justify-end gap-1 md:flex">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Toggle pressed={isAutoPlayEnabled} onPressedChange={setIsAutoPlayEnabled} size="icon">
                      <RefreshCwIcon
                        className={cn('h-5 w-5', isAutoPlayEnabled && 'animate-spin [animation-duration:5s]')}
                      />
                    </Toggle>
                  </div>
                </TooltipTrigger>
                <TooltipContent>{isAutoPlayEnabled ? 'Disable' : 'Enable'} Autoplay</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={toggleSaveCurrentTrack} variant="ghost" size="icon">
                    <HeartIcon className="h-5 w-5" fill={isCurrentTrackSaved ? 'currentColor' : 'none'} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isCurrentTrackSaved ? 'Unlike track' : 'Like track'}</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={toggleMute} variant="ghost" size="icon">
                    {getVolumeIcon()}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Toggle Mute</TooltipContent>
              </Tooltip>

              <Slider
                className="w-24"
                size="sm"
                defaultValue={[0.5]}
                min={0}
                max={1}
                step={0.01}
                value={[volume]}
                onValueChange={([volume]) => setVolume(volume)}
                thumbVisibility="never"
                grow
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

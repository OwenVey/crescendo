import { reccomendationsAtom } from '@/app/store';
import { useToast } from '@/components/ui/use-toast';
import { env } from '@/env.mjs';
import type { AccessToken, Track } from '@spotify/web-api-ts-sdk';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { useAtomValue } from 'jotai';
import { useSession } from 'next-auth/react';
import React, { useCallback, useContext, useEffect, useState } from 'react';

type SpotifyPlayerContextType = {
  player?: Spotify.Player;
  playbackState?: Spotify.PlaybackState;
  togglePlay: () => void;
  playTrack: (track: Track) => void;
  volume: number;
  setVolume: (volume: number) => void;
  position: number;
  setPosition: (position: number) => void;
  seek: (position: number) => void;
  currentTrack?: Spotify.Track;
  toggleSaveCurrentTrack: () => void;
  isCurrentTrackSaved: boolean;
  playPreviousSong: () => void;
  playNextSong: () => void;
  isAutoPlayEnabled: boolean;
  setIsAutoPlayEnabled: (enabled: boolean) => void;
  isScrubbing: boolean;
  setIsScrubbing: (scrubbing: boolean) => void;
};

const SpotifyPlayerContext = React.createContext<SpotifyPlayerContextType | undefined>(undefined);

export const SpotifyPlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const { toast } = useToast();

  const reccomendations = useAtomValue(reccomendationsAtom);

  const [player, setPlayer] = useState<Spotify.Player | undefined>(undefined);
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
  const [playbackState, setPlaybackState] = useState<Spotify.PlaybackState | undefined>(undefined);
  const [volumeState, setVolumeState] = useState(0.5);
  const [position, setPosition] = useState(0);
  const [isCurrentTrackSaved, setIsCurrentTrackSaved] = useState(false);
  const [isAutoPlayEnabled, setIsAutoPlayEnabled] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const currentTrack = playbackState?.track_window.current_track;

  const sdk = SpotifyApi.withAccessToken(env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID, {
    access_token: session?.user.access_token,
  } as AccessToken);

  async function togglePlay() {
    player?.togglePlay();
  }

  const playTrack = useCallback(
    async (track: Track) => {
      if (deviceId) {
        sdk.player.startResumePlayback(deviceId, undefined, [track.uri]);
        const [isSaved] = await sdk.currentUser.tracks.hasSavedTracks([track.id]);
        setIsCurrentTrackSaved(isSaved);
      } else {
        toast({
          title: 'Unable to play track',
          description: 'Ensure that you have authorized your Spotify account in order to listen to songs',
        });
      }
    },
    [deviceId, sdk.currentUser.tracks, sdk.player, toast],
  );

  async function setVolume(volume: number) {
    player?.setVolume(volume);
    setVolumeState(volume);
  }

  async function seek(position: number) {
    await player?.seek(position);
    setPosition(position);
  }

  async function toggleSaveCurrentTrack() {
    if (!currentTrack?.id) return;
    try {
      if (isCurrentTrackSaved) {
        await sdk.currentUser.tracks.removeSavedTracks([currentTrack.id]);
        toast({ description: `Removed "${currentTrack.name}" from your Liked Songs` });
      } else {
        await sdk.currentUser.tracks.saveTracks([currentTrack.id]);
        toast({ description: `Added "${currentTrack.name}" to your Liked Songs` });
      }
      setIsCurrentTrackSaved((prev) => !prev);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Failed to add/remove like', description: error as string });
    }
  }

  const playNextSong = useCallback(() => {
    const currentIndex = reccomendations.findIndex((track) => track.id === currentTrack?.id);
    const nextTrack = reccomendations[currentIndex + 1];
    if (nextTrack) {
      playTrack(nextTrack);
    }
  }, [currentTrack?.id, playTrack, reccomendations]);

  function playPreviousSong() {
    const currentIndex = reccomendations.findIndex((track) => track.id === currentTrack?.id);
    const previousTrack = reccomendations[currentIndex - 1];
    if (previousTrack) {
      playTrack(previousTrack);
    }
  }

  useEffect(() => {
    const id = setInterval(async () => {
      if (currentTrack && !playbackState?.paused) {
        const newPosition = (await player?.getCurrentState())?.position ?? position;

        if (isAutoPlayEnabled && newPosition + 200 >= currentTrack.duration_ms) {
          playNextSong();
        }
        if (!isScrubbing) {
          setPosition(newPosition);
        }
      }
    }, 200);

    return () => {
      clearInterval(id);
    };
  }, [currentTrack, isAutoPlayEnabled, isScrubbing, playNextSong, playbackState?.paused, player, position]);

  useEffect(() => {
    console.log('useEffect');
    if (session?.user.access_token && !player) {
      console.log('TOKEN and NO player exists');

      if (!window.Spotify) {
        console.log('adding spotify-player.js script');

        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;

        document.body.appendChild(script);
      }

      window.onSpotifyWebPlaybackSDKReady = () => {
        const newPlayer = new window.Spotify.Player({
          name: 'Crescendo',
          getOAuthToken: (cb) => cb(session.user.access_token),
          volume: 0.5,
        });

        // Ready
        newPlayer.addListener('ready', async ({ device_id }) => {
          console.log('Ready with Device ID', device_id);
          setDeviceId(device_id);
        });

        // Not Ready
        newPlayer.addListener('not_ready', ({ device_id }) => {
          console.log('Device ID has gone offline', device_id);
        });

        newPlayer.addListener('player_state_changed', (playbackState) => {
          console.log('player_state_changed', playbackState);
          if (!!playbackState) {
            setPlaybackState(playbackState);
            setPosition(playbackState.position);
          }
        });

        newPlayer.addListener('autoplay_failed', () => {
          console.log('Autoplay is not allowed by the browser autoplay rules');
        });

        // Errors
        newPlayer.on('initialization_error', (message) => {
          console.error('Failed to initialize', message);
        });

        newPlayer.on('authentication_error', (message) => {
          console.error('Failed to authenticate', message);
        });

        newPlayer.on('account_error', (message) => {
          console.error('Failed to validate Spotify account', message);
        });

        newPlayer.on('playback_error', (message) => {
          console.error('Failed to perform playback', message);
        });

        newPlayer.connect().then((success) => {
          if (success) {
            console.log('The Web Playback SDK successfully connected to Spotify!');
          } else {
            console.log('Failed to connect');
          }
        });

        setPlayer(newPlayer);
      };
    }
    return () => {
      if (player) {
        console.log('disconnecting player');
        player.disconnect();
      }
    };
  }, [player, session?.user.access_token]);

  return (
    <SpotifyPlayerContext.Provider
      value={{
        player,
        playbackState,
        togglePlay,
        playTrack,
        volume: volumeState,
        setVolume,
        position,
        setPosition,
        seek,
        currentTrack,
        toggleSaveCurrentTrack,
        isCurrentTrackSaved,
        playPreviousSong,
        playNextSong,
        isAutoPlayEnabled,
        setIsAutoPlayEnabled,
        isScrubbing,
        setIsScrubbing,
      }}
    >
      {children}
    </SpotifyPlayerContext.Provider>
  );
};

export const useSpotifyPlayer = () => {
  const context = useContext(SpotifyPlayerContext);
  if (!context) {
    throw new Error('useSpotifyPlayer must be used within a SpotifyPlayerProvider');
  }

  return context;
};

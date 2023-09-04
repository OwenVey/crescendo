import { env } from '@/env.mjs';
import type { AccessToken } from '@spotify/web-api-ts-sdk';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { useSession } from 'next-auth/react';
import React, { useContext, useEffect, useState } from 'react';

type SpotifyPlayerContextType = {
  player: Spotify.Player | null;
  playbackState: Spotify.PlaybackState | null;
  togglePlay: () => void;
  playTrack: (uri: string) => void;
  volume: number;
  setVolume: (volume: number) => void;
  position: number;
  setPosition: (position: number) => void;
  seek: (position: number) => void;
  currentTrack?: Spotify.Track;
  likeCurrentTrack: () => void;
};

const SpotifyPlayerContext = React.createContext<SpotifyPlayerContextType | null>(null);

export const SpotifyPlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [playbackState, setPlaybackState] = useState<Spotify.PlaybackState | null>(null);
  const [volumeState, setVolumeState] = useState(0.5);
  const [position, setPosition] = useState(0);
  const currentTrack = playbackState?.track_window.current_track;

  useEffect(() => {
    const id = setInterval(() => {
      if (currentTrack && !playbackState?.paused) {
        setPosition((oldCount) => oldCount + 1000);
      }
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, [currentTrack, playbackState?.paused]);

  useEffect(() => {
    // const script = document.createElement('script');
    // script.src = 'https://sdk.scdn.co/spotify-player.js';
    // script.async = true;

    // document.body.appendChild(script);
    if (status === 'authenticated' && window.Spotify) {
      console.log('authenticated');

      const newPlayer = new window.Spotify.Player({
        name: 'Crescendo',
        getOAuthToken: (cb) => {
          console.log(session.user.access_token);

          cb(session.user.access_token);
        },
        volume: volumeState,
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
        setPlaybackState(playbackState);
        setPosition(playbackState.position);
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
    }
    return () => {
      player?.disconnect();
    };
  }, [status]);

  const sdk = SpotifyApi.withAccessToken(env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID, {
    access_token: session?.user.access_token,
  } as AccessToken);

  async function togglePlay() {
    player?.togglePlay();
  }

  async function playTrack(uri: string) {
    if (deviceId) {
      sdk.player.startResumePlayback(deviceId, undefined, [uri]);
    }
  }

  function setVolume(volume: number) {
    setVolumeState(volume);
    player?.setVolume(volume);
  }

  function seek(position: number) {
    setPosition(position);
    player?.seek(position);
  }

  function likeCurrentTrack() {
    if (currentTrack?.id) {
      sdk.currentUser.tracks.saveTracks([currentTrack.id]);
    }
  }

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
        likeCurrentTrack,
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

import { useStore } from '@/app/store';
import { useToast } from '@/components/ui/use-toast';
import type { TrackWithSaved } from '@/types';
import { useSession } from 'next-auth/react';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useSpotifySdk } from './useSpotifySdk';

type SpotifyPlayerContextType = {
  player?: Spotify.Player;
  playbackState?: Spotify.PlaybackState;
  togglePlay: () => void;
  playTrack: (track: TrackWithSaved) => void;
  volume: number;
  setVolume: (volume: number) => void;
  position: number;
  setPosition: (position: number) => void;
  seek: (position: number) => Promise<void>;
  currentTrack?: TrackWithSaved;
  toggleSaveCurrentTrack: () => Promise<void>;
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

  const recommendations = useStore(({ recommendations }) => recommendations);
  const toggleSaveTrack = useStore(({ toggleSaveTrack }) => toggleSaveTrack);

  const [player, setPlayer] = useState<Spotify.Player | undefined>(undefined);
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
  const [playbackState, setPlaybackState] = useState<Spotify.PlaybackState | undefined>(undefined);
  const [volumeState, setVolumeState] = useState(0.5);
  const [position, setPosition] = useState(0);
  const [isAutoPlayEnabled, setIsAutoPlayEnabled] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  // const [currentTrack, setCurrentTrack] = useState<TrackWithSaved | undefined>(undefined);
  const currentWindowTrack = playbackState?.track_window.current_track;
  const currentTrack = recommendations.find((r) => r.id === currentWindowTrack?.id);

  const sdk = useSpotifySdk();

  function togglePlay() {
    void player?.togglePlay();
  }

  const playTrack = useCallback(
    (track: TrackWithSaved) => {
      console.log({ deviceId });

      if (deviceId) {
        void sdk.player.startResumePlayback(deviceId, undefined, [track.uri]);
      } else {
        toast({
          title: 'Unable to play track',
          description: 'Ensure that you have authorized your Spotify account in order to listen to songs',
        });
      }
    },
    [deviceId, sdk.player, toast],
  );

  function setVolume(volume: number) {
    void player?.setVolume(volume);
    setVolumeState(volume);
  }

  async function seek(position: number) {
    await player?.seek(position);
    setPosition(position);
  }

  async function toggleSaveCurrentTrack() {
    if (!currentTrack?.id) return;
    try {
      if (currentTrack.isSaved) {
        await sdk.currentUser.tracks.removeSavedTracks([currentTrack.id]);
        toast({ description: `Removed "${currentTrack.name}" from your Liked Songs` });
      } else {
        await sdk.currentUser.tracks.saveTracks([currentTrack.id]);
        toast({ description: `Added "${currentTrack.name}" to your Liked Songs` });
      }

      toggleSaveTrack(currentTrack);
      // setRecommendations(recommendations.map((r) => (r.id === currentTrack.id ? { ...r, isSaved: !r.isSaved } : r)));
    } catch (error) {
      toast({ variant: 'destructive', title: 'Failed to add/remove like', description: error as string });
    }
  }

  const playNextSong = useCallback(() => {
    const currentIndex = recommendations.findIndex((track) => track.id === currentTrack?.id);
    const nextTrack = recommendations[currentIndex + 1];
    if (nextTrack) {
      playTrack(nextTrack);
    }
  }, [currentTrack?.id, playTrack, recommendations]);

  function playPreviousSong() {
    const currentIndex = recommendations.findIndex((track) => track.id === currentTrack?.id);
    const previousTrack = recommendations[currentIndex - 1];
    if (previousTrack) {
      playTrack(previousTrack);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (currentTrack && !playbackState?.paused) {
        const newPosition = (await player?.getCurrentState())?.position ?? position;

        if (isAutoPlayEnabled && newPosition + 200 >= currentTrack.duration_ms) {
          playNextSong();
        }

        if (!isScrubbing) {
          setPosition(newPosition);
        }
      }
    };

    const id = setInterval(() => {
      void fetchData();
    }, 200);

    return () => {
      clearInterval(id);
    };
  }, [currentTrack, isAutoPlayEnabled, isScrubbing, playNextSong, playbackState?.paused, player, position]);

  useEffect(() => {
    if (session?.user.access_token && !player) {
      if (!window.Spotify) {
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
        newPlayer.addListener('ready', ({ device_id }) => {
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

        void newPlayer.connect().then((success) => {
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
      console.log('disconnecting player');
      player?.disconnect();
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

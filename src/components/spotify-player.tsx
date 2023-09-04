'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { SignInButton } from './sign-in-button';

export default function SpotifyPlayer() {
  const { data: session, status } = useSession();
  const [player, setPlayer] = useState<Spotify.Player | undefined>(undefined);

  useEffect(() => {
    // const script = document.createElement('script');
    // script.src = 'https://sdk.scdn.co/spotify-player.js';
    // script.async = true;

    // document.body.appendChild(script);
    console.log('useeffect');

    if (status === 'authenticated') {
      console.log('authenticated');

      const newPlayer = new window.Spotify.Player({
        name: 'Crescendo',
        getOAuthToken: (cb) => {
          console.log(session.user.access_token);

          cb(session.user.access_token);
        },
        volume: 0.2,
      });

      // Ready
      newPlayer.addListener('ready', async ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
      });

      // Not Ready
      newPlayer.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      newPlayer.addListener('player_state_changed', ({ position, duration, track_window: { current_track } }) => {
        console.log('Currently Playing', current_track);
        console.log('Position in Song', position);
        console.log('Duration of Song', duration);
      });

      newPlayer.addListener('autoplay_failed', () => {
        console.log('Autoplay is not allowed by the browser autoplay rules');
      });

      // Errors
      newPlayer.on('initialization_error', ({ message }) => {
        console.error('Failed to initialize', message);
      });

      newPlayer.on('authentication_error', ({ message }) => {
        console.error('Failed to authenticate', message);
      });

      newPlayer.on('account_error', ({ message }) => {
        console.error('Failed to validate Spotify account', message);
      });

      newPlayer.on('playback_error', ({ message }) => {
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

      return () => {
        player?.disconnect();
      };
    }
  }, [status]);

  if (status === 'unauthenticated') return <SignInButton />;

  return (
    <div>
      <div>{status}</div>
      {/* <pre className="text-xs">{JSON.stringify(session, null, 2)}</pre> */}
      <button
        onClick={() => {
          player?.togglePlay();
        }}
      >
        Play
      </button>
    </div>
  );
}

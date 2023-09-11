import { env } from '@/env.mjs';
import type { AccessToken } from '@spotify/web-api-ts-sdk';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { useSession } from 'next-auth/react';

export function useSpotifySdk() {
  const { data: session } = useSession();
  const sdk = SpotifyApi.withAccessToken(env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID, {
    access_token: session?.user.access_token,
  } as AccessToken);

  return sdk;
}

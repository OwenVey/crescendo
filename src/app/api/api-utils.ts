import { env } from '@/env.mjs';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';

export const serverSdk = SpotifyApi.withClientCredentials(env.SPOTIFY_CLIENT_ID, env.SPOTIFY_CLIENT_SECRET);

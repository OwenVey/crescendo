'use server';

import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { env } from '@/env.mjs';

export async function fetchReccomendations() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('No session.');
  // const sdk = SpotifyApi.withAccessToken(env.SPOTIFY_CLIENT_ID, { access_token: session.user.access_token });
  const sdk = SpotifyApi.withClientCredentials(env.SPOTIFY_CLIENT_ID, env.SPOTIFY_CLIENT_SECRET, []);
  const recommendations = await sdk.recommendations.get({
    limit: 50,
    // seed_genres: genres,
    market: 'US',
    seed_artists: ['4NHQUGzhtTLFvgF5SZesLK'],
    // seed_tracks: ['0c6xIDDpzE81m2q797ordA'],
  });
  return recommendations;
}

import { env } from '@/env.mjs';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') ?? '';

  const sdk = SpotifyApi.withClientCredentials(env.SPOTIFY_CLIENT_ID, env.SPOTIFY_CLIENT_SECRET);
  const searchResults = await sdk.search(`artist:${query}`, ['artist'], 'US', 50);
  const artists = searchResults.artists.items;
  artists.sort((a, b) => b.popularity - a.popularity);

  return NextResponse.json(artists);
}

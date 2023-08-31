import { env } from '@/env.mjs';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') ?? '';

  const sdk = SpotifyApi.withClientCredentials(env.SPOTIFY_CLIENT_ID, env.SPOTIFY_CLIENT_SECRET);
  const searchResults = await sdk.search(`track:${query}`, ['track'], 'US', 50);
  const tracks = searchResults.tracks.items;
  tracks.sort((a, b) => b.popularity - a.popularity);

  return NextResponse.json(tracks);
}

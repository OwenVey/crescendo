import { env } from '@/env.mjs';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.getAll('ids') ?? [];

  const sdk = SpotifyApi.withClientCredentials(env.SPOTIFY_CLIENT_ID, env.SPOTIFY_CLIENT_SECRET);
  const tracks = await sdk.tracks.get(ids);
  tracks.sort((a, b) => b.popularity - a.popularity);

  return NextResponse.json(tracks);
}

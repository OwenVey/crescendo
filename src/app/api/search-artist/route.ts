import { NextResponse } from 'next/server';
import { serverSdk } from '../api-utils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') ?? '';

  const searchResults = await serverSdk.search(`artist:${query}`, ['artist'], 'US', 50);
  const artists = searchResults.artists.items;
  artists.sort((a, b) => b.popularity - a.popularity);

  return NextResponse.json(artists);
}

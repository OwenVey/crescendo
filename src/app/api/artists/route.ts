import { NextResponse } from 'next/server';
import { serverSdk } from '../api-utils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.getAll('ids') ?? [];

  const artists = await serverSdk.artists.get(ids);
  artists.sort((a, b) => b.popularity - a.popularity);

  return NextResponse.json(artists);
}

import { NextResponse } from 'next/server';
import { serverSdk } from '../api-utils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.getAll('ids') ?? [];

  const tracks = await serverSdk.tracks.get(ids);
  tracks.sort((a, b) => b.popularity - a.popularity);

  return NextResponse.json(tracks);
}

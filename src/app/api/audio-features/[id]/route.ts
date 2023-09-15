import { NextResponse } from 'next/server';
import { serverSdk } from '../../api-utils';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const audioFeatures = await serverSdk.tracks.audioFeatures(params.id);

  return NextResponse.json(audioFeatures);
}

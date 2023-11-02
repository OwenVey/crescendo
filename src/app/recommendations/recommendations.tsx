import { env } from '@/env.mjs';
import { authOptions } from '@/lib/auth';
import { chunkArray } from '@/lib/utils';
import type { TrackAttributes, TrackWithSaved } from '@/types';
import type { AccessToken } from '@spotify/web-api-ts-sdk';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { isAfter, isBefore } from 'date-fns';
import { getServerSession } from 'next-auth/next';
import { serverSdk } from '../api/api-utils';
import { RecommendationsView } from './recommendations-view';

type RecommendationsProps = {
  trackAttributes: TrackAttributes;
};

export async function Recommendations({ trackAttributes }: RecommendationsProps) {
  const numArtists = trackAttributes.seed_artists.length;
  const numTracks = trackAttributes.seed_tracks.length;
  const numGenres = trackAttributes.seed_genres.length;
  const numSeeds = numArtists + numTracks + numGenres;

  if (numSeeds < 1) {
    throw Error('Must have at least 1 seed between Seed Artists, Seed Tracks, and Seed Genres');
  }

  if (numSeeds > 5) {
    throw Error('Max of 5 seed may be provided in any combination of Seed Artists, Seed Tracks, and Seed Genres');
  }

  // await new Promise((resolve) => setTimeout(resolve, 3000));
  const recommendations = await serverSdk.recommendations.get({
    limit: 100,
    market: 'US',
    ...trackAttributes,
  });
  let tracks: Array<TrackWithSaved> = recommendations.tracks;

  if (tracks.length > 0) {
    const session = await getServerSession(authOptions);
    if (session?.user.access_token) {
      const sdk = SpotifyApi.withAccessToken(env.SPOTIFY_CLIENT_ID, {
        access_token: session.user.access_token,
      } as AccessToken);
      const trackIds = tracks.map((t) => t.id);
      const chunkedIds = chunkArray(trackIds, 50);
      const isSavedPromises = chunkedIds.map((idChunk) => sdk.currentUser.tracks.hasSavedTracks(idChunk));
      const isSaved = (await Promise.all(isSavedPromises)).flat();
      tracks = tracks.map((t, i) => ({ ...t, isSaved: isSaved[i] }));
    }
  }

  if (trackAttributes.released_from) {
    const { released_from } = trackAttributes;
    const utcReleaseFrom = new Date(
      Date.UTC(released_from.getUTCFullYear(), released_from.getUTCMonth(), released_from.getUTCDate()),
    );

    tracks = tracks.filter((track) => !isBefore(new Date(track.album.release_date), utcReleaseFrom));
  }

  if (trackAttributes.released_to) {
    const { released_to } = trackAttributes;
    const utcReleaseTo = new Date(
      Date.UTC(released_to.getUTCFullYear(), released_to.getUTCMonth(), released_to.getUTCDate()),
    );

    tracks = tracks.filter((track) => !isAfter(new Date(track.album.release_date), utcReleaseTo));
  }

  return <RecommendationsView tracks={tracks} view={trackAttributes.view} />;
}

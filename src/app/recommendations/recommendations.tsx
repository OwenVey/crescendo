import type { TrackAttributes } from '@/types';
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

  return <RecommendationsView tracks={recommendations.tracks} view={trackAttributes.view} />;
}

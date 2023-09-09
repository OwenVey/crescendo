import { env } from '@/env.mjs';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import type { Attributes } from './page';
import { RecommendationsView } from './reccomendations-view';

type RecommendationsProps = {
  attributes: Attributes;
};

export async function Recommendations({ attributes }: RecommendationsProps) {
  const sdk = SpotifyApi.withClientCredentials(env.SPOTIFY_CLIENT_ID, env.SPOTIFY_CLIENT_SECRET);

  const numArtists = attributes.seed_artists.length;
  const numTracks = attributes.seed_tracks.length;
  const numGenres = attributes.seed_genres.length;
  const numSeeds = numArtists + numTracks + numGenres;

  if (numSeeds < 1) {
    throw Error('Must have at least 1 seed between Seed Artists, Seed Tracks, and Seed Genres');
  }

  if (numSeeds > 5) {
    throw Error('Max of 5 seed may be provided in any combination of Seed Artists, Seed Tracks, and Seed Genres');
  }

  await new Promise((resolve) => setTimeout(resolve, 2000));
  const recommendations = await sdk.recommendations.get({
    limit: 100,
    market: 'US',
    ...attributes,
  });

  return <RecommendationsView tracks={recommendations.tracks} />;
}

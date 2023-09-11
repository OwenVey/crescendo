import { atomWithSearchParam } from '@/lib/atomWithSearchParam';
import type { Track } from '@spotify/web-api-ts-sdk';
import { atom } from 'jotai';

export const viewAtom = atomWithSearchParam<'grid' | 'list'>('view', 'grid');
export const reccomendationsAtom = atom<Array<Track>>([]);

if (process.env.NODE_ENV !== 'production') {
  viewAtom.debugLabel = 'view';
  reccomendationsAtom.debugLabel = 'reccomendations';
}

import type { Track } from '@spotify/web-api-ts-sdk';
import { atom } from 'jotai';

// export const viewAtom = atomWithSearchParam<'grid' | 'list'>('view', 'grid');
export const recommendationsAtom = atom<Array<Track>>([]);

if (process.env.NODE_ENV !== 'production') {
  // viewAtom.debugLabel = 'view';
  recommendationsAtom.debugLabel = 'recommendations';
}

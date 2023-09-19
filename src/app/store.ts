import type { TrackWithSaved } from '@/types';
import { atom } from 'jotai';

// export const viewAtom = atomWithSearchParam<'grid' | 'list'>('view', 'grid');
export const recommendationsAtom = atom<Array<TrackWithSaved>>([]);
export const hideSavedAtom = atom(false);

if (process.env.NODE_ENV !== 'production') {
  // viewAtom.debugLabel = 'view';
  recommendationsAtom.debugLabel = 'recommendations';
}

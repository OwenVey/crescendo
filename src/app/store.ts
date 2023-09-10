import { atomWithSearchParam } from '@/lib/atomWithSearchParam';
import type { Track } from '@spotify/web-api-ts-sdk';
import { atom } from 'jotai';

export const viewAtom = atomWithSearchParam<'grid' | 'list'>('view', 'grid');
export const reccomendationsAtom = atom<Array<Track>>([]);

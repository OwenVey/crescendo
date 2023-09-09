import { atomWithSearchParam } from '@/lib/atomWithSearchParam';
import type { Track } from '@spotify/web-api-ts-sdk';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// --------------------- Zustand Below --------------------- //
type State = {
  // view: 'grid' | 'list';
  reccomendations: Array<Track>;
};

type Actions = {
  // updateView: (view: State['view']) => void;
  updateReccomendations: (reccomendations: State['reccomendations']) => void;
};

export const useStore = create<State & Actions>()(
  devtools((set) => ({
    // view: 'grid',
    reccomendations: [],
    // updateView: (view) => set({ view }),
    updateReccomendations: (reccomendations) => set({ reccomendations }),
  })),
);
// --------------------- Zustand Above --------------------- //

// --------------------- Jotai Below --------------------- //
export const viewAtom = atomWithSearchParam<'grid' | 'list'>('view', 'grid');
// --------------------- Jotai Above --------------------- //

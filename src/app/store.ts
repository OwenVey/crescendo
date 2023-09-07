import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type State = {
  view: 'grid' | 'list';
};

type Actions = {
  updateView: (view: State['view']) => void;
};

export const useStore = create<State & Actions>()(
  devtools((set) => ({
    view: 'grid',
    updateView: (view) => set({ view }),
  })),
);

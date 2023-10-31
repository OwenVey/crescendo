import type { TrackWithSaved } from '@/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface Store {
  recommendations: Array<TrackWithSaved>;
  hideSaved: boolean;

  setRecommendations: (recommendations: Array<TrackWithSaved>) => void;
  setHideSaved: (hideSaved: boolean) => void;
  toggleSaveTrack: (track: TrackWithSaved) => void;
}

export const useStore = create<Store>()(
  immer(
    devtools((set) => ({
      recommendations: [],
      hideSaved: false,

      setRecommendations: (recommendations) => set({ recommendations }),
      setHideSaved: (hideSaved) => set({ hideSaved }),
      toggleSaveTrack: (track) => {
        set((state) => {
          const trackToUpdate = state.recommendations.find((r) => r.id === track.id);
          if (trackToUpdate) {
            trackToUpdate.isSaved = !trackToUpdate.isSaved;
          }
        });
      },
    })),
  ),
);

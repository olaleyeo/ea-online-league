import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TournamentState {
  currentTournament: any | null;
  unlockedPins: Record<string, string>;
  setTournament: (tournament: any) => void;
  clearTournament: () => void;
  unlockTournament: (tournamentId: string, pin: string) => void;
}

export const useTournamentStore = create<TournamentState>()(
  persist(
    (set) => ({
      currentTournament: null,
      unlockedPins: {},
      setTournament: (tournament) => set({ currentTournament: tournament }),
      clearTournament: () => set({ currentTournament: null }),
      unlockTournament: (id, pin) => set((state) => ({ 
        unlockedPins: { ...state.unlockedPins, [id]: pin } 
      })),
    }),
    {
      name: 'tournament-storage',
      partialize: (state) => ({ unlockedPins: state.unlockedPins }),
    }
  )
);

import { create } from 'zustand';

interface TournamentState {
  currentTournament: any | null;
  setTournament: (tournament: any) => void;
  clearTournament: () => void;
}

export const useTournamentStore = create<TournamentState>((set) => ({
  currentTournament: null,
  setTournament: (tournament) => set({ currentTournament: tournament }),
  clearTournament: () => set({ currentTournament: null }),
}));

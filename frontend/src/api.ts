import axios from 'axios';
import { useTournamentStore } from './store/useTournamentStore';

const api = axios.create({
  baseURL: 'https://ea-online-league.onrender.com/api',
});

api.interceptors.request.use((config) => {
  // Use getState() to access zustand state outside of React
  const state = useTournamentStore.getState();
  const currentTournamentId = state.currentTournament?.id;
  
  if (currentTournamentId && state.unlockedPins[currentTournamentId]) {
    config.headers['X-Admin-Pin'] = state.unlockedPins[currentTournamentId];
  }
  return config;
});

// Export the base api instance so other components can use it directly if needed
export { api };

export const getTournaments = async () => {
  const { data } = await api.get('/tournaments');
  return data;
};

export const createTournament = async (name: string, ownerId: string, adminPin?: string) => {
  const { data } = await api.post('/tournaments', { name, ownerId, adminPin });
  return data;
};

export const addPlayers = async (tournamentId: string, players: any[], adminPin?: string) => {
  const headers = adminPin ? { 'X-Admin-Pin': adminPin } : {};
  const { data } = await api.post(`/tournaments/${tournamentId}/players`, { players }, { headers });
  return data;
};

export const getTournament = async (id: string) => {
  const { data } = await api.get(`/tournaments/${id}`);
  return data;
};

export const generateLeagueFixtures = async (id: string) => {
  const { data } = await api.post(`/tournaments/${id}/fixtures/league-generate`);
  return data;
};

export const getStandings = async (id: string) => {
  const { data } = await api.get(`/tournaments/${id}/standings`);
  return data;
};

export const getFixtures = async (id: string) => {
  const { data } = await api.get(`/tournaments/${id}/fixtures`);
  return data;
};

export const updateKnockoutTie = async (id: string, aggregateHome: number | null, aggregateAway: number | null) => {
  const { data } = await api.patch(`/knockout/${id}`, { aggregateHome, aggregateAway });
  return data;
};

export const progressKnockout = async (tournamentId: string) => {
  const { data } = await api.post(`/tournaments/${tournamentId}/knockout/progress`);
  return data;
};

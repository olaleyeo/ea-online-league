import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
});

// Export the base api instance so other components can use it directly if needed
export { api };

export const getTournaments = async () => {
  const { data } = await api.get('/tournaments');
  return data;
};

export const createTournament = async (name: string, ownerId: string) => {
  const { data } = await api.post('/tournaments', { name, ownerId });
  return data;
};

export const addPlayers = async (tournamentId: string, players: any[]) => {
  const { data } = await api.post(`/tournaments/${tournamentId}/players`, { players });
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

export const updateKnockoutTie = async (id: string, aggregateHome: number, aggregateAway: number) => {
  const { data } = await api.patch(`/knockout/${id}`, { aggregateHome, aggregateAway });
  return data;
};

export const progressKnockout = async (tournamentId: string) => {
  const { data } = await api.post(`/tournaments/${tournamentId}/knockout/progress`);
  return data;
};

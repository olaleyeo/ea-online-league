import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Plus, Loader2 } from 'lucide-react';
import { createTournament, addPlayers } from '../api';
import { useTournamentStore } from '../store/useTournamentStore';

export default function CreateTournamentPage() {
  const navigate = useNavigate();
  const setTournament = useTournamentStore(state => state.setTournament);
  
  const [name, setName] = useState('');
  const [adminPin, setAdminPin] = useState('');
  const [numPlayers, setNumPlayers] = useState(24);
  const [playerNamesRaw, setPlayerNamesRaw] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setLoading(true);
    
    try {
      const tournament = await createTournament(name, 'local-user-id', adminPin);
      if (adminPin) {
        useTournamentStore.getState().unlockTournament(tournament.id, adminPin);
      }
      
      const customNames = playerNamesRaw.split('\n').map(s => s.trim()).filter(Boolean);
      
      const dummyPlayers = Array.from({ length: numPlayers }).map((_, i) => ({
        name: customNames[i] || `Player ${i + 1}`,
        rating: 1000 + Math.floor(Math.random() * 500), 
        pot: Math.floor(i / (numPlayers / 4)) + 1 
      }));
      
      await addPlayers(tournament.id, dummyPlayers);
      setTournament(tournament);
      navigate(`/tournament/${tournament.id}`);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.response?.data?.error || error.message || 'Failed to create tournament. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl">
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-800">
        <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400">
          <Trophy size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold">New Tournament</h1>
          <p className="text-slate-400">Configure your Champions League format</p>
        </div>
      </div>
      
      <form onSubmit={handleCreate} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Tournament Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            placeholder="e.g. EA Summer Cup 2026"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Admin PIN (Optional)</label>
          <input
            type="text"
            value={adminPin}
            onChange={(e) => setAdminPin(e.target.value)}
            placeholder="E.g., 1234 (leave blank for no restriction)"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Number of Players</label>
          <div className="flex items-center gap-4">
            <input
              type="number"
              min={8}
              max={64}
              value={numPlayers}
              onChange={(e) => setNumPlayers(Number(e.target.value))}
              className="w-32 bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <span className="text-slate-400 text-sm">
              {numPlayers < 16 && "(8 advance to Quarter-Finals)"}
              {numPlayers >= 16 && numPlayers < 24 && "(16 advance to Round of 16)"}
              {numPlayers >= 24 && numPlayers < 32 && "(Top 8 bye, Ranks 9-24 play Playoffs)"}
              {numPlayers >= 32 && "(32 advance to Round of 32)"}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Player Names (Optional)</label>
          <textarea
            value={playerNamesRaw}
            onChange={(e) => setPlayerNamesRaw(e.target.value)}
            rows={4}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            placeholder="Paste player names here (one per line)..."
          />
          <p className="text-xs text-slate-500 mt-2">Leave blank to auto-generate names. If you provide fewer names than the player count, the rest will be auto-generated.</p>
        </div>
        
        {errorMsg && (
          <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
            {errorMsg}
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-8"
        >
          {loading ? <Loader2 className="animate-spin" size={24} /> : <Plus size={24} />}
          {loading ? 'Creating...' : 'Create Tournament'}
        </button>
      </form>
    </div>
  );
}

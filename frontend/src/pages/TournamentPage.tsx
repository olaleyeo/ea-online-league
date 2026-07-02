import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getTournament } from '../api';
import { useTournamentStore } from '../store/useTournamentStore';
import LeagueFixtures from '../components/LeagueFixtures';
import LeagueTable from '../components/LeagueTable';
import KnockoutBracket from '../components/KnockoutBracket';
import { LayoutDashboard, Calendar, Trophy } from 'lucide-react';

export default function TournamentPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'fixtures' | 'table' | 'knockout'>('table');
  const [loading, setLoading] = useState(true);
  
  const tournament = useTournamentStore(state => state.currentTournament);
  const setTournament = useTournamentStore(state => state.setTournament);

  useEffect(() => {
    if (id && (!tournament || tournament.id !== id)) {
      getTournament(id).then(data => {
        setTournament(data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [id, tournament, setTournament]);

  if (loading) return <div className="flex justify-center p-12 text-slate-400">Loading tournament data...</div>;
  if (!tournament) return <div className="text-center p-12 text-red-400">Tournament not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-bold">{tournament.name}</h1>
        <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-sm font-semibold border border-indigo-500/30">
          {tournament.status}
        </span>
      </div>

      <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-1 w-max">
        <button
          onClick={() => setActiveTab('table')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${activeTab === 'table' ? 'bg-indigo-600 text-white font-medium shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
        >
          <LayoutDashboard size={18} /> Standings
        </button>
        <button
          onClick={() => setActiveTab('fixtures')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${activeTab === 'fixtures' ? 'bg-indigo-600 text-white font-medium shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
        >
          <Calendar size={18} /> Fixtures
        </button>
        <button
          onClick={() => setActiveTab('knockout')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${activeTab === 'knockout' ? 'bg-indigo-600 text-white font-medium shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
        >
          <Trophy size={18} /> Knockouts
        </button>
      </div>

      <div className="mt-6">
        {activeTab === 'table' && <LeagueTable tournamentId={tournament.id} />}
        {activeTab === 'fixtures' && <LeagueFixtures tournamentId={tournament.id} />}
        {activeTab === 'knockout' && <KnockoutBracket tournamentId={tournament.id} />}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { getFixtures, generateLeagueFixtures, api } from '../api';
import { Zap } from 'lucide-react';

export default function LeagueFixtures({ tournamentId }: { tournamentId: string }) {
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFixtures = async () => {
    setLoading(true);
    try {
      const data = await getFixtures(tournamentId);
      setFixtures(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFixtures();
  }, [tournamentId]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      await generateLeagueFixtures(tournamentId);
      await fetchFixtures();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSimulateAll = async () => {
    // In a real app, you'd call a batch simulation endpoint.
    // For MVP, let's just simulate them one by one.
    setLoading(true);
    const pending = fixtures.filter(f => f.status === 'PENDING');
    
    for (const f of pending) {
      try {
        const { data: score } = await api.post('/ai/simulate-match', {
          rating1: f.homePlayer.rating,
          rating2: f.awayPlayer.rating
        });
        await api.patch(`/fixtures/${f.id}`, {
          homeScore: score.score1,
          awayScore: score.score2
        });
      } catch (err) {
        console.error('Failed to simulate match', err);
      }
    }
    await fetchFixtures();
  };

  const updateScore = async (id: string, homeScoreStr: string | number | null, awayScoreStr: string | number | null) => {
    const hs = parseInt(String(homeScoreStr));
    const as = parseInt(String(awayScoreStr));
    
    if (isNaN(hs) || isNaN(as)) return; // Both must be valid numbers to save
    
    try {
      await api.patch(`/fixtures/${id}`, {
        homeScore: hs,
        awayScore: as
      });
      fetchFixtures();
    } catch (err) {
      console.error('Failed to update score manually', err);
    }
  };

  if (loading) return <div className="text-center p-8 text-slate-400">Loading fixtures...</div>;

  if (fixtures.length === 0) {
    return (
      <div className="text-center py-24 bg-slate-900 border border-slate-800 rounded-xl">
        <h2 className="text-2xl font-bold mb-4">No Fixtures Generated</h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">Click below to auto-generate the 8 league phase matches for each player based on pot seedings.</p>
        <button 
          onClick={handleGenerate}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-bold transition-all shadow-lg shadow-indigo-600/20"
        >
          Generate League Fixtures
        </button>
      </div>
    );
  }

  // Group by matchday
  const matchdays = fixtures.reduce((acc, f) => {
    const md = f.matchday || 1;
    if (!acc[md]) acc[md] = [];
    acc[md].push(f);
    return acc;
  }, {} as Record<number, any[]>);

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <button 
          onClick={handleSimulateAll}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-lg flex items-center gap-2 shadow-lg shadow-purple-500/20"
        >
          <Zap size={18} /> Simulate All Pending
        </button>
      </div>
      
      {Object.keys(matchdays).sort((a, b) => Number(a) - Number(b)).map(md => (
        <div key={md} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="bg-slate-800/50 p-4 border-b border-slate-800">
            <h3 className="font-bold">Matchday {md}</h3>
          </div>
          <div className="divide-y divide-slate-800/50">
            {matchdays[Number(md)].map((f: any) => (
              <div key={f.id} className="p-4 flex items-center justify-between hover:bg-slate-800/20 transition-colors">
                <div className="flex-1 text-right font-medium">{f.homePlayer.name}</div>
                <div className="mx-6 flex items-center justify-center gap-2 px-2 py-1 bg-slate-950 rounded-md border border-slate-800 min-w-[100px]">
                  <input 
                    type="number"
                    min="0"
                    defaultValue={f.homeScore ?? ''}
                    onBlur={(e) => updateScore(f.id, e.target.value, f.awayScore)}
                    className="w-10 bg-transparent text-center font-mono font-bold text-lg focus:outline-none focus:text-indigo-400 placeholder:text-slate-700"
                    placeholder="-"
                  />
                  <span className="text-slate-600 font-bold">-</span>
                  <input 
                    type="number"
                    min="0"
                    defaultValue={f.awayScore ?? ''}
                    onBlur={(e) => updateScore(f.id, f.homeScore, e.target.value)}
                    className="w-10 bg-transparent text-center font-mono font-bold text-lg focus:outline-none focus:text-indigo-400 placeholder:text-slate-700"
                    placeholder="-"
                  />
                </div>
                <div className="flex-1 text-left font-medium">{f.awayPlayer.name}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

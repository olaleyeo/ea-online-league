import { useState, useEffect } from 'react';
import { getTournament, updateKnockoutTie, progressKnockout, api } from '../api';
import WinnerBanner from './WinnerBanner';
import { Loader2 } from 'lucide-react';

export default function KnockoutBracket({ tournamentId }: { tournamentId: string }) {
  const [ties, setTies] = useState<any[]>([]);
  const [tournament, setTournament] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [progressing, setProgressing] = useState(false);

  const fetchTies = async () => {
    try {
      const [{ data }, t] = await Promise.all([
        api.get(`/tournaments/${tournamentId}/knockout`),
        getTournament(tournamentId)
      ]);
      setTies(data);
      setTournament(t);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTies();
  }, [tournamentId]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      await api.post(`/tournaments/${tournamentId}/knockout/generate`);
      await fetchTies();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleUpdateScore = async (id: string, homeScoreStr: string | number | null, awayScoreStr: string | number | null) => {
    const hs = parseInt(String(homeScoreStr));
    const as = parseInt(String(awayScoreStr));
    
    if (isNaN(hs) || isNaN(as)) return;
    
    try {
      await updateKnockoutTie(id, hs, as);
      await fetchTies();
    } catch (err) {
      console.error('Failed to update tie score', err);
    }
  };

  const handleProgress = async () => {
    setProgressing(true);
    try {
      await progressKnockout(tournamentId);
      await fetchTies();
    } catch (err) {
      console.error('Failed to progress bracket', err);
    } finally {
      setProgressing(false);
    }
  };

  if (loading) return <div className="text-center p-8 text-slate-400">Loading bracket...</div>;

  if (ties.length === 0) {
    return (
      <div className="text-center py-24 bg-slate-900 border border-slate-800 rounded-xl">
        <h2 className="text-2xl font-bold mb-4">No Knockout Phase Yet</h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">Ensure the league phase is finished before generating the knockout bracket.</p>
        <button 
          onClick={handleGenerate}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-bold transition-all shadow-lg shadow-indigo-600/20"
        >
          Generate Knockout Phase
        </button>
      </div>
    );
  }

  // Group ties by stage
  const stagesOrder = ['PLAYOFF', 'ROUND_OF_16', 'QUARTER_FINAL', 'SEMI_FINAL', 'FINAL'];
  const groupedTies = stagesOrder.map(stage => ({
    stage,
    matches: ties.filter(t => t.stage === stage)
  })).filter(g => g.matches.length > 0);

  // Find the active stage (the last one generated)
  const activeStage = groupedTies[groupedTies.length - 1];
  const isStageComplete = activeStage.matches.every((t: any) => t.winnerId !== null);
  
  // Find final winner
  const finalTie = ties.find(t => t.stage === 'FINAL');
  const champion = tournament?.status === 'FINISHED' && finalTie?.winnerId 
    ? (finalTie.winnerId === finalTie.homePlayerId ? finalTie.homePlayer : finalTie.awayPlayer) 
    : null;

  return (
    <div className="space-y-8">
      {champion && <WinnerBanner winnerName={champion.name} />}

      <div className="flex gap-6 overflow-x-auto pb-8">
        {groupedTies.map((group) => (
          <div key={group.stage} className="min-w-[300px] flex-shrink-0 bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-6 text-center text-indigo-400">
              {group.stage.replace(/_/g, ' ')}
            </h3>
            <div className="space-y-6 flex flex-col justify-around h-full">
              {group.matches.map((tie: any) => (
                <div key={tie.id} className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-col gap-3 shadow-md relative">
                  {/* Home Player */}
                  <div className={`flex justify-between items-center ${tie.winnerId === tie.homePlayerId ? 'text-yellow-400 font-bold' : 'text-slate-300'}`}>
                    <span>{tie.homePlayer?.name || 'TBD'}</span>
                    <input 
                      type="number"
                      min="0"
                      defaultValue={tie.aggregateHome ?? ''}
                      onBlur={(e) => handleUpdateScore(tie.id, e.target.value, tie.aggregateAway)}
                      className="w-12 bg-slate-900 text-center font-mono font-bold rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 border border-slate-700"
                      placeholder="-"
                      disabled={tie.homePlayerId === null || tie.awayPlayerId === null || tournament?.status === 'FINISHED'}
                    />
                  </div>
                  {/* Away Player */}
                  <div className={`flex justify-between items-center ${tie.winnerId === tie.awayPlayerId ? 'text-yellow-400 font-bold' : 'text-slate-300'}`}>
                    <span>{tie.awayPlayer?.name || 'TBD'}</span>
                    <input 
                      type="number"
                      min="0"
                      defaultValue={tie.aggregateAway ?? ''}
                      onBlur={(e) => handleUpdateScore(tie.id, tie.aggregateHome, e.target.value)}
                      className="w-12 bg-slate-900 text-center font-mono font-bold rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 border border-slate-700"
                      placeholder="-"
                      disabled={tie.homePlayerId === null || tie.awayPlayerId === null || tournament?.status === 'FINISHED'}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {tournament?.status !== 'FINISHED' && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleProgress}
            disabled={!isStageComplete || progressing}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-lg transition-all flex items-center gap-2 shadow-lg"
          >
            {progressing && <Loader2 className="animate-spin" size={18} />}
            {isStageComplete ? 'Progress to Next Round' : 'Complete All Ties to Progress'}
          </button>
        </div>
      )}
    </div>
  );
}

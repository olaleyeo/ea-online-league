import { useState, useEffect } from 'react';
import { getStandings } from '../api';

export default function LeagueTable({ tournamentId }: { tournamentId: string }) {
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStandings();
  }, [tournamentId]);

  const fetchStandings = async () => {
    setLoading(true);
    try {
      const data = await getStandings(tournamentId);
      setStandings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-8 text-slate-400">Loading standings...</div>;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-800/50 border-b border-slate-800">
            <th className="p-4 font-semibold text-slate-300 w-16">Pos</th>
            <th className="p-4 font-semibold text-slate-300">Club</th>
            <th className="p-4 font-semibold text-slate-300 w-16 text-center">MP</th>
            <th className="p-4 font-semibold text-slate-300 w-16 text-center">W</th>
            <th className="p-4 font-semibold text-slate-300 w-16 text-center">D</th>
            <th className="p-4 font-semibold text-slate-300 w-16 text-center">L</th>
            <th className="p-4 font-semibold text-slate-300 w-16 text-center">GF</th>
            <th className="p-4 font-semibold text-slate-300 w-16 text-center">GA</th>
            <th className="p-4 font-semibold text-slate-300 w-16 text-center">GD</th>
            <th className="p-4 font-semibold text-indigo-400 w-20 text-center">Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row, index) => (
            <tr 
              key={row.id} 
              className={`border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${index < 8 ? 'bg-green-900/10' : ''} ${index >= 8 && index < 24 ? 'bg-yellow-900/10' : ''} ${index >= 24 ? 'bg-red-900/10' : ''}`}
            >
              <td className="p-4 text-slate-400">
                <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${index < 8 ? 'bg-green-600 text-white' : index < 24 ? 'bg-yellow-600 text-black' : 'bg-red-600 text-white'}`}>
                  {index + 1}
                </span>
              </td>
              <td className="p-4 font-medium">{row.player.name}</td>
              <td className="p-4 text-center text-slate-400">{row.played}</td>
              <td className="p-4 text-center text-slate-400">{row.wins}</td>
              <td className="p-4 text-center text-slate-400">{row.draws}</td>
              <td className="p-4 text-center text-slate-400">{row.losses}</td>
              <td className="p-4 text-center text-slate-400">{row.gf}</td>
              <td className="p-4 text-center text-slate-400">{row.ga}</td>
              <td className="p-4 text-center font-medium">{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
              <td className="p-4 text-center font-bold text-indigo-400">{row.points}</td>
            </tr>
          ))}
          {standings.length === 0 && (
             <tr><td colSpan={10} className="p-8 text-center text-slate-500">No standings generated yet. Go to fixtures to generate.</td></tr>
          )}
        </tbody>
      </table>
      <div className="p-4 bg-slate-900/50 border-t border-slate-800 flex flex-wrap gap-6 text-sm text-slate-400">
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-600 rounded-full"></div> Top 8 qualify for Round of 16</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-600 rounded-full"></div> 9th-24th enter Playoffs</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-600 rounded-full"></div> 25th+ Eliminated</div>
      </div>
    </div>
  );
}

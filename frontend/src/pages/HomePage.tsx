import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, Users, Swords, Settings, Calendar, ArrowRight } from 'lucide-react';
import { getTournaments } from '../api';

export default function HomePage() {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getTournaments().then(setTournaments).catch(console.error);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-12 pb-16">
      <div className="text-center space-y-6 max-w-3xl pt-8">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
          The Ultimate Tournament Engine
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Generate complete Champions League style formats in seconds. Add players, auto-generate fixtures, simulate matches, and crown your champion.
        </p>
        
        <div className="pt-8 flex gap-4 justify-center">
          <Link to="/create" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-lg transition-all shadow-lg shadow-indigo-600/40 flex items-center gap-2 hover:-translate-y-1">
            <Trophy size={24} />
            Start a Tournament
          </Link>
        </div>
      </div>

      {tournaments.length > 0 && (
        <div className="w-full max-w-4xl mt-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Calendar className="text-indigo-500" /> Recent Tournaments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tournaments.map((tournament: any) => (
              <div 
                key={tournament.id}
                onClick={() => navigate(`/tournament/${tournament.id}`)}
                className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-indigo-500/50 hover:bg-slate-800/50 cursor-pointer transition-all flex justify-between items-center group"
              >
                <div>
                  <h3 className="text-lg font-bold text-slate-200 group-hover:text-white">{tournament.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      tournament.status === 'FINISHED' ? 'bg-green-500/20 text-green-400' 
                      : tournament.status === 'DRAFT' ? 'bg-slate-500/20 text-slate-400' 
                      : 'bg-indigo-500/20 text-indigo-400'
                    }`}>
                      {tournament.status}
                    </span>
                  </div>
                </div>
                <div className="text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all">
                  <ArrowRight />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mt-16">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center gap-4 text-center hover:border-indigo-500/50 transition-colors">
          <div className="p-4 bg-blue-500/10 rounded-full text-blue-400"><Users size={32} /></div>
          <h3 className="text-xl font-bold">Smart Seeding</h3>
          <p className="text-slate-400">Automatically group players into pots based on ratings for balanced matchmaking.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center gap-4 text-center hover:border-indigo-500/50 transition-colors">
          <div className="p-4 bg-green-500/10 rounded-full text-green-400"><Swords size={32} /></div>
          <h3 className="text-xl font-bold">Auto Fixtures</h3>
          <p className="text-slate-400">Generates all league fixtures ensuring no duplicates and balanced home/away matches.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center gap-4 text-center hover:border-indigo-500/50 transition-colors">
          <div className="p-4 bg-purple-500/10 rounded-full text-purple-400"><Settings size={32} /></div>
          <h3 className="text-xl font-bold">AI Simulation</h3>
          <p className="text-slate-400">Built-in Elo-based simulation engine to automatically generate realistic scores.</p>
        </div>
      </div>
    </div>
  );
}

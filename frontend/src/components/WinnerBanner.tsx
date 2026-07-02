import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';

export default function WinnerBanner({ winnerName }: { winnerName: string }) {
  const [confetti, setConfetti] = useState<any[]>([]);

  useEffect(() => {
    // Generate 50 confetti particles with random colors and positions
    const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    const particles = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100 + '%',
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 2 + 's',
      duration: Math.random() * 3 + 2 + 's'
    }));
    setConfetti(particles);
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-2 border-yellow-500/50 rounded-2xl p-12 text-center animate-glow mb-12">
      {/* Confetti container */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {confetti.map(p => (
          <div
            key={p.id}
            className="confetti rounded-sm"
            style={{
              left: p.left,
              top: '-10px',
              backgroundColor: p.color,
              animationDelay: p.delay,
              animationDuration: p.duration
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="text-yellow-400 mb-6 animate-float">
          <Trophy size={80} strokeWidth={1.5} />
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold text-slate-300 tracking-widest uppercase mb-2">
          Tournament Champion
        </h2>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-700 drop-shadow-lg">
          {winnerName}
        </h1>
        
        <div className="mt-8 px-6 py-2 bg-yellow-500/20 text-yellow-300 rounded-full border border-yellow-500/30 text-sm tracking-widest uppercase">
          Winner of the Champions League
        </div>
      </div>
    </div>
  );
}

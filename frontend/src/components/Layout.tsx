import { Outlet, Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200">
      <header className="bg-slate-900 border-b border-slate-800 p-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent transition-transform hover:scale-105">
            <Trophy className="text-yellow-400" size={32} />
            Champions League Gen
          </Link>
          <nav>
            <Link to="/create" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-md font-semibold text-white shadow-lg shadow-indigo-500/30">
              New Tournament
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto p-4 md:p-8 animate-in fade-in duration-500">
        <Outlet />
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 p-6 text-center text-slate-500 text-sm mt-auto">
        &copy; {new Date().getFullYear()} EA Online League Generator. Built with Antigravity AI.
      </footer>
    </div>
  );
}

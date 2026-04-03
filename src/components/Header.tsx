import { Cross, Activity } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-4 px-4 md:px-6 shadow-lg border-b border-slate-700">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Cross className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">MediFind</h1>
            <p className="text-xs md:text-sm text-slate-300">Hospital Bed Tracker</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-green-600/20 border border-green-500/30 rounded-full px-3 md:px-4 py-1.5 md:py-2">
          <div className="relative">
            <Activity className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          </div>
          <span className="text-xs md:text-sm font-medium text-green-300">LIVE - Mumbai Region</span>
        </div>
      </div>
    </header>
  );
}

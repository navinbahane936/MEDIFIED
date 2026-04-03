import { Search, AlertTriangle, Building2 } from 'lucide-react';

type NavigationProps = {
  activeTab: 'find' | 'emergency' | 'portal';
  onTabChange: (tab: 'find' | 'emergency' | 'portal') => void;
};

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex gap-2 md:gap-4 overflow-x-auto">
          <button
            onClick={() => onTabChange('find')}
            className={`flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 font-medium text-sm md:text-base transition-all whitespace-nowrap ${
              activeTab === 'find'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-4 h-4 md:w-5 md:h-5" />
            Find Beds
          </button>
          <button
            onClick={() => onTabChange('emergency')}
            className={`flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 font-medium text-sm md:text-base transition-all whitespace-nowrap ${
              activeTab === 'emergency'
                ? 'text-red-400 border-b-2 border-red-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4 md:w-5 md:h-5" />
            Emergency
          </button>
          <button
            onClick={() => onTabChange('portal')}
            className={`flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 font-medium text-sm md:text-base transition-all whitespace-nowrap ${
              activeTab === 'portal'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4 md:w-5 md:h-5" />
            Hospital Portal
          </button>
        </div>
      </div>
    </nav>
  );
}

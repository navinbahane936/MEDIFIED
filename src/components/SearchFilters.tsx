import { Search, MapPin, Filter } from 'lucide-react';

type SearchFiltersProps = {
  selectedBedType: string;
  onBedTypeChange: (bedType: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
};

export default function SearchFilters({
  selectedBedType,
  onBedTypeChange,
  searchQuery,
  onSearchChange,
  onSearch,
}: SearchFiltersProps) {
  const bedTypes = ['All Beds', 'ICU', 'Oxygen', 'Ventilator', 'Cardiac', 'Oncology', 'General'];

  return (
    <div className="bg-slate-800/50 rounded-xl p-4 md:p-6 border border-slate-700">
      <div className="flex flex-col md:flex-row gap-3 md:gap-4">
        <div className="flex-1 flex gap-3">
          <div className="relative flex-1">
            <select
              value={selectedBedType}
              onChange={(e) => onBedTypeChange(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 md:py-3 text-white text-sm md:text-base appearance-none cursor-pointer hover:border-blue-500 transition-colors pr-10"
            >
              {bedTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative flex-1 hidden md:block">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search hospitals..."
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>
        <button
          onClick={onSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 md:py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-sm md:text-base"
        >
          <Search className="w-4 h-4 md:w-5 md:h-5" />
          Search
        </button>
        <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-sm md:text-base">
          <MapPin className="w-4 h-4 md:w-5 md:h-5" />
          <span className="hidden md:inline">Near Me</span>
        </button>
      </div>
    </div>
  );
}

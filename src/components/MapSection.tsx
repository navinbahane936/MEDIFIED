import { Map, ExternalLink } from 'lucide-react';

export default function MapSection() {
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 md:p-8 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600/20 p-2 md:p-3 rounded-lg">
            <Map className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold text-white">Live Hospital Map</h3>
            <p className="text-xs md:text-sm text-slate-400">GPS navigation to nearest available bed</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-lg h-48 md:h-64 mb-4 flex items-center justify-center border border-slate-700">
        <div className="text-center">
          <Map className="w-12 h-12 md:w-16 md:h-16 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Interactive map view</p>
          <p className="text-slate-600 text-xs mt-1">Click button below to open full map</p>
        </div>
      </div>

      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
        <ExternalLink className="w-5 h-5" />
        Open Full Map
      </button>
    </div>
  );
}

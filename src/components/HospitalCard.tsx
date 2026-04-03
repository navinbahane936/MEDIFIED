import { MapPin, Phone, Navigation, Clock, Bed } from 'lucide-react';
import { HospitalWithBeds } from '../lib/supabase';

type HospitalCardProps = {
  hospital: HospitalWithBeds;
  onBookNow: (hospital: HospitalWithBeds) => void;
  isEmergency?: boolean;
};

export default function HospitalCard({ hospital, onBookNow, isEmergency = false }: HospitalCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-600/20 text-green-400 border-green-500/30';
      case 'CRITICAL':
        return 'bg-red-600/20 text-red-400 border-red-500/30';
      case 'MODERATE':
        return 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-slate-600/20 text-slate-400 border-slate-500/30';
    }
  };

  const getBedTypeColor = (bedType: string) => {
    const colors: Record<string, string> = {
      ICU: 'bg-red-500/20 text-red-300 border-red-500/30',
      Oxygen: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      Ventilator: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      Cardiac: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      Oncology: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      General: 'bg-green-500/20 text-green-300 border-green-500/30',
    };
    return colors[bedType] || 'bg-slate-500/20 text-slate-300 border-slate-500/30';
  };

  const overallStatus = hospital.bed_availability.reduce((worst, bed) => {
    if (bed.status === 'CRITICAL') return 'CRITICAL';
    if (bed.status === 'MODERATE' && worst !== 'CRITICAL') return 'MODERATE';
    return worst;
  }, 'AVAILABLE' as string);

  const lastUpdated = new Date(hospital.bed_availability[0]?.last_updated || hospital.updated_at);
  const minutesAgo = Math.floor((Date.now() - lastUpdated.getTime()) / 60000);

  const handleNavigate = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`;
    window.open(url, '_blank');
  };

  return (
    <div className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 md:p-6 border transition-all hover:shadow-xl ${
      isEmergency
        ? 'border-red-500 shadow-lg shadow-red-500/20 ring-2 ring-red-500/50'
        : 'border-slate-700 hover:border-blue-500/50 hover:shadow-blue-500/10'
    }`}>
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg md:text-xl font-bold text-white">{hospital.name}</h3>
            <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap ${getStatusColor(overallStatus)}`}>
              {overallStatus}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 md:gap-4 text-slate-400 text-xs md:text-sm mb-3">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span>{hospital.location} - {hospital.distance_km} km</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span>{hospital.phone}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
        {hospital.bed_availability.map((bed) => (
          <div
            key={bed.id}
            className={`border rounded-lg p-2 md:p-3 ${getBedTypeColor(bed.bed_type)}`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Bed className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="text-xs font-semibold">{bed.bed_type}</span>
            </div>
            <p className="text-lg md:text-xl font-bold">{bed.available_beds}/{bed.total_beds}</p>
            <p className="text-xs opacity-75">available</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 text-xs md:text-sm text-slate-500 mb-4">
        <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />
        <span>Updated {minutesAgo < 1 ? 'just now' : `${minutesAgo} min ago`}</span>
      </div>

      <div className="flex gap-2 md:gap-3">
        <button
          onClick={() => onBookNow(hospital)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 md:py-2.5 rounded-lg font-medium transition-colors text-sm md:text-base"
        >
          Book Now
        </button>
        <button
          onClick={handleNavigate}
          className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 md:py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm md:text-base"
        >
          <Navigation className="w-4 h-4" />
          Navigate
        </button>
      </div>
    </div>
  );
}

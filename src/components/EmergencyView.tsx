import { AlertTriangle, Phone, Navigation, Zap } from 'lucide-react';
import { HospitalWithBeds } from '../lib/supabase';
import HospitalCard from './HospitalCard';

type EmergencyViewProps = {
  hospitals: HospitalWithBeds[];
  onBookNow: (hospital: HospitalWithBeds) => void;
};

export default function EmergencyView({ hospitals, onBookNow }: EmergencyViewProps) {
  const emergencyNumbers = [
    { name: 'Ambulance', number: '108' },
    { name: 'Emergency', number: '102' },
    { name: 'Police', number: '100' },
  ];

  const nearestHospitals = hospitals
    .filter((h) => h.bed_availability.some((b) => b.available_beds > 0))
    .sort((a, b) => a.distance_km - b.distance_km)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-900/40 to-red-800/40 border-2 border-red-500 rounded-xl p-6 md:p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="bg-red-600 p-3 rounded-full">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Emergency Mode Active</h2>
            <p className="text-red-200 text-sm md:text-base">
              Showing nearest hospitals with immediate bed availability
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {emergencyNumbers.map((contact) => (
            <a
              key={contact.number}
              href={`tel:${contact.number}`}
              className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-lg flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5" />
                <div>
                  <p className="text-xs opacity-90">{contact.name}</p>
                  <p className="text-xl font-bold">{contact.number}</p>
                </div>
              </div>
              <Zap className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-4 md:p-6 border border-yellow-500/50">
        <div className="flex items-center gap-3 mb-4">
          <Navigation className="w-6 h-6 text-yellow-400" />
          <h3 className="text-xl font-bold text-white">Nearest Hospitals with Availability</h3>
        </div>
        <p className="text-slate-400 text-sm mb-6">
          These hospitals are closest to you and have beds available right now
        </p>

        <div className="grid gap-4">
          {nearestHospitals.length > 0 ? (
            nearestHospitals.map((hospital) => (
              <HospitalCard
                key={hospital.id}
                hospital={hospital}
                onBookNow={onBookNow}
                isEmergency={true}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No hospitals with immediate availability found</p>
              <p className="text-slate-500 text-sm mt-2">Please call emergency services</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

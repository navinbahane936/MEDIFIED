import { Building2, Lock, LogOut, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { HospitalWithBeds } from '../lib/supabase';

type HospitalPortalProps = {
  hospitals: HospitalWithBeds[];
  onUpdateBed: (hospitalId: string, bedType: string, newAvailable: number) => void;
};

export default function HospitalPortal({ hospitals, onUpdateBed }: HospitalPortalProps) {
  const [hospitalIdInput, setHospitalIdInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loggedInHospitalId, setLoggedInHospitalId] = useState<string | null>(null);
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    // Mock login logic checking strictly for the specific alphanumeric login_id
    const hospital = hospitals.find(h => h.login_id === hospitalIdInput.trim());
    if (!hospital) {
      setLoginError('Invalid Hospital ID');
      return;
    }

    // In a real app we'd check password too. Here we just accept any password
    if (!passwordInput.trim()) {
      setLoginError('Password is required');
      return;
    }

    setLoggedInHospitalId(hospital.id);
  };

  const handleLogout = () => {
    setLoggedInHospitalId(null);
    setHospitalIdInput('');
    setPasswordInput('');
  };

  if (loggedInHospitalId) {
    const hospital = hospitals.find(h => h.id === loggedInHospitalId);
    if (!hospital) return null;

    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800 rounded-xl p-6 md:p-8 border border-slate-700 shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-700 pb-6">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Building2 className="text-blue-400" />
                {hospital.name} Dashboard
              </h2>
              <p className="text-slate-400 mt-1">Manage your bed availability in real-time</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors text-sm font-medium border border-slate-600"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hospital.bed_availability.map((bed) => (
              <div key={bed.id} className="bg-slate-900 border border-slate-700 rounded-xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-500 transition-colors">
                <div className="absolute top-0 right-0 w-2 h-full"
                  style={{
                    backgroundColor: bed.status === 'AVAILABLE' ? '#22c55e' :
                      bed.status === 'MODERATE' ? '#eab308' : '#ef4444'
                  }}
                />

                <div className="flex justify-between items-center mb-6 pr-4">
                  <span className="text-xl font-bold text-white">{bed.bed_type}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                    ${bed.status === 'AVAILABLE' ? 'bg-green-500/10 text-green-400' :
                      bed.status === 'MODERATE' ? 'bg-yellow-500/10 text-yellow-400' :
                        'bg-red-500/10 text-red-400'}`}
                  >
                    {bed.status}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-2 pr-4">
                  <div className="space-y-1">
                    <p className="text-slate-500 text-xs uppercase font-semibold">Capacity</p>
                    <p className="text-slate-300 text-sm font-medium">{bed.total_beds} Beds</p>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-800 p-2 rounded-lg border border-slate-700">
                    <button
                      onClick={() => onUpdateBed(hospital.id, bed.bed_type, Math.max(0, bed.available_beds - 1))}
                      disabled={bed.available_beds <= 0}
                      className="p-1.5 rounded-md bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="text-2xl font-black text-white w-10 text-center">
                      {bed.available_beds}
                    </span>
                    <button
                      onClick={() => onUpdateBed(hospital.id, bed.bed_type, Math.min(bed.total_beds, bed.available_beds + 1))}
                      disabled={bed.available_beds >= bed.total_beds}
                      className="p-1.5 rounded-md bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700 text-center shadow-xl">
        <div className="bg-blue-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8 text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Hospital Portal</h2>
        <p className="text-slate-400 mb-6">
          Access for registered hospitals to update bed availability
        </p>

        <form onSubmit={handleLogin} className="space-y-4 mb-6 text-left">
          {loginError && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg">
              {loginError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Hospital ID</label>
            <input
              type="text"
              required
              value={hospitalIdInput}
              onChange={(e) => setHospitalIdInput(e.target.value)}
              placeholder="e.g. YASHO123"
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <p className="text-xs text-slate-500 mt-1.5">Demo hint: try 'YASHO123' or 'ICON123'</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
            <input
              type="password"
              required
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Any password works for demo"
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors mt-6 shadow-lg shadow-blue-900/20">
            <Lock className="w-5 h-5" />
            Sign In
          </button>
        </form>

        <p className="text-slate-500 text-sm pt-4 border-t border-slate-700">
          Authorized personnel only. Contact admin for access.
        </p>
      </div>
    </div>
  );
}

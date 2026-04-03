import { Building2, Lock } from 'lucide-react';

export default function HospitalPortal() {
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700 text-center">
        <div className="bg-blue-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8 text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Hospital Portal</h2>
        <p className="text-slate-400 mb-6">
          Access for registered hospitals to update bed availability
        </p>

        <div className="space-y-4 mb-6">
          <input
            type="text"
            placeholder="Hospital ID"
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors mb-4">
          <Lock className="w-5 h-5" />
          Sign In
        </button>

        <p className="text-slate-500 text-sm">
          Authorized personnel only. Contact admin for access.
        </p>
      </div>
    </div>
  );
}

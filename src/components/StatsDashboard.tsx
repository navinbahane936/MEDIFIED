import { Activity, Wind, Droplet, Building2, TrendingUp, TrendingDown } from 'lucide-react';

type StatsCardProps = {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
  trendValue?: string;
};

function StatsCard({ title, value, subtitle, icon, trend, trendValue }: StatsCardProps) {
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 md:p-6 border border-slate-700 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10">
      <div className="flex items-start justify-between mb-3">
        <div className="bg-blue-600/20 p-2 md:p-3 rounded-lg">
          {icon}
        </div>
        {trend && trendValue && (
          <div className={`flex items-center gap-1 text-xs font-medium ${
            trend === 'up' ? 'text-green-400' : 'text-red-400'
          }`}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trendValue}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-slate-400 text-xs md:text-sm font-medium">{title}</p>
        <p className="text-2xl md:text-4xl font-bold text-white">{value}</p>
        <p className="text-slate-500 text-xs md:text-sm">{subtitle}</p>
      </div>
    </div>
  );
}

type StatsDashboardProps = {
  stats: {
    icuBeds: number;
    ventilators: number;
    oxygenBeds: number;
    hospitalsOnline: number;
  };
};

export default function StatsDashboard({ stats }: StatsDashboardProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      <StatsCard
        title="Available ICU Beds"
        value={stats.icuBeds}
        subtitle="across 12 hospitals"
        icon={<Activity className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />}
        trend="up"
        trendValue="+5"
      />
      <StatsCard
        title="Ventilators Free"
        value={stats.ventilators}
        subtitle="ready for use"
        icon={<Wind className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />}
        trend="down"
        trendValue="-2"
      />
      <StatsCard
        title="Oxygen Beds"
        value={stats.oxygenBeds}
        subtitle="recently updated"
        icon={<Droplet className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />}
        trend="up"
        trendValue="+8"
      />
      <StatsCard
        title="Hospitals Online"
        value={stats.hospitalsOnline}
        subtitle="live reporting"
        icon={<Building2 className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />}
      />
    </div>
  );
}

import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from './Card';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  color?: string;
  trend?: { value: number; direction: 'up' | 'down' | 'neutral'; label?: string };
}

export function StatCard({ label, value, icon, color = 'text-indigo-600', trend }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium truncate">{label}</p>
          <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">{value}</p>
          {trend && (
            <div className={`flex items-center gap-1 mt-1.5 text-xs font-medium ${
              trend.direction === 'up' ? 'text-emerald-600' :
              trend.direction === 'down' ? 'text-red-500' : 'text-slate-400'
            }`}>
              {trend.direction === 'up' ? <TrendingUp size={11} /> :
               trend.direction === 'down' ? <TrendingDown size={11} /> :
               <Minus size={11} />}
              <span>{trend.value > 0 ? '+' : ''}{trend.value}% {trend.label ?? 'vs last month'}</span>
            </div>
          )}
        </div>
        <div className={`p-2.5 rounded-lg bg-slate-50 dark:bg-slate-700 shrink-0 ${color}`}>{icon}</div>
      </div>
    </Card>
  );
}

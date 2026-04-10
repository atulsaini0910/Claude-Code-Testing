import type { ReactNode } from 'react';
import { Card } from './Card';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  color?: string;
}

export function StatCard({ label, value, icon, color = 'text-indigo-600' }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</p>
          <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">{value}</p>
        </div>
        <div className={`p-2.5 rounded-lg bg-slate-50 dark:bg-slate-700 ${color}`}>{icon}</div>
      </div>
    </Card>
  );
}

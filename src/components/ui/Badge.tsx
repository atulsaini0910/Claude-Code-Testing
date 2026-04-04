import { cn } from '../../lib/utils';
import type { ClientStatus, PropertyType, ActivityType } from '../../types';

type BadgeVariant = ClientStatus | PropertyType | ActivityType | string;

const variantClasses: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700',
  inactive: 'bg-amber-100 text-amber-700',
  closed: 'bg-slate-100 text-slate-600',
  residential: 'bg-blue-100 text-blue-700',
  commercial: 'bg-purple-100 text-purple-700',
  land: 'bg-lime-100 text-lime-700',
  'multi-family': 'bg-orange-100 text-orange-700',
  any: 'bg-slate-100 text-slate-600',
  note: 'bg-slate-100 text-slate-600',
  call: 'bg-green-100 text-green-700',
  meeting: 'bg-blue-100 text-blue-700',
  email: 'bg-indigo-100 text-indigo-700',
};

interface BadgeProps {
  value: BadgeVariant;
  label?: string;
  className?: string;
}

export function Badge({ value, label, className }: BadgeProps) {
  const classes = variantClasses[value] ?? 'bg-slate-100 text-slate-600';
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
        classes,
        className
      )}
    >
      {label ?? value.replace('-', ' ')}
    </span>
  );
}

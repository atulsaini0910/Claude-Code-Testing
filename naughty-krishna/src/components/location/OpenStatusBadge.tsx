import { useOpenStatus } from '@/hooks/useOpenStatus';
import { cn } from '@/lib/utils';

export function OpenStatusBadge() {
  const { status, nextChange } = useOpenStatus();

  const config = {
    open: { dot: 'bg-green-400', label: 'Open Now', labelClass: 'text-green-400', animate: true },
    'closing-soon': { dot: 'bg-amber-400', label: 'Closing Soon', labelClass: 'text-amber-400', animate: false },
    closed: { dot: 'bg-red-500', label: 'Closed', labelClass: 'text-red-400', animate: false },
  }[status];

  return (
    <div className="inline-flex items-center gap-2 bg-dark-2 border border-white/10 rounded-full px-4 py-2">
      <span className="relative flex h-2.5 w-2.5">
        {config.animate && (
          <span className={cn('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', config.dot)} />
        )}
        <span className={cn('relative inline-flex rounded-full h-2.5 w-2.5', config.dot)} />
      </span>
      <span className={cn('text-sm font-semibold', config.labelClass)}>{config.label}</span>
      {nextChange && (
        <span className="text-cream/40 text-xs">{nextChange}</span>
      )}
    </div>
  );
}

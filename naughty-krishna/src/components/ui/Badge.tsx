import { cn } from '@/lib/utils';
import type { BadgeType } from '@/types';

interface BadgeProps {
  type: BadgeType;
  className?: string;
}

const badgeConfig: Record<BadgeType, { label: string; className: string }> = {
  popular: {
    label: '⭐ Popular',
    className: 'bg-gold-500 text-dark',
  },
  new: {
    label: '✨ New',
    className: 'bg-saffron-500 text-white',
  },
  'must-try': {
    label: '🔥 Must Try',
    className: 'bg-crimson-800 text-white',
  },
  spicy: {
    label: '🌶 Spicy',
    className: 'bg-red-700 text-white',
  },
};

export function Badge({ type, className }: BadgeProps) {
  const config = badgeConfig[type];
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold tracking-wide',
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
}

interface SpiceLevelProps {
  level: 1 | 2 | 3;
}

export function SpiceLevel({ level }: SpiceLevelProps) {
  return (
    <div className="flex items-center gap-0.5" title={`Spice level: ${level}/3`}>
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={cn(
            'text-xs',
            i <= level ? 'opacity-100' : 'opacity-25',
          )}
        >
          🌶
        </span>
      ))}
    </div>
  );
}

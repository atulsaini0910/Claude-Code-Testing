import { cn } from '@/lib/utils';

interface SpiceDecorProps {
  className?: string;
  variant?: 'mandala' | 'dots' | 'corner' | 'divider';
}

export function SpiceDecor({ className, variant = 'mandala' }: SpiceDecorProps) {
  if (variant === 'mandala') {
    return (
      <svg
        viewBox="0 0 200 200"
        className={cn('opacity-10', className)}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="100" cy="100" r="90" stroke="#F97316" strokeWidth="1" />
        <circle cx="100" cy="100" r="70" stroke="#FBBF24" strokeWidth="1" />
        <circle cx="100" cy="100" r="50" stroke="#F97316" strokeWidth="1" />
        <circle cx="100" cy="100" r="30" stroke="#FBBF24" strokeWidth="1" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 100 + 30 * Math.cos(rad);
          const y1 = 100 + 30 * Math.sin(rad);
          const x2 = 100 + 90 * Math.cos(rad);
          const y2 = 100 + 90 * Math.sin(rad);
          return (
            <line
              key={angle}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#F97316"
              strokeWidth="0.5"
            />
          );
        })}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const cx = 100 + 70 * Math.cos(rad);
          const cy = 100 + 70 * Math.sin(rad);
          return (
            <circle key={angle} cx={cx} cy={cy} r="4" fill="#FBBF24" />
          );
        })}
      </svg>
    );
  }

  if (variant === 'dots') {
    return (
      <div
        className={cn('opacity-20', className)}
        style={{
          backgroundImage:
            'radial-gradient(circle, #F97316 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
        aria-hidden="true"
      />
    );
  }

  if (variant === 'divider') {
    return (
      <div
        className={cn('flex items-center gap-3 my-6', className)}
        aria-hidden="true"
      >
        <div className="h-px flex-1 bg-saffron-500/20" />
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#F97316">
          <path d="M12 2L9.5 9H2l5.9 4.3-2.3 7 6.4-4.6 6.4 4.6-2.3-7L22 9h-7.5L12 2z" />
        </svg>
        <div className="h-px flex-1 bg-saffron-500/20" />
      </div>
    );
  }

  // corner
  return (
    <svg
      viewBox="0 0 60 60"
      className={cn('opacity-15', className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M0 0 L60 0 L60 60" stroke="#FBBF24" strokeWidth="1" fill="none" />
      <circle cx="8" cy="8" r="3" fill="#F97316" />
      <circle cx="20" cy="8" r="2" fill="#FBBF24" />
      <circle cx="8" cy="20" r="2" fill="#FBBF24" />
    </svg>
  );
}

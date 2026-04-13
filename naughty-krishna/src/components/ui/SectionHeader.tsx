import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  light?: boolean;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  align = 'center',
  light = false,
  className,
}: SectionHeaderProps) {
  const alignClass =
    align === 'center'
      ? 'text-center items-center'
      : align === 'right'
        ? 'text-right items-end'
        : 'text-left items-start';

  return (
    <div className={cn('flex flex-col gap-3 mb-12', alignClass, className)}>
      {/* Decorative line */}
      <div className="flex items-center gap-3">
        <div className="h-0.5 w-8 bg-saffron-500 rounded-full" />
        <div className="h-0.5 w-3 bg-gold-500 rounded-full" />
      </div>

      <h2
        className={cn(
          'text-4xl md:text-5xl font-bold leading-tight',
          'font-heading',
          light ? 'text-cream' : 'text-cream',
        )}
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={cn(
            'text-lg max-w-2xl leading-relaxed',
            light ? 'text-cream/70' : 'text-cream/60',
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

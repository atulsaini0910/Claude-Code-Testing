import { cn } from '../../lib/utils';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className, onClick }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-slate-100 shadow-sm',
        onClick && 'cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

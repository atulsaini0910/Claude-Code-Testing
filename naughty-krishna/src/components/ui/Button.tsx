import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'crimson' | 'ghost' | 'gold';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  fullWidth?: boolean;
  href?: string;
  target?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-saffron-500 text-white hover:bg-saffron-600 border border-saffron-500',
  secondary:
    'bg-transparent text-saffron-500 border border-saffron-500 hover:bg-saffron-500 hover:text-white',
  crimson:
    'bg-crimson-800 text-white hover:bg-crimson-700 border border-crimson-800',
  ghost:
    'bg-transparent text-cream border border-cream/30 hover:border-cream/70 hover:bg-white/10',
  gold: 'bg-gold-500 text-dark border border-gold-500 hover:bg-gold-400',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
  xl: 'px-10 py-5 text-xl',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  onClick,
  type = 'button',
  disabled = false,
  fullWidth = false,
  href,
  target,
}: ButtonProps) {
  const baseClasses = cn(
    'inline-flex items-center justify-center gap-2 font-medium rounded-full transition-all duration-200 cursor-pointer select-none',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
    disabled && 'opacity-50 cursor-not-allowed',
    className,
  );

  if (href) {
    return (
      <motion.a
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        className={baseClasses}
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.02 }}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
    >
      {children}
    </motion.button>
  );
}

import { cn } from '../../lib/utils';
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface BaseProps {
  label: string;
  error?: string;
  className?: string;
}

interface InputProps extends BaseProps, InputHTMLAttributes<HTMLInputElement> {
  as?: 'input';
}

interface TextareaProps extends BaseProps, TextareaHTMLAttributes<HTMLTextAreaElement> {
  as: 'textarea';
}

type TextInputProps = InputProps | TextareaProps;

const inputClasses =
  'w-full rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-700 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent';

export function TextInput(props: TextInputProps) {
  const { label, error, className, as = 'input', ...rest } = props;

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
        {label}
      </label>
      {as === 'textarea' ? (
        <textarea
          className={cn(inputClasses, error && 'border-red-400 focus:ring-red-400', 'resize-none')}
          rows={3}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          className={cn(inputClasses, error && 'border-red-400 focus:ring-red-400')}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

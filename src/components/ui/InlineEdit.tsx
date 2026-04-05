import { useState, useRef, useEffect, type ReactNode } from 'react';
import { Pencil } from 'lucide-react';
import { cn } from '../../lib/utils';

interface InlineEditProps {
  value: string;
  onSave: (val: string) => void;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  as?: 'input' | 'textarea';
  displayNode?: ReactNode;
}

export function InlineEdit({
  value, onSave, className, inputClassName,
  placeholder = 'Click to edit', as = 'input', displayNode,
}: InlineEditProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing) ref.current?.focus();
  }, [editing]);

  const commit = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) onSave(trimmed);
    setEditing(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && as === 'input') { e.preventDefault(); commit(); }
    if (e.key === 'Escape') { setDraft(value); setEditing(false); }
  };

  if (editing) {
    const sharedProps = {
      ref,
      value: draft,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft(e.target.value),
      onBlur: commit,
      onKeyDown: handleKey,
      placeholder,
      className: cn(
        'w-full rounded-md border border-indigo-400 ring-1 ring-indigo-300 px-2 py-1 text-sm focus:outline-none',
        inputClassName,
      ),
    };
    return as === 'textarea'
      ? <textarea rows={3} {...sharedProps} />
      : <input type="text" {...sharedProps} />;
  }

  return (
    <button
      type="button"
      onClick={() => { setDraft(value); setEditing(true); }}
      className={cn('group flex items-center gap-1.5 text-left w-full rounded hover:bg-slate-50 px-1 -ml-1 py-0.5 transition-colors cursor-text', className)}
    >
      <span className="flex-1">{displayNode ?? (value || <span className="text-slate-400 italic">{placeholder}</span>)}</span>
      <Pencil size={11} className="text-slate-300 opacity-0 group-hover:opacity-100 shrink-0" />
    </button>
  );
}

import { useState } from 'react';
import { Bookmark, X, Users } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../lib/utils';

interface SaveViewPopoverProps {
  onSave: (name: string, isShared: boolean) => void;
  className?: string;
}

export function SaveViewPopover({ onSave, className }: SaveViewPopoverProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [isShared, setIsShared] = useState(false);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim(), isShared);
    setName('');
    setIsShared(false);
    setOpen(false);
  };

  return (
    <div className={cn('relative', className)}>
      <Button variant="secondary" size="sm" onClick={() => setOpen(v => !v)}>
        <Bookmark size={13} /> Save View
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-9 z-20 w-64 bg-white border border-slate-200 rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-slate-800">Save Current View</p>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={13} />
              </button>
            </div>
            <input
              type="text"
              placeholder="View name…"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              autoFocus
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-3"
            />
            <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer mb-3">
              <input
                type="checkbox"
                checked={isShared}
                onChange={e => setIsShared(e.target.checked)}
                className="rounded"
              />
              <Users size={11} /> Share with team
            </label>
            <Button size="sm" onClick={handleSave} className="w-full" disabled={!name.trim()}>
              Save View
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

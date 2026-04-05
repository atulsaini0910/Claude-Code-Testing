import { X, UserCheck, Tag, Trash2, Download } from 'lucide-react';
import { Button } from '../ui/Button';
import type { Client, ClientStatus } from '../../types';
import { cn } from '../../lib/utils';

interface BulkActionBarProps {
  selectedItems: Client[];
  onClearAll: () => void;
  onChangeStatus: (status: ClientStatus) => void;
  onExport: () => void;
  onDelete: () => void;
}

export function BulkActionBar({ selectedItems, onClearAll, onChangeStatus, onExport, onDelete }: BulkActionBarProps) {
  if (selectedItems.length === 0) return null;

  return (
    <div className={cn(
      'fixed bottom-6 left-1/2 -translate-x-1/2 z-50',
      'bg-slate-900 text-white rounded-2xl shadow-2xl px-4 py-3',
      'flex items-center gap-3 min-w-[340px]',
    )}>
      <span className="text-sm font-semibold text-white shrink-0">
        {selectedItems.length} selected
      </span>

      <div className="w-px h-5 bg-slate-600 shrink-0" />

      {/* Status change */}
      <div className="flex items-center gap-1.5">
        <UserCheck size={13} className="text-slate-400" />
        <select
          className="bg-slate-800 text-white text-xs border border-slate-700 rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
          defaultValue=""
          onChange={(e) => { if (e.target.value) onChangeStatus(e.target.value as ClientStatus); }}
        >
          <option value="" disabled>Set status…</option>
          <option value="active">Active</option>
          <option value="nurture">Nurture</option>
          <option value="inactive">Inactive</option>
          <option value="closed">Closed</option>
          <option value="lost">Lost</option>
        </select>
      </div>

      <Button
        size="sm"
        variant="ghost"
        className="text-slate-300 hover:text-white hover:bg-slate-800 text-xs gap-1"
        onClick={onExport}
      >
        <Download size={12} /> Export
      </Button>

      <Button
        size="sm"
        variant="ghost"
        className="text-red-400 hover:text-red-300 hover:bg-slate-800 text-xs gap-1"
        onClick={onDelete}
      >
        <Trash2 size={12} /> Delete
      </Button>

      <button
        onClick={onClearAll}
        className="ml-1 p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
      >
        <X size={14} />
      </button>
    </div>
  );
}

// Suppress unused import lint warning
void Tag;

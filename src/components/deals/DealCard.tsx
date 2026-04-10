import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { User, DollarSign, Calendar, GripVertical } from 'lucide-react';
import { cn, formatCurrency } from '../../lib/utils';
import type { Deal } from '../../types';

const STAGE_PROB: Record<string, number> = {
  inquiry: 10, showing: 25, offer: 55,
  under_contract: 82, closed_won: 100, closed_lost: 0,
};

interface DealCardProps {
  deal: Deal;
  clientName?: string;
  onClick?: () => void;
  overlay?: boolean;
}

export function DealCard({ deal, clientName, onClick, overlay }: DealCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: deal.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const daysInStage = (() => {
    if (deal.stageHistory && deal.stageHistory.length > 0) {
      const last = deal.stageHistory[deal.stageHistory.length - 1];
      return Math.floor((Date.now() - new Date(last.enteredAt).getTime()) / 86400000);
    }
    return Math.floor((Date.now() - new Date(deal.updatedAt).getTime()) / 86400000);
  })();
  const prob = STAGE_PROB[deal.stage] ?? 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm group',
        isDragging && !overlay && 'opacity-40',
        overlay && 'shadow-xl rotate-1 scale-105',
        'transition-shadow'
      )}
    >
      {/* Drag handle + click area */}
      <div className="flex items-start gap-1 p-3 pb-0">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 p-0.5 rounded text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing shrink-0 touch-none"
        >
          <GripVertical size={13} />
        </button>
        <div className="flex-1 min-w-0 cursor-pointer" onClick={onClick}>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug line-clamp-2">{deal.title}</p>
          {clientName && (
            <div className="flex items-center gap-1 mt-1">
              <User size={10} className="text-slate-400" />
              <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{clientName}</span>
            </div>
          )}
        </div>
      </div>

      <div className="px-3 pb-3 pt-2 space-y-2 cursor-pointer" onClick={onClick}>
        {/* Value + commission */}
        {deal.value && (
          <div className="flex items-center gap-1">
            <DollarSign size={11} className="text-slate-400" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{formatCurrency(deal.value)}</span>
            {deal.commissionPct && (
              <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-auto">
                {formatCurrency(deal.value * deal.commissionPct / 100)} comm.
              </span>
            )}
          </div>
        )}

        {/* Close date */}
        {deal.closeDate && (
          <div className="flex items-center gap-1">
            <Calendar size={11} className="text-slate-400" />
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Close {new Date(deal.closeDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        )}

        {/* Bottom row: tags + days in stage + probability */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1 flex-wrap">
            {deal.tags.slice(0, 2).map(t => (
              <span key={t} className="text-[9px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-full">{t}</span>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <span className={cn(
              'text-[10px] px-1.5 py-0.5 rounded-full font-semibold',
              prob >= 75 ? 'bg-emerald-50 text-emerald-600' :
              prob >= 40 ? 'bg-amber-50 text-amber-600' :
                           'bg-red-50 text-red-500'
            )}>
              {prob}%
            </span>
            <span className={cn(
              'text-[10px] px-1.5 py-0.5 rounded-full font-medium',
              daysInStage > 14 ? 'bg-red-50 text-red-500' :
              daysInStage > 7  ? 'bg-amber-50 text-amber-600' :
                                 'bg-slate-50 text-slate-400'
            )}>
              {daysInStage}d
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

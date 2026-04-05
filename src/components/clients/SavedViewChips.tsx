import { Flame, ShieldCheck, Clock, User, TrendingUp, LayoutGrid } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { ClientFilters } from '../../types';

interface SmartSegment {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  filters: Partial<ClientFilters>;
}

const SMART_SEGMENTS: SmartSegment[] = [
  {
    id: 'hot_buyers',
    label: 'Hot Buyers',
    icon: <Flame size={11} />,
    color: 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100',
    filters: { leadTemperature: 'hot', clientType: 'buyer', status: 'active' },
  },
  {
    id: 'pre_approved',
    label: 'Pre-Approved',
    icon: <ShieldCheck size={11} />,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
    filters: { status: 'active' },
  },
  {
    id: 'investors',
    label: 'Investors',
    icon: <TrendingUp size={11} />,
    color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
    filters: { clientType: 'investor', status: 'active' },
  },
  {
    id: 'nurture',
    label: 'Nurture',
    icon: <Clock size={11} />,
    color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
    filters: { status: 'nurture' },
  },
  {
    id: 'all',
    label: 'All Clients',
    icon: <LayoutGrid size={11} />,
    color: 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100',
    filters: {},
  },
];

interface SavedViewChipsProps {
  activeSegment: string | null;
  onSelect: (segmentId: string, filters: Partial<ClientFilters>) => void;
}

export function SavedViewChips({ activeSegment, onSelect }: SavedViewChipsProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <User size={12} className="text-slate-400 shrink-0" />
      {SMART_SEGMENTS.map(seg => (
        <button
          key={seg.id}
          onClick={() => onSelect(seg.id, seg.filters)}
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer',
            seg.color,
            activeSegment === seg.id && 'ring-2 ring-offset-1 ring-indigo-400',
          )}
        >
          {seg.icon}
          {seg.label}
        </button>
      ))}
    </div>
  );
}

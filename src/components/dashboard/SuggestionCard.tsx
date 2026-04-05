import { useNavigate } from 'react-router-dom';
import { Phone, Navigation, FileText, Zap, AlertTriangle, Info } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Suggestion } from '../../types';

const URGENCY_STYLES = {
  high:   { bar: 'bg-red-400',    badge: 'bg-red-50 border-red-200',    text: 'text-red-700',    dot: 'bg-red-400' },
  medium: { bar: 'bg-amber-400',  badge: 'bg-amber-50 border-amber-200', text: 'text-amber-700', dot: 'bg-amber-400' },
  low:    { bar: 'bg-blue-300',   badge: 'bg-blue-50 border-blue-200',   text: 'text-blue-700',  dot: 'bg-blue-300' },
};

const ACTION_ICON = {
  call:         <Phone size={12} />,
  navigate:     <Navigation size={12} />,
  log_activity: <FileText size={12} />,
};

const URGENCY_ICON = {
  high:   <AlertTriangle size={10} />,
  medium: <Zap size={10} />,
  low:    <Info size={10} />,
};

function getEntityPath(suggestion: Suggestion): string {
  switch (suggestion.entityType) {
    case 'client':  return `/clients/${suggestion.entityId}`;
    case 'deal':    return `/deals/${suggestion.entityId}`;
    case 'showing': return `/showings`;
    case 'task':    return `/tasks`;
    default:        return '/dashboard';
  }
}

interface SuggestionCardProps {
  suggestion: Suggestion;
}

export function SuggestionCard({ suggestion }: SuggestionCardProps) {
  const navigate = useNavigate();
  const styles = URGENCY_STYLES[suggestion.urgency];

  return (
    <button
      onClick={() => navigate(getEntityPath(suggestion))}
      className={cn(
        'w-full text-left p-3 rounded-lg border transition-all hover:shadow-sm cursor-pointer group',
        styles.badge
      )}
    >
      <div className="flex items-start gap-2.5">
        {/* Urgency dot */}
        <div className={cn('w-1.5 h-1.5 rounded-full mt-1.5 shrink-0', styles.dot)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className={cn('text-[10px] font-bold flex items-center gap-0.5 uppercase tracking-wide', styles.text)}>
              {URGENCY_ICON[suggestion.urgency]} {suggestion.urgency}
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-800 leading-tight">{suggestion.title}</p>
          <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{suggestion.body}</p>
        </div>
        <span className={cn('shrink-0 flex items-center gap-1 text-[10px] font-medium opacity-60 group-hover:opacity-100 transition-opacity', styles.text)}>
          {ACTION_ICON[suggestion.actionType]}
        </span>
      </div>
    </button>
  );
}

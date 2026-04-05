import { useNavigate } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Flame, Thermometer, Snowflake, AlertCircle, CheckSquare } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatBudget, timeAgo } from '../../lib/utils';
import { cn } from '../../lib/utils';
import type { Client, ActivityEntry } from '../../types';

const tempIcon = {
  hot:  <Flame size={11} className="text-red-500" />,
  warm: <Thermometer size={11} className="text-amber-500" />,
  cold: <Snowflake size={11} className="text-blue-400" />,
};

function daysSince(isoDate: string): number {
  return Math.floor((Date.now() - new Date(isoDate).getTime()) / 86400000);
}

interface ClientCardProps {
  client: Client;
  lastActivity: ActivityEntry | null;
  selected?: boolean;
  onSelect?: (id: string) => void;
}

export function ClientCard({ client, lastActivity, selected, onSelect }: ClientCardProps) {
  const navigate = useNavigate();
  const contactSource = client.lastContactedAt ?? lastActivity?.createdAt ?? null;
  const days = contactSource ? daysSince(contactSource) : null;

  const followUpStatus = days === null ? 'none'
    : days <= 7 ? 'fresh'
    : days <= 21 ? 'due'
    : 'overdue';

  const followUpBadge = followUpStatus === 'overdue'
    ? { label: `${days}d ago`, cls: 'bg-red-100 text-red-600', icon: <AlertCircle size={9} /> }
    : followUpStatus === 'due'
    ? { label: `${days}d ago`, cls: 'bg-amber-100 text-amber-700', icon: <Clock size={9} /> }
    : null;

  const nextActionOverdue = client.nextActionDate &&
    new Date(client.nextActionDate).getTime() < Date.now();

  return (
    <Card
      onClick={() => navigate(`/clients/${client.id}`)}
      className={cn('p-4 relative', selected && 'ring-2 ring-indigo-400')}
    >
      {/* Checkbox for bulk select */}
      {onSelect && (
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(client.id); }}
          className="absolute top-3 left-3 z-10 cursor-pointer"
        >
          <CheckSquare
            size={15}
            className={selected ? 'text-indigo-600' : 'text-slate-300 hover:text-slate-400'}
          />
        </button>
      )}

      <div className={cn('flex items-start justify-between mb-2.5', onSelect && 'pl-5')}>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold text-slate-800 text-sm leading-tight truncate">{client.name}</h3>
            {tempIcon[client.leadTemperature]}
          </div>
          <p className="text-xs text-slate-400 mt-0.5 capitalize">
            {client.clientType} · {client.propertyType.replace('-', ' ')}
          </p>
        </div>
        <Badge value={client.status} />
      </div>

      <div className="space-y-1 text-xs text-slate-600 mb-2.5">
        <div className="flex items-center gap-1.5">
          <MapPin size={11} className="text-slate-400 shrink-0" />
          <span className="truncate">{client.locationPreference}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Phone size={11} className="text-slate-400 shrink-0" />
          {client.phone}
        </div>
        <div className="flex items-center gap-1.5">
          <Mail size={11} className="text-slate-400 shrink-0" />
          <span className="truncate">{client.email}</span>
        </div>
      </div>

      {/* Budget + pre-approval */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-700">{formatBudget(client.budget.min, client.budget.max)}</span>
        {client.preApproved && (
          <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-medium">Pre-approved</span>
        )}
      </div>

      {/* Tags */}
      {client.tags.length > 0 && (
        <div className="flex gap-1 flex-wrap mb-2">
          {client.tags.slice(0, 3).map(t => (
            <span key={t} className="text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-full">{t}</span>
          ))}
        </div>
      )}

      <div className="pt-2 border-t border-slate-50 flex items-center justify-between gap-2">
        {lastActivity ? (
          <div className="flex items-center gap-1 text-[10px] text-slate-400 min-w-0">
            <Clock size={10} className="shrink-0" />
            <span className="truncate">{lastActivity.title}</span>
            <span className="shrink-0">· {timeAgo(lastActivity.createdAt)}</span>
          </div>
        ) : (
          <span className="text-[10px] text-slate-300">No activity yet</span>
        )}

        <div className="flex items-center gap-1 shrink-0">
          {/* Next action overdue indicator */}
          {nextActionOverdue && (
            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700">
              Action due
            </span>
          )}
          {/* Days since contact badge */}
          {followUpBadge && (
            <span className={cn('inline-flex items-center gap-0.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-full', followUpBadge.cls)}>
              {followUpBadge.icon}
              {followUpBadge.label}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}

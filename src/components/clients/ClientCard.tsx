import { useNavigate } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Flame, Thermometer, Snowflake } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatBudget, timeAgo } from '../../lib/utils';
import type { Client, ActivityEntry } from '../../types';

const tempIcon = {
  hot:  <Flame size={11} className="text-red-500" />,
  warm: <Thermometer size={11} className="text-amber-500" />,
  cold: <Snowflake size={11} className="text-blue-400" />,
};

interface ClientCardProps {
  client: Client;
  lastActivity: ActivityEntry | null;
}

export function ClientCard({ client, lastActivity }: ClientCardProps) {
  const navigate = useNavigate();

  return (
    <Card onClick={() => navigate(`/clients/${client.id}`)} className="p-4">
      <div className="flex items-start justify-between mb-2.5">
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

      {lastActivity && (
        <div className="pt-2 border-t border-slate-50 flex items-center gap-1 text-[10px] text-slate-400">
          <Clock size={10} />
          <span className="truncate">{lastActivity.title}</span>
          <span className="shrink-0">· {timeAgo(lastActivity.createdAt)}</span>
        </div>
      )}
    </Card>
  );
}

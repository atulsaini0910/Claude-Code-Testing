import { useNavigate } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatBudget, timeAgo } from '../../lib/utils';
import type { Client, ActivityEntry } from '../../types';

interface ClientCardProps {
  client: Client;
  lastActivity: ActivityEntry | null;
}

export function ClientCard({ client, lastActivity }: ClientCardProps) {
  const navigate = useNavigate();

  return (
    <Card onClick={() => navigate(`/clients/${client.id}`)} className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-slate-800 text-base leading-tight">{client.name}</h3>
          <p className="text-xs text-slate-400 mt-0.5 capitalize">
            {client.propertyType.replace('-', ' ')} · {formatBudget(client.budget.min, client.budget.max)}
          </p>
        </div>
        <Badge value={client.status} />
      </div>

      <div className="space-y-1.5 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <MapPin size={13} className="text-slate-400 shrink-0" />
          <span className="truncate text-xs">{client.locationPreference}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={13} className="text-slate-400 shrink-0" />
          <span className="text-xs">{client.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail size={13} className="text-slate-400 shrink-0" />
          <span className="text-xs truncate">{client.email}</span>
        </div>
      </div>

      {lastActivity && (
        <div className="mt-3 pt-3 border-t border-slate-50 flex items-center gap-1.5 text-xs text-slate-400">
          <Clock size={12} />
          <span className="truncate">{lastActivity.title}</span>
          <span className="shrink-0">· {timeAgo(lastActivity.createdAt)}</span>
        </div>
      )}
    </Card>
  );
}

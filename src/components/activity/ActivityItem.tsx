import { Phone, Mail, Calendar, FileText, MessageSquare, Trash2 } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { timeAgo, formatDate } from '../../lib/utils';
import type { ActivityEntry } from '../../types';

const typeIcon = {
  call: Phone,
  email: Mail,
  meeting: Calendar,
  note: FileText,
  sms: MessageSquare,
};

interface ActivityItemProps {
  entry: ActivityEntry;
  onDelete: (id: string) => void;
}

export function ActivityItem({ entry, onDelete }: ActivityItemProps) {
  const Icon = typeIcon[entry.type];

  return (
    <div className="flex gap-3 group">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
          <Icon size={14} className="text-slate-500" />
        </div>
        <div className="flex-1 w-px bg-slate-100 mt-1" />
      </div>
      <div className="flex-1 pb-5 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge value={entry.type} />
            <span className="text-sm font-medium text-slate-800">{entry.title}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-400" title={formatDate(entry.createdAt)}>
              {timeAgo(entry.createdAt)}
            </span>
            <button
              onClick={() => onDelete(entry.id)}
              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all cursor-pointer"
              title="Delete entry"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
        {entry.body && (
          <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap">{entry.body}</p>
        )}
      </div>
    </div>
  );
}

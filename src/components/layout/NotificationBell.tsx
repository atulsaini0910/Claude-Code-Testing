import { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Briefcase, Users, CheckSquare, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../hooks/useNotifications';
import { timeAgo } from '../../lib/utils';
import { cn } from '../../lib/utils';
import type { Notification } from '../../types';

const typeIcon = {
  task_due:       <CheckSquare size={13} className="text-amber-500" />,
  deal_assigned:  <Briefcase size={13} className="text-indigo-500" />,
  client_assigned:<Users size={13} className="text-emerald-500" />,
  stage_change:   <Briefcase size={13} className="text-blue-500" />,
  info:           <Info size={13} className="text-slate-400" />,
};

const entityPath: Record<string, string> = {
  client: '/clients', deal: '/deals', task: '/tasks', property: '/properties',
};

export function NotificationBell() {
  const { notifications, markRead, markAllRead, unreadCount } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleClick = (n: Notification) => {
    markRead(n.id);
    if (n.entityType && n.entityId) {
      navigate(`${entityPath[n.entityType]}/${n.entityId}`);
    }
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs text-indigo-600 hover:underline cursor-pointer flex items-center gap-1">
                <CheckCheck size={12} /> Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">All caught up!</p>
            ) : (
              notifications.slice(0, 15).map(n => (
                <button
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={cn(
                    'w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 cursor-pointer',
                    !n.isRead && 'bg-indigo-50/40'
                  )}
                >
                  <span className="mt-0.5 shrink-0">{typeIcon[n.type]}</span>
                  <div className="min-w-0 flex-1">
                    <p className={cn('text-xs leading-snug', !n.isRead ? 'font-semibold text-slate-800' : 'text-slate-600')}>
                      {n.title}
                    </p>
                    {n.body && <p className="text-[11px] text-slate-400 mt-0.5 truncate">{n.body}</p>}
                    <p className="text-[10px] text-slate-300 mt-0.5">{timeAgo(n.createdAt)}</p>
                  </div>
                  {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1 shrink-0" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

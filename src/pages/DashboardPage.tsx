import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserCheck, UserX, CheckCircle, Activity } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useSidebar } from '../components/layout/AppShell';
import { useClients } from '../hooks/useClients';
import { useActivityLog } from '../hooks/useActivityLog';
import { timeAgo } from '../lib/utils';

export function DashboardPage() {
  const { open } = useSidebar();
  const { clients } = useClients();
  const { entries } = useActivityLog();

  const stats = useMemo(() => ({
    total: clients.length,
    active: clients.filter((c) => c.status === 'active').length,
    inactive: clients.filter((c) => c.status === 'inactive').length,
    closed: clients.filter((c) => c.status === 'closed').length,
  }), [clients]);

  const recentActivity = useMemo(() => {
    return [...entries]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
  }, [entries]);

  const clientMap = useMemo(
    () => new Map(clients.map((c) => [c.id, c])),
    [clients]
  );

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Dashboard" onMenuClick={open} />
      <div className="flex-1 p-4 md:p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Clients" value={stats.total} icon={<Users size={20} />} color="text-indigo-600" />
          <StatCard label="Active" value={stats.active} icon={<UserCheck size={20} />} color="text-emerald-600" />
          <StatCard label="Inactive" value={stats.inactive} icon={<UserX size={20} />} color="text-amber-600" />
          <StatCard label="Closed Deals" value={stats.closed} icon={<CheckCircle size={20} />} color="text-slate-500" />
        </div>

        {/* Recent Activity */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={16} className="text-slate-500" />
            <h2 className="font-semibold text-slate-800">Recent Activity</h2>
          </div>

          {recentActivity.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No activity yet. Start by adding clients and logging interactions.</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((entry) => {
                const client = clientMap.get(entry.clientId);
                return (
                  <div key={entry.id} className="flex items-start gap-3 py-2 border-b border-slate-50 last:border-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge value={entry.type} />
                        <span className="text-sm font-medium text-slate-700 truncate">{entry.title}</span>
                      </div>
                      {client && (
                        <p className="text-xs text-slate-400 mt-0.5">
                          <Link
                            to={`/clients/${client.id}`}
                            className="text-indigo-600 hover:underline"
                          >
                            {client.name}
                          </Link>
                          {' · '}
                          <Badge value={client.status} className="!text-[10px] !px-1.5 !py-0" />
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 shrink-0">{timeAgo(entry.createdAt)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

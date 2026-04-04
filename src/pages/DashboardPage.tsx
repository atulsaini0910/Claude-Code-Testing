import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserCheck, CheckSquare, TrendingUp, Briefcase, Activity, ArrowRight, Flame } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useSidebar } from '../components/layout/AppShell';
import { useClients } from '../hooks/useClients';
import { useDeals } from '../hooks/useDeals';
import { useActivityLog } from '../hooks/useActivityLog';
import { useTasks } from '../hooks/useTasks';
import { useUsers } from '../hooks/useUsers';
import { timeAgo, formatCurrency } from '../lib/utils';

const STAGE_LABEL: Record<string, string> = {
  inquiry: 'Inquiry', showing: 'Showing', offer: 'Offer',
  under_contract: 'Under Contract', closed_won: 'Closed Won', closed_lost: 'Lost',
};

export function DashboardPage() {
  const { openSidebar, openCommandPalette } = useSidebar();
  const { clients } = useClients();
  const { deals, pipelineValue } = useDeals();
  const { entries } = useActivityLog();
  const { groupedTasks } = useTasks();
  const { currentUser } = useUsers();

  const stats = useMemo(() => ({
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    hot: clients.filter(c => c.leadTemperature === 'hot').length,
    closedDeals: deals.filter(d => d.stage === 'closed_won').length,
    activeDeals: deals.filter(d => d.stage !== 'closed_won' && d.stage !== 'closed_lost').length,
  }), [clients, deals]);

  const recentActivity = useMemo(() =>
    [...entries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8),
  [entries]);

  const clientMap = useMemo(() => new Map(clients.map(c => [c.id, c])), [clients]);

  const todayTasks = groupedTasks.today;
  const overdueTasks = groupedTasks.overdue;

  // Pipeline summary
  const stageGroups = useMemo(() => {
    const active = deals.filter(d => d.stage !== 'closed_won' && d.stage !== 'closed_lost');
    const stages = ['inquiry', 'showing', 'offer', 'under_contract'] as const;
    return stages.map(s => ({
      stage: s,
      label: STAGE_LABEL[s],
      count: active.filter(d => d.stage === s).length,
      value: active.filter(d => d.stage === s).reduce((sum, d) => sum + (d.value ?? 0), 0),
    })).filter(s => s.count > 0);
  }, [deals]);

  return (
    <div className="flex flex-col flex-1">
      <TopBar
        title={currentUser ? `Welcome back, ${currentUser.name.split(' ')[0]}` : 'Dashboard'}
        onMenuClick={openSidebar}
        onSearchClick={openCommandPalette}
      />

      <div className="flex-1 p-4 md:p-6 space-y-5 overflow-y-auto">
        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Clients" value={stats.total} icon={<Users size={18} />} color="text-indigo-600" />
          <StatCard label="Active Clients" value={stats.active} icon={<UserCheck size={18} />} color="text-emerald-600" />
          <StatCard label="Pipeline Value" value={formatCurrency(pipelineValue)} icon={<TrendingUp size={18} />} color="text-blue-600" />
          <StatCard label="Active Deals" value={stats.activeDeals} icon={<Briefcase size={18} />} color="text-purple-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Recent activity */}
          <div className="lg:col-span-2">
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity size={15} className="text-slate-500" />
                  <h2 className="text-sm font-semibold text-slate-800">Recent Activity</h2>
                </div>
                <Link to="/clients" className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
                  View all <ArrowRight size={11} />
                </Link>
              </div>
              {recentActivity.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-6">No activity yet.</p>
              ) : (
                <div className="space-y-2">
                  {recentActivity.map(entry => {
                    const client = clientMap.get(entry.clientId);
                    return (
                      <div key={entry.id} className="flex items-start gap-3 py-2 border-b border-slate-50 last:border-0">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge value={entry.type} />
                            <span className="text-sm text-slate-700 truncate">{entry.title}</span>
                          </div>
                          {client && (
                            <Link to={`/clients/${client.id}`} className="text-xs text-indigo-600 hover:underline mt-0.5 inline-block">
                              {client.name}
                            </Link>
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

          {/* Right column */}
          <div className="space-y-4">
            {/* Tasks due */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckSquare size={14} className="text-slate-500" />
                  <h3 className="text-sm font-semibold text-slate-800">Tasks</h3>
                </div>
                <Link to="/tasks" className="text-xs text-indigo-600 hover:underline">View all</Link>
              </div>
              {overdueTasks.length > 0 && (
                <div className="mb-2 px-2 py-1.5 bg-red-50 rounded-lg text-xs text-red-600 font-medium">
                  {overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''}
                </div>
              )}
              {todayTasks.length === 0 && overdueTasks.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-3">All caught up!</p>
              ) : (
                <div className="space-y-1.5">
                  {[...overdueTasks, ...todayTasks].slice(0, 4).map(t => (
                    <Link
                      key={t.id}
                      to="/tasks"
                      className="flex items-center gap-2 py-1 hover:text-indigo-600 group"
                    >
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        t.priority === 'urgent' ? 'bg-red-500' :
                        t.priority === 'high' ? 'bg-amber-500' : 'bg-slate-300'
                      }`} />
                      <span className="text-xs text-slate-700 truncate group-hover:text-indigo-600">{t.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </Card>

            {/* Hot leads */}
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Flame size={14} className="text-red-500" />
                <h3 className="text-sm font-semibold text-slate-800">Hot Leads</h3>
              </div>
              {clients.filter(c => c.leadTemperature === 'hot' && c.status === 'active').length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-3">No hot leads</p>
              ) : (
                <div className="space-y-1.5">
                  {clients
                    .filter(c => c.leadTemperature === 'hot' && c.status === 'active')
                    .slice(0, 4)
                    .map(c => (
                      <Link key={c.id} to={`/clients/${c.id}`} className="flex items-center justify-between py-1 group">
                        <span className="text-xs text-slate-700 truncate group-hover:text-indigo-600">{c.name}</span>
                        <span className="text-[10px] text-slate-400">{formatCurrency(c.budget.max)}</span>
                      </Link>
                    ))}
                </div>
              )}
            </Card>

            {/* Pipeline stages */}
            {stageGroups.length > 0 && (
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={14} className="text-indigo-500" />
                  <h3 className="text-sm font-semibold text-slate-800">Pipeline</h3>
                </div>
                <div className="space-y-2">
                  {stageGroups.map(s => (
                    <div key={s.stage} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-600">{s.label}</span>
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-500 rounded-full px-1.5">{s.count}</span>
                      </div>
                      {s.value > 0 && <span className="text-xs text-slate-400">{formatCurrency(s.value)}</span>}
                    </div>
                  ))}
                </div>
                <Link to="/deals">
                  <Button size="sm" variant="ghost" className="w-full mt-3 text-xs">View Pipeline →</Button>
                </Link>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

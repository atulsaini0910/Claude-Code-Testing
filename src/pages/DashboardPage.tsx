import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, UserCheck, CheckSquare, TrendingUp, Briefcase, Activity,
  ArrowRight, Flame, DollarSign, AlertCircle, Calendar, Lightbulb,
} from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SuggestionCard } from '../components/dashboard/SuggestionCard';
import { useSidebar } from '../components/layout/AppShell';
import { useClients } from '../hooks/useClients';
import { useDeals } from '../hooks/useDeals';
import { useActivityLog } from '../hooks/useActivityLog';
import { useTasks } from '../hooks/useTasks';
import { useUsers } from '../hooks/useUsers';
import { useShowings } from '../hooks/useShowings';
import { computeSuggestions } from '../lib/suggestions';
import { db } from '../lib/storage';
import { timeAgo, formatCurrency, cn } from '../lib/utils';

const STAGE_LABEL: Record<string, string> = {
  inquiry: 'Inquiry', showing: 'Showing', offer: 'Offer',
  under_contract: 'Under Contract', closed_won: 'Closed Won', closed_lost: 'Lost',
};

export function DashboardPage() {
  const { openSidebar, openCommandPalette } = useSidebar();
  const { clients } = useClients();
  const { deals, pipelineValue } = useDeals();
  const { entries } = useActivityLog();
  const { groupedTasks, tasks } = useTasks();
  const { currentUser } = useUsers();
  const { showings } = useShowings();

  const now = new Date();

  const stats = useMemo(() => ({
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    closedDeals: deals.filter(d => d.stage === 'closed_won').length,
    activeDeals: deals.filter(d => d.stage !== 'closed_won' && d.stage !== 'closed_lost').length,
  }), [clients, deals]);

  // Pipeline revenue forecast (deals closing this month)
  const forecast = useMemo(() => {
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const thisMonth = deals.filter(d =>
      d.closeDate && d.closeDate >= monthStart && d.closeDate <= monthEnd
      && d.stage !== 'closed_lost'
    );
    const value = thisMonth.reduce((s, d) => s + (d.value ?? 0), 0);
    const commission = thisMonth.reduce((s, d) =>
      s + ((d.value ?? 0) * (d.commissionPct ?? 0)) / 100, 0);
    return { count: thisMonth.length, value, commission };
  }, [deals, now]);

  const recentActivity = useMemo(() =>
    [...entries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8),
  [entries]);

  const clientMap = useMemo(() => new Map(clients.map(c => [c.id, c])), [clients]);

  const todayTasks = groupedTasks.today;
  const overdueTasks = groupedTasks.overdue;

  // Follow-up due: clients with no activity in >14 days
  const followUpDue = useMemo(() => {
    const entryMap = new Map<string, string>();
    for (const e of entries) {
      const existing = entryMap.get(e.clientId);
      if (!existing || e.createdAt > existing) entryMap.set(e.clientId, e.createdAt);
    }
    const cutoff = Date.now() - 14 * 86400000;
    return clients
      .filter(c => {
        if (c.status !== 'active') return false;
        const last = entryMap.get(c.id);
        return !last || new Date(last).getTime() < cutoff;
      })
      .slice(0, 4);
  }, [clients, entries]);

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

  // Monthly commission (closed this month)
  const monthlyCommission = useMemo(() => {
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    return deals
      .filter(d => d.stage === 'closed_won' && d.updatedAt >= monthStart)
      .reduce((s, d) => s + ((d.value ?? 0) * (d.commissionPct ?? 0)) / 100, 0);
  }, [deals, now]);

  const suggestions = useMemo(() =>
    computeSuggestions(clients, deals, tasks, showings, entries),
  [clients, deals, tasks, showings, entries]);

  // 30-day vs prior-30-day trends for KPI cards
  const trends = useMemo(() => {
    const nowMs = Date.now();
    const ms30 = 30 * 86400000;
    const delta = (a: number, b: number) => {
      if (b === 0 && a === 0) return undefined;
      if (b === 0) return { value: 100, direction: 'up' as const };
      const p = Math.round(((a - b) / b) * 100);
      return { value: Math.abs(p), direction: p > 5 ? 'up' as const : p < -5 ? 'down' as const : 'neutral' as const };
    };
    const cThis = clients.filter(c => nowMs - new Date(c.createdAt).getTime() < ms30).length;
    const cPrior = clients.filter(c => { const d = nowMs - new Date(c.createdAt).getTime(); return d >= ms30 && d < 2 * ms30; }).length;
    const dThis = deals.filter(d => d.stage !== 'closed_lost' && nowMs - new Date(d.createdAt).getTime() < ms30).length;
    const dPrior = deals.filter(d => { const a = nowMs - new Date(d.createdAt).getTime(); return d.stage !== 'closed_lost' && a >= ms30 && a < 2 * ms30; }).length;
    const pThis = deals.filter(d => !['closed_won','closed_lost'].includes(d.stage) && nowMs - new Date(d.createdAt).getTime() < ms30).reduce((s, d) => s + (d.value ?? 0), 0);
    const pPrior = deals.filter(d => { const a = nowMs - new Date(d.createdAt).getTime(); return !['closed_won','closed_lost'].includes(d.stage) && a >= ms30 && a < 2 * ms30; }).reduce((s, d) => s + (d.value ?? 0), 0);
    return { clients: delta(cThis, cPrior), deals: delta(dThis, dPrior), pipeline: delta(pThis, pPrior) };
  }, [clients, deals]);

  // Goals progress
  const goalsProgress = useMemo(() => {
    if (!currentUser) return null;
    const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const goal = db.userGoals.get().find(g => g.userId === currentUser.id && g.month === monthStr);
    if (!goal) return null;
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const closedThisMonth = deals.filter(d => d.stage === 'closed_won' && d.updatedAt >= monthStart && d.assignedTo === currentUser.id).length;
    const commissionThisMonth = deals
      .filter(d => d.stage === 'closed_won' && d.updatedAt >= monthStart && d.assignedTo === currentUser.id)
      .reduce((s, d) => s + ((d.value ?? 0) * (d.commissionPct ?? 0) / 100), 0);
    const activitiesThisMonth = entries.filter(e => {
      const c = clients.find(cl => cl.id === e.clientId);
      return e.createdAt >= monthStart && c?.assignedTo === currentUser.id;
    }).length;
    return {
      closings: { actual: closedThisMonth, goal: goal.closingsGoal },
      revenue: { actual: commissionThisMonth, goal: goal.revenueGoal },
      activities: { actual: activitiesThisMonth, goal: goal.activitiesGoal },
    };
  }, [currentUser, deals, entries, clients, now]);

  const greeting = currentUser ? `Welcome back, ${currentUser.name.split(' ')[0]}` : 'Dashboard';

  return (
    <div className="flex flex-col flex-1">
      <TopBar title={greeting} onMenuClick={openSidebar} onSearchClick={openCommandPalette} />

      <div className="flex-1 p-4 md:p-6 space-y-5 overflow-y-auto">

        {/* AI Suggestions */}
        {suggestions.length > 0 && (
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb size={14} className="text-amber-500" />
              <h2 className="text-sm font-semibold text-slate-800">Suggested Actions</h2>
              <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold ml-auto">
                {suggestions.length} action{suggestions.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {suggestions.map(s => (
                <SuggestionCard key={s.id} suggestion={s} />
              ))}
            </div>
          </Card>
        )}

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Clients" value={stats.total} icon={<Users size={18} />} color="text-indigo-600" trend={trends.clients} />
          <StatCard label="Active Clients" value={stats.active} icon={<UserCheck size={18} />} color="text-emerald-600" />
          <StatCard label="Pipeline Value" value={formatCurrency(pipelineValue)} icon={<TrendingUp size={18} />} color="text-blue-600" trend={trends.pipeline} />
          <StatCard label="Active Deals" value={stats.activeDeals} icon={<Briefcase size={18} />} color="text-purple-600" trend={trends.deals} />
        </div>

        {/* Forecast + Commission row */}
        {(forecast.count > 0 || monthlyCommission > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {forecast.count > 0 && (
              <Card className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-100">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={14} className="text-indigo-500" />
                  <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">Closing This Month</p>
                </div>
                <p className="text-2xl font-bold text-indigo-800">{formatCurrency(forecast.value)}</p>
                <p className="text-xs text-indigo-600 mt-0.5">{forecast.count} deal{forecast.count !== 1 ? 's' : ''} · <span className="font-semibold">{formatCurrency(forecast.commission)} commission</span></p>
              </Card>
            )}
            {monthlyCommission > 0 && (
              <Card className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-100">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign size={14} className="text-emerald-600" />
                  <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Commission Earned (Month)</p>
                </div>
                <p className="text-2xl font-bold text-emerald-800">{formatCurrency(monthlyCommission)}</p>
                <p className="text-xs text-emerald-600 mt-0.5">{deals.filter(d => d.stage === 'closed_won').length} total closed deals</p>
              </Card>
            )}
          </div>
        )}

        {/* Monthly Goals Progress */}
        {goalsProgress && (
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp size={15} className="text-indigo-500" />
                <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Monthly Goals</h2>
              </div>
              <Link to="/settings" className="text-xs text-indigo-600 hover:underline">Edit goals</Link>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Closings', actual: goalsProgress.closings.actual, goal: goalsProgress.closings.goal, format: (v: number) => String(v), color: 'bg-emerald-500' },
                { label: 'Commission', actual: goalsProgress.revenue.actual, goal: goalsProgress.revenue.goal, format: (v: number) => formatCurrency(v), color: 'bg-indigo-500' },
                { label: 'Activities', actual: goalsProgress.activities.actual, goal: goalsProgress.activities.goal, format: (v: number) => String(v), color: 'bg-purple-500' },
              ].map(g => {
                const pct = g.goal > 0 ? Math.min(100, Math.round((g.actual / g.goal) * 100)) : 0;
                return (
                  <div key={g.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-500 dark:text-slate-400">{g.label}</span>
                      <span className={cn('text-xs font-bold', pct >= 100 ? 'text-emerald-600' : pct >= 60 ? 'text-indigo-600' : 'text-slate-600 dark:text-slate-300')}>{pct}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className={cn('h-full rounded-full transition-all', g.color, pct >= 100 && 'bg-emerald-500')} style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">{g.format(g.actual)} / {g.format(g.goal)}</p>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

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
            {/* Follow-up due */}
            {followUpDue.length > 0 && (
              <Card className="p-4 border-amber-100">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle size={14} className="text-amber-500" />
                  <h3 className="text-sm font-semibold text-slate-800">Follow-up Due</h3>
                </div>
                <div className="space-y-1.5">
                  {followUpDue.map(c => {
                    const last = entries.filter(e => e.clientId === c.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
                    const days = last ? Math.floor((Date.now() - new Date(last.createdAt).getTime()) / 86400000) : null;
                    return (
                      <Link key={c.id} to={`/clients/${c.id}`} className="flex items-center justify-between py-1 group">
                        <span className="text-xs text-slate-700 truncate group-hover:text-indigo-600">{c.name}</span>
                        <span className={cn('text-[10px] font-semibold shrink-0', days && days > 21 ? 'text-red-500' : 'text-amber-600')}>
                          {days ? `${days}d ago` : 'never'}
                        </span>
                      </Link>
                    );
                  })}
                </div>
                <Link to="/clients">
                  <Button size="sm" variant="ghost" className="w-full mt-2 text-xs">View All →</Button>
                </Link>
              </Card>
            )}

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
                <p className="text-xs text-slate-400 text-center py-3">All caught up! 🎉</p>
              ) : (
                <div className="space-y-1.5">
                  {[...overdueTasks, ...todayTasks].slice(0, 4).map(t => (
                    <Link key={t.id} to="/tasks" className="flex items-center gap-2 py-1 hover:text-indigo-600 group">
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

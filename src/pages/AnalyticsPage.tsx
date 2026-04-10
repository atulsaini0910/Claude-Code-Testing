import { useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Users, Briefcase, CheckSquare, DollarSign, Award, Calendar } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { useSidebar } from '../components/layout/AppShell';
import { useClients } from '../hooks/useClients';
import { useDeals } from '../hooks/useDeals';
import { useActivityLog } from '../hooks/useActivityLog';
import { useTasks } from '../hooks/useTasks';
import { useUsers } from '../hooks/useUsers';
import { formatCurrency } from '../lib/utils';

const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

type DateRange = '7d' | '30d' | '90d' | '365d' | 'all';
const DATE_RANGES: { key: DateRange; label: string }[] = [
  { key: '7d', label: 'Last 7 days' },
  { key: '30d', label: 'Last 30 days' },
  { key: '90d', label: 'Last 90 days' },
  { key: '365d', label: 'This year' },
  { key: 'all', label: 'All time' },
];

function rangeStart(range: DateRange): number {
  if (range === 'all') return 0;
  const days = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 365;
  return Date.now() - days * 86400000;
}

export function AnalyticsPage() {
  const { openSidebar, openCommandPalette } = useSidebar();
  const { clients } = useClients();
  const { deals: allDeals } = useDeals();
  const { entries: allEntries } = useActivityLog();
  const { tasks, groupedTasks } = useTasks();
  const { users } = useUsers();
  const [dateRange, setDateRange] = useState<DateRange>('30d');

  const cutoff = rangeStart(dateRange);
  const deals = useMemo(() => cutoff === 0 ? allDeals : allDeals.filter(d => new Date(d.updatedAt).getTime() >= cutoff), [allDeals, cutoff]);
  const entries = useMemo(() => cutoff === 0 ? allEntries : allEntries.filter(e => new Date(e.createdAt).getTime() >= cutoff), [allEntries, cutoff]);

  // Pipeline funnel data
  const pipelineData = useMemo(() => {
    const stages = ['inquiry', 'showing', 'offer', 'under_contract', 'closed_won'] as const;
    const labels: Record<string, string> = {
      inquiry: 'Inquiry', showing: 'Showing', offer: 'Offer',
      under_contract: 'Under Contract', closed_won: 'Closed Won',
    };
    return stages.map(s => ({
      stage: labels[s],
      count: deals.filter(d => d.stage === s).length,
      value: deals.filter(d => d.stage === s).reduce((sum, d) => sum + (d.value ?? 0), 0),
    }));
  }, [deals]);

  // Activity by type (last 30 days)
  const activityByType = useMemo(() => {
    const counts: Record<string, number> = { call: 0, email: 0, meeting: 0, note: 0, sms: 0 };
    entries.forEach(e => { counts[e.type] = (counts[e.type] ?? 0) + 1; });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .filter(d => d.value > 0);
  }, [entries]);

  // Weekly activity trend (last 8 weeks)
  const weeklyTrend = useMemo(() => {
    const weeks: { week: string; activities: number; deals: number }[] = [];
    for (let i = 7; i >= 0; i--) {
      const start = new Date(Date.now() - (i + 1) * 7 * 86400000);
      const end = new Date(Date.now() - i * 7 * 86400000);
      const label = `W${8 - i}`;
      const activities = entries.filter(e => {
        const t = new Date(e.createdAt).getTime();
        return t >= start.getTime() && t < end.getTime();
      }).length;
      const dealsClosed = deals.filter(d => {
        if (d.stage !== 'closed_won' || !d.closeDate) return false;
        const t = new Date(d.closeDate).getTime();
        return t >= start.getTime() && t < end.getTime();
      }).length;
      weeks.push({ week: label, activities, deals: dealsClosed });
    }
    return weeks;
  }, [entries, deals]);

  // Source attribution
  const sourceData = useMemo(() => {
    const sources = ['zillow', 'referral', 'open_house', 'website', 'cold_call', 'other'] as const;
    return sources.map(src => {
      const srcClientIds = clients.filter(c => c.source === src).map(c => c.id);
      const srcDeals = deals.filter(d => srcClientIds.includes(d.clientId));
      return {
        source: src.replace('_', ' '),
        won: srcDeals.filter(d => d.stage === 'closed_won').length,
        lost: srcDeals.filter(d => d.stage === 'closed_lost').length,
      };
    }).filter(d => d.won + d.lost > 0);
  }, [clients, deals]);

  // Client status breakdown
  const clientStatusData = useMemo(() => {
    const counts: Record<string, number> = {};
    clients.forEach(c => { counts[c.status] = (counts[c.status] ?? 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [clients]);

  // Agent leaderboard
  const agentStats = useMemo(() => {
    return users
      .filter(u => u.isActive)
      .map(u => {
        const myDeals = deals.filter(d => d.assignedTo === u.id);
        const closedWon = myDeals.filter(d => d.stage === 'closed_won');
        const revenue = closedWon.reduce((s, d) => s + (d.value ?? 0) * ((d.commissionPct ?? 0) / 100), 0);
        const myActivities = entries.filter(e => {
          const client = clients.find(c => c.id === e.clientId);
          return client?.assignedTo === u.id;
        });
        return {
          name: u.name, role: u.role,
          activeDeals: myDeals.filter(d => d.stage !== 'closed_won' && d.stage !== 'closed_lost').length,
          closedDeals: closedWon.length,
          revenue,
          activities: myActivities.length,
        };
      })
      .sort((a, b) => b.closedDeals - a.closedDeals);
  }, [users, deals, entries, clients]);

  const totalRevenue = deals
    .filter(d => d.stage === 'closed_won')
    .reduce((s, d) => s + (d.value ?? 0) * ((d.commissionPct ?? 0) / 100), 0);

  const openTasksCt = tasks.filter(t => t.status === 'open').length;

  return (
    <div className="flex flex-col flex-1">
      <TopBar
        title="Analytics"
        onMenuClick={openSidebar}
        onSearchClick={openCommandPalette}
        actions={
          <div className="flex items-center gap-1.5">
            <Calendar size={13} className="text-slate-400" />
            {DATE_RANGES.map(r => (
              <button
                key={r.key}
                onClick={() => setDateRange(r.key)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${dateRange === r.key ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
              >
                {r.label}
              </button>
            ))}
          </div>
        }
      />

      <div className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Clients" value={clients.length} icon={<Users size={18} />} color="text-indigo-600" />
          <StatCard label="Active Deals" value={deals.filter(d => d.stage !== 'closed_won' && d.stage !== 'closed_lost').length} icon={<Briefcase size={18} />} color="text-blue-600" />
          <StatCard label="Commission Earned" value={formatCurrency(totalRevenue)} icon={<DollarSign size={18} />} color="text-emerald-600" />
          <StatCard label="Open Tasks" value={openTasksCt} icon={<CheckSquare size={18} />} color={groupedTasks.overdue.length > 0 ? 'text-red-500' : 'text-amber-600'} />
        </div>

        {/* Pipeline funnel + Activity by type */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Pipeline Funnel</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={pipelineData} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis type="category" dataKey="stage" tick={{ fontSize: 11, fill: '#64748b' }} width={90} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} name="deals" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4">Activity Mix</h3>
            {activityByType.length === 0 ? (
              <div className="flex items-center justify-center h-[200px] text-sm text-slate-400">No activity data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={activityByType} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65} label={false} labelLine={false} fontSize={11}>
                    {activityByType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v) => [`${v} activities`, '']} />
                  <Legend wrapperStyle={{ fontSize: 11 }} formatter={(v) => v.charAt(0).toUpperCase() + v.slice(1)} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>
        </div>

        {/* Weekly activity trend */}
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Weekly Activity & Closed Deals</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="activities" stroke="#6366f1" strokeWidth={2} dot={false} name="Activities" />
              <Line type="monotone" dataKey="deals" stroke="#10b981" strokeWidth={2} dot={false} name="Closed Deals" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Agent leaderboard */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Award size={15} className="text-amber-500" />
            <h3 className="text-sm font-semibold text-slate-800">Agent Leaderboard</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Agent', 'Active Deals', 'Closed', 'Activities', 'Commission'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide pb-2 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {agentStats.map((a, i) => (
                  <tr key={a.name} className="border-b border-slate-50 last:border-0">
                    <td className="py-2.5 pr-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${i === 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>{i + 1}</span>
                        <span className="font-medium text-slate-800">{a.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 pr-4 text-slate-600">{a.activeDeals}</td>
                    <td className="py-2.5 pr-4">
                      <span className="font-semibold text-emerald-600">{a.closedDeals}</span>
                    </td>
                    <td className="py-2.5 pr-4 text-slate-600">{a.activities}</td>
                    <td className="py-2.5 font-semibold text-slate-800">{formatCurrency(a.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Client status + Win/Loss */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Client Status Breakdown</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={clientStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Clients">
                  {clientStatusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Quick Stats</h3>
            <div className="space-y-3">
              {[
                { label: 'Hot leads', value: clients.filter(c => c.leadTemperature === 'hot').length, color: 'text-red-500' },
                { label: 'Pre-approved clients', value: clients.filter(c => c.preApproved).length, color: 'text-emerald-600' },
                { label: 'Deals in offer stage', value: deals.filter(d => d.stage === 'offer').length, color: 'text-amber-600' },
                { label: 'Overdue tasks', value: groupedTasks.overdue.length, color: groupedTasks.overdue.length > 0 ? 'text-red-500' : 'text-slate-500' },
                { label: 'Win rate (closed deals)', value: (() => { const total = deals.filter(d => d.stage === 'closed_won' || d.stage === 'closed_lost').length; return total > 0 ? `${Math.round((deals.filter(d => d.stage === 'closed_won').length / total) * 100)}%` : '—'; })(), color: 'text-indigo-600' },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{s.label}</span>
                  <span className={`text-sm font-bold ${s.color}`}>{s.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Pipeline velocity */}
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Pipeline Stage Velocity (avg days per stage)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {(['inquiry', 'showing', 'offer', 'under_contract'] as const).map(stage => {
              const stageDeals = deals.filter(d => d.stageHistory && d.stageHistory.length > 1);
              const avgDays = stageDeals.length > 0
                ? (() => {
                    const times: number[] = [];
                    stageDeals.forEach(d => {
                      const hist = d.stageHistory!;
                      const idx = hist.findIndex(h => h.stage === stage);
                      if (idx >= 0 && idx < hist.length - 1) {
                        const ms = new Date(hist[idx + 1].enteredAt).getTime() - new Date(hist[idx].enteredAt).getTime();
                        times.push(ms / 86400000);
                      }
                    });
                    return times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : null;
                  })()
                : null;
              const STAGE_LABELS2: Record<string, string> = { inquiry: 'Inquiry', showing: 'Showing', offer: 'Offer', under_contract: 'Under Contract' };
              return (
                <div key={stage} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 text-center">
                  <p className="text-xs text-slate-500 mb-1">{STAGE_LABELS2[stage]}</p>
                  <p className="text-2xl font-bold text-slate-800">{avgDays ?? '—'}</p>
                  <p className="text-[10px] text-slate-400">avg days</p>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Win/Loss analysis */}
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Win / Loss Analysis</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-emerald-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-emerald-700">{deals.filter(d => d.stage === 'closed_won').length}</p>
              <p className="text-xs text-emerald-600 font-medium mt-1">Deals Won</p>
              <p className="text-xs text-slate-400 mt-0.5">{formatCurrency(deals.filter(d => d.stage === 'closed_won').reduce((s, d) => s + ((d.value ?? 0) * (d.commissionPct ?? 0) / 100), 0))} commission</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-red-600">{deals.filter(d => d.stage === 'closed_lost').length}</p>
              <p className="text-xs text-red-600 font-medium mt-1">Deals Lost</p>
              <p className="text-xs text-slate-400 mt-0.5">{deals.filter(d => d.stage === 'closed_lost').reduce((s, d) => s + (d.value ?? 0), 0) > 0 ? formatCurrency(deals.filter(d => d.stage === 'closed_lost').reduce((s, d) => s + (d.value ?? 0), 0)) + ' potential' : 'No value logged'}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 text-center">
              {(() => {
                const total = deals.filter(d => d.stage === 'closed_won' || d.stage === 'closed_lost').length;
                const won = deals.filter(d => d.stage === 'closed_won').length;
                const rate = total > 0 ? Math.round((won / total) * 100) : 0;
                return (
                  <>
                    <p className="text-3xl font-bold text-slate-800">{rate}%</p>
                    <p className="text-xs text-slate-600 font-medium mt-1">Win Rate</p>
                    <p className="text-xs text-slate-400 mt-0.5">{total} closed deals total</p>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Source attribution */}
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Deals by Lead Source</h4>
          {sourceData.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">No closed deals with source data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={sourceData} margin={{ left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="source" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="won" name="Won" fill="#10b981" radius={[3, 3, 0, 0]} />
                <Bar dataKey="lost" name="Lost" fill="#ef4444" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>
    </div>
  );
}

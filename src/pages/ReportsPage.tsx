import { useState, useMemo } from 'react';
import { Download, Printer, DollarSign, TrendingUp, Award, BarChart2 } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useSidebar } from '../components/layout/AppShell';
import { useDeals } from '../hooks/useDeals';
import { useClients } from '../hooks/useClients';
import { useUsers } from '../hooks/useUsers';
import { formatCurrency, cn } from '../lib/utils';
import { exportDealsCSV } from '../lib/csvExport';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

const MONTHS = Array.from({ length: 12 }, (_, i) => {
  const d = new Date();
  d.setMonth(d.getMonth() - i);
  return {
    label: d.toLocaleString('default', { month: 'long', year: 'numeric' }),
    value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
  };
});

export function ReportsPage() {
  const { openSidebar, openCommandPalette } = useSidebar();
  const { deals } = useDeals();
  const { clients } = useClients();
  const { users } = useUsers();
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[0].value);
  const [agentFilter, setAgentFilter] = useState<string>('all');

  const monthStart = `${selectedMonth}-01`;
  const monthEnd = `${selectedMonth}-31`;

  const closedDeals = useMemo(() =>
    deals.filter(d =>
      d.stage === 'closed_won' &&
      d.updatedAt >= monthStart &&
      d.updatedAt <= monthEnd &&
      (agentFilter === 'all' || d.assignedTo === agentFilter)
    ),
  [deals, monthStart, monthEnd, agentFilter]);

  const stats = useMemo(() => {
    const totalVolume = closedDeals.reduce((s, d) => s + (d.value ?? 0), 0);
    const totalCommission = closedDeals.reduce((s, d) => s + ((d.value ?? 0) * (d.commissionPct ?? 0) / 100), 0);
    const totalNetCommission = closedDeals.reduce((s, d) => {
      const gross = (d.value ?? 0) * (d.commissionPct ?? 0) / 100;
      return s + (d.agentSplitPct ? gross * d.agentSplitPct / 100 : gross);
    }, 0);
    const avgCommission = closedDeals.length > 0 ? totalCommission / closedDeals.length : 0;
    const avgDaysToClose = (() => {
      const times = closedDeals.filter(d => d.stageHistory?.length).map(d => {
        const first = d.stageHistory![0].enteredAt;
        return Math.floor((new Date(d.updatedAt).getTime() - new Date(first).getTime()) / 86400000);
      });
      return times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : null;
    })();
    return { totalVolume, totalCommission, totalNetCommission, avgCommission, avgDaysToClose };
  }, [closedDeals]);

  // Per-agent breakdown
  const agentBreakdown = useMemo(() => {
    const allClosed = deals.filter(d =>
      d.stage === 'closed_won' && d.updatedAt >= monthStart && d.updatedAt <= monthEnd
    );
    return users
      .filter(u => u.isActive)
      .map(u => {
        const myDeals = allClosed.filter(d => d.assignedTo === u.id);
        const volume = myDeals.reduce((s, d) => s + (d.value ?? 0), 0);
        const commission = myDeals.reduce((s, d) => s + ((d.value ?? 0) * (d.commissionPct ?? 0) / 100), 0);
        return { id: u.id, name: u.name, deals: myDeals.length, volume, commission };
      })
      .filter(a => a.deals > 0)
      .sort((a, b) => b.commission - a.commission);
  }, [deals, users, monthStart, monthEnd]);

  // Monthly commission trend (last 6 months)
  const trend = useMemo(() => {
    return MONTHS.slice(0, 6).reverse().map(m => {
      const s = `${m.value}-01`;
      const e = `${m.value}-31`;
      const commission = deals
        .filter(d => d.stage === 'closed_won' && d.updatedAt >= s && d.updatedAt <= e)
        .reduce((sum, d) => sum + ((d.value ?? 0) * (d.commissionPct ?? 0) / 100), 0);
      return { month: m.label.split(' ')[0], commission };
    });
  }, [deals]);

  const handlePrint = () => window.print();
  const handleExport = () => exportDealsCSV(closedDeals, `commission-report-${selectedMonth}.csv`);

  const clientMap = new Map(clients.map(c => [c.id, c]));
  const userMap = new Map(users.map(u => [u.id, u]));

  return (
    <div className="flex flex-col flex-1">
      <TopBar
        title="Commission Report"
        onMenuClick={openSidebar}
        onSearchClick={openCommandPalette}
        actions={
          <div className="flex items-center gap-2 no-print">
            <Button variant="secondary" size="sm" onClick={handlePrint}>
              <Printer size={14} /> Print
            </Button>
            <Button variant="secondary" size="sm" onClick={handleExport} disabled={closedDeals.length === 0}>
              <Download size={14} /> Export CSV
            </Button>
          </div>
        }
      />

      <div className="flex-1 p-4 md:p-6 space-y-5 overflow-y-auto">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 no-print">
          <div className="flex flex-col gap-0.5">
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Month</label>
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-0.5">
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Agent</label>
            <select
              value={agentFilter}
              onChange={e => setAgentFilter(e.target.value)}
              className="rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="all">All Agents</option>
              {users.filter(u => u.isActive).map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
        </div>

        {/* Report header for print */}
        <div className="hidden print:block mb-4">
          <h1 className="text-2xl font-bold text-slate-900">Commission Report</h1>
          <p className="text-sm text-slate-500">{MONTHS.find(m => m.value === selectedMonth)?.label} · {agentFilter === 'all' ? 'All Agents' : userMap.get(agentFilter)?.name}</p>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Deals Closed', value: closedDeals.length, icon: <Award size={18} />, color: 'text-emerald-600' },
            { label: 'Total Volume', value: formatCurrency(stats.totalVolume), icon: <BarChart2 size={18} />, color: 'text-blue-600' },
            { label: 'Gross Commission', value: formatCurrency(stats.totalCommission), icon: <DollarSign size={18} />, color: 'text-indigo-600' },
            { label: 'Net Commission', value: formatCurrency(stats.totalNetCommission), icon: <TrendingUp size={18} />, color: 'text-purple-600' },
          ].map(s => (
            <Card key={s.label} className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={cn('w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-700 flex items-center justify-center', s.color)}>
                  {s.icon}
                </div>
              </div>
              <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{s.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Commission trend chart */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4">Commission Trend (6 months)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip
                  formatter={(v) => formatCurrency(Number(v))}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="commission" name="Commission" radius={[4, 4, 0, 0]}>
                  {trend.map((_, i) => (
                    <Cell key={i} fill={i === trend.length - 1 ? '#6366f1' : '#c7d2fe'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Agent leaderboard for the month */}
          {agentBreakdown.length > 0 && (
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4">Agent Breakdown</h3>
              <div className="space-y-3">
                {agentBreakdown.map((a, i) => (
                  <div key={a.id} className="flex items-center gap-3">
                    <span className={cn('w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0', i === 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 dark:bg-slate-700 text-slate-500')}>{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{a.name}</span>
                        <span className="text-sm font-bold text-emerald-600 shrink-0">{formatCurrency(a.commission)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mt-0.5">
                        <span>{a.deals} deal{a.deals !== 1 ? 's' : ''}</span>
                        <span>Vol: {formatCurrency(a.volume)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Deal-by-deal table */}
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4">
            Closed Deals Detail {closedDeals.length > 0 && <span className="text-slate-400 font-normal">({closedDeals.length})</span>}
          </h3>
          {closedDeals.length === 0 ? (
            <div className="text-center py-10">
              <DollarSign size={32} className="mx-auto text-slate-200 dark:text-slate-600 mb-3" />
              <p className="text-sm text-slate-400">No closed deals in {MONTHS.find(m => m.value === selectedMonth)?.label}.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700">
                    {['Deal', 'Client', 'Agent', 'Value', 'Comm. %', 'Gross Comm.', 'Net Comm.', 'Closed'].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide pb-2 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {closedDeals.map(d => {
                    const gross = (d.value ?? 0) * (d.commissionPct ?? 0) / 100;
                    const net = d.agentSplitPct ? gross * d.agentSplitPct / 100 : gross;
                    const client = clientMap.get(d.clientId);
                    const agent = userMap.get(d.assignedTo ?? '');
                    return (
                      <tr key={d.id} className="border-b border-slate-50 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                        <td className="py-3 pr-4 font-medium text-slate-800 dark:text-slate-100 max-w-40 truncate">{d.title}</td>
                        <td className="py-3 pr-4 text-slate-600 dark:text-slate-400">{client?.name ?? '—'}</td>
                        <td className="py-3 pr-4 text-slate-600 dark:text-slate-400">{agent?.name ?? '—'}</td>
                        <td className="py-3 pr-4 font-semibold text-slate-700 dark:text-slate-200">{d.value ? formatCurrency(d.value) : '—'}</td>
                        <td className="py-3 pr-4 text-slate-500">{d.commissionPct ?? '—'}%</td>
                        <td className="py-3 pr-4 text-indigo-600 dark:text-indigo-400 font-semibold">{formatCurrency(gross)}</td>
                        <td className="py-3 pr-4 text-emerald-600 font-bold">{formatCurrency(net)}</td>
                        <td className="py-3 text-slate-500 dark:text-slate-400 text-xs">{d.updatedAt.slice(0, 10)}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-200 dark:border-slate-600">
                    <td colSpan={3} className="pt-3 text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide">Total</td>
                    <td className="pt-3 pr-4 font-bold text-slate-700 dark:text-slate-200">{formatCurrency(stats.totalVolume)}</td>
                    <td />
                    <td className="pt-3 pr-4 font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(stats.totalCommission)}</td>
                    <td className="pt-3 font-bold text-emerald-600">{formatCurrency(stats.totalNetCommission)}</td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </Card>

        {/* Avg days to close */}
        {stats.avgDaysToClose !== null && (
          <Card className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
              <TrendingUp size={18} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Average Days to Close</p>
              <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{stats.avgDaysToClose} days</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

import { useState, useMemo } from 'react';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { generateClientSummary } from '../../lib/ai';
import type { Client, ActivityEntry, Deal } from '../../types';

const ACTIVITY_COLORS: Record<string, string> = {
  call: '#6366f1',
  email: '#0ea5e9',
  meeting: '#10b981',
  note: '#f59e0b',
  sms: '#ec4899',
};

const ACTIVITY_TYPES = ['call', 'email', 'meeting', 'note', 'sms'] as const;

function buildBarData(entries: ActivityEntry[]) {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const prefix = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    return {
      month: d.toLocaleString('default', { month: 'short' }),
      count: entries.filter(e => e.createdAt.startsWith(prefix)).length,
    };
  });
}

interface Props {
  client: Client;
  entries: ActivityEntry[];
  deals: Deal[];
}

export function ClientSummaryCard({ client, entries, deals }: Props) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY ?? '';

  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pieData = useMemo(() =>
    ACTIVITY_TYPES
      .map(type => ({ name: type.charAt(0).toUpperCase() + type.slice(1), value: entries.filter(e => e.type === type).length, color: ACTIVITY_COLORS[type] }))
      .filter(d => d.value > 0),
  [entries]);

  const barData = useMemo(() => buildBarData(entries), [entries]);

  const handleGenerate = async () => {
    if (!apiKey) {
      setError('Set VITE_ANTHROPIC_API_KEY in your .env file to use AI features.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const text = await generateClientSummary(client, entries, deals, apiKey);
      setSummary(text);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate summary.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-5 mt-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-indigo-500" />
          <h3 className="text-sm font-semibold text-slate-700">AI Client Summary</h3>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
          {loading ? 'Generating…' : summary ? 'Regenerate' : 'Generate Summary'}
        </Button>
      </div>

      {error && (
        <div className="flex items-start gap-2 text-red-600 bg-red-50 rounded-lg p-3 text-xs mb-4">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {summary && (
        <blockquote className="border-l-4 border-indigo-300 pl-4 text-sm text-slate-700 leading-relaxed italic bg-indigo-50/50 py-3 pr-3 rounded-r-lg mb-5">
          {summary}
        </blockquote>
      )}

      {/* Charts — always visible */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
        {/* Pie: Activity breakdown */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Activity Breakdown</p>
          {pieData.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">No activities yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65} innerRadius={30}>
                  {pieData.map(entry => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: unknown) => [typeof v === 'number' ? v : String(v), '']} />
                <Legend iconSize={10} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bar: Monthly activity */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Activity (Last 6 Months)</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" name="Activities" fill="#6366f1" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}

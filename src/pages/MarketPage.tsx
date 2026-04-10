import { useState, useMemo } from 'react';
import { Plus, TrendingUp, Trash2, BarChart2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TopBar } from '../components/layout/TopBar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useSidebar } from '../components/layout/AppShell';
import { useMarketData } from '../hooks/useMarketData';
import { formatCurrency } from '../lib/utils';
import type { MarketData } from '../types';
import toast from 'react-hot-toast';

const defaultForm = {
  area: '', month: new Date().toISOString().slice(0, 7),
  medianPrice: '', daysOnMarket: '', listToSaleRatio: '', inventory: '',
};

export function MarketPage() {
  const { openSidebar, openCommandPalette } = useSidebar();
  const { marketData, addEntry, deleteEntry, getAreasWithData, getDataForArea } = useMarketData();

  const [showModal, setShowModal] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);

  const areas = getAreasWithData();

  const activeArea = selectedArea ?? areas[0] ?? null;
  const areaData = activeArea ? getDataForArea(activeArea) : [];

  const latestEntry = areaData[areaData.length - 1];

  const chartData = useMemo(() =>
    areaData.map(e => ({
      month: e.month.slice(0, 7),
      'Median Price': e.medianPrice,
      'Days on Market': e.daysOnMarket,
      'Inventory': e.inventory,
    })),
  [areaData]);

  const handleAdd = () => {
    if (!form.area.trim() || !form.month || !form.medianPrice) {
      toast.error('Area, month, and median price are required');
      return;
    }
    addEntry({
      area: form.area.trim(),
      month: form.month,
      medianPrice: Number(form.medianPrice),
      daysOnMarket: Number(form.daysOnMarket) || 0,
      listToSaleRatio: Number(form.listToSaleRatio) || 0,
      inventory: Number(form.inventory) || 0,
    });
    setShowModal(false);
    setForm(defaultForm);
    toast.success('Market data added');
  };

  const handleDelete = (entry: MarketData) => {
    if (!confirm(`Delete ${entry.area} — ${entry.month}?`)) return;
    deleteEntry(entry.id);
    toast.success('Entry deleted');
  };

  return (
    <div className="flex flex-col flex-1">
      <TopBar
        title="Market Pulse"
        onMenuClick={openSidebar}
        onSearchClick={openCommandPalette}
        actions={
          <Button size="sm" onClick={() => setShowModal(true)}>
            <Plus size={14} /> Add Data
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">

        {marketData.length === 0 ? (
          <Card className="p-12 text-center">
            <BarChart2 size={32} className="text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-600 mb-1">No market data yet</h3>
            <p className="text-xs text-slate-400 mb-4">Add monthly market statistics for your target areas to track trends.</p>
            <Button onClick={() => setShowModal(true)}><Plus size={14} /> Add First Data Point</Button>
          </Card>
        ) : (
          <>
            {/* Area selector */}
            <div className="flex gap-2 flex-wrap">
              {areas.map(area => (
                <button
                  key={area}
                  onClick={() => setSelectedArea(area)}
                  className={`text-xs px-3 py-1.5 rounded-full border font-medium cursor-pointer transition-colors ${
                    area === activeArea
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'border-slate-200 text-slate-600 hover:border-indigo-300'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>

            {/* Current stats */}
            {latestEntry && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Card className="p-3 text-center">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Median Price</p>
                  <p className="text-lg font-bold text-slate-800">{formatCurrency(latestEntry.medianPrice)}</p>
                  <p className="text-[10px] text-slate-400">{latestEntry.month}</p>
                </Card>
                <Card className="p-3 text-center">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Days on Market</p>
                  <p className="text-lg font-bold text-slate-800">{latestEntry.daysOnMarket}</p>
                  <p className="text-[10px] text-slate-400">avg days</p>
                </Card>
                <Card className="p-3 text-center">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">List/Sale Ratio</p>
                  <p className="text-lg font-bold text-slate-800">{latestEntry.listToSaleRatio > 0 ? `${(latestEntry.listToSaleRatio * 100).toFixed(1)}%` : '—'}</p>
                  <p className="text-[10px] text-slate-400">of list price</p>
                </Card>
                <Card className="p-3 text-center">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Inventory</p>
                  <p className="text-lg font-bold text-slate-800">{latestEntry.inventory}</p>
                  <p className="text-[10px] text-slate-400">active listings</p>
                </Card>
              </div>
            )}

            {/* Charts */}
            {chartData.length > 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp size={13} className="text-indigo-500" />
                    <h3 className="text-xs font-semibold text-slate-800">Median Price Trend</h3>
                  </div>
                  <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(v: unknown) => typeof v === 'number' ? formatCurrency(v) : String(v)} />
                      <Line type="monotone" dataKey="Median Price" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart2 size={13} className="text-emerald-500" />
                    <h3 className="text-xs font-semibold text-slate-800">Days on Market + Inventory</h3>
                  </div>
                  <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="Days on Market" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="Inventory" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            )}

            {/* Data table */}
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">All Data — {activeArea}</h3>
              {areaData.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No data for this area</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-100">
                        {['Month', 'Median Price', 'Days on Mkt', 'List/Sale %', 'Inventory', ''].map(h => (
                          <th key={h} className="text-left py-2 px-2 text-slate-500 dark:text-slate-400 font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[...areaData].reverse().map(e => (
                        <tr key={e.id} className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 group">
                          <td className="py-2 px-2 font-medium text-slate-700 dark:text-slate-200">{e.month}</td>
                          <td className="py-2 px-2 text-slate-600 dark:text-slate-400">{formatCurrency(e.medianPrice)}</td>
                          <td className="py-2 px-2 text-slate-600 dark:text-slate-400">{e.daysOnMarket || '—'}</td>
                          <td className="py-2 px-2 text-slate-600 dark:text-slate-400">{e.listToSaleRatio > 0 ? `${(e.listToSaleRatio * 100).toFixed(1)}%` : '—'}</td>
                          <td className="py-2 px-2 text-slate-600 dark:text-slate-400">{e.inventory || '—'}</td>
                          <td className="py-2 px-2 text-right">
                            <button
                              onClick={() => handleDelete(e)}
                              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 text-slate-300 hover:text-red-400 cursor-pointer transition-opacity"
                            >
                              <Trash2 size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </>
        )}
      </div>

      {/* Add Modal */}
      {showModal && (
        <Modal title="Add Market Data" onClose={() => { setShowModal(false); setForm(defaultForm); }}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">Area / Market *</label>
                <input
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="e.g. Downtown Austin, TX"
                  value={form.area}
                  onChange={e => setForm(p => ({ ...p, area: e.target.value }))}
                  list="area-datalist"
                />
                <datalist id="area-datalist">
                  {areas.map(a => <option key={a} value={a} />)}
                </datalist>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">Month *</label>
                <input
                  type="month"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  value={form.month}
                  onChange={e => setForm(p => ({ ...p, month: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">Median Price ($) *</label>
                <input
                  type="number"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="450000"
                  value={form.medianPrice}
                  onChange={e => setForm(p => ({ ...p, medianPrice: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">Avg Days on Market</label>
                <input
                  type="number"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="28"
                  value={form.daysOnMarket}
                  onChange={e => setForm(p => ({ ...p, daysOnMarket: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">List/Sale Ratio (e.g. 0.97)</label>
                <input
                  type="number"
                  step="0.01"
                  max="2"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="0.97"
                  value={form.listToSaleRatio}
                  onChange={e => setForm(p => ({ ...p, listToSaleRatio: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">Active Listings (Inventory)</label>
                <input
                  type="number"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="142"
                  value={form.inventory}
                  onChange={e => setForm(p => ({ ...p, inventory: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => { setShowModal(false); setForm(defaultForm); }}>Cancel</Button>
              <Button onClick={handleAdd}>Add Data Point</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

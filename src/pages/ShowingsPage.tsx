import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, Clock, ChevronLeft, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useSidebar } from '../components/layout/AppShell';
import { useShowings } from '../hooks/useShowings';
import { useClients } from '../hooks/useClients';
import { useDeals } from '../hooks/useDeals';
import { useProperties } from '../hooks/useProperties';
import { cn, formatDate } from '../lib/utils';
import type { Showing } from '../types';
import toast from 'react-hot-toast';

const STATUS_COLOR: Record<Showing['status'], string> = {
  scheduled: 'bg-blue-100 text-blue-700 border-blue-200',
  completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  cancelled: 'bg-slate-100 text-slate-500 border-slate-200',
};

const FEEDBACK_ICON: Record<string, string> = {
  loved: '❤️', liked: '👍', neutral: '😐', not_interested: '👎',
};

function getWeekDays(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });
}

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export function ShowingsPage() {
  const { openSidebar, openCommandPalette } = useSidebar();
  const { showings, addShowing, updateShowing, deleteShowing } = useShowings();
  const { clients } = useClients();
  const { deals } = useDeals();
  const { properties } = useProperties();

  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedShowing, setSelectedShowing] = useState<Showing | null>(null);
  const [form, setForm] = useState({
    clientId: '', dealId: '', propertyId: '', scheduledAt: '', agentNotes: '',
  });

  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart]);

  const weekEnd = useMemo(() => {
    const e = new Date(weekStart);
    e.setDate(e.getDate() + 7);
    return e;
  }, [weekStart]);

  const weekShowings = useMemo(() =>
    showings.filter(s => {
      const d = new Date(s.scheduledAt);
      return d >= weekStart && d < weekEnd;
    }),
  [showings, weekStart, weekEnd]);

  const todayShowings = useMemo(() => {
    const today = new Date();
    return showings.filter(s => {
      const d = new Date(s.scheduledAt);
      return d.toDateString() === today.toDateString();
    }).sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));
  }, [showings]);

  const getClient = (id: string) => clients.find(c => c.id === id);
  const getDeal = (id: string) => deals.find(d => d.id === id);
  const getProperty = (id?: string) => id ? properties.find(p => p.id === id) : undefined;

  const showingsForDay = (day: Date) =>
    weekShowings.filter(s => new Date(s.scheduledAt).toDateString() === day.toDateString())
      .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));

  const handleAdd = () => {
    if (!form.clientId || !form.scheduledAt) {
      toast.error('Client and date/time are required');
      return;
    }
    addShowing({
      clientId: form.clientId,
      dealId: form.dealId,
      propertyId: form.propertyId || undefined,
      scheduledAt: form.scheduledAt,
      status: 'scheduled',
      agentNotes: form.agentNotes,
    });
    setShowAddModal(false);
    setForm({ clientId: '', dealId: '', propertyId: '', scheduledAt: '', agentNotes: '' });
    toast.success('Showing scheduled');
  };

  const handleComplete = (id: string) => {
    updateShowing(id, { status: 'completed' });
    toast.success('Marked as completed');
  };

  const handleCancel = (id: string) => {
    updateShowing(id, { status: 'cancelled' });
    toast.success('Showing cancelled');
  };

  const isToday = (d: Date) => d.toDateString() === new Date().toDateString();

  const weekLabel = () => {
    const end = new Date(weekStart);
    end.setDate(end.getDate() + 6);
    if (weekStart.getMonth() === end.getMonth()) {
      return `${MONTH_NAMES[weekStart.getMonth()]} ${weekStart.getDate()}–${end.getDate()}, ${weekStart.getFullYear()}`;
    }
    return `${MONTH_NAMES[weekStart.getMonth()]} ${weekStart.getDate()} – ${MONTH_NAMES[end.getMonth()]} ${end.getDate()}, ${weekStart.getFullYear()}`;
  };

  return (
    <div className="flex flex-col flex-1">
      <TopBar
        title="Showings"
        onMenuClick={openSidebar}
        onSearchClick={openCommandPalette}
        actions={
          <Button size="sm" onClick={() => setShowAddModal(true)}>
            <Plus size={14} /> Schedule Showing
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">

        {/* Today's Showings Banner */}
        {todayShowings.length > 0 && (
          <Card className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-100">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={14} className="text-indigo-600" />
              <h3 className="text-sm font-semibold text-indigo-800">Today's Showings ({todayShowings.length})</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {todayShowings.map(s => {
                const client = getClient(s.clientId);
                const property = getProperty(s.propertyId);
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedShowing(s)}
                    className={cn(
                      'text-left p-3 rounded-lg border text-xs cursor-pointer hover:shadow-sm transition-shadow',
                      STATUS_COLOR[s.status]
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold">{new Date(s.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {s.feedback && <span>{FEEDBACK_ICON[s.feedback]}</span>}
                    </div>
                    <p className="font-medium truncate">{client?.name ?? 'Unknown client'}</p>
                    {property && <p className="text-[10px] opacity-70 truncate">{property.addressLine1}</p>}
                  </button>
                );
              })}
            </div>
          </Card>
        )}

        {/* Week calendar */}
        <Card className="p-4">
          {/* Week nav */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar size={15} className="text-indigo-500" />
              <h3 className="text-sm font-semibold text-slate-800">{weekLabel()}</h3>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => { const d = new Date(weekStart); d.setDate(d.getDate() - 7); setWeekStart(d); }}
                className="p-1.5 rounded hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                onClick={() => setWeekStart(startOfWeek(new Date()))}
                className="text-xs px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer"
              >
                Today
              </button>
              <button
                onClick={() => { const d = new Date(weekStart); d.setDate(d.getDate() + 7); setWeekStart(d); }}
                className="p-1.5 rounded hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>

          {/* Day columns */}
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((day, i) => {
              const dayShowings = showingsForDay(day);
              return (
                <div key={i} className={cn(
                  'min-h-[100px] rounded-lg p-1.5',
                  isToday(day) ? 'bg-indigo-50 border border-indigo-200' : 'bg-slate-50 border border-slate-100'
                )}>
                  {/* Day header */}
                  <div className={cn('text-center mb-1.5', isToday(day) ? 'text-indigo-700' : 'text-slate-500')}>
                    <div className="text-[10px] font-semibold uppercase">{DAY_LABELS[day.getDay()]}</div>
                    <div className={cn('text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center mx-auto',
                      isToday(day) ? 'bg-indigo-600 text-white' : ''
                    )}>{day.getDate()}</div>
                  </div>
                  {/* Showings in this day */}
                  <div className="space-y-0.5">
                    {dayShowings.map(s => {
                      const client = getClient(s.clientId);
                      return (
                        <button
                          key={s.id}
                          onClick={() => setSelectedShowing(s)}
                          className={cn(
                            'w-full text-left text-[9px] font-medium px-1 py-0.5 rounded truncate cursor-pointer',
                            s.status === 'scheduled' ? 'bg-blue-500 text-white' :
                            s.status === 'completed' ? 'bg-emerald-500 text-white' :
                            'bg-slate-300 text-slate-600'
                          )}
                          title={client?.name}
                        >
                          {new Date(s.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {client?.name?.split(' ')[0]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {weekShowings.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-4 mt-2">No showings this week</p>
          )}
        </Card>

        {/* All upcoming showings list */}
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">All Upcoming Showings</h3>
          {showings.filter(s => s.status === 'scheduled').length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">No upcoming showings scheduled</p>
          ) : (
            <div className="space-y-2">
              {showings
                .filter(s => s.status === 'scheduled')
                .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))
                .map(s => {
                  const client = getClient(s.clientId);
                  const deal = getDeal(s.dealId);
                  const property = getProperty(s.propertyId);
                  return (
                    <div key={s.id} className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="flex items-center gap-1 text-xs font-medium text-slate-700">
                            <Clock size={11} className="text-indigo-400" />
                            {formatDate(s.scheduledAt)}
                          </div>
                          {client && (
                            <Link to={`/clients/${client.id}`} className="text-xs font-semibold text-indigo-600 hover:underline">
                              {client.name}
                            </Link>
                          )}
                          {s.feedback && <span className="text-sm">{FEEDBACK_ICON[s.feedback]}</span>}
                        </div>
                        {property && <p className="text-xs text-slate-500 mt-0.5">{property.addressLine1}, {property.city}</p>}
                        {deal && (
                          <Link to={`/deals/${deal.id}`} className="text-[10px] text-slate-400 hover:text-indigo-500 mt-0.5 inline-block">
                            {deal.title}
                          </Link>
                        )}
                        {s.agentNotes && <p className="text-[10px] text-slate-400 mt-0.5 truncate">{s.agentNotes}</p>}
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => handleComplete(s.id)}
                          title="Mark complete"
                          className="p-1 rounded hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 cursor-pointer transition-colors"
                        >
                          <CheckCircle2 size={15} />
                        </button>
                        <button
                          onClick={() => handleCancel(s.id)}
                          title="Cancel showing"
                          className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-500 cursor-pointer transition-colors"
                        >
                          <XCircle size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </Card>
      </div>

      {/* Add Showing Modal */}
      {showAddModal && (
        <Modal title="Schedule Showing" onClose={() => setShowAddModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">Client *</label>
              <select
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={form.clientId}
                onChange={e => setForm(p => ({ ...p, clientId: e.target.value, dealId: '' }))}
              >
                <option value="">Select client…</option>
                {clients.filter(c => c.status === 'active').map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            {form.clientId && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">Linked Deal</label>
                <select
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  value={form.dealId}
                  onChange={e => setForm(p => ({ ...p, dealId: e.target.value }))}
                >
                  <option value="">No deal linked</option>
                  {deals.filter(d => d.clientId === form.clientId && d.stage !== 'closed_won' && d.stage !== 'closed_lost').map(d => (
                    <option key={d.id} value={d.id}>{d.title}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">Property</label>
              <select
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={form.propertyId}
                onChange={e => setForm(p => ({ ...p, propertyId: e.target.value }))}
              >
                <option value="">No property linked</option>
                {properties.filter(p => p.status !== 'sold').map(p => (
                  <option key={p.id} value={p.id}>{p.addressLine1}, {p.city}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">Date & Time *</label>
              <input
                type="datetime-local"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={form.scheduledAt}
                onChange={e => setForm(p => ({ ...p, scheduledAt: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">Agent Notes</label>
              <textarea
                rows={3}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                placeholder="What to highlight, prep notes…"
                value={form.agentNotes}
                onChange={e => setForm(p => ({ ...p, agentNotes: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button onClick={handleAdd}>Schedule</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Showing Detail Modal */}
      {selectedShowing && (
        <Modal title="Showing Detail" onClose={() => setSelectedShowing(null)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Client</p>
                <Link
                  to={`/clients/${selectedShowing.clientId}`}
                  onClick={() => setSelectedShowing(null)}
                  className="font-medium text-indigo-600 hover:underline"
                >
                  {getClient(selectedShowing.clientId)?.name ?? '—'}
                </Link>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Date & Time</p>
                <p className="font-medium">{formatDate(selectedShowing.scheduledAt)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Status</p>
                <Badge value={selectedShowing.status} />
              </div>
              {selectedShowing.propertyId && (
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Property</p>
                  <Link
                    to={`/properties/${selectedShowing.propertyId}`}
                    onClick={() => setSelectedShowing(null)}
                    className="text-xs text-indigo-600 hover:underline"
                  >
                    {getProperty(selectedShowing.propertyId)?.addressLine1}
                  </Link>
                </div>
              )}
            </div>

            {selectedShowing.agentNotes && (
              <div>
                <p className="text-xs text-slate-500 mb-1">Notes</p>
                <p className="text-sm text-slate-700">{selectedShowing.agentNotes}</p>
              </div>
            )}

            {/* Feedback capture */}
            {selectedShowing.status === 'completed' && (
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-2">Client Feedback</p>
                {selectedShowing.feedback ? (
                  <span className="text-2xl">{FEEDBACK_ICON[selectedShowing.feedback]}</span>
                ) : (
                  <div className="flex gap-2 flex-wrap">
                    {(['loved', 'liked', 'neutral', 'not_interested'] as const).map(f => (
                      <button
                        key={f}
                        onClick={() => { updateShowing(selectedShowing.id, { feedback: f }); setSelectedShowing(null); toast.success('Feedback saved'); }}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer transition-colors capitalize"
                      >
                        {FEEDBACK_ICON[f]} {f.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              {selectedShowing.status === 'scheduled' && (
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => { handleComplete(selectedShowing.id); setSelectedShowing(null); }}>
                    <CheckCircle2 size={13} /> Mark Complete
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => { handleCancel(selectedShowing.id); setSelectedShowing(null); }}>
                    Cancel
                  </Button>
                </div>
              )}
              <Button
                size="sm"
                variant="danger"
                className="ml-auto"
                onClick={() => { deleteShowing(selectedShowing.id); setSelectedShowing(null); toast.success('Showing deleted'); }}
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

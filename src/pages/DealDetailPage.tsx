import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Edit2, Trash2, DollarSign, Calendar, User, Home,
  CheckSquare, CheckCircle2, Circle, Plus, Clock, Star,
  ChevronRight, AlertTriangle, TrendingUp,
} from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Drawer } from '../components/ui/Drawer';
import { DealForm } from '../components/deals/DealForm';
import { Modal } from '../components/ui/Modal';
import { useSidebar } from '../components/layout/AppShell';
import { useDeals } from '../hooks/useDeals';
import { useClients } from '../hooks/useClients';
import { useProperties } from '../hooks/useProperties';
import { useActivityLog } from '../hooks/useActivityLog';
import { useTasks } from '../hooks/useTasks';
import { useShowings } from '../hooks/useShowings';
import { useUsers } from '../hooks/useUsers';
import { STAGE_CHECKLISTS } from '../lib/stageChecklists';
import { formatCurrency, formatDate, cn } from '../lib/utils';
import type { Deal, DealStage } from '../types';
import toast from 'react-hot-toast';

const STAGE_ORDER: DealStage[] = ['inquiry', 'showing', 'offer', 'under_contract', 'closed_won'];
const STAGE_LABELS: Record<DealStage, string> = {
  inquiry: 'Inquiry', showing: 'Showing', offer: 'Offer',
  under_contract: 'Under Contract', closed_won: 'Closed Won', closed_lost: 'Closed Lost',
};

function dealProbability(stage: DealStage): number {
  const map: Record<DealStage, number> = {
    inquiry: 10, showing: 25, offer: 55, under_contract: 82, closed_won: 100, closed_lost: 0,
  };
  return map[stage];
}

function probColor(p: number) {
  if (p >= 75) return 'text-emerald-600';
  if (p >= 40) return 'text-amber-600';
  return 'text-red-500';
}

export function DealDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { openSidebar, openCommandPalette } = useSidebar();
  const { updateDeal, deleteDeal, getDeal } = useDeals();
  const { clients } = useClients();
  const { properties } = useProperties();
  const { entries } = useActivityLog();
  const { tasks, addTask, completeTask } = useTasks();
  const { showings, addShowing, updateShowing } = useShowings();
  const { getUserName } = useUsers();

  const [showEdit, setShowEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [tab, setTab] = useState<'overview' | 'activity' | 'tasks' | 'showings'>('overview');
  const [showAddShowing, setShowAddShowing] = useState(false);
  const [showingForm, setShowingForm] = useState({ scheduledAt: '', agentNotes: '', propertyId: '' });
  // checklist: map of itemId -> completed
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  const deal = id ? getDeal(id) : undefined;

  const client = deal ? clients.find(c => c.id === deal.clientId) : undefined;
  const property = deal?.propertyId ? properties.find(p => p.id === deal.propertyId) : undefined;
  const dealActivities = useMemo(() =>
    entries.filter(e => e.dealId === deal?.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [entries, deal?.id]);
  const dealTasks = useMemo(() =>
    tasks.filter(t => t.dealId === deal?.id)
      .sort((a, b) => (a.dueDate ?? '').localeCompare(b.dueDate ?? '')),
    [tasks, deal?.id]);
  const dealShowings = useMemo(() =>
    showings.filter(s => s.dealId === deal?.id)
      .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()),
    [showings, deal?.id]);

  const stageChecklist = deal ? (STAGE_CHECKLISTS[deal.stage] ?? []) : [];
  const checkedCount = stageChecklist.filter(item => checklist[item.id]).length;

  const commission = deal?.value && deal?.commissionPct
    ? (deal.value * deal.commissionPct) / 100
    : null;

  const probability = deal ? dealProbability(deal.stage) : 0;
  const daysInStage = useMemo(() => {
    if (!deal?.stageHistory) return 0;
    const entry = [...deal.stageHistory].reverse().find(h => h.stage === deal.stage);
    if (!entry) return 0;
    return Math.floor((Date.now() - new Date(entry.enteredAt).getTime()) / 86400000);
  }, [deal]);

  if (!deal) {
    return (
      <div className="flex flex-col flex-1">
        <TopBar title="Deal Not Found" onMenuClick={openSidebar} onSearchClick={openCommandPalette} />
        <div className="flex flex-col items-center justify-center flex-1 gap-4">
          <p className="text-slate-500">This deal doesn't exist or was deleted.</p>
          <Button variant="secondary" onClick={() => navigate('/deals')}>
            <ArrowLeft size={14} /> Back to Pipeline
          </Button>
        </div>
      </div>
    );
  }

  const handleUpdate = (data: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => {
    updateDeal(deal.id, data);
    setShowEdit(false);
    toast.success('Deal updated');
  };

  const handleDelete = () => {
    deleteDeal(deal.id);
    navigate('/deals');
    toast.success('Deal deleted');
  };

  const handleAddShowing = () => {
    if (!showingForm.scheduledAt) return;
    addShowing({
      dealId: deal.id,
      clientId: deal.clientId,
      propertyId: showingForm.propertyId || deal.propertyId,
      scheduledAt: showingForm.scheduledAt,
      status: 'scheduled',
      agentNotes: showingForm.agentNotes,
    });
    setShowAddShowing(false);
    setShowingForm({ scheduledAt: '', agentNotes: '', propertyId: '' });
    toast.success('Showing scheduled');
  };

  return (
    <div className="flex flex-col flex-1">
      <TopBar
        title={deal.title}
        onMenuClick={openSidebar}
        onSearchClick={openCommandPalette}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => navigate('/deals')}>
              <ArrowLeft size={14} /> Pipeline
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setShowEdit(true)}>
              <Edit2 size={14} /> Edit
            </Button>
            <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>
              <Trash2 size={14} />
            </Button>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">

        {/* Stage progress bar */}
        <Card className="p-4">
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {STAGE_ORDER.map((s, i) => {
              const active = s === deal.stage;
              const passed = STAGE_ORDER.indexOf(deal.stage) > i;
              const entered = deal.stageHistory?.find(h => h.stage === s);
              return (
                <div key={s} className="flex items-center min-w-0">
                  <div className={cn(
                    'flex flex-col items-center px-3 py-2 rounded-lg text-xs font-medium shrink-0',
                    active ? 'bg-indigo-600 text-white' :
                    passed ? 'bg-emerald-100 text-emerald-700' :
                    'bg-slate-100 text-slate-400',
                  )}>
                    <span>{STAGE_LABELS[s]}</span>
                    {entered && <span className="text-[10px] opacity-70 mt-0.5">{formatDate(entered.enteredAt)}</span>}
                  </div>
                  {i < STAGE_ORDER.length - 1 && (
                    <ChevronRight size={14} className={passed || active ? 'text-slate-400' : 'text-slate-200'} />
                  )}
                </div>
              );
            })}
            {deal.stage === 'closed_lost' && (
              <div className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium bg-red-100 text-red-700 ml-1">
                <AlertTriangle size={12} /> Closed Lost
              </div>
            )}
          </div>
        </Card>

        {/* KPI row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="p-3 text-center">
            <p className="text-xs text-slate-500 mb-1">Deal Value</p>
            <p className="text-lg font-bold text-slate-800">{deal.value ? formatCurrency(deal.value) : '—'}</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xs text-slate-500 mb-1">Commission</p>
            <p className="text-lg font-bold text-emerald-600">{commission ? formatCurrency(commission) : '—'}</p>
            {deal.commissionPct && <p className="text-[10px] text-slate-400">{deal.commissionPct}%</p>}
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xs text-slate-500 mb-1">Close Probability</p>
            <p className={cn('text-lg font-bold', probColor(probability))}>{probability}%</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xs text-slate-500 mb-1">Days in Stage</p>
            <p className={cn('text-lg font-bold', daysInStage > 14 ? 'text-amber-600' : 'text-slate-800')}>{daysInStage}</p>
            {daysInStage > 14 && <p className="text-[10px] text-amber-500">Stalling</p>}
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-slate-200">
          {(['overview', 'activity', 'tasks', 'showings'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors cursor-pointer',
                tab === t ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700',
              )}
            >
              {t} {t === 'tasks' && dealTasks.filter(t => t.status === 'open').length > 0 &&
                <span className="ml-1 text-[10px] bg-amber-100 text-amber-700 rounded-full px-1.5">
                  {dealTasks.filter(t => t.status === 'open').length}
                </span>
              }
            </button>
          ))}
        </div>

        {/* TAB: Overview */}
        {tab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Deal Info */}
            <Card className="p-5 space-y-4">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Deal Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2.5 text-slate-700">
                  <User size={14} className="text-slate-400 shrink-0" />
                  {client ? (
                    <Link to={`/clients/${client.id}`} className="hover:text-indigo-600 font-medium">{client.name}</Link>
                  ) : <span className="text-slate-400">No client linked</span>}
                </div>
                {property && (
                  <div className="flex items-center gap-2.5 text-slate-700">
                    <Home size={14} className="text-slate-400 shrink-0" />
                    <Link to={`/properties/${property.id}`} className="hover:text-indigo-600">
                      {property.addressLine1}, {property.city}
                    </Link>
                  </div>
                )}
                {deal.closeDate && (
                  <div className="flex items-center gap-2.5 text-slate-700">
                    <Calendar size={14} className="text-slate-400 shrink-0" />
                    <span>Close by: <strong>{formatDate(deal.closeDate)}</strong></span>
                  </div>
                )}
                {deal.assignedTo && (
                  <div className="flex items-center gap-2.5 text-slate-700">
                    <User size={14} className="text-slate-400 shrink-0" />
                    <span>Agent: {getUserName(deal.assignedTo)}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Badge value={deal.type} />
                  <Badge value={deal.stage} />
                </div>
              </div>

              {/* Commission Calculator */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign size={13} className="text-emerald-600" />
                  <h4 className="text-xs font-semibold text-slate-600">Commission Breakdown</h4>
                </div>
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Sale Price</span>
                    <span className="font-medium">{deal.value ? formatCurrency(deal.value) : '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Commission Rate</span>
                    <span className="font-medium">{deal.commissionPct ?? '—'}%</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-1 mt-1 font-semibold text-emerald-700 text-sm">
                    <span>Gross Commission</span>
                    <span>{commission ? formatCurrency(commission) : '—'}</span>
                  </div>
                </div>
              </div>

              {deal.notes && (
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-500 mb-1 font-medium">Notes</p>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{deal.notes}</p>
                </div>
              )}
            </Card>

            {/* Stage Checklist */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckSquare size={14} className="text-indigo-500" />
                  <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    {STAGE_LABELS[deal.stage]} Checklist
                  </h3>
                </div>
                <span className="text-xs text-slate-400">{checkedCount}/{stageChecklist.length}</span>
              </div>

              {stageChecklist.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">No checklist for this stage.</p>
              ) : (
                <div className="space-y-2">
                  {stageChecklist.map(item => (
                    <button
                      key={item.id}
                      onClick={() => setChecklist(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                      className="w-full flex items-start gap-2.5 text-left hover:bg-slate-50 rounded-lg p-2 transition-colors cursor-pointer group"
                    >
                      {checklist[item.id]
                        ? <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                        : <Circle size={16} className="text-slate-300 shrink-0 mt-0.5 group-hover:text-slate-400" />
                      }
                      <div>
                        <p className={cn('text-sm font-medium', checklist[item.id] ? 'line-through text-slate-400' : 'text-slate-700')}>
                          {item.label}
                        </p>
                        {item.description && (
                          <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Win probability */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp size={12} className={probColor(probability)} />
                    <span className="text-xs font-medium text-slate-600">Close Probability</span>
                  </div>
                  <span className={cn('text-sm font-bold', probColor(probability))}>{probability}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all', probability >= 75 ? 'bg-emerald-500' : probability >= 40 ? 'bg-amber-400' : 'bg-red-400')}
                    style={{ width: `${probability}%` }}
                  />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* TAB: Activity */}
        {tab === 'activity' && (
          <Card className="p-5">
            {dealActivities.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">No activity logged for this deal yet.</p>
            ) : (
              <div className="space-y-3">
                {dealActivities.map(entry => (
                  <div key={entry.id} className="flex gap-3 py-2 border-b border-slate-50 last:border-0">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge value={entry.type} />
                        <span className="text-sm font-medium text-slate-800">{entry.title}</span>
                      </div>
                      {entry.body && <p className="text-xs text-slate-500 mt-1">{entry.body}</p>}
                    </div>
                    <span className="text-xs text-slate-400 shrink-0">{formatDate(entry.createdAt)}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* TAB: Tasks */}
        {tab === 'tasks' && (
          <div className="space-y-3">
            <div className="flex justify-end">
              <Button size="sm" onClick={() => {
                addTask({ title: 'New task', priority: 'medium', status: 'open', dealId: deal.id, clientId: deal.clientId, assignedTo: deal.assignedTo });
                toast.success('Task added');
              }}>
                <Plus size={14} /> Add Task
              </Button>
            </div>
            {dealTasks.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-sm text-slate-400">No tasks linked to this deal.</p>
              </Card>
            ) : (
              <div className="space-y-2">
                {dealTasks.map(task => (
                  <Card key={task.id} className="p-3 flex items-center gap-3">
                    <button
                      onClick={() => { if (task.status === 'open') { completeTask(task.id); toast.success('Task completed'); } }}
                      className="shrink-0 cursor-pointer"
                    >
                      {task.status === 'completed'
                        ? <CheckCircle2 size={18} className="text-emerald-500" />
                        : <Circle size={18} className="text-slate-300 hover:text-slate-400" />
                      }
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-sm font-medium', task.status === 'completed' && 'line-through text-slate-400')}>{task.title}</p>
                      {task.dueDate && <p className="text-xs text-slate-400">Due: {formatDate(task.dueDate)}</p>}
                    </div>
                    <Badge value={task.priority} />
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: Showings */}
        {tab === 'showings' && (
          <div className="space-y-3">
            <div className="flex justify-end">
              <Button size="sm" onClick={() => setShowAddShowing(true)}>
                <Plus size={14} /> Schedule Showing
              </Button>
            </div>
            {dealShowings.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-sm text-slate-400">No showings scheduled yet.</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {dealShowings.map(showing => (
                  <Card key={showing.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Clock size={13} className="text-slate-400" />
                          <span className="text-sm font-medium text-slate-800">{formatDate(showing.scheduledAt)}</span>
                          <span className={cn(
                            'text-[10px] font-semibold px-2 py-0.5 rounded-full',
                            showing.status === 'scheduled' && 'bg-blue-100 text-blue-700',
                            showing.status === 'completed' && 'bg-emerald-100 text-emerald-700',
                            showing.status === 'cancelled' && 'bg-slate-100 text-slate-500',
                          )}>{showing.status}</span>
                        </div>
                        {showing.feedback && (
                          <div className="flex items-center gap-1.5">
                            <Star size={12} className="text-amber-400" />
                            <span className="text-xs text-slate-600 capitalize">{showing.feedback.replace('_', ' ')}</span>
                          </div>
                        )}
                        {showing.agentNotes && (
                          <p className="text-xs text-slate-500">{showing.agentNotes}</p>
                        )}
                      </div>
                      {showing.status === 'scheduled' && (
                        <div className="flex gap-1">
                          <Button size="sm" variant="secondary" onClick={() => {
                            updateShowing(showing.id, { status: 'completed' });
                            toast.success('Showing marked complete');
                          }}>Complete</Button>
                        </div>
                      )}
                    </div>
                    {/* Feedback capture */}
                    {showing.status === 'completed' && !showing.feedback && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <p className="text-xs text-slate-500 mb-2">Capture client feedback:</p>
                        <div className="flex gap-2 flex-wrap">
                          {(['loved', 'liked', 'neutral', 'not_interested'] as const).map(f => (
                            <button
                              key={f}
                              onClick={() => { updateShowing(showing.id, { feedback: f }); toast.success('Feedback saved'); }}
                              className="text-xs px-2.5 py-1 rounded-full border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 transition-colors capitalize cursor-pointer"
                            >
                              {f.replace('_', ' ')}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Showing Modal */}
      {showAddShowing && (
        <Modal title="Schedule Showing" onClose={() => setShowAddShowing(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Date & Time</label>
              <input
                type="datetime-local"
                value={showingForm.scheduledAt}
                onChange={e => setShowingForm(p => ({ ...p, scheduledAt: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Agent Notes</label>
              <textarea
                rows={3}
                value={showingForm.agentNotes}
                onChange={e => setShowingForm(p => ({ ...p, agentNotes: e.target.value }))}
                placeholder="Preparation notes, what to highlight..."
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setShowAddShowing(false)}>Cancel</Button>
              <Button onClick={handleAddShowing}>Schedule</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Drawer */}
      <Drawer open={showEdit} onClose={() => setShowEdit(false)} title="Edit Deal">
        <DealForm
          initial={deal}
          clients={clients.map(c => ({ id: c.id, name: c.name }))}
          properties={properties.map(p => ({ id: p.id, addressLine1: p.addressLine1, city: p.city }))}
          onSubmit={handleUpdate}
          onCancel={() => setShowEdit(false)}
        />
      </Drawer>

      {/* Delete Confirm */}
      {confirmDelete && (
        <Modal title="Delete Deal" onClose={() => setConfirmDelete(false)}>
          <p className="text-sm text-slate-600 mb-6">
            Are you sure you want to delete <strong>{deal.title}</strong>? This cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setConfirmDelete(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete Deal</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

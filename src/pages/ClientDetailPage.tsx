import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Phone, Mail, MapPin, DollarSign, Home, Edit2, Trash2, ArrowLeft,
  Flame, Thermometer, Snowflake, ShieldCheck, Tag, TrendingUp, CheckCircle2, Circle,
} from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { ActivityFeed } from '../components/activity/ActivityFeed';
import { ClientForm } from '../components/clients/ClientForm';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { InlineEdit } from '../components/ui/InlineEdit';
import { useSidebar } from '../components/layout/AppShell';
import { useClients } from '../hooks/useClients';
import { useActivityLog } from '../hooks/useActivityLog';
import { useDeals } from '../hooks/useDeals';
import { useTasks } from '../hooks/useTasks';
import { computeLeadScoreBreakdown } from '../lib/leadScoring';
import { formatBudget, formatDate, formatCurrency, cn } from '../lib/utils';
import type { Client } from '../types';
import toast from 'react-hot-toast';

const tempIcon = {
  hot: <Flame size={13} className="text-red-500" />,
  warm: <Thermometer size={13} className="text-amber-500" />,
  cold: <Snowflake size={13} className="text-blue-400" />,
};

type Tab = 'overview' | 'deals' | 'tasks' | 'activity';

export function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { openSidebar, openCommandPalette } = useSidebar();
  const { getClient, updateClient, deleteClient } = useClients();
  const { getEntriesForClient, addEntry, deleteEntry } = useActivityLog();
  const { deals } = useDeals();
  const { tasks, completeTask } = useTasks();

  const [showEditModal, setShowEditModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [tab, setTab] = useState<Tab>('overview');

  const client = id ? getClient(id) : undefined;
  const entries = id ? getEntriesForClient(id) : [];

  const clientDeals = useMemo(() => deals.filter(d => d.clientId === id), [deals, id]);
  const clientTasks = useMemo(() => tasks.filter(t => t.clientId === id), [tasks, id]);
  const openTasks = clientTasks.filter(t => t.status === 'open');

  const scoreBreakdown = useMemo(() =>
    client ? computeLeadScoreBreakdown(client, entries) : null,
  [client, entries]);

  if (!client) {
    return (
      <div className="flex flex-col flex-1">
        <TopBar title="Client Not Found" onMenuClick={openSidebar} onSearchClick={openCommandPalette} />
        <div className="flex flex-col items-center justify-center flex-1">
          <p className="text-slate-500 mb-4">This client doesn't exist or was deleted.</p>
          <Button variant="secondary" onClick={() => navigate('/clients')}>
            <ArrowLeft size={14} /> Back to Clients
          </Button>
        </div>
      </div>
    );
  }

  const handleUpdate = (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    updateClient(client.id, data);
    setShowEditModal(false);
    toast.success('Client saved');
  };

  const handleDelete = () => {
    deleteClient(client.id);
    navigate('/clients');
  };

  const handleInlineUpdate = (field: keyof Client, value: string) => {
    updateClient(client.id, { [field]: value } as Partial<Client>);
    toast.success('Saved');
  };

  return (
    <div className="flex flex-col flex-1">
      <TopBar
        title={client.name}
        onMenuClick={openSidebar}
        onSearchClick={openCommandPalette}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => navigate('/clients')}>
              <ArrowLeft size={14} /> Back
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setShowEditModal(true)}>
              <Edit2 size={14} /> Edit
            </Button>
            <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>
              <Trash2 size={14} />
            </Button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex gap-1 px-4 md:px-6 pt-4 border-b border-slate-200">
        {([
          { key: 'overview', label: 'Overview' },
          { key: 'deals', label: `Deals${clientDeals.length > 0 ? ` (${clientDeals.length})` : ''}` },
          { key: 'tasks', label: `Tasks${openTasks.length > 0 ? ` (${openTasks.length})` : ''}` },
          { key: 'activity', label: `Activity${entries.length > 0 ? ` (${entries.length})` : ''}` },
        ] as { key: Tab; label: string }[]).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer',
              tab === t.key ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 p-4 md:p-6 overflow-y-auto">

        {/* TAB: Overview */}
        {tab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Profile */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">{client.name}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Added {formatDate(client.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {tempIcon[client.leadTemperature]}
                    <Badge value={client.status} />
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2.5">
                    <Phone size={14} className="text-slate-400 shrink-0" />
                    <InlineEdit
                      value={client.phone}
                      onSave={v => handleInlineUpdate('phone', v)}
                      className="flex-1 text-slate-700"
                    />
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail size={14} className="text-slate-400 shrink-0" />
                    <InlineEdit
                      value={client.email}
                      onSave={v => handleInlineUpdate('email', v)}
                      className="flex-1 text-slate-700"
                    />
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin size={14} className="text-slate-400 shrink-0" />
                    <InlineEdit
                      value={client.locationPreference}
                      onSave={v => handleInlineUpdate('locationPreference', v)}
                      className="flex-1 text-slate-700"
                    />
                  </div>
                  <div className="flex items-center gap-2.5">
                    <DollarSign size={14} className="text-slate-400 shrink-0" />
                    <span className="text-slate-700">{formatBudget(client.budget.min, client.budget.max)}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Home size={14} className="text-slate-400 shrink-0" />
                    <Badge value={client.propertyType} />
                  </div>
                  {client.preApproved && (
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
                      <span className="text-emerald-700 text-xs font-medium">
                        Pre-approved {client.preApprovalAmount ? `at ${formatCurrency(client.preApprovalAmount)}` : ''}
                      </span>
                    </div>
                  )}
                  {client.source && (
                    <div className="flex items-center gap-2.5">
                      <TrendingUp size={14} className="text-slate-400 shrink-0" />
                      <span className="text-slate-600 text-xs capitalize">Source: {client.source.replace('_', ' ')}</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {client.tags.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Tag size={12} className="text-slate-400" />
                      <span className="text-xs font-semibold text-slate-500">Tags</span>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      {client.tags.map(t => (
                        <span key={t} className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
              </Card>

              {/* Lead Score Breakdown */}
              {scoreBreakdown && (
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Lead Score</h3>
                    <span className={cn(
                      'text-lg font-bold',
                      scoreBreakdown.total >= 70 ? 'text-emerald-600' :
                      scoreBreakdown.total >= 40 ? 'text-amber-600' : 'text-red-500'
                    )}>{scoreBreakdown.total}/100</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full mb-3 overflow-hidden">
                    <div
                      className={cn('h-full rounded-full', scoreBreakdown.total >= 70 ? 'bg-emerald-500' : scoreBreakdown.total >= 40 ? 'bg-amber-400' : 'bg-red-400')}
                      style={{ width: `${scoreBreakdown.total}%` }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    {scoreBreakdown.items.map(item => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {item.met
                            ? <CheckCircle2 size={11} className="text-emerald-500" />
                            : <Circle size={11} className="text-slate-300" />
                          }
                          <span className="text-[11px] text-slate-600">{item.label}</span>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-500">+{item.points}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Notes */}
              {client.notes && (
                <Card className="p-5">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Notes</h3>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{client.notes}</p>
                </Card>
              )}
            </div>

            {/* Stats + Activity */}
            <div className="lg:col-span-2">
              <Card className="p-5">
                <div className="grid grid-cols-3 gap-4 mb-5 pb-4 border-b border-slate-100">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-800">{entries.length}</p>
                    <p className="text-xs text-slate-500">Activities</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-800">{clientDeals.length}</p>
                    <p className="text-xs text-slate-500">Deals</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-800">{openTasks.length}</p>
                    <p className="text-xs text-slate-500">Open Tasks</p>
                  </div>
                </div>
                <ActivityFeed
                  clientId={client.id}
                  entries={entries}
                  onAdd={(data) => addEntry(data)}
                  onDelete={deleteEntry}
                />
              </Card>
            </div>
          </div>
        )}

        {/* TAB: Deals */}
        {tab === 'deals' && (
          <div className="space-y-3 max-w-3xl">
            {clientDeals.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-slate-400 text-sm">No deals linked to this client.</p>
                <Link to="/deals">
                  <Button variant="secondary" size="sm" className="mt-3">View Pipeline</Button>
                </Link>
              </Card>
            ) : (
              clientDeals.map(deal => (
                <Link key={deal.id} to={`/deals/${deal.id}`}>
                  <Card className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{deal.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {deal.type} · Opened {formatDate(deal.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {deal.value && <span className="text-sm font-semibold text-slate-700">{formatCurrency(deal.value)}</span>}
                        <Badge value={deal.stage} />
                      </div>
                    </div>
                    {deal.closeDate && (
                      <p className="text-xs text-slate-400 mt-2">Close by: {formatDate(deal.closeDate)}</p>
                    )}
                  </Card>
                </Link>
              ))
            )}
          </div>
        )}

        {/* TAB: Tasks */}
        {tab === 'tasks' && (
          <div className="space-y-2 max-w-3xl">
            {clientTasks.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-slate-400 text-sm">No tasks linked to this client.</p>
              </Card>
            ) : (
              clientTasks.map(task => (
                <Card key={task.id} className="p-3 flex items-center gap-3">
                  <button
                    onClick={() => { if (task.status === 'open') { completeTask(task.id); toast.success('Task completed!'); } }}
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
              ))
            )}
          </div>
        )}

        {/* TAB: Activity */}
        {tab === 'activity' && (
          <div className="max-w-3xl">
            <Card className="p-5">
              <ActivityFeed
                clientId={client.id}
                entries={entries}
                onAdd={(data) => addEntry(data)}
                onDelete={deleteEntry}
              />
            </Card>
          </div>
        )}
      </div>

      {showEditModal && (
        <Modal title="Edit Client" onClose={() => setShowEditModal(false)}>
          <ClientForm initial={client} onSubmit={handleUpdate} onCancel={() => setShowEditModal(false)} />
        </Modal>
      )}

      {confirmDelete && (
        <Modal title="Delete Client" onClose={() => setConfirmDelete(false)}>
          <p className="text-sm text-slate-600 mb-6">
            Are you sure you want to delete <strong>{client.name}</strong>? This will also delete all activity history.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setConfirmDelete(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete Client</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Phone, Mail, MapPin, DollarSign, Home, Edit2, Trash2, ArrowLeft } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { ActivityFeed } from '../components/activity/ActivityFeed';
import { ClientForm } from '../components/clients/ClientForm';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useSidebar } from '../components/layout/AppShell';
import { useClients } from '../hooks/useClients';
import { useActivityLog } from '../hooks/useActivityLog';
import { formatBudget, formatDate } from '../lib/utils';
import type { Client } from '../types';

export function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { open } = useSidebar();
  const { getClient, updateClient, deleteClient } = useClients();
  const { getEntriesForClient, addEntry, deleteEntry } = useActivityLog();

  const [showEditModal, setShowEditModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const client = id ? getClient(id) : undefined;
  const entries = id ? getEntriesForClient(id) : [];

  if (!client) {
    return (
      <div className="flex flex-col flex-1">
        <TopBar title="Client Not Found" onMenuClick={open} />
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
  };

  const handleDelete = () => {
    deleteClient(client.id);
    navigate('/clients');
  };

  return (
    <div className="flex flex-col flex-1">
      <TopBar
        title={client.name}
        onMenuClick={open}
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

      <div className="flex-1 p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">{client.name}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Added {formatDate(client.createdAt)}
                  </p>
                </div>
                <Badge value={client.status} />
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2.5 text-slate-700">
                  <Phone size={15} className="text-slate-400 shrink-0" />
                  <a href={`tel:${client.phone}`} className="hover:text-indigo-600">{client.phone}</a>
                </div>
                <div className="flex items-center gap-2.5 text-slate-700">
                  <Mail size={15} className="text-slate-400 shrink-0" />
                  <a href={`mailto:${client.email}`} className="hover:text-indigo-600 truncate">{client.email}</a>
                </div>
                <div className="flex items-center gap-2.5 text-slate-700">
                  <MapPin size={15} className="text-slate-400 shrink-0" />
                  <span>{client.locationPreference}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-700">
                  <DollarSign size={15} className="text-slate-400 shrink-0" />
                  <span>{formatBudget(client.budget.min, client.budget.max)}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-700">
                  <Home size={15} className="text-slate-400 shrink-0" />
                  <Badge value={client.propertyType} />
                </div>
              </div>
            </Card>

            {client.notes && (
              <Card className="p-5">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Notes</h3>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{client.notes}</p>
              </Card>
            )}

            <Card className="p-5">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Stats</h3>
              <div className="space-y-2 text-sm text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Activities logged</span>
                  <span className="font-medium">{entries.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Last updated</span>
                  <span className="font-medium">{formatDate(client.updatedAt)}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Activity */}
          <div className="lg:col-span-2">
            <Card className="p-5">
              <ActivityFeed
                clientId={client.id}
                entries={entries}
                onAdd={(data) => addEntry(data)}
                onDelete={deleteEntry}
              />
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <Modal title="Edit Client" onClose={() => setShowEditModal(false)}>
          <ClientForm
            initial={client}
            onSubmit={handleUpdate}
            onCancel={() => setShowEditModal(false)}
          />
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <Modal title="Delete Client" onClose={() => setConfirmDelete(false)}>
          <p className="text-sm text-slate-600 mb-6">
            Are you sure you want to delete <strong>{client.name}</strong>? This will also delete all
            their activity history and cannot be undone.
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

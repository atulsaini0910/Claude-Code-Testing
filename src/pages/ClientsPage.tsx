import { useState, useMemo } from 'react';
import { Search, Plus, Users } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { ClientCard } from '../components/clients/ClientCard';
import { ClientFilters } from '../components/clients/ClientFilters';
import { ClientForm } from '../components/clients/ClientForm';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { useSidebar } from '../components/layout/AppShell';
import { useClients } from '../hooks/useClients';
import { useActivityLog } from '../hooks/useActivityLog';
import type { Client } from '../types';

export function ClientsPage() {
  const { openSidebar, openCommandPalette } = useSidebar();
  const { filteredClients, addClient, searchQuery, setSearchQuery, filters, setFilters } = useClients();
  const { entries } = useActivityLog();
  const [showModal, setShowModal] = useState(false);

  const lastActivityMap = useMemo(() => {
    const map = new Map<string, typeof entries[number]>();
    for (const entry of entries) {
      const existing = map.get(entry.clientId);
      if (!existing || new Date(entry.createdAt) > new Date(existing.createdAt)) {
        map.set(entry.clientId, entry);
      }
    }
    return map;
  }, [entries]);

  const handleAdd = (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    addClient(data);
    setShowModal(false);
  };

  return (
    <div className="flex flex-col flex-1">
      <TopBar
        title="Clients"
        onMenuClick={openSidebar}
        onSearchClick={openCommandPalette}
        actions={
          <Button onClick={() => setShowModal(true)} size="sm">
            <Plus size={14} />
            Add Client
          </Button>
        }
      />

      <div className="flex-1 p-4 md:p-6 space-y-4">
        {/* Search + Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search clients by name, email, or location..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <ClientFilters filters={filters} setFilters={setFilters} />
        </div>

        {/* Count */}
        <p className="text-xs text-slate-400">
          {filteredClients.length} client{filteredClients.length !== 1 ? 's' : ''} found
        </p>

        {/* Grid */}
        {filteredClients.length === 0 ? (
          <EmptyState
            icon={<Users size={40} />}
            title="No clients found"
            description={searchQuery ? 'Try a different search term or clear your filters.' : 'Get started by adding your first client.'}
            action={
              !searchQuery ? (
                <Button onClick={() => setShowModal(true)}>
                  <Plus size={14} /> Add First Client
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredClients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                lastActivity={lastActivityMap.get(client.id) ?? null}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <Modal title="Add New Client" onClose={() => setShowModal(false)}>
          <ClientForm onSubmit={handleAdd} onCancel={() => setShowModal(false)} />
        </Modal>
      )}
    </div>
  );
}

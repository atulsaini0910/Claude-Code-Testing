import { useState, useMemo } from 'react';
import { Search, Plus, Users, Download } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { ClientCard } from '../components/clients/ClientCard';
import { ClientFilters } from '../components/clients/ClientFilters';
import { ClientForm } from '../components/clients/ClientForm';
import { BulkActionBar } from '../components/clients/BulkActionBar';
import { SavedViewChips } from '../components/clients/SavedViewChips';
import { SaveViewPopover } from '../components/ui/SaveViewPopover';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { useSidebar } from '../components/layout/AppShell';
import { useClients } from '../hooks/useClients';
import { useActivityLog } from '../hooks/useActivityLog';
import { useBulkSelect } from '../hooks/useBulkSelect';
import { useSavedViews } from '../hooks/useSavedViews';
import { useUsers } from '../hooks/useUsers';
import { exportClientsCSV } from '../lib/csvExport';
import type { Client, ClientFilters as FiltersType, ClientStatus } from '../types';
import toast from 'react-hot-toast';

export function ClientsPage() {
  const { openSidebar, openCommandPalette } = useSidebar();
  const { filteredClients, addClient, updateClient, deleteClient, searchQuery, setSearchQuery, filters, setFilters } = useClients();
  const { entries } = useActivityLog();
  const [showModal, setShowModal] = useState(false);
  const [activeSegment, setActiveSegment] = useState<string | null>(null);

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

  const bulk = useBulkSelect(filteredClients);
  const { saveView } = useSavedViews();
  const { currentUser } = useUsers();

  const handleAdd = (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    addClient(data);
    setShowModal(false);
    toast.success('Client added');
  };

  const handleSegmentSelect = (segmentId: string, segmentFilters: Partial<FiltersType>) => {
    if (activeSegment === segmentId) {
      setActiveSegment(null);
      setFilters({ status: 'all', clientType: 'all', leadTemperature: 'all' });
    } else {
      setActiveSegment(segmentId);
      setFilters(segmentFilters);
    }
    bulk.clearAll();
  };

  const handleBulkChangeStatus = (status: ClientStatus) => {
    bulk.selectedItems.forEach(c => updateClient(c.id, { status }));
    toast.success(`${bulk.selectedItems.length} clients updated to ${status}`);
    bulk.clearAll();
  };

  const handleBulkDelete = () => {
    if (!confirm(`Delete ${bulk.selectedItems.length} clients? This cannot be undone.`)) return;
    bulk.selectedItems.forEach(c => deleteClient(c.id));
    toast.success(`${bulk.selectedItems.length} clients deleted`);
    bulk.clearAll();
  };

  const handleBulkExport = () => {
    exportClientsCSV(bulk.selectedItems);
    toast.success(`Exported ${bulk.selectedItems.length} clients`);
  };

  const handleExportAll = () => {
    exportClientsCSV(filteredClients);
    toast.success(`Exported ${filteredClients.length} clients`);
  };

  return (
    <div className="flex flex-col flex-1">
      <TopBar
        title="Clients"
        onMenuClick={openSidebar}
        onSearchClick={openCommandPalette}
        actions={
          <div className="flex items-center gap-2">
            <SaveViewPopover onSave={(name, isShared) => {
              saveView(name, 'clients', filters as unknown as Record<string, unknown>, currentUser?.id ?? 'u1', isShared);
              toast.success(`View "${name}" saved`);
            }} />
            <Button variant="secondary" size="sm" onClick={handleExportAll}>
              <Download size={13} /> Export
            </Button>
            <Button onClick={() => setShowModal(true)} size="sm">
              <Plus size={14} /> Add Client
            </Button>
          </div>
        }
      />

      <div className="flex-1 p-4 md:p-6 space-y-4 overflow-y-auto">
        {/* Smart Segments */}
        <SavedViewChips activeSegment={activeSegment} onSelect={handleSegmentSelect} />

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

        {/* Count + bulk select all */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-400">
            {filteredClients.length} client{filteredClients.length !== 1 ? 's' : ''}
            {bulk.someSelected && <span className="text-indigo-600 font-medium"> · {bulk.selectedIds.size} selected</span>}
          </p>
          {filteredClients.length > 0 && (
            <button
              onClick={bulk.allSelected ? bulk.clearAll : bulk.selectAll}
              className="text-xs text-indigo-600 hover:underline cursor-pointer"
            >
              {bulk.allSelected ? 'Deselect all' : 'Select all'}
            </button>
          )}
        </div>

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
            {filteredClients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                lastActivity={lastActivityMap.get(client.id) ?? null}
                selected={bulk.isSelected(client.id)}
                onSelect={bulk.toggle}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bulk action bar */}
      <BulkActionBar
        selectedItems={bulk.selectedItems}
        onClearAll={bulk.clearAll}
        onChangeStatus={handleBulkChangeStatus}
        onExport={handleBulkExport}
        onDelete={handleBulkDelete}
      />

      {showModal && (
        <Modal title="Add New Client" onClose={() => setShowModal(false)}>
          <ClientForm onSubmit={handleAdd} onCancel={() => setShowModal(false)} />
        </Modal>
      )}
    </div>
  );
}

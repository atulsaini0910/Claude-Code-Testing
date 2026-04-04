import { useState, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getClients, saveClients, getActivity, saveActivity } from '../lib/storage';
import type { Client, ClientFilters } from '../types';

const defaultFilters: ClientFilters = {
  status: 'all',
  propertyType: 'all',
  budgetMin: '',
  budgetMax: '',
};

export function useClients() {
  const [clients, setClients] = useState<Client[]>(() => getClients());
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFiltersState] = useState<ClientFilters>(defaultFilters);

  const persist = useCallback((updated: Client[]) => {
    setClients(updated);
    saveClients(updated);
  }, []);

  const addClient = useCallback(
    (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Client => {
      const now = new Date().toISOString();
      const client: Client = { ...data, id: uuidv4(), createdAt: now, updatedAt: now };
      persist([...getClients(), client]);
      return client;
    },
    [persist]
  );

  const updateClient = useCallback(
    (id: string, data: Partial<Client>) => {
      const updated = getClients().map((c) =>
        c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c
      );
      persist(updated);
    },
    [persist]
  );

  const deleteClient = useCallback(
    (id: string) => {
      persist(getClients().filter((c) => c.id !== id));
      // Cascade delete activity entries
      const activity = getActivity().filter((a) => a.clientId !== id);
      saveActivity(activity);
    },
    [persist]
  );

  const getClient = useCallback(
    (id: string): Client | undefined => clients.find((c) => c.id === id),
    [clients]
  );

  const setFilters = useCallback((f: Partial<ClientFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...f }));
  }, []);

  const filteredClients = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return clients.filter((c) => {
      if (q && !c.name.toLowerCase().includes(q) &&
          !c.email.toLowerCase().includes(q) &&
          !c.locationPreference.toLowerCase().includes(q)) {
        return false;
      }
      if (filters.status !== 'all' && c.status !== filters.status) return false;
      if (filters.propertyType !== 'all' && c.propertyType !== filters.propertyType) return false;
      if (filters.budgetMin !== '' && c.budget.max < Number(filters.budgetMin)) return false;
      if (filters.budgetMax !== '' && c.budget.min > Number(filters.budgetMax)) return false;
      return true;
    });
  }, [clients, searchQuery, filters]);

  return {
    clients,
    addClient,
    updateClient,
    deleteClient,
    getClient,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    filteredClients,
  };
}

import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../lib/storage';
import type { ActivityEntry } from '../types';

export function useActivityLog() {
  const [entries, setEntries] = useState<ActivityEntry[]>(() => db.activity.get());

  const persist = useCallback((updated: ActivityEntry[]) => {
    setEntries(updated);
    db.activity.set(updated);
  }, []);

  const addEntry = useCallback(
    (data: Omit<ActivityEntry, 'id' | 'createdAt'>) => {
      const now = new Date().toISOString();
      const entry: ActivityEntry = { ...data, id: uuidv4(), createdAt: now };
      persist([...db.activity.get(), entry]);
      // Stamp lastContactedAt on the linked client
      const clients = db.clients.get();
      const idx = clients.findIndex(c => c.id === data.clientId);
      if (idx !== -1) {
        const updated = [...clients];
        updated[idx] = { ...updated[idx], lastContactedAt: now, updatedAt: now };
        db.clients.set(updated);
      }
    },
    [persist]
  );

  const deleteEntry = useCallback((id: string) => {
    persist(db.activity.get().filter(e => e.id !== id));
  }, [persist]);

  const getEntriesForClient = useCallback(
    (clientId: string): ActivityEntry[] =>
      entries
        .filter(e => e.clientId === clientId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [entries]
  );

  const getEntriesForDeal = useCallback(
    (dealId: string): ActivityEntry[] =>
      entries
        .filter(e => e.dealId === dealId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [entries]
  );

  return { entries, addEntry, deleteEntry, getEntriesForClient, getEntriesForDeal };
}

import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getActivity, saveActivity } from '../lib/storage';
import type { ActivityEntry } from '../types';

export function useActivityLog() {
  const [entries, setEntries] = useState<ActivityEntry[]>(() => getActivity());

  const persist = useCallback((updated: ActivityEntry[]) => {
    setEntries(updated);
    saveActivity(updated);
  }, []);

  const addEntry = useCallback(
    (data: Omit<ActivityEntry, 'id' | 'createdAt'>) => {
      const entry: ActivityEntry = {
        ...data,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
      };
      const updated = [...getActivity(), entry];
      persist(updated);
    },
    [persist]
  );

  const deleteEntry = useCallback(
    (id: string) => {
      persist(getActivity().filter((e) => e.id !== id));
    },
    [persist]
  );

  const getEntriesForClient = useCallback(
    (clientId: string): ActivityEntry[] =>
      entries
        .filter((e) => e.clientId === clientId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [entries]
  );

  return { entries, addEntry, deleteEntry, getEntriesForClient };
}

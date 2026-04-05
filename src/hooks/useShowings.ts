import { useState, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../lib/storage';
import type { Showing } from '../types';

export function useShowings() {
  const [showings, setShowings] = useState<Showing[]>(() => db.showings.get());

  const persist = useCallback((updated: Showing[]) => {
    setShowings(updated);
    db.showings.set(updated);
  }, []);

  const addShowing = useCallback((data: Omit<Showing, 'id' | 'createdAt'>): Showing => {
    const showing: Showing = { ...data, id: uuidv4(), createdAt: new Date().toISOString() };
    persist([...db.showings.get(), showing]);
    return showing;
  }, [persist]);

  const updateShowing = useCallback((id: string, data: Partial<Showing>) => {
    persist(db.showings.get().map(s => s.id === id ? { ...s, ...data } : s));
  }, [persist]);

  const deleteShowing = useCallback((id: string) => {
    persist(db.showings.get().filter(s => s.id !== id));
  }, [persist]);

  const getShowingsForDeal = useCallback((dealId: string) =>
    showings.filter(s => s.dealId === dealId).sort((a, b) =>
      new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
    ), [showings]);

  const getShowingsForClient = useCallback((clientId: string) =>
    showings.filter(s => s.clientId === clientId), [showings]);

  const upcomingShowings = useMemo(() =>
    showings.filter(s => s.status === 'scheduled' && new Date(s.scheduledAt) > new Date())
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()),
  [showings]);

  return {
    showings, addShowing, updateShowing, deleteShowing,
    getShowingsForDeal, getShowingsForClient, upcomingShowings,
  };
}

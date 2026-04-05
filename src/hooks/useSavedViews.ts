import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../lib/storage';
import type { SavedView } from '../types';

export function useSavedViews() {
  const [views, setViews] = useState<SavedView[]>(() => db.savedViews.get());

  const persist = useCallback((updated: SavedView[]) => {
    setViews(updated);
    db.savedViews.set(updated);
  }, []);

  const saveView = useCallback((
    name: string,
    entity: SavedView['entity'],
    filters: Record<string, unknown>,
    createdBy: string,
    isShared = false,
    sortBy?: string,
    sortDir?: 'asc' | 'desc',
  ): SavedView => {
    const view: SavedView = {
      id: uuidv4(), name, entity, filters, isShared, createdBy,
      sortBy, sortDir, createdAt: new Date().toISOString(),
    };
    persist([...db.savedViews.get(), view]);
    return view;
  }, [persist]);

  const deleteView = useCallback((id: string) => {
    persist(db.savedViews.get().filter(v => v.id !== id));
  }, [persist]);

  const getViewsForEntity = useCallback(
    (entity: SavedView['entity']) => views.filter(v => v.entity === entity),
    [views]
  );

  return { views, saveView, deleteView, getViewsForEntity };
}

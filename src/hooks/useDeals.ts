import { useState, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../lib/storage';
import type { Deal, DealFilters, DealStage } from '../types';

const defaultFilters: DealFilters = { stage: 'all', type: 'all', assignedTo: 'all' };

export function useDeals() {
  const [deals, setDeals] = useState<Deal[]>(() => db.deals.get());
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFiltersState] = useState<DealFilters>(defaultFilters);

  const persist = useCallback((updated: Deal[]) => {
    setDeals(updated);
    db.deals.set(updated);
  }, []);

  const addDeal = useCallback((data: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>): Deal => {
    const now = new Date().toISOString();
    const deal: Deal = { ...data, id: uuidv4(), createdAt: now, updatedAt: now };
    persist([...db.deals.get(), deal]);
    return deal;
  }, [persist]);

  const updateDeal = useCallback((id: string, data: Partial<Deal>) => {
    persist(db.deals.get().map(d =>
      d.id === id ? { ...d, ...data, updatedAt: new Date().toISOString() } : d
    ));
  }, [persist]);

  const moveDeal = useCallback((id: string, newStage: DealStage) => {
    persist(db.deals.get().map(d =>
      d.id === id ? { ...d, stage: newStage, updatedAt: new Date().toISOString() } : d
    ));
  }, [persist]);

  const deleteDeal = useCallback((id: string) => {
    persist(db.deals.get().filter(d => d.id !== id));
  }, [persist]);

  const getDeal = useCallback((id: string) => deals.find(d => d.id === id), [deals]);

  const setFilters = useCallback((f: Partial<DealFilters>) =>
    setFiltersState(prev => ({ ...prev, ...f })), []);

  const filteredDeals = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return deals.filter(d => {
      if (q && !d.title.toLowerCase().includes(q)) return false;
      if (filters.stage !== 'all' && d.stage !== filters.stage) return false;
      if (filters.type !== 'all' && d.type !== filters.type) return false;
      if (filters.assignedTo !== 'all' && d.assignedTo !== filters.assignedTo) return false;
      return true;
    });
  }, [deals, searchQuery, filters]);

  // Group by stage for Kanban
  const dealsByStage = useMemo(() => {
    const stages: DealStage[] = ['inquiry', 'showing', 'offer', 'under_contract', 'closed_won', 'closed_lost'];
    return stages.reduce((acc, stage) => {
      acc[stage] = deals.filter(d => d.stage === stage);
      return acc;
    }, {} as Record<DealStage, Deal[]>);
  }, [deals]);

  const pipelineValue = useMemo(() =>
    deals.filter(d => d.stage !== 'closed_lost').reduce((sum, d) => sum + (d.value ?? 0), 0),
  [deals]);

  return {
    deals, addDeal, updateDeal, moveDeal, deleteDeal, getDeal,
    searchQuery, setSearchQuery, filters, setFilters,
    filteredDeals, dealsByStage, pipelineValue,
  };
}

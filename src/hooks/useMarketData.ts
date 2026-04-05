import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../lib/storage';
import type { MarketData } from '../types';

export function useMarketData() {
  const [marketData, setMarketData] = useState<MarketData[]>(() => db.marketData.get());

  const persist = useCallback((updated: MarketData[]) => {
    setMarketData(updated);
    db.marketData.set(updated);
  }, []);

  const addEntry = useCallback((data: Omit<MarketData, 'id' | 'createdAt'>): MarketData => {
    const entry: MarketData = { ...data, id: uuidv4(), createdAt: new Date().toISOString() };
    persist([...db.marketData.get(), entry]);
    return entry;
  }, [persist]);

  const updateEntry = useCallback((id: string, data: Partial<MarketData>) => {
    persist(db.marketData.get().map(e => e.id === id ? { ...e, ...data } : e));
  }, [persist]);

  const deleteEntry = useCallback((id: string) => {
    persist(db.marketData.get().filter(e => e.id !== id));
  }, [persist]);

  const getAreasWithData = () => [...new Set(marketData.map(e => e.area))].sort();

  const getDataForArea = (area: string) =>
    marketData
      .filter(e => e.area === area)
      .sort((a, b) => a.month.localeCompare(b.month));

  return { marketData, addEntry, updateEntry, deleteEntry, getAreasWithData, getDataForArea };
}

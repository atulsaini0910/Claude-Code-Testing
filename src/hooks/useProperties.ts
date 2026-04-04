import { useState, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../lib/storage';
import type { Property, PropertyFilters } from '../types';

const defaultFilters: PropertyFilters = { status: 'all', propertyType: 'all', minPrice: '', maxPrice: '' };

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>(() => db.properties.get());
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFiltersState] = useState<PropertyFilters>(defaultFilters);

  const persist = useCallback((updated: Property[]) => {
    setProperties(updated);
    db.properties.set(updated);
  }, []);

  const addProperty = useCallback((data: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Property => {
    const now = new Date().toISOString();
    const property: Property = { ...data, id: uuidv4(), createdAt: now, updatedAt: now };
    persist([...db.properties.get(), property]);
    return property;
  }, [persist]);

  const updateProperty = useCallback((id: string, data: Partial<Property>) => {
    persist(db.properties.get().map(p =>
      p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
    ));
  }, [persist]);

  const deleteProperty = useCallback((id: string) => {
    persist(db.properties.get().filter(p => p.id !== id));
  }, [persist]);

  const getProperty = useCallback((id: string) => properties.find(p => p.id === id), [properties]);

  const setFilters = useCallback((f: Partial<PropertyFilters>) =>
    setFiltersState(prev => ({ ...prev, ...f })), []);

  const filteredProperties = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return properties.filter(p => {
      if (q && !`${p.addressLine1} ${p.city} ${p.state}`.toLowerCase().includes(q) &&
          !(p.mlsId?.toLowerCase().includes(q))) return false;
      if (filters.status !== 'all' && p.status !== filters.status) return false;
      if (filters.propertyType !== 'all' && p.propertyType !== filters.propertyType) return false;
      if (filters.minPrice !== '' && (p.listPrice ?? 0) < Number(filters.minPrice)) return false;
      if (filters.maxPrice !== '' && (p.listPrice ?? Infinity) > Number(filters.maxPrice)) return false;
      return true;
    });
  }, [properties, searchQuery, filters]);

  return {
    properties, addProperty, updateProperty, deleteProperty, getProperty,
    searchQuery, setSearchQuery, filters, setFilters, filteredProperties,
  };
}

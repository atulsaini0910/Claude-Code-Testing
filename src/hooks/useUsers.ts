import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../lib/storage';
import type { User, UserRole } from '../types';

export function useUsers() {
  const [users, setUsers] = useState<User[]>(() => db.users.get());
  const [currentUser, setCurrentUserState] = useState<User | null>(() => db.currentUser.get());

  const persist = useCallback((updated: User[]) => {
    setUsers(updated);
    db.users.set(updated);
  }, []);

  const addUser = useCallback((data: Omit<User, 'id' | 'createdAt'>): User => {
    const user: User = { ...data, id: uuidv4(), createdAt: new Date().toISOString() };
    persist([...db.users.get(), user]);
    return user;
  }, [persist]);

  const updateUser = useCallback((id: string, data: Partial<User>) => {
    persist(db.users.get().map(u => u.id === id ? { ...u, ...data } : u));
  }, [persist]);

  const deactivateUser = useCallback((id: string) => {
    persist(db.users.get().map(u => u.id === id ? { ...u, isActive: false } : u));
  }, [persist]);

  const switchUser = useCallback((userId: string) => {
    const user = db.users.get().find(u => u.id === userId) ?? null;
    setCurrentUserState(user);
    db.currentUser.set(user);
  }, []);

  const getUserById = useCallback((id: string) => users.find(u => u.id === id), [users]);

  const getUserName = useCallback((id?: string): string => {
    if (!id) return '—';
    return users.find(u => u.id === id)?.name ?? '—';
  }, [users]);

  const getRoleColor = (role: UserRole) => {
    const map: Record<UserRole, string> = {
      admin: 'bg-purple-100 text-purple-700',
      manager: 'bg-blue-100 text-blue-700',
      agent: 'bg-emerald-100 text-emerald-700',
      readonly: 'bg-slate-100 text-slate-500',
    };
    return map[role];
  };

  return {
    users, currentUser, addUser, updateUser, deactivateUser,
    switchUser, getUserById, getUserName, getRoleColor,
    activeUsers: users.filter(u => u.isActive),
  };
}

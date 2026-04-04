import { useState, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../lib/storage';
import type { Task, TaskFilters } from '../types';

const defaultFilters: TaskFilters = { status: 'open', priority: 'all', assignedTo: 'all' };

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => db.tasks.get());
  const [filters, setFiltersState] = useState<TaskFilters>(defaultFilters);

  const persist = useCallback((updated: Task[]) => {
    setTasks(updated);
    db.tasks.set(updated);
  }, []);

  const addTask = useCallback((data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task => {
    const now = new Date().toISOString();
    const task: Task = { ...data, id: uuidv4(), createdAt: now, updatedAt: now };
    persist([...db.tasks.get(), task]);
    return task;
  }, [persist]);

  const updateTask = useCallback((id: string, data: Partial<Task>) => {
    persist(db.tasks.get().map(t =>
      t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t
    ));
  }, [persist]);

  const completeTask = useCallback((id: string) => {
    const now = new Date().toISOString();
    persist(db.tasks.get().map(t =>
      t.id === id ? { ...t, status: 'completed' as const, completedAt: now, updatedAt: now } : t
    ));
  }, [persist]);

  const deleteTask = useCallback((id: string) => {
    persist(db.tasks.get().filter(t => t.id !== id));
  }, [persist]);

  const getTask = useCallback((id: string) => tasks.find(t => t.id === id), [tasks]);

  const setFilters = useCallback((f: Partial<TaskFilters>) =>
    setFiltersState(prev => ({ ...prev, ...f })), []);

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      if (filters.status !== 'all' && t.status !== filters.status) return false;
      if (filters.priority !== 'all' && t.priority !== filters.priority) return false;
      if (filters.assignedTo !== 'all' && t.assignedTo !== filters.assignedTo) return false;
      return true;
    });
  }, [tasks, filters]);

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today.getTime() + 86400000);
  const nextWeek = new Date(today.getTime() + 7 * 86400000);

  const groupedTasks = useMemo(() => {
    const open = filteredTasks.filter(t => t.status === 'open');
    return {
      overdue:   open.filter(t => t.dueDate && new Date(t.dueDate) < today),
      today:     open.filter(t => t.dueDate && new Date(t.dueDate) >= today && new Date(t.dueDate) < tomorrow),
      upcoming:  open.filter(t => t.dueDate && new Date(t.dueDate) >= tomorrow && new Date(t.dueDate) <= nextWeek),
      later:     open.filter(t => !t.dueDate || new Date(t.dueDate) > nextWeek),
      completed: filteredTasks.filter(t => t.status === 'completed').slice(0, 20),
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredTasks]);

  const overdueCt = tasks.filter(t => t.status === 'open' && t.dueDate && new Date(t.dueDate) < today).length;

  return {
    tasks, addTask, updateTask, completeTask, deleteTask, getTask,
    filters, setFilters, filteredTasks, groupedTasks, overdueCt,
  };
}

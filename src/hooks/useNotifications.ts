import { useState, useCallback } from 'react';
import { db } from '../lib/storage';
import type { Notification } from '../types';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(() => db.notifications.get());

  const persist = useCallback((updated: Notification[]) => {
    setNotifications(updated);
    db.notifications.set(updated);
  }, []);

  const markRead = useCallback((id: string) => {
    persist(db.notifications.get().map(n => n.id === id ? { ...n, isRead: true } : n));
  }, [persist]);

  const markAllRead = useCallback(() => {
    persist(db.notifications.get().map(n => ({ ...n, isRead: true })));
  }, [persist]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return { notifications, markRead, markAllRead, unreadCount };
}

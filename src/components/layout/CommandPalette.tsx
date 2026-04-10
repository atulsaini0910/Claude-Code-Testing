import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Users, Building2, LayoutDashboard, CheckSquare,
  BarChart2, Settings, Plus, Phone, Mail, Calendar, FileText,
  Briefcase, Home,
} from 'lucide-react';
import { db } from '../../lib/storage';
import { cn } from '../../lib/utils';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  category: string;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onQuickAdd?: (type: 'client' | 'deal' | 'property' | 'task' | 'activity') => void;
}

export function CommandPalette({ open, onClose, onQuickAdd }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);

  const nav = (path: string) => { navigate(path); onClose(); };
  const qa = (type: 'client' | 'deal' | 'property' | 'task' | 'activity') => {
    onQuickAdd?.(type); onClose();
  };

  const staticItems: CommandItem[] = [
    { id: 'dash',  label: 'Dashboard',       icon: <LayoutDashboard size={15} />, action: () => nav('/dashboard'),   category: 'Navigate' },
    { id: 'cli',   label: 'Clients',          icon: <Users size={15} />,           action: () => nav('/clients'),     category: 'Navigate' },
    { id: 'deals', label: 'Deal Pipeline',    icon: <Briefcase size={15} />,       action: () => nav('/deals'),       category: 'Navigate' },
    { id: 'props', label: 'Properties',       icon: <Home size={15} />,            action: () => nav('/properties'),  category: 'Navigate' },
    { id: 'tasks', label: 'Tasks',            icon: <CheckSquare size={15} />,     action: () => nav('/tasks'),       category: 'Navigate' },
    { id: 'analytics', label: 'Analytics',   icon: <BarChart2 size={15} />,       action: () => nav('/analytics'),   category: 'Navigate' },
    { id: 'settings',  label: 'Settings',     icon: <Settings size={15} />,        action: () => nav('/settings'),    category: 'Navigate' },
    { id: 'nc',   label: 'New Client',        icon: <Plus size={15} />,            action: () => qa('client'),        category: 'Create' },
    { id: 'nd',   label: 'New Deal',          icon: <Plus size={15} />,            action: () => qa('deal'),          category: 'Create' },
    { id: 'np',   label: 'New Property',      icon: <Plus size={15} />,            action: () => qa('property'),      category: 'Create' },
    { id: 'nt',   label: 'New Task',          icon: <Plus size={15} />,            action: () => qa('task'),          category: 'Create' },
    { id: 'la',   label: 'Log Activity',      icon: <Phone size={15} />,           action: () => qa('activity'),      category: 'Create' },
    { id: 'le',   label: 'Log Email',         icon: <Mail size={15} />,            action: () => qa('activity'),      category: 'Create' },
    { id: 'lm',   label: 'Log Meeting',       icon: <Calendar size={15} />,        action: () => qa('activity'),      category: 'Create' },
    { id: 'ln',   label: 'Add Note',          icon: <FileText size={15} />,        action: () => qa('activity'),      category: 'Create' },
    { id: 'team', label: 'Team Management',   icon: <Users size={15} />,           action: () => nav('/admin/team'),  category: 'Admin' },
    { id: 'imp',  label: 'Import Clients',    icon: <Building2 size={15} />,       action: () => nav('/admin/import'),category: 'Admin' },
  ];

  // Client search results
  const clientResults: CommandItem[] = query.length >= 2
    ? db.clients.get()
        .filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.email.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5)
        .map(c => ({
          id: `client-${c.id}`,
          label: c.name,
          description: `${c.email} · ${c.status}`,
          icon: <Users size={15} />,
          action: () => nav(`/clients/${c.id}`),
          category: 'Clients',
        }))
    : [];

  const dealResults: CommandItem[] = query.length >= 2
    ? db.deals.get()
        .filter(d => d.title.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 3)
        .map(d => ({
          id: `deal-${d.id}`,
          label: d.title,
          description: `${d.stage} · ${d.value ? `$${(d.value / 1000).toFixed(0)}k` : '—'}`,
          icon: <Briefcase size={15} />,
          action: () => nav(`/deals/${d.id}`),
          category: 'Deals',
        }))
    : [];

  const filtered = query
    ? [...clientResults, ...dealResults, ...staticItems.filter(i =>
        i.label.toLowerCase().includes(query.toLowerCase()) ||
        i.category.toLowerCase().includes(query.toLowerCase())
      )]
    : staticItems;

  const grouped = filtered.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  const flat = Object.values(grouped).flat();

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (!open) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, flat.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && flat[activeIdx]) { flat[activeIdx].action(); }
    if (e.key === 'Escape') onClose();
  }, [open, flat, activeIdx, onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  useEffect(() => { setActiveIdx(0); }, [query]);
  useEffect(() => { if (!open) setQuery(''); }, [open]);

  if (!open) return null;

  let itemIdx = 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl mx-4 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-slate-700">
          <Search size={16} className="text-slate-400 shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search clients, deals, actions..."
            className="flex-1 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none bg-transparent"
          />
          <kbd className="text-[10px] text-slate-400 border border-slate-200 dark:border-slate-600 rounded px-1.5 py-0.5">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <div className="px-4 pt-2 pb-1">
                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{category}</span>
              </div>
              {items.map(item => {
                const idx = itemIdx++;
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    onMouseEnter={() => setActiveIdx(idx)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-2 text-left transition-colors cursor-pointer',
                      activeIdx === idx ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    )}
                  >
                    <span className={activeIdx === idx ? 'text-indigo-500' : 'text-slate-400 dark:text-slate-500'}>{item.icon}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-none">{item.label}</p>
                      {item.description && (
                        <p className="text-xs text-slate-400 mt-0.5 truncate">{item.description}</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="px-4 py-6 text-sm text-slate-400 text-center">No results for "{query}"</p>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-slate-50 dark:border-slate-700 flex items-center gap-3 text-[10px] text-slate-400 dark:text-slate-500">
          <span><kbd className="border border-slate-200 dark:border-slate-600 dark:bg-slate-700 rounded px-1">↑↓</kbd> navigate</span>
          <span><kbd className="border border-slate-200 dark:border-slate-600 dark:bg-slate-700 rounded px-1">↵</kbd> select</span>
          <span><kbd className="border border-slate-200 dark:border-slate-600 dark:bg-slate-700 rounded px-1">esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}

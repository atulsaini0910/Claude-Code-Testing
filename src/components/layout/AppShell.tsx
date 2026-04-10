import { useState, useEffect, createContext, useContext, useCallback, type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { CommandPalette } from './CommandPalette';
import { Drawer } from '../ui/Drawer';
import { ClientForm } from '../clients/ClientForm';
import { useClients } from '../../hooks/useClients';
import type { Client } from '../../types';
import toast, { Toaster } from 'react-hot-toast';

interface AppShellCtx {
  openSidebar: () => void;
  openCommandPalette: () => void;
  openQuickAdd: (type: 'client' | 'deal' | 'property' | 'task' | 'activity') => void;
}

const AppShellContext = createContext<AppShellCtx>({
  openSidebar: () => {},
  openCommandPalette: () => {},
  openQuickAdd: () => {},
});

export const useSidebar = () => useContext(AppShellContext);

export function AppShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState<'client' | 'deal' | 'property' | 'task' | 'activity' | null>(null);

  const { addClient } = useClients();

  // Global keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen(v => !v);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const openQuickAdd = useCallback((type: typeof quickAddType) => {
    setQuickAddType(type);
  }, []);

  const handleClientAdd = (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    addClient(data);
    setQuickAddType(null);
    toast.success('Client added successfully');
  };

  const ctx: AppShellCtx = {
    openSidebar: () => setSidebarOpen(true),
    openCommandPalette: () => setPaletteOpen(true),
    openQuickAdd,
  };

  return (
    <AppShellContext.Provider value={ctx}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
        <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0 md:ml-56">
          {children}
        </div>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onQuickAdd={openQuickAdd}
      />

      {/* Quick-add: New Client drawer */}
      <Drawer
        open={quickAddType === 'client'}
        onClose={() => setQuickAddType(null)}
        title="Add New Client"
      >
        <ClientForm
          onSubmit={handleClientAdd}
          onCancel={() => setQuickAddType(null)}
        />
      </Drawer>

      <Toaster
        position="bottom-right"
        toastOptions={{
          className: '!text-sm !font-medium !rounded-xl !shadow-lg',
          success: { iconTheme: { primary: '#10b981', secondary: 'white' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: 'white' } },
        }}
      />
    </AppShellContext.Provider>
  );
}

import { useState, createContext, useContext, type ReactNode } from 'react';
import { Sidebar } from './Sidebar';

const SidebarContext = createContext<{ open: () => void }>({ open: () => {} });
export const useSidebar = () => useContext(SidebarContext);

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ open: () => setSidebarOpen(true) }}>
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0 md:ml-56">
          {children}
        </div>
      </div>
    </SidebarContext.Provider>
  );
}

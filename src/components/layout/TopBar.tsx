import { Menu, Search, Command } from 'lucide-react';
import { NotificationBell } from './NotificationBell';
import type { ReactNode } from 'react';

interface TopBarProps {
  title: string;
  onMenuClick: () => void;
  onSearchClick?: () => void;
  actions?: ReactNode;
}

export function TopBar({ title, onMenuClick, onSearchClick, actions }: TopBarProps) {
  return (
    <header className="flex items-center justify-between h-14 px-4 md:px-6 bg-white border-b border-slate-100 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-base font-semibold text-slate-800">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Command palette trigger */}
        <button
          onClick={onSearchClick}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm text-slate-500 transition-colors cursor-pointer"
        >
          <Search size={13} />
          <span className="text-xs">Search...</span>
          <span className="flex items-center gap-0.5 text-[10px] text-slate-400 border border-slate-300 rounded px-1">
            <Command size={9} /> K
          </span>
        </button>

        {actions && <div className="flex items-center gap-2">{actions}</div>}
        <NotificationBell />
      </div>
    </header>
  );
}

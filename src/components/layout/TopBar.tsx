import { Menu } from 'lucide-react';

interface TopBarProps {
  title: string;
  onMenuClick: () => void;
  actions?: React.ReactNode;
}

export function TopBar({ title, onMenuClick, actions }: TopBarProps) {
  return (
    <header className="flex items-center justify-between h-14 px-4 md:px-6 bg-white border-b border-slate-100">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-base font-semibold text-slate-800">{title}</h1>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}

import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, Building2, X, Briefcase, Home,
  CheckSquare, BarChart2, Settings, ChevronDown, ChevronRight,
  UserCog, FolderInput, Bookmark, Calendar, TrendingUp, Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';
import { useUsers } from '../../hooks/useUsers';
import { useTasks } from '../../hooks/useTasks';
import { useSavedViews } from '../../hooks/useSavedViews';

const mainNav = [
  { to: '/dashboard',  label: 'Dashboard',      icon: LayoutDashboard },
  { to: '/clients',    label: 'Clients',         icon: Users },
  { to: '/deals',      label: 'Pipeline',        icon: Briefcase },
  { to: '/properties', label: 'Properties',      icon: Home },
  { to: '/showings',   label: 'Showings',        icon: Calendar },
  { to: '/tasks',      label: 'Tasks',           icon: CheckSquare, badge: true },
  { to: '/analytics',  label: 'Analytics',       icon: BarChart2 },
  { to: '/market',     label: 'Market Pulse',    icon: TrendingUp },
];

const adminNav = [
  { to: '/admin/team',   label: 'Team',           icon: UserCog },
  { to: '/admin/import', label: 'Import',         icon: FolderInput },
  { to: '/settings',     label: 'Settings',       icon: Settings },
];

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const { currentUser } = useUsers();
  const { overdueCt } = useTasks();
  const { views, deleteView } = useSavedViews();
  const [adminOpen, setAdminOpen] = useState(false);
  const [viewsOpen, setViewsOpen] = useState(false);

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/30 z-20 md:hidden" onClick={onClose} />
      )}
      <aside className={cn(
        'fixed top-0 left-0 h-full w-56 bg-white border-r border-slate-100 z-30 flex flex-col transition-transform duration-200',
        mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}>
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
              <Building2 size={15} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 leading-tight">RealTrack</p>
              <p className="text-[10px] text-slate-400 leading-tight">Enterprise CRM</p>
            </div>
          </div>
          <button onClick={onClose} className="md:hidden p-1 rounded hover:bg-slate-100 text-slate-500 cursor-pointer">
            <X size={15} />
          </button>
        </div>

        {/* Main nav */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {mainNav.map(({ to, label, icon: Icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) => cn(
                'flex items-center justify-between gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors group',
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              )}
            >
              <span className="flex items-center gap-2.5">
                <Icon size={16} />
                {label}
              </span>
              {badge && overdueCt > 0 && (
                <span className="text-[10px] font-bold bg-red-500 text-white rounded-full px-1.5 min-w-[18px] text-center">
                  {overdueCt}
                </span>
              )}
            </NavLink>
          ))}

          {/* Saved views section */}
          {views.length > 0 && (
            <div className="pt-3">
              <button
                onClick={() => setViewsOpen(v => !v)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-slate-600 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1.5"><Bookmark size={11} /> Saved Views</span>
                {viewsOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              </button>
              {viewsOpen && (
                <div className="mt-0.5 space-y-0.5">
                  {views.map(view => {
                    const entityPath = view.entity === 'clients' ? '/clients' :
                      view.entity === 'deals' ? '/deals' :
                      view.entity === 'properties' ? '/properties' : '/tasks';
                    return (
                      <div key={view.id} className="flex items-center group">
                        <NavLink
                          to={entityPath}
                          onClick={onClose}
                          className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-800 truncate"
                        >
                          <Bookmark size={11} className="shrink-0 text-slate-400" />
                          <span className="truncate">{view.name}</span>
                        </NavLink>
                        <button
                          onClick={() => deleteView(view.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 mr-1 rounded hover:bg-red-50 text-slate-300 hover:text-red-400 cursor-pointer transition-opacity"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Admin section */}
          <div className="pt-3">
            <button
              onClick={() => setAdminOpen(v => !v)}
              className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-slate-600 transition-colors cursor-pointer"
            >
              Admin
              {adminOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            </button>
            {adminOpen && (
              <div className="mt-0.5 space-y-0.5">
                {adminNav.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={onClose}
                    className={({ isActive }) => cn(
                      'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                    )}
                  >
                    <Icon size={16} /> {label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Current user */}
        {currentUser && (
          <div className="px-3 py-3 border-t border-slate-100">
            <NavLink to="/settings" className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors group">
              <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
                {currentUser.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-700 truncate">{currentUser.name}</p>
                <p className="text-[10px] text-slate-400 capitalize">{currentUser.role}</p>
              </div>
            </NavLink>
          </div>
        )}
      </aside>
    </>
  );
}

import { useState } from 'react';
import { Save, User, Bell, Palette, Keyboard } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TextInput } from '../components/ui/TextInput';
import { useSidebar } from '../components/layout/AppShell';
import { useUsers } from '../hooks/useUsers';
import toast from 'react-hot-toast';

const SHORTCUTS = [
  { keys: 'Cmd + K', action: 'Open command palette' },
  { keys: 'G then D', action: 'Go to Dashboard' },
  { keys: 'G then C', action: 'Go to Clients' },
  { keys: 'G then P', action: 'Go to Pipeline' },
  { keys: 'G then T', action: 'Go to Tasks' },
  { keys: 'N then C', action: 'New Client' },
  { keys: 'N then D', action: 'New Deal' },
  { keys: 'Esc',      action: 'Close modal / palette' },
];

export function SettingsPage() {
  const { openSidebar, openCommandPalette } = useSidebar();
  const { currentUser, updateUser, switchUser, users } = useUsers();
  const [tab, setTab] = useState<'profile' | 'notifications' | 'appearance' | 'shortcuts'>('profile');
  const [name, setName] = useState(currentUser?.name ?? '');
  const [phone, setPhone] = useState(currentUser?.phone ?? '');

  const saveProfile = () => {
    if (currentUser) {
      updateUser(currentUser.id, { name, phone });
      toast.success('Profile saved');
    }
  };

  const tabs = [
    { key: 'profile',       label: 'Profile',    icon: <User size={14} /> },
    { key: 'notifications', label: 'Alerts',     icon: <Bell size={14} /> },
    { key: 'appearance',    label: 'Appearance', icon: <Palette size={14} /> },
    { key: 'shortcuts',     label: 'Shortcuts',  icon: <Keyboard size={14} /> },
  ] as const;

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Settings" onMenuClick={openSidebar} onSearchClick={openCommandPalette} />
      <div className="flex-1 p-4 md:p-6 max-w-2xl space-y-4">
        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${tab === t.key ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {tab === 'profile' && (
          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-800">Your Profile</h3>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl font-bold">
                {currentUser?.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{currentUser?.name}</p>
                <p className="text-xs text-slate-400 capitalize">{currentUser?.role} · {currentUser?.email}</p>
              </div>
            </div>
            <TextInput label="Full Name" value={name} onChange={e => setName(e.target.value)} />
            <TextInput label="Phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(555) 000-0000" />
            <TextInput label="Email" value={currentUser?.email ?? ''} disabled />

            {/* Switch user (for demo) */}
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Switch User (Demo)</label>
              <select
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={currentUser?.id ?? ''}
                onChange={e => switchUser(e.target.value)}
              >
                {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
              </select>
            </div>

            <Button onClick={saveProfile}><Save size={14} /> Save Profile</Button>
          </Card>
        )}

        {tab === 'notifications' && (
          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-800">Notification Preferences</h3>
            {[
              'Task due reminders',
              'Deal stage changes',
              'New client assignments',
              'Team activity summary (daily)',
            ].map(item => (
              <div key={item} className="flex items-center justify-between">
                <span className="text-sm text-slate-700">{item}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-9 h-5 bg-slate-200 peer-checked:bg-indigo-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-indigo-300 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                </label>
              </div>
            ))}
          </Card>
        )}

        {tab === 'appearance' && (
          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-800">Appearance</h3>
            <div className="text-sm text-slate-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
              Dark mode and custom themes coming in Phase 2.
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Data Density</label>
              <div className="mt-2 flex gap-2">
                {['Compact', 'Comfortable', 'Spacious'].map(d => (
                  <button
                    key={d}
                    className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-all cursor-pointer ${d === 'Comfortable' ? 'border-indigo-500 text-indigo-700 bg-indigo-50' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        )}

        {tab === 'shortcuts' && (
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Keyboard Shortcuts</h3>
            <div className="space-y-2">
              {SHORTCUTS.map(s => (
                <div key={s.action} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                  <span className="text-sm text-slate-600">{s.action}</span>
                  <kbd className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200 font-mono">{s.keys}</kbd>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

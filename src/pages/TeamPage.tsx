import { useState } from 'react';
import { Plus, UserX, UserCheck, Mail, Phone } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { TextInput } from '../components/ui/TextInput';
import { Select } from '../components/ui/Select';
import { useSidebar } from '../components/layout/AppShell';
import { useUsers } from '../hooks/useUsers';
import { useClients } from '../hooks/useClients';
import { useDeals } from '../hooks/useDeals';
import type { UserRole } from '../types';
import toast from 'react-hot-toast';

export function TeamPage() {
  const { openSidebar, openCommandPalette } = useSidebar();
  const { users, addUser, updateUser, deactivateUser, getRoleColor } = useUsers();
  const { clients } = useClients();
  const { deals } = useDeals();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'agent' as UserRole, phone: '' });

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    addUser({ name: form.name, email: form.email, role: form.role, phone: form.phone, isActive: true });
    setShowModal(false);
    setForm({ name: '', email: '', role: 'agent', phone: '' });
    toast.success(`${form.name} invited to the team`);
  };

  const stats = (userId: string) => ({
    clients: clients.filter(c => c.assignedTo === userId).length,
    activeDeals: deals.filter(d => d.assignedTo === userId && d.stage !== 'closed_won' && d.stage !== 'closed_lost').length,
    closedDeals: deals.filter(d => d.assignedTo === userId && d.stage === 'closed_won').length,
  });

  return (
    <div className="flex flex-col flex-1">
      <TopBar
        title="Team Management"
        onMenuClick={openSidebar}
        onSearchClick={openCommandPalette}
        actions={
          <Button size="sm" onClick={() => setShowModal(true)}>
            <Plus size={14} /> Invite Member
          </Button>
        }
      />

      <div className="flex-1 p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {users.map(user => {
            const s = stats(user.id);
            return (
              <Card key={user.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold shrink-0">
                      {user.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full capitalize ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                  <div className={`w-2 h-2 rounded-full mt-1 ${user.isActive ? 'bg-emerald-400' : 'bg-slate-300'}`} title={user.isActive ? 'Active' : 'Inactive'} />
                </div>

                <div className="space-y-1 text-xs text-slate-600 mb-3">
                  {user.email && <div className="flex items-center gap-1.5"><Mail size={11} className="text-slate-400" />{user.email}</div>}
                  {user.phone && <div className="flex items-center gap-1.5"><Phone size={11} className="text-slate-400" />{user.phone}</div>}
                </div>

                <div className="grid grid-cols-3 gap-2 text-center mb-3">
                  {[
                    { label: 'Clients', value: s.clients },
                    { label: 'Active', value: s.activeDeals },
                    { label: 'Closed', value: s.closedDeals },
                  ].map(stat => (
                    <div key={stat.label} className="bg-slate-50 rounded-lg py-1.5">
                      <p className="text-sm font-bold text-slate-800">{stat.value}</p>
                      <p className="text-[10px] text-slate-500">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <select
                    className="flex-1 text-xs border border-slate-200 rounded-lg px-2 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    value={user.role}
                    onChange={e => { updateUser(user.id, { role: e.target.value as UserRole }); toast.success('Role updated'); }}
                  >
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="agent">Agent</option>
                    <option value="readonly">Read Only</option>
                  </select>
                  {user.isActive ? (
                    <Button size="sm" variant="ghost" onClick={() => { deactivateUser(user.id); toast.success('User deactivated'); }}>
                      <UserX size={12} />
                    </Button>
                  ) : (
                    <Button size="sm" variant="ghost" onClick={() => { updateUser(user.id, { isActive: true }); toast.success('User reactivated'); }}>
                      <UserCheck size={12} />
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {showModal && (
        <Modal title="Invite Team Member" onClose={() => setShowModal(false)}>
          <form onSubmit={handleInvite} className="space-y-4">
            <TextInput label="Full Name" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Jane Smith" />
            <TextInput label="Email" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jane@brokerage.com" />
            <TextInput label="Phone" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(555) 000-0000" />
            <Select label="Role" value={form.role} onChange={e => set('role', e.target.value)}
              options={[{ value: 'admin', label: 'Admin' }, { value: 'manager', label: 'Manager' }, { value: 'agent', label: 'Agent' }, { value: 'readonly', label: 'Read Only' }]} />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button type="submit">Send Invite</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

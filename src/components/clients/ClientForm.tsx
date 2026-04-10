import { useState, useMemo } from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TextInput } from '../ui/TextInput';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { RichTextEditor } from '../ui/RichTextEditor';
import { useClients } from '../../hooks/useClients';
import type { Client, PropertyType, ClientStatus, ClientType, LeadTemperature } from '../../types';

type FormData = Omit<Client, 'id' | 'createdAt' | 'updatedAt'>;

interface ClientFormProps {
  initial?: Client;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

const defaultForm: FormData = {
  name: '', phone: '', email: '', budget: { min: 0, max: 0 },
  propertyType: 'residential', locationPreference: '', status: 'active', notes: '',
  clientType: 'buyer', leadTemperature: 'warm', source: '',
  preApproved: false, preApprovalAmount: undefined,
  tags: [], score: 50, assignedTo: undefined, customFields: {},
  lastContactedAt: undefined, nextActionDate: undefined,
};

export function ClientForm({ initial, onSubmit, onCancel }: ClientFormProps) {
  const { clients } = useClients();

  const [form, setForm] = useState<FormData>(
    initial
      ? {
          name: initial.name, phone: initial.phone, email: initial.email,
          budget: initial.budget, propertyType: initial.propertyType,
          locationPreference: initial.locationPreference, status: initial.status, notes: initial.notes,
          clientType: initial.clientType ?? 'buyer',
          leadTemperature: initial.leadTemperature ?? 'warm',
          source: initial.source ?? '',
          preApproved: initial.preApproved ?? false,
          preApprovalAmount: initial.preApprovalAmount,
          tags: initial.tags ?? [], score: initial.score ?? 50,
          assignedTo: initial.assignedTo, customFields: initial.customFields ?? {},
          lastContactedAt: initial.lastContactedAt,
          nextActionDate: initial.nextActionDate,
        }
      : defaultForm
  );
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  // Duplicate detection
  const duplicates = useMemo(() => {
    if (!form.name.trim() && !form.email.trim() && !form.phone.trim()) return [];
    return clients.filter(c => {
      if (initial && c.id === initial.id) return false;
      const nameMatch = form.name.trim().length > 2 &&
        c.name.toLowerCase().includes(form.name.trim().toLowerCase().slice(0, 6));
      const emailMatch = form.email.trim() && c.email.toLowerCase() === form.email.trim().toLowerCase();
      const phoneMatch = form.phone.trim().length > 6 &&
        c.phone.replace(/\D/g, '').includes(form.phone.replace(/\D/g, '').slice(0, 7));
      return emailMatch || phoneMatch || nameMatch;
    }).slice(0, 2);
  }, [form.name, form.email, form.phone, clients, initial]);

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    else if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Enter a valid email address';
    if (form.phone.trim() && form.phone.replace(/\D/g, '').length < 7) e.phone = 'Enter a valid phone number';
    if (form.budget.min < 0) e.budget = 'Budget cannot be negative';
    else if (form.budget.max > 0 && form.budget.max < form.budget.min) e.budget = 'Max budget must be ≥ min budget';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Duplicate detection warning */}
      {duplicates.length > 0 && (
        <div className="flex gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertTriangle size={15} className="text-amber-500 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800">
            <p className="font-semibold mb-1">Possible duplicate{duplicates.length > 1 ? 's' : ''} found:</p>
            {duplicates.map(d => (
              <Link key={d.id} to={`/clients/${d.id}`} target="_blank"
                className="flex items-center gap-1 hover:underline text-amber-700">
                <ExternalLink size={10} /> {d.name} — {d.email}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <TextInput label="Full Name" value={form.name} onChange={e => set('name', e.target.value)} error={errors.name} placeholder="Jane Smith" className="sm:col-span-2" />
        <TextInput label="Phone" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} error={errors.phone} placeholder="(555) 000-0000" />
        <TextInput label="Email" type="email" value={form.email} onChange={e => set('email', e.target.value)} error={errors.email} placeholder="client@email.com" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Select label="Status" value={form.status} onChange={e => set('status', e.target.value as ClientStatus)}
          options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }, { value: 'nurture', label: 'Nurture' }, { value: 'closed', label: 'Closed' }, { value: 'lost', label: 'Lost' }]} />
        <Select label="Client Type" value={form.clientType} onChange={e => set('clientType', e.target.value as ClientType)}
          options={[{ value: 'buyer', label: 'Buyer' }, { value: 'seller', label: 'Seller' }, { value: 'investor', label: 'Investor' }, { value: 'both', label: 'Buyer + Seller' }, { value: 'tenant', label: 'Tenant' }, { value: 'landlord', label: 'Landlord' }]} />
        <Select label="Property Type" value={form.propertyType} onChange={e => set('propertyType', e.target.value as PropertyType)}
          options={[{ value: 'residential', label: 'Residential' }, { value: 'commercial', label: 'Commercial' }, { value: 'land', label: 'Land' }, { value: 'multi-family', label: 'Multi-Family' }, { value: 'any', label: 'Any' }]} />
        <Select label="Lead Temperature" value={form.leadTemperature} onChange={e => set('leadTemperature', e.target.value as LeadTemperature)}
          options={[{ value: 'hot', label: '🔥 Hot' }, { value: 'warm', label: '🌡 Warm' }, { value: 'cold', label: '❄️ Cold' }]} />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Budget Range (USD)</label>
        {errors.budget && <p className="text-xs text-red-500">{errors.budget}</p>}
        <div className="flex items-center gap-2">
          <input type="number" className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Min" value={form.budget.min || ''} onChange={e => set('budget', { ...form.budget, min: Number(e.target.value) })} />
          <span className="text-slate-400 text-sm">–</span>
          <input type="number" className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Max" value={form.budget.max || ''} onChange={e => set('budget', { ...form.budget, max: Number(e.target.value) })} />
        </div>
      </div>

      <TextInput label="Location Preference" value={form.locationPreference} onChange={e => set('locationPreference', e.target.value)} error={errors.locationPreference} placeholder="e.g. Downtown Austin, TX" />

      <div className="grid grid-cols-2 gap-3">
        <Select label="Lead Source" value={form.source ?? ''} onChange={e => set('source', e.target.value)}
          options={[{ value: '', label: 'Unknown' }, { value: 'referral', label: 'Referral' }, { value: 'website', label: 'Website' }, { value: 'zillow', label: 'Zillow' }, { value: 'open_house', label: 'Open House' }, { value: 'cold_call', label: 'Cold Call' }]} />
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Pre-Approved</label>
          <div className="flex items-center gap-3 pt-1">
            <label className="flex items-center gap-1.5 text-sm text-slate-700 cursor-pointer">
              <input type="radio" checked={form.preApproved} onChange={() => set('preApproved', true)} /> Yes
            </label>
            <label className="flex items-center gap-1.5 text-sm text-slate-700 cursor-pointer">
              <input type="radio" checked={!form.preApproved} onChange={() => set('preApproved', false)} /> No
            </label>
          </div>
        </div>
      </div>

      {form.preApproved && (
        <TextInput label="Pre-Approval Amount ($)" type="number" value={form.preApprovalAmount ?? ''} onChange={e => set('preApprovalAmount', Number(e.target.value) || undefined)} placeholder="e.g. 500000" />
      )}

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Next Action Date</label>
        <input
          type="date"
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={form.nextActionDate ? form.nextActionDate.slice(0, 10) : ''}
          onChange={e => set('nextActionDate', e.target.value || undefined)}
        />
        <p className="text-[10px] text-slate-400">When should you next contact this client?</p>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Notes</label>
        <RichTextEditor
          value={form.notes}
          onChange={val => set('notes', val)}
          placeholder="Any additional details…"
          minHeight="80px"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{initial ? 'Save Changes' : 'Add Client'}</Button>
      </div>
    </form>
  );
}

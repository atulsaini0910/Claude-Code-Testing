import { useState } from 'react';
import { TextInput } from '../ui/TextInput';
import { Button } from '../ui/Button';
import type { Client, PropertyType, ClientStatus } from '../../types';

type FormData = Omit<Client, 'id' | 'createdAt' | 'updatedAt'>;

interface ClientFormProps {
  initial?: Client;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

const defaultForm: FormData = {
  name: '',
  phone: '',
  email: '',
  budget: { min: 0, max: 0 },
  propertyType: 'residential',
  locationPreference: '',
  status: 'active',
  notes: '',
};

const selectClass =
  'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent';

export function ClientForm({ initial, onSubmit, onCancel }: ClientFormProps) {
  const [form, setForm] = useState<FormData>(
    initial
      ? {
          name: initial.name,
          phone: initial.phone,
          email: initial.email,
          budget: initial.budget,
          propertyType: initial.propertyType,
          locationPreference: initial.locationPreference,
          status: initial.status,
          notes: initial.notes,
        }
      : defaultForm
  );
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    if (!form.email.trim()) e.email = 'Email is required';
    if (form.budget.min < 0) e.budget = 'Min budget must be ≥ 0';
    if (form.budget.max < form.budget.min) e.budget = 'Max must be ≥ min';
    if (!form.locationPreference.trim()) e.locationPreference = 'Location is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextInput
          label="Full Name"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          error={errors.name}
          placeholder="Jane Smith"
        />
        <TextInput
          label="Phone"
          type="tel"
          value={form.phone}
          onChange={(e) => set('phone', e.target.value)}
          error={errors.phone}
          placeholder="(555) 000-0000"
        />
        <TextInput
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => set('email', e.target.value)}
          error={errors.email}
          placeholder="client@email.com"
          className="sm:col-span-2"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Status</label>
          <select
            className={selectClass}
            value={form.status}
            onChange={(e) => set('status', e.target.value as ClientStatus)}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Property Type</label>
          <select
            className={selectClass}
            value={form.propertyType}
            onChange={(e) => set('propertyType', e.target.value as PropertyType)}
          >
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="land">Land</option>
            <option value="multi-family">Multi-Family</option>
            <option value="any">Any</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
          Budget Range (USD)
        </label>
        {errors.budget && <p className="text-xs text-red-500">{errors.budget}</p>}
        <div className="flex items-center gap-2">
          <input
            type="number"
            className={selectClass}
            placeholder="Min (e.g. 200000)"
            value={form.budget.min || ''}
            onChange={(e) => set('budget', { ...form.budget, min: Number(e.target.value) })}
          />
          <span className="text-slate-400">–</span>
          <input
            type="number"
            className={selectClass}
            placeholder="Max (e.g. 500000)"
            value={form.budget.max || ''}
            onChange={(e) => set('budget', { ...form.budget, max: Number(e.target.value) })}
          />
        </div>
      </div>

      <TextInput
        label="Location Preference"
        value={form.locationPreference}
        onChange={(e) => set('locationPreference', e.target.value)}
        error={errors.locationPreference}
        placeholder="e.g. Downtown Austin, TX"
      />

      <TextInput
        as="textarea"
        label="Notes"
        value={form.notes}
        onChange={(e) => set('notes', e.target.value)}
        placeholder="Any additional details about this client..."
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{initial ? 'Save Changes' : 'Add Client'}</Button>
      </div>
    </form>
  );
}

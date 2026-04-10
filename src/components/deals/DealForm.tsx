import { useState } from 'react';
import { TextInput } from '../ui/TextInput';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { RichTextEditor } from '../ui/RichTextEditor';
import type { Deal, DealStage, DealType } from '../../types';

type FormData = Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>;

interface DealFormProps {
  initial?: Deal;
  clients: { id: string; name: string }[];
  properties: { id: string; addressLine1: string; city: string }[];
  defaultClientId?: string;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

const defaultForm: FormData = {
  clientId: '', propertyId: undefined, title: '', type: 'purchase',
  stage: 'inquiry', value: undefined, commissionPct: 3, agentSplitPct: 70,
  closeDate: undefined, lossReason: '', notes: '', assignedTo: undefined, tags: [],
};

export function DealForm({ initial, clients, properties, defaultClientId, onSubmit, onCancel }: DealFormProps) {
  const [form, setForm] = useState<FormData>(() =>
    initial
      ? { clientId: initial.clientId, propertyId: initial.propertyId, title: initial.title,
          type: initial.type, stage: initial.stage, value: initial.value, commissionPct: initial.commissionPct,
          agentSplitPct: initial.agentSplitPct ?? 70,
          closeDate: initial.closeDate, lossReason: initial.lossReason, notes: initial.notes,
          assignedTo: initial.assignedTo, tags: initial.tags }
      : { ...defaultForm, clientId: defaultClientId ?? '' }
  );
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const set = <K extends keyof FormData>(k: K, v: FormData[K]) => setForm(p => ({ ...p, [k]: v }));

  const validate = () => {
    const e: typeof errors = {};
    if (!form.title.trim()) e.title = 'Deal title is required';
    else if (form.title.trim().length < 3) e.title = 'Title must be at least 3 characters';
    if (!form.clientId) e.clientId = 'Please select a client';
    if (form.value !== undefined && form.value < 0) e.value = 'Value cannot be negative';
    if (form.commissionPct !== undefined && (form.commissionPct < 0 || form.commissionPct > 20)) e.commissionPct = 'Commission must be 0–20%';
    if (form.agentSplitPct !== undefined && (form.agentSplitPct < 0 || form.agentSplitPct > 100)) e.agentSplitPct = 'Split must be 0–100%';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextInput label="Deal Title" value={form.title} onChange={e => set('title', e.target.value)} error={errors.title} placeholder="e.g. Sarah Mitchell — 12 Oak Lane" />

      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Client"
          value={form.clientId}
          onChange={e => set('clientId', e.target.value)}
          options={[{ value: '', label: 'Select client…' }, ...clients.map(c => ({ value: c.id, label: c.name }))]}
          error={errors.clientId}
        />
        <Select
          label="Property (optional)"
          value={form.propertyId ?? ''}
          onChange={e => set('propertyId', e.target.value || undefined)}
          options={[{ value: '', label: 'None' }, ...properties.map(p => ({ value: p.id, label: `${p.addressLine1}, ${p.city}` }))]}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Select label="Type" value={form.type} onChange={e => set('type', e.target.value as DealType)}
          options={[{ value: 'purchase', label: 'Purchase' }, { value: 'sale', label: 'Sale' }, { value: 'lease', label: 'Lease' }, { value: 'referral', label: 'Referral' }]} />
        <Select label="Stage" value={form.stage} onChange={e => set('stage', e.target.value as DealStage)}
          options={[
            { value: 'inquiry', label: 'Inquiry' }, { value: 'showing', label: 'Showing' },
            { value: 'offer', label: 'Offer' }, { value: 'under_contract', label: 'Under Contract' },
            { value: 'closed_won', label: 'Closed Won' }, { value: 'closed_lost', label: 'Closed Lost' },
          ]} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <TextInput label="Deal Value ($)" type="number" value={form.value ?? ''} onChange={e => set('value', e.target.value ? Number(e.target.value) : undefined)} error={errors.value as string} placeholder="500000" />
        <TextInput label="Commission (%)" type="number" value={form.commissionPct ?? ''} onChange={e => set('commissionPct', e.target.value ? Number(e.target.value) : undefined)} error={errors.commissionPct as string} placeholder="3" />
        <TextInput label="Agent Split (%)" type="number" value={form.agentSplitPct ?? ''} onChange={e => set('agentSplitPct', e.target.value ? Number(e.target.value) : undefined)} error={errors.agentSplitPct as string} placeholder="70" />
      </div>

      <TextInput label="Expected Close Date" type="date" value={form.closeDate ? form.closeDate.slice(0, 10) : ''} onChange={e => set('closeDate', e.target.value || undefined)} />

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Notes</label>
        <RichTextEditor
          value={form.notes}
          onChange={val => set('notes', val)}
          placeholder="Deal notes…"
          minHeight="80px"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{initial ? 'Save Changes' : 'Create Deal'}</Button>
      </div>
    </form>
  );
}

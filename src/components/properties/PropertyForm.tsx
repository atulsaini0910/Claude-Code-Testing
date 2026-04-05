import { useState } from 'react';
import { Button } from '../ui/Button';
import type { Property, PropertyStatus, PropertyType } from '../../types';

interface PropertyFormProps {
  initial?: Property;
  onSubmit: (d: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function PropertyForm({ initial, onSubmit, onCancel }: PropertyFormProps) {
  const [form, setForm] = useState({
    addressLine1: initial?.addressLine1 ?? '',
    city: initial?.city ?? '',
    state: initial?.state ?? 'TX',
    zip: initial?.zip ?? '',
    propertyType: (initial?.propertyType ?? 'residential') as PropertyType,
    status: (initial?.status ?? 'available') as PropertyStatus,
    listPrice: initial?.listPrice ?? '',
    beds: initial?.beds ?? '',
    baths: initial?.baths ?? '',
    sqft: initial?.sqft ?? '',
    mlsId: initial?.mlsId ?? '',
    description: initial?.description ?? '',
    features: initial?.features.join(', ') ?? '',
    assignedTo: initial?.assignedTo ?? '',
    tags: initial?.tags ?? [],
  });

  const set = (k: string, v: unknown) => setForm(p => ({ ...p, [k]: v }));

  const labelCls = 'text-xs font-semibold text-slate-600 uppercase tracking-wide';
  const inputCls = 'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      addressLine1: form.addressLine1,
      city: form.city,
      state: form.state,
      zip: form.zip,
      propertyType: form.propertyType,
      status: form.status,
      listPrice: form.listPrice ? Number(form.listPrice) : undefined,
      beds: form.beds ? Number(form.beds) : undefined,
      baths: form.baths ? Number(form.baths) : undefined,
      sqft: form.sqft ? Number(form.sqft) : undefined,
      mlsId: form.mlsId || undefined,
      description: form.description,
      features: form.features.split(',').map((f: string) => f.trim()).filter(Boolean),
      soldPrice: initial?.soldPrice,
      assignedTo: form.assignedTo || undefined,
      tags: form.tags,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelCls}>Address</label>
        <input className={inputCls + ' mt-1'} value={form.addressLine1} onChange={e => set('addressLine1', e.target.value)} placeholder="123 Main St" required />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2">
          <label className={labelCls}>City</label>
          <input className={inputCls + ' mt-1'} value={form.city} onChange={e => set('city', e.target.value)} placeholder="Austin" required />
        </div>
        <div>
          <label className={labelCls}>State</label>
          <input className={inputCls + ' mt-1'} value={form.state} onChange={e => set('state', e.target.value)} placeholder="TX" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>ZIP</label>
          <input className={inputCls + ' mt-1'} value={form.zip} onChange={e => set('zip', e.target.value)} placeholder="78701" />
        </div>
        <div>
          <label className={labelCls}>MLS ID</label>
          <input className={inputCls + ' mt-1'} value={form.mlsId} onChange={e => set('mlsId', e.target.value)} placeholder="MLS-2024-001" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Type</label>
          <select className={inputCls + ' mt-1'} value={form.propertyType} onChange={e => set('propertyType', e.target.value)}>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="land">Land</option>
            <option value="multi-family">Multi-Family</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Status</label>
          <select className={inputCls + ' mt-1'} value={form.status} onChange={e => set('status', e.target.value)}>
            <option value="available">Available</option>
            <option value="under_contract">Under Contract</option>
            <option value="sold">Sold</option>
            <option value="off_market">Off Market</option>
            <option value="coming_soon">Coming Soon</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className={labelCls}>Beds</label>
          <input type="number" className={inputCls + ' mt-1'} value={form.beds} onChange={e => set('beds', e.target.value)} placeholder="3" />
        </div>
        <div>
          <label className={labelCls}>Baths</label>
          <input type="number" step="0.5" className={inputCls + ' mt-1'} value={form.baths} onChange={e => set('baths', e.target.value)} placeholder="2" />
        </div>
        <div>
          <label className={labelCls}>Sqft</label>
          <input type="number" className={inputCls + ' mt-1'} value={form.sqft} onChange={e => set('sqft', e.target.value)} placeholder="2000" />
        </div>
      </div>
      <div>
        <label className={labelCls}>List Price ($)</label>
        <input type="number" className={inputCls + ' mt-1'} value={form.listPrice} onChange={e => set('listPrice', e.target.value)} placeholder="450000" />
      </div>
      <div>
        <label className={labelCls}>Features (comma separated)</label>
        <input className={inputCls + ' mt-1'} value={form.features} onChange={e => set('features', e.target.value)} placeholder="pool, garage, hardwood floors" />
      </div>
      <div>
        <label className={labelCls}>Description</label>
        <textarea className={inputCls + ' mt-1 resize-none'} rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Property description..." />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{initial ? 'Save Changes' : 'Add Property'}</Button>
      </div>
    </form>
  );
}

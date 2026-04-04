import { useState } from 'react';
import { Plus, Search, Bed, Bath, Maximize, MapPin, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '../components/layout/TopBar';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Drawer } from '../components/ui/Drawer';
import { EmptyState } from '../components/ui/EmptyState';
import { useSidebar } from '../components/layout/AppShell';
import { useProperties } from '../hooks/useProperties';
import { formatCurrency } from '../lib/utils';
import type { Property, PropertyStatus, PropertyType } from '../types';
import toast from 'react-hot-toast';

const statusOptions: { value: PropertyStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Status' },
  { value: 'available', label: 'Available' },
  { value: 'under_contract', label: 'Under Contract' },
  { value: 'sold', label: 'Sold' },
  { value: 'off_market', label: 'Off Market' },
  { value: 'coming_soon', label: 'Coming Soon' },
];

const typeOptions: { value: PropertyType | 'all'; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'land', label: 'Land' },
  { value: 'multi-family', label: 'Multi-Family' },
];

const selectClass = 'rounded-lg border border-slate-200 text-sm text-slate-700 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white';

function PropertyCard({ property, onClick }: { property: Property; onClick: () => void }) {
  return (
    <Card onClick={onClick} className="p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">{property.addressLine1}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin size={11} className="text-slate-400" />
            <span className="text-xs text-slate-500">{property.city}, {property.state} {property.zip}</span>
          </div>
        </div>
        <Badge value={property.status} label={property.status.replace('_', ' ')} />
      </div>

      <div className="flex items-center gap-3 text-xs text-slate-600 my-2">
        {property.beds != null && <span className="flex items-center gap-1"><Bed size={11} /> {property.beds} bd</span>}
        {property.baths != null && <span className="flex items-center gap-1"><Bath size={11} /> {property.baths} ba</span>}
        {property.sqft != null && <span className="flex items-center gap-1"><Maximize size={11} /> {property.sqft?.toLocaleString()} sqft</span>}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-base font-bold text-slate-800">
          {property.listPrice ? formatCurrency(property.listPrice) : '—'}
        </span>
        <Badge value={property.propertyType} />
      </div>

      {property.mlsId && (
        <p className="text-[10px] text-slate-400 mt-1">MLS #{property.mlsId}</p>
      )}
    </Card>
  );
}

function PropertyForm({ initial, onSubmit, onCancel }: {
  initial?: Property;
  onSubmit: (d: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}) {
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
      features: form.features.split(',').map(f => f.trim()).filter(Boolean),
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

export function PropertiesPage() {
  const { openSidebar, openCommandPalette } = useSidebar();
  const { filteredProperties, searchQuery, setSearchQuery, filters, setFilters, addProperty } = useProperties();
  const navigate = useNavigate();
  const [showDrawer, setShowDrawer] = useState(false);

  const handleAdd = (data: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => {
    addProperty(data);
    setShowDrawer(false);
    toast.success('Property added');
  };

  return (
    <div className="flex flex-col flex-1">
      <TopBar
        title="Properties"
        onMenuClick={openSidebar}
        onSearchClick={openCommandPalette}
        actions={
          <Button size="sm" onClick={() => setShowDrawer(true)}>
            <Plus size={14} /> Add Property
          </Button>
        }
      />

      <div className="flex-1 p-4 md:p-6 space-y-4">
        {/* Search + filters */}
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by address, city, MLS…"
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <select className={selectClass} value={filters.status} onChange={e => setFilters({ status: e.target.value as PropertyStatus | 'all' })}>
            {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <select className={selectClass} value={filters.propertyType} onChange={e => setFilters({ propertyType: e.target.value as PropertyType | 'all' })}>
            {typeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <p className="text-xs text-slate-400">{filteredProperties.length} properties</p>

        {filteredProperties.length === 0 ? (
          <EmptyState
            icon={<Home size={40} />}
            title="No properties found"
            description="Add your first property listing to get started."
            action={<Button onClick={() => setShowDrawer(true)}><Plus size={14} /> Add Property</Button>}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProperties.map(p => (
              <PropertyCard key={p.id} property={p} onClick={() => navigate(`/properties/${p.id}`)} />
            ))}
          </div>
        )}
      </div>

      <Drawer open={showDrawer} onClose={() => setShowDrawer(false)} title="Add Property">
        <PropertyForm onSubmit={handleAdd} onCancel={() => setShowDrawer(false)} />
      </Drawer>
    </div>
  );
}

import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Home, Bed, Bath, Square } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Drawer } from '../components/ui/Drawer';
import { PropertyForm } from '../components/properties/PropertyForm';
import { Modal } from '../components/ui/Modal';
import { useSidebar } from '../components/layout/AppShell';
import { useProperties } from '../hooks/useProperties';
import { useDeals } from '../hooks/useDeals';
import { useClients } from '../hooks/useClients';
import { useActivityLog } from '../hooks/useActivityLog';
import { formatCurrency, formatDate, cn } from '../lib/utils';
import type { Property } from '../types';
import toast from 'react-hot-toast';

function daysOnMarket(createdAt: string): number {
  return Math.floor((Date.now() - new Date(createdAt).getTime()) / 86400000);
}

export function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { openSidebar, openCommandPalette } = useSidebar();
  const { updateProperty, deleteProperty, getProperty } = useProperties();
  const { deals } = useDeals();
  const { clients } = useClients();
  const { entries } = useActivityLog();

  const [showEdit, setShowEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const property = id ? getProperty(id) : undefined;
  const linkedDeals = deals.filter(d => d.propertyId === id);
  const linkedActivities = entries.filter(e => e.propertyId === id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const dom = property ? daysOnMarket(property.createdAt) : 0;

  if (!property) {
    return (
      <div className="flex flex-col flex-1">
        <TopBar title="Property Not Found" onMenuClick={openSidebar} onSearchClick={openCommandPalette} />
        <div className="flex flex-col items-center justify-center flex-1 gap-4">
          <p className="text-slate-500">This property doesn't exist or was deleted.</p>
          <Button variant="secondary" onClick={() => navigate('/properties')}>
            <ArrowLeft size={14} /> Back to Properties
          </Button>
        </div>
      </div>
    );
  }

  const handleUpdate = (data: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => {
    updateProperty(property.id, data);
    setShowEdit(false);
    toast.success('Property updated');
  };

  const handleDelete = () => {
    deleteProperty(property.id);
    navigate('/properties');
    toast.success('Property deleted');
  };

  const statusColor: Record<string, string> = {
    available: 'bg-emerald-100 text-emerald-700',
    under_contract: 'bg-amber-100 text-amber-700',
    sold: 'bg-slate-100 text-slate-600',
    off_market: 'bg-red-100 text-red-600',
    coming_soon: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="flex flex-col flex-1">
      <TopBar
        title={`${property.addressLine1}, ${property.city}`}
        onMenuClick={openSidebar}
        onSearchClick={openCommandPalette}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => navigate('/properties')}>
              <ArrowLeft size={14} /> Properties
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setShowEdit(true)}>
              <Edit2 size={14} /> Edit
            </Button>
            <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>
              <Trash2 size={14} />
            </Button>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Left: Property Info */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="p-5">
              {/* Status + Type */}
              <div className="flex items-center gap-2 mb-4">
                <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full capitalize', statusColor[property.status] ?? 'bg-slate-100 text-slate-600')}>
                  {property.status.replace('_', ' ')}
                </span>
                <Badge value={property.propertyType} />
              </div>

              {/* Address */}
              <div className="mb-4">
                <h2 className="text-base font-bold text-slate-800">{property.addressLine1}</h2>
                <p className="text-sm text-slate-500">{property.city}, {property.state} {property.zip}</p>
                {property.mlsId && <p className="text-xs text-slate-400 mt-1">MLS: {property.mlsId}</p>}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 text-center">
                  <p className="text-xs text-slate-500 mb-0.5">List Price</p>
                  <p className="text-sm font-bold text-slate-800">{property.listPrice ? formatCurrency(property.listPrice) : '—'}</p>
                </div>
                {property.soldPrice && (
                  <div className="bg-emerald-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-500 mb-0.5">Sold Price</p>
                    <p className="text-sm font-bold text-emerald-700">{formatCurrency(property.soldPrice)}</p>
                  </div>
                )}
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 text-center">
                  <p className="text-xs text-slate-500 mb-0.5">Days Listed</p>
                  <p className={cn('text-sm font-bold', dom > 60 ? 'text-red-500' : dom > 30 ? 'text-amber-600' : 'text-slate-800')}>{dom}</p>
                </div>
              </div>

              {/* Beds/Baths/Sqft */}
              <div className="flex items-center gap-4 text-sm text-slate-700 mb-4">
                {property.beds != null && (
                  <div className="flex items-center gap-1">
                    <Bed size={14} className="text-slate-400" />
                    <span>{property.beds} bd</span>
                  </div>
                )}
                {property.baths != null && (
                  <div className="flex items-center gap-1">
                    <Bath size={14} className="text-slate-400" />
                    <span>{property.baths} ba</span>
                  </div>
                )}
                {property.sqft && (
                  <div className="flex items-center gap-1">
                    <Square size={14} className="text-slate-400" />
                    <span>{property.sqft.toLocaleString()} sqft</span>
                  </div>
                )}
              </div>

              {/* Features */}
              {property.features.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Features</p>
                  <div className="flex flex-wrap gap-1.5">
                    {property.features.map(f => (
                      <span key={f} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{f}</span>
                    ))}
                  </div>
                </div>
              )}

              {property.description && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Description</p>
                  <p className="text-sm text-slate-700">{property.description}</p>
                </div>
              )}
            </Card>

            {/* Quick stats */}
            <Card className="p-4 space-y-2">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Quick Stats</h3>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Linked deals</span>
                <span className="font-medium">{linkedDeals.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Activities</span>
                <span className="font-medium">{linkedActivities.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Listed</span>
                <span className="font-medium">{formatDate(property.createdAt)}</span>
              </div>
            </Card>
          </div>

          {/* Right: Deals + Activity */}
          <div className="lg:col-span-2 space-y-5">

            {/* Linked Deals */}
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Home size={14} className="text-indigo-500" />
                <h3 className="text-sm font-semibold text-slate-800">Linked Deals ({linkedDeals.length})</h3>
              </div>
              {linkedDeals.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">No deals linked to this property.</p>
              ) : (
                <div className="space-y-2">
                  {linkedDeals.map(deal => {
                    const client = clients.find(c => c.id === deal.clientId);
                    return (
                      <Link key={deal.id} to={`/deals/${deal.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border border-slate-100 dark:border-slate-700">
                        <div>
                          <p className="text-sm font-medium text-slate-800">{deal.title}</p>
                          {client && <p className="text-xs text-slate-400">{client.name}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          {deal.value && <span className="text-xs text-slate-600">{formatCurrency(deal.value)}</span>}
                          <Badge value={deal.stage} />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Activity */}
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Activity Log</h3>
              {linkedActivities.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">No activity linked to this property.</p>
              ) : (
                <div className="space-y-2">
                  {linkedActivities.map(entry => (
                    <div key={entry.id} className="flex gap-3 py-2 border-b border-slate-50 last:border-0">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge value={entry.type} />
                          <span className="text-sm text-slate-700">{entry.title}</span>
                        </div>
                        {entry.body && <p className="text-xs text-slate-400 mt-1">{entry.body}</p>}
                      </div>
                      <span className="text-xs text-slate-400 shrink-0">{formatDate(entry.createdAt)}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Drawer */}
      <Drawer open={showEdit} onClose={() => setShowEdit(false)} title="Edit Property">
        <PropertyForm
          initial={property}
          onSubmit={handleUpdate}
          onCancel={() => setShowEdit(false)}
        />
      </Drawer>

      {/* Delete Confirm */}
      {confirmDelete && (
        <Modal title="Delete Property" onClose={() => setConfirmDelete(false)}>
          <p className="text-sm text-slate-600 mb-6">
            Are you sure you want to delete <strong>{property.addressLine1}</strong>? This cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setConfirmDelete(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete Property</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}


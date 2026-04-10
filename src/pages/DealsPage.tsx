import { useState } from 'react';
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors,
  type DragStartEvent, type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { Plus, TrendingUp, Briefcase, Download } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { DealCard } from '../components/deals/DealCard';
import { DealForm } from '../components/deals/DealForm';
import { Drawer } from '../components/ui/Drawer';
import { Button } from '../components/ui/Button';
import { useSidebar } from '../components/layout/AppShell';
import { useDeals } from '../hooks/useDeals';
import { useClients } from '../hooks/useClients';
import { useProperties } from '../hooks/useProperties';
import { formatCurrency, cn } from '../lib/utils';
import { exportDealsCSV } from '../lib/csvExport';
import type { Deal, DealStage } from '../types';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const STAGES: { key: DealStage; label: string; color: string; headerColor: string }[] = [
  { key: 'inquiry',        label: 'Inquiry',        color: 'border-slate-200',  headerColor: 'bg-slate-50 text-slate-600' },
  { key: 'showing',        label: 'Showing',        color: 'border-blue-200',   headerColor: 'bg-blue-50 text-blue-700' },
  { key: 'offer',          label: 'Offer',          color: 'border-amber-200',  headerColor: 'bg-amber-50 text-amber-700' },
  { key: 'under_contract', label: 'Under Contract', color: 'border-purple-200', headerColor: 'bg-purple-50 text-purple-700' },
  { key: 'closed_won',     label: 'Closed Won',     color: 'border-emerald-200',headerColor: 'bg-emerald-50 text-emerald-700' },
  { key: 'closed_lost',    label: 'Lost',           color: 'border-red-200',    headerColor: 'bg-red-50 text-red-500' },
];

function DroppableColumn({ stage, deals, clients, headerColor, borderColor }: {
  stage: { key: DealStage; label: string };
  deals: Deal[];
  clients: Map<string, string>;
  headerColor: string;
  borderColor: string;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.key });
  const navigate = useNavigate();

  const totalValue = deals.reduce((s, d) => s + (d.value ?? 0), 0);

  return (
    <div className={cn(
      'flex flex-col rounded-xl border-2 transition-colors',
      borderColor,
      isOver && 'border-indigo-400 bg-indigo-50/20'
    )}>
      {/* Column header */}
      <div className={cn('rounded-t-lg px-3 py-2.5', headerColor)}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide">{stage.label}</span>
          <span className="text-xs font-bold">{deals.length}</span>
        </div>
        {totalValue > 0 && (
          <p className="text-[10px] mt-0.5 opacity-70">{formatCurrency(totalValue)}</p>
        )}
      </div>

      {/* Cards */}
      <div
        ref={setNodeRef}
        className="flex-1 p-2 space-y-2 min-h-[200px]"
      >
        <SortableContext items={deals.map(d => d.id)} strategy={verticalListSortingStrategy}>
          {deals.map(deal => (
            <DealCard
              key={deal.id}
              deal={deal}
              clientName={clients.get(deal.clientId)}
              onClick={() => navigate(`/deals/${deal.id}`)}
            />
          ))}
        </SortableContext>
        {deals.length === 0 && (
          <div className="flex items-center justify-center h-20 text-xs text-slate-300 rounded-lg border border-dashed border-slate-200">
            Drop here
          </div>
        )}
      </div>
    </div>
  );
}

export function DealsPage() {
  const { openSidebar, openCommandPalette } = useSidebar();
  const { deals, addDeal, moveDeal, dealsByStage, pipelineValue } = useDeals();
  const { clients } = useClients();
  const { properties } = useProperties();
  const [showDrawer, setShowDrawer] = useState(false);
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);

  const clientMap = new Map(clients.map(c => [c.id, c.name]));
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragStart = (e: DragStartEvent) => {
    const deal = deals.find(d => d.id === e.active.id);
    if (deal) setActiveDeal(deal);
  };

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveDeal(null);
    const { active, over } = e;
    if (!over) return;
    const newStage = over.id as DealStage;
    const deal = deals.find(d => d.id === active.id);
    if (deal && deal.stage !== newStage && STAGES.some(s => s.key === newStage)) {
      moveDeal(String(active.id), newStage);
      toast.success(`Moved to ${STAGES.find(s => s.key === newStage)?.label}`);
    }
  };

  const handleAdd = (data: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => {
    addDeal(data);
    setShowDrawer(false);
    toast.success('Deal created');
  };

  const closedDeals = dealsByStage['closed_won'].length;
  const activeDeals = deals.filter(d => d.stage !== 'closed_won' && d.stage !== 'closed_lost').length;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <TopBar
        title="Deal Pipeline"
        onMenuClick={openSidebar}
        onSearchClick={openCommandPalette}
        actions={
          <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => exportDealsCSV(deals)}>
            <Download size={14} /> Export
          </Button>
          <Button size="sm" onClick={() => setShowDrawer(true)}>
            <Plus size={14} /> New Deal
          </Button>
          </div>
        }
      />

      {/* Pipeline stats */}
      <div className="flex items-center gap-6 px-4 md:px-6 py-3 bg-white border-b border-slate-100">
        <div className="flex items-center gap-2">
          <TrendingUp size={14} className="text-indigo-500" />
          <span className="text-xs text-slate-500">Pipeline</span>
          <span className="text-sm font-bold text-slate-800">{formatCurrency(pipelineValue)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Briefcase size={14} className="text-emerald-500" />
          <span className="text-xs text-slate-500">Active</span>
          <span className="text-sm font-bold text-slate-800">{activeDeals}</span>
        </div>
        <div className="flex items-center gap-2">
          <Briefcase size={14} className="text-slate-400" />
          <span className="text-xs text-slate-500">Closed Won</span>
          <span className="text-sm font-bold text-slate-800">{closedDeals}</span>
        </div>
      </div>

      {/* Kanban board */}
      <div className="flex-1 overflow-x-auto p-4 md:p-6">
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex gap-3 h-full min-w-max">
            {STAGES.map(stage => (
              <div key={stage.key} className="w-64 flex flex-col">
                <DroppableColumn
                  stage={stage}
                  deals={dealsByStage[stage.key] ?? []}
                  clients={clientMap}
                  headerColor={stage.headerColor}
                  borderColor={stage.color}
                />
              </div>
            ))}
          </div>
          <DragOverlay>
            {activeDeal && (
              <DealCard
                deal={activeDeal}
                clientName={clientMap.get(activeDeal.clientId)}
                overlay
              />
            )}
          </DragOverlay>
        </DndContext>
      </div>

      <Drawer open={showDrawer} onClose={() => setShowDrawer(false)} title="New Deal">
        <DealForm
          clients={clients.map(c => ({ id: c.id, name: c.name }))}
          properties={properties.map(p => ({ id: p.id, addressLine1: p.addressLine1, city: p.city }))}
          onSubmit={handleAdd}
          onCancel={() => setShowDrawer(false)}
        />
      </Drawer>
    </div>
  );
}

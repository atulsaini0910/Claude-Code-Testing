import type { ClientFilters } from '../../types';

interface ClientFiltersProps {
  filters: ClientFilters;
  setFilters: (f: Partial<ClientFilters>) => void;
}

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'closed', label: 'Closed' },
];

const propertyOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'land', label: 'Land' },
  { value: 'multi-family', label: 'Multi-Family' },
  { value: 'any', label: 'Any' },
];

const selectClass =
  'rounded-lg border border-slate-200 text-sm text-slate-700 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white';

export function ClientFilters({ filters, setFilters }: ClientFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <select
        className={selectClass}
        value={filters.status}
        onChange={(e) => setFilters({ status: e.target.value as ClientFilters['status'] })}
      >
        {statusOptions.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <select
        className={selectClass}
        value={filters.propertyType}
        onChange={(e) => setFilters({ propertyType: e.target.value as ClientFilters['propertyType'] })}
      >
        {propertyOptions.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <div className="flex items-center gap-1.5">
        <input
          type="number"
          placeholder="Min budget"
          className={`${selectClass} w-32`}
          value={filters.budgetMin}
          onChange={(e) => setFilters({ budgetMin: e.target.value === '' ? '' : Number(e.target.value) })}
        />
        <span className="text-slate-400 text-sm">–</span>
        <input
          type="number"
          placeholder="Max budget"
          className={`${selectClass} w-32`}
          value={filters.budgetMax}
          onChange={(e) => setFilters({ budgetMax: e.target.value === '' ? '' : Number(e.target.value) })}
        />
      </div>

      {(filters.status !== 'all' || filters.propertyType !== 'all' || filters.budgetMin !== '' || filters.budgetMax !== '') && (
        <button
          className="text-xs text-indigo-600 hover:underline cursor-pointer"
          onClick={() => setFilters({ status: 'all', propertyType: 'all', budgetMin: '', budgetMax: '' })}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

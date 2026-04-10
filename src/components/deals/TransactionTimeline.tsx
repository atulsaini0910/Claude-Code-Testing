import { CheckCircle2, Clock, AlertCircle, Printer } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { TransactionDates } from '../../types';

interface Milestone {
  key: keyof TransactionDates;
  label: string;
  description: string;
}

const MILESTONES: Milestone[] = [
  { key: 'inspectionDeadline',   label: 'Inspection Deadline',     description: 'Final date for property inspection' },
  { key: 'financingContingency', label: 'Financing Contingency',   description: 'Mortgage approval deadline' },
  { key: 'appraisalDeadline',    label: 'Appraisal Deadline',      description: 'Appraisal report must be received' },
  { key: 'titleClearance',       label: 'Title Clearance',         description: 'Title search & insurance deadline' },
  { key: 'closingDate',          label: 'Closing Date',            description: 'Final transfer of ownership' },
];

interface TransactionTimelineProps {
  dates: TransactionDates;
  onChange: (key: keyof TransactionDates, value: string | undefined) => void;
}

function milestoneStatus(dateStr: string | undefined): 'none' | 'upcoming' | 'due_soon' | 'overdue' | 'done' {
  if (!dateStr) return 'none';
  const d = new Date(dateStr).getTime();
  const now = Date.now();
  const diff = d - now;
  if (diff < 0) return 'overdue';
  if (diff < 3 * 86400000) return 'due_soon';
  return 'upcoming';
}

function daysUntil(dateStr: string): string {
  const diff = new Date(dateStr).getTime() - Date.now();
  const days = Math.ceil(diff / 86400000);
  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return 'Today';
  return `in ${days}d`;
}

export function TransactionTimeline({ dates, onChange }: TransactionTimelineProps) {
  const completedCount = MILESTONES.filter(m => dates[m.key] && milestoneStatus(dates[m.key]) !== 'overdue').length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="print:p-8">
      <div className="flex items-center justify-between mb-4 print:hidden">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Transaction Timeline</h3>
          <p className="text-xs text-slate-400 mt-0.5">{completedCount} of {MILESTONES.length} milestones set</p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
        >
          <Printer size={12} /> Print
        </button>
      </div>

      <div className="space-y-3">
        {MILESTONES.map((m, i) => {
          const dateVal = dates[m.key];
          const status = milestoneStatus(dateVal);

          return (
            <div key={m.key} className="flex items-start gap-3">
              {/* Status icon + connector */}
              <div className="flex flex-col items-center shrink-0">
                <div className={cn('w-6 h-6 rounded-full flex items-center justify-center',
                  status === 'overdue'  ? 'bg-red-100' :
                  status === 'due_soon' ? 'bg-amber-100' :
                  status === 'upcoming' ? 'bg-emerald-100' :
                  'bg-slate-100'
                )}>
                  {status === 'overdue'  && <AlertCircle size={12} className="text-red-500" />}
                  {status === 'due_soon' && <Clock size={12} className="text-amber-500" />}
                  {status === 'upcoming' && <CheckCircle2 size={12} className="text-emerald-500" />}
                  {status === 'none'     && <span className="text-[10px] font-bold text-slate-400">{i + 1}</span>}
                </div>
                {i < MILESTONES.length - 1 && (
                  <div className={cn('w-px flex-1 mt-1 min-h-[20px]',
                    status !== 'none' ? 'bg-emerald-200' : 'bg-slate-200'
                  )} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div>
                    <p className={cn('text-xs font-semibold',
                      status === 'overdue'  ? 'text-red-600' :
                      status === 'due_soon' ? 'text-amber-700' :
                      'text-slate-800'
                    )}>{m.label}</p>
                    <p className="text-[10px] text-slate-400">{m.description}</p>
                  </div>
                  {dateVal && (
                    <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0',
                      status === 'overdue'  ? 'bg-red-100 text-red-600' :
                      status === 'due_soon' ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    )}>
                      {daysUntil(dateVal)}
                    </span>
                  )}
                </div>
                <input
                  type="date"
                  className={cn(
                    'mt-1.5 text-xs border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors',
                    status === 'overdue'  ? 'border-red-200 bg-red-50' :
                    status === 'due_soon' ? 'border-amber-200 bg-amber-50' :
                    status === 'upcoming' ? 'border-emerald-200 bg-emerald-50' :
                    'border-slate-200 bg-white'
                  )}
                  value={dateVal ? dateVal.slice(0, 10) : ''}
                  onChange={e => onChange(m.key, e.target.value || undefined)}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Print-only header */}
      <div className="hidden print:block mb-6">
        <h1 className="text-xl font-bold">Transaction Timeline</h1>
        <p className="text-sm text-gray-500">Generated {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
}

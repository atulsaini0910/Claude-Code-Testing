import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, CheckCircle2, AlertTriangle, ArrowRight, Download, X } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useSidebar } from '../components/layout/AppShell';
import { useClients } from '../hooks/useClients';
import { parseCsvText, autoMapColumns } from '../lib/csvImport';
import type { Client, ClientStatus, PropertyType, ClientType, LeadTemperature } from '../types';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

type Step = 'upload' | 'map' | 'preview' | 'done';

const IMPORTABLE_FIELDS = [
  { key: 'name', label: 'Full Name', required: true },
  { key: 'email', label: 'Email', required: false },
  { key: 'phone', label: 'Phone', required: false },
  { key: 'notes', label: 'Notes', required: false },
  { key: 'budgetMin', label: 'Budget Min', required: false },
  { key: 'budgetMax', label: 'Budget Max', required: false },
  { key: 'locationPreference', label: 'Location', required: false },
  { key: 'source', label: 'Lead Source', required: false },
  { key: 'skip', label: '— Skip this column —', required: false },
];

export function ImportPage() {
  const { openSidebar, openCommandPalette } = useSidebar();
  const { addClient } = useClients();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('upload');
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [columnMap, setColumnMap] = useState<Record<string, string>>({});
  const [importedCount, setImportedCount] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);

  const handleFileUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const { headers: h, rows: r } = parseCsvText(text);
      if (h.length === 0) {
        toast.error('File appears empty or invalid');
        return;
      }
      setHeaders(h);
      setRows(r);
      setColumnMap(autoMapColumns(h));
      setStep('map');
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.name.endsWith('.csv')) handleFileUpload(file);
    else toast.error('Please upload a CSV file');
  };

  const buildPreview = () => {
    return rows.slice(0, 5).map(row => {
      const obj: Record<string, string> = {};
      headers.forEach(h => {
        const field = columnMap[h];
        if (field && field !== 'skip') obj[field] = row[h] ?? '';
      });
      return obj;
    });
  };

  const doImport = () => {
    const errs: string[] = [];
    let count = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const data: Record<string, string> = {};
      headers.forEach(h => {
        const field = columnMap[h];
        if (field && field !== 'skip') data[field] = row[h] ?? '';
      });

      if (!data.name?.trim()) {
        errs.push(`Row ${i + 2}: missing name — skipped`);
        continue;
      }

      const client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'> = {
        name: data.name.trim(),
        email: data.email?.trim() ?? '',
        phone: data.phone?.trim() ?? '',
        notes: data.notes?.trim() ?? '',
        budget: {
          min: Number(data.budgetMin) || 0,
          max: Number(data.budgetMax) || 0,
        },
        locationPreference: data.locationPreference?.trim() ?? '',
        source: data.source?.trim() ?? '',
        status: 'active' as ClientStatus,
        propertyType: 'residential' as PropertyType,
        clientType: 'buyer' as ClientType,
        leadTemperature: 'warm' as LeadTemperature,
        preApproved: false,
        tags: [],
        score: 50,
        customFields: {},
      };

      addClient(client);
      count++;
    }

    setImportedCount(count);
    setErrors(errs);
    setStep('done');

    if (count > 0) toast.success(`Imported ${count} clients`);
    if (errs.length > 0) toast.error(`${errs.length} rows had errors`);
  };

  const reset = () => {
    setStep('upload');
    setHeaders([]);
    setRows([]);
    setColumnMap({});
    setImportedCount(0);
    setErrors([]);
  };

  const downloadTemplate = () => {
    const csv = 'Name,Email,Phone,Budget Min,Budget Max,Location,Notes,Source\nJane Smith,jane@email.com,(555) 000-0000,300000,500000,"Austin, TX","First-time buyer",referral\n';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'import-template.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Import Clients" onMenuClick={openSidebar} onSearchClick={openCommandPalette} />

      <div className="flex-1 p-4 md:p-6 max-w-3xl space-y-5 overflow-y-auto">
        {/* Progress steps */}
        <div className="flex items-center gap-2">
          {(['upload', 'map', 'preview', 'done'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={cn(
                'w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center',
                step === s ? 'bg-indigo-600 text-white' :
                ['upload', 'map', 'preview', 'done'].indexOf(step) > i ? 'bg-emerald-500 text-white' :
                'bg-slate-100 text-slate-400'
              )}>
                {['upload', 'map', 'preview', 'done'].indexOf(step) > i ? <CheckCircle2 size={14} /> : i + 1}
              </div>
              <span className={cn('text-xs capitalize font-medium', step === s ? 'text-slate-800' : 'text-slate-400')}>
                {s === 'upload' ? 'Upload' : s === 'map' ? 'Map Fields' : s === 'preview' ? 'Preview' : 'Done'}
              </span>
              {i < 3 && <ArrowRight size={12} className="text-slate-300" />}
            </div>
          ))}
        </div>

        {/* STEP 1: Upload */}
        {step === 'upload' && (
          <div className="space-y-4">
            <Card className="p-5">
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-slate-200 rounded-xl p-10 text-center hover:border-indigo-400 hover:bg-indigo-50/30 transition-all"
              >
                <Upload size={32} className="mx-auto text-slate-300 mb-3" />
                <p className="text-sm font-medium text-slate-700 mb-1">Drag & drop your CSV here</p>
                <p className="text-xs text-slate-400 mb-4">or click to browse</p>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }}
                  />
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                    <FileText size={14} /> Choose File
                  </span>
                </label>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">Need a template?</p>
                  <p className="text-xs text-slate-400">Download our CSV template with the correct column headers</p>
                </div>
                <Button variant="secondary" size="sm" onClick={downloadTemplate}>
                  <Download size={13} /> Download Template
                </Button>
              </div>
            </Card>

            <Card className="p-4 bg-blue-50 border-blue-100">
              <p className="text-xs font-semibold text-blue-700 mb-1">Supported formats</p>
              <p className="text-xs text-blue-600">Salesforce export, Zoho CRM export, HubSpot contacts, custom CSV. Required: a "Name" or "Full Name" column.</p>
            </Card>
          </div>
        )}

        {/* STEP 2: Map columns */}
        {step === 'map' && (
          <div className="space-y-4">
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-slate-800 mb-1">Map Your Columns</h3>
              <p className="text-xs text-slate-400 mb-4">
                We auto-detected {Object.values(columnMap).filter(v => v && v !== 'skip').length} of {headers.length} columns. Adjust as needed.
              </p>
              <div className="space-y-2">
                {headers.map(h => (
                  <div key={h} className="flex items-center gap-3">
                    <div className="flex-1 text-sm text-slate-700 bg-slate-50 rounded-lg px-3 py-2 min-w-0 truncate">
                      {h}
                    </div>
                    <ArrowRight size={14} className="text-slate-300 shrink-0" />
                    <select
                      value={columnMap[h] ?? 'skip'}
                      onChange={e => setColumnMap(p => ({ ...p, [h]: e.target.value }))}
                      className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                      {IMPORTABLE_FIELDS.map(f => (
                        <option key={f.key} value={f.key}>{f.label}{f.required ? ' *' : ''}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </Card>
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={reset}>Back</Button>
              <Button onClick={() => setStep('preview')}>Preview Import</Button>
            </div>
          </div>
        )}

        {/* STEP 3: Preview */}
        {step === 'preview' && (
          <div className="space-y-4">
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-slate-800 mb-1">Preview (first 5 rows)</h3>
              <p className="text-xs text-slate-400 mb-4">{rows.length} total clients will be imported.</p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {Object.values(columnMap).filter((v, i, arr) => v !== 'skip' && arr.indexOf(v) === i).map(f => (
                        <th key={f} className="text-left font-semibold text-slate-500 pb-2 pr-4 uppercase tracking-wide">{f}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {buildPreview().map((row, i) => (
                      <tr key={i} className="border-b border-slate-50 last:border-0">
                        {Object.values(columnMap).filter((v, i, arr) => v !== 'skip' && arr.indexOf(v) === i).map(f => (
                          <td key={f} className="py-2 pr-4 text-slate-700 max-w-32 truncate">{row[f] || '—'}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setStep('map')}>Back</Button>
              <Button onClick={doImport}>Import {rows.length} Clients</Button>
            </div>
          </div>
        )}

        {/* STEP 4: Done */}
        {step === 'done' && (
          <Card className="p-8 text-center">
            <CheckCircle2 size={48} className="mx-auto text-emerald-500 mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-1">{importedCount} clients imported!</h3>
            <p className="text-sm text-slate-400 mb-6">They're now in your Clients page.</p>

            {errors.length > 0 && (
              <div className="mb-4 text-left bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <AlertTriangle size={13} className="text-amber-500" />
                  <p className="text-xs font-semibold text-amber-700">{errors.length} rows skipped:</p>
                </div>
                {errors.slice(0, 5).map((e, i) => (
                  <p key={i} className="text-xs text-amber-600">{e}</p>
                ))}
                {errors.length > 5 && <p className="text-xs text-amber-400">...and {errors.length - 5} more</p>}
              </div>
            )}

            <div className="flex gap-2 justify-center">
              <Button variant="secondary" onClick={reset}>
                <X size={14} /> Import Another File
              </Button>
              <Button onClick={() => navigate('/clients')}>
                View Clients →
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

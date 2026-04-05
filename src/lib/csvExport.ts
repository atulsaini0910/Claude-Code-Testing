import type { Client, Deal } from '../types';

function escapeCsv(val: unknown): string {
  const s = String(val ?? '');
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function downloadCsv(filename: string, rows: string[][]): void {
  const csv = rows.map(r => r.map(escapeCsv).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportClientsCSV(clients: Client[]): void {
  const headers = [
    'Name', 'Email', 'Phone', 'Status', 'Client Type', 'Lead Temperature',
    'Pre-Approved', 'Pre-Approval Amount', 'Budget Min', 'Budget Max',
    'Property Type', 'Location Preference', 'Source', 'Lead Score', 'Tags', 'Notes',
    'Created At', 'Updated At',
  ];
  const rows = clients.map(c => [
    c.name, c.email, c.phone, c.status, c.clientType, c.leadTemperature,
    c.preApproved ? 'Yes' : 'No', String(c.preApprovalAmount ?? ''),
    String(c.budget.min), String(c.budget.max),
    c.propertyType, c.locationPreference, c.source ?? '', String(c.score),
    (c.tags ?? []).join('; '), c.notes,
    c.createdAt.slice(0, 10), c.updatedAt.slice(0, 10),
  ]);
  downloadCsv(`clients-export-${new Date().toISOString().slice(0, 10)}.csv`, [headers, ...rows]);
}

export function exportDealsCSV(deals: Deal[]): void {
  const headers = [
    'Title', 'Type', 'Stage', 'Value', 'Commission %', 'Commission $',
    'Close Date', 'Loss Reason', 'Tags', 'Notes', 'Created At',
  ];
  const rows = deals.map(d => [
    d.title, d.type, d.stage, String(d.value ?? ''), String(d.commissionPct ?? ''),
    d.value && d.commissionPct ? ((d.value * d.commissionPct) / 100).toFixed(0) : '',
    d.closeDate ? d.closeDate.slice(0, 10) : '',
    d.lossReason ?? '', (d.tags ?? []).join('; '), d.notes,
    d.createdAt.slice(0, 10),
  ]);
  downloadCsv(`deals-export-${new Date().toISOString().slice(0, 10)}.csv`, [headers, ...rows]);
}

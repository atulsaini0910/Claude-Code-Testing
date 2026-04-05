export interface ParsedRow {
  [key: string]: string;
}

export function parseCsvText(text: string): { headers: string[]; rows: ParsedRow[] } {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length === 0) return { headers: [], rows: [] };

  const headers = parseCsvLine(lines[0]);
  const rows: ParsedRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = parseCsvLine(lines[i]);
    const row: ParsedRow = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] ?? '';
    });
    rows.push(row);
  }

  return { headers, rows };
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

// Known column name aliases for smart mapping
export const FIELD_ALIASES: Record<string, string> = {
  // name
  'full name': 'name', 'fullname': 'name', 'contact name': 'name', 'client name': 'name',
  'first name': 'name', 'firstname': 'name',
  // email
  'email address': 'email', 'e-mail': 'email',
  // phone
  'phone number': 'phone', 'mobile': 'phone', 'cell': 'phone', 'telephone': 'phone',
  // status
  'client status': 'status', 'lead status': 'status',
  // budget
  'budget min': 'budgetMin', 'min budget': 'budgetMin', 'minimum budget': 'budgetMin',
  'budget max': 'budgetMax', 'max budget': 'budgetMax', 'maximum budget': 'budgetMax',
  // location
  'location': 'locationPreference', 'preferred location': 'locationPreference', 'area': 'locationPreference',
  // notes
  'note': 'notes', 'comments': 'notes', 'description': 'notes',
};

export function autoMapColumns(headers: string[]): Record<string, string> {
  const map: Record<string, string> = {};
  const knownFields = ['name', 'email', 'phone', 'status', 'notes', 'budgetMin', 'budgetMax', 'locationPreference', 'source'];

  for (const h of headers) {
    const lower = h.toLowerCase().trim();
    if (knownFields.includes(lower)) {
      map[h] = lower;
    } else if (FIELD_ALIASES[lower]) {
      map[h] = FIELD_ALIASES[lower];
    }
  }
  return map;
}

export type PropertyType = 'residential' | 'commercial' | 'land' | 'multi-family' | 'any';
export type ClientStatus = 'active' | 'inactive' | 'closed';
export type ActivityType = 'note' | 'call' | 'meeting' | 'email';

export interface BudgetRange {
  min: number;
  max: number;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  budget: BudgetRange;
  propertyType: PropertyType;
  locationPreference: string;
  status: ClientStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityEntry {
  id: string;
  clientId: string;
  type: ActivityType;
  title: string;
  body: string;
  createdAt: string;
}

export interface ClientFilters {
  status: ClientStatus | 'all';
  propertyType: PropertyType | 'all';
  budgetMin: number | '';
  budgetMax: number | '';
}

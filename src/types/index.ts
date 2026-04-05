// ─── Primitive enums ──────────────────────────────────────────────────────────

export type PropertyType = 'residential' | 'commercial' | 'land' | 'multi-family' | 'any';
export type ClientStatus = 'active' | 'inactive' | 'closed' | 'lost' | 'nurture';
export type ActivityType = 'note' | 'call' | 'meeting' | 'email' | 'sms';
export type DealStage = 'inquiry' | 'showing' | 'offer' | 'under_contract' | 'closed_won' | 'closed_lost';
export type DealType = 'purchase' | 'sale' | 'lease' | 'referral';
export type PropertyStatus = 'available' | 'under_contract' | 'sold' | 'off_market' | 'coming_soon';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'open' | 'completed' | 'cancelled';
export type LeadTemperature = 'hot' | 'warm' | 'cold';
export type ClientType = 'buyer' | 'seller' | 'investor' | 'both' | 'tenant' | 'landlord';
export type UserRole = 'admin' | 'manager' | 'agent' | 'readonly';
export type DataDensity = 'compact' | 'comfortable' | 'spacious';

// ─── Core entities ────────────────────────────────────────────────────────────

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
  // New enterprise fields
  clientType: ClientType;
  leadTemperature: LeadTemperature;
  source?: string;
  preApproved: boolean;
  preApprovalAmount?: number;
  tags: string[];
  score: number;
  assignedTo?: string;
  customFields: Record<string, unknown>;
  // Follow-up tracking
  lastContactedAt?: string;
  nextActionDate?: string;
}

export interface ActivityEntry {
  id: string;
  clientId: string;
  type: ActivityType;
  title: string;
  body: string;
  createdAt: string;
  dealId?: string;
  propertyId?: string;
  durationMin?: number;
}

export interface TransactionDates {
  inspectionDeadline?: string;
  financingContingency?: string;
  appraisalDeadline?: string;
  titleClearance?: string;
  closingDate?: string;
}

export interface Deal {
  id: string;
  clientId: string;
  propertyId?: string;
  title: string;
  type: DealType;
  stage: DealStage;
  value?: number;
  commissionPct?: number;
  closeDate?: string;
  lossReason?: string;
  notes: string;
  stageHistory?: { stage: DealStage; enteredAt: string }[];
  transactionDates?: TransactionDates;
  assignedTo?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Property {
  id: string;
  addressLine1: string;
  city: string;
  state: string;
  zip: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  listPrice?: number;
  soldPrice?: number;
  beds?: number;
  baths?: number;
  sqft?: number;
  mlsId?: string;
  description: string;
  features: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  completedAt?: string;
  clientId?: string;
  dealId?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
}

export interface SavedView {
  id: string;
  name: string;
  entity: 'clients' | 'deals' | 'properties' | 'tasks';
  filters: Record<string, unknown>;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  isShared: boolean;
  createdBy: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'task_due' | 'deal_assigned' | 'client_assigned' | 'stage_change' | 'info';
  title: string;
  body?: string;
  entityType?: 'client' | 'deal' | 'task' | 'property';
  entityId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Showing {
  id: string;
  dealId: string;
  clientId: string;
  propertyId?: string;
  scheduledAt: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  feedback?: 'loved' | 'liked' | 'neutral' | 'not_interested';
  agentNotes: string;
  createdAt: string;
}

export interface UserGoals {
  userId: string;
  month: string; // YYYY-MM
  closingsGoal: number;
  revenueGoal: number;
  activitiesGoal: number;
}

export interface AppSettings {
  theme: 'light' | 'dark';
}

export interface MarketData {
  id: string;
  area: string;
  month: string; // YYYY-MM
  medianPrice: number;
  daysOnMarket: number;
  listToSaleRatio: number; // e.g. 0.97 = 97%
  inventory: number;
  createdAt: string;
}

export interface Suggestion {
  id: string;
  title: string;
  body: string;
  urgency: 'high' | 'medium' | 'low';
  entityType: 'client' | 'deal' | 'showing' | 'task';
  entityId: string;
  actionType: 'navigate' | 'call' | 'log_activity';
}

// ─── Filter shapes ─────────────────────────────────────────────────────────────

export interface ClientFilters {
  status: ClientStatus | 'all';
  propertyType: PropertyType | 'all';
  budgetMin: number | '';
  budgetMax: number | '';
  leadTemperature: LeadTemperature | 'all';
  clientType: ClientType | 'all';
  assignedTo: string | 'all';
}

export interface DealFilters {
  stage: DealStage | 'all';
  type: DealType | 'all';
  assignedTo: string | 'all';
}

export interface PropertyFilters {
  status: PropertyStatus | 'all';
  propertyType: PropertyType | 'all';
  minPrice: number | '';
  maxPrice: number | '';
}

export interface TaskFilters {
  status: TaskStatus | 'all';
  priority: TaskPriority | 'all';
  assignedTo: string | 'all';
}

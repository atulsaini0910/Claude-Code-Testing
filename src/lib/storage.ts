import type {
  Client, ActivityEntry, Deal, Property, Task, User, SavedView, Notification, Showing, UserGoals, AppSettings, MarketData,
} from '../types';

// ─── Storage keys ─────────────────────────────────────────────────────────────

const KEYS = {
  clients:      'rt_clients',
  activity:     'rt_activity',
  deals:        'rt_deals',
  properties:   'rt_properties',
  tasks:        'rt_tasks',
  users:        'rt_users',
  savedViews:   'rt_saved_views',
  notifications:'rt_notifications',
  currentUser:  'rt_current_user',
  showings:     'rt_showings',
  userGoals:    'rt_user_goals',
  settings:     'rt_settings',
  marketData:   'rt_market_data',
} as const;

// ─── Generic helpers ──────────────────────────────────────────────────────────

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// ─── Typed accessors ──────────────────────────────────────────────────────────

export const db = {
  clients:       { get: () => read<Client[]>(KEYS.clients, []),             set: (v: Client[]) => write(KEYS.clients, v) },
  activity:      { get: () => read<ActivityEntry[]>(KEYS.activity, []),     set: (v: ActivityEntry[]) => write(KEYS.activity, v) },
  deals:         { get: () => read<Deal[]>(KEYS.deals, []),                 set: (v: Deal[]) => write(KEYS.deals, v) },
  properties:    { get: () => read<Property[]>(KEYS.properties, []),        set: (v: Property[]) => write(KEYS.properties, v) },
  tasks:         { get: () => read<Task[]>(KEYS.tasks, []),                 set: (v: Task[]) => write(KEYS.tasks, v) },
  users:         { get: () => read<User[]>(KEYS.users, []),                 set: (v: User[]) => write(KEYS.users, v) },
  savedViews:    { get: () => read<SavedView[]>(KEYS.savedViews, []),       set: (v: SavedView[]) => write(KEYS.savedViews, v) },
  notifications: { get: () => read<Notification[]>(KEYS.notifications, []),set: (v: Notification[]) => write(KEYS.notifications, v) },
  currentUser:   { get: () => read<User | null>(KEYS.currentUser, null),    set: (v: User | null) => write(KEYS.currentUser, v) },
  showings:      { get: () => read<Showing[]>(KEYS.showings, []),            set: (v: Showing[]) => write(KEYS.showings, v) },
  userGoals:     { get: () => read<UserGoals[]>(KEYS.userGoals, []),         set: (v: UserGoals[]) => write(KEYS.userGoals, v) },
  settings:      { get: () => read<AppSettings>(KEYS.settings, { theme: 'light', density: 'comfortable', notifications: { taskDue: true, stageChanges: true, clientAssigned: true, dailyDigest: false, followUpOverdue: true } }), set: (v: AppSettings) => write(KEYS.settings, v) },
  marketData:    { get: () => read<MarketData[]>(KEYS.marketData, []),              set: (v: MarketData[]) => write(KEYS.marketData, v) },
};

// Keep legacy keys working during transition
export function getClients(): Client[] { return db.clients.get(); }
export function saveClients(v: Client[]): void { db.clients.set(v); }
export function getActivity(): ActivityEntry[] { return db.activity.get(); }
export function saveActivity(v: ActivityEntry[]): void { db.activity.set(v); }

// ─── Seed data ────────────────────────────────────────────────────────────────

export function initSeedData(): void {
  if (localStorage.getItem(KEYS.clients) !== null) return;

  const now = new Date();
  const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();

  // Seed users / team
  const users: User[] = [
    { id: 'u1', name: 'Alex Rivera', email: 'alex@realtrack.app', role: 'admin', isActive: true, phone: '(512) 555-0100', createdAt: daysAgo(90) },
    { id: 'u2', name: 'Jordan Kim',  email: 'jordan@realtrack.app', role: 'manager', isActive: true, phone: '(512) 555-0101', createdAt: daysAgo(60) },
    { id: 'u3', name: 'Casey Patel', email: 'casey@realtrack.app', role: 'agent', isActive: true, phone: '(512) 555-0102', createdAt: daysAgo(45) },
  ];

  const clients: Client[] = [
    {
      id: 'c1', name: 'Sarah Mitchell', phone: '(512) 555-0191', email: 'sarah.mitchell@email.com',
      budget: { min: 450000, max: 650000 }, propertyType: 'residential',
      locationPreference: 'Downtown Austin, TX', status: 'active',
      notes: 'Prefers 3–4BR with large backyard (has 2 dogs). Must-have: home office. Loves the Clarksville/Travis Heights area. Has toured 4 properties, loved 12 Oak Lane.',
      clientType: 'buyer', leadTemperature: 'hot', source: 'referral', preApproved: true, preApprovalAmount: 600000,
      tags: ['VIP', 'pre-approved'], score: 85, assignedTo: 'u1',
      customFields: {}, createdAt: daysAgo(30), updatedAt: daysAgo(2),
    },
    {
      id: 'c2', name: 'James Thornton', phone: '(737) 555-0284', email: 'james.thornton@bizmail.com',
      budget: { min: 1200000, max: 2500000 }, propertyType: 'commercial',
      locationPreference: 'North Austin Business District', status: 'active',
      notes: '5k–10k sqft Class A office space. Needs 50+ parking spots for employees. Expanding tech company, 200 staff. Rejected 800 Commerce due to parking constraints.',
      clientType: 'investor', leadTemperature: 'warm', source: 'website', preApproved: false,
      tags: ['commercial', 'investor', 'tech'], score: 72, assignedTo: 'u2',
      customFields: {}, createdAt: daysAgo(20), updatedAt: daysAgo(1),
    },
    {
      id: 'c3', name: 'Maria Gonzalez', phone: '(210) 555-0347', email: 'mariag@homesearch.net',
      budget: { min: 200000, max: 320000 }, propertyType: 'residential',
      locationPreference: 'San Antonio Suburbs', status: 'nurture',
      notes: 'First-time buyer, nursing student. Still saving for down payment. Parents will co-sign. Looking for 2–3BR in Alamo Heights or Stone Oak. Follow up in Q2.',
      clientType: 'buyer', leadTemperature: 'cold', source: 'open_house', preApproved: false,
      tags: ['first-time', 'nurture'], score: 35, assignedTo: 'u3',
      customFields: {}, createdAt: daysAgo(60), updatedAt: daysAgo(14),
    },
    {
      id: 'c4', name: 'Derek Okafor', phone: '(469) 555-0512', email: 'derek.okafor@invest.io',
      budget: { min: 800000, max: 1500000 }, propertyType: 'multi-family',
      locationPreference: 'Dallas Metro Area', status: 'active',
      notes: 'Experienced investor, owns 3 duplexes in Dallas. Looking for 8–20 unit complexes, minimum 6% cap rate, positive cash flow only. Financing pre-arranged through private lender.',
      clientType: 'investor', leadTemperature: 'hot', source: 'referral', preApproved: true, preApprovalAmount: 1400000,
      tags: ['investor', 'multi-family', 'pre-approved'], score: 90, assignedTo: 'u1',
      customFields: {}, createdAt: daysAgo(10), updatedAt: daysAgo(3),
    },
    {
      id: 'c5', name: 'Linda Hargreaves', phone: '(281) 555-0673', email: 'linda.h@remail.com',
      budget: { min: 550000, max: 750000 }, propertyType: 'residential',
      locationPreference: 'Houston Heights', status: 'closed',
      notes: 'Purchased 4BR at 200 Westcott St. Smooth closing. Left a 5-star Google review. Asked about rental investment properties — potential future client.',
      clientType: 'buyer', leadTemperature: 'cold', source: 'zillow', preApproved: true, preApprovalAmount: 700000,
      tags: ['closed-won', 'referral-potential'], score: 100, assignedTo: 'u2',
      customFields: {}, createdAt: daysAgo(90), updatedAt: daysAgo(5),
    },
    {
      id: 'c6', name: 'Tom Yuen', phone: '(512) 555-0788', email: 'tom.yuen@landbuyer.com',
      budget: { min: 100000, max: 400000 }, propertyType: 'land',
      locationPreference: 'Hill Country, TX', status: 'active',
      notes: '10–50 acres of raw Hill Country land for future development. Prefers creek or river access. Long-term hold, not in a rush to develop.',
      clientType: 'investor', leadTemperature: 'warm', source: 'website', preApproved: false,
      tags: ['land', 'investor'], score: 60, assignedTo: 'u3',
      customFields: {}, createdAt: daysAgo(15), updatedAt: daysAgo(7),
    },
    {
      id: 'c7', name: 'Priya Sharma', phone: '(512) 555-0900', email: 'priya.s@email.com',
      budget: { min: 350000, max: 500000 }, propertyType: 'residential',
      locationPreference: 'South Austin, TX', status: 'active',
      notes: 'Senior engineer at Dell, fully remote. Needs dedicated home office (separate room, not a nook). Prefers walkable neighborhood with good coffee shops. 45 Elm St is a strong match.',
      clientType: 'buyer', leadTemperature: 'hot', source: 'referral', preApproved: true, preApprovalAmount: 480000,
      tags: ['VIP', 'pre-approved'], score: 88, assignedTo: 'u1',
      customFields: {}, createdAt: daysAgo(5), updatedAt: daysAgo(1),
    },
    {
      id: 'c8', name: 'Marcus Bell', phone: '(713) 555-0412', email: 'mbell@properties.com',
      budget: { min: 2000000, max: 5000000 }, propertyType: 'commercial',
      locationPreference: 'Houston Medical Center', status: 'active',
      notes: 'CEO of BellMed Group. Expanding to Houston, needs 20k+ sqft medical office/clinic. ADA compliance critical. Strong preference for Medical Center or Greenway Plaza submarket.',
      clientType: 'investor', leadTemperature: 'warm', source: 'cold_call', preApproved: false,
      tags: ['commercial', 'medical', 'VIP'], score: 65, assignedTo: 'u2',
      customFields: {}, createdAt: daysAgo(8), updatedAt: daysAgo(2),
    },
    {
      id: 'c9', name: 'Rachel Torres', phone: '(512) 555-1122', email: 'rachel.torres@gmail.com',
      budget: { min: 280000, max: 420000 }, propertyType: 'residential',
      locationPreference: 'Cedar Park, TX', status: 'active',
      notes: 'Relocating from Chicago for new job at Apple. Needs to be in new home by August 15. 3BR minimum, good school district (Leander ISD preferred). Has husband and 2 kids.',
      clientType: 'buyer', leadTemperature: 'hot', source: 'zillow', preApproved: true, preApprovalAmount: 400000,
      tags: ['relocation', 'pre-approved', 'time-sensitive'], score: 80, assignedTo: 'u1',
      customFields: {}, createdAt: daysAgo(4), updatedAt: daysAgo(1),
    },
    {
      id: 'c10', name: 'Brian Westfield', phone: '(214) 555-2233', email: 'b.westfield@texasrealty.com',
      budget: { min: 600000, max: 900000 }, propertyType: 'residential',
      locationPreference: 'Plano, TX', status: 'active',
      notes: 'Upgrading from current 3BR in Richardson. Wife wants home theater and pool. Budget is firm. Pre-approval from Wells Fargo, 20% down.',
      clientType: 'buyer', leadTemperature: 'warm', source: 'referral', preApproved: true, preApprovalAmount: 850000,
      tags: ['upgrade', 'pre-approved'], score: 70, assignedTo: 'u2',
      customFields: {}, createdAt: daysAgo(12), updatedAt: daysAgo(4),
    },
    {
      id: 'c11', name: 'Angela Ruiz', phone: '(210) 555-3344', email: 'angela.ruiz@invest.com',
      budget: { min: 150000, max: 350000 }, propertyType: 'residential',
      locationPreference: 'San Antonio, TX', status: 'active',
      notes: 'Buy-and-hold investor. Wants turnkey single-family rentals with existing tenants. Requires rent > $1,500/mo. Currently owns 2 rental properties in SA.',
      clientType: 'investor', leadTemperature: 'warm', source: 'open_house', preApproved: false,
      tags: ['investor', 'rental'], score: 55, assignedTo: 'u3',
      customFields: {}, createdAt: daysAgo(18), updatedAt: daysAgo(6),
    },
    {
      id: 'c12', name: 'David Chen', phone: '(512) 555-4455', email: 'dchen@austintech.io',
      budget: { min: 900000, max: 1400000 }, propertyType: 'residential',
      locationPreference: 'Westlake Hills, TX', status: 'active',
      notes: 'CTO at fintech startup. All cash buyer (Series C recently closed). Wants luxury 4–5BR in Westlake. Wife wants pool and wine cellar. No mortgage contingency.',
      clientType: 'buyer', leadTemperature: 'hot', source: 'referral', preApproved: true, preApprovalAmount: 1400000,
      tags: ['cash-buyer', 'luxury', 'VIP'], score: 95, assignedTo: 'u1',
      customFields: {}, createdAt: daysAgo(2), updatedAt: daysAgo(0),
    },
  ];

  const properties: Property[] = [
    {
      id: 'p1', addressLine1: '12 Oak Lane', city: 'Austin', state: 'TX', zip: '78701',
      propertyType: 'residential', status: 'under_contract', listPrice: 595000, beds: 4, baths: 3, sqft: 2800,
      mlsId: 'MLS-2024-001', description: 'Beautiful 4BR home in downtown Austin with large backyard.',
      features: ['backyard', 'hardwood floors', 'updated kitchen', 'garage'], tags: [],
      assignedTo: 'u1', createdAt: daysAgo(20), updatedAt: daysAgo(2),
    },
    {
      id: 'p2', addressLine1: '800 Commerce Blvd', city: 'Austin', state: 'TX', zip: '78758',
      propertyType: 'commercial', status: 'available', listPrice: 1850000, sqft: 8500,
      mlsId: 'MLS-2024-002', description: 'Class A office space, open floor plan, 60 parking spaces.',
      features: ['60 parking', 'open floor plan', 'conference rooms', 'fiber internet'], tags: ['commercial'],
      assignedTo: 'u2', createdAt: daysAgo(15), updatedAt: daysAgo(3),
    },
    {
      id: 'p3', addressLine1: '45 Elm Street', city: 'Austin', state: 'TX', zip: '78704',
      propertyType: 'residential', status: 'available', listPrice: 475000, beds: 3, baths: 2, sqft: 1950,
      mlsId: 'MLS-2024-003', description: 'Charming 3BR in South Austin, walkable neighborhood.',
      features: ['patio', 'updated bathrooms', 'walking distance to restaurants'], tags: [],
      assignedTo: 'u3', createdAt: daysAgo(12), updatedAt: daysAgo(5),
    },
    {
      id: 'p4', addressLine1: '200 Westcott Street', city: 'Houston', state: 'TX', zip: '77007',
      propertyType: 'residential', status: 'sold', listPrice: 640000, soldPrice: 635000, beds: 4, baths: 3.5, sqft: 3100,
      mlsId: 'MLS-2023-089', description: 'Houston Heights 4BR, sold to Linda Hargreaves.',
      features: ['pool', 'large kitchen', 'home office'], tags: ['sold'],
      assignedTo: 'u2', createdAt: daysAgo(80), updatedAt: daysAgo(5),
    },
    {
      id: 'p5', addressLine1: '1450 Ridgeline Road', city: 'Marble Falls', state: 'TX', zip: '78654',
      propertyType: 'land', status: 'available', listPrice: 280000, sqft: 1089000,
      mlsId: 'MLS-2024-004', description: '25 acres of raw Hill Country land with creek access.',
      features: ['creek access', 'utilities available', 'ag exempt', 'hilltop views'], tags: ['land'],
      assignedTo: 'u3', createdAt: daysAgo(10), updatedAt: daysAgo(7),
    },
  ];

  const deals: Deal[] = [
    {
      id: 'd1', clientId: 'c1', propertyId: 'p1', title: 'Sarah Mitchell — 12 Oak Lane',
      type: 'purchase', stage: 'offer', value: 595000, commissionPct: 3,
      closeDate: new Date(now.getTime() + 30 * 86400000).toISOString(),
      notes: 'Offer submitted. Waiting for counter.', assignedTo: 'u1', tags: ['hot'],
      stageHistory: [
        { stage: 'inquiry', enteredAt: daysAgo(10) },
        { stage: 'showing', enteredAt: daysAgo(7) },
        { stage: 'offer', enteredAt: daysAgo(2) },
      ],
      createdAt: daysAgo(10), updatedAt: daysAgo(2),
    },
    {
      id: 'd2', clientId: 'c2', propertyId: 'p2', title: 'James Thornton — 800 Commerce Blvd',
      type: 'purchase', stage: 'showing', value: 1850000, commissionPct: 2.5,
      closeDate: new Date(now.getTime() + 60 * 86400000).toISOString(),
      notes: 'Site visit done. Parking concern needs resolution.', assignedTo: 'u2', tags: [],
      stageHistory: [
        { stage: 'inquiry', enteredAt: daysAgo(8) },
        { stage: 'showing', enteredAt: daysAgo(1) },
      ],
      createdAt: daysAgo(8), updatedAt: daysAgo(1),
    },
    {
      id: 'd3', clientId: 'c4', propertyId: undefined, title: 'Derek Okafor — Dallas Multi-Family',
      type: 'purchase', stage: 'inquiry', value: 1200000, commissionPct: 2.5,
      closeDate: new Date(now.getTime() + 90 * 86400000).toISOString(),
      notes: 'Pulling MLS data for qualifying properties.', assignedTo: 'u1', tags: ['investor'],
      stageHistory: [{ stage: 'inquiry', enteredAt: daysAgo(5) }],
      createdAt: daysAgo(5), updatedAt: daysAgo(3),
    },
    {
      id: 'd4', clientId: 'c5', propertyId: 'p4', title: 'Linda Hargreaves — Houston Heights (CLOSED)',
      type: 'purchase', stage: 'closed_won', value: 635000, commissionPct: 3,
      closeDate: daysAgo(5),
      notes: 'Deal closed. Keys handed over.', assignedTo: 'u2', tags: [],
      stageHistory: [
        { stage: 'inquiry', enteredAt: daysAgo(80) },
        { stage: 'showing', enteredAt: daysAgo(60) },
        { stage: 'offer', enteredAt: daysAgo(30) },
        { stage: 'under_contract', enteredAt: daysAgo(20) },
        { stage: 'closed_won', enteredAt: daysAgo(5) },
      ],
      createdAt: daysAgo(80), updatedAt: daysAgo(5),
    },
    {
      id: 'd5', clientId: 'c7', propertyId: 'p3', title: 'Priya Sharma — 45 Elm Street',
      type: 'purchase', stage: 'showing', value: 475000, commissionPct: 3,
      closeDate: new Date(now.getTime() + 45 * 86400000).toISOString(),
      notes: 'Scheduled second showing for this weekend.', assignedTo: 'u1', tags: ['VIP'],
      stageHistory: [
        { stage: 'inquiry', enteredAt: daysAgo(3) },
        { stage: 'showing', enteredAt: daysAgo(1) },
      ],
      createdAt: daysAgo(3), updatedAt: daysAgo(1),
    },
    {
      id: 'd6', clientId: 'c6', propertyId: 'p5', title: 'Tom Yuen — Marble Falls Land',
      type: 'purchase', stage: 'under_contract', value: 280000, commissionPct: 3, agentSplitPct: 70,
      closeDate: new Date(now.getTime() + 20 * 86400000).toISOString(),
      notes: 'Under contract, title search in progress. Survey due Thursday.', assignedTo: 'u3', tags: [],
      stageHistory: [
        { stage: 'inquiry', enteredAt: daysAgo(12) },
        { stage: 'showing', enteredAt: daysAgo(9) },
        { stage: 'offer', enteredAt: daysAgo(5) },
        { stage: 'under_contract', enteredAt: daysAgo(1) },
      ],
      createdAt: daysAgo(12), updatedAt: daysAgo(1),
    },
    {
      id: 'd7', clientId: 'c9', title: 'Rachel Torres — Cedar Park Relocation',
      type: 'purchase', stage: 'inquiry', value: 385000, commissionPct: 3, agentSplitPct: 70,
      closeDate: new Date(now.getTime() + 60 * 86400000).toISOString(),
      notes: 'Time-sensitive relocation. Must close before Aug 15. Leander ISD required.', assignedTo: 'u1', tags: ['relocation', 'time-sensitive'],
      stageHistory: [{ stage: 'inquiry', enteredAt: daysAgo(4) }],
      createdAt: daysAgo(4), updatedAt: daysAgo(1),
    },
    {
      id: 'd8', clientId: 'c12', title: 'David Chen — Westlake Hills Luxury',
      type: 'purchase', stage: 'inquiry', value: 1250000, commissionPct: 2.5, agentSplitPct: 75,
      closeDate: new Date(now.getTime() + 30 * 86400000).toISOString(),
      notes: 'All-cash buyer. No mortgage contingency. Pool + wine cellar required. Private showing this weekend.', assignedTo: 'u1', tags: ['cash-buyer', 'luxury', 'VIP'],
      stageHistory: [{ stage: 'inquiry', enteredAt: daysAgo(2) }],
      createdAt: daysAgo(2), updatedAt: daysAgo(0),
    },
    {
      id: 'd9', clientId: 'c2', propertyId: 'p2', title: 'Marcus Bell — Houston Medical Office',
      type: 'purchase', stage: 'inquiry', value: 3200000, commissionPct: 2,
      closeDate: new Date(now.getTime() + 90 * 86400000).toISOString(),
      notes: 'BellMed expansion. Needs 20k+ sqft, ADA compliant. Site visits pending.', assignedTo: 'u2', tags: ['commercial', 'medical'],
      stageHistory: [{ stage: 'inquiry', enteredAt: daysAgo(6) }],
      createdAt: daysAgo(6), updatedAt: daysAgo(2),
    },
    // A closed-lost deal for analytics realism
    {
      id: 'd10', clientId: 'c10', title: 'Brian Westfield — Plano Luxury (Lost)',
      type: 'purchase', stage: 'closed_lost', value: 750000, commissionPct: 3,
      closeDate: daysAgo(20), lossReason: 'Client found property through another agent',
      notes: 'Lost to RE/MAX agent who had a pocket listing. Expand network with luxury pocket listings.', assignedTo: 'u2', tags: [],
      stageHistory: [
        { stage: 'inquiry', enteredAt: daysAgo(40) },
        { stage: 'showing', enteredAt: daysAgo(35) },
        { stage: 'closed_lost', enteredAt: daysAgo(20) },
      ],
      createdAt: daysAgo(40), updatedAt: daysAgo(20),
    },
  ];

  const tasks: Task[] = [
    {
      id: 't1', title: 'Respond to Sarah Mitchell counter-offer by 5pm Friday',
      description: 'Seller countered at $605k. Advise Sarah on response. Recommend accepting — competing offer confirmed.',
      priority: 'urgent', status: 'open', dueDate: new Date(now.getTime() + 1 * 86400000).toISOString(),
      clientId: 'c1', dealId: 'd1', assignedTo: 'u1', createdAt: daysAgo(1), updatedAt: daysAgo(1),
    },
    {
      id: 't2', title: 'Schedule second showing — Priya Sharma at 45 Elm St',
      description: 'Priya wants to bring her boyfriend for a second look. Weekend preferred.',
      priority: 'high', status: 'open', dueDate: new Date(now.getTime() + 2 * 86400000).toISOString(),
      clientId: 'c7', dealId: 'd5', assignedTo: 'u1', createdAt: daysAgo(1), updatedAt: daysAgo(1),
    },
    {
      id: 't3', title: 'Send Derek Okafor shortlist — Dallas 8+ unit properties',
      description: 'Finalize 4-plex Oak Cliff and 8-unit Greenville reports. Include cap rate analysis.',
      priority: 'high', status: 'open', dueDate: new Date(now.getTime() + 1 * 86400000).toISOString(),
      clientId: 'c4', dealId: 'd3', assignedTo: 'u1', createdAt: daysAgo(2), updatedAt: daysAgo(2),
    },
    {
      id: 't4', title: 'Schedule virtual tour for Rachel Torres — Cedar Park',
      description: '6 shortlisted properties in Leander ISD. Video call preferred (Chicago timezone).',
      priority: 'high', status: 'open', dueDate: new Date(now.getTime() + 1 * 86400000).toISOString(),
      clientId: 'c9', assignedTo: 'u1', createdAt: daysAgo(1), updatedAt: daysAgo(1),
    },
    {
      id: 't5', title: 'Book private Westlake showings for David Chen this weekend',
      description: '4 pocket listings need private showing. Coordinate with listing agents. David is all-cash, priority.',
      priority: 'urgent', status: 'open', dueDate: new Date(now.getTime() + 2 * 86400000).toISOString(),
      clientId: 'c12', assignedTo: 'u1', createdAt: daysAgo(0), updatedAt: daysAgo(0),
    },
    {
      id: 't6', title: 'Contact building owner — James Thornton parking solution',
      description: 'Explore adjacent lot lease or shared parking agreement. James needs 50 spots minimum.',
      priority: 'medium', status: 'open', dueDate: new Date(now.getTime() + 5 * 86400000).toISOString(),
      clientId: 'c2', dealId: 'd2', assignedTo: 'u2', createdAt: daysAgo(1), updatedAt: daysAgo(1),
    },
    {
      id: 't7', title: 'Confirm title search progress — Tom Yuen Marble Falls',
      description: 'Texas Title Co should have preliminary search back by Thursday. Follow up if not received.',
      priority: 'high', status: 'open', dueDate: new Date(now.getTime() + 3 * 86400000).toISOString(),
      clientId: 'c6', dealId: 'd6', assignedTo: 'u3', createdAt: daysAgo(1), updatedAt: daysAgo(1),
    },
    {
      id: 't8', title: 'Send Plano/Allen/Frisco expanded shortlist to Brian Westfield',
      description: 'Wife wants pool + home theater. Expand search radius to Allen, Frisco. 5-6BR minimum.',
      priority: 'medium', status: 'open', dueDate: new Date(now.getTime() + 4 * 86400000).toISOString(),
      clientId: 'c10', assignedTo: 'u2', createdAt: daysAgo(3), updatedAt: daysAgo(3),
    },
    {
      id: 't9', title: 'Follow up with Marcus Bell re: Medical Center site visits',
      description: 'Emailed 3 properties 2 days ago. No response. Try phone.',
      priority: 'medium', status: 'open', dueDate: new Date(now.getTime() + 1 * 86400000).toISOString(),
      clientId: 'c8', assignedTo: 'u2', createdAt: daysAgo(2), updatedAt: daysAgo(2),
    },
    {
      id: 't10', title: 'Q3 nurture call — Maria Gonzalez',
      description: 'Reconnect. Student loans paid. Saving for down payment. Encourage pre-approval process.',
      priority: 'low', status: 'open', dueDate: new Date(now.getTime() + 45 * 86400000).toISOString(),
      clientId: 'c3', assignedTo: 'u3', createdAt: daysAgo(14), updatedAt: daysAgo(14),
    },
    {
      id: 't11', title: 'Request referral from Linda Hargreaves',
      description: 'She mentioned a colleague who might be selling. Send thank-you card + referral ask.',
      priority: 'medium', status: 'completed', dueDate: daysAgo(3), completedAt: daysAgo(3),
      clientId: 'c5', assignedTo: 'u2', createdAt: daysAgo(6), updatedAt: daysAgo(3),
    },
    {
      id: 't12', title: 'Send Angela Ruiz — 3 SA turnkey rentals with tenants',
      description: 'All under $300k, existing leases, rent $1,550–1,800/mo. Cap rates 5.8–6.4%.',
      priority: 'medium', status: 'open', dueDate: new Date(now.getTime() + 6 * 86400000).toISOString(),
      clientId: 'c11', assignedTo: 'u3', createdAt: daysAgo(5), updatedAt: daysAgo(5),
    },
  ];

  const activity: ActivityEntry[] = [
    // Sarah Mitchell (c1) — active deal progression
    { id: 'a1',  clientId: 'c1', dealId: 'd1', type: 'call',    title: 'Initial consultation call',              body: 'Discussed budget ($450–650k) and timeline (move within 3 months). Sarah confirmed pre-approval at $600k. Needs 3–4BR with yard for dogs.', createdAt: daysAgo(28) },
    { id: 'a2',  clientId: 'c1', dealId: 'd1', type: 'email',   title: 'Sent buyer\'s checklist + market report', body: 'Emailed Sarah our buyer\'s guide, current Downtown Austin market stats, and a shortlist of 5 properties to review before Saturday\'s tour.', createdAt: daysAgo(21) },
    { id: 'a3',  clientId: 'c1', dealId: 'd1', type: 'meeting', title: 'Property tour — 3 listings',              body: 'Toured 12 Oak Lane ($595k), 45 Elm St ($475k), 9 Maple Ave ($510k). Sarah loved 12 Oak Lane — "this is it." Backyard perfect for dogs.', createdAt: daysAgo(14) },
    { id: 'a4',  clientId: 'c1', dealId: 'd1', type: 'call',    title: 'Offer strategy call',                    body: 'Reviewed comps. Suggested offering at list price ($595k) with 30-day close. Discussed inspection contingency. Sarah approved offer terms.', createdAt: daysAgo(4) },
    { id: 'a5',  clientId: 'c1', dealId: 'd1', type: 'note',    title: 'Offer submitted at $595,000',            body: 'Submitted offer at full asking price. 30-day close, $10k earnest money. Seller has until Friday 5pm to respond. Competing offer rumored.', createdAt: daysAgo(2) },
    // James Thornton (c2) — commercial
    { id: 'a6',  clientId: 'c2', dealId: 'd2', type: 'email',   title: 'Sent commercial listings package',       body: 'Emailed 5 properties: 800 Commerce, 1200 Tech Blvd, 400 North Loop, 900 Braker, 1500 N Mopac. Requested feedback on which to tour first.', createdAt: daysAgo(18) },
    { id: 'a7',  clientId: 'c2', dealId: 'd2', type: 'call',    title: 'Shortlisted 800 Commerce Blvd',          body: 'James narrowed to 800 Commerce — perfect floor plan, fiber internet, conference rooms. Main concern: only 35 parking spots vs 50 needed.', createdAt: daysAgo(10) },
    { id: 'a8',  clientId: 'c2', dealId: 'd2', type: 'meeting', title: 'Site visit — 800 Commerce Blvd',         body: 'Toured with James and his office manager. Impressed by layout. Parking still a dealbreaker unless owner allows adjacent lot use.', createdAt: daysAgo(1) },
    // Maria Gonzalez (c3) — nurture
    { id: 'a9',  clientId: 'c3', type: 'call',    title: 'Open house follow-up call',              body: 'Maria came to our Alamo Heights open house. Interested but needs 12+ months to save. Student loan payoff in June is the trigger. Added to nurture list.', createdAt: daysAgo(60) },
    { id: 'a10', clientId: 'c3', type: 'email',   title: 'Monthly market update email',            body: 'Sent San Antonio market report. Median price up 4% YoY. FHA loan rates discussed. Suggested starting pre-approval process even while saving.', createdAt: daysAgo(30) },
    { id: 'a11', clientId: 'c3', type: 'call',    title: 'Q2 check-in call',                       body: 'Maria paid off student loans. Now saving aggressively. Expects to have 5% down by September. Parents confirmed as co-signers. Re-activating in 4 months.', createdAt: daysAgo(14) },
    // Derek Okafor (c4) — investor
    { id: 'a12', clientId: 'c4', dealId: 'd3', type: 'call',    title: 'Investor intake call',                   body: 'Derek owns 3 duplexes in Frisco. Wants to scale to multi-family. Criteria: 8–20 units, 6%+ cap rate, Dallas Metro. Private lender already secured.', createdAt: daysAgo(10) },
    { id: 'a13', clientId: 'c4', dealId: 'd3', type: 'note',    title: 'Pulled Dallas MLS — 12 properties found', body: 'Found 12 qualifying properties. Top picks: 4-plex on Oak Cliff ($1.1M, 6.8% cap), 8-unit on Greenville ($1.3M, 6.2% cap). Sending report today.', createdAt: daysAgo(3) },
    // Linda Hargreaves (c5) — closed
    { id: 'a14', clientId: 'c5', dealId: 'd4', type: 'call',    title: 'Initial call — Zillow inquiry',          body: 'Linda saw our Zillow listing for Houston Heights area. Budget $550–750k. Needs 4BR for family of 4. Pre-approved. Very motivated buyer.', createdAt: daysAgo(85) },
    { id: 'a15', clientId: 'c5', dealId: 'd4', type: 'meeting', title: 'Tour — 200 Westcott Street',             body: 'Linda and husband toured 200 Westcott. Fell in love with the pool and chef\'s kitchen. Kids loved the backyard. Ready to make an offer.', createdAt: daysAgo(70) },
    { id: 'a16', clientId: 'c5', dealId: 'd4', type: 'call',    title: 'Offer negotiation — accepted at $635k',  body: 'Seller countered at $640k. We came back at $633k. Final agreed at $635k. Under contract! Inspection scheduled for next Thursday.', createdAt: daysAgo(55) },
    { id: 'a17', clientId: 'c5', dealId: 'd4', type: 'meeting', title: 'Closing — Linda Hargreaves',             body: 'Smooth closing. All parties present. Linda cried happy tears when she got the keys. Left a glowing 5-star review. Mentioned a colleague who might be selling.', createdAt: daysAgo(5) },
    // Tom Yuen (c6) — under contract
    { id: 'a18', clientId: 'c6', dealId: 'd6', type: 'call',    title: 'Initial land inquiry call',              body: 'Tom found us via website. Wants 10–50 acres Hill Country raw land. No specific timeline but has budget ready. Wants creek or river access.', createdAt: daysAgo(14) },
    { id: 'a19', clientId: 'c6', dealId: 'd6', type: 'meeting', title: 'Marble Falls property walkthrough',      body: '25 acres on Ridgeline Rd. Tom loved the creek access and the 360-degree hill views. "This is exactly what I envisioned." Made verbal offer same day.', createdAt: daysAgo(7) },
    { id: 'a20', clientId: 'c6', dealId: 'd6', type: 'note',    title: 'Under contract at $280k',                body: 'Seller accepted $280k full ask. Title search initiated with Texas Title Co. Survey scheduled. Expected close in 3 weeks pending survey results.', createdAt: daysAgo(1) },
    // Priya Sharma (c7) — showing
    { id: 'a21', clientId: 'c7', dealId: 'd5', type: 'call',    title: 'Referral intro call — Priya Sharma',     body: 'Referred by David Chen. Senior engineer, fully remote. Needs dedicated office room (not a nook). Pre-approved at $480k. South Austin preferred.', createdAt: daysAgo(5) },
    { id: 'a22', clientId: 'c7', dealId: 'd5', type: 'meeting', title: 'First showing — 45 Elm Street',          body: 'Priya loved the neighborhood walkability and the third bedroom configured as office. "The coffee shop is literally around the corner." Second showing requested.', createdAt: daysAgo(2) },
    // Marcus Bell (c8)
    { id: 'a23', clientId: 'c8', type: 'call',    title: 'Cold outreach — BellMed expansion',      body: 'Called Marcus re: Houston Medical Center expansion. BellMed needs 20k+ sqft medical office. Currently leasing, wants to own. Connected via LinkedIn.', createdAt: daysAgo(8) },
    { id: 'a24', clientId: 'c8', type: 'email',   title: 'Sent Medical Center submarket analysis', body: 'Emailed 3 available medical office spaces in TMC and Greenway Plaza. Two properties match ADA requirements. Requesting site visit confirmation.', createdAt: daysAgo(2) },
    // Rachel Torres (c9)
    { id: 'a25', clientId: 'c9', type: 'call',    title: 'Zillow inquiry — relocation buyer',      body: 'Rachel and husband relocating from Chicago for Apple. Must close by Aug 15. Pre-approved $400k. Leander ISD required for kids (ages 7 and 10).', createdAt: daysAgo(4) },
    { id: 'a26', clientId: 'c9', type: 'email',   title: 'Sent Cedar Park school district report', body: 'Emailed 6 active listings in Leander ISD zone under $420k. Included school ratings, commute times to Apple Campus. Scheduling virtual tour for tomorrow.', createdAt: daysAgo(1) },
    // Brian Westfield (c10)
    { id: 'a27', clientId: 'c10', type: 'call',   title: 'Referral intro — Brian Westfield',       body: 'Referred by Jordan Kim. Upgrading from Richardson 3BR. Budget $600–900k. Wife wants pool and home theater. Pre-approved Wells Fargo, 20% down ready.', createdAt: daysAgo(12) },
    { id: 'a28', clientId: 'c10', type: 'meeting', title: 'Tour — 3 Plano luxury homes',           body: 'Toured 3 properties in West Plano. Brian liked 2 of 3 but wife didn\'t love any of them. Expanding search to Allen and Frisco. Resending updated shortlist.', createdAt: daysAgo(4) },
    // David Chen (c12)
    { id: 'a29', clientId: 'c12', type: 'call',   title: 'New client — cash buyer, Westlake Hills', body: 'David Chen, CTO. All cash, $900k–1.4M, Westlake Hills. No contingencies. Wife wants pool, wine cellar, privacy. Needs to close before Series D announcement next month.', createdAt: daysAgo(2) },
    { id: 'a30', clientId: 'c12', type: 'note',   title: 'Sent Westlake luxury shortlist',         body: 'Prepared 4 off-market listings from our pocket inventory. $1.1M–1.35M range. Scheduling private showings for this weekend. Priority client — all-cash, fast close.', createdAt: daysAgo(0) },
  ];

  const notifications: import('../types').Notification[] = [
    { id: 'n1', type: 'task_due', title: 'Task due tomorrow', body: 'Send counter-offer response to Sarah Mitchell', entityType: 'task', entityId: 't1', isRead: false, createdAt: daysAgo(0) },
    { id: 'n2', type: 'stage_change', title: 'Deal moved to Under Contract', body: 'Tom Yuen — Marble Falls Land', entityType: 'deal', entityId: 'd6', isRead: false, createdAt: daysAgo(1) },
    { id: 'n3', type: 'client_assigned', title: 'New client assigned to you', body: 'Marcus Bell — Houston Medical Center', entityType: 'client', entityId: 'c8', isRead: true, createdAt: daysAgo(2) },
  ];

  const showings: import('../types').Showing[] = [
    { id: 's1', dealId: 'd1', clientId: 'c1', propertyId: 'p1', scheduledAt: daysAgo(14), status: 'completed', feedback: 'loved', agentNotes: 'Client loved the backyard and kitchen. Very enthusiastic.', createdAt: daysAgo(14) },
    { id: 's2', dealId: 'd2', clientId: 'c2', propertyId: 'p2', scheduledAt: daysAgo(1), status: 'completed', feedback: 'liked', agentNotes: 'Good layout but parking is a major concern for James.', createdAt: daysAgo(1) },
    { id: 's3', dealId: 'd5', clientId: 'c7', propertyId: 'p3', scheduledAt: new Date(now.getTime() + 2 * 86400000).toISOString(), status: 'scheduled', feedback: undefined, agentNotes: '', createdAt: daysAgo(1) },
  ];

  const userGoals: import('../types').UserGoals[] = [
    { userId: 'u1', month: now.toISOString().slice(0, 7), closingsGoal: 4, revenueGoal: 60000, activitiesGoal: 50 },
    { userId: 'u2', month: now.toISOString().slice(0, 7), closingsGoal: 3, revenueGoal: 45000, activitiesGoal: 40 },
    { userId: 'u3', month: now.toISOString().slice(0, 7), closingsGoal: 2, revenueGoal: 25000, activitiesGoal: 30 },
  ];

  // Market data — 6 months for Austin, Houston, Dallas
  const marketData: import('../types').MarketData[] = (() => {
    const entries: import('../types').MarketData[] = [];
    const areas = [
      { name: 'Austin, TX',  base: 525000, dom: 22, lsr: 0.98, inv: 1850 },
      { name: 'Houston, TX', base: 345000, dom: 31, lsr: 0.96, inv: 3200 },
      { name: 'Dallas, TX',  base: 415000, dom: 26, lsr: 0.97, inv: 2600 },
    ];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      areas.forEach((a, ai) => {
        // slight monthly variation
        const growth = 1 + (5 - i) * 0.004 + (ai === 0 ? 0.002 : 0);
        entries.push({
          id: `m${ai}_${i}`,
          area: a.name,
          month,
          medianPrice: Math.round(a.base * growth),
          daysOnMarket: Math.round(a.dom + (i % 2 === 0 ? 1 : -1) * (ai + 1)),
          listToSaleRatio: parseFloat((a.lsr + (i % 3 === 0 ? 0.005 : -0.002)).toFixed(3)),
          inventory: Math.round(a.inv + (5 - i) * 40 * (ai + 1) * (i % 2 === 0 ? 1 : -1)),
          createdAt: d.toISOString(),
        });
      });
    }
    return entries;
  })();

  db.users.set(users);
  db.clients.set(clients);
  db.properties.set(properties);
  db.deals.set(deals);
  db.tasks.set(tasks);
  db.activity.set(activity);
  db.notifications.set(notifications);
  db.showings.set(showings);
  db.userGoals.set(userGoals);
  db.marketData.set(marketData);
  db.currentUser.set(users[0]); // Default to Alex Rivera (admin)
}

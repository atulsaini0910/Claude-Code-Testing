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
  settings:      { get: () => read<AppSettings>(KEYS.settings, { theme: 'light' }), set: (v: AppSettings) => write(KEYS.settings, v) },
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
      locationPreference: 'Downtown Austin, TX', status: 'active', notes: 'Prefers 3-4BR, has 2 dogs, needs yard.',
      clientType: 'buyer', leadTemperature: 'hot', source: 'referral', preApproved: true, preApprovalAmount: 600000,
      tags: ['VIP', 'pre-approved'], score: 85, assignedTo: 'u1',
      customFields: {}, createdAt: daysAgo(30), updatedAt: daysAgo(2),
    },
    {
      id: 'c2', name: 'James Thornton', phone: '(737) 555-0284', email: 'james.thornton@bizmail.com',
      budget: { min: 1200000, max: 2500000 }, propertyType: 'commercial',
      locationPreference: 'North Austin Business District', status: 'active', notes: '5k–10k sqft office, 50+ parking.',
      clientType: 'investor', leadTemperature: 'warm', source: 'website', preApproved: false,
      tags: ['commercial', 'investor'], score: 72, assignedTo: 'u2',
      customFields: {}, createdAt: daysAgo(20), updatedAt: daysAgo(1),
    },
    {
      id: 'c3', name: 'Maria Gonzalez', phone: '(210) 555-0347', email: 'mariag@homesearch.net',
      budget: { min: 200000, max: 320000 }, propertyType: 'residential',
      locationPreference: 'San Antonio Suburbs', status: 'nurture', notes: 'First-time buyer, still saving. Follow up Q2.',
      clientType: 'buyer', leadTemperature: 'cold', source: 'open_house', preApproved: false,
      tags: ['first-time'], score: 35, assignedTo: 'u3',
      customFields: {}, createdAt: daysAgo(60), updatedAt: daysAgo(14),
    },
    {
      id: 'c4', name: 'Derek Okafor', phone: '(469) 555-0512', email: 'derek.okafor@invest.io',
      budget: { min: 800000, max: 1500000 }, propertyType: 'multi-family',
      locationPreference: 'Dallas Metro Area', status: 'active', notes: '8–20 unit complexes, positive cash flow only.',
      clientType: 'investor', leadTemperature: 'hot', source: 'referral', preApproved: true, preApprovalAmount: 1400000,
      tags: ['investor', 'multi-family', 'pre-approved'], score: 90, assignedTo: 'u1',
      customFields: {}, createdAt: daysAgo(10), updatedAt: daysAgo(3),
    },
    {
      id: 'c5', name: 'Linda Hargreaves', phone: '(281) 555-0673', email: 'linda.h@remail.com',
      budget: { min: 550000, max: 750000 }, propertyType: 'residential',
      locationPreference: 'Houston Heights', status: 'closed', notes: 'Purchased 4BR on Westcott St. Closed successfully.',
      clientType: 'buyer', leadTemperature: 'cold', source: 'zillow', preApproved: true, preApprovalAmount: 700000,
      tags: ['closed-won'], score: 100, assignedTo: 'u2',
      customFields: {}, createdAt: daysAgo(90), updatedAt: daysAgo(5),
    },
    {
      id: 'c6', name: 'Tom Yuen', phone: '(512) 555-0788', email: 'tom.yuen@landbuyer.com',
      budget: { min: 100000, max: 400000 }, propertyType: 'land',
      locationPreference: 'Hill Country, TX', status: 'active', notes: '10–50 acres, raw land for future development.',
      clientType: 'investor', leadTemperature: 'warm', source: 'website', preApproved: false,
      tags: ['land', 'investor'], score: 60, assignedTo: 'u3',
      customFields: {}, createdAt: daysAgo(15), updatedAt: daysAgo(7),
    },
    {
      id: 'c7', name: 'Priya Sharma', phone: '(512) 555-0900', email: 'priya.s@email.com',
      budget: { min: 350000, max: 500000 }, propertyType: 'residential',
      locationPreference: 'South Austin, TX', status: 'active', notes: 'Remote worker, needs home office space.',
      clientType: 'buyer', leadTemperature: 'hot', source: 'referral', preApproved: true, preApprovalAmount: 480000,
      tags: ['VIP', 'pre-approved'], score: 88, assignedTo: 'u1',
      customFields: {}, createdAt: daysAgo(5), updatedAt: daysAgo(1),
    },
    {
      id: 'c8', name: 'Marcus Bell', phone: '(713) 555-0412', email: 'mbell@properties.com',
      budget: { min: 2000000, max: 5000000 }, propertyType: 'commercial',
      locationPreference: 'Houston Medical Center', status: 'active', notes: 'Medical office/clinic space, 20k+ sqft.',
      clientType: 'investor', leadTemperature: 'warm', source: 'cold_call', preApproved: false,
      tags: ['commercial', 'medical'], score: 65, assignedTo: 'u2',
      customFields: {}, createdAt: daysAgo(8), updatedAt: daysAgo(2),
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
      type: 'purchase', stage: 'under_contract', value: 280000, commissionPct: 3,
      closeDate: new Date(now.getTime() + 20 * 86400000).toISOString(),
      notes: 'Under contract, title search in progress.', assignedTo: 'u3', tags: [],
      stageHistory: [
        { stage: 'inquiry', enteredAt: daysAgo(12) },
        { stage: 'showing', enteredAt: daysAgo(9) },
        { stage: 'offer', enteredAt: daysAgo(5) },
        { stage: 'under_contract', enteredAt: daysAgo(1) },
      ],
      createdAt: daysAgo(12), updatedAt: daysAgo(1),
    },
  ];

  const tasks: Task[] = [
    {
      id: 't1', title: 'Send counter-offer response to Sarah Mitchell', description: 'Review seller counter and advise client',
      priority: 'urgent', status: 'open', dueDate: new Date(now.getTime() + 1 * 86400000).toISOString(),
      clientId: 'c1', dealId: 'd1', assignedTo: 'u1', createdAt: daysAgo(1), updatedAt: daysAgo(1),
    },
    {
      id: 't2', title: 'Schedule second showing for Priya Sharma', description: '',
      priority: 'high', status: 'open', dueDate: new Date(now.getTime() + 2 * 86400000).toISOString(),
      clientId: 'c7', dealId: 'd5', assignedTo: 'u1', createdAt: daysAgo(1), updatedAt: daysAgo(1),
    },
    {
      id: 't3', title: 'Pull Dallas multi-family MLS report for Derek', description: 'Min 8 units, under $1.5M, positive cash flow',
      priority: 'high', status: 'open', dueDate: new Date(now.getTime() + 3 * 86400000).toISOString(),
      clientId: 'c4', dealId: 'd3', assignedTo: 'u1', createdAt: daysAgo(2), updatedAt: daysAgo(2),
    },
    {
      id: 't4', title: 'Follow up with Maria Gonzalez (Q2 check-in)', description: '',
      priority: 'low', status: 'open', dueDate: new Date(now.getTime() + 30 * 86400000).toISOString(),
      clientId: 'c3', assignedTo: 'u3', createdAt: daysAgo(14), updatedAt: daysAgo(14),
    },
    {
      id: 't5', title: 'Resolve parking concern — James Thornton deal', description: 'Contact building owner re: parking expansion',
      priority: 'medium', status: 'open', dueDate: new Date(now.getTime() + 5 * 86400000).toISOString(),
      clientId: 'c2', dealId: 'd2', assignedTo: 'u2', createdAt: daysAgo(1), updatedAt: daysAgo(1),
    },
    {
      id: 't6', title: 'Confirm title search for Tom Yuen land deal', description: '',
      priority: 'high', status: 'open', dueDate: new Date(now.getTime() + 7 * 86400000).toISOString(),
      clientId: 'c6', dealId: 'd6', assignedTo: 'u3', createdAt: daysAgo(1), updatedAt: daysAgo(1),
    },
    {
      id: 't7', title: 'Send Linda Hargreaves thank-you and referral request', description: '',
      priority: 'medium', status: 'completed', dueDate: daysAgo(3), completedAt: daysAgo(3),
      clientId: 'c5', assignedTo: 'u2', createdAt: daysAgo(6), updatedAt: daysAgo(3),
    },
  ];

  const activity: ActivityEntry[] = [
    { id: 'a1', clientId: 'c1', dealId: 'd1', type: 'call', title: 'Initial consultation call', body: 'Discussed budget and timeline. Sarah wants to move within 3 months. Pre-approval confirmed.', createdAt: daysAgo(28) },
    { id: 'a2', clientId: 'c1', dealId: 'd1', type: 'meeting', title: 'Property tour — 3 listings', body: 'Toured 12 Oak Lane, 45 Elm St, 9 Maple Ave. Loved 12 Oak Lane.', createdAt: daysAgo(14) },
    { id: 'a3', clientId: 'c1', dealId: 'd1', type: 'note', title: 'Offer submitted at $595k', body: 'Submitted offer. Waiting for seller response by Friday.', createdAt: daysAgo(2) },
    { id: 'a4', clientId: 'c2', dealId: 'd2', type: 'email', title: 'Sent commercial listings package', body: 'Emailed 5 properties matching criteria. Awaiting feedback.', createdAt: daysAgo(18) },
    { id: 'a5', clientId: 'c2', dealId: 'd2', type: 'meeting', title: 'Site visit — 800 Commerce Blvd', body: 'James loved the layout but concerned about parking. Negotiating with owner.', createdAt: daysAgo(1) },
    { id: 'a6', clientId: 'c3', type: 'call', title: 'Follow-up check-in', body: 'Maria needs another 6 months. Will reconnect in April.', createdAt: daysAgo(14) },
    { id: 'a7', clientId: 'c4', dealId: 'd3', type: 'note', title: 'Pulled MLS data — Dallas multi-family', body: 'Found 4 properties with 8+ units under $1.5M. Sending report.', createdAt: daysAgo(3) },
    { id: 'a8', clientId: 'c5', dealId: 'd4', type: 'meeting', title: 'Closing — Linda Hargreaves', body: 'Signed all documents. Keys handed over. Linda is thrilled!', createdAt: daysAgo(5) },
    { id: 'a9', clientId: 'c6', dealId: 'd6', type: 'call', title: 'Discussed Marble Falls parcels', body: 'Tom interested in 25-acre parcel near Marble Falls. Scheduling visit.', createdAt: daysAgo(7) },
    { id: 'a10', clientId: 'c7', dealId: 'd5', type: 'call', title: 'Intro call with Priya Sharma', body: 'Remote worker, needs dedicated home office. Pre-approved at $480k.', createdAt: daysAgo(4) },
    { id: 'a11', clientId: 'c6', dealId: 'd6', type: 'meeting', title: 'Property walkthrough — Marble Falls land', body: '25 acres confirmed. Tom loved the creek. Under contract now.', createdAt: daysAgo(1) },
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

  db.users.set(users);
  db.clients.set(clients);
  db.properties.set(properties);
  db.deals.set(deals);
  db.tasks.set(tasks);
  db.activity.set(activity);
  db.notifications.set(notifications);
  db.showings.set(showings);
  db.userGoals.set(userGoals);
  db.currentUser.set(users[0]); // Default to Alex Rivera (admin)
}

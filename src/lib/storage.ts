import { v4 as uuidv4 } from 'uuid';
import type { Client, ActivityEntry } from '../types';

const CLIENTS_KEY = 'reat_clients';
const ACTIVITY_KEY = 'reat_activity';

function readStore<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStore<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getClients(): Client[] {
  return readStore<Client[]>(CLIENTS_KEY, []);
}

export function saveClients(clients: Client[]): void {
  writeStore(CLIENTS_KEY, clients);
}

export function getActivity(): ActivityEntry[] {
  return readStore<ActivityEntry[]>(ACTIVITY_KEY, []);
}

export function saveActivity(entries: ActivityEntry[]): void {
  writeStore(ACTIVITY_KEY, entries);
}

export function initSeedData(): void {
  if (localStorage.getItem(CLIENTS_KEY) !== null) return;

  const now = new Date();
  const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();

  const clients: Client[] = [
    {
      id: uuidv4(),
      name: 'Sarah Mitchell',
      phone: '(512) 555-0191',
      email: 'sarah.mitchell@email.com',
      budget: { min: 450000, max: 650000 },
      propertyType: 'residential',
      locationPreference: 'Downtown Austin, TX',
      status: 'active',
      notes: 'Prefers 3-4 bedroom homes. Has two dogs, needs a yard. Pre-approved for financing.',
      createdAt: daysAgo(30),
      updatedAt: daysAgo(2),
    },
    {
      id: uuidv4(),
      name: 'James Thornton',
      phone: '(737) 555-0284',
      email: 'james.thornton@bizmail.com',
      budget: { min: 1200000, max: 2500000 },
      propertyType: 'commercial',
      locationPreference: 'North Austin Business District',
      status: 'active',
      notes: 'Looking for office space 5,000–10,000 sq ft. Wants parking for 50+ cars.',
      createdAt: daysAgo(20),
      updatedAt: daysAgo(1),
    },
    {
      id: uuidv4(),
      name: 'Maria Gonzalez',
      phone: '(210) 555-0347',
      email: 'mariag@homesearch.net',
      budget: { min: 200000, max: 320000 },
      propertyType: 'residential',
      locationPreference: 'San Antonio Suburbs',
      status: 'inactive',
      notes: 'First-time buyer. Still saving for down payment. Follow up in Q2.',
      createdAt: daysAgo(60),
      updatedAt: daysAgo(14),
    },
    {
      id: uuidv4(),
      name: 'Derek Okafor',
      phone: '(469) 555-0512',
      email: 'derek.okafor@invest.io',
      budget: { min: 800000, max: 1500000 },
      propertyType: 'multi-family',
      locationPreference: 'Dallas Metro Area',
      status: 'active',
      notes: 'Investor, looking for 8–20 unit apartment complexes with positive cash flow.',
      createdAt: daysAgo(10),
      updatedAt: daysAgo(3),
    },
    {
      id: uuidv4(),
      name: 'Linda Hargreaves',
      phone: '(281) 555-0673',
      email: 'linda.h@remail.com',
      budget: { min: 550000, max: 750000 },
      propertyType: 'residential',
      locationPreference: 'Houston Heights',
      status: 'closed',
      notes: 'Deal closed successfully. Purchased 4BR on Westcott St. Very happy client.',
      createdAt: daysAgo(90),
      updatedAt: daysAgo(5),
    },
    {
      id: uuidv4(),
      name: 'Tom Yuen',
      phone: '(512) 555-0788',
      email: 'tom.yuen@landbuyer.com',
      budget: { min: 100000, max: 400000 },
      propertyType: 'land',
      locationPreference: 'Hill Country, TX',
      status: 'active',
      notes: 'Wants raw land 10–50 acres for future development. Flexible on timeline.',
      createdAt: daysAgo(15),
      updatedAt: daysAgo(7),
    },
  ];

  const activity: ActivityEntry[] = [
    {
      id: uuidv4(), clientId: clients[0].id, type: 'call',
      title: 'Initial consultation call',
      body: 'Discussed budget, must-haves, and timeline. Sarah wants to move within 3 months.',
      createdAt: daysAgo(28),
    },
    {
      id: uuidv4(), clientId: clients[0].id, type: 'meeting',
      title: 'Property tour — 3 listings',
      body: 'Toured 12 Oak Lane, 45 Elm St, and 9 Maple Ave. Liked 12 Oak Lane best.',
      createdAt: daysAgo(14),
    },
    {
      id: uuidv4(), clientId: clients[0].id, type: 'note',
      title: 'Offer submitted on 12 Oak Lane',
      body: 'Submitted offer at $595,000. Waiting for seller response by Friday.',
      createdAt: daysAgo(2),
    },
    {
      id: uuidv4(), clientId: clients[1].id, type: 'email',
      title: 'Sent commercial listings package',
      body: 'Emailed 5 commercial property listings matching criteria. Awaiting feedback.',
      createdAt: daysAgo(18),
    },
    {
      id: uuidv4(), clientId: clients[1].id, type: 'meeting',
      title: 'Site visit — 800 Commerce Blvd',
      body: 'James loved the layout but concerned about parking. Negotiating with owner.',
      createdAt: daysAgo(1),
    },
    {
      id: uuidv4(), clientId: clients[2].id, type: 'call',
      title: 'Follow-up check-in',
      body: 'Maria says she needs another 6 months. Will reconnect in April.',
      createdAt: daysAgo(14),
    },
    {
      id: uuidv4(), clientId: clients[3].id, type: 'note',
      title: 'Pulled MLS data for multi-family in Dallas',
      body: 'Found 4 properties with 8+ units under $1.5M. Sending report tomorrow.',
      createdAt: daysAgo(3),
    },
    {
      id: uuidv4(), clientId: clients[4].id, type: 'meeting',
      title: 'Closing meeting',
      body: 'Signed all documents. Keys handed over. Linda is thrilled with the home!',
      createdAt: daysAgo(5),
    },
    {
      id: uuidv4(), clientId: clients[5].id, type: 'call',
      title: 'Discussed Hill Country parcels',
      body: 'Tom is interested in a 25-acre parcel near Marble Falls. Scheduling a visit.',
      createdAt: daysAgo(7),
    },
  ];

  saveClients(clients);
  saveActivity(activity);
}

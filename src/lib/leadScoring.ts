import type { Client, ActivityEntry } from '../types';

export interface ScoreBreakdown {
  total: number;
  items: { label: string; points: number; max: number; met: boolean }[];
}

export function computeLeadScoreBreakdown(client: Client, recentActivities: ActivityEntry[]): ScoreBreakdown {
  const now = Date.now();
  const daysSinceLastActivity = recentActivities.length > 0
    ? (now - new Date(recentActivities[0].createdAt).getTime()) / 86400000
    : 999;

  const items = [
    {
      label: 'Lead temperature',
      points: client.leadTemperature === 'hot' ? 25 : client.leadTemperature === 'warm' ? 15 : 5,
      max: 25,
      met: client.leadTemperature !== 'cold',
    },
    {
      label: 'Pre-approval secured',
      points: client.preApproved ? 20 : 0,
      max: 20,
      met: client.preApproved,
    },
    {
      label: 'Recent activity (last 7 days)',
      points: daysSinceLastActivity <= 7 ? 20 : daysSinceLastActivity <= 14 ? 10 : 0,
      max: 20,
      met: daysSinceLastActivity <= 14,
    },
    {
      label: 'Budget strength (≥$400k)',
      points: client.budget.max >= 400000 ? 15 : client.budget.max >= 200000 ? 8 : 3,
      max: 15,
      met: client.budget.max >= 200000,
    },
    {
      label: 'Referral or trusted source',
      points: client.source === 'referral' ? 10 : client.source === 'open_house' ? 7 : 5,
      max: 10,
      met: client.source === 'referral' || client.source === 'open_house',
    },
    {
      label: 'Active status',
      points: client.status === 'active' ? 10 : 0,
      max: 10,
      met: client.status === 'active',
    },
  ];

  const total = items.reduce((s, i) => s + i.points, 0);
  return { total, items };
}

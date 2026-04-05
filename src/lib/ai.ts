import Anthropic from '@anthropic-ai/sdk';
import type { Client, ActivityEntry, Deal } from '../types';

export async function generateClientSummary(
  client: Client,
  entries: ActivityEntry[],
  deals: Deal[],
  apiKey: string,
): Promise<string> {
  const anthropic = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  const activitySummary = entries.slice(-10).map(e =>
    `${e.type} on ${e.createdAt.slice(0, 10)}: ${e.body?.slice(0, 60) ?? ''}`
  ).join('\n');

  const dealSummary = deals.map(d =>
    `${d.title} (${d.stage}, $${d.value ?? 0})`
  ).join(', ');

  const prompt = `You are a real estate CRM assistant. Summarize this client in 3-4 sentences for a real estate agent. Include: who the client is, what they want, deal status, and best next action.

Client: ${client.name}, ${client.leadTemperature} lead, ${client.status}
Type: ${client.propertyType}, Budget: $${client.budget.min}–$${client.budget.max}
Location: ${client.locationPreference}
Pre-approved: ${client.preApproved ? 'Yes' : 'No'}
Lead score: ${client.score}/100
Last 10 activities:
${activitySummary || 'None'}
Deals: ${dealSummary || 'None'}

Write a concise professional summary (3-4 sentences only):`;

  const msg = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 200,
    messages: [{ role: 'user', content: prompt }],
  });

  return (msg.content[0] as { type: 'text'; text: string }).text;
}

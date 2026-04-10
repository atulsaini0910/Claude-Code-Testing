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

export async function generateFollowUpDraft(
  client: Client,
  lastActivities: ActivityEntry[],
  deals: Deal[],
  channel: 'email' | 'call' | 'sms',
  apiKey: string,
): Promise<string> {
  const anthropic = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  const lastContact = lastActivities[0];
  const dealInfo = deals.length > 0
    ? deals.map(d => `${d.title} (${d.stage})`).join(', ')
    : 'No active deals';

  const channelInstruction = channel === 'email'
    ? 'Write a short professional follow-up email (subject line + 3-4 sentences body). Start with "Subject:" on the first line.'
    : channel === 'sms'
    ? 'Write a brief friendly SMS text (1-2 sentences, max 160 characters). No greeting needed, just the message.'
    : 'Write a short call script opening (2-3 sentences to say when they pick up). Start with "Hi [name],"';

  const prompt = `You are a real estate agent assistant. Write a personalized follow-up message.

Client: ${client.name}, ${client.leadTemperature} lead
Budget: $${client.budget.min.toLocaleString()}–$${client.budget.max.toLocaleString()}, looking for ${client.propertyType} in ${client.locationPreference}
Pre-approved: ${client.preApproved ? 'Yes' : 'No'}
Last contact: ${lastContact ? `${lastContact.type} on ${lastContact.createdAt.slice(0, 10)} — "${lastContact.body?.slice(0, 80) ?? lastContact.title}"` : 'No recent contact'}
Active deals: ${dealInfo}

${channelInstruction}
Keep it personal and natural. Do not use placeholders like [Agent Name].`;

  const msg = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 250,
    messages: [{ role: 'user', content: prompt }],
  });

  return (msg.content[0] as { type: 'text'; text: string }).text;
}

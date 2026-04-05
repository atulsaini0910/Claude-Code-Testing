import type { Client, Deal, Task, Showing, ActivityEntry, Suggestion } from '../types';

export function computeSuggestions(
  clients: Client[],
  deals: Deal[],
  tasks: Task[],
  showings: Showing[],
  activities: ActivityEntry[],
): Suggestion[] {
  const suggestions: Suggestion[] = [];
  const now = Date.now();

  // Build last-contact map
  const lastContact = new Map<string, number>();
  for (const a of activities) {
    const prev = lastContact.get(a.clientId) ?? 0;
    const t = new Date(a.createdAt).getTime();
    if (t > prev) lastContact.set(a.clientId, t);
  }
  // Also factor in lastContactedAt field
  for (const c of clients) {
    if (c.lastContactedAt) {
      const t = new Date(c.lastContactedAt).getTime();
      const prev = lastContact.get(c.id) ?? 0;
      if (t > prev) lastContact.set(c.id, t);
    }
  }

  // ─── Rule 1: Hot lead not contacted in >7 days ────────────────────────────
  for (const c of clients) {
    if (c.status !== 'active' || c.leadTemperature !== 'hot') continue;
    const last = lastContact.get(c.id);
    const days = last ? Math.floor((now - last) / 86400000) : 999;
    if (days >= 7) {
      suggestions.push({
        id: `r1-${c.id}`,
        title: `Call ${c.name}`,
        body: `Hot lead — ${days === 999 ? 'never contacted' : `no contact in ${days} days`}. Don't let this one go cold.`,
        urgency: days >= 14 ? 'high' : 'medium',
        entityType: 'client',
        entityId: c.id,
        actionType: 'call',
      });
    }
  }

  // ─── Rule 2: Active client with next action date overdue ──────────────────
  for (const c of clients) {
    if (c.status !== 'active' || !c.nextActionDate) continue;
    const actionTime = new Date(c.nextActionDate).getTime();
    if (actionTime < now) {
      const daysOverdue = Math.floor((now - actionTime) / 86400000);
      suggestions.push({
        id: `r2-${c.id}`,
        title: `Overdue action: ${c.name}`,
        body: `Next action date was ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} ago. Update it after you reach out.`,
        urgency: 'high',
        entityType: 'client',
        entityId: c.id,
        actionType: 'log_activity',
      });
    }
  }

  // ─── Rule 3: Showing tomorrow — send confirmation ─────────────────────────
  const tomorrowStart = now + 86400000;
  const tomorrowEnd   = now + 2 * 86400000;
  for (const s of showings) {
    if (s.status !== 'scheduled') continue;
    const showingTime = new Date(s.scheduledAt).getTime();
    if (showingTime >= tomorrowStart && showingTime <= tomorrowEnd) {
      const client = clients.find(c => c.id === s.clientId);
      suggestions.push({
        id: `r3-${s.id}`,
        title: `Confirm tomorrow's showing`,
        body: `${client?.name ?? 'Client'} has a showing tomorrow. Send a confirmation message now.`,
        urgency: 'high',
        entityType: 'showing',
        entityId: s.id,
        actionType: 'log_activity',
      });
    }
  }

  // ─── Rule 4: Deal stalling in a stage (>10 days) ─────────────────────────
  for (const d of deals) {
    if (d.stage === 'closed_won' || d.stage === 'closed_lost') continue;
    const stageEntry = d.stageHistory
      ? [...d.stageHistory].reverse().find(h => h.stage === d.stage)
      : null;
    const stageTime = stageEntry
      ? new Date(stageEntry.enteredAt).getTime()
      : new Date(d.updatedAt).getTime();
    const daysInStage = Math.floor((now - stageTime) / 86400000);
    if (daysInStage >= 10) {
      suggestions.push({
        id: `r4-${d.id}`,
        title: `Deal stalling: ${d.title}`,
        body: `In "${d.stage.replace('_', ' ')}" for ${daysInStage} days. Review and advance or flag at-risk.`,
        urgency: daysInStage >= 21 ? 'high' : 'medium',
        entityType: 'deal',
        entityId: d.id,
        actionType: 'navigate',
      });
    }
  }

  // ─── Rule 5: Overdue urgent/high task linked to active deal ──────────────
  for (const t of tasks) {
    if (t.status !== 'open' || !t.dealId) continue;
    if (t.priority !== 'urgent' && t.priority !== 'high') continue;
    if (!t.dueDate || new Date(t.dueDate).getTime() >= now) continue;
    const daysOverdue = Math.floor((now - new Date(t.dueDate).getTime()) / 86400000);
    suggestions.push({
      id: `r5-${t.id}`,
      title: `Overdue task: "${t.title}"`,
      body: `${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} overdue. Complete it or reassign to keep the deal on track.`,
      urgency: 'high',
      entityType: 'task',
      entityId: t.id,
      actionType: 'navigate',
    });
  }

  // ─── Rule 6: Warm lead not contacted in >21 days ─────────────────────────
  for (const c of clients) {
    if (c.status !== 'active' || c.leadTemperature !== 'warm') continue;
    const last = lastContact.get(c.id);
    const days = last ? Math.floor((now - last) / 86400000) : 999;
    if (days >= 21) {
      suggestions.push({
        id: `r6-${c.id}`,
        title: `Re-engage ${c.name}`,
        body: `Warm lead — no contact in ${days === 999 ? 'a long time' : `${days} days`}. A quick check-in could re-warm this prospect.`,
        urgency: 'low',
        entityType: 'client',
        entityId: c.id,
        actionType: 'log_activity',
      });
    }
  }

  // Sort: high urgency first, then deduplicate by entityId (keep first)
  const seen = new Set<string>();
  return suggestions
    .sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.urgency] - order[b.urgency];
    })
    .filter(s => {
      if (seen.has(s.entityId)) return false;
      seen.add(s.entityId);
      return true;
    })
    .slice(0, 6);
}

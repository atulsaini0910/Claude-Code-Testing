import type { DealStage } from '../types';

export interface ChecklistItem {
  id: string;
  label: string;
  description?: string;
}

export const STAGE_CHECKLISTS: Record<DealStage, ChecklistItem[]> = {
  inquiry: [
    { id: 'inq-1', label: 'Review client requirements', description: 'Confirm budget, property type, and location' },
    { id: 'inq-2', label: 'Run initial property search', description: 'Pull MLS listings matching criteria' },
    { id: 'inq-3', label: 'Confirm pre-approval status', description: 'Verify financing readiness' },
  ],
  showing: [
    { id: 'shw-1', label: 'Schedule showing appointment', description: 'Coordinate with seller\'s agent' },
    { id: 'shw-2', label: 'Send confirmation to client', description: 'Include address and time' },
    { id: 'shw-3', label: 'Prepare property tour notes', description: 'Research comparable sales beforehand' },
    { id: 'shw-4', label: 'Capture client feedback after showing', description: 'Rate and record client reaction' },
  ],
  offer: [
    { id: 'off-1', label: 'Prepare offer letter', description: 'Draft with client-approved terms' },
    { id: 'off-2', label: 'Review contingencies with client', description: 'Inspection, financing, appraisal' },
    { id: 'off-3', label: 'Submit offer to seller\'s agent' },
    { id: 'off-4', label: 'Set response deadline reminder', description: 'Notify client of deadline' },
    { id: 'off-5', label: 'Prepare for counter-offer scenarios' },
  ],
  under_contract: [
    { id: 'uc-1', label: 'Order property inspection', description: 'Schedule within contingency period' },
    { id: 'uc-2', label: 'Track financing contingency deadline' },
    { id: 'uc-3', label: 'Schedule appraisal', description: 'Coordinate with lender' },
    { id: 'uc-4', label: 'Review HOA documents (if applicable)' },
    { id: 'uc-5', label: 'Coordinate with title company', description: 'Open escrow, send earnest money instructions' },
    { id: 'uc-6', label: 'Complete walk-through before closing' },
  ],
  closed_won: [
    { id: 'cw-1', label: 'Complete all closing paperwork' },
    { id: 'cw-2', label: 'Verify commission payment received' },
    { id: 'cw-3', label: 'Update client status to \'closed\'' },
    { id: 'cw-4', label: 'Send congratulations + welcome gift to client' },
    { id: 'cw-5', label: 'Request Google/Zillow review from client' },
    { id: 'cw-6', label: 'Add to referral follow-up list (30/90/365 days)' },
  ],
  closed_lost: [
    { id: 'cl-1', label: 'Log loss reason accurately' },
    { id: 'cl-2', label: 'Send professional follow-up email to client' },
    { id: 'cl-3', label: 'Move client to nurture status', description: 'Set follow-up reminder in 30–60 days' },
  ],
};

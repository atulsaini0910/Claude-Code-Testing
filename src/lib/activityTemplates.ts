import type { ActivityType } from '../types';

export interface ActivityTemplate {
  id: string;
  label: string;
  type: ActivityType;
  title: string;
  body: string;
}

export const ACTIVITY_TEMPLATES: ActivityTemplate[] = [
  {
    id: 'first_contact_call',
    label: 'First Contact (Call)',
    type: 'call',
    title: 'Initial consultation call',
    body: 'Introduced myself and discussed client\'s real estate goals. Reviewed budget range, preferred locations, and timeline. Confirmed pre-approval status and next steps.',
  },
  {
    id: 'showing_followup',
    label: 'Showing Follow-up',
    type: 'call',
    title: 'Post-showing follow-up call',
    body: 'Called to get feedback on today\'s showing. Discussed what they liked/disliked. Confirmed interest level and agreed on next steps.',
  },
  {
    id: 'offer_submitted',
    label: 'Offer Submitted',
    type: 'note',
    title: 'Offer submitted',
    body: 'Submitted offer at $[AMOUNT]. Contingencies include inspection and financing. Response expected by [DATE]. Client is aware and waiting.',
  },
  {
    id: 'offer_accepted',
    label: 'Offer Accepted',
    type: 'note',
    title: 'Offer accepted — moving to under contract',
    body: 'Seller accepted our offer at $[AMOUNT]. Earnest money due in [X] days. Inspection scheduled for [DATE]. Title company notified.',
  },
  {
    id: 'inspection_done',
    label: 'Inspection Complete',
    type: 'meeting',
    title: 'Property inspection completed',
    body: 'Inspector found: [ISSUES]. Client review scheduled. Negotiating repair credits of approximately $[AMOUNT]. Deal on track.',
  },
  {
    id: 'checkin_email',
    label: 'Check-in Email',
    type: 'email',
    title: 'Monthly check-in email sent',
    body: 'Sent monthly market update and checked in on their search. Shared 3 new listings matching their criteria. Awaiting response.',
  },
  {
    id: 'closing_reminder',
    label: 'Closing Reminder',
    type: 'email',
    title: 'Closing reminder sent',
    body: 'Closing is scheduled for [DATE] at [TIME]. Sent final checklist: bring photo ID, certified funds, and any remaining documents. Client confirmed attendance.',
  },
  {
    id: 'closed_thankyou',
    label: 'Closed — Thank You',
    type: 'note',
    title: 'Deal closed — thank you sent',
    body: 'Transaction completed successfully. Sent thank-you note and requested a Zillow/Google review. Added to 30/90/365-day follow-up schedule.',
  },
  {
    id: 'nurture_sms',
    label: 'Nurture SMS',
    type: 'sms',
    title: 'Nurture check-in text',
    body: 'Hi [NAME], just wanted to check in — market has been active lately! Let me know if you\'re ready to start looking again. Happy to chat anytime. – [AGENT]',
  },
];

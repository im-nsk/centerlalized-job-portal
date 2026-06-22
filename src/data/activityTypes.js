/** Canonical activity types for company timeline entries */
export const ACTIVITY_TYPES = {
  applied: {
    id: 'applied',
    label: 'Applied',
    color: '#4F6EF7',
    bg: '#EEF2FF',
  },
  referral_requested: {
    id: 'referral_requested',
    label: 'Referral Requested',
    color: '#A855F7',
    bg: '#F5F3FF',
  },
  referral_received: {
    id: 'referral_received',
    label: 'Referral Received',
    color: '#7C3AED',
    bg: '#EDE9FE',
  },
  recruiter_contacted: {
    id: 'recruiter_contacted',
    label: 'Recruiter Contacted',
    color: '#0EA5E9',
    bg: '#E0F2FE',
  },
  followup_sent: {
    id: 'followup_sent',
    label: 'Follow-up Sent',
    color: '#D97706',
    bg: '#FEF3C7',
  },
  followup_scheduled: {
    id: 'followup_scheduled',
    label: 'Follow-up Scheduled',
    color: '#F59E0B',
    bg: '#FFFBEB',
  },
  interview_scheduled: {
    id: 'interview_scheduled',
    label: 'Interview Scheduled',
    color: '#EA580C',
    bg: '#FFEDD5',
  },
  interview_completed: {
    id: 'interview_completed',
    label: 'Interview Completed',
    color: '#C2410C',
    bg: '#FFEDD5',
  },
  offer_received: {
    id: 'offer_received',
    label: 'Offer Received',
    color: '#059669',
    bg: '#D1FAE5',
  },
  rejected: {
    id: 'rejected',
    label: 'Rejected',
    color: '#DC2626',
    bg: '#FEE2E2',
  },
  role_search: {
    id: 'role_search',
    label: 'Role Search',
    color: '#64748B',
    bg: '#F1F5F9',
  },
  custom: {
    id: 'custom',
    label: 'Custom Entry',
    color: '#475569',
    bg: '#F8FAFC',
  },
};

/** Types available in manual entry dropdown (user-facing examples) */
export const MANUAL_ACTIVITY_OPTIONS = [
  'applied',
  'referral_requested',
  'recruiter_contacted',
  'followup_sent',
  'interview_scheduled',
  'interview_completed',
  'offer_received',
  'rejected',
  'custom',
];

export const STATUS_TO_ACTIVITY = {
  applied: 'applied',
  referral_req: 'referral_requested',
  referral_rcvd: 'referral_received',
  interview_sched: 'interview_scheduled',
  interviewing: 'interview_completed',
  offer: 'offer_received',
  rejected: 'rejected',
};

export const REFERRAL_STATUS_TO_ACTIVITY = {
  requested: 'referral_requested',
  received: 'referral_received',
};

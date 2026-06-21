export const STORAGE_KEY = 'jcc_state_v2';

export const STATUSES = [
  { id: 'not_started',     label: 'Not Started',       color: '#9CA3AF', bg: '#F3F4F6' },
  { id: 'applied',         label: 'Applied',           color: '#4F6EF7', bg: '#EEF2FF' },
  { id: 'referral_req',    label: 'Referral Requested',color: '#A855F7', bg: '#F5F3FF' },
  { id: 'referral_rcvd',   label: 'Referral Received', color: '#7C3AED', bg: '#EDE9FE' },
  { id: 'interview_sched', label: 'Interview Scheduled', color: '#D97706', bg: '#FEF3C7' },
  { id: 'interviewing',    label: 'Interviewing',      color: '#EA580C', bg: '#FFEDD5' },
  { id: 'offer',           label: 'Offer',             color: '#059669', bg: '#D1FAE5' },
  { id: 'rejected',        label: 'Rejected',          color: '#DC2626', bg: '#FEE2E2' },
  { id: 'archived',        label: 'Archived',          color: '#6B7280', bg: '#F3F4F6' },
];

export const TIERS = [
  { id: 'tier1', label: 'Tier 1 · Dream',          short: 'T1', accent: '#1F4E79' },
  { id: 'tier2', label: 'Tier 2 · Strong Product', short: 'T2', accent: '#4F6EF7' },
  { id: 'tier3', label: 'Tier 3 · Fast-Growing',   short: 'T3', accent: '#0EA5E9' },
];

export const COMP_TIERS = {
  '$$$$': { label: 'Top-of-market',  range: '₹80L–2Cr+' },
  '$$$':  { label: 'Premium',        range: '₹50L–80L'   },
  '$$':   { label: 'Strong',         range: '₹35L–50L'   },
  '$':    { label: 'Competitive',    range: '₹20L–35L'   },
};

export const ROLE_KEYWORDS = [
  'data engineer', 'senior data engineer', 'analytics engineer', 'ai engineer',
  'machine learning engineer', 'data platform engineer', 'etl developer',
];

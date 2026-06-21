import { STATUSES, TIERS } from '../data/constants.js';

const liPeople = (company, roleQuery) =>
  `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(`"${company}" ${roleQuery}`)}&origin=GLOBAL_SEARCH_HEADER`;

export const liEmployees = (c) =>
  liPeople(c, '("data engineer" OR "senior data engineer" OR "engineering manager" OR "hiring manager")');

export const liRecruiters = (c) =>
  liPeople(c, '("recruiter" OR "talent acquisition" OR "technical recruiter")');

export const getStatus = (id) => STATUSES.find((s) => s.id === id) || STATUSES[0];
export const getTier = (id) => TIERS.find((t) => t.id === id) || TIERS[0];

export const fmtDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const daysSince = (d) => {
  if (!d) return null;
  return Math.floor((Date.now() - new Date(d).getTime()) / (1000 * 60 * 60 * 24));
};

export const todayISO = () => new Date().toISOString().slice(0, 10);

export const cls = (...xs) => xs.filter(Boolean).join(' ');

import { STATUSES, TIERS } from '../data/constants.js';

const FILTERS_KEY = 'jcc_company_filters';

export const DEFAULT_COMPANY_FILTERS = {
  query: '',
  tierFilter: 'all',
  statusFilter: 'all',
  priorityFilter: 'all',
  sortBy: 'priority',
  followUpQueue: false,
  statusGroup: null,
};

export const SORT_LABELS = {
  priority: 'priority score',
  name: 'name',
  recent: 'recently applied',
};

export const PRIORITY_FILTER_OPTIONS = [
  { id: 'all', label: 'All priorities' },
  { id: '70', label: 'Priority 70+' },
  { id: '80', label: 'Priority 80+' },
  { id: '90', label: 'Priority 90+' },
];

/** Dashboard / sidebar one-click presets */
export const COMPANY_FILTER_PRESETS = {
  all: { ...DEFAULT_COMPANY_FILTERS },
  applied: {
    ...DEFAULT_COMPANY_FILTERS,
    statusGroup: 'applied_active',
    sortBy: 'recent',
  },
  interview: {
    ...DEFAULT_COMPANY_FILTERS,
    statusGroup: 'interview',
    sortBy: 'priority',
  },
  followup: {
    ...DEFAULT_COMPANY_FILTERS,
    followUpQueue: true,
    sortBy: 'priority',
  },
  rejected: {
    ...DEFAULT_COMPANY_FILTERS,
    statusFilter: 'rejected',
    sortBy: 'recent',
  },
  offer: {
    ...DEFAULT_COMPANY_FILTERS,
    statusFilter: 'offer',
    sortBy: 'priority',
  },
};

export function loadCompanyFilters() {
  try {
    const raw = localStorage.getItem(FILTERS_KEY);
    if (!raw) return { ...DEFAULT_COMPANY_FILTERS };
    return normalizeCompanyFilters(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_COMPANY_FILTERS };
  }
}

export function saveCompanyFilters(filters) {
  try {
    localStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
  } catch { /* quota / private mode */ }
}

export function normalizeCompanyFilters(raw) {
  return {
    query: typeof raw?.query === 'string' ? raw.query : DEFAULT_COMPANY_FILTERS.query,
    tierFilter: raw?.tierFilter ?? DEFAULT_COMPANY_FILTERS.tierFilter,
    statusFilter: raw?.statusFilter ?? DEFAULT_COMPANY_FILTERS.statusFilter,
    priorityFilter: raw?.priorityFilter ?? DEFAULT_COMPANY_FILTERS.priorityFilter,
    sortBy: raw?.sortBy ?? DEFAULT_COMPANY_FILTERS.sortBy,
    followUpQueue: Boolean(raw?.followUpQueue),
    statusGroup: raw?.statusGroup ?? null,
  };
}

export function isFollowUpDue(company) {
  if (!company.followUpDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return (
    new Date(company.followUpDate) <= today &&
    !['offer', 'rejected', 'archived'].includes(company.status)
  );
}

function matchesStatusGroup(company, group) {
  switch (group) {
    case 'applied_active':
      return !['not_started', 'archived'].includes(company.status);
    case 'interview':
      return ['interview_sched', 'interviewing'].includes(company.status);
    default:
      return true;
  }
}

export function filterCompanies(companies, filters) {
  let result = companies;

  if (filters.followUpQueue) {
    result = result.filter(isFollowUpDue);
  }

  if (filters.tierFilter !== 'all') {
    result = result.filter((c) => c.tier === filters.tierFilter);
  }

  if (filters.statusFilter !== 'all') {
    result = result.filter((c) => c.status === filters.statusFilter);
  }

  if (filters.statusGroup) {
    result = result.filter((c) => matchesStatusGroup(c, filters.statusGroup));
  }

  if (filters.priorityFilter !== 'all') {
    const min = parseInt(filters.priorityFilter, 10);
    if (!Number.isNaN(min)) {
      result = result.filter((c) => c.priorityScore >= min);
    }
  }

  if (filters.query) {
    const q = filters.query.toLowerCase();
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.location || '').toLowerCase().includes(q) ||
        (c.tags || []).some((t) => t.toLowerCase().includes(q)) ||
        (c.notes || '').toLowerCase().includes(q)
    );
  }

  if (filters.sortBy === 'priority') {
    result = [...result].sort((a, b) => b.priorityScore - a.priorityScore);
  } else if (filters.sortBy === 'name') {
    result = [...result].sort((a, b) => a.name.localeCompare(b.name));
  } else if (filters.sortBy === 'recent') {
    result = [...result].sort((a, b) =>
      (b.appliedDate || '').localeCompare(a.appliedDate || '')
    );
  }

  return result;
}

export function hasActiveFilters(filters) {
  return (
    Boolean(filters.query) ||
    filters.tierFilter !== 'all' ||
    filters.statusFilter !== 'all' ||
    filters.priorityFilter !== 'all' ||
    filters.followUpQueue ||
    Boolean(filters.statusGroup)
  );
}

export function getFilterSummary(filters) {
  const parts = [];
  if (filters.followUpQueue) parts.push('Follow-up queue');
  if (filters.statusGroup === 'applied_active') parts.push('Applied');
  if (filters.statusGroup === 'interview') parts.push('Interviews');
  if (filters.statusFilter !== 'all' && !filters.statusGroup) {
    const s = STATUSES.find((x) => x.id === filters.statusFilter);
    parts.push(s?.label || filters.statusFilter);
  }
  if (filters.tierFilter !== 'all') {
    const t = TIERS.find((x) => x.id === filters.tierFilter);
    parts.push(t?.label || filters.tierFilter);
  }
  if (filters.priorityFilter !== 'all') parts.push(`P${filters.priorityFilter}+`);
  if (filters.query) parts.push(`"${filters.query}"`);
  return parts;
}

export function buildRecentActivity(companies, limit = 10) {
  const items = [];

  companies.forEach((c) => {
    const log = c.activityLog || [];
    if (log.length) {
      log.forEach((entry) => {
        items.push({
          id: entry.id,
          company: c,
          type: entry.type,
          date: entry.date,
          label: entry.title,
          note: entry.note,
        });
      });
      return;
    }

    // Legacy fallback when no activity log
    if (c.appliedDate) {
      items.push({
        id: `${c.id}-applied`,
        company: c,
        type: 'applied',
        date: c.appliedDate,
        label: 'Applied',
      });
    }
    if (c.followUpDate) {
      items.push({
        id: `${c.id}-followup`,
        company: c,
        type: 'followup',
        date: c.followUpDate,
        label: isFollowUpDue(c) ? 'Follow-up due' : 'Follow-up scheduled',
      });
    }
    if (c.roleSearch?.lastCheckedAt) {
      items.push({
        id: `${c.id}-search`,
        company: c,
        type: 'search',
        date: c.roleSearch.lastCheckedAt.slice(0, 10),
        label: 'Role search',
      });
    }
  });

  return items
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
}

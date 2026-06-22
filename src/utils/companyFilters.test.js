import { describe, it, expect, beforeEach } from 'vitest';
import {
  DEFAULT_COMPANY_FILTERS,
  loadCompanyFilters,
  filterCompanies,
  hasActiveFilters,
  isFollowUpDue,
  COMPANY_FILTER_PRESETS,
} from './companyFilters.js';

const sampleCompanies = [
  { id: '1', name: 'A', tier: 'tier1', status: 'applied', priorityScore: 85, followUpDate: '2020-01-01', appliedDate: '2025-01-01' },
  { id: '2', name: 'B', tier: 'tier2', status: 'interviewing', priorityScore: 70, followUpDate: null, appliedDate: '2025-02-01' },
  { id: '3', name: 'C', tier: 'tier1', status: 'rejected', priorityScore: 90, followUpDate: null, appliedDate: null },
  { id: '4', name: 'D', tier: 'tier3', status: 'not_started', priorityScore: 60, followUpDate: null, appliedDate: null },
];

describe('filterCompanies', () => {
  it('filters by status preset rejected', () => {
    const result = filterCompanies(sampleCompanies, COMPANY_FILTER_PRESETS.rejected);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('3');
  });

  it('filters by priority minimum', () => {
    const result = filterCompanies(sampleCompanies, { ...DEFAULT_COMPANY_FILTERS, priorityFilter: '80' });
    expect(result.map((c) => c.id)).toEqual(['3', '1']);
  });

  it('filters follow-up queue', () => {
    const result = filterCompanies(sampleCompanies, COMPANY_FILTER_PRESETS.followup);
    expect(result.some((c) => c.id === '1')).toBe(true);
  });

  it('filters applied active group', () => {
    const result = filterCompanies(sampleCompanies, COMPANY_FILTER_PRESETS.applied);
    expect(result.find((c) => c.id === '4')).toBeUndefined();
    expect(result.length).toBe(3);
  });
});

describe('hasActiveFilters', () => {
  it('returns false for defaults', () => {
    expect(hasActiveFilters(DEFAULT_COMPANY_FILTERS)).toBe(false);
  });

  it('returns true when query set', () => {
    expect(hasActiveFilters({ ...DEFAULT_COMPANY_FILTERS, query: 'x' })).toBe(true);
  });
});

describe('isFollowUpDue', () => {
  it('detects overdue follow-ups', () => {
    expect(isFollowUpDue(sampleCompanies[0])).toBe(true);
  });

  it('ignores rejected companies', () => {
    expect(isFollowUpDue({ ...sampleCompanies[0], status: 'rejected' })).toBe(false);
  });
});

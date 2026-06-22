import { describe, it, expect } from 'vitest';
import {
  createActivityEntry,
  mergeCompanyWithActivity,
  addManualActivity,
  backfillActivityLog,
  sortActivitiesNewestFirst,
} from './activityLog.js';

const baseCompany = {
  id: 'test',
  name: 'Test Co',
  status: 'not_started',
  appliedDate: null,
  followUpDate: null,
  referralStatus: 'none',
  activityLog: [],
  roleSearch: {},
};

describe('activityLog', () => {
  it('logs activity on status change to applied', () => {
    const next = mergeCompanyWithActivity(baseCompany, {
      status: 'applied',
      appliedDate: '2025-06-01',
    });
    expect(next.activityLog).toHaveLength(1);
    expect(next.activityLog[0].type).toBe('applied');
  });

  it('logs referral requested on referral status change', () => {
    const next = mergeCompanyWithActivity(
      { ...baseCompany, status: 'applied', appliedDate: '2025-06-01' },
      { referralStatus: 'requested' }
    );
    expect(next.activityLog.some((a) => a.type === 'referral_requested')).toBe(true);
  });

  it('adds manual entries', () => {
    const next = addManualActivity(baseCompany, {
      type: 'followup_sent',
      note: 'Emailed recruiter',
      date: '2025-06-05',
    });
    expect(next.activityLog).toHaveLength(1);
    expect(next.activityLog[0].manual).toBe(true);
    expect(next.activityLog[0].note).toBe('Emailed recruiter');
  });

  it('sorts newest first', () => {
    const sorted = sortActivitiesNewestFirst([
      createActivityEntry('applied', { date: '2025-01-01' }),
      createActivityEntry('offer_received', { date: '2025-06-01' }),
    ]);
    expect(sorted[0].type).toBe('offer_received');
  });

  it('backfills from legacy fields', () => {
    const log = backfillActivityLog({
      ...baseCompany,
      status: 'interview_sched',
      appliedDate: '2025-05-01',
      followUpDate: '2025-06-10',
    });
    expect(log.length).toBeGreaterThan(0);
    expect(log.some((a) => a.type === 'applied')).toBe(true);
  });
});

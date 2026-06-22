import {
  ACTIVITY_TYPES,
  STATUS_TO_ACTIVITY,
  REFERRAL_STATUS_TO_ACTIVITY,
} from '../data/activityTypes.js';
import { todayISO } from './helpers.js';

export function createActivityId() {
  return `act_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function createActivityEntry(type, { note = '', date, manual = false } = {}) {
  const meta = ACTIVITY_TYPES[type] || ACTIVITY_TYPES.custom;
  const occurredAt = date || todayISO();
  return {
    id: createActivityId(),
    type,
    title: meta.label,
    note: note.trim(),
    date: occurredAt.length > 10 ? occurredAt.slice(0, 10) : occurredAt,
    createdAt: new Date().toISOString(),
    manual,
  };
}

export function sortActivitiesNewestFirst(activities) {
  return [...(activities || [])].sort((a, b) => {
    const dateCmp = (b.date || '').localeCompare(a.date || '');
    if (dateCmp !== 0) return dateCmp;
    return (b.createdAt || '').localeCompare(a.createdAt || '');
  });
}

export function getActivityMeta(type) {
  return ACTIVITY_TYPES[type] || ACTIVITY_TYPES.custom;
}

/** Backfill timeline from legacy fields when activityLog is empty */
export function backfillActivityLog(company) {
  if (company.activityLog?.length) return company.activityLog;

  const entries = [];

  if (company.appliedDate) {
    entries.push(createActivityEntry('applied', {
      date: company.appliedDate,
      note: 'Imported from existing application date',
    }));
  }

  const statusType = STATUS_TO_ACTIVITY[company.status];
  if (
    statusType &&
    company.status !== 'not_started' &&
    company.status !== 'applied'
  ) {
    entries.push(createActivityEntry(statusType, {
      date: company.appliedDate || todayISO(),
      note: 'Imported from current status',
    }));
  }

  if (company.referralStatus === 'requested') {
    entries.push(createActivityEntry('referral_requested', {
      date: company.appliedDate || todayISO(),
      note: 'Imported from referral status',
    }));
  }
  if (company.referralStatus === 'received') {
    entries.push(createActivityEntry('referral_received', {
      date: company.appliedDate || todayISO(),
      note: 'Imported from referral status',
    }));
  }

  if (company.followUpDate) {
    entries.push(createActivityEntry('followup_scheduled', {
      date: company.followUpDate,
      note: 'Imported from follow-up date',
    }));
  }

  if (company.roleSearch?.lastCheckedAt) {
    entries.push(createActivityEntry('role_search', {
      date: company.roleSearch.lastCheckedAt.slice(0, 10),
      note: company.roleSearch.topRole || '',
    }));
  }

  return sortActivitiesNewestFirst(entries);
}

/**
 * Apply a company patch and append auto-detected activity entries.
 */
export function mergeCompanyWithActivity(company, patch) {
  const next = { ...company, ...patch };
  const pending = [];

  const pushUnique = (type, opts = {}) => {
    if (!type) return;
    pending.push(createActivityEntry(type, opts));
  };

  if (patch.status !== undefined && patch.status !== company.status) {
    pushUnique(STATUS_TO_ACTIVITY[patch.status], {
      date: patch.appliedDate || company.appliedDate || todayISO(),
    });
  }

  if (
    patch.appliedDate &&
    patch.appliedDate !== company.appliedDate &&
    patch.status === undefined &&
    company.status !== 'applied'
  ) {
    pushUnique('applied', { date: patch.appliedDate });
  }

  if (
    patch.followUpDate !== undefined &&
    patch.followUpDate !== company.followUpDate &&
    patch.followUpDate
  ) {
    pushUnique('followup_scheduled', { date: patch.followUpDate });
  }

  if (
    patch.referralStatus !== undefined &&
    patch.referralStatus !== company.referralStatus
  ) {
    pushUnique(REFERRAL_STATUS_TO_ACTIVITY[patch.referralStatus]);
  }

  if (
    patch.roleSearch?.lastCheckedAt &&
    patch.roleSearch.lastCheckedAt !== company.roleSearch?.lastCheckedAt
  ) {
    pushUnique('role_search', {
      date: patch.roleSearch.lastCheckedAt.slice(0, 10),
      note: [
        patch.roleSearch.topRole,
        patch.roleSearch.matchCount != null ? `${patch.roleSearch.matchCount} roles` : null,
      ].filter(Boolean).join(' · '),
    });
  }

  if (pending.length) {
    next.activityLog = sortActivitiesNewestFirst([
      ...(company.activityLog || []),
      ...pending,
    ]);
  }

  return next;
}

export function addManualActivity(company, { type, note, date }) {
  const entry = createActivityEntry(type, {
    note,
    date: date || todayISO(),
    manual: true,
  });
  return {
    ...company,
    activityLog: sortActivitiesNewestFirst([...(company.activityLog || []), entry]),
  };
}

export function removeActivity(company, activityId) {
  return {
    ...company,
    activityLog: (company.activityLog || []).filter((a) => a.id !== activityId),
  };
}

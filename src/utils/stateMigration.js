import { STORAGE_KEY } from '../data/constants.js';
import { SEED_COMPANIES, buildCompany, defaultState } from '../data/companies.js';
import { DEFAULT_SEARCH_PREFERENCES, DEFAULT_ROLE_SEARCH_META } from '../data/roles.js';
import { backfillActivityLog } from './activityLog.js';

const MIGRATION_FLAG = 'jcc_supabase_migrated';

/** Normalize + migrate loaded state to current schema (v3). */
export function normalizeState(raw) {
  const parsed = { ...raw };

  if (!parsed.companies || !Array.isArray(parsed.companies)) {
    return defaultState();
  }

  const existing = new Set(parsed.companies.map((c) => c.id));
  SEED_COMPANIES.forEach((c) => {
    if (!existing.has(c.id)) parsed.companies.push(buildCompany(c));
  });

  parsed.companies = parsed.companies.map((c) => ({
    ...c,
    roleSearch: { ...DEFAULT_ROLE_SEARCH_META, ...(c.roleSearch || {}) },
    activityLog: backfillActivityLog({ ...c, activityLog: c.activityLog || [] }),
  }));

  parsed.searchPreferences = {
    ...DEFAULT_SEARCH_PREFERENCES,
    ...(parsed.searchPreferences || {}),
  };

  if (!parsed.tags) parsed.tags = defaultState().tags;
  if (!parsed.starStories) parsed.starStories = defaultState().starStories;
  if (!parsed.templates) parsed.templates = defaultState().templates;
  if (!parsed.customGroups) parsed.customGroups = [];

  parsed.schemaVersion = 4;
  return parsed;
}

export function isProfileStateEmpty(state) {
  return !state?.companies?.length;
}

/** Read legacy localStorage blob (pre-Supabase). */
export function readLocalState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return normalizeState(JSON.parse(raw));
  } catch (e) {
    console.error('Failed to read local state', e);
    return null;
  }
}

/** Mark local data as migrated; remove legacy key to avoid re-import. */
export function markLocalStateMigrated() {
  try {
    localStorage.setItem(MIGRATION_FLAG, new Date().toISOString());
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to mark migration', e);
  }
}

/**
 * Resolve initial state for a new or empty Supabase profile.
 * Priority: existing Supabase state → localStorage migration → defaults.
 */
export function resolveInitialState(supabaseState) {
  if (supabaseState && !isProfileStateEmpty(supabaseState)) {
    return normalizeState(supabaseState);
  }

  const local = readLocalState();
  if (local && !isProfileStateEmpty(local)) {
    markLocalStateMigrated();
    return local;
  }

  return defaultState();
}

import { useState, useEffect, useRef } from 'react';
import { STORAGE_KEY } from '../data/constants.js';
import { SEED_COMPANIES, buildCompany, defaultState } from '../data/companies.js';
import { DEFAULT_SEARCH_PREFERENCES, DEFAULT_ROLE_SEARCH_META } from '../data/roles.js';

export function useStorage() {
  const [state, setState] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const saveTimer = useRef(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const existing = new Set(parsed.companies.map((c) => c.id));
        SEED_COMPANIES.forEach((c) => {
          if (!existing.has(c.id)) parsed.companies.push(buildCompany(c));
        });
        // v3: role search preferences + per-company roleSearch meta
        parsed.companies = parsed.companies.map((c) => ({
          ...c,
          roleSearch: { ...DEFAULT_ROLE_SEARCH_META, ...(c.roleSearch || {}) },
        }));
        parsed.searchPreferences = {
          ...DEFAULT_SEARCH_PREFERENCES,
          ...(parsed.searchPreferences || {}),
        };
        parsed.schemaVersion = 3;
        setState(parsed);
      } else {
        setState(defaultState());
      }
    } catch (e) {
      console.error('Load failed', e);
      setState(defaultState());
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded || !state) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.error('Save failed', e);
      }
    }, 300);
  }, [state, loaded]);

  return [state, setState, loaded];
}

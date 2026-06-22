import { useState, useEffect, useCallback } from 'react';
import {
  DEFAULT_COMPANY_FILTERS,
  COMPANY_FILTER_PRESETS,
  loadCompanyFilters,
  saveCompanyFilters,
  normalizeCompanyFilters,
} from '../utils/companyFilters.js';

export function useCompanyFilters() {
  const [filters, setFiltersState] = useState(() => loadCompanyFilters());

  useEffect(() => {
    saveCompanyFilters(filters);
  }, [filters]);

  const setFilters = useCallback((updater) => {
    setFiltersState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      return normalizeCompanyFilters(next);
    });
  }, []);

  const applyPreset = useCallback((presetKey) => {
    const preset = COMPANY_FILTER_PRESETS[presetKey];
    if (preset) setFiltersState(normalizeCompanyFilters({ ...preset }));
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState({ ...DEFAULT_COMPANY_FILTERS });
  }, []);

  const patchFilters = useCallback((patch) => {
    setFiltersState((prev) => normalizeCompanyFilters({ ...prev, ...patch }));
  }, []);

  return { filters, setFilters, applyPreset, clearFilters, patchFilters };
}

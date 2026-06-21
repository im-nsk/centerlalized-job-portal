/** Role taxonomy for intelligent multi-title career search */

export const ROLE_FOCUS_OPTIONS = [
  { id: 'data_engineering', label: 'Data Engineering' },
  { id: 'ai_engineering', label: 'AI Engineering' },
  { id: 'data_plus_ai', label: 'Data + AI' },
  { id: 'all_roles', label: 'All Roles' },
];

export const DATA_ENGINEERING_ROLES = [
  'Data Engineer',
  'Senior Data Engineer',
  'Staff Data Engineer',
  'Lead Data Engineer',
  'Principal Data Engineer',
  'Analytics Engineer',
  'Data Platform Engineer',
  'Data Infrastructure Engineer',
  'Data Integration Engineer',
  'ETL Developer',
  'Big Data Engineer',
  'Data Warehouse Engineer',
  'Pipeline Engineer',
  'Data Ops Engineer',
  'Streaming Data Engineer',
  'Lakehouse Engineer',
];

export const AI_ENGINEERING_ROLES = [
  'AI Engineer',
  'Applied AI Engineer',
  'AI Platform Engineer',
  'GenAI Engineer',
  'LLM Engineer',
  'Machine Learning Engineer',
  'ML Platform Engineer',
  'AI Infrastructure Engineer',
  'AI Solutions Engineer',
  'MLOps Engineer',
  'Applied Scientist',
  'Research Engineer',
];

export const DATA_PLUS_AI_ROLES = [
  'Data + AI Engineer',
  'AI Data Engineer',
  'ML Data Engineer',
  'AI/ML Engineer',
  'Data Science Engineer',
  'Intelligent Systems Engineer',
];

export const CLOUD_PLATFORM_ROLES = [
  'Platform Engineer',
  'Cloud Data Engineer',
  'Data Systems Engineer',
  'Infrastructure Engineer',
  'Distributed Systems Engineer',
];

/** Smart Search Mode — broad OR query (user-specified core set) */
export const SMART_SEARCH_ROLES = [
  'Data Engineer',
  'Analytics Engineer',
  'AI Engineer',
  'Machine Learning Engineer',
  'Data Platform Engineer',
  'ETL Engineer',
];

/**
 * Profile-priority order: first match wins when detecting "most relevant role"
 * (Data + AI Engineer @ IBM — senior data / AI infra lean)
 */
export const PROFILE_ROLE_PRIORITY = [
  'Senior Data Engineer',
  'Staff Data Engineer',
  'Data Engineer',
  'AI Data Engineer',
  'Data + AI Engineer',
  'AI Engineer',
  'Applied AI Engineer',
  'Analytics Engineer',
  'Data Platform Engineer',
  'Machine Learning Engineer',
  'ML Platform Engineer',
  'GenAI Engineer',
  'LLM Engineer',
  'Lead Data Engineer',
  'Principal Data Engineer',
  'Data Infrastructure Engineer',
  'Big Data Engineer',
  'ETL Developer',
  'ETL Engineer',
  'Data Warehouse Engineer',
  'Cloud Data Engineer',
  'AI Platform Engineer',
  'Staff Data Engineer',
  'Platform Engineer',
];

export function getRolesForFocus(focusId) {
  switch (focusId) {
    case 'data_engineering':
      return [...DATA_ENGINEERING_ROLES];
    case 'ai_engineering':
      return [...AI_ENGINEERING_ROLES];
    case 'data_plus_ai':
      return [...DATA_ENGINEERING_ROLES, ...AI_ENGINEERING_ROLES, ...DATA_PLUS_AI_ROLES];
    case 'all_roles':
    default:
      return [
        ...DATA_ENGINEERING_ROLES,
        ...AI_ENGINEERING_ROLES,
        ...DATA_PLUS_AI_ROLES,
        ...CLOUD_PLATFORM_ROLES,
      ];
  }
}

export function getActiveSearchRoles(focusId, smartSearchMode) {
  if (smartSearchMode) return [...SMART_SEARCH_ROLES];
  return getRolesForFocus(focusId);
}

export const DEFAULT_SEARCH_PREFERENCES = {
  roleFocus: 'data_plus_ai',
  smartSearchMode: true,
};

export const DEFAULT_ROLE_SEARCH_META = {
  lastCheckedAt: null,
  matchCount: null,
  topRole: null,
  termsSearched: 0,
  lastQuery: null,
};

import {
  getActiveSearchRoles,
  PROFILE_ROLE_PRIORITY,
  SMART_SEARCH_ROLES,
} from '../data/roles.js';
import { openExternalUrl } from './externalNav.js';

const QUERY_PARAM_NAMES = [
  'q', 'query', 'keywords', 'search', 'base_query', 'jobsearch', '_search',
];

const TITLE_MATCH_RE = /engineer|developer|scientist|architect|analyst|platform|infrastructure|integration|warehouse|pipeline|mlops|etl|big data|data/i;

/** Build OR query string for career portals */
export function buildOrQuery(terms, { compact = false } = {}) {
  const unique = [...new Set(terms.map((t) => t.trim()).filter(Boolean))];
  if (compact && unique.length > 6) {
    // Some ATS limits query length — use smart subset
    return unique.slice(0, 6).map((t) => `"${t}"`).join(' OR ');
  }
  return unique.map((t) => `"${t}"`).join(' OR ');
}

export function buildSmartOrQuery() {
  return buildOrQuery(SMART_SEARCH_ROLES);
}

function detectQueryParam(url) {
  for (const name of QUERY_PARAM_NAMES) {
    if (url.searchParams.has(name)) return name;
  }
  if (url.hostname.includes('amazon.jobs')) return 'base_query';
  if (url.hostname.includes('metacareers.com')) return 'q';
  if (url.hostname.includes('google.com')) return 'q';
  if (url.pathname.includes('search-jobs')) return null; // path-based (Intuit)
  return 'q';
}

function applyIntuitPath(url, query) {
  const slug = query.replace(/"/g, '').split(' OR ')[0].trim().replace(/\s+/g, '%20');
  const base = url.origin + url.pathname.replace(/\/[^/]*$/, '');
  return `${base}/${encodeURIComponent(slug)}/India${url.search}`;
}

/** Company-specific URL rewriting for known ATS patterns */
export function buildCareerSearchUrl(company, preferences) {
  const { roleFocus, smartSearchMode } = preferences;
  const terms = getActiveSearchRoles(roleFocus, smartSearchMode);
  const query = smartSearchMode ? buildSmartOrQuery() : buildOrQuery(terms);
  const raw = company.careerUrl;

  if (!raw) return { url: null, query, terms };

  try {
    const url = new URL(raw);

    // Intuit: /search-jobs/{term}/India
    if (url.hostname.includes('intuit.com') && url.pathname.includes('search-jobs')) {
      return { url: applyIntuitPath(url, query), query, terms };
    }

    // Cisco: path segment search term
    if (url.hostname.includes('jobs.cisco.com') && url.pathname.includes('SearchJobs')) {
      const primary = terms[0].replace(/\s+/g, '%20');
      const path = url.pathname.replace(/SearchJobs\/[^?]*/, `SearchJobs/${primary}`);
      url.pathname = path;
      return { url: url.toString(), query, terms };
    }

    const param = detectQueryParam(url);
    if (param) {
      const value = url.hostname.includes('amazon.jobs')
        ? query.replace(/"/g, '').replace(/ OR /g, ' OR ')
        : query;
      url.searchParams.set(param, value);
      return { url: url.toString(), query, terms };
    }

    // No existing param — append best guess
    url.searchParams.set('q', query);
    return { url: url.toString(), query, terms };
  } catch {
    const sep = raw.includes('?') ? '&' : '?';
    const encoded = encodeURIComponent(query);
    return { url: `${raw}${sep}q=${encoded}`, query, terms };
  }
}

function titleMatchesAny(title, terms) {
  const lower = title.toLowerCase();
  return terms.some((term) => lower.includes(term.toLowerCase()));
}

export function detectTopRoleFromTitles(titles, terms) {
  const lowerTitles = titles.map((t) => t.toLowerCase());
  for (const preferred of PROFILE_ROLE_PRIORITY) {
    if (!terms.some((t) => t.toLowerCase() === preferred.toLowerCase())) continue;
    const hit = titles.find((t) => t.toLowerCase().includes(preferred.toLowerCase()));
    if (hit) return preferred;
  }
  for (const term of terms) {
    const hit = titles.find((t) => t.toLowerCase().includes(term.toLowerCase()));
    if (hit) return term;
  }
  return titles[0] || terms[0] || null;
}

function extractLeverSlug(careerUrl) {
  const m = careerUrl.match(/jobs\.lever\.co\/([^/?]+)/);
  return m?.[1] ?? null;
}

function extractGreenhouseBoard(careerUrl) {
  const m = careerUrl.match(/boards\.greenhouse\.io\/([^/?]+)/)
    || careerUrl.match(/grnh\.se\/([^/?]+)/);
  return m?.[1] ?? null;
}

async function fetchLeverMatches(slug, terms) {
  const res = await fetch(`https://api.lever.co/v0/postings/${slug}?mode=json`);
  if (!res.ok) return null;
  const jobs = await res.json();
  const matching = jobs.filter((j) => titleMatchesAny(j.text, terms));
  const titles = matching.map((j) => j.text);
  return {
    matchCount: matching.length,
    topRole: detectTopRoleFromTitles(titles, terms),
  };
}

async function fetchGreenhouseMatches(board, terms) {
  const res = await fetch(`https://boards-api.greenhouse.io/v1/boards/${board}/jobs?content=true`);
  if (!res.ok) return null;
  const data = await res.json();
  const jobs = data.jobs || [];
  const matching = jobs.filter((j) => titleMatchesAny(j.title, terms));
  const titles = matching.map((j) => j.title);
  return {
    matchCount: matching.length,
    topRole: detectTopRoleFromTitles(titles, terms),
  };
}

async function fetchAshbyMatches(org, terms) {
  const res = await fetch(`https://api.ashbyhq.com/posting-api/job-board/${org}`);
  if (!res.ok) return null;
  const data = await res.json();
  const jobs = data.jobs || [];
  const matching = jobs.filter((j) => titleMatchesAny(j.title, terms));
  const titles = matching.map((j) => j.title);
  return {
    matchCount: matching.length,
    topRole: detectTopRoleFromTitles(titles, terms),
  };
}

function extractAshbyOrg(url) {
  const m = url.match(/jobs\.ashbyhq\.com\/([^/?]+)/);
  return m?.[1] ?? null;
}

/**
 * Attempt live job count via public ATS APIs where available.
 * Returns null matchCount when the portal can't be queried client-side.
 */
export async function fetchRoleMatches(company, preferences) {
  const terms = getActiveSearchRoles(preferences.roleFocus, preferences.smartSearchMode);
  const url = company.careerUrl || '';

  const leverSlug = extractLeverSlug(url);
  if (leverSlug) {
    try {
      return await fetchLeverMatches(leverSlug, terms);
    } catch { /* fall through */ }
  }

  const ghBoard = extractGreenhouseBoard(url);
  if (ghBoard) {
    try {
      return await fetchGreenhouseMatches(ghBoard, terms);
    } catch { /* fall through */ }
  }

  const ashbyOrg = extractAshbyOrg(url);
  if (ashbyOrg) {
    try {
      return await fetchAshbyMatches(ashbyOrg, terms);
    } catch { /* fall through */ }
  }

  return {
    matchCount: null,
    topRole: terms[0] || null,
  };
}

export async function openSmartCareerSearch(company, preferences) {
  const { url, query, terms } = buildCareerSearchUrl(company, preferences);
  if (!url) return null;

  const apiResult = await fetchRoleMatches(company, preferences);

  const meta = {
    lastCheckedAt: new Date().toISOString(),
    matchCount: apiResult?.matchCount ?? null,
    topRole: apiResult?.topRole ?? terms[0] ?? null,
    termsSearched: terms.length,
    lastQuery: query,
  };

  openExternalUrl(url);
  return meta;
}

export function formatLastChecked(iso) {
  if (!iso) return 'Never checked';
  const d = new Date(iso);
  const diffMs = Date.now() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

export function formatRoleSearchSummary(roleSearch, smartSearchMode) {
  if (!roleSearch?.lastCheckedAt) {
    return smartSearchMode ? 'Smart search ready' : 'Multi-role search ready';
  }
  const countLabel = roleSearch.matchCount != null
    ? `${roleSearch.matchCount} match${roleSearch.matchCount !== 1 ? 'es' : ''}`
    : `${roleSearch.termsSearched || 0} titles`;
  return countLabel;
}

/** Heuristic title normalizer for equivalent titles found on job boards */
export function normalizeJobTitle(title) {
  if (!title || !TITLE_MATCH_RE.test(title)) return null;
  const t = title.toLowerCase();
  if (t.includes('analytics') && t.includes('engineer')) return 'Analytics Engineer';
  if (t.includes('machine learning') || t.includes('ml engineer')) return 'Machine Learning Engineer';
  if (t.includes('genai') || t.includes('gen ai')) return 'GenAI Engineer';
  if (t.includes('llm')) return 'LLM Engineer';
  if (t.includes('etl')) return 'ETL Developer';
  if (t.includes('warehouse')) return 'Data Warehouse Engineer';
  if (t.includes('platform') && t.includes('data')) return 'Data Platform Engineer';
  if (t.includes('platform') && (t.includes('ml') || t.includes('ai'))) return 'AI Platform Engineer';
  if (t.includes('ai') && t.includes('data')) return 'AI Data Engineer';
  if (t.includes('applied ai')) return 'Applied AI Engineer';
  if (t.includes('staff') && t.includes('data')) return 'Staff Data Engineer';
  if (t.includes('senior') && t.includes('data')) return 'Senior Data Engineer';
  if (t.includes('principal') && t.includes('data')) return 'Principal Data Engineer';
  if (t.includes('lead') && t.includes('data')) return 'Lead Data Engineer';
  if (t.includes('ai engineer')) return 'AI Engineer';
  if (t.includes('data engineer')) return 'Data Engineer';
  return title;
}

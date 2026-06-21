import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  LayoutDashboard, Building2, KanbanSquare, GraduationCap, MessageSquareText, Settings as SettingsIcon,
  Search, Plus, ExternalLink, Users, UserSearch, FileText, Calendar, ChevronDown, ChevronRight,
  X, Edit3, Trash2, MoreVertical, Filter, Download, Upload, Star, TrendingUp, Clock, Target,
  Briefcase, CheckCircle2, AlertCircle, Tag, Bell, Archive, ArrowUpRight, Copy, Check,
  Sparkles, Zap, BookOpen, Send, RefreshCw, ChevronLeft, MapPin, DollarSign, Hash, Layers,
  ListChecks, GripVertical, CircleDot, ArrowRight, Inbox, Activity
} from 'lucide-react';
import * as XLSX from 'xlsx';

/* ============================================================================
   CONSTANTS & SEED DATA
   ========================================================================== */

const STORAGE_KEY = 'jcc_state_v2';

const STATUSES = [
  { id: 'not_started',     label: 'Not Started',       color: '#9CA3AF', bg: '#F3F4F6' },
  { id: 'applied',         label: 'Applied',           color: '#4F6EF7', bg: '#EEF2FF' },
  { id: 'referral_req',    label: 'Referral Requested',color: '#A855F7', bg: '#F5F3FF' },
  { id: 'referral_rcvd',   label: 'Referral Received', color: '#7C3AED', bg: '#EDE9FE' },
  { id: 'interview_sched', label: 'Interview Scheduled', color: '#D97706', bg: '#FEF3C7' },
  { id: 'interviewing',    label: 'Interviewing',      color: '#EA580C', bg: '#FFEDD5' },
  { id: 'offer',           label: 'Offer',             color: '#059669', bg: '#D1FAE5' },
  { id: 'rejected',        label: 'Rejected',          color: '#DC2626', bg: '#FEE2E2' },
  { id: 'archived',        label: 'Archived',          color: '#6B7280', bg: '#F3F4F6' },
];

const TIERS = [
  { id: 'tier1', label: 'Tier 1 · Dream',          short: 'T1', accent: '#1F4E79' },
  { id: 'tier2', label: 'Tier 2 · Strong Product', short: 'T2', accent: '#4F6EF7' },
  { id: 'tier3', label: 'Tier 3 · Fast-Growing',   short: 'T3', accent: '#0EA5E9' },
];

const COMP_TIERS = {
  '$$$$': { label: 'Top-of-market',  range: '₹80L–2Cr+' },
  '$$$':  { label: 'Premium',        range: '₹50L–80L'   },
  '$$':   { label: 'Strong',         range: '₹35L–50L'   },
  '$':    { label: 'Competitive',    range: '₹20L–35L'   },
};

// Search keywords aligned to the user's profile (Data + AI Engineer)
const ROLE_KEYWORDS = ['data engineer', 'senior data engineer', 'ai engineer', 'analytics engineer', 'machine learning engineer'];

// LinkedIn search helpers
const liPeople = (company, roleQuery) =>
  `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(`"${company}" ${roleQuery}`)}&origin=GLOBAL_SEARCH_HEADER`;

const liEmployees   = (c) => liPeople(c, '("data engineer" OR "senior data engineer" OR "engineering manager" OR "hiring manager")');
const liRecruiters  = (c) => liPeople(c, '("recruiter" OR "talent acquisition" OR "technical recruiter")');

// Curated company database (50+ companies, real career portal URLs with role pre-filters where possible)
const SEED_COMPANIES = [
  /* TIER 1 — Dream */
  { id:'google',     name:'Google',         tier:'tier1', compTier:'$$$$', priorityScore:96, location:'Bengaluru · Hyderabad', careerUrl:'https://www.google.com/about/careers/applications/jobs/results/?q=%22data%20engineer%22&location=India' },
  { id:'meta',       name:'Meta',           tier:'tier1', compTier:'$$$$', priorityScore:94, location:'Bengaluru',             careerUrl:'https://www.metacareers.com/jobs?q=data%20engineer&offices[0]=Bengaluru%2C%20India' },
  { id:'microsoft',  name:'Microsoft',      tier:'tier1', compTier:'$$$$', priorityScore:93, location:'Hyderabad · Bengaluru', careerUrl:'https://jobs.careers.microsoft.com/global/en/search?lc=India&q=data%20engineer' },
  { id:'amazon',     name:'Amazon',         tier:'tier1', compTier:'$$$$', priorityScore:90, location:'Bengaluru · Hyderabad', careerUrl:'https://www.amazon.jobs/en/search?base_query=data+engineer&loc_query=India&country=IND' },
  { id:'apple',      name:'Apple',          tier:'tier1', compTier:'$$$$', priorityScore:92, location:'Hyderabad · Bengaluru', careerUrl:'https://jobs.apple.com/en-in/search?search=data%20engineer' },
  { id:'netflix',    name:'Netflix',        tier:'tier1', compTier:'$$$$', priorityScore:88, location:'Remote · Mumbai',       careerUrl:'https://explore.jobs.netflix.net/careers?query=data%20engineer&location=India' },
  { id:'linkedin',   name:'LinkedIn',       tier:'tier1', compTier:'$$$$', priorityScore:89, location:'Bengaluru',             careerUrl:'https://careers.linkedin.com/jobs/search?keywords=data%20engineer&location=India' },
  { id:'databricks', name:'Databricks',     tier:'tier1', compTier:'$$$$', priorityScore:95, location:'Bengaluru',             careerUrl:'https://www.databricks.com/company/careers/open-positions?search=data+engineer&location=India' },
  { id:'snowflake',  name:'Snowflake',      tier:'tier1', compTier:'$$$$', priorityScore:93, location:'Pune · Bengaluru',      careerUrl:'https://careers.snowflake.com/us/en/search-results?keywords=data%20engineer' },
  { id:'palantir',   name:'Palantir',       tier:'tier1', compTier:'$$$$', priorityScore:94, location:'Remote · London hub',   careerUrl:'https://jobs.lever.co/palantir?team=Engineering' },
  { id:'stripe',     name:'Stripe',         tier:'tier1', compTier:'$$$$', priorityScore:91, location:'Bengaluru',             careerUrl:'https://stripe.com/jobs/search?l=in-india&q=data' },
  { id:'adobe',      name:'Adobe',          tier:'tier1', compTier:'$$$',  priorityScore:85, location:'Noida · Bengaluru',     careerUrl:'https://careers.adobe.com/us/en/search-results?keywords=data%20engineer&location=India' },
  { id:'atlassian',  name:'Atlassian',      tier:'tier1', compTier:'$$$$', priorityScore:88, location:'Bengaluru',             careerUrl:'https://www.atlassian.com/company/careers/all-jobs?team=Engineering&location=India' },
  { id:'salesforce', name:'Salesforce',     tier:'tier1', compTier:'$$$',  priorityScore:84, location:'Bengaluru · Hyderabad', careerUrl:'https://careers.salesforce.com/en/jobs/?search=data%20engineer&country=India' },
  { id:'uber',       name:'Uber',           tier:'tier1', compTier:'$$$$', priorityScore:87, location:'Bengaluru',             careerUrl:'https://www.uber.com/global/en/careers/list/?query=data%20engineer&location=IND-Bengaluru' },
  { id:'anthropic',  name:'Anthropic',      tier:'tier1', compTier:'$$$$', priorityScore:97, location:'Remote',                careerUrl:'https://www.anthropic.com/jobs' },
  { id:'openai',     name:'OpenAI',         tier:'tier1', compTier:'$$$$', priorityScore:97, location:'Remote · SF',           careerUrl:'https://openai.com/careers/search/?q=data%20engineer' },

  /* TIER 2 — Strong Product */
  { id:'walmart',    name:'Walmart Global Tech', tier:'tier2', compTier:'$$$',  priorityScore:80, location:'Bengaluru · Chennai', careerUrl:'https://careers.walmart.com/results?q=data%20engineer&page=1&sort=rank&jobCity=Bangalore' },
  { id:'visa',       name:'Visa',           tier:'tier2', compTier:'$$$',  priorityScore:81, location:'Bengaluru',             careerUrl:'https://corporate.visa.com/en/jobs.html?search=data%20engineer&country=India' },
  { id:'mastercard', name:'Mastercard',     tier:'tier2', compTier:'$$$',  priorityScore:79, location:'Pune · Gurugram',       careerUrl:'https://careers.mastercard.com/us/en/search-results?keywords=data%20engineer&location=India' },
  { id:'paypal',     name:'PayPal',         tier:'tier2', compTier:'$$$',  priorityScore:78, location:'Bengaluru · Chennai',   careerUrl:'https://www.paypal.com/us/jobs/search?query=data%20engineer&location=India' },
  { id:'gs',         name:'Goldman Sachs',  tier:'tier2', compTier:'$$$$', priorityScore:83, location:'Bengaluru · Hyderabad', careerUrl:'https://www.goldmansachs.com/careers/students/programs/india.html' },
  { id:'jpmc',       name:'JPMorgan Chase', tier:'tier2', compTier:'$$$',  priorityScore:80, location:'Bengaluru · Mumbai',    careerUrl:'https://careers.jpmorgan.com/global/en/professionals/all-jobs?search=data%20engineer&country=India' },
  { id:'ms',         name:'Morgan Stanley', tier:'tier2', compTier:'$$$',  priorityScore:78, location:'Bengaluru · Mumbai',    careerUrl:'https://morganstanley.tal.net/vx/lang-en-GB/mobile-0/appcentre-1/brand-2/candidate/jobboard/vacancy/3/adv/?f_Country=India' },
  { id:'intuit',     name:'Intuit',         tier:'tier2', compTier:'$$$$', priorityScore:83, location:'Bengaluru',             careerUrl:'https://jobs.intuit.com/search-jobs/data%20engineer/India' },
  { id:'servicenow', name:'ServiceNow',     tier:'tier2', compTier:'$$$',  priorityScore:79, location:'Hyderabad',             careerUrl:'https://careers.servicenow.com/careers/jobs?search=data%20engineer&country=India' },
  { id:'workday',    name:'Workday',        tier:'tier2', compTier:'$$$',  priorityScore:78, location:'Pune',                  careerUrl:'https://workday.wd5.myworkdayjobs.com/Workday?q=data%20engineer&Country=India' },
  { id:'confluent',  name:'Confluent',      tier:'tier2', compTier:'$$$$', priorityScore:90, location:'Bengaluru',             careerUrl:'https://careers.confluent.io/jobs/search?query=data+engineer&pageSize=20' },
  { id:'mongodb',    name:'MongoDB',        tier:'tier2', compTier:'$$$',  priorityScore:82, location:'Gurugram · Bengaluru',  careerUrl:'https://www.mongodb.com/careers/jobs?search=data+engineer' },
  { id:'elastic',    name:'Elastic',        tier:'tier2', compTier:'$$$',  priorityScore:80, location:'Remote · Bengaluru',    careerUrl:'https://jobs.elastic.co/jobs/search?query=data%20engineer' },
  { id:'twilio',     name:'Twilio',         tier:'tier2', compTier:'$$$',  priorityScore:79, location:'Bengaluru',             careerUrl:'https://www.twilio.com/en-us/company/jobs?team=Engineering&location=India' },
  { id:'cisco',      name:'Cisco',          tier:'tier2', compTier:'$$$',  priorityScore:74, location:'Bengaluru',             careerUrl:'https://jobs.cisco.com/jobs/SearchJobs/data%20engineer?listFilterMode=1&21178=%5B169%5D' },
  { id:'oracle',     name:'Oracle',         tier:'tier2', compTier:'$$',   priorityScore:70, location:'Bengaluru · Hyderabad', careerUrl:'https://careers.oracle.com/jobs/#en/sites/jobsearch/jobs?keyword=data+engineer&location=India' },
  { id:'sap',        name:'SAP',            tier:'tier2', compTier:'$$',   priorityScore:70, location:'Bengaluru',             careerUrl:'https://jobs.sap.com/search/?q=data+engineer&locationsearch=India' },
  { id:'nvidia',     name:'NVIDIA',         tier:'tier2', compTier:'$$$$', priorityScore:91, location:'Bengaluru · Pune',      careerUrl:'https://nvidia.wd5.myworkdayjobs.com/NVIDIAExternalCareerSite?q=data%20engineer&Country=India' },
  { id:'qualcomm',   name:'Qualcomm',       tier:'tier2', compTier:'$$$',  priorityScore:75, location:'Bengaluru · Hyderabad', careerUrl:'https://careers.qualcomm.com/careers/jobs?keywords=data%20engineer&country=India' },
  { id:'booking',    name:'Booking.com',    tier:'tier2', compTier:'$$$$', priorityScore:84, location:'Bengaluru',             careerUrl:'https://careers.booking.com/search-results?keywords=data%20engineer' },
  { id:'expedia',    name:'Expedia Group',  tier:'tier2', compTier:'$$$',  priorityScore:78, location:'Gurugram',              careerUrl:'https://careers.expediagroup.com/jobs/?search=data+engineer&country=India' },
  { id:'airbnb',     name:'Airbnb',         tier:'tier2', compTier:'$$$$', priorityScore:85, location:'Remote · Bengaluru',    careerUrl:'https://careers.airbnb.com/positions/?_search=data+engineer' },
  { id:'pinterest',  name:'Pinterest',      tier:'tier2', compTier:'$$$$', priorityScore:84, location:'Remote · APAC',         careerUrl:'https://www.pinterestcareers.com/jobs/?search=data+engineer' },

  /* TIER 3 — Fast-Growing Startups */
  { id:'razorpay',   name:'Razorpay',       tier:'tier3', compTier:'$$$',  priorityScore:85, location:'Bengaluru',             careerUrl:'https://razorpay.com/jobs/jobs-all/?department=Engineering' },
  { id:'cred',       name:'CRED',           tier:'tier3', compTier:'$$$$', priorityScore:88, location:'Bengaluru',             careerUrl:'https://careers.cred.club/?department=Engineering' },
  { id:'phonepe',    name:'PhonePe',        tier:'tier3', compTier:'$$$',  priorityScore:82, location:'Bengaluru',             careerUrl:'https://www.phonepe.com/careers/job-openings/?department=engineering&search=data' },
  { id:'swiggy',     name:'Swiggy',         tier:'tier3', compTier:'$$$',  priorityScore:80, location:'Bengaluru',             careerUrl:'https://careers.swiggy.com/#/careers?search=data%20engineer' },
  { id:'zomato',     name:'Zomato',         tier:'tier3', compTier:'$$',   priorityScore:75, location:'Gurugram',              careerUrl:'https://www.zomato.com/careers?search=data%20engineer' },
  { id:'meesho',     name:'Meesho',         tier:'tier3', compTier:'$$$',  priorityScore:80, location:'Bengaluru',             careerUrl:'https://www.meesho.io/jobs?department=Engineering' },
  { id:'flipkart',   name:'Flipkart',       tier:'tier3', compTier:'$$$',  priorityScore:78, location:'Bengaluru',             careerUrl:'https://www.flipkartcareers.com/#!/joblist?jobsearch=data%20engineer' },
  { id:'myntra',     name:'Myntra',         tier:'tier3', compTier:'$$',   priorityScore:72, location:'Bengaluru',             careerUrl:'https://careers.myntra.com/job-openings?department=Engineering' },
  { id:'postman',    name:'Postman',        tier:'tier3', compTier:'$$$$', priorityScore:86, location:'Bengaluru',             careerUrl:'https://www.postman.com/company/careers/?department=Engineering' },
  { id:'freshworks', name:'Freshworks',     tier:'tier3', compTier:'$$$',  priorityScore:77, location:'Chennai · Bengaluru',   careerUrl:'https://www.freshworks.com/company/careers/jobs/?department=Engineering&search=data' },
  { id:'browserstack',name:'BrowserStack',  tier:'tier3', compTier:'$$$',  priorityScore:81, location:'Mumbai',                careerUrl:'https://www.browserstack.com/careers#openings?search=data' },
  { id:'hasura',     name:'Hasura',         tier:'tier3', compTier:'$$$',  priorityScore:80, location:'Bengaluru',             careerUrl:'https://hasura.io/careers/' },
  { id:'innovaccer', name:'Innovaccer',     tier:'tier3', compTier:'$$$',  priorityScore:79, location:'Noida · Bengaluru',     careerUrl:'https://innovaccer.com/careers/jobs?department=engineering' },
  { id:'groww',      name:'Groww',          tier:'tier3', compTier:'$$$',  priorityScore:81, location:'Bengaluru',             careerUrl:'https://groww.in/careers?team=Engineering' },
  { id:'zerodha',    name:'Zerodha',        tier:'tier3', compTier:'$$$',  priorityScore:80, location:'Bengaluru',             careerUrl:'https://zerodha.com/careers/#engineering' },
  { id:'slice',      name:'Slice',          tier:'tier3', compTier:'$$$',  priorityScore:78, location:'Bengaluru',             careerUrl:'https://sliceit.com/careers?dept=Engineering' },
  { id:'jupiter',    name:'Jupiter',        tier:'tier3', compTier:'$$$',  priorityScore:77, location:'Bengaluru',             careerUrl:'https://jupiter.money/careers/' },
  { id:'rapido',     name:'Rapido',         tier:'tier3', compTier:'$$',   priorityScore:72, location:'Bengaluru',             careerUrl:'https://rapido.bike/careers' },
  { id:'sharechat',  name:'ShareChat',      tier:'tier3', compTier:'$$$',  priorityScore:76, location:'Bengaluru',             careerUrl:'https://sharechat.com/careers' },
];

// Build default company shape with empty tracker fields
const buildCompany = (c) => ({
  appliedDate: null, followUpDate: null, contactName: '', referralStatus: 'none',
  interviewNotes: '', notes: '', salaryExpectation: '', tags: [], status: 'not_started',
  prepChecklist: defaultPrepChecklist(),
  ...c,
});

const defaultPrepChecklist = () => ([
  { id: 'sql', label: 'SQL deep practice (window functions, optimization)', done: false },
  { id: 'pyspark', label: 'PySpark internals & AQE', done: false },
  { id: 'system', label: 'Data system design (lakehouse, streaming)', done: false },
  { id: 'behav', label: 'STAR stories — 6 prepared', done: false },
  { id: 'company', label: 'Company research (product, scale, stack)', done: false },
  { id: 'questions', label: '5 thoughtful questions for interviewer', done: false },
]);

const DEFAULT_STAR_STORIES = [
  { id: 's1', title: 'Owned a high-impact data migration', situation: '', task: '', action: '', result: '' },
  { id: 's2', title: 'Resolved a critical production incident', situation: '', task: '', action: '', result: '' },
  { id: 's3', title: 'Led cross-functional alignment', situation: '', task: '', action: '', result: '' },
];

const DEFAULT_TEMPLATES = [
  {
    id: 't1',
    name: 'Referral Request — Warm',
    body: `Hi {Name},\n\nI hope you're doing well. I came across {Company}'s {Role} opening and it lines up closely with what I've been building — multi-agent systems on top of LangGraph & Claude, plus deep work in Spark/Databricks at IBM over the last ~4 years.\n\nWould you be open to a 15-min chat, or pointing me to the right hiring manager? Happy to share specifics or a short loom of recent work.\n\nThanks for considering,\nNishant`
  },
  {
    id: 't2',
    name: 'Recruiter Cold Outreach',
    body: `Hi {Name},\n\nSaw you lead TA for engineering at {Company}. I'm a Data Engineer at IBM (4 yrs, Databricks-certified) actively targeting product-first teams building AI infra. Recent work: a 6-agent autonomous job application system on LangGraph + Claude, and a multimodal earnings intelligence platform (Argus).\n\nIf {Company} is hiring for Data / AI Engineer roles, I'd love to be considered. Resume + portfolio attached.\n\nBest,\nNishant`
  },
  {
    id: 't3',
    name: 'Post-Interview Thank-You',
    body: `Hi {Name},\n\nThanks for the conversation today — I especially enjoyed digging into {topic}. It reinforced why {Company} is high on my list.\n\nIf helpful, here's a one-pager on the architecture I described for the {project} project: {link}.\n\nLooking forward to next steps.\n\nBest,\nNishant`
  },
  {
    id: 't4',
    name: 'Follow-up — 1 Week Silence',
    body: `Hi {Name},\n\nJust circling back on the {Role} application at {Company}. Still very keen, and happy to share additional context or work samples if helpful.\n\nThanks,\nNishant`
  },
];

const defaultState = () => ({
  companies: SEED_COMPANIES.map(buildCompany),
  tags: ['high-priority', 'remote-ok', 'visa-sponsor', 'ai-infra', 'platform'],
  starStories: DEFAULT_STAR_STORIES,
  templates: DEFAULT_TEMPLATES,
  customGroups: [],
  schemaVersion: 2,
});

/* ============================================================================
   STORAGE LAYER
   ========================================================================== */

const useStorage = () => {
  const [state, setState] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const saveTimer = useRef(null);

  // Load once on mount
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(STORAGE_KEY);
        if (r && r.value) {
          const parsed = JSON.parse(r.value);
          // Migrate: ensure all seed companies exist (additive)
          const existing = new Set(parsed.companies.map(c => c.id));
          SEED_COMPANIES.forEach(c => { if (!existing.has(c.id)) parsed.companies.push(buildCompany(c)); });
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
    })();
  }, []);

  // Debounced save on change
  useEffect(() => {
    if (!loaded || !state) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      window.storage.set(STORAGE_KEY, JSON.stringify(state)).catch(e => console.error('Save failed', e));
    }, 300);
  }, [state, loaded]);

  return [state, setState, loaded];
};

/* ============================================================================
   SMALL UTILITIES
   ========================================================================== */

const getStatus = (id) => STATUSES.find(s => s.id === id) || STATUSES[0];
const getTier   = (id) => TIERS.find(t => t.id === id) || TIERS[0];

const fmtDate = (d) => {
  if (!d) return '—';
  const date = new Date(d);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const daysSince = (d) => {
  if (!d) return null;
  return Math.floor((Date.now() - new Date(d).getTime()) / (1000 * 60 * 60 * 24));
};

const todayISO = () => new Date().toISOString().slice(0, 10);

const cls = (...xs) => xs.filter(Boolean).join(' ');

/* ============================================================================
   STYLES (injected once)
   ========================================================================== */

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');
    :root {
      --primary: #1F4E79;
      --primary-700: #173E61;
      --primary-50: #EEF4FA;
      --secondary: #4F6EF7;
      --secondary-50: #EEF2FF;
      --ink: #0F172A;
      --ink-2: #334155;
      --ink-3: #64748B;
      --ink-4: #94A3B8;
      --hairline: #E5E7EB;
      --hairline-2: #F1F5F9;
      --surface: #FFFFFF;
      --surface-2: #FAFAFA;
      --surface-3: #F8FAFC;
    }
    .jcc { font-family: 'Geist', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
           font-feature-settings: 'cv11','ss01','ss03'; color: var(--ink); letter-spacing: -0.005em; }
    .jcc-mono { font-family: 'Geist Mono', ui-monospace, SFMono-Regular, monospace; font-feature-settings: 'tnum','zero'; }
    .jcc-num  { font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }
    .jcc-card { background: var(--surface); border: 1px solid var(--hairline); border-radius: 12px; }
    .jcc-card-hover { transition: box-shadow .15s ease, border-color .15s ease, transform .15s ease; }
    .jcc-card-hover:hover { border-color: #CBD5E1; box-shadow: 0 1px 3px rgba(15,23,42,.04), 0 4px 12px rgba(15,23,42,.04); }
    .jcc-btn { display:inline-flex; align-items:center; gap:6px; padding:7px 12px; border-radius:8px; font-size:13px; font-weight:500;
               border:1px solid var(--hairline); background: var(--surface); color: var(--ink-2); transition: all .12s ease; }
    .jcc-btn:hover { background: var(--surface-3); border-color: #CBD5E1; color: var(--ink); }
    .jcc-btn-primary { background: var(--primary); color: white; border-color: var(--primary); }
    .jcc-btn-primary:hover { background: var(--primary-700); border-color: var(--primary-700); color: white; }
    .jcc-btn-secondary { background: var(--secondary); color: white; border-color: var(--secondary); }
    .jcc-btn-secondary:hover { background: #3F5DE3; border-color: #3F5DE3; color: white; }
    .jcc-btn-ghost { border-color: transparent; background: transparent; }
    .jcc-btn-ghost:hover { background: var(--surface-3); border-color: var(--hairline); }
    .jcc-input { width:100%; padding:8px 12px; border:1px solid var(--hairline); border-radius:8px; font-size:13px;
                 background: var(--surface); color: var(--ink); transition: border-color .12s ease, box-shadow .12s ease; }
    .jcc-input:focus { outline:none; border-color: var(--secondary); box-shadow: 0 0 0 3px rgba(79,110,247,.12); }
    .jcc-pill { display:inline-flex; align-items:center; gap:4px; padding:2px 8px; border-radius:6px;
                font-size:11px; font-weight:500; line-height:1.5; letter-spacing:.01em; }
    .jcc-link { color: var(--secondary); text-decoration: none; }
    .jcc-link:hover { text-decoration: underline; text-underline-offset: 2px; }
    .jcc-sidebar-item { display:flex; align-items:center; gap:10px; padding:7px 10px; border-radius:7px;
                        font-size:13px; color: var(--ink-2); cursor:pointer; transition: background .1s; font-weight: 450; }
    .jcc-sidebar-item:hover { background: var(--surface-3); color: var(--ink); }
    .jcc-sidebar-item.active { background: var(--primary-50); color: var(--primary); font-weight: 550; }
    .jcc-divider { height:1px; background: var(--hairline); }
    .jcc-grid-bg { background-image: linear-gradient(var(--hairline-2) 1px, transparent 1px), linear-gradient(90deg, var(--hairline-2) 1px, transparent 1px); background-size: 24px 24px; }
    .jcc-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
    .jcc-scroll::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 4px; }
    .jcc-scroll::-webkit-scrollbar-track { background: transparent; }
    .jcc-fade-in { animation: jccFade .2s ease-out; }
    @keyframes jccFade { from { opacity:0; transform: translateY(4px); } to { opacity:1; transform:none; } }
    .jcc-modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,.4); backdrop-filter: blur(4px); z-index: 50;
                         display:flex; align-items:flex-start; justify-content:center; padding: 5vh 16px; }
    .jcc-modal { background: var(--surface); border-radius: 16px; width: 100%; max-width: 760px; max-height: 90vh; overflow: hidden;
                 display:flex; flex-direction:column; box-shadow: 0 24px 60px rgba(15,23,42,.18); border: 1px solid var(--hairline); }
    .jcc-checkbox { width: 16px; height: 16px; border: 1.5px solid #CBD5E1; border-radius: 4px; display:inline-flex; align-items:center; justify-content:center;
                    background: white; cursor: pointer; transition: all .12s; flex-shrink: 0; }
    .jcc-checkbox.checked { background: var(--primary); border-color: var(--primary); }
    select.jcc-input { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
                       background-repeat: no-repeat; background-position: right 10px center; padding-right: 28px; }
    .jcc-kbd { font-family: 'Geist Mono', monospace; font-size: 10.5px; padding: 1px 5px; border-radius: 4px;
               background: var(--surface-3); border: 1px solid var(--hairline); color: var(--ink-3); }
  `}</style>
);

/* ============================================================================
   PRIMITIVE COMPONENTS
   ========================================================================== */

const Pill = ({ children, color, bg, border, className }) => (
  <span className={cls('jcc-pill', className)} style={{ color, background: bg, border: border ? `1px solid ${border}` : 'none' }}>
    {children}
  </span>
);

const StatusBadge = ({ statusId }) => {
  const s = getStatus(statusId);
  return <Pill color={s.color} bg={s.bg}>{s.label}</Pill>;
};

const TierBadge = ({ tierId }) => {
  const t = getTier(tierId);
  return <Pill color={t.accent} bg="#F8FAFC" border="#E2E8F0">{t.short}</Pill>;
};

const Toast = ({ message, onDone }) => {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [message, onDone]);
  if (!message) return null;
  return (
    <div className="jcc-fade-in" style={{ position:'fixed', bottom: 24, right: 24, zIndex: 100,
         background:'#0F172A', color:'white', padding:'10px 16px', borderRadius:10, fontSize:13, fontWeight:500,
         boxShadow:'0 8px 24px rgba(0,0,0,.18)', display:'flex', alignItems:'center', gap:8 }}>
      <Check size={14} /> {message}
    </div>
  );
};

/* ============================================================================
   DASHBOARD VIEW
   ========================================================================== */

const Dashboard = ({ state, setState, onJump, onOpenCompany }) => {
  const { companies } = state;

  const stats = useMemo(() => {
    const applied   = companies.filter(c => !['not_started','archived'].includes(c.status)).length;
    const interview = companies.filter(c => ['interview_sched','interviewing'].includes(c.status)).length;
    const offers    = companies.filter(c => c.status === 'offer').length;
    const pending   = companies.filter(c => ['applied','referral_req','referral_rcvd'].includes(c.status)).length;
    const rejected  = companies.filter(c => c.status === 'rejected').length;
    const today = new Date(); today.setHours(0,0,0,0);
    const followups = companies.filter(c => c.followUpDate && new Date(c.followUpDate) <= today && !['offer','rejected','archived'].includes(c.status));
    return { total: companies.length, applied, interview, offers, pending, rejected, followups };
  }, [companies]);

  // Application velocity — last 8 weeks
  const velocity = useMemo(() => {
    const weeks = [];
    const now = new Date(); now.setHours(0,0,0,0);
    const monday = new Date(now); monday.setDate(now.getDate() - now.getDay() + 1);
    for (let i = 7; i >= 0; i--) {
      const start = new Date(monday); start.setDate(monday.getDate() - i*7);
      const end   = new Date(start); end.setDate(start.getDate() + 7);
      const count = companies.filter(c => c.appliedDate && new Date(c.appliedDate) >= start && new Date(c.appliedDate) < end).length;
      weeks.push({ label: start.toLocaleDateString('en-IN',{day:'2-digit',month:'short'}), count });
    }
    return weeks;
  }, [companies]);

  const maxVel = Math.max(1, ...velocity.map(w => w.count));

  // Pipeline funnel
  const funnel = useMemo(() => {
    const total = companies.length;
    const stages = [
      { label: 'In Database', count: total },
      { label: 'Applied',     count: companies.filter(c => !['not_started','archived'].includes(c.status)).length },
      { label: 'Engaged',     count: companies.filter(c => ['referral_rcvd','interview_sched','interviewing','offer'].includes(c.status)).length },
      { label: 'Interviewing',count: companies.filter(c => ['interview_sched','interviewing','offer'].includes(c.status)).length },
      { label: 'Offer',       count: companies.filter(c => c.status === 'offer').length },
    ];
    return stages;
  }, [companies]);

  // Top priority untouched
  const topUntouched = useMemo(() =>
    companies.filter(c => c.status === 'not_started').sort((a,b) => b.priorityScore - a.priorityScore).slice(0, 5)
  , [companies]);

  // Recent activity
  const recent = useMemo(() =>
    [...companies].filter(c => c.appliedDate).sort((a,b) => new Date(b.appliedDate) - new Date(a.appliedDate)).slice(0, 6)
  , [companies]);

  const StatCard = ({ icon: Icon, label, value, hint, accent, onClick }) => (
    <div className="jcc-card jcc-card-hover" style={{ padding: 18, cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 14 }}>
        <span style={{ color:'var(--ink-3)', fontSize:12, fontWeight:500, letterSpacing:'.02em', textTransform:'uppercase' }}>{label}</span>
        <Icon size={15} style={{ color: accent || 'var(--ink-4)' }}/>
      </div>
      <div className="jcc-num" style={{ fontSize: 30, fontWeight: 600, color:'var(--ink)', lineHeight: 1 }}>{value}</div>
      {hint && <div style={{ fontSize:11.5, color:'var(--ink-4)', marginTop: 8 }}>{hint}</div>}
    </div>
  );

  return (
    <div className="jcc-fade-in" style={{ padding: '28px 32px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 12, color:'var(--ink-3)', fontWeight: 500, letterSpacing:'.04em', textTransform:'uppercase', marginBottom: 6 }}>
          Command Center · {new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long' })}
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, Nishant.</h1>
        <p style={{ color:'var(--ink-3)', fontSize: 14, marginTop: 6, marginBottom: 0 }}>
          {stats.followups > 0
            ? <>You have <strong style={{ color:'#D97706' }}>{stats.followups} follow-up{stats.followups>1?'s':''} due today.</strong> {stats.interview > 0 && `${stats.interview} interview${stats.interview>1?'s':''} in motion.`}</>
            : <>{stats.applied} active application{stats.applied!==1?'s':''} · {stats.pending} pending response · {topUntouched.length} priority companies untouched.</>
          }
        </p>
      </div>

      {/* Stat grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap: 12, marginBottom: 24 }}>
        <StatCard icon={Building2}    label="Companies"   value={stats.total}     hint="In database"                     accent="var(--primary)" onClick={() => onJump('companies')} />
        <StatCard icon={Send}         label="Applied"     value={stats.applied}   hint={`${Math.round(stats.applied/stats.total*100) || 0}% of database`} accent="var(--secondary)" />
        <StatCard icon={Activity}     label="Pending"     value={stats.pending}   hint="Awaiting response"               accent="#A855F7" />
        <StatCard icon={Briefcase}    label="Interviews"  value={stats.interview} hint="In progress"                     accent="#D97706" onClick={() => onJump('pipeline')} />
        <StatCard icon={CheckCircle2} label="Offers"      value={stats.offers}    hint="Live offers"                     accent="#059669" />
        <StatCard icon={Bell}         label="Follow-ups"  value={stats.followups} hint="Due today"                       accent={stats.followups > 0 ? '#D97706' : 'var(--ink-4)'} />
      </div>

      {/* Two-column section */}
      <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Velocity chart */}
        <div className="jcc-card" style={{ padding: 20 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 18 }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Application velocity</h3>
              <p style={{ fontSize: 12, color:'var(--ink-3)', margin: '2px 0 0' }}>Last 8 weeks · target: 5+/week</p>
            </div>
            <Pill color="var(--secondary)" bg="var(--secondary-50)">
              <TrendingUp size={11}/> {velocity.reduce((s,w)=>s+w.count,0)} total
            </Pill>
          </div>
          <div style={{ display:'flex', alignItems:'flex-end', gap: 12, height: 140, padding:'0 4px' }}>
            {velocity.map((w,i) => {
              const h = Math.max(4, (w.count / maxVel) * 120);
              const isCurrent = i === velocity.length - 1;
              return (
                <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap: 6 }}>
                  <div className="jcc-num" style={{ fontSize: 11, color: w.count > 0 ? 'var(--ink-2)' : 'var(--ink-4)', fontWeight: 500 }}>
                    {w.count}
                  </div>
                  <div style={{
                    width:'100%', height: h, borderRadius:'4px 4px 0 0',
                    background: isCurrent
                      ? 'linear-gradient(180deg, var(--secondary) 0%, var(--primary) 100%)'
                      : w.count >= 5 ? 'var(--primary)' : '#CBD5E1',
                    transition: 'all .3s'
                  }}/>
                  <div style={{ fontSize: 10.5, color:'var(--ink-4)', fontWeight: 500 }}>{w.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Funnel */}
        <div className="jcc-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 18px' }}>Pipeline funnel</h3>
          <div style={{ display:'flex', flexDirection:'column', gap: 10 }}>
            {funnel.map((s,i) => {
              const pct = funnel[0].count ? (s.count / funnel[0].count) * 100 : 0;
              const rate = i > 0 && funnel[i-1].count ? Math.round((s.count / funnel[i-1].count) * 100) : null;
              return (
                <div key={s.label}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color:'var(--ink-2)', fontWeight: 500 }}>{s.label}</span>
                    <span style={{ fontSize: 11, color:'var(--ink-3)' }} className="jcc-num">
                      {s.count} {rate !== null && <span style={{ color:'var(--ink-4)' }}>· {rate}%</span>}
                    </span>
                  </div>
                  <div style={{ height: 6, background:'var(--surface-3)', borderRadius: 3, overflow:'hidden' }}>
                    <div style={{
                      width: `${pct}%`, height:'100%',
                      background: i === 0 ? 'var(--ink-4)' : i < 3 ? 'var(--secondary)' : i === 3 ? '#D97706' : '#059669',
                      transition:'width .3s'
                    }}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Two-column lower section */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 16 }}>
        {/* Top priority untouched */}
        <div className="jcc-card" style={{ padding: 20 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 14 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Priority targets · untouched</h3>
            <Star size={14} style={{ color:'#D97706' }}/>
          </div>
          {topUntouched.length === 0 ? (
            <div style={{ color:'var(--ink-3)', fontSize: 13, padding:'12px 0' }}>You're working through everything. 🎯</div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column' }}>
              {topUntouched.map(c => (
                <div key={c.id} onClick={() => onOpenCompany(c.id)} style={{
                  display:'flex', alignItems:'center', justifyContent:'space-between',
                  padding:'10px 0', borderTop:'1px solid var(--hairline-2)', cursor:'pointer'
                }}>
                  <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: 8, background: 'var(--primary-50)',
                      color:'var(--primary)', display:'flex', alignItems:'center', justifyContent:'center',
                      fontWeight: 600, fontSize: 12, letterSpacing:'-0.02em'
                    }}>{c.name.slice(0,2).toUpperCase()}</div>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 550 }}>{c.name}</div>
                      <div style={{ fontSize: 11.5, color:'var(--ink-3)' }}>{c.location}</div>
                    </div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
                    <Pill color="var(--ink-2)" bg="var(--surface-3)" border="var(--hairline)">{c.compTier}</Pill>
                    <span className="jcc-num" style={{ fontSize: 12, color:'var(--ink-3)', minWidth: 24, textAlign:'right' }}>{c.priorityScore}</span>
                    <ChevronRight size={14} style={{ color:'var(--ink-4)' }}/>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div className="jcc-card" style={{ padding: 20 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 14 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Recent activity</h3>
            <Activity size={14} style={{ color:'var(--ink-4)' }}/>
          </div>
          {recent.length === 0 ? (
            <div style={{ color:'var(--ink-3)', fontSize: 13, padding:'12px 0' }}>No applications yet. Apply to your first company to see velocity here.</div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column' }}>
              {recent.map(c => {
                const days = daysSince(c.appliedDate);
                return (
                  <div key={c.id} onClick={() => onOpenCompany(c.id)} style={{
                    display:'flex', alignItems:'center', justifyContent:'space-between',
                    padding:'10px 0', borderTop:'1px solid var(--hairline-2)', cursor:'pointer'
                  }}>
                    <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
                      <CircleDot size={14} style={{ color: getStatus(c.status).color }}/>
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 550 }}>{c.name}</div>
                        <div style={{ fontSize: 11.5, color:'var(--ink-3)' }}>Applied {days === 0 ? 'today' : `${days}d ago`}</div>
                      </div>
                    </div>
                    <StatusBadge statusId={c.status}/>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   COMPANIES VIEW
   ========================================================================== */

const CompaniesView = ({ state, setState, onOpenCompany, onAddCompany, onToast }) => {
  const { companies } = state;
  const [query, setQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('priority');

  const filtered = useMemo(() => {
    let r = companies;
    if (tierFilter !== 'all') r = r.filter(c => c.tier === tierFilter);
    if (statusFilter !== 'all') r = r.filter(c => c.status === statusFilter);
    if (query) {
      const q = query.toLowerCase();
      r = r.filter(c => c.name.toLowerCase().includes(q) || (c.location||'').toLowerCase().includes(q) || (c.tags||[]).some(t => t.toLowerCase().includes(q)));
    }
    if (sortBy === 'priority') r = [...r].sort((a,b) => b.priorityScore - a.priorityScore);
    if (sortBy === 'name')     r = [...r].sort((a,b) => a.name.localeCompare(b.name));
    if (sortBy === 'recent')   r = [...r].sort((a,b) => (b.appliedDate || '').localeCompare(a.appliedDate || ''));
    return r;
  }, [companies, query, tierFilter, statusFilter, sortBy]);

  // Group by tier when no filter
  const grouped = useMemo(() => {
    if (tierFilter !== 'all') return [{ tier: TIERS.find(t => t.id === tierFilter), items: filtered }];
    return TIERS.map(t => ({ tier: t, items: filtered.filter(c => c.tier === t.id) })).filter(g => g.items.length);
  }, [filtered, tierFilter]);

  const openCareer = (c) => {
    if (c.careerUrl) window.open(c.careerUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="jcc-fade-in" style={{ padding: '28px 32px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom: 22 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing:'-0.02em', margin: 0 }}>Companies</h1>
          <p style={{ color:'var(--ink-3)', fontSize: 13, margin: '4px 0 0' }}>
            <span className="jcc-num">{filtered.length}</span> of <span className="jcc-num">{companies.length}</span> shown · sorted by {sortBy}
          </p>
        </div>
        <button className="jcc-btn jcc-btn-primary" onClick={onAddCompany}>
          <Plus size={14}/> Add company
        </button>
      </div>

      {/* Filter bar */}
      <div className="jcc-card" style={{ padding: 12, marginBottom: 18, display:'flex', gap: 10, alignItems:'center' }}>
        <div style={{ position:'relative', flex: 1, maxWidth: 320 }}>
          <Search size={14} style={{ position:'absolute', left: 10, top:'50%', transform:'translateY(-50%)', color:'var(--ink-4)' }}/>
          <input className="jcc-input" placeholder="Search by name, location, tag…" value={query} onChange={e => setQuery(e.target.value)} style={{ paddingLeft: 32 }}/>
        </div>
        <select className="jcc-input" value={tierFilter} onChange={e => setTierFilter(e.target.value)} style={{ width: 180 }}>
          <option value="all">All tiers</option>
          {TIERS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
        </select>
        <select className="jcc-input" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: 180 }}>
          <option value="all">All statuses</option>
          {STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <select className="jcc-input" value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width: 160 }}>
          <option value="priority">Priority score</option>
          <option value="name">Alphabetical</option>
          <option value="recent">Recently applied</option>
        </select>
      </div>

      {/* Groups */}
      {grouped.length === 0 ? (
        <div className="jcc-card" style={{ padding: 48, textAlign:'center', color:'var(--ink-3)' }}>
          <Inbox size={28} style={{ color:'var(--ink-4)', marginBottom: 12 }}/>
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>No companies match those filters.</div>
          <div style={{ fontSize: 12.5 }}>Try clearing filters or searching for something different.</div>
        </div>
      ) : grouped.map(g => (
        <div key={g.tier.id} style={{ marginBottom: 28 }}>
          <div style={{ display:'flex', alignItems:'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: g.tier.accent }}/>
            <h3 style={{ fontSize: 12, fontWeight: 600, color:'var(--ink-2)', letterSpacing:'.04em', textTransform:'uppercase', margin: 0 }}>{g.tier.label}</h3>
            <span className="jcc-num" style={{ fontSize: 12, color:'var(--ink-4)' }}>{g.items.length}</span>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 }}>
            {g.items.map(c => (
              <CompanyCard key={c.id} company={c}
                onOpen={() => onOpenCompany(c.id)}
                onCareer={() => openCareer(c)}
                onEmployees={() => { window.open(liEmployees(c.name), '_blank', 'noopener,noreferrer'); onToast('Opened LinkedIn employee search'); }}
                onRecruiters={() => { window.open(liRecruiters(c.name), '_blank', 'noopener,noreferrer'); onToast('Opened LinkedIn recruiter search'); }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const CompanyCard = ({ company, onOpen, onCareer, onEmployees, onRecruiters }) => {
  const days = company.appliedDate ? daysSince(company.appliedDate) : null;
  return (
    <div className="jcc-card jcc-card-hover" style={{ padding: 16, display:'flex', flexDirection:'column' }}>
      {/* Header row */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom: 12 }}>
        <div style={{ display:'flex', alignItems:'center', gap: 12, minWidth: 0, cursor:'pointer' }} onClick={onOpen}>
          <div style={{
            width: 38, height: 38, borderRadius: 9, background:'var(--primary-50)',
            color:'var(--primary)', display:'flex', alignItems:'center', justifyContent:'center',
            fontWeight: 600, fontSize: 13, letterSpacing:'-0.02em', flexShrink: 0
          }}>{company.name.slice(0,2).toUpperCase()}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14.5, fontWeight: 550, lineHeight: 1.2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{company.name}</div>
            <div style={{ fontSize: 11.5, color:'var(--ink-3)', marginTop: 2, display:'flex', alignItems:'center', gap: 4 }}>
              <MapPin size={10}/>{company.location}
            </div>
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap: 4, flexShrink: 0 }}>
          <Pill color="var(--ink-2)" bg="var(--surface-3)" border="var(--hairline)">{company.compTier}</Pill>
          <span className="jcc-num" style={{ fontSize: 11, color:'var(--ink-3)', fontWeight: 500 }}>P{company.priorityScore}</span>
        </div>
      </div>

      {/* Status / tags row */}
      <div style={{ display:'flex', flexWrap:'wrap', gap: 6, marginBottom: 14, minHeight: 22 }}>
        <StatusBadge statusId={company.status}/>
        {days !== null && (
          <Pill color="var(--ink-3)" bg="var(--surface-3)">
            <Clock size={10}/>{days === 0 ? 'today' : `${days}d ago`}
          </Pill>
        )}
        {(company.tags || []).slice(0,2).map(t => (
          <Pill key={t} color="var(--secondary)" bg="var(--secondary-50)"><Hash size={9}/>{t}</Pill>
        ))}
      </div>

      {/* Action grid */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 6, marginTop:'auto' }}>
        <button className="jcc-btn jcc-btn-primary" onClick={onCareer} style={{ justifyContent:'center' }} title="Search roles on career portal">
          <ExternalLink size={12}/> View Roles
        </button>
        <button className="jcc-btn" onClick={onOpen} style={{ justifyContent:'center' }}>
          <Edit3 size={12}/> Track
        </button>
        <button className="jcc-btn" onClick={onEmployees} style={{ justifyContent:'center' }} title="LinkedIn search for engineers at this company">
          <Users size={12}/> Employees
        </button>
        <button className="jcc-btn" onClick={onRecruiters} style={{ justifyContent:'center' }} title="LinkedIn search for recruiters">
          <UserSearch size={12}/> Recruiters
        </button>
      </div>
    </div>
  );
};

/* ============================================================================
   COMPANY DETAIL MODAL
   ========================================================================== */

const CompanyDetail = ({ company, allTags, onClose, onUpdate, onDelete }) => {
  const [tab, setTab] = useState('overview');
  const [draft, setDraft] = useState(company);

  useEffect(() => { setDraft(company); }, [company?.id]);

  const update = (patch) => {
    const next = { ...draft, ...patch };
    setDraft(next);
    onUpdate(next);
  };

  const updatePrep = (id, done) => {
    update({ prepChecklist: draft.prepChecklist.map(p => p.id === id ? { ...p, done } : p) });
  };

  const toggleTag = (tag) => {
    const tags = draft.tags || [];
    update({ tags: tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag] });
  };

  const markApplied = () => {
    update({ status: 'applied', appliedDate: draft.appliedDate || todayISO() });
  };

  if (!company) return null;
  const status = getStatus(draft.status);
  const tier = getTier(draft.tier);

  return (
    <div className="jcc-modal-overlay" onClick={onClose}>
      <div className="jcc-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 860 }}>
        {/* Header */}
        <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--hairline)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap: 14, minWidth: 0 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10, background:'var(--primary-50)',
              color:'var(--primary)', display:'flex', alignItems:'center', justifyContent:'center',
              fontWeight: 600, fontSize: 14, letterSpacing:'-0.02em'
            }}>{draft.name.slice(0,2).toUpperCase()}</div>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0, letterSpacing:'-0.01em' }}>{draft.name}</h2>
                <TierBadge tierId={draft.tier}/>
              </div>
              <div style={{ fontSize: 12, color:'var(--ink-3)', marginTop: 2, display:'flex', alignItems:'center', gap: 10 }}>
                <span style={{ display:'flex', alignItems:'center', gap:4 }}><MapPin size={11}/>{draft.location}</span>
                <span style={{ color:'var(--ink-4)' }}>·</span>
                <span>{draft.compTier} · {COMP_TIERS[draft.compTier]?.range}</span>
                <span style={{ color:'var(--ink-4)' }}>·</span>
                <span>Priority {draft.priorityScore}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="jcc-btn jcc-btn-ghost" style={{ padding: 6 }}><X size={16}/></button>
        </div>

        {/* Tab bar */}
        <div style={{ display:'flex', gap: 4, padding:'8px 24px 0', borderBottom:'1px solid var(--hairline)' }}>
          {[
            { id:'overview', label:'Overview', icon: Inbox },
            { id:'tracker',  label:'Tracker',  icon: Target },
            { id:'prep',     label:'Prep',     icon: GraduationCap },
            { id:'notes',    label:'Notes',    icon: FileText },
            { id:'edit',     label:'Edit',     icon: Edit3 },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              border:'none', background:'transparent', cursor:'pointer',
              padding:'10px 12px', fontSize: 12.5, fontWeight: 500,
              color: tab === t.id ? 'var(--primary)' : 'var(--ink-3)',
              borderBottom: tab === t.id ? '2px solid var(--primary)' : '2px solid transparent',
              marginBottom: -1, display:'flex', alignItems:'center', gap:6, transition:'color .12s'
            }}>
              <t.icon size={13}/> {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="jcc-scroll" style={{ overflow:'auto', flex: 1, padding: 24 }}>
          {tab === 'overview' && (
            <div style={{ display:'flex', flexDirection:'column', gap: 18 }}>
              {/* Quick actions */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 8 }}>
                <button className="jcc-btn jcc-btn-primary" onClick={() => window.open(draft.careerUrl, '_blank')} style={{ justifyContent:'center' }}>
                  <ExternalLink size={13}/> View Open Roles
                </button>
                <button className="jcc-btn" onClick={() => window.open(liEmployees(draft.name), '_blank')} style={{ justifyContent:'center' }}>
                  <Users size={13}/> Find Employees
                </button>
                <button className="jcc-btn" onClick={() => window.open(liRecruiters(draft.name), '_blank')} style={{ justifyContent:'center' }}>
                  <UserSearch size={13}/> Find Recruiters
                </button>
                <button className="jcc-btn jcc-btn-secondary" onClick={markApplied} style={{ justifyContent:'center' }}>
                  <Send size={13}/> Mark Applied
                </button>
              </div>

              {/* Stats grid */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 12 }}>
                <DetailMetric label="Status" value={<StatusBadge statusId={draft.status}/>}/>
                <DetailMetric label="Applied" value={fmtDate(draft.appliedDate)} hint={draft.appliedDate ? `${daysSince(draft.appliedDate)}d ago` : null}/>
                <DetailMetric label="Follow-up" value={fmtDate(draft.followUpDate)} accent={draft.followUpDate && new Date(draft.followUpDate) <= new Date() ? '#D97706' : null}/>
              </div>

              {/* Tags */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color:'var(--ink-3)', textTransform:'uppercase', letterSpacing:'.04em', marginBottom: 8 }}>Tags</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap: 6 }}>
                  {allTags.map(t => {
                    const active = (draft.tags || []).includes(t);
                    return (
                      <button key={t} onClick={() => toggleTag(t)} className="jcc-pill"
                        style={{ border: '1px solid', cursor:'pointer',
                          background: active ? 'var(--secondary-50)' : 'white',
                          color: active ? 'var(--secondary)' : 'var(--ink-3)',
                          borderColor: active ? 'var(--secondary)' : 'var(--hairline)' }}>
                        <Hash size={9}/>{t}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {tab === 'tracker' && (
            <div style={{ display:'flex', flexDirection:'column', gap: 14 }}>
              <Field label="Status">
                <select className="jcc-input" value={draft.status} onChange={e => update({ status: e.target.value })}>
                  {STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </Field>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12 }}>
                <Field label="Applied date">
                  <input type="date" className="jcc-input" value={draft.appliedDate || ''} onChange={e => update({ appliedDate: e.target.value })}/>
                </Field>
                <Field label="Next follow-up">
                  <input type="date" className="jcc-input" value={draft.followUpDate || ''} onChange={e => update({ followUpDate: e.target.value })}/>
                </Field>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12 }}>
                <Field label="Contact name">
                  <input className="jcc-input" placeholder="Recruiter / referral / hiring manager" value={draft.contactName} onChange={e => update({ contactName: e.target.value })}/>
                </Field>
                <Field label="Referral status">
                  <select className="jcc-input" value={draft.referralStatus} onChange={e => update({ referralStatus: e.target.value })}>
                    <option value="none">None</option>
                    <option value="requested">Requested</option>
                    <option value="received">Received</option>
                    <option value="declined">Declined</option>
                  </select>
                </Field>
              </div>
              <Field label="Salary expectation">
                <input className="jcc-input" placeholder="e.g. 50–65 LPA fixed + ESOPs" value={draft.salaryExpectation} onChange={e => update({ salaryExpectation: e.target.value })}/>
              </Field>
              <Field label="Interview notes" hint="Loop structure, rounds completed, key feedback">
                <textarea className="jcc-input" rows={5} value={draft.interviewNotes} onChange={e => update({ interviewNotes: e.target.value })}/>
              </Field>
            </div>
          )}

          {tab === 'prep' && (
            <div style={{ display:'flex', flexDirection:'column', gap: 12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>Interview prep checklist</div>
                  <div style={{ fontSize: 12, color:'var(--ink-3)', marginTop: 2 }}>
                    {draft.prepChecklist.filter(p => p.done).length} of {draft.prepChecklist.length} complete
                  </div>
                </div>
                <Pill color="var(--secondary)" bg="var(--secondary-50)">
                  {Math.round((draft.prepChecklist.filter(p => p.done).length / draft.prepChecklist.length) * 100)}%
                </Pill>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap: 2 }}>
                {draft.prepChecklist.map(item => (
                  <label key={item.id} style={{
                    display:'flex', alignItems:'center', gap: 10, padding:'10px 12px',
                    borderRadius: 8, cursor:'pointer', transition:'background .1s'
                  }} onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-3)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <span className={cls('jcc-checkbox', item.done && 'checked')}>
                      {item.done && <Check size={11} color="white" strokeWidth={3}/>}
                    </span>
                    <input type="checkbox" checked={item.done} onChange={e => updatePrep(item.id, e.target.checked)} style={{ display:'none' }}/>
                    <span style={{ fontSize: 13.5, color: item.done ? 'var(--ink-4)' : 'var(--ink-2)', textDecoration: item.done ? 'line-through' : 'none' }}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
              <div style={{ background:'var(--surface-3)', padding: 14, borderRadius: 10, fontSize: 12.5, color:'var(--ink-2)', display:'flex', gap: 10 }}>
                <Sparkles size={14} style={{ color:'var(--secondary)', flexShrink: 0, marginTop: 2 }}/>
                <div>
                  <strong>Tip:</strong> For {draft.name}, focus your prep on what their stack reveals. Check their engineering blog,
                  read their latest data-platform talks, and prepare 2-3 questions that show you've done the homework.
                </div>
              </div>
            </div>
          )}

          {tab === 'notes' && (
            <div style={{ display:'flex', flexDirection:'column', gap: 12 }}>
              <Field label="Notes" hint="Anything that matters — stack, blog posts, people you've spoken to, gut-checks">
                <textarea className="jcc-input" rows={14} value={draft.notes} onChange={e => update({ notes: e.target.value })}
                  placeholder={`• Engineering culture observed:\n• Recent product launches:\n• People I've reached out to:\n• Why this company is on my list:`}/>
              </Field>
            </div>
          )}

          {tab === 'edit' && (
            <div style={{ display:'flex', flexDirection:'column', gap: 12 }}>
              <Field label="Company name"><input className="jcc-input" value={draft.name} onChange={e => update({ name: e.target.value })}/></Field>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12 }}>
                <Field label="Tier">
                  <select className="jcc-input" value={draft.tier} onChange={e => update({ tier: e.target.value })}>
                    {TIERS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                </Field>
                <Field label="Compensation tier">
                  <select className="jcc-input" value={draft.compTier} onChange={e => update({ compTier: e.target.value })}>
                    {Object.entries(COMP_TIERS).map(([k,v]) => <option key={k} value={k}>{k} · {v.label}</option>)}
                  </select>
                </Field>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12 }}>
                <Field label="Priority score (0-100)">
                  <input type="number" min={0} max={100} className="jcc-input" value={draft.priorityScore} onChange={e => update({ priorityScore: parseInt(e.target.value) || 0 })}/>
                </Field>
                <Field label="Location"><input className="jcc-input" value={draft.location} onChange={e => update({ location: e.target.value })}/></Field>
              </div>
              <Field label="Career portal URL"><input className="jcc-input" value={draft.careerUrl} onChange={e => update({ careerUrl: e.target.value })}/></Field>
              <div style={{ borderTop:'1px solid var(--hairline)', paddingTop: 16, marginTop: 6 }}>
                <button className="jcc-btn" onClick={() => { if (confirm(`Remove ${draft.name} from your list? This cannot be undone.`)) { onDelete(); onClose(); } }}
                  style={{ color:'#DC2626', borderColor:'#FECACA' }}>
                  <Trash2 size={13}/> Delete company
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding:'12px 24px', borderTop:'1px solid var(--hairline)', display:'flex', justifyContent:'space-between', alignItems:'center', background:'var(--surface-2)' }}>
          <div style={{ fontSize: 11.5, color:'var(--ink-4)' }}>Auto-saved · {new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })}</div>
          <button className="jcc-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, hint, children }) => (
  <label style={{ display:'flex', flexDirection:'column', gap: 6 }}>
    <span style={{ fontSize: 11, fontWeight: 600, color:'var(--ink-3)', textTransform:'uppercase', letterSpacing:'.04em' }}>{label}</span>
    {children}
    {hint && <span style={{ fontSize: 11.5, color:'var(--ink-4)' }}>{hint}</span>}
  </label>
);

const DetailMetric = ({ label, value, hint, accent }) => (
  <div style={{ background:'var(--surface-2)', borderRadius: 10, padding: 12, border:'1px solid var(--hairline)' }}>
    <div style={{ fontSize: 10.5, fontWeight: 600, color:'var(--ink-3)', textTransform:'uppercase', letterSpacing:'.05em', marginBottom: 6 }}>{label}</div>
    <div style={{ fontSize: 14, fontWeight: 500, color: accent || 'var(--ink)', display:'flex', alignItems:'center', gap: 6 }}>{value}</div>
    {hint && <div style={{ fontSize: 11, color:'var(--ink-4)', marginTop: 4 }}>{hint}</div>}
  </div>
);

/* ============================================================================
   PIPELINE (KANBAN) VIEW
   ========================================================================== */

const PipelineView = ({ state, setState, onOpenCompany }) => {
  const { companies } = state;
  const [dragId, setDragId] = useState(null);

  // Order the kanban columns by progression
  const columns = ['not_started', 'applied', 'referral_req', 'referral_rcvd', 'interview_sched', 'interviewing', 'offer'];

  const grouped = useMemo(() => {
    const map = {};
    columns.forEach(s => map[s] = []);
    companies.filter(c => !['rejected','archived'].includes(c.status)).forEach(c => {
      if (map[c.status]) map[c.status].push(c);
    });
    Object.keys(map).forEach(k => map[k].sort((a,b) => b.priorityScore - a.priorityScore));
    return map;
  }, [companies]);

  const moveCard = (id, newStatus) => {
    setState(s => ({
      ...s,
      companies: s.companies.map(c => c.id === id ? {
        ...c, status: newStatus,
        appliedDate: c.appliedDate || (newStatus !== 'not_started' ? todayISO() : c.appliedDate)
      } : c)
    }));
  };

  return (
    <div className="jcc-fade-in" style={{ padding:'28px 32px', display:'flex', flexDirection:'column', height:'100%' }}>
      <div style={{ marginBottom: 22, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing:'-0.02em', margin: 0 }}>Pipeline</h1>
          <p style={{ color:'var(--ink-3)', fontSize: 13, margin: '4px 0 0' }}>Drag cards across stages · click any card to open</p>
        </div>
        <div style={{ display:'flex', gap: 6 }}>
          <Pill color="var(--ink-3)" bg="var(--surface-3)" border="var(--hairline)">
            {companies.filter(c => !['rejected','archived','not_started'].includes(c.status)).length} active
          </Pill>
        </div>
      </div>

      <div className="jcc-scroll" style={{ display:'flex', gap: 12, overflowX:'auto', flex: 1, paddingBottom: 12 }}>
        {columns.map(colId => {
          const status = getStatus(colId);
          const items = grouped[colId];
          return (
            <div key={colId}
                 onDragOver={e => { e.preventDefault(); e.currentTarget.style.background = 'var(--surface-2)'; }}
                 onDragLeave={e => e.currentTarget.style.background = 'transparent'}
                 onDrop={e => { e.preventDefault(); e.currentTarget.style.background = 'transparent'; if (dragId) moveCard(dragId, colId); setDragId(null); }}
                 style={{
                   flex:'0 0 280px', display:'flex', flexDirection:'column',
                   border:'1px solid var(--hairline)', borderRadius: 12, background:'var(--surface)',
                   transition:'background .12s'
                 }}>
              {/* Column header */}
              <div style={{ padding:'12px 14px', borderBottom:'1px solid var(--hairline)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
                  <div style={{ width: 7, height: 7, borderRadius:'50%', background: status.color }}/>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color:'var(--ink-2)' }}>{status.label}</span>
                </div>
                <span className="jcc-num" style={{ fontSize: 11, color:'var(--ink-4)', fontWeight: 500 }}>{items.length}</span>
              </div>

              {/* Cards */}
              <div className="jcc-scroll" style={{ padding: 8, display:'flex', flexDirection:'column', gap: 6, overflowY:'auto', maxHeight:'calc(100vh - 220px)' }}>
                {items.length === 0 && (
                  <div style={{ fontSize: 11.5, color:'var(--ink-4)', padding:'18px 12px', textAlign:'center' }}>Empty</div>
                )}
                {items.map(c => (
                  <div key={c.id}
                       draggable
                       onDragStart={() => setDragId(c.id)}
                       onDragEnd={() => setDragId(null)}
                       onClick={() => onOpenCompany(c.id)}
                       style={{
                         background:'var(--surface)', border:'1px solid var(--hairline)', borderRadius: 9,
                         padding: 11, cursor:'grab', transition:'all .12s',
                         opacity: dragId === c.id ? 0.5 : 1
                       }}
                       onMouseEnter={e => { e.currentTarget.style.borderColor = '#CBD5E1'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,.04)'; }}
                       onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--hairline)'; e.currentTarget.style.boxShadow = 'none'; }}>
                    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap: 8, marginBottom: 6 }}>
                      <div style={{ fontSize: 13, fontWeight: 550, lineHeight: 1.3 }}>{c.name}</div>
                      <TierBadge tierId={c.tier}/>
                    </div>
                    <div style={{ fontSize: 11, color:'var(--ink-3)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <span>{c.compTier}</span>
                      {c.appliedDate && <span className="jcc-num">{daysSince(c.appliedDate)}d</span>}
                    </div>
                    {c.followUpDate && new Date(c.followUpDate) <= new Date() && (
                      <div style={{ marginTop: 6, fontSize: 10.5, color:'#D97706', display:'flex', alignItems:'center', gap: 4, fontWeight: 500 }}>
                        <Bell size={10}/> Follow-up due
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ============================================================================
   PREP VIEW (STAR Stories + Topics)
   ========================================================================== */

const PrepView = ({ state, setState }) => {
  const { starStories } = state;
  const [activeStory, setActiveStory] = useState(starStories[0]?.id);

  const update = (id, patch) => {
    setState(s => ({ ...s, starStories: s.starStories.map(st => st.id === id ? { ...st, ...patch } : st) }));
  };

  const addStory = () => {
    const id = `s_${Date.now()}`;
    setState(s => ({ ...s, starStories: [...s.starStories, { id, title: 'New story', situation:'', task:'', action:'', result:'' }] }));
    setActiveStory(id);
  };

  const removeStory = (id) => {
    if (!confirm('Remove this story?')) return;
    setState(s => ({ ...s, starStories: s.starStories.filter(st => st.id !== id) }));
  };

  const story = starStories.find(s => s.id === activeStory) || starStories[0];

  return (
    <div className="jcc-fade-in" style={{ padding:'28px 32px', maxWidth: 1400, margin:'0 auto' }}>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing:'-0.02em', margin: 0 }}>Interview Prep</h1>
        <p style={{ color:'var(--ink-3)', fontSize: 13, margin: '4px 0 0' }}>STAR story bank · keep 6+ stories ready</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'280px 1fr', gap: 16 }}>
        {/* Stories list */}
        <div className="jcc-card" style={{ padding: 12, height:'fit-content' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'4px 8px 12px' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color:'var(--ink-3)', textTransform:'uppercase', letterSpacing:'.04em' }}>Stories ({starStories.length})</span>
            <button className="jcc-btn jcc-btn-ghost" onClick={addStory} style={{ padding: 4 }} title="Add story"><Plus size={14}/></button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap: 2 }}>
            {starStories.map(s => {
              const filled = [s.situation, s.task, s.action, s.result].filter(Boolean).length;
              return (
                <div key={s.id} onClick={() => setActiveStory(s.id)} style={{
                  padding:'10px 10px', borderRadius: 7, cursor:'pointer',
                  background: s.id === activeStory ? 'var(--primary-50)' : 'transparent',
                  display:'flex', justifyContent:'space-between', alignItems:'center', gap: 8
                }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: s.id === activeStory ? 'var(--primary)' : 'var(--ink-2)',
                                  whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{s.title}</div>
                    <div style={{ fontSize: 11, color:'var(--ink-4)', marginTop: 1 }}>{filled}/4 sections</div>
                  </div>
                  <div style={{ width: 28, height: 5, borderRadius: 3, background:'var(--hairline)', overflow:'hidden' }}>
                    <div style={{ width: `${filled*25}%`, height:'100%', background: filled === 4 ? '#059669' : 'var(--secondary)' }}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Story editor */}
        {story && (
          <div className="jcc-card" style={{ padding: 20 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 16 }}>
              <input className="jcc-input" value={story.title} onChange={e => update(story.id, { title: e.target.value })}
                style={{ fontSize: 16, fontWeight: 600, border:'none', padding: 0, flex: 1 }}/>
              <button className="jcc-btn jcc-btn-ghost" onClick={() => removeStory(story.id)} style={{ color:'#DC2626' }}><Trash2 size={13}/></button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 14 }}>
              {[
                { key:'situation', label:'Situation', hint:'Context · stakes · scale' },
                { key:'task',      label:'Task',      hint:'Your specific responsibility' },
                { key:'action',    label:'Action',    hint:'What YOU did, not the team' },
                { key:'result',    label:'Result',    hint:'Quantified impact, ideally' },
              ].map(({ key, label, hint }) => (
                <Field key={key} label={label} hint={hint}>
                  <textarea className="jcc-input" rows={6} value={story[key]} onChange={e => update(story.id, { [key]: e.target.value })}/>
                </Field>
              ))}
            </div>
            <div style={{ marginTop: 18, background:'var(--surface-3)', borderRadius: 10, padding: 14, fontSize: 12.5, color:'var(--ink-2)' }}>
              <strong style={{ color:'var(--primary)' }}>Coverage check:</strong> A strong story bank covers (1) ownership & impact, (2) ambiguity & judgement,
              (3) conflict & influence, (4) failure & learning, (5) technical depth, (6) cross-functional execution.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ============================================================================
   TEMPLATES VIEW (Outreach)
   ========================================================================== */

const TemplatesView = ({ state, setState, onToast }) => {
  const { templates } = state;
  const [active, setActive] = useState(templates[0]?.id);

  const update = (id, patch) => {
    setState(s => ({ ...s, templates: s.templates.map(t => t.id === id ? { ...t, ...patch } : t) }));
  };

  const addTemplate = () => {
    const id = `t_${Date.now()}`;
    setState(s => ({ ...s, templates: [...s.templates, { id, name:'New template', body:'' }] }));
    setActive(id);
  };

  const removeTemplate = (id) => {
    if (!confirm('Remove this template?')) return;
    setState(s => ({ ...s, templates: s.templates.filter(t => t.id !== id) }));
  };

  const tpl = templates.find(t => t.id === active) || templates[0];

  const copy = () => {
    if (!tpl) return;
    navigator.clipboard?.writeText(tpl.body);
    onToast('Template copied');
  };

  return (
    <div className="jcc-fade-in" style={{ padding:'28px 32px', maxWidth: 1400, margin:'0 auto' }}>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing:'-0.02em', margin: 0 }}>Outreach Templates</h1>
        <p style={{ color:'var(--ink-3)', fontSize: 13, margin: '4px 0 0' }}>Reusable scripts for referrals, recruiters, follow-ups · placeholders in <code className="jcc-mono" style={{ background:'var(--surface-3)', padding:'1px 4px', borderRadius: 3 }}>{'{braces}'}</code></p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'280px 1fr', gap: 16 }}>
        <div className="jcc-card" style={{ padding: 12, height:'fit-content' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'4px 8px 12px' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color:'var(--ink-3)', textTransform:'uppercase', letterSpacing:'.04em' }}>Templates ({templates.length})</span>
            <button className="jcc-btn jcc-btn-ghost" onClick={addTemplate} style={{ padding: 4 }} title="Add template"><Plus size={14}/></button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap: 2 }}>
            {templates.map(t => (
              <div key={t.id} onClick={() => setActive(t.id)} style={{
                padding:'10px 10px', borderRadius: 7, cursor:'pointer',
                background: t.id === active ? 'var(--primary-50)' : 'transparent'
              }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: t.id === active ? 'var(--primary)' : 'var(--ink-2)' }}>{t.name}</div>
                <div style={{ fontSize: 11, color:'var(--ink-4)', marginTop: 2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                  {t.body.slice(0, 60)}…
                </div>
              </div>
            ))}
          </div>
        </div>

        {tpl && (
          <div className="jcc-card" style={{ padding: 20 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 14, gap: 8 }}>
              <input className="jcc-input" value={tpl.name} onChange={e => update(tpl.id, { name: e.target.value })}
                style={{ fontSize: 16, fontWeight: 600, border:'none', padding: 0, flex: 1 }}/>
              <div style={{ display:'flex', gap: 6 }}>
                <button className="jcc-btn jcc-btn-primary" onClick={copy}><Copy size={13}/> Copy</button>
                <button className="jcc-btn jcc-btn-ghost" onClick={() => removeTemplate(tpl.id)} style={{ color:'#DC2626' }}><Trash2 size={13}/></button>
              </div>
            </div>
            <textarea className="jcc-input jcc-mono" rows={18}
              value={tpl.body} onChange={e => update(tpl.id, { body: e.target.value })}
              style={{ fontSize: 12.5, lineHeight: 1.7 }}/>
            <div style={{ marginTop: 12, fontSize: 11.5, color:'var(--ink-4)' }}>
              Common placeholders: <code className="jcc-mono">{'{Name}'}</code>, <code className="jcc-mono">{'{Company}'}</code>, <code className="jcc-mono">{'{Role}'}</code>, <code className="jcc-mono">{'{topic}'}</code>, <code className="jcc-mono">{'{link}'}</code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ============================================================================
   SETTINGS VIEW (Export, Import, Tags)
   ========================================================================== */

const SettingsView = ({ state, setState, onToast }) => {
  const fileInputRef = useRef(null);

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type:'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `jcc-backup-${todayISO()}.json`; a.click();
    URL.revokeObjectURL(url);
    onToast('Backup downloaded');
  };

  const exportCSV = () => {
    const rows = [['Name','Tier','Comp','Priority','Status','Applied','FollowUp','Contact','Referral','Salary','Location','Tags','Notes','InterviewNotes','CareerURL']];
    state.companies.forEach(c => rows.push([
      c.name, c.tier, c.compTier, c.priorityScore, c.status, c.appliedDate || '', c.followUpDate || '',
      c.contactName || '', c.referralStatus, c.salaryExpectation || '', c.location, (c.tags||[]).join('; '),
      (c.notes||'').replace(/\n/g,' | '), (c.interviewNotes||'').replace(/\n/g,' | '), c.careerUrl
    ]));
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type:'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `jcc-companies-${todayISO()}.csv`; a.click();
    URL.revokeObjectURL(url);
    onToast('CSV downloaded');
  };

  const exportXLSX = () => {
    const sheetData = state.companies.map(c => ({
      Name: c.name, Tier: getTier(c.tier).label, 'Comp Tier': c.compTier, Priority: c.priorityScore,
      Status: getStatus(c.status).label, 'Applied Date': c.appliedDate || '', 'Follow-up': c.followUpDate || '',
      Contact: c.contactName, Referral: c.referralStatus, Salary: c.salaryExpectation, Location: c.location,
      Tags: (c.tags||[]).join(', '), 'Career URL': c.careerUrl, Notes: c.notes, 'Interview Notes': c.interviewNotes
    }));
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(sheetData);
    ws['!cols'] = [{wch:22},{wch:24},{wch:10},{wch:10},{wch:18},{wch:14},{wch:14},{wch:18},{wch:14},{wch:20},{wch:24},{wch:24},{wch:40},{wch:40},{wch:40}];
    XLSX.utils.book_append_sheet(wb, ws, 'Companies');

    if (state.starStories.length) {
      const stWs = XLSX.utils.json_to_sheet(state.starStories);
      XLSX.utils.book_append_sheet(wb, stWs, 'STAR Stories');
    }
    XLSX.writeFile(wb, `jcc-companies-${todayISO()}.xlsx`);
    onToast('Excel file downloaded');
  };

  const importJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!confirm('Restore will replace all current data. Continue?')) { e.target.value = ''; return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (!parsed.companies) throw new Error('Invalid backup');
        setState(parsed);
        onToast('Backup restored');
      } catch (err) {
        alert('Could not restore backup — file appears invalid.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const addTag = () => {
    const t = prompt('New tag name (kebab-case recommended):');
    if (!t) return;
    const clean = t.trim().toLowerCase();
    if (state.tags.includes(clean)) return;
    setState(s => ({ ...s, tags: [...s.tags, clean] }));
  };

  const removeTag = (tag) => {
    if (!confirm(`Remove tag "${tag}"? It will be removed from all companies.`)) return;
    setState(s => ({
      ...s, tags: s.tags.filter(t => t !== tag),
      companies: s.companies.map(c => ({ ...c, tags: (c.tags||[]).filter(t => t !== tag) }))
    }));
  };

  const resetAll = () => {
    if (!confirm('Reset EVERYTHING to defaults? All your tracking will be lost. This cannot be undone.')) return;
    if (!confirm('Final confirmation — are you absolutely sure?')) return;
    setState(defaultState());
    onToast('Reset to defaults');
  };

  return (
    <div className="jcc-fade-in" style={{ padding:'28px 32px', maxWidth: 900, margin:'0 auto' }}>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing:'-0.02em', margin: 0 }}>Settings</h1>
        <p style={{ color:'var(--ink-3)', fontSize: 13, margin: '4px 0 0' }}>Export, restore, customize</p>
      </div>

      {/* Export */}
      <div className="jcc-card" style={{ padding: 20, marginBottom: 16 }}>
        <div style={{ display:'flex', alignItems:'center', gap: 8, marginBottom: 6 }}>
          <Download size={15} style={{ color:'var(--primary)' }}/>
          <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Export your data</h3>
        </div>
        <p style={{ fontSize: 12.5, color:'var(--ink-3)', margin:'0 0 14px' }}>Download a copy you can keep, share, or back up.</p>
        <div style={{ display:'flex', gap: 8 }}>
          <button className="jcc-btn jcc-btn-primary" onClick={exportXLSX}><FileText size={13}/> Excel (.xlsx)</button>
          <button className="jcc-btn" onClick={exportCSV}><FileText size={13}/> CSV</button>
          <button className="jcc-btn" onClick={exportJSON}><Download size={13}/> JSON backup</button>
        </div>
      </div>

      {/* Restore */}
      <div className="jcc-card" style={{ padding: 20, marginBottom: 16 }}>
        <div style={{ display:'flex', alignItems:'center', gap: 8, marginBottom: 6 }}>
          <Upload size={15} style={{ color:'var(--primary)' }}/>
          <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Restore from backup</h3>
        </div>
        <p style={{ fontSize: 12.5, color:'var(--ink-3)', margin:'0 0 14px' }}>Restore a previously exported JSON backup. This replaces your current data.</p>
        <input ref={fileInputRef} type="file" accept=".json" onChange={importJSON} style={{ display:'none' }}/>
        <button className="jcc-btn" onClick={() => fileInputRef.current?.click()}><Upload size={13}/> Choose backup file…</button>
      </div>

      {/* Tags */}
      <div className="jcc-card" style={{ padding: 20, marginBottom: 16 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 12 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
              <Tag size={15} style={{ color:'var(--primary)' }}/>
              <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Custom tags</h3>
            </div>
            <p style={{ fontSize: 12.5, color:'var(--ink-3)', margin:'4px 0 0' }}>Tags appear on company cards and as filters.</p>
          </div>
          <button className="jcc-btn" onClick={addTag}><Plus size={13}/> Add tag</button>
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap: 6 }}>
          {state.tags.map(t => (
            <span key={t} className="jcc-pill" style={{ background:'var(--secondary-50)', color:'var(--secondary)', display:'inline-flex', alignItems:'center', gap: 6, padding:'3px 4px 3px 8px' }}>
              <Hash size={9}/>{t}
              <button onClick={() => removeTag(t)} style={{ border:'none', background:'transparent', cursor:'pointer', padding: 2, display:'flex', borderRadius: 3, color:'var(--secondary)' }}>
                <X size={10}/>
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Danger */}
      <div className="jcc-card" style={{ padding: 20, borderColor:'#FECACA' }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, margin:'0 0 6px', color:'#DC2626' }}>Reset application</h3>
        <p style={{ fontSize: 12.5, color:'var(--ink-3)', margin:'0 0 14px' }}>Clear everything and restart with the seed database. Export a backup first.</p>
        <button className="jcc-btn" onClick={resetAll} style={{ color:'#DC2626', borderColor:'#FECACA' }}>
          <Trash2 size={13}/> Reset everything
        </button>
      </div>
    </div>
  );
};

/* ============================================================================
   ADD COMPANY MODAL
   ========================================================================== */

const AddCompanyModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({
    name: '', tier: 'tier2', compTier: '$$$', priorityScore: 75,
    location: '', careerUrl: ''
  });

  const submit = () => {
    if (!form.name.trim()) return;
    const id = form.name.toLowerCase().replace(/[^a-z0-9]+/g,'-') + '-' + Date.now().toString(36);
    onSave(buildCompany({ id, ...form }));
    onClose();
  };

  return (
    <div className="jcc-modal-overlay" onClick={onClose}>
      <div className="jcc-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 560 }}>
        <div style={{ padding:'18px 22px', borderBottom:'1px solid var(--hairline)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Add company</h2>
          <button className="jcc-btn jcc-btn-ghost" onClick={onClose} style={{ padding: 6 }}><X size={16}/></button>
        </div>
        <div style={{ padding: 22, display:'flex', flexDirection:'column', gap: 12 }}>
          <Field label="Company name *">
            <input className="jcc-input" autoFocus value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}/>
          </Field>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12 }}>
            <Field label="Tier">
              <select className="jcc-input" value={form.tier} onChange={e => setForm({ ...form, tier: e.target.value })}>
                {TIERS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </Field>
            <Field label="Compensation">
              <select className="jcc-input" value={form.compTier} onChange={e => setForm({ ...form, compTier: e.target.value })}>
                {Object.entries(COMP_TIERS).map(([k,v]) => <option key={k} value={k}>{k} · {v.label}</option>)}
              </select>
            </Field>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12 }}>
            <Field label="Priority score (0-100)">
              <input type="number" min={0} max={100} className="jcc-input" value={form.priorityScore} onChange={e => setForm({ ...form, priorityScore: parseInt(e.target.value) || 0 })}/>
            </Field>
            <Field label="Location">
              <input className="jcc-input" placeholder="e.g. Bengaluru" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}/>
            </Field>
          </div>
          <Field label="Career portal URL" hint="Ideally pre-filtered for data engineer / India">
            <input className="jcc-input" placeholder="https://…" value={form.careerUrl} onChange={e => setForm({ ...form, careerUrl: e.target.value })}/>
          </Field>
        </div>
        <div style={{ padding:'14px 22px', borderTop:'1px solid var(--hairline)', display:'flex', justifyContent:'flex-end', gap: 8, background:'var(--surface-2)' }}>
          <button className="jcc-btn" onClick={onClose}>Cancel</button>
          <button className="jcc-btn jcc-btn-primary" onClick={submit}>Add company</button>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   ROOT APP
   ========================================================================== */

export default function App() {
  const [state, setState, loaded] = useStorage();
  const [tab, setTab] = useState('dashboard');
  const [openCompanyId, setOpenCompanyId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState('');
  const [globalQuery, setGlobalQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Keyboard shortcut: ⌘K / Ctrl+K opens global search
  useEffect(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setShowSearch(true); }
      if (e.key === 'Escape') { setShowSearch(false); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const searchResults = useMemo(() => {
    if (!globalQuery || !state) return [];
    const q = globalQuery.toLowerCase();
    return state.companies.filter(c =>
      c.name.toLowerCase().includes(q) ||
      (c.location||'').toLowerCase().includes(q) ||
      (c.notes||'').toLowerCase().includes(q) ||
      (c.tags||[]).some(t => t.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [globalQuery, state]);

  if (!loaded || !state) {
    return (
      <div className="jcc" style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--surface-2)' }}>
        <GlobalStyles/>
        <div style={{ fontSize: 13, color:'var(--ink-3)' }}>Loading…</div>
      </div>
    );
  }

  const openCompany = state.companies.find(c => c.id === openCompanyId);

  const updateCompany = (next) => {
    setState(s => ({ ...s, companies: s.companies.map(c => c.id === next.id ? next : c) }));
  };

  const deleteCompany = (id) => {
    setState(s => ({ ...s, companies: s.companies.filter(c => c.id !== id) }));
    setOpenCompanyId(null);
    setToast('Company removed');
  };

  const addCompany = (c) => {
    setState(s => ({ ...s, companies: [c, ...s.companies] }));
    setToast('Company added');
  };

  const NavItem = ({ id, icon: Icon, label, count }) => (
    <div className={cls('jcc-sidebar-item', tab === id && 'active')} onClick={() => setTab(id)}>
      <Icon size={15}/>
      <span style={{ flex: 1 }}>{label}</span>
      {count !== undefined && count > 0 && (
        <span className="jcc-num" style={{ fontSize: 11, color: tab === id ? 'var(--primary)' : 'var(--ink-4)' }}>{count}</span>
      )}
    </div>
  );

  const followupsDue = state.companies.filter(c => c.followUpDate && new Date(c.followUpDate) <= new Date() && !['offer','rejected','archived'].includes(c.status)).length;
  const interviewsActive = state.companies.filter(c => ['interview_sched','interviewing'].includes(c.status)).length;

  return (
    <div className="jcc" style={{ height:'100vh', display:'flex', overflow:'hidden', background:'var(--surface-2)' }}>
      <GlobalStyles/>

      {/* Sidebar */}
      <aside style={{ width: 232, flexShrink: 0, background:'var(--surface)', borderRight:'1px solid var(--hairline)', display:'flex', flexDirection:'column' }}>
        {/* Brand */}
        <div style={{ padding:'18px 16px 14px', borderBottom:'1px solid var(--hairline)' }}>
          <div style={{ display:'flex', alignItems:'center', gap: 9 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 7,
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              display:'flex', alignItems:'center', justifyContent:'center'
            }}>
              <Zap size={14} color="white" strokeWidth={2.5}/>
            </div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600, letterSpacing:'-0.01em' }}>Command Center</div>
              <div style={{ fontSize: 10.5, color:'var(--ink-4)', letterSpacing:'.04em', textTransform:'uppercase' }}>Job Search</div>
            </div>
          </div>
        </div>

        {/* Search trigger */}
        <div style={{ padding:'12px 12px 4px' }}>
          <button onClick={() => setShowSearch(true)} style={{
            width:'100%', display:'flex', alignItems:'center', gap: 8,
            padding:'7px 10px', borderRadius: 7, border:'1px solid var(--hairline)',
            background:'var(--surface-2)', color:'var(--ink-3)', fontSize: 12.5,
            cursor:'pointer', transition:'all .12s', fontFamily:'inherit'
          }} onMouseEnter={e => e.currentTarget.style.borderColor='#CBD5E1'}
             onMouseLeave={e => e.currentTarget.style.borderColor='var(--hairline)'}>
            <Search size={13}/>
            <span style={{ flex: 1, textAlign:'left' }}>Search companies…</span>
            <span className="jcc-kbd">⌘K</span>
          </button>
        </div>

        {/* Nav */}
        <nav style={{ padding:'10px 12px', display:'flex', flexDirection:'column', gap: 1, flex: 1 }}>
          <NavItem id="dashboard"  icon={LayoutDashboard}  label="Dashboard"/>
          <NavItem id="companies"  icon={Building2}        label="Companies"  count={state.companies.length}/>
          <NavItem id="pipeline"   icon={KanbanSquare}     label="Pipeline"   count={interviewsActive}/>
          <NavItem id="prep"       icon={GraduationCap}    label="Prep"       count={state.starStories.length}/>
          <NavItem id="templates"  icon={MessageSquareText} label="Templates"  count={state.templates.length}/>

          <div style={{ height: 14 }}/>
          <div style={{ fontSize: 10.5, fontWeight: 600, color:'var(--ink-4)', textTransform:'uppercase', letterSpacing:'.05em', padding:'4px 10px 6px' }}>Account</div>
          <NavItem id="settings"  icon={SettingsIcon} label="Settings"/>

          {followupsDue > 0 && (
            <div style={{ marginTop:'auto', padding: 12, marginBottom: 6 }}>
              <div onClick={() => setTab('pipeline')} style={{
                background:'#FEF3C7', borderRadius: 9, padding: 12, cursor:'pointer',
                border:'1px solid #FDE68A'
              }}>
                <div style={{ display:'flex', alignItems:'center', gap: 6, marginBottom: 4 }}>
                  <Bell size={12} style={{ color:'#D97706' }}/>
                  <span style={{ fontSize: 11.5, fontWeight: 600, color:'#92400E' }}>Follow-ups due</span>
                </div>
                <div style={{ fontSize: 11.5, color:'#78350F' }}>
                  <strong className="jcc-num">{followupsDue}</strong> compan{followupsDue===1?'y':'ies'} need attention.
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Footer */}
        <div style={{ padding:'12px 16px', borderTop:'1px solid var(--hairline)', fontSize: 11, color:'var(--ink-4)' }}>
          <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius:'50%', background:'#10B981' }}/>
            Synced locally
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="jcc-scroll" style={{ flex: 1, overflow:'auto', background:'var(--surface-2)' }}>
        {tab === 'dashboard'  && <Dashboard   state={state} setState={setState} onJump={setTab} onOpenCompany={setOpenCompanyId}/>}
        {tab === 'companies'  && <CompaniesView state={state} setState={setState} onOpenCompany={setOpenCompanyId} onAddCompany={() => setShowAdd(true)} onToast={setToast}/>}
        {tab === 'pipeline'   && <PipelineView  state={state} setState={setState} onOpenCompany={setOpenCompanyId}/>}
        {tab === 'prep'       && <PrepView      state={state} setState={setState}/>}
        {tab === 'templates'  && <TemplatesView state={state} setState={setState} onToast={setToast}/>}
        {tab === 'settings'   && <SettingsView  state={state} setState={setState} onToast={setToast}/>}
      </main>

      {/* Company detail modal */}
      {openCompany && (
        <CompanyDetail company={openCompany} allTags={state.tags}
          onClose={() => setOpenCompanyId(null)}
          onUpdate={updateCompany}
          onDelete={() => deleteCompany(openCompany.id)}/>
      )}

      {/* Add company modal */}
      {showAdd && <AddCompanyModal onClose={() => setShowAdd(false)} onSave={addCompany}/>}

      {/* Global search */}
      {showSearch && (
        <div className="jcc-modal-overlay" onClick={() => setShowSearch(false)} style={{ paddingTop:'12vh' }}>
          <div className="jcc-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 560, padding: 0, overflow:'hidden' }}>
            <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--hairline)', display:'flex', alignItems:'center', gap: 10 }}>
              <Search size={15} style={{ color:'var(--ink-3)' }}/>
              <input autoFocus className="jcc-input" placeholder="Search companies, notes, locations…"
                value={globalQuery} onChange={e => setGlobalQuery(e.target.value)}
                style={{ border:'none', padding: 0, fontSize: 15 }}/>
              <span className="jcc-kbd">ESC</span>
            </div>
            <div className="jcc-scroll" style={{ maxHeight: '50vh', overflow:'auto' }}>
              {searchResults.length === 0 ? (
                <div style={{ padding: 36, textAlign:'center', color:'var(--ink-4)', fontSize: 13 }}>
                  {globalQuery ? 'No matches.' : 'Start typing to search.'}
                </div>
              ) : searchResults.map(c => (
                <div key={c.id} onClick={() => { setOpenCompanyId(c.id); setShowSearch(false); setGlobalQuery(''); }}
                  style={{ padding:'12px 18px', borderBottom:'1px solid var(--hairline-2)', cursor:'pointer', display:'flex', alignItems:'center', gap: 12 }}
                  onMouseEnter={e => e.currentTarget.style.background='var(--surface-2)'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background:'var(--primary-50)',
                                color:'var(--primary)', display:'flex', alignItems:'center', justifyContent:'center',
                                fontWeight: 600, fontSize: 12 }}>{c.name.slice(0,2).toUpperCase()}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 550 }}>{c.name}</div>
                    <div style={{ fontSize: 11.5, color:'var(--ink-3)' }}>{c.location} · {c.compTier}</div>
                  </div>
                  <StatusBadge statusId={c.status}/>
                  <ArrowRight size={13} style={{ color:'var(--ink-4)' }}/>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Toast message={toast} onDone={() => setToast('')}/>
    </div>
  );
}

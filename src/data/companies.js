export const defaultPrepChecklist = () => ([
  { id: 'sql', label: 'SQL deep practice (window functions, optimization)', done: false },
  { id: 'pyspark', label: 'PySpark internals & AQE', done: false },
  { id: 'system', label: 'Data system design (lakehouse, streaming)', done: false },
  { id: 'behav', label: 'STAR stories — 6 prepared', done: false },
  { id: 'company', label: 'Company research (product, scale, stack)', done: false },
  { id: 'questions', label: '5 thoughtful questions for interviewer', done: false },
]);

export const DEFAULT_STAR_STORIES = [
  { id: 's1', title: 'Owned a high-impact data migration', situation: '', task: '', action: '', result: '' },
  { id: 's2', title: 'Resolved a critical production incident', situation: '', task: '', action: '', result: '' },
  { id: 's3', title: 'Led cross-functional alignment', situation: '', task: '', action: '', result: '' },
];

export const DEFAULT_TEMPLATES = [
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

export const SEED_COMPANIES = [
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

export const buildCompany = (c) => ({
  appliedDate: null, followUpDate: null, contactName: '', referralStatus: 'none',
  interviewNotes: '', notes: '', salaryExpectation: '', tags: [], status: 'not_started',
  prepChecklist: defaultPrepChecklist(),
  activityLog: [],
  roleSearch: { lastCheckedAt: null, matchCount: null, topRole: null, termsSearched: 0, lastQuery: null },
  ...c,
});

export const defaultState = () => ({
  companies: SEED_COMPANIES.map(buildCompany),
  tags: ['high-priority', 'remote-ok', 'visa-sponsor', 'ai-infra', 'platform'],
  starStories: DEFAULT_STAR_STORIES,
  templates: DEFAULT_TEMPLATES,
  customGroups: [],
  searchPreferences: { roleFocus: 'data_plus_ai', smartSearchMode: true },
  schemaVersion: 3,
});

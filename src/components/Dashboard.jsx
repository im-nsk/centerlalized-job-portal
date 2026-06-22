import { useMemo } from 'react';
import {
  Building2, Send, Activity, Briefcase, CheckCircle2, Bell, TrendingUp, Star,
  ChevronRight, XCircle, Clock, Search, ArrowRight,
} from 'lucide-react';
import { daysSince, fmtDate } from '../utils/helpers.js';
import { buildRecentActivity, isFollowUpDue } from '../utils/companyFilters.js';
import { Pill } from './ui/Pill.jsx';
import { StatusBadge } from './ui/StatusBadge.jsx';

const ACTIVITY_ICONS = {
  applied: Send,
  followup: Bell,
  search: Search,
};

export default function Dashboard({ state, onJump, onOpenCompany, onViewCompanies }) {
  const { companies } = state;

  const stats = useMemo(() => {
    const applied   = companies.filter(c => !['not_started','archived'].includes(c.status)).length;
    const interview = companies.filter(c => ['interview_sched','interviewing'].includes(c.status)).length;
    const offers    = companies.filter(c => c.status === 'offer').length;
    const rejected  = companies.filter(c => c.status === 'rejected').length;
    const today = new Date(); today.setHours(0,0,0,0);
    const followups = companies.filter(c => isFollowUpDue(c));
    return { total: companies.length, applied, interview, offers, rejected, followups };
  }, [companies]);

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

  const topUntouched = useMemo(() =>
    companies.filter(c => c.status === 'not_started').sort((a,b) => b.priorityScore - a.priorityScore).slice(0, 5)
  , [companies]);

  const recentActivity = useMemo(() => buildRecentActivity(companies, 10), [companies]);

  const StatCard = ({ icon: Icon, label, value, hint, accent, onClick }) => (
    <div
      className="jcc-card jcc-card-hover"
      style={{ padding: 18, cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 14 }}>
        <span style={{ color:'var(--ink-3)', fontSize:12, fontWeight:500, letterSpacing:'.02em', textTransform:'uppercase' }}>{label}</span>
        <Icon size={15} style={{ color: accent || 'var(--ink-4)' }}/>
      </div>
      <div className="jcc-num" style={{ fontSize: 30, fontWeight: 600, color:'var(--ink)', lineHeight: 1 }}>{value}</div>
      {hint && <div style={{ fontSize:11.5, color:'var(--ink-4)', marginTop: 8 }}>{hint}</div>}
    </div>
  );

  return (
    <div className="jcc-fade-in jcc-page">
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 12, color:'var(--ink-3)', fontWeight: 500, letterSpacing:'.04em', textTransform:'uppercase', marginBottom: 6 }}>
          Command Center · {new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long' })}
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, Nishant.</h1>
        <p style={{ color:'var(--ink-3)', fontSize: 14, marginTop: 6, marginBottom: 0 }}>
          {stats.followups.length > 0
            ? <>You have <strong style={{ color:'#D97706' }}>{stats.followups.length} follow-up{stats.followups.length>1?'s':''} due.</strong>{' '}
              <button type="button" className="jcc-link" style={{ background:'none', border:'none', padding:0, cursor:'pointer', font:'inherit' }} onClick={() => onViewCompanies('followup')}>View queue →</button>
            </>
            : <>{stats.applied} active application{stats.applied!==1?'s':''} · {stats.interview} in interviews · {topUntouched.length} priority targets untouched.</>
          }
        </p>
      </div>

      <div className="jcc-stat-grid">
        <StatCard icon={Building2}    label="Companies"   value={stats.total}     hint="View all"                        accent="var(--primary)" onClick={() => onViewCompanies('all')} />
        <StatCard icon={Send}         label="Applied"     value={stats.applied}   hint="Active applications"             accent="var(--secondary)" onClick={() => onViewCompanies('applied')} />
        <StatCard icon={Briefcase}    label="Interviews"  value={stats.interview} hint="In progress"                     accent="#D97706" onClick={() => onViewCompanies('interview')} />
        <StatCard icon={Bell}         label="Follow-ups"  value={stats.followups.length} hint="Due or overdue"            accent={stats.followups.length > 0 ? '#D97706' : 'var(--ink-4)'} onClick={() => onViewCompanies('followup')} />
        <StatCard icon={CheckCircle2} label="Offers"      value={stats.offers}    hint="Live offers"                     accent="#059669" onClick={() => onViewCompanies('offer')} />
        <StatCard icon={XCircle}      label="Rejected"    value={stats.rejected}  hint="Closed applications"             accent="#DC2626" onClick={() => onViewCompanies('rejected')} />
      </div>

      <div className="jcc-grid-2col">
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

      <div className="jcc-card" style={{ padding: 20, marginBottom: 16 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 14 }}>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Recent activity</h3>
            <p style={{ fontSize: 12, color:'var(--ink-3)', margin: '2px 0 0' }}>Applications, follow-ups, and role searches</p>
          </div>
          <button
            type="button"
            className="jcc-btn jcc-btn-sm jcc-btn-ghost"
            onClick={() => onViewCompanies('applied')}
          >
            View all <ArrowRight size={13}/>
          </button>
        </div>
        {recentActivity.length === 0 ? (
          <div style={{ color:'var(--ink-3)', fontSize: 13, padding:'12px 0' }}>
            No activity yet. Apply to your first company to see updates here.
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column' }}>
            {recentActivity.map((item) => {
              const Icon = ACTIVITY_ICONS[item.type] || Activity;
              const due = item.type === 'followup' && isFollowUpDue(item.company);
              return (
                <div
                  key={item.id}
                  onClick={() => onOpenCompany(item.company.id)}
                  className="jcc-list-row"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && onOpenCompany(item.company.id)}
                >
                  <div style={{ display:'flex', alignItems:'center', gap: 12, minWidth: 0 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                      background: due ? '#FEF3C7' : 'var(--surface-3)',
                      color: due ? '#D97706' : 'var(--ink-3)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                    }}>
                      <Icon size={13}/>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 550, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.company.name}</div>
                      <div style={{ fontSize: 11.5, color:'var(--ink-3)', display:'flex', alignItems:'center', gap: 6 }}>
                        <span>{item.label}</span>
                        <span style={{ color:'var(--ink-4)' }}>·</span>
                        <Clock size={10}/>
                        <span>{fmtDate(item.date)}</span>
                        {item.type === 'applied' && item.company.appliedDate && (
                          <span style={{ color:'var(--ink-4)' }}>({daysSince(item.company.appliedDate) === 0 ? 'today' : `${daysSince(item.company.appliedDate)}d ago`})</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap: 8, flexShrink: 0 }}>
                    {due && <Pill color="#92400E" bg="#FEF3C7" border="#FDE68A">Due</Pill>}
                    <StatusBadge statusId={item.company.status}/>
                    <ChevronRight size={14} style={{ color:'var(--ink-4)' }}/>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="jcc-grid-2col-equal">
        <div className="jcc-card" style={{ padding: 20 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 14 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Priority targets · untouched</h3>
            <Star size={14} style={{ color:'#D97706' }}/>
          </div>
          {topUntouched.length === 0 ? (
            <div style={{ color:'var(--ink-3)', fontSize: 13, padding:'12px 0' }}>You're working through everything.</div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column' }}>
              {topUntouched.map(c => (
                <div key={c.id} onClick={() => onOpenCompany(c.id)} className="jcc-list-row" role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onOpenCompany(c.id)}>
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

        <div className="jcc-card" style={{ padding: 20 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 14 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Quick actions</h3>
            <Activity size={14} style={{ color:'var(--ink-4)' }}/>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap: 8 }}>
            {[
              { label: 'Follow-up queue', preset: 'followup', hint: `${stats.followups.length} due`, accent: '#D97706' },
              { label: 'Active applications', preset: 'applied', hint: `${stats.applied} companies`, accent: 'var(--secondary)' },
              { label: 'Interview pipeline', preset: 'interview', hint: `${stats.interview} in progress`, accent: '#D97706' },
              { label: 'Live offers', preset: 'offer', hint: `${stats.offers} offer${stats.offers !== 1 ? 's' : ''}`, accent: '#059669' },
            ].map((action) => (
              <button
                key={action.preset}
                type="button"
                className="jcc-card-interactive"
                onClick={() => onViewCompanies(action.preset)}
                style={{
                  display:'flex', alignItems:'center', justifyContent:'space-between',
                  padding:'12px 14px', borderRadius: 9, border:'1px solid var(--hairline)',
                  background:'var(--surface)', cursor:'pointer', textAlign:'left', width:'100%',
                  fontFamily:'inherit',
                }}
              >
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 550, color:'var(--ink)' }}>{action.label}</div>
                  <div style={{ fontSize: 11.5, color:'var(--ink-3)', marginTop: 2 }}>{action.hint}</div>
                </div>
                <ChevronRight size={14} style={{ color: action.accent }}/>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

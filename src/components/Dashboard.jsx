import { useMemo } from 'react';
import {
  Building2, Send, Activity, Briefcase, CheckCircle2, Bell, TrendingUp, Star,
  ChevronRight, CircleDot,
} from 'lucide-react';
import { getStatus, daysSince } from '../utils/helpers.js';
import { Pill } from './ui/Pill.jsx';
import { StatusBadge } from './ui/StatusBadge.jsx';

export default function Dashboard({ state, onJump, onOpenCompany }) {
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
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 12, color:'var(--ink-3)', fontWeight: 500, letterSpacing:'.04em', textTransform:'uppercase', marginBottom: 6 }}>
          Command Center · {new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long' })}
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, Nishant.</h1>
        <p style={{ color:'var(--ink-3)', fontSize: 14, marginTop: 6, marginBottom: 0 }}>
          {stats.followups.length > 0
            ? <>You have <strong style={{ color:'#D97706' }}>{stats.followups.length} follow-up{stats.followups.length>1?'s':''} due today.</strong> {stats.interview > 0 && `${stats.interview} interview${stats.interview>1?'s':''} in motion.`}</>
            : <>{stats.applied} active application{stats.applied!==1?'s':''} · {stats.pending} pending response · {topUntouched.length} priority companies untouched.</>
          }
        </p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap: 12, marginBottom: 24 }}>
        <StatCard icon={Building2}    label="Companies"   value={stats.total}     hint="In database"                     accent="var(--primary)" onClick={() => onJump('companies')} />
        <StatCard icon={Send}         label="Applied"     value={stats.applied}   hint={`${Math.round(stats.applied/stats.total*100) || 0}% of database`} accent="var(--secondary)" />
        <StatCard icon={Activity}     label="Pending"     value={stats.pending}   hint="Awaiting response"               accent="#A855F7" />
        <StatCard icon={Briefcase}    label="Interviews"  value={stats.interview} hint="In progress"                     accent="#D97706" onClick={() => onJump('pipeline')} />
        <StatCard icon={CheckCircle2} label="Offers"      value={stats.offers}    hint="Live offers"                     accent="#059669" />
        <StatCard icon={Bell}         label="Follow-ups"  value={stats.followups.length} hint="Due today"                       accent={stats.followups.length > 0 ? '#D97706' : 'var(--ink-4)'} />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap: 16, marginBottom: 16 }}>
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

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 16 }}>
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
}

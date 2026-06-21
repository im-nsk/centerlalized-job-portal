import { ExternalLink, Edit3, Users, UserSearch, MapPin, Clock, Hash, Sparkles } from 'lucide-react';
import { daysSince } from '../utils/helpers.js';
import { Pill } from './ui/Pill.jsx';
import { StatusBadge } from './ui/StatusBadge.jsx';
import RoleSearchStats from './RoleSearchStats.jsx';

export default function CompanyCard({
  company, onOpen, onCareer, onEmployees, onRecruiters,
  smartSearchMode = true,
  searchPreferences,
}) {
  const days = company.appliedDate ? daysSince(company.appliedDate) : null;

  return (
    <div className="jcc-card jcc-card-hover" style={{ padding: 16, display:'flex', flexDirection:'column' }}>
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

      <RoleSearchStats
        roleSearch={company.roleSearch}
        smartSearchMode={smartSearchMode}
        preferences={searchPreferences}
        compact
      />

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

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 6, marginTop:'auto' }}>
        <button
          className="jcc-btn jcc-btn-primary"
          onClick={onCareer}
          style={{ justifyContent:'center' }}
          title={smartSearchMode
            ? 'Smart Search: Data Engineer OR Analytics Engineer OR AI Engineer OR ML Engineer OR Data Platform Engineer OR ETL Engineer'
            : 'Multi-title role search on career portal'}
        >
          {smartSearchMode ? <Sparkles size={12}/> : <ExternalLink size={12}/>}
          View Roles
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
}

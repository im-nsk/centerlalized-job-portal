import { useState, useMemo } from 'react';
import { Bell } from 'lucide-react';
import { getStatus, daysSince, todayISO } from '../utils/helpers.js';
import { Pill } from './ui/Pill.jsx';
import { TierBadge } from './ui/TierBadge.jsx';

export default function PipelineView({ state, setState, onOpenCompany }) {
  const { companies } = state;
  const [dragId, setDragId] = useState(null);

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
    <div className="jcc-fade-in jcc-page" style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      <div className="jcc-page-header">
        <div>
          <h1 className="jcc-page-title">Pipeline</h1>
          <p className="jcc-page-sub">Drag cards across stages · click any card to open</p>
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
              <div style={{ padding:'12px 14px', borderBottom:'1px solid var(--hairline)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
                  <div style={{ width: 7, height: 7, borderRadius:'50%', background: status.color }}/>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color:'var(--ink-2)' }}>{status.label}</span>
                </div>
                <span className="jcc-num" style={{ fontSize: 11, color:'var(--ink-4)', fontWeight: 500 }}>{items.length}</span>
              </div>

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
}

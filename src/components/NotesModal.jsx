import { useState, useEffect } from 'react';
import {
  X, ExternalLink, Users, UserSearch, Send, Inbox, Target, GraduationCap, FileText, Edit3,
  MapPin, Hash, Check, Sparkles, Trash2,
} from 'lucide-react';
import { STATUSES, TIERS, COMP_TIERS } from '../data/constants.js';
import { fmtDate, daysSince, todayISO, liEmployees, liRecruiters, cls } from '../utils/helpers.js';
import { openSmartCareerSearch } from '../utils/careerSearch.js';
import { TierBadge } from './ui/TierBadge.jsx';
import { StatusBadge } from './ui/StatusBadge.jsx';
import { Pill } from './ui/Pill.jsx';
import { Field } from './ui/Field.jsx';
import { DetailMetric } from './ui/DetailMetric.jsx';
import RoleSearchStats from './RoleSearchStats.jsx';

export default function NotesModal({
  company, allTags, searchPreferences, onClose, onUpdate, onDelete, onToast,
}) {
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

  const prefs = searchPreferences || { roleFocus: 'data_plus_ai', smartSearchMode: true };

  const viewRoles = async () => {
    if (!draft.careerUrl) {
      onToast?.('No career portal URL configured');
      return;
    }
    const meta = await openSmartCareerSearch(draft, prefs);
    if (meta) {
      update({ roleSearch: meta });
      onToast?.(meta.matchCount != null
        ? `${meta.matchCount} roles found · ${meta.topRole}`
        : `Searching ${meta.termsSearched} titles`);
    }
  };

  if (!company) return null;

  return (
    <div className="jcc-modal-overlay" onClick={onClose}>
      <div className="jcc-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 860 }}>
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

        <div className="jcc-scroll" style={{ overflow:'auto', flex: 1, padding: 24 }}>
          {tab === 'overview' && (
            <div style={{ display:'flex', flexDirection:'column', gap: 18 }}>
              <RoleSearchStats
                roleSearch={draft.roleSearch}
                smartSearchMode={prefs.smartSearchMode}
                preferences={prefs}
              />

              <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 8 }}>
                <button className="jcc-btn jcc-btn-primary" onClick={viewRoles} style={{ justifyContent:'center' }}>
                  <Sparkles size={13}/> Smart View Roles
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

              <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 12 }}>
                <DetailMetric label="Status" value={<StatusBadge statusId={draft.status}/>}/>
                <DetailMetric label="Applied" value={fmtDate(draft.appliedDate)} hint={draft.appliedDate ? `${daysSince(draft.appliedDate)}d ago` : null}/>
                <DetailMetric label="Follow-up" value={fmtDate(draft.followUpDate)} accent={draft.followUpDate && new Date(draft.followUpDate) <= new Date() ? '#D97706' : null}/>
              </div>

              {draft.roleSearch?.lastQuery && (
                <Field label="Last search query" hint="Multi-title OR query sent to career portal">
                  <div className="jcc-input jcc-mono" style={{ fontSize: 11, background: 'var(--surface-3)', wordBreak: 'break-word' }}>
                    {draft.roleSearch.lastQuery}
                  </div>
                </Field>
              )}

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

        <div style={{ padding:'12px 24px', borderTop:'1px solid var(--hairline)', display:'flex', justifyContent:'space-between', alignItems:'center', background:'var(--surface-2)' }}>
          <div style={{ fontSize: 11.5, color:'var(--ink-4)' }}>Auto-saved · {new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })}</div>
          <button className="jcc-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

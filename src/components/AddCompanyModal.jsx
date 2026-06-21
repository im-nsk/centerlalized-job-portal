import { useState } from 'react';
import { X } from 'lucide-react';
import { TIERS, COMP_TIERS } from '../data/constants.js';
import { buildCompany } from '../data/companies.js';
import { Field } from './ui/Field.jsx';

export default function AddCompanyModal({ onClose, onSave }) {
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
}

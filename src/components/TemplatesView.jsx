import { useState } from 'react';
import { Plus, Copy, Trash2 } from 'lucide-react';

export default function TemplatesView({ state, setState, onToast }) {
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
}

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Field } from './ui/Field.jsx';

export default function PrepView({ state, setState }) {
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
}

import { useRef } from 'react';
import { Download, Upload, Tag, Plus, Hash, X, Trash2, LogOut, User } from 'lucide-react';
import { defaultState } from '../data/companies.js';
import { normalizeState } from '../utils/stateMigration.js';
import ExportButton from './ExportButton.jsx';

export default function SettingsView({ state, setState, onToast, user, onSignOut }) {
  const fileInputRef = useRef(null);

  const importJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!confirm('Restore will replace all current data. Continue?')) { e.target.value = ''; return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = normalizeState(JSON.parse(ev.target.result));
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

      {user && (
        <div className="jcc-card" style={{ padding: 20, marginBottom: 16 }}>
          <div style={{ display:'flex', alignItems:'center', gap: 8, marginBottom: 6 }}>
            <User size={15} style={{ color:'var(--primary)' }}/>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Account</h3>
          </div>
          <p style={{ fontSize: 12.5, color:'var(--ink-3)', margin:'0 0 14px' }}>
            Signed in as <strong>{user.email}</strong>. Data syncs automatically to Supabase.
          </p>
          <button className="jcc-btn" onClick={onSignOut}><LogOut size={13}/> Sign out</button>
        </div>
      )}

      <div className="jcc-card" style={{ padding: 20, marginBottom: 16 }}>
        <div style={{ display:'flex', alignItems:'center', gap: 8, marginBottom: 6 }}>
          <Download size={15} style={{ color:'var(--primary)' }}/>
          <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Export your data</h3>
        </div>
        <p style={{ fontSize: 12.5, color:'var(--ink-3)', margin:'0 0 14px' }}>Download a copy you can keep, share, or back up.</p>
        <ExportButton state={state} onToast={onToast} />
      </div>

      <div className="jcc-card" style={{ padding: 20, marginBottom: 16 }}>
        <div style={{ display:'flex', alignItems:'center', gap: 8, marginBottom: 6 }}>
          <Upload size={15} style={{ color:'var(--primary)' }}/>
          <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Restore from backup</h3>
        </div>
        <p style={{ fontSize: 12.5, color:'var(--ink-3)', margin:'0 0 14px' }}>Restore a previously exported JSON backup. This replaces your current data.</p>
        <input ref={fileInputRef} type="file" accept=".json" onChange={importJSON} style={{ display:'none' }}/>
        <button className="jcc-btn" onClick={() => fileInputRef.current?.click()}><Upload size={13}/> Choose backup file…</button>
      </div>

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

      <div className="jcc-card" style={{ padding: 20, borderColor:'#FECACA' }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, margin:'0 0 6px', color:'#DC2626' }}>Reset application</h3>
        <p style={{ fontSize: 12.5, color:'var(--ink-3)', margin:'0 0 14px' }}>Clear everything and restart with the seed database. Export a backup first.</p>
        <button className="jcc-btn" onClick={resetAll} style={{ color:'#DC2626', borderColor:'#FECACA' }}>
          <Trash2 size={13}/> Reset everything
        </button>
      </div>
    </div>
  );
}

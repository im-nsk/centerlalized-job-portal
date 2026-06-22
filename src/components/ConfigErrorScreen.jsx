import { AlertTriangle, RefreshCw } from 'lucide-react';
import { GlobalStyles } from './ui/GlobalStyles.jsx';

export default function ConfigErrorScreen() {
  return (
    <div className="jcc" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--surface-2)',
      padding: 24,
    }}>
      <GlobalStyles/>
      <div className="jcc-card" style={{ width: '100%', maxWidth: 480, padding: '32px 28px' }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10, marginBottom: 16,
          background: '#FEF2F2', color: '#DC2626',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <AlertTriangle size={22}/>
        </div>
        <h1 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
          Cloud sync unavailable
        </h1>
        <p style={{ fontSize: 13.5, color: 'var(--ink-3)', margin: '0 0 20px', lineHeight: 1.55 }}>
          Supabase is not configured. Copy <code className="jcc-mono" style={{ background: 'var(--surface-3)', padding: '1px 5px', borderRadius: 4 }}>.env.example</code> to{' '}
          <code className="jcc-mono" style={{ background: 'var(--surface-3)', padding: '1px 5px', borderRadius: 4 }}>.env</code> and set{' '}
          <code className="jcc-mono" style={{ background: 'var(--surface-3)', padding: '1px 5px', borderRadius: 4 }}>VITE_SUPABASE_URL</code> and{' '}
          <code className="jcc-mono" style={{ background: 'var(--surface-3)', padding: '1px 5px', borderRadius: 4 }}>VITE_SUPABASE_ANON_KEY</code>.
        </p>
        <button
          type="button"
          className="jcc-btn jcc-btn-primary"
          onClick={() => window.location.reload()}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <RefreshCw size={14}/> Retry after configuring
        </button>
      </div>
    </div>
  );
}

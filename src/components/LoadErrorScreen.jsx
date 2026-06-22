import { AlertTriangle, RefreshCw } from 'lucide-react';
import { GlobalStyles } from './ui/GlobalStyles.jsx';
import { LoadingSpinner } from './ui/LoadingSpinner.jsx';

export default function LoadErrorScreen({ message, onRetry, retrying }) {
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
      <div className="jcc-card" style={{ width: '100%', maxWidth: 440, padding: '32px 28px', textAlign: 'center' }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10, margin: '0 auto 16px',
          background: '#FEF2F2', color: '#DC2626',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <AlertTriangle size={22}/>
        </div>
        <h1 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 8px' }}>
          Could not load your data
        </h1>
        <p style={{ fontSize: 13.5, color: 'var(--ink-3)', margin: '0 0 20px', lineHeight: 1.55 }}>
          {message || 'Something went wrong while connecting to the cloud.'}
        </p>
        <button
          type="button"
          className="jcc-btn jcc-btn-primary"
          onClick={onRetry}
          disabled={retrying}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          {retrying ? <LoadingSpinner size={14}/> : <RefreshCw size={14}/>}
          {retrying ? 'Retrying…' : 'Retry load'}
        </button>
      </div>
    </div>
  );
}

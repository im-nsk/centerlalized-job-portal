import { useEffect } from 'react';
import { Check } from 'lucide-react';

export function Toast({ message, onDone }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [message, onDone]);

  if (!message) return null;

  return (
    <div className="jcc-fade-in" style={{ position:'fixed', bottom: 24, right: 24, zIndex: 100,
         background:'#0F172A', color:'white', padding:'10px 16px', borderRadius:10, fontSize:13, fontWeight:500,
         boxShadow:'0 8px 24px rgba(0,0,0,.18)', display:'flex', alignItems:'center', gap:8 }}>
      <Check size={14} /> {message}
    </div>
  );
}

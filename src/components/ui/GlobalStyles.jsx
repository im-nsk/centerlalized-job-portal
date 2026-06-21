export function GlobalStyles() {
  return (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');
    :root {
      --primary: #1F4E79;
      --primary-700: #173E61;
      --primary-50: #EEF4FA;
      --secondary: #4F6EF7;
      --secondary-50: #EEF2FF;
      --ink: #0F172A;
      --ink-2: #334155;
      --ink-3: #64748B;
      --ink-4: #94A3B8;
      --hairline: #E5E7EB;
      --hairline-2: #F1F5F9;
      --surface: #FFFFFF;
      --surface-2: #FAFAFA;
      --surface-3: #F8FAFC;
    }
    .jcc { font-family: 'Geist', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
           font-feature-settings: 'cv11','ss01','ss03'; color: var(--ink); letter-spacing: -0.005em; }
    .jcc-mono { font-family: 'Geist Mono', ui-monospace, SFMono-Regular, monospace; font-feature-settings: 'tnum','zero'; }
    .jcc-num  { font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }
    .jcc-card { background: var(--surface); border: 1px solid var(--hairline); border-radius: 12px; }
    .jcc-card-hover { transition: box-shadow .15s ease, border-color .15s ease, transform .15s ease; }
    .jcc-card-hover:hover { border-color: #CBD5E1; box-shadow: 0 1px 3px rgba(15,23,42,.04), 0 4px 12px rgba(15,23,42,.04); }
    .jcc-btn { display:inline-flex; align-items:center; gap:6px; padding:7px 12px; border-radius:8px; font-size:13px; font-weight:500;
               border:1px solid var(--hairline); background: var(--surface); color: var(--ink-2); transition: all .12s ease; }
    .jcc-btn:hover { background: var(--surface-3); border-color: #CBD5E1; color: var(--ink); }
    .jcc-btn-primary { background: var(--primary); color: white; border-color: var(--primary); }
    .jcc-btn-primary:hover { background: var(--primary-700); border-color: var(--primary-700); color: white; }
    .jcc-btn-secondary { background: var(--secondary); color: white; border-color: var(--secondary); }
    .jcc-btn-secondary:hover { background: #3F5DE3; border-color: #3F5DE3; color: white; }
    .jcc-btn-ghost { border-color: transparent; background: transparent; }
    .jcc-btn-ghost:hover { background: var(--surface-3); border-color: var(--hairline); }
    .jcc-input { width:100%; padding:8px 12px; border:1px solid var(--hairline); border-radius:8px; font-size:13px;
                 background: var(--surface); color: var(--ink); transition: border-color .12s ease, box-shadow .12s ease; }
    .jcc-input:focus { outline:none; border-color: var(--secondary); box-shadow: 0 0 0 3px rgba(79,110,247,.12); }
    .jcc-pill { display:inline-flex; align-items:center; gap:4px; padding:2px 8px; border-radius:6px;
                font-size:11px; font-weight:500; line-height:1.5; letter-spacing:.01em; }
    .jcc-link { color: var(--secondary); text-decoration: none; }
    .jcc-link:hover { text-decoration: underline; text-underline-offset: 2px; }
    .jcc-sidebar-item { display:flex; align-items:center; gap:10px; padding:7px 10px; border-radius:7px;
                        font-size:13px; color: var(--ink-2); cursor:pointer; transition: background .1s; font-weight: 450; }
    .jcc-sidebar-item:hover { background: var(--surface-3); color: var(--ink); }
    .jcc-sidebar-item.active { background: var(--primary-50); color: var(--primary); font-weight: 550; }
    .jcc-divider { height:1px; background: var(--hairline); }
    .jcc-grid-bg { background-image: linear-gradient(var(--hairline-2) 1px, transparent 1px), linear-gradient(90deg, var(--hairline-2) 1px, transparent 1px); background-size: 24px 24px; }
    .jcc-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
    .jcc-scroll::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 4px; }
    .jcc-scroll::-webkit-scrollbar-track { background: transparent; }
    .jcc-fade-in { animation: jccFade .2s ease-out; }
    @keyframes jccFade { from { opacity:0; transform: translateY(4px); } to { opacity:1; transform:none; } }
    .jcc-modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,.4); backdrop-filter: blur(4px); z-index: 50;
                         display:flex; align-items:flex-start; justify-content:center; padding: 5vh 16px; }
    .jcc-modal { background: var(--surface); border-radius: 16px; width: 100%; max-width: 760px; max-height: 90vh; overflow: hidden;
                 display:flex; flex-direction:column; box-shadow: 0 24px 60px rgba(15,23,42,.18); border: 1px solid var(--hairline); }
    .jcc-checkbox { width: 16px; height: 16px; border: 1.5px solid #CBD5E1; border-radius: 4px; display:inline-flex; align-items:center; justify-content:center;
                    background: white; cursor: pointer; transition: all .12s; flex-shrink: 0; }
    .jcc-checkbox.checked { background: var(--primary); border-color: var(--primary); }
    select.jcc-input { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
                       background-repeat: no-repeat; background-position: right 10px center; padding-right: 28px; }
    .jcc-kbd { font-family: 'Geist Mono', monospace; font-size: 10.5px; padding: 1px 5px; border-radius: 4px;
               background: var(--surface-3); border: 1px solid var(--hairline); color: var(--ink-3); }
  `}</style>
  );
}

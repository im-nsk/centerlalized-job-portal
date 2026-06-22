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
      --sidebar-w: 232px;
      --header-h: 52px;
      --safe-bottom: env(safe-area-inset-bottom, 0px);
    }
    .jcc { font-family: 'Geist', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
           font-feature-settings: 'cv11','ss01','ss03'; color: var(--ink); letter-spacing: -0.005em;
           -webkit-font-smoothing: antialiased; }
    .jcc-mono { font-family: 'Geist Mono', ui-monospace, SFMono-Regular, monospace; font-feature-settings: 'tnum','zero'; }
    .jcc-num  { font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }

    /* Layout */
    .jcc-app-shell { height: 100vh; height: 100dvh; display: flex; overflow: hidden; background: var(--surface-2); }
    .jcc-main { flex: 1; overflow: auto; overflow-x: hidden; background: var(--surface-2); -webkit-overflow-scrolling: touch; }
    .jcc-page { padding: 28px 32px; max-width: 1400px; margin: 0 auto; width: 100%; }
    .jcc-page-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; margin-bottom: 22px; flex-wrap: wrap; }
    .jcc-page-title { font-size: 22px; font-weight: 600; letter-spacing: -0.02em; margin: 0; }
    .jcc-page-sub { color: var(--ink-3); font-size: 13px; margin: 4px 0 0; }

    /* Cards & buttons */
    .jcc-card { background: var(--surface); border: 1px solid var(--hairline); border-radius: 12px; }
    .jcc-card-hover { transition: box-shadow .18s ease, border-color .18s ease, transform .18s ease; }
    .jcc-card-hover:hover { border-color: #CBD5E1; box-shadow: 0 1px 3px rgba(15,23,42,.04), 0 4px 12px rgba(15,23,42,.04); }
    .jcc-card-interactive { cursor: pointer; }
    .jcc-card-interactive:active { transform: scale(0.995); }
    .jcc-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px;
               padding: 8px 14px; min-height: 36px; border-radius: 8px; font-size: 13px; font-weight: 500;
               border: 1px solid var(--hairline); background: var(--surface); color: var(--ink-2);
               transition: background .15s ease, border-color .15s ease, color .15s ease, box-shadow .15s ease, transform .1s ease;
               cursor: pointer; font-family: inherit; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .jcc-btn:hover:not(:disabled) { background: var(--surface-3); border-color: #CBD5E1; color: var(--ink); }
    .jcc-btn:active:not(:disabled) { transform: scale(0.98); }
    .jcc-btn:disabled { opacity: 0.55; cursor: not-allowed; }
    .jcc-btn-primary { background: var(--primary); color: white; border-color: var(--primary); }
    .jcc-btn-primary:hover:not(:disabled) { background: var(--primary-700); border-color: var(--primary-700); color: white; }
    .jcc-btn-secondary { background: var(--secondary); color: white; border-color: var(--secondary); }
    .jcc-btn-secondary:hover:not(:disabled) { background: #3F5DE3; border-color: #3F5DE3; color: white; }
    .jcc-btn-ghost { border-color: transparent; background: transparent; }
    .jcc-btn-ghost:hover:not(:disabled) { background: var(--surface-3); border-color: var(--hairline); }
    .jcc-btn-sm { min-height: 32px; padding: 6px 10px; font-size: 12px; }

    .jcc-input { width: 100%; padding: 10px 12px; min-height: 40px; border: 1px solid var(--hairline); border-radius: 8px; font-size: 16px;
                 background: var(--surface); color: var(--ink); transition: border-color .15s ease, box-shadow .15s ease;
                 font-family: inherit; -webkit-appearance: none; }
    @media (min-width: 769px) { .jcc-input { font-size: 13px; min-height: 36px; padding: 8px 12px; } }
    .jcc-input:focus { outline: none; border-color: var(--secondary); box-shadow: 0 0 0 3px rgba(79,110,247,.12); }

    .jcc-pill { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 6px;
                font-size: 11px; font-weight: 500; line-height: 1.5; letter-spacing: .01em; }
    .jcc-link { color: var(--secondary); text-decoration: none; transition: color .12s; }
    .jcc-link:hover { text-decoration: underline; text-underline-offset: 2px; }

    /* Sidebar */
    .jcc-sidebar { width: var(--sidebar-w); flex-shrink: 0; background: var(--surface);
                   border-right: 1px solid var(--hairline); display: flex; flex-direction: column;
                   transition: transform .25s cubic-bezier(.4,0,.2,1); z-index: 200; }
    .jcc-sidebar-item { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: 7px;
                        font-size: 13px; color: var(--ink-2); cursor: pointer; transition: background .12s, color .12s; font-weight: 450;
                        touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .jcc-sidebar-item:hover { background: var(--surface-3); color: var(--ink); }
    .jcc-sidebar-item.active { background: var(--primary-50); color: var(--primary); font-weight: 550; }
    .jcc-sidebar-backdrop { display: none; position: fixed; inset: 0; background: rgba(15,23,42,.35);
                             backdrop-filter: blur(2px); z-index: 150; opacity: 0; pointer-events: none;
                             transition: opacity .25s ease; }
    .jcc-sidebar-backdrop--visible { opacity: 1; pointer-events: auto; }

    /* Mobile header */
    .jcc-mobile-header { display: none; align-items: center; gap: 10px; height: var(--header-h);
                         padding: 0 12px; padding-top: env(safe-area-inset-top, 0px);
                         background: var(--surface); border-bottom: 1px solid var(--hairline); flex-shrink: 0; }
    .jcc-mobile-header-title { flex: 1; font-size: 15px; font-weight: 600; letter-spacing: -0.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    /* Grids */
    .jcc-stat-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; margin-bottom: 24px; }
    .jcc-grid-2col { display: grid; grid-template-columns: 1.4fr 1fr; gap: 16px; margin-bottom: 16px; }
    .jcc-grid-2col-equal { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .jcc-company-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 12px; }
    .jcc-action-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .jcc-action-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
    .jcc-split-layout { display: grid; grid-template-columns: 280px 1fr; gap: 16px; }
    .jcc-metrics-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
    .jcc-form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

    /* Filters */
    .jcc-filters { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
    .jcc-filters-search { position: relative; flex: 1; min-width: 200px; max-width: 320px; }
    .jcc-filters-select { width: 180px; flex-shrink: 0; }

    /* Modals */
    .jcc-modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,.4); backdrop-filter: blur(4px); z-index: 50;
                         display: flex; align-items: flex-start; justify-content: center; padding: 5vh 16px;
                         animation: jccOverlayIn .2s ease; }
    .jcc-modal { background: var(--surface); border-radius: 16px; width: 100%; max-width: 760px; max-height: 90vh; max-height: 90dvh;
                 overflow: hidden; display: flex; flex-direction: column;
                 box-shadow: 0 24px 60px rgba(15,23,42,.18); border: 1px solid var(--hairline);
                 animation: jccModalIn .25s cubic-bezier(.4,0,.2,1); }
    .jcc-modal-tabs { display: flex; gap: 4px; padding: 8px 16px 0; border-bottom: 1px solid var(--hairline); overflow-x: auto;
                      -webkit-overflow-scrolling: touch; scrollbar-width: none; }
    .jcc-modal-tabs::-webkit-scrollbar { display: none; }
    .jcc-modal-tab { border: none; background: transparent; cursor: pointer; padding: 10px 12px; font-size: 12.5px; font-weight: 500;
                     color: var(--ink-3); border-bottom: 2px solid transparent; margin-bottom: -1px; display: flex; align-items: center;
                     gap: 6px; transition: color .12s; white-space: nowrap; flex-shrink: 0; font-family: inherit; }
    .jcc-modal-tab--active { color: var(--primary); border-bottom-color: var(--primary); }

    .jcc-checkbox { width: 16px; height: 16px; border: 1.5px solid #CBD5E1; border-radius: 4px; display: inline-flex; align-items: center; justify-content: center;
                    background: white; cursor: pointer; transition: all .12s; flex-shrink: 0; }
    .jcc-checkbox.checked { background: var(--primary); border-color: var(--primary); }
    select.jcc-input { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
                       background-repeat: no-repeat; background-position: right 10px center; padding-right: 28px; }
    .jcc-kbd { font-family: 'Geist Mono', monospace; font-size: 10.5px; padding: 1px 5px; border-radius: 4px;
               background: var(--surface-3); border: 1px solid var(--hairline); color: var(--ink-3); }
    .jcc-hide-mobile { }
    .jcc-show-mobile { display: none !important; }
    .jcc-search-trigger { width: 100%; display: flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 7px;
                          border: 1px solid var(--hairline); background: var(--surface-2); color: var(--ink-3); font-size: 12.5px;
                          cursor: pointer; transition: border-color .12s, background .12s; font-family: inherit; min-height: 36px; }
    .jcc-search-trigger:hover { border-color: #CBD5E1; background: var(--surface-3); }

    /* List rows */
    .jcc-list-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0;
                     border-top: 1px solid var(--hairline-2); cursor: pointer; transition: background .12s; }
    .jcc-list-row:hover { background: var(--surface-3); margin: 0 -8px; padding-left: 8px; padding-right: 8px; border-radius: 6px; border-top-color: transparent; }
    .jcc-search-result { padding: 12px 18px; border-bottom: 1px solid var(--hairline-2); cursor: pointer;
                         display: flex; align-items: center; gap: 12px; transition: background .12s; }
    .jcc-search-result:hover { background: var(--surface-2); }

    /* Spinner */
    .jcc-spinner { display: inline-block; border: 2px solid var(--hairline); border-top-color: var(--secondary);
                   border-radius: 50%; animation: jccSpin .65s linear infinite; flex-shrink: 0; }
  @keyframes jccSpin { to { transform: rotate(360deg); } }

    .jcc-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
    .jcc-scroll::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 4px; }
    .jcc-scroll::-webkit-scrollbar-track { background: transparent; }
    .jcc-fade-in { animation: jccFade .25s ease-out; }
    @keyframes jccFade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
    @keyframes jccOverlayIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes jccModalIn { from { opacity: 0; transform: translateY(12px) scale(0.98); } to { opacity: 1; transform: none; } }

    /* Tablet */
    @media (max-width: 1100px) {
      .jcc-stat-grid { grid-template-columns: repeat(3, 1fr); }
      .jcc-grid-2col { grid-template-columns: 1fr; }
      .jcc-action-grid-4 { grid-template-columns: repeat(2, 1fr); }
    }

    /* Mobile */
    @media (max-width: 768px) {
      .jcc-page { padding: 16px; padding-bottom: calc(16px + var(--safe-bottom)); }
      .jcc-page-header { flex-direction: column; align-items: stretch; }
      .jcc-page-header .jcc-btn { width: 100%; }
      .jcc-stat-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
      .jcc-grid-2col-equal { grid-template-columns: 1fr; }
      .jcc-company-grid { grid-template-columns: 1fr; }
      .jcc-split-layout { grid-template-columns: 1fr; }
      .jcc-metrics-row { grid-template-columns: 1fr; }
      .jcc-form-row-2 { grid-template-columns: 1fr; }
      .jcc-action-grid-4 { grid-template-columns: 1fr 1fr; }
      .jcc-hide-mobile { display: none !important; }
      .jcc-show-mobile { display: inline-flex !important; }

      .jcc-filters { flex-direction: column; align-items: stretch; }
      .jcc-filters-search { max-width: none; min-width: 0; }
      .jcc-filters-select { width: 100% !important; }

      .jcc-mobile-header { display: flex; }
      .jcc-app-shell { flex-direction: column; }
      .jcc-main { flex: 1; min-height: 0; }

      .jcc-sidebar { position: fixed; top: 0; left: 0; bottom: 0; transform: translateX(-100%);
                     box-shadow: 4px 0 24px rgba(15,23,42,.12); }
      .jcc-sidebar--open { transform: translateX(0); }
      .jcc-sidebar-backdrop { display: block; }

      .jcc-modal-overlay { padding: 0; align-items: flex-end; }
      .jcc-modal { max-height: 92dvh; border-radius: 16px 16px 0 0; max-width: 100%; animation: jccSheetIn .3s cubic-bezier(.4,0,.2,1); }
      @keyframes jccSheetIn { from { transform: translateY(100%); } to { transform: translateY(0); } }

      .jcc-btn { min-height: 40px; }
    }

    @media (max-width: 380px) {
      .jcc-stat-grid { grid-template-columns: 1fr 1fr; }
      .jcc-action-grid { grid-template-columns: 1fr; }
    }
  `}</style>
  );
}

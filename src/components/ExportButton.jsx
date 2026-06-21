import { FileText, Download } from 'lucide-react';
import { exportJSON, exportCSV, exportXLSX } from '../utils/export.js';

export default function ExportButton({ state, onToast }) {
  return (
    <div style={{ display:'flex', gap: 8 }}>
      <button className="jcc-btn jcc-btn-primary" onClick={() => { exportXLSX(state); onToast('Excel file downloaded'); }}>
        <FileText size={13}/> Excel (.xlsx)
      </button>
      <button className="jcc-btn" onClick={() => { exportCSV(state); onToast('CSV downloaded'); }}>
        <FileText size={13}/> CSV
      </button>
      <button className="jcc-btn" onClick={() => { exportJSON(state); onToast('Backup downloaded'); }}>
        <Download size={13}/> JSON backup
      </button>
    </div>
  );
}

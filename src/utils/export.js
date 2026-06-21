import * as XLSX from 'xlsx';
import { getStatus, getTier, todayISO } from './helpers.js';

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportJSON(state) {
  downloadBlob(
    new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' }),
    `jcc-backup-${todayISO()}.json`
  );
}

export function exportCSV(state) {
  const rows = [[
    'Name', 'Tier', 'Comp', 'Priority', 'Status', 'Applied', 'FollowUp',
    'Contact', 'Referral', 'Salary', 'Location', 'Tags', 'Notes', 'InterviewNotes', 'CareerURL',
  ]];
  state.companies.forEach((c) => rows.push([
    c.name, c.tier, c.compTier, c.priorityScore, c.status, c.appliedDate || '', c.followUpDate || '',
    c.contactName || '', c.referralStatus, c.salaryExpectation || '', c.location, (c.tags || []).join('; '),
    (c.notes || '').replace(/\n/g, ' | '), (c.interviewNotes || '').replace(/\n/g, ' | '), c.careerUrl,
  ]));
  const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  downloadBlob(new Blob([csv], { type: 'text/csv' }), `jcc-companies-${todayISO()}.csv`);
}

export function exportXLSX(state) {
  const sheetData = state.companies.map((c) => ({
    Name: c.name,
    Tier: getTier(c.tier).label,
    'Comp Tier': c.compTier,
    Priority: c.priorityScore,
    Status: getStatus(c.status).label,
    'Applied Date': c.appliedDate || '',
    'Follow-up': c.followUpDate || '',
    Contact: c.contactName,
    Referral: c.referralStatus,
    Salary: c.salaryExpectation,
    Location: c.location,
    Tags: (c.tags || []).join(', '),
    'Career URL': c.careerUrl,
    Notes: c.notes,
    'Interview Notes': c.interviewNotes,
  }));
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(sheetData);
  ws['!cols'] = [
    { wch: 22 }, { wch: 24 }, { wch: 10 }, { wch: 10 }, { wch: 18 },
    { wch: 14 }, { wch: 14 }, { wch: 18 }, { wch: 14 }, { wch: 20 },
    { wch: 24 }, { wch: 24 }, { wch: 40 }, { wch: 40 }, { wch: 40 },
  ];
  XLSX.utils.book_append_sheet(wb, ws, 'Companies');
  if (state.starStories.length) {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(state.starStories), 'STAR Stories');
  }
  XLSX.writeFile(wb, `jcc-companies-${todayISO()}.xlsx`);
}

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const today = () => new Date().toISOString().slice(0, 10);

function buildHeaders(books) {
  return ['#', 'Nama Murid', 'No. Murid', ...books.map(b => b.name), 'Status'];
}

function buildRows(studentRecords, books) {
  return (studentRecords ?? []).map((rec, i) => [
    i + 1,
    rec.student?.name ?? '',
    rec.student?.student_no ?? '',
    ...books.map(b => rec.submittedBookIds?.has(b.id) ? '✓' : '–'),
    rec.status,
  ]);
}

export function exportToExcel(studentRecords, books, className) {
  const sheetName = className || 'Rekod';
  const headers = buildHeaders(books);
  const rows = buildRows(studentRecords, books);

  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 31));

  const filename = `BukuTrack-${className || 'rekod'}-${today()}.xlsx`;
  XLSX.writeFile(wb, filename);
}

export function exportToCsv(studentRecords, books, className) {
  const escapeCell = (val) => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headers = buildHeaders(books);
  const rows = buildRows(studentRecords, books);

  const csvLines = [headers, ...rows].map(row => row.map(escapeCell).join(','));
  const csvString = csvLines.join('\n');

  const blob = new Blob(['﻿' + csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `BukuTrack-${className || 'rekod'}-${today()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportToPdf(studentRecords, books, className) {
  const doc = new jsPDF({ orientation: 'landscape' });

  const title = `BukuTrack — ${className || 'Rekod Murid'}`;
  const subtitle = `Dijana pada: ${today()}`;

  doc.setFontSize(16);
  doc.text(title, 14, 15);
  doc.setFontSize(10);
  doc.text(subtitle, 14, 22);

  const headers = buildHeaders(books);
  const rows = buildRows(studentRecords, books);

  autoTable(doc, {
    startY: 27,
    head: [headers],
    body: rows,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] },
  });

  doc.save(`BukuTrack-${className || 'rekod'}-${today()}.pdf`);
}

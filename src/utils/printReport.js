/**
 * Jana laporan kehadiran PDF melalui print dialog browser
 * Buka tab baru → auto-trigger window.print() → Simpan sebagai PDF
 *
 * @param {object} cls            { id, subject, year_name }
 * @param {Array}  students       [{ id, name }]
 * @param {Array}  sessions       [{ id, checked_at, book_id, books }]
 * @param {Array}  sessionRecords [{ session_id, student_id, status }]
 * @param {Array}  books          [{ id, name, emoji }]
 */
export function printAttendanceReport({ cls, students, sessions, sessionRecords, books }) {
  const sorted = [...sessions].sort((a, b) => a.checked_at.localeCompare(b.checked_at))
  const printDate = new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' })

  // Build recordMap[sessionId][studentId] = status
  const recordMap = {}
  sessionRecords.forEach(r => {
    if (!recordMap[r.session_id]) recordMap[r.session_id] = {}
    recordMap[r.session_id][r.student_id] = r.status
  })

  function fmt(dateStr) {
    if (!dateStr) return '—'
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('ms-MY', { day: 'numeric', month: 'numeric' })
  }

  // ── Matriks rows ──────────────────────────────────────────
  const matrixRows = students.map((stu, i) => {
    const cells = sorted.map(s => {
      const st = recordMap[s.id]?.[stu.id]
      if (st === 'present') return `<td class="cell-p">✓</td>`
      if (st === 'absent')  return `<td class="cell-a">✗</td>`
      return `<td class="cell-e">—</td>`
    }).join('')
    const hadir  = sorted.filter(s => recordMap[s.id]?.[stu.id] === 'present').length
    const absent = sorted.filter(s => recordMap[s.id]?.[stu.id] === 'absent').length
    const pct    = sorted.length > 0 ? Math.round(hadir / sorted.length * 100) : 0
    const pctClass = pct >= 80 ? 'pct-ok' : pct >= 60 ? 'pct-warn' : 'pct-bad'
    return `<tr>
      <td class="td-num">${String(i + 1).padStart(2, '0')}</td>
      <td class="td-name">${stu.name}</td>
      ${cells}
      <td class="td-stat">${hadir}</td>
      <td class="td-stat td-absent">${absent}</td>
      <td class="td-stat ${pctClass}">${pct}%</td>
    </tr>`
  }).join('')

  // Baris jumlah bawah
  const totalPresent = sorted.map(s =>
    Object.values(recordMap[s.id] ?? {}).filter(v => v === 'present').length
  )
  const jumlahCells = totalPresent.map(n => `<td class="td-total">${n}</td>`).join('')

  // ── Ringkasan rows ────────────────────────────────────────
  const summaryRows = students.map((stu, i) => {
    let hadir = 0, absent = 0, tiada = 0
    sorted.forEach(s => {
      const st = recordMap[s.id]?.[stu.id]
      if (st === 'present') hadir++
      else if (st === 'absent') absent++
      else tiada++
    })
    const pct = sorted.length > 0 ? Math.round(hadir / sorted.length * 100) : 0
    const pctClass = pct >= 80 ? 'pct-ok' : pct >= 60 ? 'pct-warn' : 'pct-bad'
    const bar = `<div class="bar-wrap"><div class="bar-fill ${pctClass}" style="width:${pct}%"></div></div>`
    return `<tr>
      <td class="td-num">${String(i + 1).padStart(2, '0')}</td>
      <td class="td-name">${stu.name}</td>
      <td class="td-stat">${hadir}</td>
      <td class="td-stat td-absent">${absent}</td>
      <td class="td-stat">${tiada}</td>
      <td class="td-pct ${pctClass}">${pct}% ${bar}</td>
    </tr>`
  }).join('')

  // ── Session header cells ──────────────────────────────────
  const sessionHeaders = sorted.map(s => {
    const book = s.books || books.find(b => b.id === s.book_id)
    return `<th class="th-session" title="${book?.name ?? ''}">${fmt(s.checked_at)}<br><span class="th-emoji">${book?.emoji ?? '📖'}</span></th>`
  }).join('')

  // ── Statistik keseluruhan ─────────────────────────────────
  const totalSessions = sorted.length
  const totalStudents = students.length
  const totalPresents = sessionRecords.filter(r => r.status === 'present').length
  const totalAbsents  = sessionRecords.filter(r => r.status === 'absent').length
  const overallPct = totalSessions && totalStudents
    ? Math.round(totalPresents / (totalSessions * totalStudents) * 100)
    : 0

  // ── HTML ─────────────────────────────────────────────────
  const html = `<!DOCTYPE html>
<html lang="ms">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>BukuTrack — ${cls.subject} ${cls.year_name}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11px; color: #1e2d45; background: #fff; }
  .page { padding: 20mm 16mm 16mm; max-width: 297mm; margin: 0 auto; }

  /* Header */
  .report-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; border-bottom: 2.5px solid #3d70d6; padding-bottom: 10px; }
  .brand { font-size: 17px; font-weight: 900; letter-spacing: 1px; }
  .brand span { color: #3d70d6; }
  .report-title { font-size: 14px; font-weight: 800; color: #1e2d45; margin-top: 5px; }
  .report-meta { text-align: right; font-size: 10px; color: #6b7fa3; line-height: 1.7; }

  /* Stats strip */
  .stats { display: flex; border: 1px solid #d8e2f0; border-radius: 6px; overflow: hidden; margin-bottom: 16px; }
  .stat { flex: 1; padding: 8px 10px; border-right: 1px solid #d8e2f0; text-align: center; }
  .stat:last-child { border-right: none; }
  .stat-n { font-size: 19px; font-weight: 800; color: #3d70d6; line-height: 1; }
  .stat-l { font-size: 9px; color: #a8b8d0; text-transform: uppercase; letter-spacing: 1px; margin-top: 2px; }

  /* Section title */
  .section-title { font-size: 9px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #a8b8d0; margin-bottom: 7px; margin-top: 20px; border-bottom: 1px solid #e8eef8; padding-bottom: 4px; }

  /* Table */
  table { width: 100%; border-collapse: collapse; font-size: 10px; }
  th { background: #f0f4f8; font-weight: 700; color: #6b7fa3; padding: 5px 5px; border: 1px solid #d8e2f0; text-align: center; vertical-align: bottom; }
  td { padding: 4px 5px; border: 1px solid #e8eef8; vertical-align: middle; }
  tr:nth-child(even) td { background: #f8fafd; }

  .td-num  { width: 26px; text-align: center; color: #a8b8d0; font-size: 9px; font-family: monospace; }
  .td-name { text-align: left; font-weight: 600; min-width: 110px; }
  .td-stat { text-align: center; font-weight: 700; width: 36px; }
  .td-pct  { text-align: center; font-weight: 700; min-width: 70px; }
  .td-absent { color: #c0607a; }
  .td-total { text-align: center; font-weight: 800; color: #3d70d6; background: #edf1f7 !important; }

  .th-session { font-size: 9px; width: 30px; line-height: 1.4; padding: 4px 2px; }
  .th-emoji { font-size: 10px; }

  .cell-p { text-align: center; color: #4a9470; font-weight: 800; font-size: 11px; }
  .cell-a { text-align: center; color: #c0607a; font-weight: 800; font-size: 11px; }
  .cell-e { text-align: center; color: #c8d8e8; font-size: 10px; }

  .pct-ok   { color: #4a9470; }
  .pct-warn { color: #b07840; }
  .pct-bad  { color: #c0607a; }

  .bar-wrap { height: 3px; background: #e8eef8; border-radius: 2px; margin-top: 3px; }
  .bar-fill.pct-ok   { height: 100%; border-radius: 2px; background: #4a9470; }
  .bar-fill.pct-warn { height: 100%; border-radius: 2px; background: #b07840; }
  .bar-fill.pct-bad  { height: 100%; border-radius: 2px; background: #c0607a; }

  .jumlah-row td { background: #edf1f7 !important; font-weight: 800; border-top: 2px solid #c8d8ec; }

  .footer { margin-top: 18px; padding-top: 8px; border-top: 1px solid #e8eef8; display: flex; justify-content: space-between; font-size: 9px; color: #a8b8d0; }

  /* Screen only */
  @media screen {
    body { background: #e0e8f4; }
    .page { background: #fff; box-shadow: 0 4px 32px rgba(0,0,0,0.14); margin: 24px auto; border-radius: 6px; }
    .print-btn {
      position: fixed; top: 16px; right: 16px; z-index: 99;
      background: #3d70d6; color: #fff; border: none;
      padding: 10px 20px; border-radius: 8px; font-size: 13px; font-weight: 700;
      cursor: pointer; box-shadow: 0 4px 16px rgba(61,112,214,0.4);
    }
    .print-btn:hover { background: #2d5ab6; }
  }

  /* Print */
  @media print {
    body { background: #fff; font-size: 10px; }
    .page { padding: 8mm 6mm; }
    .no-print { display: none !important; }
    tr { page-break-inside: avoid; }
    .section-title { page-break-before: auto; }
  }
</style>
</head>
<body>
<button class="print-btn no-print" onclick="window.print()">🖨️ Cetak / Simpan PDF</button>

<div class="page">

  <!-- Header -->
  <div class="report-header">
    <div>
      <div class="brand">📚 BUKU<span>TRACK</span></div>
      <div class="report-title">${cls.subject} &nbsp;·&nbsp; ${cls.year_name}</div>
    </div>
    <div class="report-meta">
      <div style="font-weight:700;color:#1e2d45;font-size:11px">Laporan Kehadiran Buku</div>
      <div>Dicetak: ${printDate}</div>
      <div>${totalSessions} sesi &nbsp;·&nbsp; ${totalStudents} murid</div>
    </div>
  </div>

  <!-- Stats strip -->
  <div class="stats">
    <div class="stat">
      <div class="stat-n">${totalStudents}</div>
      <div class="stat-l">Murid</div>
    </div>
    <div class="stat">
      <div class="stat-n">${totalSessions}</div>
      <div class="stat-l">Sesi</div>
    </div>
    <div class="stat">
      <div class="stat-n" style="color:#4a9470">${overallPct}%</div>
      <div class="stat-l">Kadar Hadir</div>
    </div>
    <div class="stat">
      <div class="stat-n" style="color:#c0607a">${totalAbsents}</div>
      <div class="stat-l">Ketidakhadiran</div>
    </div>
  </div>

  <!-- Matriks -->
  <div class="section-title">Matriks Kehadiran (✓ Hadir &nbsp; ✗ Tidak Hadir &nbsp; — Tiada Rekod)</div>
  <div style="overflow-x:auto">
    <table>
      <thead>
        <tr>
          <th class="td-num">#</th>
          <th style="text-align:left;min-width:110px">Nama Murid</th>
          ${sessionHeaders}
          <th class="td-stat" style="color:#4a9470" title="Jumlah hadir">✓</th>
          <th class="td-stat" style="color:#c0607a" title="Jumlah tidak hadir">✗</th>
          <th class="td-stat">%</th>
        </tr>
      </thead>
      <tbody>
        ${matrixRows}
        <tr class="jumlah-row">
          <td></td>
          <td style="text-align:left">JUMLAH HADIR</td>
          ${jumlahCells}
          <td></td><td></td><td></td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Ringkasan -->
  <div class="section-title" style="margin-top:22px">Ringkasan Murid</div>
  <table>
    <thead>
      <tr>
        <th class="td-num">#</th>
        <th style="text-align:left">Nama Murid</th>
        <th class="td-stat" style="color:#4a9470">Hadir</th>
        <th class="td-stat" style="color:#c0607a">Tidak Hadir</th>
        <th class="td-stat">Tiada Rekod</th>
        <th style="min-width:80px;text-align:center">Peratus Hadir</th>
      </tr>
    </thead>
    <tbody>${summaryRows}</tbody>
  </table>

  <!-- Footer -->
  <div class="footer">
    <span>📚 BukuTrack — Sistem Semakan Buku Digital</span>
    <span>${cls.subject} · ${cls.year_name} · ${printDate}</span>
  </div>

</div>
<script>
  window.addEventListener('load', () => setTimeout(() => window.print(), 350))
<\/script>
</body>
</html>`

  const win = window.open('', '_blank')
  if (!win) {
    alert('Sila benarkan pop-up untuk menjana laporan PDF.')
    return
  }
  win.document.write(html)
  win.document.close()
}

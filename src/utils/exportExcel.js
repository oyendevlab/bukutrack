import * as XLSX from 'xlsx'

/**
 * Export matriks kehadiran kelas sebagai fail .xlsx
 * Sheet 1 — Matriks Kehadiran  (murid × sesi)
 * Sheet 2 — Ringkasan Murid    (jumlah hadir / tidak hadir / peratus)
 *
 * @param {object} cls           - { id, subject, year_name }
 * @param {Array}  students      - [{ id, name }]
 * @param {Array}  sessions      - [{ id, checked_at, book_id, books }]
 * @param {Array}  sessionRecords - [{ session_id, student_id, status }]
 * @param {Array}  books         - [{ id, name }]
 */
export function exportClassMatrix({ cls, students, sessions, sessionRecords, books }) {
  const wb = XLSX.utils.book_new()

  // Susun sesi mengikut tarikh asc
  const sorted = [...sessions].sort((a, b) => a.checked_at.localeCompare(b.checked_at))

  // recordMap[sessionId][studentId] = 'present' | 'absent' | undefined
  const recordMap = {}
  sessionRecords.forEach(r => {
    if (!recordMap[r.session_id]) recordMap[r.session_id] = {}
    recordMap[r.session_id][r.student_id] = r.status
  })

  const dateLabel = new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' })

  // ── Sheet 1: Matriks Kehadiran ──────────────────────────────
  const sessionCols = sorted.map(s => {
    const book = s.books || books.find(b => b.id === s.book_id)
    return `${s.checked_at} | ${book?.name ?? '—'}`
  })

  const matrixRows = students.map((stu, i) => {
    const cells = sorted.map(s => {
      const st = recordMap[s.id]?.[stu.id]
      return st === 'present' ? '✓' : st === 'absent' ? '✗' : '—'
    })
    const hadir  = cells.filter(c => c === '✓').length
    const absent = cells.filter(c => c === '✗').length
    return [i + 1, stu.name, ...cells, hadir, absent]
  })

  // Baris jumlah bawah
  const jumlahRow = [
    '', 'JUMLAH',
    ...sorted.map(s => Object.values(recordMap[s.id] ?? {}).filter(v => v === 'present').length),
    matrixRows.reduce((a, r) => a + r[r.length - 2], 0),
    matrixRows.reduce((a, r) => a + r[r.length - 1], 0),
  ]

  const ws1 = XLSX.utils.aoa_to_sheet([
    [`Laporan Semakan Buku — ${cls.subject} ${cls.year_name}`],
    [`Dicetak: ${dateLabel}`],
    [],
    ['No.', 'Nama Murid', ...sessionCols, 'Jumlah Hadir', 'Jumlah Tidak Hadir'],
    ...matrixRows,
    [],
    jumlahRow,
  ])

  ws1['!cols'] = [
    { wch: 5 }, { wch: 32 },
    ...sorted.map(() => ({ wch: 22 })),
    { wch: 14 }, { wch: 18 },
  ]

  XLSX.utils.book_append_sheet(wb, ws1, 'Matriks Kehadiran')

  // ── Sheet 2: Ringkasan Murid ────────────────────────────────
  const total = sorted.length

  const summaryRows = students.map((stu, i) => {
    let hadir = 0, absent = 0, tiada = 0
    sorted.forEach(s => {
      const st = recordMap[s.id]?.[stu.id]
      if (st === 'present') hadir++
      else if (st === 'absent') absent++
      else tiada++
    })
    const pct = total > 0 ? +(hadir / total * 100).toFixed(1) : 0
    return [i + 1, stu.name, hadir, absent, tiada, pct]
  })

  const ws2 = XLSX.utils.aoa_to_sheet([
    [`Ringkasan Murid — ${cls.subject} ${cls.year_name}`],
    [`Jumlah sesi: ${total} · Dicetak: ${dateLabel}`],
    [],
    ['No.', 'Nama Murid', 'Hadir', 'Tidak Hadir', 'Tiada Rekod', 'Peratus Hadir (%)'],
    ...summaryRows,
  ])

  ws2['!cols'] = [
    { wch: 5 }, { wch: 32 },
    { wch: 10 }, { wch: 14 }, { wch: 12 }, { wch: 18 },
  ]

  XLSX.utils.book_append_sheet(wb, ws2, 'Ringkasan Murid')

  // ── Muat turun ──────────────────────────────────────────────
  const safeDate = new Date().toISOString().slice(0, 10)
  const safeName = `${cls.subject}-${cls.year_name}`
    .replace(/\s+/g, '-').replace(/[^\w\-]/g, '')
  XLSX.writeFile(wb, `BukuTrack-${safeName}-${safeDate}.xlsx`)
}

import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { QRCodeCanvas } from 'qrcode.react'
import QRCode from 'qrcode'
import JSZip from 'jszip'
import Layout from '../components/layout/Layout.jsx'
import { useStudents } from '../hooks/useStudents.jsx'
import { useClasses } from '../hooks/useClasses.jsx'
import { SquaresFour, List, DownloadSimple } from '@phosphor-icons/react'

// ── A4 @ 150dpi ──
const A4_W = 1240
const A4_H = 1754

async function getQRCanvas(value, size) {
  const c = document.createElement('canvas')
  await QRCode.toCanvas(c, value, { width: size, margin: 1, color: { dark: '#000000', light: '#ffffff' } })
  return c
}

function wrapText(ctx, text, cx, y, maxW, lineH) {
  const words = text.split(' ')
  let line = ''
  const lines = []
  for (const w of words) {
    const t = line ? line + ' ' + w : w
    if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w }
    else line = t
  }
  if (line) lines.push(line)
  lines.forEach((l, i) => ctx.fillText(l, cx, y + i * lineH))
  return lines.length * lineH
}

async function buildA4Grid(students, getClassName, title) {
  const COLS = 4, MARGIN = 70, GAP = 12, HEADER_H = 100
  const usableW = A4_W - MARGIN * 2
  const cellW = Math.floor((usableW - GAP * (COLS - 1)) / COLS)
  const QR = Math.floor(cellW * 0.72)
  const cellH = QR + 72
  const ROWS = Math.floor((A4_H - MARGIN * 2 - HEADER_H + GAP) / (cellH + GAP))
  const PER = COLS * ROWS

  const pages = []
  for (let i = 0; i < students.length; i += PER) pages.push(students.slice(i, i + PER))

  const canvases = []
  for (let pi = 0; pi < pages.length; pi++) {
    const c = document.createElement('canvas')
    c.width = A4_W; c.height = A4_H
    const ctx = c.getContext('2d')

    // Background
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, A4_W, A4_H)

    // Header
    ctx.fillStyle = '#111'; ctx.font = 'bold 30px sans-serif'; ctx.textAlign = 'left'
    ctx.fillText(title, MARGIN, MARGIN + 30)
    ctx.fillStyle = '#999'; ctx.font = '18px sans-serif'
    const date = new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' })
    const pageNote = pages.length > 1 ? ` · Halaman ${pi + 1}/${pages.length}` : ''
    ctx.fillText(`${students.length} murid · ${date}${pageNote}`, MARGIN, MARGIN + 60)

    // Cut hint
    ctx.fillStyle = '#ccc'; ctx.textAlign = 'right'; ctx.font = 'italic 14px sans-serif'
    ctx.fillText('✂  gunting mengikut garisan putus-putus', A4_W - MARGIN, MARGIN + 60)

    // Divider
    ctx.strokeStyle = '#e0e0e0'; ctx.lineWidth = 1.5; ctx.setLineDash([])
    ctx.beginPath()
    ctx.moveTo(MARGIN, MARGIN + HEADER_H - 8)
    ctx.lineTo(A4_W - MARGIN, MARGIN + HEADER_H - 8)
    ctx.stroke()

    // Cards
    for (let idx = 0; idx < pages[pi].length; idx++) {
      const student = pages[pi][idx]
      const col = idx % COLS
      const row = Math.floor(idx / COLS)
      const x = MARGIN + col * (cellW + GAP)
      const y = MARGIN + HEADER_H + row * (cellH + GAP)
      const cx = x + cellW / 2

      // Dashed cut guide
      ctx.setLineDash([5, 4]); ctx.strokeStyle = '#bbb'; ctx.lineWidth = 1.2
      ctx.strokeRect(x, y, cellW, cellH); ctx.setLineDash([])

      // QR
      const qr = await getQRCanvas(student.qr_code, QR)
      ctx.drawImage(qr, x + (cellW - QR) / 2, y + 10, QR, QR)

      // Name
      ctx.fillStyle = '#111'; ctx.font = 'bold 15px sans-serif'; ctx.textAlign = 'center'
      const nameH = wrapText(ctx, student.name, cx, y + QR + 26, cellW - 12, 18)

      // Class
      ctx.fillStyle = '#888'; ctx.font = '13px sans-serif'
      ctx.fillText(getClassName(student.class_id), cx, y + QR + 28 + nameH + 4)
    }

    canvases.push(c)
  }
  return canvases
}

async function buildA4Single(student, className) {
  const c = document.createElement('canvas')
  c.width = A4_W; c.height = A4_H
  const ctx = c.getContext('2d')

  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, A4_W, A4_H)

  // Frame
  ctx.strokeStyle = '#e0e0e0'; ctx.lineWidth = 3
  ctx.strokeRect(60, 60, A4_W - 120, A4_H - 120)

  // QR besar
  const QR = 640
  const qr = await getQRCanvas(student.qr_code, QR)
  const qrX = (A4_W - QR) / 2
  const qrY = Math.round(A4_H * 0.22)
  ctx.drawImage(qr, qrX, qrY, QR, QR)

  // Nama
  ctx.fillStyle = '#111'; ctx.font = 'bold 46px sans-serif'; ctx.textAlign = 'center'
  const nameY = qrY + QR + 62
  const nameH = wrapText(ctx, student.name, A4_W / 2, nameY, A4_W - 180, 56)

  // Kelas
  ctx.fillStyle = '#777'; ctx.font = '34px sans-serif'
  ctx.fillText(className, A4_W / 2, nameY + nameH + 28)

  // Watermark
  ctx.fillStyle = '#ddd'; ctx.font = '20px sans-serif'
  ctx.fillText('BukuTrack', A4_W / 2, A4_H - 90)

  return c
}

function canvasToBlob(canvas) {
  return new Promise(res => canvas.toBlob(blob => res(blob), 'image/png'))
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename
  document.body.appendChild(a); a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// ── QR Card (paparan skrin sahaja) ──
function QRCard({ student, className, onDownload, listView }) {
  if (listView) {
    return (
      <div className="qr-list-row" id={`qr-${student.id}`}>
        <div className="qr-list-qr">
          <QRCodeCanvas value={student.qr_code} size={48} level="M" includeMargin={false} style={{ display: 'block' }} />
        </div>
        <div className="qr-list-info">
          <div className="qr-list-name">{student.name}</div>
          <div className="qr-list-class">{className}</div>
        </div>
        <button className="qr-dl-btn" onClick={() => onDownload(student)} title="Muat turun A4 PNG">
          <DownloadSimple size={15} weight="bold" /> A4
        </button>
      </div>
    )
  }

  return (
    <div className="qr-card" id={`qr-${student.id}`}>
      <div className="qr-placeholder">
        <QRCodeCanvas value={student.qr_code} size={82} level="M" includeMargin={false} style={{ display: 'block' }} />
      </div>
      <div className="qr-sname">{student.name}</div>
      <div style={{ fontSize: '9px', color: 'var(--ink3)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>{className}</div>
      <button className="qr-dl-btn" style={{ marginTop: '8px' }} onClick={() => onDownload(student)} title="Muat turun A4">
        <DownloadSimple size={13} weight="bold" />
        <span style={{ fontSize: '10px' }}>A4</span>
      </button>
    </div>
  )
}

export default function QRPrint() {
  const { t } = useTranslation()
  const { students, loading } = useStudents()
  const { classes } = useClasses()
  const [filterClassId, setFilterClassId] = useState(null)
  const [listView, setListView] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const filtered = students.filter(s => !filterClassId || s.class_id === filterClassId)

  function getClassName(classId) {
    return classes.find(c => c.id === classId)?.year_name || '—'
  }

  function getClassTitle() {
    if (!filterClassId) return 'Semua Kelas'
    const cls = classes.find(c => c.id === filterClassId)
    return cls ? `${cls.subject} · ${cls.year_name}` : 'Kelas'
  }

  // Muat turun satu murid — A4 tunggal
  const handleDownload = useCallback(async (student) => {
    setDownloading(true)
    try {
      const canvas = await buildA4Single(student, getClassName(student.class_id))
      const blob = await canvasToBlob(canvas)
      triggerDownload(blob, `QR-${student.name.replace(/\s+/g, '-')}.png`)
    } finally {
      setDownloading(false)
    }
  }, [classes])

  // Muat turun semua murid (kelas) — grid A4
  const handleBulkDownload = useCallback(async () => {
    if (filtered.length === 0 || downloading) return
    setDownloading(true)
    try {
      const title = getClassTitle()
      const pages = await buildA4Grid(filtered, getClassName, title)
      const label = title.replace(/\s+·\s+/g, '-').replace(/\s+/g, '-')

      if (pages.length === 1) {
        const blob = await canvasToBlob(pages[0])
        triggerDownload(blob, `QR-A4-${label}.png`)
      } else {
        const zip = new JSZip()
        for (let i = 0; i < pages.length; i++) {
          const blob = await canvasToBlob(pages[i])
          zip.file(`QR-A4-${label}-Halaman-${i + 1}.png`, await blob.arrayBuffer())
        }
        const zipBlob = await zip.generateAsync({ type: 'blob' })
        triggerDownload(zipBlob, `QR-A4-${label}.zip`)
      }
    } finally {
      setDownloading(false)
    }
  }, [filtered, filterClassId, classes, downloading])

  return (
    <Layout
      title={t('qrPrint.title')}
      breadcrumb={t('nav.management')}
      actions={
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleBulkDownload}
            disabled={downloading || filtered.length === 0}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
          >
            <DownloadSimple size={14} weight="bold" />
            {downloading ? 'Memproses...' : 'Muat Turun A4'}
          </button>
        </div>
      }
    >
      <div className="filter-bar">
        <select
          className="filter-select"
          value={filterClassId || ''}
          onChange={e => setFilterClassId(e.target.value || null)}
        >
          <option value="">{t('qrPrint.allClasses')}</option>
          {classes.map(cls => (
            <option key={cls.id} value={cls.id}>{cls.year_name}</option>
          ))}
        </select>

        <span style={{ fontSize: '11px', color: 'var(--ink3)', fontFamily: 'var(--font-mono)', marginLeft: 'auto' }}>
          {filtered.length} kad
        </span>

        <div className="view-toggle">
          <button className={`view-toggle-btn${!listView ? ' active' : ''}`} onClick={() => setListView(false)}>
            <SquaresFour size={16} weight={!listView ? 'fill' : 'regular'} />
          </button>
          <button className={`view-toggle-btn${listView ? ' active' : ''}`} onClick={() => setListView(true)}>
            <List size={16} weight={listView ? 'fill' : 'regular'} />
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--ink3)' }}>{t('common.loading')}</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '48px', opacity: 0.15, marginBottom: '12px' }}>▦</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', color: 'var(--ink)', letterSpacing: '2px', marginBottom: '8px' }}>
            Tiada Murid
          </div>
          <div style={{ fontSize: '13px', color: 'var(--ink3)' }}>Tambah murid dalam Senarai Murid dahulu.</div>
        </div>
      ) : (
        <div className={listView ? 'qr-list' : 'qr-grid'}>
          {filtered.map(student => (
            <QRCard
              key={student.id}
              student={student}
              className={getClassName(student.class_id)}
              onDownload={handleDownload}
              listView={listView}
            />
          ))}
        </div>
      )}

      {/* FAB muat turun A4 — mobile only */}
      <button className="fab" onClick={handleBulkDownload} disabled={downloading} aria-label="Muat turun A4">
        <DownloadSimple size={22} weight="bold" />
      </button>
    </Layout>
  )
}

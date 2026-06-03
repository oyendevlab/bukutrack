import { useState, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { QRCodeCanvas } from 'qrcode.react'
import JSZip from 'jszip'
import Layout from '../components/layout/Layout.jsx'
import { useStudents } from '../hooks/useStudents.jsx'
import { useClasses } from '../hooks/useClasses.jsx'
import { Printer, SquaresFour, List, DownloadSimple } from '@phosphor-icons/react'

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
        <button className="qr-dl-btn no-print" onClick={() => onDownload(student)} title="Muat turun PNG">
          <DownloadSimple size={15} weight="bold" />
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
      <button className="qr-dl-btn no-print" style={{ marginTop: '8px' }} onClick={() => onDownload(student)} title="Muat turun PNG">
        <DownloadSimple size={13} weight="bold" />
        <span style={{ fontSize: '10px' }}>PNG</span>
      </button>
    </div>
  )
}

// Buat canvas komposit: QR + nama + kelas
function makeCompositeCanvas(qrCanvas, name, className) {
  const qrSize = qrCanvas.width
  const padding = 16
  const nameSize = 15
  const classSize = 12
  const gap = 10
  const totalH = padding + qrSize + gap + nameSize + 4 + classSize + padding

  const offscreen = document.createElement('canvas')
  offscreen.width = qrSize + padding * 2
  offscreen.height = totalH
  const ctx = offscreen.getContext('2d')

  // Latar putih
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, offscreen.width, offscreen.height)

  // QR
  ctx.drawImage(qrCanvas, padding, padding)

  // Nama
  ctx.fillStyle = '#111111'
  ctx.font = `bold ${nameSize}px sans-serif`
  ctx.textAlign = 'center'
  ctx.fillText(name, offscreen.width / 2, padding + qrSize + gap + nameSize)

  // Kelas
  ctx.fillStyle = '#888888'
  ctx.font = `${classSize}px sans-serif`
  ctx.fillText(className, offscreen.width / 2, padding + qrSize + gap + nameSize + 4 + classSize)

  return offscreen
}

export default function QRPrint() {
  const { t } = useTranslation()
  const { students, loading } = useStudents()
  const { classes } = useClasses()
  const [filterClassId, setFilterClassId] = useState(null)
  const [listView, setListView] = useState(false)
  const [zipping, setZipping] = useState(false)
  const containerRef = useRef(null)

  const filtered = students.filter(s => !filterClassId || s.class_id === filterClassId)

  function getClassName(classId) {
    return classes.find(c => c.id === classId)?.year_name || '—'
  }

  const handleDownload = useCallback((student) => {
    const qrCanvas = document.querySelector(`#qr-${student.id} canvas`)
    if (!qrCanvas) return
    const composite = makeCompositeCanvas(qrCanvas, student.name, getClassName(student.class_id))
    const a = document.createElement('a')
    a.href = composite.toDataURL('image/png')
    a.download = `QR-${student.name.replace(/\s+/g, '-')}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }, [classes])

  const handleBulkDownload = useCallback(async () => {
    if (filtered.length === 0) return
    setZipping(true)
    const zip = new JSZip()
    const folderLabel = filterClassId
      ? getClassName(filterClassId).replace(/\s+/g, '-')
      : 'Semua-Kelas'
    const folder = zip.folder(folderLabel)

    for (const student of filtered) {
      const qrCanvas = document.querySelector(`#qr-${student.id} canvas`)
      if (!qrCanvas) continue
      const composite = makeCompositeCanvas(qrCanvas, student.name, getClassName(student.class_id))
      const base64 = composite.toDataURL('image/png').split(',')[1]
      folder.file(`QR-${student.name.replace(/\s+/g, '-')}.png`, base64, { base64: true })
    }

    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `QR-${folderLabel}.zip`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setZipping(false)
  }, [filtered, filterClassId, classes])

  return (
    <Layout
      title={t('qrPrint.title')}
      breadcrumb={t('nav.management')}
      actions={
        <div style={{ display: 'flex', gap: '6px' }}>
          <button className="btn btn-ghost btn-sm no-print" onClick={handleBulkDownload} disabled={zipping}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <DownloadSimple size={14} weight="bold" />
            {zipping ? 'Memproses...' : '↓ ZIP'}
          </button>
          <button className="btn btn-primary btn-sm no-print" onClick={() => window.print()}>
            🖨 {t('qrPrint.printAll')}
          </button>
        </div>
      }
    >
      <div className="filter-bar no-print">
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

        <div className="view-toggle no-print">
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
        <div ref={containerRef} className={listView ? 'qr-list' : 'qr-grid'}>
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

      {/* FAB muat turun ZIP — mobile only */}
      <button className="fab no-print" onClick={handleBulkDownload} disabled={zipping} aria-label="Muat turun ZIP">
        <DownloadSimple size={22} weight="bold" />
      </button>
    </Layout>
  )
}

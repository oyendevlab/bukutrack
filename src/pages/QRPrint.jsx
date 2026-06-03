import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { QRCodeCanvas } from 'qrcode.react'
import Layout from '../components/layout/Layout.jsx'
import { useStudents } from '../hooks/useStudents.jsx'
import { useClasses } from '../hooks/useClasses.jsx'
import { Printer } from '@phosphor-icons/react'

function QRCard({ student, className, onDownload }) {
  return (
    <div className="qr-card" id={`qr-${student.id}`}>
      <div className="qr-placeholder" style={{ background: 'white', border: '1px solid var(--rule)', padding: '6px', width: 96, height: 96 }}>
        <QRCodeCanvas
          value={student.qr_code}
          size={82}
          level="M"
          includeMargin={false}
          style={{ display: 'block' }}
        />
      </div>
      <div className="qr-sname">{student.name}</div>
      {student.student_no && <div className="qr-sid">{student.student_no}</div>}
      <div style={{ fontSize: '9px', color: 'var(--ink3)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>{className}</div>
      <button
        className="btn btn-ghost btn-sm no-print"
        style={{ marginTop: '8px', fontSize: '10px', padding: '4px 10px' }}
        onClick={() => onDownload(student)}
      >
        ↓ PNG
      </button>
    </div>
  )
}

export default function QRPrint() {
  const { t } = useTranslation()
  const { students, loading } = useStudents()
  const { classes } = useClasses()
  const [filterClassId, setFilterClassId] = useState(null)

  const filtered = students.filter(s => !filterClassId || s.class_id === filterClassId)

  function getClassName(classId) {
    return classes.find(c => c.id === classId)?.year_name || '—'
  }

  const handleDownload = useCallback((student) => {
    const canvas = document.querySelector(`#qr-${student.id} canvas`)
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = `QR-${student.name.replace(/\s+/g, '-')}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }, [])

  return (
    <Layout
      title={t('qrPrint.title')}
      breadcrumb={t('nav.management')}
      actions={
        <button className="btn btn-primary btn-sm no-print" onClick={() => window.print()}>
          🖨 {t('qrPrint.printAll')}
        </button>
      }
    >
      {/* Filter bar */}
      <div className="filter-bar no-print">
        <div className={`filter-chip${!filterClassId ? ' active' : ''}`} onClick={() => setFilterClassId(null)}>
          {t('qrPrint.allClasses')}
        </div>
        {classes.map(cls => (
          <div key={cls.id} className={`filter-chip${filterClassId === cls.id ? ' active' : ''}`}
            onClick={() => setFilterClassId(cls.id)}>
            {cls.year_name}
          </div>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--ink3)', fontFamily: 'var(--font-mono)' }}>
          {filtered.length} kad
        </span>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--ink3)' }}>{t('common.loading')}</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '48px', opacity: 0.15, marginBottom: '12px' }}>▦</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', color: 'var(--ink)', letterSpacing: '2px', marginBottom: '8px' }}>
            Tiada Murid
          </div>
          <div style={{ fontSize: '13px', color: 'var(--ink3)' }}>
            Tambah murid dalam Senarai Murid dahulu.
          </div>
        </div>
      ) : (
        <>
          <div className="alert alert-ok no-print" style={{ marginBottom: '16px' }}>
            ✓ &nbsp;Klik <strong>🖨 Cetak Semua</strong> atau tekan <strong>Ctrl+P / ⌘+P</strong> untuk cetak semua kad QR.
          </div>
          <div className="qr-grid">
            {filtered.map(student => (
              <QRCard
                key={student.id}
                student={student}
                className={getClassName(student.class_id)}
                onDownload={handleDownload}
              />
            ))}
          </div>
        </>
      )}
      {/* FAB print — mobile only */}
      <button className="fab no-print" onClick={() => window.print()} aria-label={t('qrPrint.printAll')}>
        <Printer size={22} weight="bold" />
      </button>
    </Layout>
  )
}

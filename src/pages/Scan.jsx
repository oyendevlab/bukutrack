import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Layout from '../components/layout/Layout.jsx'
import ScannerCamera from '../components/features/scan/ScannerCamera.jsx'
import BookChecklistModal from '../components/features/scan/BookChecklistModal.jsx'
import RecentScans from '../components/features/scan/RecentScans.jsx'
import { useClasses } from '../hooks/useClasses.jsx'
import { useStudents } from '../hooks/useStudents.jsx'
import { useBooks } from '../hooks/useBooks.jsx'
import { useSubmissions } from '../hooks/useSubmissions.jsx'

export default function Scan() {
  const { t } = useTranslation()
  const { classes } = useClasses()
  const { students } = useStudents()
  const { books } = useBooks()
  const { submissions, toggleSubmission } = useSubmissions()

  const [activeClassId, setActiveClassId] = useState(null)
  const [scannedStudent, setScannedStudent] = useState(null)
  const [saving, setSaving] = useState(false)
  const [recentScans, setRecentScans] = useState([])
  const [cameraActive, setCameraActive] = useState(true)

  const activeClass = classes.find(c => c.id === activeClassId) ?? classes[0]
  const classBooks = books.filter(b => b.class_id === activeClass?.id || b.class_id === null)

  const handleScan = useCallback((qrCode) => {
    const student = students.find(s => s.qr_code === qrCode)
    if (!student) return
    if (scannedStudent?.id === student.id) return
    setCameraActive(false)
    setScannedStudent(student)
  }, [students, scannedStudent])

  async function handleSave(student, toAdd, toRemove) {
    setSaving(true)
    for (const book of toAdd) await toggleSubmission(student.id, book.id, false)
    for (const book of toRemove) await toggleSubmission(student.id, book.id, true)
    setRecentScans(prev => [{
      studentName: student.name,
      booksAdded: toAdd.length,
      time: new Date().toISOString(),
    }, ...prev])
    setSaving(false)
    setScannedStudent(null)
    setCameraActive(true)
  }

  function handleCloseModal() {
    setScannedStudent(null)
    setCameraActive(true)
  }

  return (
    <Layout
      title={t('scan.title')}
      breadcrumb={t('scan.subtitle')}
      actions={<button className="btn btn-ghost btn-sm">? {t('scan.help')}</button>}
    >
      <div className="scan-center">
        <div className="scan-box">

          {/* Pilih Kelas */}
          {classes.length > 0 && (
            <div className="kelas-selector">
              <div className="kelas-selector-label">{t('scan.selectClass')}</div>
              <div className="kelas-pills">
                {classes.map(cls => (
                  <div
                    key={cls.id}
                    className={`kelas-pill${activeClass?.id === cls.id ? ' active' : ''}`}
                    onClick={() => setActiveClassId(cls.id)}
                  >
                    {cls.year_name}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rule" />

          {/* Kamera QR */}
          <ScannerCamera onScan={handleScan} active={cameraActive} />

          <div className="scan-title">{t('scan.ready')}</div>
          <div className="scan-sub">
            {t('scan.activeClass')}: <strong>{activeClass?.year_name ?? '—'}</strong>. {t('scan.subtitle')}.
          </div>

          {classes.length === 0 && (
            <div style={{ fontSize: '12px', color: 'var(--amber)', fontWeight: 600, marginTop: '8px' }}>
              ▲ Tiada kelas — sila tambah kelas dahulu dalam Senarai Kelas.
            </div>
          )}

          {/* Recent Scans */}
          {recentScans.length > 0 && (
            <>
              <div className="rule" />
              <RecentScans scans={recentScans} />
            </>
          )}
        </div>
      </div>

      {/* Modal checklist buku */}
      {scannedStudent && (
        <BookChecklistModal
          student={scannedStudent}
          books={classBooks}
          submissions={submissions}
          onSave={handleSave}
          onClose={handleCloseModal}
          saving={saving}
        />
      )}
    </Layout>
  )
}

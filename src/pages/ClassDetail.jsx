import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Layout from '../components/layout/Layout.jsx'
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx'
import { useClasses } from '../hooks/useClasses.jsx'
import { useStudents } from '../hooks/useStudents.jsx'
import { useBooks } from '../hooks/useBooks.jsx'
import { useAppContext } from '../context/AppContext.jsx'
import { ArrowLeft, Camera, Trash, UserPlus, UploadSimple, FileXls } from '@phosphor-icons/react'
import CsvImportModal from '../components/ui/CsvImportModal.jsx'
import { exportClassMatrix } from '../utils/exportExcel.js'

const EMPTY_STUDENT = { name: '', studentNo: '' }

function shortDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('ms-MY', { day: 'numeric', month: 'numeric' })
}

export default function ClassDetail() {
  const { classId } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const { classes } = useClasses()
  const { students, addStudent, addStudentsBulk } = useStudents()
  const { books } = useBooks()
  const { sessions, sessionRecords, deleteSession } = useAppContext()

  const [confirmDelete, setConfirmDelete]   = useState(null)
  const [showAddStudent, setShowAddStudent] = useState(false)
  const [showCsvImport, setShowCsvImport]   = useState(false)
  const [studentForm, setStudentForm]       = useState(EMPTY_STUDENT)
  const [studentError, setStudentError]     = useState('')
  const [saving, setSaving]                 = useState(false)

  const cls = classes.find(c => c.id === classId)

  const classStudents = useMemo(
    () => students.filter(s => s.class_id === classId).sort((a, b) => a.name.localeCompare(b.name)),
    [students, classId]
  )
  const classBooks = useMemo(
    () => books.filter(b => b.class_id === classId || b.class_id === null),
    [books, classId]
  )
  const classSessions = useMemo(
    () => [...sessions.filter(s => s.class_id === classId)].sort((a, b) => a.checked_at.localeCompare(b.checked_at)),
    [sessions, classId]
  )

  // Lookup pantas: recordMap[sessionId][studentId] = record
  const recordMap = useMemo(() => {
    const map = {}
    sessionRecords.forEach(r => {
      if (!map[r.session_id]) map[r.session_id] = {}
      map[r.session_id][r.student_id] = r
    })
    return map
  }, [sessionRecords])

  const todayStr = new Date().toISOString().slice(0, 10)
  const todaySessions = classSessions.filter(s => s.checked_at === todayStr)

  async function handleSaveStudent() {
    if (!studentForm.name.trim()) { setStudentError('Nama murid wajib diisi.'); return }
    setSaving(true)
    setStudentError('')
    const { error } = await addStudent(studentForm.name.trim(), classId, studentForm.studentNo.trim())
    setSaving(false)
    if (error) { setStudentError('Gagal simpan. Cuba lagi.'); return }
    setStudentForm(EMPTY_STUDENT)
    setShowAddStudent(false)
  }

  if (!cls) {
    return (
      <Layout title="Kelas" breadcrumb="Senarai Kelas">
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--ink3)', fontSize: '13px' }}>
          Kelas tidak dijumpai.{' '}
          <span style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 700 }} onClick={() => navigate('/classes')}>
            Kembali ke Senarai Kelas
          </span>
        </div>
      </Layout>
    )
  }

  return (
    <Layout
      title={`${cls.subject} · ${cls.year_name}`}
      breadcrumb={
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/classes')}>Senarai Kelas</span>
          <span style={{ color: 'var(--ink3)' }}>›</span>
          <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{cls.year_name}</span>
        </span>
      }
      actions={
        <>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/classes')}>
            <ArrowLeft size={14} weight="bold" /> {t('class.allClasses')}
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/scan')}>
            <Camera size={14} weight="bold" /> Sesi Baru
          </button>
        </>
      }
    >
      {/* Stats Strip */}
      <div className="stats-strip">
        <div className="stat-cell" style={{ '--sc': 'var(--ink)' }}>
          <div className="stat-label">{t('class.students')}</div>
          <div className="stat-num">{classStudents.length}</div>
          <div className="stat-note">dalam kelas</div>
        </div>
        <div className="stat-cell" style={{ '--sc': 'var(--accent)' }}>
          <div className="stat-label">Buku</div>
          <div className="stat-num">{classBooks.length}</div>
          <div className="stat-note">ditetapkan</div>
        </div>
        <div className="stat-cell" style={{ '--sc': 'var(--green)' }}>
          <div className="stat-label">Sesi</div>
          <div className="stat-num green">{classSessions.length}</div>
          <div className="stat-note">jumlah</div>
        </div>
        <div className="stat-cell" style={{ '--sc': 'var(--amber)' }}>
          <div className="stat-label">Hari Ini</div>
          <div className="stat-num">{todaySessions.length}</div>
          <div className="stat-note">sesi hari ini</div>
        </div>
      </div>

      {/* Senarai Murid */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Murid</div>
          <button className="btn btn-ghost btn-sm" onClick={() => setShowCsvImport(true)}>
            <UploadSimple size={13} weight="bold" /> Import CSV
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => { setStudentForm(EMPTY_STUDENT); setStudentError(''); setShowAddStudent(true) }}>
            <UserPlus size={13} weight="bold" /> Tambah Murid
          </button>
        </div>
        {classStudents.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--ink3)', fontSize: '13px' }}>
            <div style={{ fontSize: '28px', opacity: 0.25, marginBottom: '10px' }}>👤</div>
            Belum ada murid dalam kelas ini.
          </div>
        ) : (
          <div style={{ padding: '8px 0' }}>
            {classStudents.map((stu, idx) => (
              <div key={stu.id} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '9px 18px',
                background: idx % 2 === 0 ? 'transparent' : 'var(--surface2)',
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink3)', width: '22px', flexShrink: 0 }}>
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', flex: 1 }}>{stu.name}</span>
                {stu.student_no && (
                  <span style={{ fontSize: '10px', color: 'var(--ink3)', fontFamily: 'var(--font-mono)' }}>#{stu.student_no}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Matriks Kehadiran */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="card-header">
          <div className="card-title">Rekod Semakan</div>
          <span style={{ fontSize: '10px', color: 'var(--ink3)', fontFamily: 'var(--font-mono)', marginRight: 'auto' }}>
            {classSessions.length} sesi · {classStudents.length} murid
          </span>
          {classSessions.length > 0 && classStudents.length > 0 && (
            <button
              className="btn btn-ghost btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
              onClick={() => exportClassMatrix({
                cls,
                students: classStudents,
                sessions: classSessions,
                sessionRecords,
                books: classBooks,
              })}
              title="Export ke Excel"
            >
              <FileXls size={14} weight="bold" />
              Excel
            </button>
          )}
        </div>

        {classSessions.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--ink3)', fontSize: '13px' }}>
            <div style={{ marginBottom: '12px', fontSize: '32px', opacity: 0.2 }}>📋</div>
            Belum ada sesi semakan untuk kelas ini.
            <div style={{ marginTop: '12px' }}>
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/scan')}>
                <Camera size={13} weight="bold" /> Mula Sesi Pertama
              </button>
            </div>
          </div>
        ) : (
          <div className="matrix-scroll">
            <table className="matrix-table">
              <thead>
                <tr>
                  <th className="matrix-th-num">#</th>
                  <th className="matrix-th-name">NAMA</th>
                  {classSessions.map(session => {
                    const book = session.books || classBooks.find(b => b.id === session.book_id)
                    return (
                      <th key={session.id} className="matrix-th-session">
                        <div className="matrix-session-date">{shortDate(session.checked_at)}</div>
                        <div className="matrix-session-book" title={book?.name}>
                          {book?.emoji || '📖'}
                        </div>
                        <button
                          className="matrix-delete-btn"
                          title="Padam sesi"
                          onClick={() => setConfirmDelete(session)}
                        >
                          <Trash size={10} weight="bold" />
                        </button>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {classStudents.length === 0 ? (
                  <tr>
                    <td colSpan={classSessions.length + 2} style={{ padding: '24px', textAlign: 'center', color: 'var(--ink3)', fontSize: '12px' }}>
                      Tiada murid dalam kelas ini.
                    </td>
                  </tr>
                ) : classStudents.map((stu, idx) => (
                  <tr key={stu.id} className={idx % 2 === 0 ? 'matrix-row-even' : 'matrix-row-odd'}>
                    <td className="matrix-td-num">{String(idx + 1).padStart(2, '0')}</td>
                    <td className="matrix-td-name">{stu.name}</td>
                    {classSessions.map(session => {
                      const rec = recordMap[session.id]?.[stu.id]
                      const status = rec?.status
                      return (
                        <td key={session.id} className="matrix-td-cell">
                          {status === 'present' && <span className="matrix-badge matrix-present">✓</span>}
                          {status === 'absent'  && <span className="matrix-badge matrix-absent">✗</span>}
                          {!status              && <span className="matrix-badge matrix-empty">—</span>}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {confirmDelete && (
        <ConfirmDialog
          message={`Padam sesi "${shortDate(confirmDelete.checked_at)}"? Semua rekod murid dalam sesi ini akan dipadam.`}
          onConfirm={async () => { await deleteSession(confirmDelete.id); setConfirmDelete(null) }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {showCsvImport && (
        <CsvImportModal
          className={`${cls.subject} · ${cls.year_name}`}
          onClose={() => setShowCsvImport(false)}
          onImport={async names => { await addStudentsBulk(names, classId) }}
        />
      )}

      {showAddStudent && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowAddStudent(false)}>
          <div className="modal">
            <div className="modal-head">
              <div className="modal-init">👤</div>
              <div>
                <div className="modal-sname">Tambah Murid</div>
                <div className="modal-smeta">{cls.subject} · {cls.year_name}</div>
              </div>
            </div>
            <div className="modal-body">
              {studentError && <div className="alert alert-warn" style={{ marginBottom: '12px' }}>▲ &nbsp;{studentError}</div>}
              <label className="input-label">Nama Penuh Murid</label>
              <input
                className="input" placeholder="cth: Ahmad Danial bin Ali"
                value={studentForm.name} autoFocus
                onChange={e => setStudentForm(f => ({ ...f, name: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleSaveStudent()}
              />
              <label className="input-label">No. Murid <span style={{ color: 'var(--ink3)', fontWeight: 400 }}>(pilihan)</span></label>
              <input
                className="input" placeholder="cth: 001"
                value={studentForm.studentNo}
                onChange={e => setStudentForm(f => ({ ...f, studentNo: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleSaveStudent()}
              />
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={() => setShowAddStudent(false)} disabled={saving}>Batal</button>
              <button className="btn btn-primary" onClick={handleSaveStudent} disabled={saving}>
                {saving ? '...' : '✓ Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

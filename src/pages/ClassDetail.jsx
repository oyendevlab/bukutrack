import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Layout from '../components/layout/Layout.jsx'
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx'
import { useClasses } from '../hooks/useClasses.jsx'
import { useStudents } from '../hooks/useStudents.jsx'
import { useBooks } from '../hooks/useBooks.jsx'
import { useAppContext } from '../context/AppContext.jsx'
import { ArrowLeft, Camera, Trash } from '@phosphor-icons/react'

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
  const { students } = useStudents()
  const { books } = useBooks()
  const { sessions, sessionRecords, deleteSession } = useAppContext()

  const [confirmDelete, setConfirmDelete] = useState(null)

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

      {/* Matriks Kehadiran */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="card-header">
          <div className="card-title">Rekod Semakan</div>
          <span style={{ fontSize: '10px', color: 'var(--ink3)', fontFamily: 'var(--font-mono)' }}>
            {classSessions.length} sesi · {classStudents.length} murid
          </span>
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
    </Layout>
  )
}

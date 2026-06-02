import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Layout from '../components/layout/Layout.jsx'
import { useClasses } from '../hooks/useClasses.jsx'
import { useStudents } from '../hooks/useStudents.jsx'
import { useBooks } from '../hooks/useBooks.jsx'
import { useSubmissions } from '../hooks/useSubmissions.jsx'
import { exportToExcel, exportToCsv, exportToPdf } from '../lib/export.js'
import { ExportBtn } from '../components/ui/IconBtn.jsx'
import { ArrowLeft, QrCode } from '@phosphor-icons/react'

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' })
}

export default function ClassDetail() {
  const { classId } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const { classes } = useClasses()
  const { students } = useStudents()
  const { books } = useBooks()
  const { submissions, toggleSubmission } = useSubmissions()

  const cls = classes.find(c => c.id === classId)
  const classStudents = useMemo(() => students.filter(s => s.class_id === classId), [students, classId])
  const classBooks = useMemo(() => books.filter(b => b.class_id === classId || b.class_id === null), [books, classId])

  // Submission lookup
  const submissionMap = useMemo(() => {
    const map = new Map()
    for (const sub of submissions) {
      if (!map.has(sub.student_id)) map.set(sub.student_id, new Set())
      map.get(sub.student_id).add(sub.book_id)
    }
    return map
  }, [submissions])

  const totalStudents = classStudents.length

  const completeStudents = useMemo(() =>
    classStudents.filter(s => classBooks.length > 0 && classBooks.every(b => (submissionMap.get(s.id) ?? new Set()).has(b.id))).length,
    [classStudents, classBooks, submissionMap]
  )

  const incompleteStudents = totalStudents - completeStudents

  // Scan hari ini
  const todayStr = new Date().toDateString()
  const todayScans = useMemo(() =>
    submissions.filter(sub => classStudents.some(s => s.id === sub.student_id) && new Date(sub.submitted_at).toDateString() === todayStr),
    [submissions, classStudents, todayStr]
  )
  const todayScanCount = new Set(todayScans.map(s => s.student_id)).size

  // Murid belum lengkap (sorted by paling sedikit buku)
  const incompleteList = useMemo(() =>
    classStudents
      .map(s => ({ student: s, count: classBooks.filter(b => (submissionMap.get(s.id) ?? new Set()).has(b.id)).length, total: classBooks.length }))
      .filter(r => r.count < r.total)
      .sort((a, b) => a.count - b.count),
    [classStudents, classBooks, submissionMap]
  )

  // Untuk export
  const studentRecords = useMemo(() =>
    classStudents.map(s => {
      const done = submissionMap.get(s.id) ?? new Set()
      const count = classBooks.filter(b => done.has(b.id)).length
      const total = classBooks.length
      return {
        student: s,
        submittedBookIds: done,
        status: total === 0 ? 'n/a' : count === total ? 'complete' : count === 0 ? 'none' : 'partial',
        submittedCount: count,
        totalBooks: total,
      }
    }),
    [classStudents, classBooks, submissionMap]
  )

  if (!cls) {
    return (
      <Layout title="Kelas" breadcrumb="Dashboard">
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--ink3)', fontSize: '13px' }}>
          Kelas tidak dijumpai.{' '}
          <span style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 700 }} onClick={() => navigate('/')}>
            Kembali ke Dashboard
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
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Dashboard</span>
          <span style={{ color: 'var(--ink3)' }}>›</span>
          <span style={{ color: 'var(--red)', fontWeight: 700 }}>{cls.year_name}</span>
        </span>
      }
      actions={
        <>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')}><ArrowLeft size={14} weight="bold" /> {t('class.allClasses')}</button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/scan')}><QrCode size={14} weight="bold" /> {t('class.scanThisClass')}</button>
        </>
      }
    >
      {/* Alert */}
      {incompleteStudents > 0 && (
        <div className="alert alert-warn">
          ▲ &nbsp;<strong>{incompleteStudents} murid</strong> dalam kelas ini belum lengkap.
        </div>
      )}

      {/* Stats Strip — 4 sel */}
      <div className="stats-strip">
        <div className="stat-cell" style={{ '--sc': 'var(--ink)' }}>
          <div className="stat-label">{t('class.students')}</div>
          <div className="stat-num">{totalStudents}</div>
          <div className="stat-note">dalam kelas ini</div>
        </div>
        <div className="stat-cell" style={{ '--sc': 'var(--green)' }}>
          <div className="stat-label">{t('class.complete')}</div>
          <div className="stat-num green">{completeStudents}</div>
          <div className="stat-note">{totalStudents > 0 ? ((completeStudents / totalStudents) * 100).toFixed(1) : 0}%</div>
        </div>
        <div className="stat-cell" style={{ '--sc': 'var(--red)' }}>
          <div className="stat-label">{t('class.incomplete')}</div>
          <div className="stat-num red">{incompleteStudents}</div>
          <div className="stat-note">perlu tindakan</div>
        </div>
        <div className="stat-cell" style={{ '--sc': 'var(--amber)' }}>
          <div className="stat-label">{t('class.scanToday')}</div>
          <div className="stat-num">{todayScanCount}</div>
          <div className="stat-note">
            {todayScans.length > 0 ? `terakhir ${formatTime(todayScans[0].submitted_at)}` : 'tiada scan hari ini'}
          </div>
        </div>
      </div>

      {/* Grid: Status Buku + Belum Lengkap */}
      <div className="grid-3-1">
        {/* Status per buku */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">{t('class.bookStatus')}</div>
            <span className="tag tag-ink">{classBooks.length} Buku</span>
          </div>
          {classBooks.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--ink3)', fontSize: '13px' }}>
              Tiada buku ditetapkan. Tambah buku dalam <span style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 700 }} onClick={() => navigate('/books')}>Senarai Buku</span>.
            </div>
          ) : classBooks.map(book => {
            const count = classStudents.filter(s => (submissionMap.get(s.id) ?? new Set()).has(book.id)).length
            const pct = totalStudents > 0 ? (count / totalStudents) * 100 : 0
            const fillClass = pct >= 100 ? 'ok' : pct >= 70 ? 'warn' : 'danger'
            return (
              <div key={book.id} className="book-row">
                <div className="book-row-header">
                  <div className="book-row-name">{book.emoji} {book.name}</div>
                  <div className="book-row-count">{count} / {totalStudents}</div>
                </div>
                <div className="prog-bar">
                  <div className={`prog-fill ${fillClass}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
                <div className="book-row-pct" style={{ color: pct >= 100 ? 'var(--green)' : pct >= 70 ? 'var(--amber)' : 'var(--red)' }}>
                  {pct.toFixed(1)}% {pct >= 100 && '✓'}
                </div>
              </div>
            )
          })}
        </div>

        {/* Sidebar: Belum Lengkap */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title">{t('class.incompleteList')}</div>
              {incompleteStudents > 0 && <span className="tag tag-red">{incompleteStudents}</span>}
            </div>
            <div style={{ padding: '10px 16px' }}>
              {incompleteList.length === 0 ? (
                <div style={{ fontSize: '12px', color: 'var(--green)', fontWeight: 600, padding: '8px 0' }}>✓ Semua murid lengkap!</div>
              ) : incompleteList.slice(0, 6).map(({ student, count, total }) => (
                <div key={student.id} className="recent-item">
                  <div className="recent-dot" style={{ background: 'var(--red)', borderRadius: '50%' }} />
                  <div className="recent-name" style={{ fontSize: '12px' }}>{student.name}</div>
                  <span className={`badge ${count === 0 ? 'badge-none' : 'badge-partial'}`}>{count}/{total}</span>
                </div>
              ))}
              {incompleteList.length > 6 && (
                <div style={{ paddingTop: '8px', fontSize: '11px', color: 'var(--red)', fontWeight: 700, letterSpacing: '0.5px' }}>
                  +{incompleteList.length - 6} lagi murid belum lengkap
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Jadual Rekod Murid */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">{t('class.studentRecords')}</div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <ExportBtn type="excel" label="Excel" onClick={() => exportToExcel(studentRecords, classBooks, cls.year_name)} />
            <ExportBtn type="csv" label="CSV" onClick={() => exportToCsv(studentRecords, classBooks, cls.year_name)} />
            <ExportBtn type="pdf" label="PDF" onClick={() => exportToPdf(studentRecords, classBooks, cls.year_name)} />
          </div>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nama Murid</th>
                {classBooks.map(b => <th key={b.id}>{b.emoji} {b.name}</th>)}
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {classStudents.length === 0 ? (
                <tr>
                  <td colSpan={3 + classBooks.length} style={{ textAlign: 'center', padding: '24px', color: 'var(--ink3)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                    — tiada murid —
                  </td>
                </tr>
              ) : classStudents.map((s, i) => {
                const done = submissionMap.get(s.id) ?? new Set()
                const count = classBooks.filter(b => done.has(b.id)).length
                const total = classBooks.length
                const status = total === 0 ? 'n/a' : count === total ? 'complete' : count === 0 ? 'none' : 'partial'
                return (
                  <tr key={s.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink3)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </td>
                    <td>
                      <div className="s-name">
                        <div className="s-init">{getInitials(s.name)}</div>
                        {s.name}
                      </div>
                    </td>
                    {classBooks.map(b => (
                      <td key={b.id}>
                        <div
                          className={`tick ${done.has(b.id) ? 'tick-yes' : 'tick-no'}`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => toggleSubmission(s.id, b.id, done.has(b.id))}
                          title={done.has(b.id) ? 'Klik untuk batalkan' : 'Klik untuk tandai'}
                        >
                          {done.has(b.id) ? '✓' : '–'}
                        </div>
                      </td>
                    ))}
                    <td>
                      {status === 'complete' && <span className="badge badge-ok">{count}/{total}</span>}
                      {status === 'partial' && <span className="badge badge-partial">{count}/{total}</span>}
                      {status === 'none' && <span className="badge badge-none">{count}/{total}</span>}
                      {status === 'n/a' && <span style={{ fontSize: '11px', color: 'var(--ink3)' }}>—</span>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}

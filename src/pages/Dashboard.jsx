import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Layout from '../components/layout/Layout.jsx'
import ClassCard from '../components/features/dashboard/ClassCard.jsx'
import RecentActivity from '../components/features/dashboard/RecentActivity.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { useClasses } from '../hooks/useClasses.jsx'
import { useStudents } from '../hooks/useStudents.jsx'
import { useBooks } from '../hooks/useBooks.jsx'
import { useSubmissions } from '../hooks/useSubmissions.jsx'

export default function Dashboard() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { teacher } = useAuth()
  const { classes, loading: classLoading } = useClasses()
  const { students } = useStudents()
  const { books } = useBooks()
  const { submissions } = useSubmissions()

  const today = new Date().toLocaleDateString('ms-MY', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  // Kira stats global
  const totalStudents = students.length
  const completeStudents = students.filter(student =>
    books.filter(b => b.class_id === student.class_id || b.class_id === null).every(book =>
      submissions.some(s => s.student_id === student.id && s.book_id === book.id)
    )
  ).length
  const incompleteStudents = totalStudents - completeStudents

  const isLoading = classLoading

  return (
    <Layout
      title={t('dashboard.title')}
      breadcrumb={`${t('dashboard.allClasses')} · ${today}`}
      incompleteCount={incompleteStudents}
      actions={
        <>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/records')}>
            ↗ <span>{t('dashboard.reports')}</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/scan')}>
            ◎ <span>{t('dashboard.startScan')}</span>
          </button>
        </>
      }
    >
      {/* Alert jika ada murid belum lengkap */}
      {incompleteStudents > 0 && (
        <div className="alert alert-warn">
          ▲ &nbsp;<strong>{incompleteStudents} {t('dashboard.incomplete').toLowerCase()}</strong> — {t('dashboard.needAction')}
        </div>
      )}

      {/* Overview Stats — Bento */}
      <div className="bento-stats">
        <div className="bento-cell" style={{ '--bc': 'var(--accent)' }}>
          <div className="bento-top">
            <span className="bento-icon">👥</span>
            <span className="bento-tag">{classes.length} kelas</span>
          </div>
          <div className="bento-num">{totalStudents}</div>
          <div className="bento-label">{t('dashboard.totalStudents')}</div>
        </div>
        <div className="bento-cell" style={{ '--bc': 'var(--green)' }}>
          <div className="bento-top">
            <span className="bento-icon">✅</span>
            <span className="bento-tag" style={{ color: 'var(--green)', background: 'var(--green-bg)' }}>
              {totalStudents > 0 ? ((completeStudents / totalStudents) * 100).toFixed(0) : 0}%
            </span>
          </div>
          <div className="bento-num" style={{ color: 'var(--green)' }}>{completeStudents}</div>
          <div className="bento-label">{t('dashboard.completeAll')}</div>
        </div>
        <div className="bento-cell" style={{ '--bc': 'var(--red)' }}>
          <div className="bento-top">
            <span className="bento-icon">{incompleteStudents > 0 ? '⚠️' : '🎉'}</span>
            <span className="bento-tag" style={{ color: incompleteStudents > 0 ? 'var(--red)' : 'var(--green)', background: incompleteStudents > 0 ? 'var(--red-bg)' : 'var(--green-bg)' }}>
              {totalStudents > 0 ? ((incompleteStudents / totalStudents) * 100).toFixed(0) : 0}%
            </span>
          </div>
          <div className="bento-num" style={{ color: incompleteStudents > 0 ? 'var(--red)' : 'var(--ink3)' }}>{incompleteStudents}</div>
          <div className="bento-label">{t('dashboard.incomplete')}</div>
        </div>
      </div>

      {/* Class Cards */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--ink3)', fontSize: '13px' }}>
          {t('common.loading')}
        </div>
      ) : classes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', color: 'var(--ink)', marginBottom: '8px', letterSpacing: '2px' }}>
            {t('dashboard.welcome')}, {teacher?.name?.split(' ')[0] || 'Cikgu'}!
          </div>
          <div style={{ fontSize: '13px', color: 'var(--ink3)', marginBottom: '20px' }}>
            {t('classes.noClasses')}
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/classes')}>
            + {t('classes.add')}
          </button>
        </div>
      ) : (
        <>
          <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--ink3)', marginBottom: '12px' }}>
            {t('dashboard.yourClasses')}
          </div>
          <div className="class-grid">
            {classes.map(cls => (
              <ClassCard
                key={cls.id}
                cls={cls}
                students={students}
                books={books}
                submissions={submissions}
                onClick={(id) => navigate(`/class/${id}`)}
              />
            ))}
          </div>
        </>
      )}

      {/* Recent Activity */}
      {submissions.length > 0 && (
        <RecentActivity submissions={submissions} />
      )}
    </Layout>
  )
}

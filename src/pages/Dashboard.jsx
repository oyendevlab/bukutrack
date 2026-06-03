import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Users, CalendarCheck, Camera, ArrowSquareOut, QrCode } from '@phosphor-icons/react'
import Layout from '../components/layout/Layout.jsx'
import ClassCard from '../components/features/dashboard/ClassCard.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { useClasses } from '../hooks/useClasses.jsx'
import { useStudents } from '../hooks/useStudents.jsx'
import { useBooks } from '../hooks/useBooks.jsx'
import { useAppContext } from '../context/AppContext.jsx'

export default function Dashboard() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { teacher } = useAuth()
  const { classes, loading: classLoading } = useClasses()
  const { students } = useStudents()
  const { books } = useBooks()
  const { sessions, sessionRecords } = useAppContext()

  const today = new Date().toLocaleDateString('ms-MY', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  const totalStudents = students.length
  const todayStr = new Date().toISOString().slice(0, 10)
  const todaySessions = sessions.filter(s => s.checked_at === todayStr)

  return (
    <Layout
      title={t('dashboard.title')}
      breadcrumb={`${t('dashboard.allClasses')} · ${today}`}
      actions={
        <>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/records')}>
            <ArrowSquareOut size={15} weight="bold" />
            <span>{t('dashboard.reports')}</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/scan')}>
            <QrCode size={15} weight="bold" />
            <span>{t('dashboard.startScan')}</span>
          </button>
        </>
      }
    >
      {/* Bento stats */}
      <div className="bento-stats">
        <div className="bento-cell" style={{ '--bc': 'var(--accent)' }}>
          <div className="bento-top">
            <Users size={22} weight="duotone" color="var(--accent)" />
            <span className="bento-tag">{classes.length} kelas</span>
          </div>
          <div className="bento-num">{totalStudents}</div>
          <div className="bento-label">{t('dashboard.totalStudents')}</div>
        </div>
        <div className="bento-cell" style={{ '--bc': 'var(--green)' }}>
          <div className="bento-top">
            <CalendarCheck size={22} weight="duotone" color="var(--green)" />
            <span className="bento-tag" style={{ color: 'var(--green)', background: 'var(--green-bg)' }}>
              {todaySessions.length} hari ini
            </span>
          </div>
          <div className="bento-num" style={{ color: 'var(--green)' }}>{sessions.length}</div>
          <div className="bento-label">Jumlah Sesi</div>
        </div>
        <div className="bento-cell" style={{ '--bc': 'var(--accent)' }}>
          <div className="bento-top">
            <Camera size={22} weight="duotone" color="var(--accent)" />
          </div>
          <div className="bento-num">{todaySessions.length}</div>
          <div className="bento-label">Sesi Hari Ini</div>
        </div>
      </div>

      {/* Class Cards */}
      {classLoading ? (
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
                sessions={sessions}
                sessionRecords={sessionRecords}
                onClick={(id) => navigate(`/class/${id}`)}
              />
            ))}
          </div>
        </>
      )}
    </Layout>
  )
}

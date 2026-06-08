import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Users, CalendarCheck, Camera, ArrowSquareOut, QrCode,
  TrendUp, Warning, Trophy,
} from '@phosphor-icons/react'
import Layout from '../components/layout/Layout.jsx'
import ClassCard from '../components/features/dashboard/ClassCard.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { useClasses } from '../hooks/useClasses.jsx'
import { useStudents } from '../hooks/useStudents.jsx'
import { useBooks } from '../hooks/useBooks.jsx'
import { useAppContext } from '../context/AppContext.jsx'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Selamat Pagi'
  if (h < 18) return 'Selamat Petang'
  return 'Selamat Malam'
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { teacher } = useAuth()
  const { classes, loading: classLoading } = useClasses()
  const { students } = useStudents()
  const { books } = useBooks()
  const { sessions, sessionRecords } = useAppContext()

  const firstName = teacher?.name?.split(' ')[0] || 'Cikgu'
  const today = new Date().toLocaleDateString('ms-MY', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const todayStr = new Date().toISOString().slice(0, 10)
  const totalStudents = students.length

  // ── Sesi hari ini ──────────────────────────────────────────
  const todaySessions = sessions.filter(s => s.checked_at === todayStr)
  const todayPresent = todaySessions.reduce((acc, s) =>
    acc + sessionRecords.filter(r => r.session_id === s.id && r.status === 'present').length, 0)
  const todayAbsent = todaySessions.reduce((acc, s) =>
    acc + sessionRecords.filter(r => r.session_id === s.id && r.status === 'absent').length, 0)

  // ── Murid paling kerap tunggak (top 5) ─────────────────────
  const absentCount = {}
  sessionRecords.forEach(r => {
    if (r.status === 'absent') absentCount[r.student_id] = (absentCount[r.student_id] || 0) + 1
  })
  const topAbsent = students
    .map(s => ({ ...s, count: absentCount[s.id] || 0 }))
    .filter(s => s.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // ── Kelas paling aktif (top 3) ─────────────────────────────
  const activeClasses = classes
    .map(c => ({
      ...c,
      sessionCount: sessions.filter(s => s.class_id === c.id).length,
    }))
    .sort((a, b) => b.sessionCount - a.sessionCount)
    .slice(0, 3)

  // ── Trend mingguan (4 minggu lepas) ───────────────────────
  const weeks = Array.from({ length: 4 }, (_, i) => {
    const end = new Date()
    end.setDate(end.getDate() - i * 7)
    const start = new Date(end)
    start.setDate(start.getDate() - 6)
    const startStr = start.toISOString().slice(0, 10)
    const endStr   = end.toISOString().slice(0, 10)
    const count = sessions.filter(s => s.checked_at >= startStr && s.checked_at <= endStr).length
    return { label: `${start.getDate()}/${start.getMonth() + 1}`, count }
  }).reverse()
  const maxWeek = Math.max(...weeks.map(w => w.count), 1)

  return (
    <Layout
      title={t('dashboard.title')}
      breadcrumb={today}
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
      {/* ── Salam ─────────────────────────────────────────── */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-heading)' }}>
          {greeting()}, {firstName}! 👋
        </div>
        <div style={{ fontSize: '12px', color: 'var(--ink3)', marginTop: '2px' }}>{today}</div>
      </div>

      {/* ── Stats bento ───────────────────────────────────── */}
      <div className="bento-stats" style={{ marginBottom: '20px' }}>
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

      {/* ── Aktiviti hari ini ─────────────────────────────── */}
      {todaySessions.length > 0 && (
        <div className="card" style={{ marginBottom: '16px' }}>
          <div className="card-header">
            <div className="card-title">🗓 Aktiviti Hari Ini</div>
            <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--ink3)' }}>
              {todaySessions.length} sesi
            </span>
          </div>
          <div style={{ padding: '4px 0 8px' }}>
            <div style={{ display: 'flex', gap: '16px', padding: '8px 18px 12px', borderBottom: '1px solid var(--rule)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--green)' }}>{todayPresent} hadir</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e05', display: 'inline-block' }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#e05' }}>{todayAbsent} tidak hadir</span>
              </div>
            </div>
            {todaySessions.map(s => {
              const cls = classes.find(c => c.id === s.class_id)
              const book = s.books || books.find(b => b.id === s.book_id)
              const recs = sessionRecords.filter(r => r.session_id === s.id)
              const present = recs.filter(r => r.status === 'present').length
              const absent  = recs.filter(r => r.status === 'absent').length
              return (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '9px 18px', borderBottom: '1px solid var(--rule)' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink)' }}>{cls?.year_name || '—'}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ink3)', marginTop: '1px' }}>{book?.emoji} {book?.name || '—'}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--green)' }}>✓ {present}</span>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#e05' }}>✗ {absent}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Trend + Kelas aktif ───────────────────────────── */}
      {sessions.length > 0 && (
        <div className="dash-two-col" style={{ marginBottom: '16px' }}>

          {/* Trend mingguan */}
          <div className="card">
            <div className="card-header">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <TrendUp size={14} weight="bold" /> Trend Semakan
              </div>
              <span style={{ fontSize: '10px', color: 'var(--ink3)', fontFamily: 'var(--font-mono)' }}>4 minggu</span>
            </div>
            <div style={{ padding: '16px 18px 18px', display: 'flex', alignItems: 'flex-end', gap: '10px', height: '100px' }}>
              {weeks.map((w, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontWeight: 700, minHeight: '12px' }}>
                    {w.count > 0 ? w.count : ''}
                  </span>
                  <div style={{
                    width: '100%', borderRadius: '4px 4px 2px 2px',
                    background: i === weeks.length - 1 ? 'var(--accent)' : 'rgba(61,112,214,0.18)',
                    height: `${Math.max((w.count / maxWeek) * 56, w.count > 0 ? 6 : 2)}px`,
                    minHeight: '2px',
                  }} />
                  <span style={{ fontSize: '9px', color: 'var(--ink3)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
                    {w.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Kelas paling aktif */}
          <div className="card">
            <div className="card-header">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Trophy size={14} weight="bold" /> Kelas Aktif
              </div>
            </div>
            <div style={{ padding: '6px 0 8px' }}>
              {activeClasses.filter(c => c.sessionCount > 0).length === 0 ? (
                <div style={{ padding: '16px 18px', fontSize: '12px', color: 'var(--ink3)' }}>Belum ada sesi</div>
              ) : activeClasses.filter(c => c.sessionCount > 0).map((c, i) => (
                <div key={c.id}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 18px', cursor: 'pointer' }}
                  onClick={() => navigate(`/class/${c.id}`)}
                >
                  <span style={{
                    width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                    background: i === 0 ? '#f5c518' : i === 1 ? '#b0b0b0' : '#cd7f32',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '10px', fontWeight: 800, color: '#fff',
                  }}>{i + 1}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink)' }}>{c.year_name}</div>
                    <div style={{ fontSize: '10px', color: 'var(--ink3)' }}>{c.subject}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>{c.sessionCount}</div>
                    <div style={{ fontSize: '9px', color: 'var(--ink3)' }}>sesi</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Murid kerap tunggak ───────────────────────────── */}
      {topAbsent.length > 0 && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="card-header">
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Warning size={14} weight="bold" color="var(--amber)" />
              Murid Kerap Tidak Serah
            </div>
            <span style={{ fontSize: '10px', color: 'var(--ink3)', fontFamily: 'var(--font-mono)' }}>semua sesi</span>
          </div>
          <div style={{ padding: '4px 0 8px' }}>
            {topAbsent.map((s, i) => {
              const cls = classes.find(c => c.id === s.class_id)
              const pct = Math.round((s.count / topAbsent[0].count) * 100)
              return (
                <div key={s.id} style={{ padding: '8px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '20px', fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--ink3)', flexShrink: 0, textAlign: 'right' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink)' }}>{s.name}</span>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--amber)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                        {s.count}×
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: 'var(--rule)', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', borderRadius: '2px', background: 'var(--amber)' }} />
                      </div>
                      <span style={{ fontSize: '10px', color: 'var(--ink3)', flexShrink: 0 }}>{cls?.year_name}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Kad Kelas ─────────────────────────────────────── */}
      {classLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--ink3)', fontSize: '13px' }}>
          {t('common.loading')}
        </div>
      ) : classes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', color: 'var(--ink)', marginBottom: '8px', letterSpacing: '2px' }}>
            {t('dashboard.welcome')}, {firstName}!
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

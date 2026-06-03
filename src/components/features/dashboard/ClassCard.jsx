import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Users, BookOpen, Camera, CalendarCheck, CheckCircle, XCircle } from '@phosphor-icons/react'

const CLASS_COLORS = {
  blue: '#6b8fd4', green: '#1a7a40', red: '#cc2200',
  amber: '#9a6500', purple: '#7060c0', teal: '#2a8a80',
}

function formatDate(dateStr) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function ClassCard({ cls, students, books, sessions, sessionRecords, onClick }) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const accentColor = CLASS_COLORS[cls.color] || CLASS_COLORS.blue
  const classStudents = students.filter(s => s.class_id === cls.id)
  const classBooks = books.filter(b => b.class_id === cls.id || b.class_id === null)
  const classSessions = sessions.filter(s => s.class_id === cls.id)

  const lastSession = classSessions[0] ?? null
  const lastSessionRecords = lastSession
    ? sessionRecords.filter(r => r.session_id === lastSession.id)
    : []
  const lastPresent = lastSessionRecords.filter(r => r.status === 'present').length
  const lastAbsent = lastSessionRecords.filter(r => r.status === 'absent').length
  const lastBook = lastSession?.books

  return (
    <div className="class-card" style={{ '--cc': accentColor }} onClick={() => onClick(cls.id)}>

      {/* Header */}
      <div className="cc-head">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
          <div>
            <div className="cc-subject">{cls.subject}</div>
            <span style={{
              display: 'inline-block', marginTop: '6px',
              padding: '2px 10px', borderRadius: '20px',
              fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px',
              background: accentColor + '18', color: accentColor,
              border: `1px solid ${accentColor}30`,
            }}>
              {cls.year_name}
            </span>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: 700, lineHeight: 1, color: 'var(--ink3)' }}>
              {classSessions.length}
            </div>
            <div style={{ fontSize: '9px', color: 'var(--ink3)', marginTop: '2px', letterSpacing: '0.5px' }}>sesi</div>
          </div>
        </div>
      </div>

      {/* Stats ringkas */}
      <div className="cc-stats-icons">
        <div className="cc-stat-icon-row">
          <Users size={14} weight="duotone" color="var(--ink3)" />
          <span className="cc-stat-icon-num">{classStudents.length}</span>
          <span className="cc-stat-icon-label">{t('class.students')}</span>
        </div>
        <div className="cc-stat-icon-row">
          <BookOpen size={14} weight="duotone" color="var(--ink3)" />
          <span className="cc-stat-icon-num">{classBooks.length}</span>
          <span className="cc-stat-icon-label">{t('class.books')}</span>
        </div>
        <div className="cc-stat-icon-row">
          <CalendarCheck size={14} weight="duotone" color="var(--ink3)" />
          <span className="cc-stat-icon-num">{classSessions.length}</span>
          <span className="cc-stat-icon-label">sesi</span>
        </div>
      </div>

      {/* Sesi terkini atau empty state */}
      {lastSession ? (
        <div className="cc-last-session">
          <div className="cc-last-session-label">
            <CalendarCheck size={12} weight="fill" color="var(--accent)" />
            Sesi Terakhir · {formatDate(lastSession.checked_at)}
          </div>
          <div className="cc-last-session-book">
            {lastBook?.emoji} {lastBook?.name || '—'}
          </div>
          {lastSessionRecords.length > 0 && (
            <div className="cc-last-session-stats">
              <span className="cc-attendance green">
                <CheckCircle size={12} weight="fill" /> {lastPresent} hadir
              </span>
              <span className="cc-attendance red">
                <XCircle size={12} weight="fill" /> {lastAbsent} tidak hadir
              </span>
            </div>
          )}
          {lastSession.notes && (
            <div className="cc-last-session-note">📝 {lastSession.notes}</div>
          )}
        </div>
      ) : (
        <div className="cc-no-session">
          <Camera size={16} weight="duotone" color="var(--ink3)" />
          <span>Belum ada sesi semakan</span>
        </div>
      )}

      {/* Footer CTA */}
      <div className="cc-footer">
        <button
          className="btn btn-primary btn-sm"
          style={{ fontSize: '11px', padding: '5px 14px', gap: '5px' }}
          onClick={e => { e.stopPropagation(); navigate('/scan') }}
        >
          <Camera size={13} weight="bold" /> Sesi Baru
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span className="cc-footer-text">{t('dashboard.viewDetail')}</span>
          <span className="cc-arrow">→</span>
        </div>
      </div>
    </div>
  )
}

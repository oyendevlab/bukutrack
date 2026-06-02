import { useTranslation } from 'react-i18next'
import { Users, CheckCircle, WarningCircle, BookOpen } from '@phosphor-icons/react'

const CLASS_COLORS = {
  blue: '#6b8fd4', green: '#1a7a40', red: '#cc2200',
  amber: '#9a6500', purple: '#7060c0', teal: '#2a8a80',
}

export default function ClassCard({ cls, students, books, submissions, onClick }) {
  const { t } = useTranslation()

  const classStudents = students.filter(s => s.class_id === cls.id)
  const classBooks = books.filter(b => b.class_id === cls.id || b.class_id === null)
  const totalStudents = classStudents.length
  const totalBooks = classBooks.length

  const completeCount = classStudents.filter(student =>
    classBooks.every(book =>
      submissions.some(s => s.student_id === student.id && s.book_id === book.id)
    )
  ).length

  const incompleteCount = totalStudents - completeCount
  const accentColor = CLASS_COLORS[cls.color] || CLASS_COLORS.blue

  const pctOverall = totalStudents > 0 ? Math.round((completeCount / totalStudents) * 100) : 0

  const pctColor = pctOverall === 100 ? 'var(--green)' : pctOverall >= 70 ? 'var(--amber)' : 'var(--red)'

  return (
    <div className="class-card" style={{ '--cc': accentColor }} onClick={() => onClick(cls.id)}>

      {/* Header — color accent bar tebal + subjek + year pill */}
      <div className="cc-head">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
          <div>
            <div className="cc-subject">{cls.subject}</div>
            {/* Year pill badge */}
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
          {/* % overall */}
          {totalStudents > 0 && (
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: 700, lineHeight: 1, color: pctColor }}>
                {pctOverall}%
              </div>
              <div style={{ fontSize: '9px', color: 'var(--ink3)', marginTop: '2px', letterSpacing: '0.5px' }}>lengkap</div>
            </div>
          )}
        </div>
      </div>

      {/* Stats row dengan Phosphor icons */}
      <div className="cc-stats-icons">
        <div className="cc-stat-icon-row">
          <Users size={14} weight="duotone" color="var(--ink3)" />
          <span className="cc-stat-icon-num">{totalStudents}</span>
          <span className="cc-stat-icon-label">{t('class.students')}</span>
        </div>
        <div className="cc-stat-icon-row">
          <CheckCircle size={14} weight="duotone" color="var(--green)" />
          <span className="cc-stat-icon-num" style={{ color: 'var(--green)' }}>{completeCount}</span>
          <span className="cc-stat-icon-label">{t('class.complete')}</span>
        </div>
        <div className="cc-stat-icon-row">
          <WarningCircle size={14} weight="duotone" color={incompleteCount > 0 ? 'var(--red)' : 'var(--ink3)'} />
          <span className="cc-stat-icon-num" style={{ color: incompleteCount > 0 ? 'var(--red)' : 'var(--ink3)' }}>{incompleteCount}</span>
          <span className="cc-stat-icon-label">{t('class.incomplete')}</span>
        </div>
        <div className="cc-stat-icon-row">
          <BookOpen size={14} weight="duotone" color="var(--ink3)" />
          <span className="cc-stat-icon-num">{totalBooks}</span>
          <span className="cc-stat-icon-label">{t('class.books')}</span>
        </div>
      </div>

      {/* Progress per buku atau empty state */}
      {classBooks.length === 0 ? (
        <div style={{ padding: '8px 16px 12px', fontSize: '11px', color: 'var(--ink3)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <BookOpen size={13} weight="duotone" color="var(--ink3)" />
          Belum ada buku ditetapkan
        </div>
      ) : totalStudents === 0 ? (
        <div style={{ padding: '8px 16px 12px', fontSize: '11px', color: 'var(--ink3)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Users size={13} weight="duotone" color="var(--ink3)" />
          Belum ada murid dalam kelas ini
        </div>
      ) : (
        <div className="cc-progress">
          {classBooks.slice(0, 3).map(book => {
            const count = classStudents.filter(st =>
              submissions.some(s => s.student_id === st.id && s.book_id === book.id)
            ).length
            const pct = totalStudents > 0 ? (count / totalStudents) * 100 : 0
            const fillClass = pct === 100 ? 'ok' : pct >= 70 ? 'warn' : 'danger'
            return (
              <div key={book.id} className="cc-prog-row">
                <div className="cc-prog-label">
                  <span>{book.emoji} {book.name}</span>
                  <span className="cc-prog-count">{count}/{totalStudents}</span>
                </div>
                <div className="prog-bar">
                  <div className={`prog-fill ${fillClass}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Overall progress bar */}
      {totalStudents > 0 && (
        <div style={{ padding: '0 16px 12px' }}>
          <div style={{ height: '4px', background: 'var(--surface3)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pctOverall}%`, background: pctColor, borderRadius: '4px', transition: 'width 0.4s' }} />
          </div>
        </div>
      )}

      <div className="cc-footer">
        <div className="cc-footer-text">{t('dashboard.viewDetail')}</div>
        <div className="cc-arrow">→</div>
      </div>
    </div>
  )
}

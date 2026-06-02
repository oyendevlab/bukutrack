import { useTranslation } from 'react-i18next'

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

  return (
    <div className="class-card" style={{ '--cc': accentColor }} onClick={() => onClick(cls.id)}>
      <div className="cc-head">
        <div className="cc-subject">{cls.subject}</div>
        <div className="cc-year">{cls.year_name} · {totalStudents} {t('class.students')}</div>
      </div>

      <div className="cc-stats">
        <div className="cc-stat">
          <div className="cc-stat-num" style={{ color: 'var(--green)' }}>{completeCount}</div>
          <div className="cc-stat-label">{t('class.complete')}</div>
        </div>
        <div className="cc-stat">
          <div className="cc-stat-num" style={{ color: incompleteCount > 0 ? 'var(--red)' : 'var(--ink3)' }}>{incompleteCount}</div>
          <div className="cc-stat-label">{t('class.incomplete')}</div>
        </div>
        <div className="cc-stat">
          <div className="cc-stat-num">{totalBooks}</div>
          <div className="cc-stat-label">{t('class.books')}</div>
        </div>
      </div>

      {totalStudents > 0 && classBooks.length > 0 && (
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

      <div className="cc-footer">
        <div className="cc-footer-text">{t('dashboard.viewDetail')}</div>
        <div className="cc-arrow">→</div>
      </div>
    </div>
  )
}

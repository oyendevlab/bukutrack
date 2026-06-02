import { useState } from 'react'
import { useTranslation } from 'react-i18next'

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

function formatDate(ts) {
  if (!ts) return null
  return new Date(ts).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function BookChecklistModal({ student, books, submissions, onSave, onClose, saving }) {
  const { t } = useTranslation()

  const submittedBookIds = new Set(
    submissions.filter(s => s.student_id === student.id).map(s => s.book_id)
  )
  const [checked, setChecked] = useState(() => new Set(submittedBookIds))

  function toggle(bookId) {
    setChecked(prev => {
      const next = new Set(prev)
      next.has(bookId) ? next.delete(bookId) : next.add(bookId)
      return next
    })
  }

  function handleSave() {
    const toAdd = books.filter(b => checked.has(b.id) && !submittedBookIds.has(b.id))
    const toRemove = books.filter(b => !checked.has(b.id) && submittedBookIds.has(b.id))
    onSave(student, toAdd, toRemove)
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <div className="modal-init">{getInitials(student.name)}</div>
          <div>
            <div className="modal-sname">{student.name}</div>
            <div className="modal-smeta">{student.student_no || '—'}</div>
          </div>
        </div>

        {/* Progress dots */}
        <div className="mprog">
          {books.map(book => (
            <div key={book.id} className={`mprog-dot${checked.has(book.id) ? ' done' : ''}`} title={book.name} />
          ))}
        </div>

        <div className="modal-body">
          <div className="modal-sec">{t('scan.books')} — {checked.size}/{books.length}</div>

          {books.length === 0 ? (
            <div style={{ fontSize: '12px', color: 'var(--ink3)', padding: '8px 0' }}>{t('books.noBooks')}</div>
          ) : books.map(book => {
            const isChecked = checked.has(book.id)
            const sub = submissions.find(s => s.student_id === student.id && s.book_id === book.id)
            return (
              <div key={book.id} className={`bci${isChecked ? ' checked' : ''}`} onClick={() => toggle(book.id)}>
                <div className="bci-box">{isChecked && '✓'}</div>
                <div className="bci-name">{book.emoji} {book.name}</div>
                <div className={`bci-date${!sub ? ' none' : ''}`}>
                  {sub ? formatDate(sub.submitted_at) : t('scan.notYet')}
                </div>
              </div>
            )
          })}
        </div>

        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose} disabled={saving}>{t('scan.cancel')}</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? '...' : `✓ ${t('scan.save')}`}
          </button>
        </div>
      </div>
    </div>
  )
}

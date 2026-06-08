import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { MagnifyingGlass, Chalkboard, Users, Books, X } from '@phosphor-icons/react'
import { useAppContext } from '../../context/AppContext.jsx'

function highlight(text, query) {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: 'var(--accent-bg)', color: 'var(--accent)', borderRadius: '2px', padding: '0 1px' }}>
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  )
}

export default function GlobalSearch({ open, onClose }) {
  const navigate = useNavigate()
  const { classes, students, books } = useAppContext()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelected(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const q = query.trim().toLowerCase()

  const results = q.length < 1 ? [] : [
    ...classes
      .filter(c => c.subject.toLowerCase().includes(q) || c.year_name.toLowerCase().includes(q))
      .slice(0, 4)
      .map(c => ({
        id: `cls-${c.id}`, type: 'kelas',
        icon: <Chalkboard size={14} weight="duotone" />,
        label: c.year_name,
        sub: c.subject,
        action: () => { navigate(`/class/${c.id}`); onClose() },
      })),
    ...students
      .filter(s => s.name.toLowerCase().includes(q))
      .slice(0, 5)
      .map(s => {
        const cls = classes.find(c => c.id === s.class_id)
        return {
          id: `stu-${s.id}`, type: 'murid',
          icon: <Users size={14} weight="duotone" />,
          label: s.name,
          sub: cls ? `${cls.subject} · ${cls.year_name}` : '—',
          action: () => { navigate(`/students`); onClose() },
        }
      }),
    ...books
      .filter(b => b.name.toLowerCase().includes(q))
      .slice(0, 3)
      .map(b => ({
        id: `book-${b.id}`, type: 'buku',
        icon: <Books size={14} weight="duotone" />,
        label: `${b.emoji ?? '📖'} ${b.name}`,
        sub: 'Buku semakan',
        action: () => { navigate(`/books`); onClose() },
      })),
  ]

  const handleKey = useCallback(e => {
    if (!open) return
    if (e.key === 'Escape') { onClose(); return }
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)) }
    if (e.key === 'Enter' && results[selected]) { results[selected].action() }
  }, [open, results, selected, onClose])

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  useEffect(() => { setSelected(0) }, [q])

  if (!open) return null

  return (
    <div
      className="gs-overlay"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="gs-modal">
        <div className="gs-input-row">
          <MagnifyingGlass size={17} weight="bold" style={{ color: 'var(--ink3)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            className="gs-input"
            placeholder="Cari murid, kelas, buku..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && (
            <button className="gs-clear" onClick={() => setQuery('')}>
              <X size={13} weight="bold" />
            </button>
          )}
          <kbd className="gs-esc" onClick={onClose}>Esc</kbd>
        </div>

        {q.length > 0 && (
          <div className="gs-results">
            {results.length === 0 ? (
              <div className="gs-empty">Tiada hasil untuk "<strong>{query}</strong>"</div>
            ) : results.map((r, i) => (
              <div
                key={r.id}
                className={`gs-item${i === selected ? ' gs-item--active' : ''}`}
                onMouseEnter={() => setSelected(i)}
                onClick={r.action}
              >
                <span className="gs-item-icon">{r.icon}</span>
                <div className="gs-item-text">
                  <span className="gs-item-label">{highlight(r.label, query)}</span>
                  <span className="gs-item-sub">{r.sub}</span>
                </div>
                <span className="gs-item-tag">{r.type}</span>
              </div>
            ))}
          </div>
        )}

        {q.length === 0 && (
          <div className="gs-hint">
            <span>Taip untuk mula mencari</span>
            <span style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <kbd className="gs-kbd">↑↓</kbd> pilih &nbsp;
              <kbd className="gs-kbd">↵</kbd> buka
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

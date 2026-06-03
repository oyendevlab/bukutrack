import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Layout from '../components/layout/Layout.jsx'
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx'
import { useAppContext } from '../context/AppContext.jsx'
import { useClasses } from '../hooks/useClasses.jsx'
import { useStudents } from '../hooks/useStudents.jsx'
import { useBooks } from '../hooks/useBooks.jsx'
import { CheckCircle, XCircle, NotePencil, Trash, CaretDown, CaretUp } from '@phosphor-icons/react'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Records() {
  const { t } = useTranslation()
  const { sessions, sessionRecords, updateSessionNote, deleteSession } = useAppContext()
  const { classes } = useClasses()
  const { students } = useStudents()
  const { books } = useBooks()

  const [filterClassId, setFilterClassId] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [editingNote, setEditingNote] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const filtered = sessions.filter(s => !filterClassId || s.class_id === filterClassId)

  function getRecords(sessionId) {
    return sessionRecords.filter(r => r.session_id === sessionId)
  }

  function getStudent(id) {
    return students.find(s => s.id === id)
  }

  async function handleSaveNote() {
    if (!editingNote) return
    await updateSessionNote(editingNote.sessionId, editingNote.studentId, editingNote.note)
    setEditingNote(null)
  }

  return (
    <Layout title={t('records.title')} breadcrumb={t('records.title')}>

      <div className="filter-bar" style={{ marginBottom: '16px' }}>
        <select className="filter-select" value={filterClassId || ''}
          onChange={e => setFilterClassId(e.target.value || null)}>
          <option value="">Semua Kelas</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.year_name}</option>)}
        </select>
        <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--ink3)', fontFamily: 'var(--font-mono)' }}>
          {filtered.length} sesi
        </span>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--ink3)' }}>
          <div style={{ fontSize: '32px', opacity: 0.2, marginBottom: '12px' }}>📋</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', letterSpacing: '1px' }}>
            Tiada sesi semakan
          </div>
          <div style={{ fontSize: '12px', marginTop: '6px' }}>Mula imbas QR untuk cipta sesi pertama</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map(session => {
            const isExpanded = expandedId === session.id
            const records = getRecords(session.id)
            const presentCount = records.filter(r => r.status === 'present').length
            const absentCount = records.filter(r => r.status === 'absent').length
            const cls = classes.find(c => c.id === session.class_id)
            const book = session.books || books.find(b => b.id === session.book_id)

            return (
              <div key={session.id} className="session-card">
                <div className="session-card-header"
                  onClick={() => setExpandedId(isExpanded ? null : session.id)}>
                  <div className="session-card-left">
                    <div className="session-card-date">{formatDate(session.checked_at)}</div>
                    <div className="session-card-meta">
                      <span className="tag tag-ink">{cls?.year_name || session.classes?.year_name}</span>
                      <span style={{ fontSize: '12px', color: 'var(--ink2)' }}>
                        {book?.emoji} {book?.name}
                      </span>
                    </div>
                    {session.notes && (
                      <div style={{ fontSize: '11px', color: 'var(--ink3)', marginTop: '3px' }}>
                        📝 {session.notes}
                      </div>
                    )}
                  </div>
                  <div className="session-card-right">
                    <div className="session-stat green">
                      <CheckCircle size={13} weight="fill" />{presentCount}
                    </div>
                    <div className="session-stat red">
                      <XCircle size={13} weight="fill" />{absentCount}
                    </div>
                    {isExpanded ? <CaretUp size={14} /> : <CaretDown size={14} />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="session-card-body">
                    {records.length === 0 ? (
                      <div style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: 'var(--ink3)' }}>
                        Tiada rekod murid
                      </div>
                    ) : (
                      <>
                        {records.filter(r => r.status === 'present').map(r => {
                          const stu = getStudent(r.student_id)
                          return (
                            <div key={r.id} className="session-record-row present">
                              <CheckCircle size={15} weight="fill" color="var(--green)" />
                              <span className="session-record-name">{stu?.name || '—'}</span>
                              {r.scanned_at && (
                                <span className="session-record-time">
                                  {new Date(r.scanned_at).toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              )}
                            </div>
                          )
                        })}
                        {records.filter(r => r.status === 'absent').map(r => {
                          const stu = getStudent(r.student_id)
                          const isEditing = editingNote?.sessionId === session.id && editingNote?.studentId === r.student_id
                          return (
                            <div key={r.id} className="session-record-row absent">
                              <XCircle size={15} weight="fill" color="var(--red)" />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div className="session-record-name">{stu?.name || '—'}</div>
                                {isEditing ? (
                                  <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                                    <input className="input"
                                      style={{ flex: 1, fontSize: '12px', padding: '6px 10px', height: '32px' }}
                                      placeholder="Sebab tidak hadir..."
                                      value={editingNote.note}
                                      onChange={e => setEditingNote(n => ({ ...n, note: e.target.value }))}
                                      autoFocus
                                    />
                                    <button className="btn btn-primary btn-sm" onClick={handleSaveNote}>✓</button>
                                    <button className="btn btn-ghost btn-sm" onClick={() => setEditingNote(null)}>✕</button>
                                  </div>
                                ) : r.note ? (
                                  <div style={{ fontSize: '11px', color: 'var(--ink3)', marginTop: '2px' }}>
                                    📝 {r.note}
                                  </div>
                                ) : null}
                              </div>
                              {!isEditing && (
                                <button className="btn btn-ghost btn-sm"
                                  style={{ padding: '4px 8px', flexShrink: 0 }}
                                  onClick={() => setEditingNote({ sessionId: session.id, studentId: r.student_id, note: r.note || '' })}>
                                  <NotePencil size={13} weight="bold" />
                                </button>
                              )}
                            </div>
                          )
                        })}
                      </>
                    )}
                    <div style={{ padding: '10px 14px', borderTop: '1px solid var(--rule)', display: 'flex', justifyContent: 'flex-end' }}>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)', gap: '4px' }}
                        onClick={() => setConfirmDelete(session)}>
                        <Trash size={13} weight="bold" /> Padam Sesi
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {confirmDelete && (
        <ConfirmDialog
          message={`Padam sesi "${formatDate(confirmDelete.checked_at)}"? Semua rekod murid dalam sesi ini akan dipadam.`}
          onConfirm={async () => { await deleteSession(confirmDelete.id); setConfirmDelete(null) }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </Layout>
  )
}

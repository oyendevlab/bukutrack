import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Layout from '../components/layout/Layout.jsx'
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx'
import { useClasses } from '../hooks/useClasses.jsx'
import { useStudents } from '../hooks/useStudents.jsx'
import { useBooks } from '../hooks/useBooks.jsx'
import { useAppContext } from '../context/AppContext.jsx'
import { ArrowLeft, Camera, CheckCircle, XCircle, NotePencil, CaretDown, CaretUp, Trash } from '@phosphor-icons/react'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function ClassDetail() {
  const { classId } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const { classes } = useClasses()
  const { students } = useStudents()
  const { books } = useBooks()
  const { sessions, sessionRecords, updateSessionNote, deleteSession } = useAppContext()

  const [expandedId, setExpandedId] = useState(null)
  const [editingNote, setEditingNote] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const cls = classes.find(c => c.id === classId)
  const classStudents = useMemo(() => students.filter(s => s.class_id === classId), [students, classId])
  const classBooks = useMemo(() => books.filter(b => b.class_id === classId || b.class_id === null), [books, classId])
  const classSessions = useMemo(() => sessions.filter(s => s.class_id === classId), [sessions, classId])

  const todayStr = new Date().toISOString().slice(0, 10)
  const todaySessions = classSessions.filter(s => s.checked_at === todayStr)

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
          <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{cls.year_name}</span>
        </span>
      }
      actions={
        <>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')}>
            <ArrowLeft size={14} weight="bold" /> {t('class.allClasses')}
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/scan')}>
            <Camera size={14} weight="bold" /> Sesi Baru
          </button>
        </>
      }
    >
      {/* Stats Strip */}
      <div className="stats-strip">
        <div className="stat-cell" style={{ '--sc': 'var(--ink)' }}>
          <div className="stat-label">{t('class.students')}</div>
          <div className="stat-num">{classStudents.length}</div>
          <div className="stat-note">dalam kelas</div>
        </div>
        <div className="stat-cell" style={{ '--sc': 'var(--accent)' }}>
          <div className="stat-label">Buku</div>
          <div className="stat-num">{classBooks.length}</div>
          <div className="stat-note">ditetapkan</div>
        </div>
        <div className="stat-cell" style={{ '--sc': 'var(--green)' }}>
          <div className="stat-label">Sesi</div>
          <div className="stat-num green">{classSessions.length}</div>
          <div className="stat-note">jumlah</div>
        </div>
        <div className="stat-cell" style={{ '--sc': 'var(--amber)' }}>
          <div className="stat-label">Hari Ini</div>
          <div className="stat-num">{todaySessions.length}</div>
          <div className="stat-note">sesi hari ini</div>
        </div>
      </div>

      {/* Rekod Sesi */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Rekod Sesi</div>
          <span style={{ fontSize: '10px', color: 'var(--ink3)', fontFamily: 'var(--font-mono)' }}>
            {classSessions.length} sesi
          </span>
        </div>

        {classSessions.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--ink3)', fontSize: '13px' }}>
            <div style={{ marginBottom: '12px', fontSize: '28px', opacity: 0.2 }}>📋</div>
            Belum ada sesi semakan untuk kelas ini.
            <div style={{ marginTop: '12px' }}>
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/scan')}>
                <Camera size={13} weight="bold" /> Mula Sesi Pertama
              </button>
            </div>
          </div>
        ) : classSessions.map(session => {
          const isExpanded = expandedId === session.id
          const records = getRecords(session.id)
          const presentCount = records.filter(r => r.status === 'present').length
          const absentCount = records.filter(r => r.status === 'absent').length
          const book = session.books || classBooks.find(b => b.id === session.book_id)

          return (
            <div key={session.id} style={{ borderBottom: '1px solid var(--rule)' }}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 18px', cursor: 'pointer', transition: 'background 0.12s' }}
                onClick={() => setExpandedId(isExpanded ? null : session.id)}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)', marginBottom: '3px' }}>
                    {formatDate(session.checked_at)}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ink2)' }}>
                    {book?.emoji} {book?.name || '—'}
                  </div>
                  {session.notes && (
                    <div style={{ fontSize: '11px', color: 'var(--ink3)', marginTop: '2px' }}>📝 {session.notes}</div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px', fontWeight: 700, color: 'var(--green)' }}>
                    <CheckCircle size={13} weight="fill" />{presentCount}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px', fontWeight: 700, color: 'var(--red)' }}>
                    <XCircle size={13} weight="fill" />{absentCount}
                  </span>
                  {isExpanded ? <CaretUp size={13} color="var(--ink3)" /> : <CaretDown size={13} color="var(--ink3)" />}
                </div>
              </div>

              {isExpanded && (
                <div style={{ background: 'var(--surface2)', borderTop: '1px solid var(--rule)' }}>
                  {records.length === 0 ? (
                    <div style={{ padding: '16px 18px', fontSize: '12px', color: 'var(--ink3)' }}>Tiada rekod murid.</div>
                  ) : (
                    <>
                      {records.filter(r => r.status === 'present').map(r => {
                        const stu = getStudent(r.student_id)
                        return (
                          <div key={r.id} className="session-record-row present">
                            <CheckCircle size={14} weight="fill" color="var(--green)" />
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
                            <XCircle size={14} weight="fill" color="var(--red)" />
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
                                <div style={{ fontSize: '11px', color: 'var(--ink3)', marginTop: '2px' }}>📝 {r.note}</div>
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
                  <div style={{ padding: '8px 18px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)', gap: '4px' }}
                      onClick={() => setConfirmDelete(session)}>
                      <Trash size={12} weight="bold" /> Padam Sesi
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {confirmDelete && (
        <ConfirmDialog
          message={`Padam sesi "${formatDate(confirmDelete.checked_at)}"? Semua rekod murid akan dipadam.`}
          onConfirm={async () => { await deleteSession(confirmDelete.id); setConfirmDelete(null) }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </Layout>
  )
}

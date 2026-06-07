import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Layout from '../components/layout/Layout.jsx'
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx'
import { EditBtn, DeleteBtn } from '../components/ui/IconBtn.jsx'
import { useClasses } from '../hooks/useClasses.jsx'
import { useStudents } from '../hooks/useStudents.jsx'

const CLASS_COLORS = [
  { value: 'blue',   hex: '#6b8fd4', label: 'Biru'   },
  { value: 'green',  hex: '#1a7a40', label: 'Hijau'  },
  { value: 'red',    hex: '#cc2200', label: 'Merah'  },
  { value: 'amber',  hex: '#9a6500', label: 'Amber'  },
  { value: 'purple', hex: '#7060c0', label: 'Ungu'   },
  { value: 'teal',   hex: '#2a8a80', label: 'Teal'   },
]

const EMPTY_FORM = { subject: '', yearName: '', color: 'blue' }

export default function Classes() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { classes, loading, addClass, updateClass, deleteClass } = useClasses()
  const { students } = useStudents()

  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [error, setError] = useState('')

  function openAdd() {
    setEditTarget(null); setForm(EMPTY_FORM); setError(''); setShowModal(true)
  }
  function openEdit(cls) {
    setEditTarget(cls); setForm({ subject: cls.subject, yearName: cls.year_name, color: cls.color }); setError(''); setShowModal(true)
  }

  async function handleSave() {
    if (!form.subject.trim() || !form.yearName.trim()) { setError('Subjek dan Tahun/Kelas wajib diisi.'); return }
    setSaving(true)
    if (editTarget) {
      await updateClass(editTarget.id, { subject: form.subject.trim(), year_name: form.yearName.trim(), color: form.color })
    } else {
      await addClass(form.subject.trim(), form.yearName.trim(), form.color)
    }
    setSaving(false); setShowModal(false)
  }

  return (
    <Layout
      title={t('classes.title')}
      breadcrumb={t('nav.management')}
      actions={<button className="btn btn-primary btn-sm" onClick={openAdd}>+ {t('classes.add')}</button>}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--ink3)' }}>{t('common.loading')}</div>
      ) : classes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', color: 'var(--ink)', marginBottom: '8px', letterSpacing: '2px' }}>
            {t('classes.noClasses')}
          </div>
          <button className="btn btn-primary" style={{ marginTop: '12px' }} onClick={openAdd}>+ {t('classes.add')}</button>
        </div>
      ) : (
        <>
          {/* Desktop: table view */}
          <div className="card class-table-desktop">
            <div className="card-header">
              <div className="card-title">{t('classes.title')}</div>
              <span style={{ fontSize: '10px', color: 'var(--ink3)', fontFamily: 'var(--font-mono)' }}>{classes.length} kelas</span>
            </div>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>{t('classes.subject')}</th>
                    <th>{t('classes.yearClass')}</th>
                    <th>Murid</th>
                    <th>Warna</th>
                    <th>{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map((cls, i) => {
                    const count = students.filter(s => s.class_id === cls.id).length
                    const hex = CLASS_COLORS.find(c => c.value === cls.color)?.hex || '#6b8fd4'
                    return (
                      <tr key={cls.id}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink3)' }}>{String(i + 1).padStart(2, '0')}</td>
                        <td style={{ fontWeight: 700, cursor: 'pointer', color: 'var(--accent)' }} onClick={() => navigate(`/class/${cls.id}`)}>{cls.subject}</td>
                        <td><span className="tag tag-ink">{cls.year_name}</span></td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{count}</td>
                        <td><div style={{ width: 16, height: 16, borderRadius: '50%', background: hex, border: '2px solid var(--rule)' }} /></td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <EditBtn onClick={() => openEdit(cls)} />
                            <DeleteBtn onClick={() => setConfirmDelete(cls)} />
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile: card list */}
          <div className="class-card-list">
            {classes.map((cls) => {
              const count = students.filter(s => s.class_id === cls.id).length
              const hex = CLASS_COLORS.find(c => c.value === cls.color)?.hex || '#6b8fd4'
              return (
                <div key={cls.id} className="class-card-row" style={{ '--cls-color': hex, cursor: 'pointer' }} onClick={() => navigate(`/class/${cls.id}`)}>
                  <div className="class-card-color-bar" />
                  <div className="class-card-info">
                    <div className="class-card-subject">{cls.subject}</div>
                    <div className="class-card-meta">
                      <span className="tag tag-ink">{cls.year_name}</span>
                      <span className="class-card-count">{count} murid</span>
                    </div>
                  </div>
                  <div className="class-card-actions" onClick={e => e.stopPropagation()}>
                    <EditBtn onClick={() => openEdit(cls)} />
                    <DeleteBtn onClick={() => setConfirmDelete(cls)} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* FAB tambah kelas — mobile only */}
          <button className="fab" onClick={openAdd} aria-label={t('classes.add')}>+</button>
        </>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-head">
              <div className="modal-init">◫</div>
              <div>
                <div className="modal-sname">{editTarget ? t('classes.edit') : t('classes.add')}</div>
                <div className="modal-smeta">Tetapan Kelas</div>
              </div>
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-warn" style={{ marginBottom: '12px' }}>▲ &nbsp;{error}</div>}
              <label className="input-label">{t('classes.subject')}</label>
              <input className="input" placeholder="cth: English, Matematik" value={form.subject}
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} />
              <label className="input-label">{t('classes.yearClass')}</label>
              <input className="input" placeholder="cth: Tahun 5A, 6 Bestari" value={form.yearName}
                onChange={e => setForm(f => ({ ...f, yearName: e.target.value }))} />
              <label className="input-label">Warna Kelas</label>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '13px', flexWrap: 'wrap' }}>
                {CLASS_COLORS.map(c => (
                  <div key={c.value} onClick={() => setForm(f => ({ ...f, color: c.value }))} title={c.label}
                    style={{ width: 28, height: 28, borderRadius: '50%', background: c.hex, cursor: 'pointer',
                      border: form.color === c.value ? '3px solid var(--ink)' : '2px solid var(--rule)',
                      transform: form.color === c.value ? 'scale(1.15)' : 'none', transition: 'all 0.15s' }} />
                ))}
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)} disabled={saving}>{t('common.cancel')}</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? '...' : `✓ ${t('common.save')}`}</button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <ConfirmDialog
          message={`Padam kelas "${confirmDelete.subject} — ${confirmDelete.year_name}"? Semua murid dan rekod dalam kelas ini juga akan dipadam.`}
          onConfirm={async () => { await deleteClass(confirmDelete.id); setConfirmDelete(null) }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </Layout>
  )
}

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Layout from '../components/layout/Layout.jsx'
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx'
import { EditBtn, DeleteBtn } from '../components/ui/IconBtn.jsx'
import { useBooks } from '../hooks/useBooks.jsx'
import { useClasses } from '../hooks/useClasses.jsx'

const EMOJI_OPTIONS = ['📚','📖','📗','📘','📙','📕','📓','📔','📒','✏️','🖊️','📝']
const EMPTY_FORM = { name: '', emoji: '📚', classId: '' }

export default function Books() {
  const { t } = useTranslation()
  const { books, loading, addBook, updateBook, deleteBook } = useBooks()
  const { classes } = useClasses()

  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [filterClassId, setFilterClassId] = useState(null)
  const [error, setError] = useState('')

  const filtered = books.filter(b =>
    !filterClassId || b.class_id === filterClassId || b.class_id === null
  )

  function openAdd() {
    setEditTarget(null); setForm({ ...EMPTY_FORM, classId: filterClassId || '' }); setError(''); setShowModal(true)
  }
  function openEdit(b) {
    setEditTarget(b); setForm({ name: b.name, emoji: b.emoji || '📚', classId: b.class_id || '' }); setError(''); setShowModal(true)
  }

  async function handleSave() {
    if (!form.name.trim()) { setError('Nama buku wajib diisi.'); return }
    setSaving(true)
    const classId = form.classId || null
    if (editTarget) {
      await updateBook(editTarget.id, { name: form.name.trim(), emoji: form.emoji, class_id: classId })
    } else {
      await addBook(form.name.trim(), form.emoji, classId)
    }
    setSaving(false); setShowModal(false)
  }

  function getClassName(classId) {
    if (!classId) return 'Semua Kelas'
    return classes.find(c => c.id === classId)?.year_name || '—'
  }

  return (
    <Layout
      title={t('books.title')}
      breadcrumb={t('nav.management')}
      actions={<button className="btn btn-primary btn-sm" onClick={openAdd}>+ {t('books.add')}</button>}
    >
      <div className="filter-bar">
        <div className={`filter-chip${!filterClassId ? ' active' : ''}`} onClick={() => setFilterClassId(null)}>
          {t('books.allClasses')}
        </div>
        {classes.map(cls => (
          <div key={cls.id} className={`filter-chip${filterClassId === cls.id ? ' active' : ''}`}
            onClick={() => setFilterClassId(cls.id)}>{cls.year_name}
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--ink3)' }}>{t('common.loading')}</div>
      ) : (
        <div className="card">
          <div className="card-header">
            <div className="card-title">{t('books.title')}</div>
            <span style={{ fontSize: '10px', color: 'var(--ink3)', fontFamily: 'var(--font-mono)' }}>{filtered.length} buku</span>
          </div>
          {filtered.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--ink3)', fontSize: '13px' }}>{t('books.noBooks')}</div>
          ) : filtered.map((b, i) => (
            <div key={b.id} className="list-row">
              <div className="list-num">{String(i + 1).padStart(2, '0')}</div>
              <div style={{ fontSize: '22px', lineHeight: 1 }}>{b.emoji}</div>
              <div className="list-name">{b.name}</div>
              <span className="tag tag-ink" style={{ fontSize: '9px' }}>{getClassName(b.class_id)}</span>
              <EditBtn onClick={() => openEdit(b)} />
              <DeleteBtn onClick={() => setConfirmDelete(b)} />
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-head">
              <div className="modal-init">{form.emoji}</div>
              <div>
                <div className="modal-sname">{editTarget ? 'Edit Buku' : t('books.add')}</div>
                <div className="modal-smeta">Maklumat Buku</div>
              </div>
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-warn" style={{ marginBottom: '12px' }}>▲ &nbsp;{error}</div>}
              <label className="input-label">{t('books.emoji')}</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '13px' }}>
                {EMOJI_OPTIONS.map(em => (
                  <div key={em} onClick={() => setForm(f => ({ ...f, emoji: em }))}
                    style={{ fontSize: '22px', cursor: 'pointer', padding: '6px', borderRadius: 'var(--radius-btn)',
                      border: form.emoji === em ? '2px solid var(--accent)' : '2px solid transparent',
                      background: form.emoji === em ? 'var(--accent-bg)' : 'transparent', transition: 'all 0.12s' }}>
                    {em}
                  </div>
                ))}
              </div>
              <label className="input-label">{t('books.name')}</label>
              <input className="input" placeholder="cth: Buku Teks, Activity Book" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              <label className="input-label">{t('books.class')} <span style={{ color: 'var(--ink3)', fontWeight: 400 }}>(kosongkan untuk semua kelas)</span></label>
              <select className="input" value={form.classId} onChange={e => setForm(f => ({ ...f, classId: e.target.value }))}>
                <option value="">Semua Kelas</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.subject} · {c.year_name}</option>)}
              </select>
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
          message={`Padam buku "${confirmDelete.emoji} ${confirmDelete.name}"? Semua rekod penyerahan buku ini juga akan dipadam.`}
          onConfirm={async () => { await deleteBook(confirmDelete.id); setConfirmDelete(null) }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </Layout>
  )
}

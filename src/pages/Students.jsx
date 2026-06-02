import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Layout from '../components/layout/Layout.jsx'
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx'
import { EditBtn, DeleteBtn, UploadBtn } from '../components/ui/IconBtn.jsx'
import { useStudents } from '../hooks/useStudents.jsx'
import { useClasses } from '../hooks/useClasses.jsx'

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

const EMPTY_FORM = { name: '', classId: '', studentNo: '' }

export default function Students() {
  const { t } = useTranslation()
  const { students, loading, addStudent, updateStudent, deleteStudent } = useStudents()
  const { classes } = useClasses()

  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [filterClassId, setFilterClassId] = useState(null)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const csvRef = useRef(null)

  const filtered = students
    .filter(s => !filterClassId || s.class_id === filterClassId)
    .filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()))

  function openAdd() {
    setEditTarget(null)
    setForm({ ...EMPTY_FORM, classId: filterClassId || classes[0]?.id || '' })
    setError('')
    setShowModal(true)
  }

  function openEdit(s) {
    setEditTarget(s)
    setForm({ name: s.name, classId: s.class_id, studentNo: s.student_no || '' })
    setError('')
    setShowModal(true)
  }

  async function handleSave() {
    if (!form.name.trim()) { setError('Nama murid wajib diisi.'); return }
    if (!form.classId) { setError('Sila pilih kelas.'); return }
    setSaving(true)
    if (editTarget) {
      await updateStudent(editTarget.id, { name: form.name.trim(), class_id: form.classId, student_no: form.studentNo.trim() })
    } else {
      await addStudent(form.name.trim(), form.classId, form.studentNo.trim())
    }
    setSaving(false)
    setShowModal(false)
  }

  async function handleCsvImport(e) {
    const file = e.target.files[0]
    if (!file) return
    const targetClassId = filterClassId || classes[0]?.id
    if (!targetClassId) { alert('Pilih kelas dahulu sebelum import CSV.'); e.target.value = ''; return }
    const text = await file.text()
    const lines = text.split('\n').filter(l => l.trim())
    const start = lines[0]?.toLowerCase().includes('nama') ? 1 : 0
    let count = 0
    for (const line of lines.slice(start)) {
      const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''))
      const name = cols[0]; const studentNo = cols[1] || ''
      if (name) { await addStudent(name, targetClassId, studentNo); count++ }
    }
    e.target.value = ''
    alert(`${count} murid berjaya diimport!`)
  }

  function getClassName(classId) {
    return classes.find(c => c.id === classId)?.year_name || '—'
  }

  return (
    <Layout
      title={t('students.title')}
      breadcrumb={t('nav.management')}
      actions={
        <>
          <button className="btn btn-ghost btn-sm" onClick={() => csvRef.current?.click()} style={{display:'inline-flex',alignItems:'center',gap:'6px'}}>
            ↑ {t('students.import')}
          </button>
          <button className="btn btn-primary btn-sm" onClick={openAdd}>+ {t('students.add')}</button>
          <input ref={csvRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={handleCsvImport} />
        </>
      }
    >
      <div className="filter-bar">
        <div className={`filter-chip${!filterClassId ? ' active' : ''}`} onClick={() => setFilterClassId(null)}>{t('common.all')}</div>
        {classes.map(cls => (
          <div key={cls.id} className={`filter-chip${filterClassId === cls.id ? ' active' : ''}`} onClick={() => setFilterClassId(cls.id)}>
            {cls.year_name}
          </div>
        ))}
        <input className="filter-input" placeholder={t('students.search')} value={search}
          onChange={e => setSearch(e.target.value)} style={{ marginLeft: 'auto' }} />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--ink3)' }}>{t('common.loading')}</div>
      ) : (
        <div className="card">
          <div className="card-header">
            <div className="card-title">{t('students.title')}</div>
            <span style={{ fontSize: '10px', color: 'var(--ink3)', fontFamily: 'var(--font-mono)' }}>
              {filtered.length} / {students.length} murid
            </span>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{t('students.name')}</th>
                  <th>{t('students.studentNo')}</th>
                  <th>{t('students.class')}</th>
                  <th>QR</th>
                  <th>{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--ink3)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>— {t('students.noStudents')} —</td></tr>
                ) : filtered.map((s, i) => (
                  <tr key={s.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink3)' }}>{String(i + 1).padStart(2, '0')}</td>
                    <td><div className="s-name"><div className="s-init">{getInitials(s.name)}</div>{s.name}</div></td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink3)' }}>{s.student_no || '—'}</td>
                    <td><span className="tag tag-ink">{getClassName(s.class_id)}</span></td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--ink3)' }}>{s.qr_code?.slice(0, 8)}…</td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <EditBtn onClick={() => openEdit(s)} />
                        <DeleteBtn onClick={() => setConfirmDelete(s)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-head">
              <div className="modal-init">◉</div>
              <div>
                <div className="modal-sname">{editTarget ? 'Edit Murid' : t('students.add')}</div>
                <div className="modal-smeta">Maklumat Murid</div>
              </div>
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-warn" style={{ marginBottom: '12px' }}>▲ &nbsp;{error}</div>}
              <label className="input-label">{t('students.name')}</label>
              <input className="input" placeholder="Nama penuh murid" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              <label className="input-label">{t('students.studentNo')} <span style={{ color: 'var(--ink3)', fontWeight: 400 }}>(pilihan)</span></label>
              <input className="input" placeholder="cth: 001" value={form.studentNo}
                onChange={e => setForm(f => ({ ...f, studentNo: e.target.value }))} />
              <label className="input-label">{t('students.class')}</label>
              <select className="input" value={form.classId} onChange={e => setForm(f => ({ ...f, classId: e.target.value }))}>
                <option value="">— Pilih Kelas —</option>
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
          message={`Padam murid "${confirmDelete.name}"? Semua rekod penyerahan buku murid ini juga akan dipadam.`}
          onConfirm={async () => { await deleteStudent(confirmDelete.id); setConfirmDelete(null) }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </Layout>
  )
}

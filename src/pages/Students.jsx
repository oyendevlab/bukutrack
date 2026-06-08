import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Layout from '../components/layout/Layout.jsx'
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx'
import CsvImportModal from '../components/ui/CsvImportModal.jsx'
import { EditBtn, DeleteBtn } from '../components/ui/IconBtn.jsx'
import { useStudents } from '../hooks/useStudents.jsx'
import { useClasses } from '../hooks/useClasses.jsx'
import { Plus, UploadSimple } from '@phosphor-icons/react'
import { QRCodeCanvas } from 'qrcode.react'

const EMPTY_FORM = { name: '', classId: '' }

export default function Students() {
  const { t } = useTranslation()
  const { students, loading, addStudent, addStudentsBulk, updateStudent, deleteStudent } = useStudents()
  const { classes } = useClasses()

  const [showModal, setShowModal] = useState(false)
  const [showCsvImport, setShowCsvImport] = useState(false)
  const [csvTargetClassId, setCsvTargetClassId] = useState(null)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [filterClassId, setFilterClassId] = useState(null)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [fabOpen, setFabOpen] = useState(false)

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
    setForm({ name: s.name, classId: s.class_id })
    setError('')
    setShowModal(true)
  }

  async function handleSave() {
    if (!form.name.trim()) { setError('Nama murid wajib diisi.'); return }
    if (!form.classId) { setError('Sila pilih kelas.'); return }
    setSaving(true)
    if (editTarget) {
      await updateStudent(editTarget.id, { name: form.name.trim(), class_id: form.classId })
    } else {
      await addStudent(form.name.trim(), form.classId)
    }
    setSaving(false)
    setShowModal(false)
  }

  function openCsvImport() {
    const targetId = filterClassId || classes[0]?.id || null
    setCsvTargetClassId(targetId)
    setShowCsvImport(true)
    setFabOpen(false)
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
          <button className="btn btn-ghost btn-sm" onClick={openCsvImport} style={{display:'inline-flex',alignItems:'center',gap:'6px'}}>
            <UploadSimple size={13} weight="bold" /> {t('students.import')}
          </button>
          <button className="btn btn-primary btn-sm" onClick={openAdd}>+ {t('students.add')}</button>
        </>
      }
    >
      <div className="filter-bar">
        <select
          className="filter-select"
          value={filterClassId || ''}
          onChange={e => setFilterClassId(e.target.value || null)}
        >
          <option value="">{t('common.all')}</option>
          {classes.map(cls => (
            <option key={cls.id} value={cls.id}>{cls.year_name}</option>
          ))}
        </select>
        <input className="filter-input" placeholder={t('students.search')} value={search}
          onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--ink3)' }}>{t('common.loading')}</div>
      ) : (
        <>
          {/* Desktop: table */}
          <div className="card class-table-desktop">
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
                    <th>{t('students.class')}</th>
                    <th>{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: '24px', color: 'var(--ink3)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>— {t('students.noStudents')} —</td></tr>
                  ) : filtered.map((s, i) => (
                    <tr key={s.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink3)' }}>{String(i + 1).padStart(2, '0')}</td>
                      <td style={{ fontWeight: 600 }}>{s.name}</td>
                      <td><span className="tag tag-ink">{getClassName(s.class_id)}</span></td>
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

          {/* Mobile: card list */}
          <div className="card student-mobile-card">
            <div className="card-header">
              <div className="card-title">{t('students.title')}</div>
              <span style={{ fontSize: '10px', color: 'var(--ink3)', fontFamily: 'var(--font-mono)' }}>
                {filtered.length} / {students.length} murid
              </span>
            </div>
            <div className="student-col-labels">
              <span>Nama</span>
              <span>Kelas</span>
              <span></span>
            </div>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px', color: 'var(--ink3)', fontSize: '13px' }}>— {t('students.noStudents')} —</div>
            ) : filtered.map((s) => (
              <div key={s.id} className="student-card-row">
                <div className="student-card-name">{s.name}</div>
                <div className="student-card-class">{getClassName(s.class_id)}</div>
                <div className="class-card-actions">
                  <EditBtn onClick={() => openEdit(s)} />
                  <DeleteBtn onClick={() => setConfirmDelete(s)} />
                </div>
              </div>
            ))}
          </div>
        </>
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
              <label className="input-label">{t('students.class')}</label>
              <select className="input" value={form.classId} onChange={e => setForm(f => ({ ...f, classId: e.target.value }))}>
                <option value="">— Pilih Kelas —</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.subject} · {c.year_name}</option>)}
              </select>
              {editTarget?.qr_code && (
                <div className="modal-qr-section">
                  <div className="input-label" style={{ marginBottom: '10px' }}>Kod QR</div>
                  <div className="modal-qr-box">
                    <QRCodeCanvas value={editTarget.qr_code} size={120} level="M" includeMargin={false} />
                    <div className="modal-qr-name">{editTarget.name}</div>
                  </div>
                </div>
              )}
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

      {showCsvImport && (
        <CsvImportModal
          className={
            csvTargetClassId
              ? (classes.find(c => c.id === csvTargetClassId)?.subject + ' · ' + classes.find(c => c.id === csvTargetClassId)?.year_name)
              : 'Pilih kelas'
          }
          onClose={() => setShowCsvImport(false)}
          onImport={async names => {
            if (!csvTargetClassId) return
            await addStudentsBulk(names, csvTargetClassId)
          }}
        />
      )}

      {/* FAB speed dial — mobile only */}
      {fabOpen && <div className="fab-overlay" onClick={() => setFabOpen(false)} />}
      <div className="fab-speed-dial">
        {fabOpen && (
          <div className="fab-options">
            <button className="fab-option" onClick={openCsvImport}>
              <UploadSimple size={18} weight="bold" />
              <span>{t('students.import')}</span>
            </button>
            <button className="fab-option fab-option-primary" onClick={() => { setFabOpen(false); openAdd() }}>
              <Plus size={18} weight="bold" />
              <span>{t('students.add')}</span>
            </button>
          </div>
        )}
        <button className={`fab${fabOpen ? ' fab-open' : ''}`} onClick={() => setFabOpen(o => !o)} aria-label="Tindakan">
          <Plus size={22} weight="bold" style={{ transition: 'transform 0.2s', transform: fabOpen ? 'rotate(45deg)' : 'none' }} />
        </button>
      </div>
    </Layout>
  )
}

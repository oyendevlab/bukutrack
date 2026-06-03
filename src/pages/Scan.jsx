import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Layout from '../components/layout/Layout.jsx'
import ScannerCamera from '../components/features/scan/ScannerCamera.jsx'
import { useClasses } from '../hooks/useClasses.jsx'
import { useStudents } from '../hooks/useStudents.jsx'
import { useBooks } from '../hooks/useBooks.jsx'
import { useAppContext } from '../context/AppContext.jsx'
import { CheckCircle, ArrowLeft, Camera } from '@phosphor-icons/react'

const STEP_SETUP = 'setup'
const STEP_SCAN  = 'scan'
const STEP_DONE  = 'done'

export default function Scan() {
  const { t } = useTranslation()
  const { classes } = useClasses()
  const { students } = useStudents()
  const { books } = useBooks()
  const { createSession, upsertSessionRecord } = useAppContext()

  const [step, setStep] = useState(STEP_SETUP)
  const [form, setForm] = useState({
    classId: '',
    bookId: '',
    checkedAt: new Date().toISOString().slice(0, 10),
    notes: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [activeSession, setActiveSession] = useState(null)
  const [scannedIds, setScannedIds] = useState(new Set())
  const [recentScans, setRecentScans] = useState([])
  const [cameraActive, setCameraActive] = useState(true)
  const [lastScan, setLastScan] = useState(null)

  const classBooks = books.filter(b =>
    !form.classId || b.class_id === form.classId || b.class_id === null
  )
  const sessionClass = classes.find(c => c.id === activeSession?.class_id)
  const sessionBook = books.find(b => b.id === activeSession?.book_id)
  const sessionStudents = students.filter(s => s.class_id === activeSession?.class_id)

  async function handleStart() {
    if (!form.classId) { setError('Sila pilih kelas.'); return }
    if (!form.bookId) { setError('Sila pilih buku.'); return }
    setSaving(true); setError('')
    const { data, error: err } = await createSession(form.classId, form.bookId, form.checkedAt, form.notes)
    setSaving(false)
    if (err) { setError('Gagal cipta sesi. Cuba lagi.'); return }
    setActiveSession(data)
    setScannedIds(new Set())
    setRecentScans([])
    setStep(STEP_SCAN)
  }

  const handleScan = useCallback(async (qrCode) => {
    if (!activeSession) return
    const student = students.find(s => s.qr_code === qrCode)
    if (!student || scannedIds.has(student.id)) return

    setCameraActive(false)
    setScannedIds(prev => new Set([...prev, student.id]))
    setLastScan(student.name)
    await upsertSessionRecord(activeSession.id, student.id, 'present', null, new Date().toISOString())
    setRecentScans(prev => [{ name: student.name, time: new Date().toISOString() }, ...prev.slice(0, 9)])
    setTimeout(() => { setLastScan(null); setCameraActive(true) }, 1500)
  }, [activeSession, students, scannedIds, upsertSessionRecord])

  async function handleFinish() {
    setSaving(true)
    const absent = sessionStudents.filter(s => !scannedIds.has(s.id))
    for (const s of absent) await upsertSessionRecord(activeSession.id, s.id, 'absent')
    setSaving(false)
    setStep(STEP_DONE)
  }

  function handleNewSession() {
    setStep(STEP_SETUP); setActiveSession(null)
    setScannedIds(new Set()); setRecentScans([]); setLastScan(null); setError('')
  }

  return (
    <Layout title={t('scan.title')} breadcrumb={t('scan.subtitle')}>
      <div className="scan-center">
        <div className="scan-box">

          {/* STEP 1 — SETUP */}
          {step === STEP_SETUP && (
            <>
              <div className="scan-session-title">Sesi Semakan Buku</div>
              {error && <div className="alert alert-warn" style={{ marginBottom: '12px' }}>▲ &nbsp;{error}</div>}

              <label className="input-label">Tarikh Semakan</label>
              <input type="date" className="input" value={form.checkedAt}
                onChange={e => setForm(f => ({ ...f, checkedAt: e.target.value }))} />

              <label className="input-label">Kelas</label>
              <select className="input" value={form.classId}
                onChange={e => setForm(f => ({ ...f, classId: e.target.value, bookId: '' }))}>
                <option value="">— Pilih Kelas —</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.subject} · {c.year_name}</option>)}
              </select>

              <label className="input-label">Buku</label>
              <select className="input" value={form.bookId}
                onChange={e => setForm(f => ({ ...f, bookId: e.target.value }))}>
                <option value="">— Pilih Buku —</option>
                {classBooks.map(b => <option key={b.id} value={b.id}>{b.emoji} {b.name}</option>)}
              </select>

              <label className="input-label">
                Nota <span style={{ color: 'var(--ink3)', fontWeight: 400 }}>(pilihan)</span>
              </label>
              <input className="input" placeholder="cth: Semakan minggu ke-3" value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />

              <button className="btn btn-primary"
                style={{ width: '100%', marginTop: '8px', justifyContent: 'center' }}
                onClick={handleStart} disabled={saving}>
                <Camera size={16} weight="bold" />
                {saving ? 'Memulakan...' : 'Mula Imbas →'}
              </button>
            </>
          )}

          {/* STEP 2 — SCAN */}
          {step === STEP_SCAN && (
            <>
              <div className="scan-session-info">
                <div className="scan-session-meta">
                  <span className="tag tag-ink">{sessionClass?.year_name}</span>
                  <span style={{ fontSize: '12px', color: 'var(--ink2)', fontWeight: 600 }}>
                    {sessionBook?.emoji} {sessionBook?.name}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--ink3)' }}>{activeSession?.checked_at}</span>
                </div>
                <div className="scan-session-count">
                  <CheckCircle size={14} weight="fill" color="var(--green)" />
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>
                    {scannedIds.size} / {sessionStudents.length} hadir
                  </span>
                </div>
              </div>

              <div className="rule" />

              {lastScan && (
                <div className="scan-feedback">
                  <CheckCircle size={18} weight="fill" color="var(--green)" />
                  <span>{lastScan} — Hadir ✓</span>
                </div>
              )}

              <ScannerCamera onScan={handleScan} active={cameraActive} />

              <div className="scan-sub" style={{ marginTop: '8px' }}>
                Imbas QR murid untuk tandakan hadir
              </div>

              {recentScans.length > 0 && (
                <div className="scan-recent">
                  <div className="scan-recent-label">Baru diimbas</div>
                  {recentScans.map((s, i) => (
                    <div key={i} className="scan-recent-row">
                      <CheckCircle size={13} weight="fill" color="var(--green)" />
                      <span style={{ flex: 1, fontSize: '13px' }}>{s.name}</span>
                      <span className="scan-recent-time">
                        {new Date(s.time).toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="rule" />
              <button className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={handleFinish} disabled={saving}>
                {saving ? 'Menyimpan...' : `Selesai — ${sessionStudents.length - scannedIds.size} belum imbas`}
              </button>
              <button className="btn btn-ghost"
                style={{ width: '100%', justifyContent: 'center', marginTop: '6px' }}
                onClick={handleNewSession}>
                <ArrowLeft size={14} /> Batal Sesi
              </button>
            </>
          )}

          {/* STEP 3 — DONE */}
          {step === STEP_DONE && (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <CheckCircle size={56} weight="fill" color="var(--green)" style={{ marginBottom: '14px' }} />
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', letterSpacing: '1.5px', marginBottom: '6px' }}>
                Sesi Selesai
              </div>
              <div style={{ fontSize: '13px', color: 'var(--ink3)', marginBottom: '6px' }}>
                {sessionBook?.emoji} {sessionBook?.name} · {sessionClass?.year_name}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--ink2)', marginBottom: '24px' }}>
                <span style={{ color: 'var(--green)', fontWeight: 700 }}>{scannedIds.size} hadir</span>
                {' · '}
                <span style={{ color: 'var(--red)', fontWeight: 700 }}>{sessionStudents.length - scannedIds.size} tidak hadir</span>
              </div>
              <button className="btn btn-primary" onClick={handleNewSession}>
                <Camera size={14} weight="bold" /> Sesi Baru
              </button>
            </div>
          )}

        </div>
      </div>
    </Layout>
  )
}

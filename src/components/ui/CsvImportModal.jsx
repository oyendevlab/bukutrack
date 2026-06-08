import { useState, useRef } from 'react'
import { UploadSimple, DownloadSimple, X, Warning, CheckCircle } from '@phosphor-icons/react'

/* Parse CSV / plain text — nama sahaja, satu baris satu murid */
function parseNames(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const rows = []
  for (const line of lines) {
    if (line.toLowerCase() === 'nama') continue   // skip header
    const name = line.split(',')[0].replace(/^"|"$/g, '').trim()
    rows.push({ raw: line, name, valid: name.length > 0 })
  }
  return rows
}

function downloadTemplate() {
  const content = 'nama\nAhmad Danial\nNurul Amirah\nDanish Izzat'
  const blob = new Blob([content], { type: 'text/csv' })
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(blob),
    download: 'templat-murid.csv',
  })
  a.click()
  URL.revokeObjectURL(a.href)
}

export default function CsvImportModal({ className: clsName, onClose, onImport }) {
  const [step, setStep]           = useState('info')  // 'info' | 'preview'
  const [rows, setRows]           = useState([])
  const [importing, setImporting] = useState(false)
  const [done, setDone]           = useState(false)
  const fileRef                   = useRef(null)

  const validRows   = rows.filter(r => r.valid)
  const invalidRows = rows.filter(r => !r.valid)

  async function handleFile(file) {
    if (!file) return
    const text = await file.text()
    setRows(parseNames(text))
    setStep('preview')
  }

  function handleDrop(e) {
    e.preventDefault()
    handleFile(e.dataTransfer.files[0])
  }

  async function handleConfirm() {
    if (validRows.length === 0) return
    setImporting(true)
    await onImport(validRows.map(r => r.name))
    setImporting(false)
    setDone(true)
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: '480px', width: '100%' }}>

        {/* Header */}
        <div className="modal-head" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="modal-init">📂</div>
            <div>
              <div className="modal-sname">Import Murid dari CSV</div>
              <div className="modal-smeta">{clsName}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink3)', padding: '4px', display: 'flex' }}
            aria-label="Tutup"
          >
            <X size={16} weight="bold" />
          </button>
        </div>

        <div className="modal-body">

          {/* ── Info + Upload ── */}
          {step === 'info' && (
            <>
              <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink2)', margin: '0 0 8px' }}>
                Format fail — satu nama setiap baris:
              </p>
              <div style={{
                background: 'var(--surface2)', borderRadius: '10px',
                padding: '12px 14px', fontFamily: 'var(--font-mono)',
                fontSize: '12px', color: 'var(--ink)', lineHeight: 2,
                border: '1px solid var(--rule)', whiteSpace: 'pre',
                marginBottom: '6px',
              }}>
                <span style={{ color: 'var(--ink3)' }}>nama{'\n'}</span>
                Ahmad Danial{'\n'}
                Nurul Amirah{'\n'}
                Danish Izzat
              </div>
              <button onClick={downloadTemplate} className="csv-template-btn">
                <DownloadSimple size={12} weight="bold" />
                Muat turun templat CSV
              </button>

              {/* Drop zone */}
              <div
                className="csv-dropzone"
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
                onClick={() => fileRef.current?.click()}
                style={{ marginTop: '16px' }}
              >
                <UploadSimple size={28} weight="thin" style={{ color: 'var(--ink3)', marginBottom: '10px' }} />
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>
                  Klik atau seret fail CSV ke sini
                </p>
                <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'var(--ink3)' }}>
                  Fail .csv atau .txt diterima
                </p>
              </div>
              <input
                ref={fileRef} type="file" accept=".csv,.txt"
                style={{ display: 'none' }}
                onChange={e => handleFile(e.target.files[0])}
              />
            </>
          )}

          {/* ── Preview ── */}
          {step === 'preview' && !done && (
            <>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                <span className="csv-badge csv-badge--ok">
                  <CheckCircle size={12} weight="fill" /> {validRows.length} murid sah
                </span>
                {invalidRows.length > 0 && (
                  <span className="csv-badge csv-badge--warn">
                    <Warning size={12} weight="fill" /> {invalidRows.length} baris diabaikan
                  </span>
                )}
              </div>

              <div style={{ maxHeight: '260px', overflowY: 'auto', border: '1px solid var(--rule)', borderRadius: '12px' }}>
                {rows.map((row, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '8px 12px',
                    background: !row.valid
                      ? 'rgba(212,146,78,0.06)'
                      : i % 2 === 0 ? 'transparent' : 'var(--surface2)',
                    borderBottom: i < rows.length - 1 ? '1px solid var(--rule)' : 'none',
                  }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink3)', width: '22px', flexShrink: 0 }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {row.valid ? (
                      <span style={{ fontSize: '13px', color: 'var(--ink)', flex: 1 }}>{row.name}</span>
                    ) : (
                      <>
                        <span style={{ fontSize: '12px', color: '#d4924e', flex: 1, fontStyle: 'italic' }}>
                          baris kosong — diabaikan
                        </span>
                        <Warning size={13} weight="fill" style={{ color: '#d4924e', flexShrink: 0 }} />
                      </>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => { setStep('info'); setRows([]) }}
                style={{ marginTop: '10px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink3)', fontSize: '11px', padding: 0 }}
              >
                ← Pilih fail lain
              </button>
            </>
          )}

          {/* ── Done ── */}
          {done && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎉</div>
              <p style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--ink)' }}>
                {validRows.length} murid berjaya diimport!
              </p>
              <p style={{ margin: '6px 0 0', fontSize: '12px', color: 'var(--ink3)' }}>
                Senarai murid telah dikemaskini.
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="modal-foot">
          {done ? (
            <button className="btn btn-primary" onClick={onClose}>Selesai</button>
          ) : step === 'preview' ? (
            <>
              <button className="btn btn-ghost" onClick={onClose} disabled={importing}>Batal</button>
              <button
                className="btn btn-primary"
                onClick={handleConfirm}
                disabled={importing || validRows.length === 0}
              >
                {importing ? 'Menyimpan...' : `✓ Import ${validRows.length} Murid`}
              </button>
            </>
          ) : (
            <button className="btn btn-ghost" onClick={onClose}>Batal</button>
          )}
        </div>

      </div>
    </div>
  )
}

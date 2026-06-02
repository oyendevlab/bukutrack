import { useEffect, useRef, useState } from 'react'
import { Camera, QrCode } from '@phosphor-icons/react'

export default function ScannerCamera({ onScan, active }) {
  const scannerRef = useRef(null)
  const [started, setStarted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!active) { stopScanner(); return }
    startScanner()
    return () => stopScanner()
  }, [active])

  async function startScanner() {
    if (scannerRef.current) return
    try {
      const { Html5Qrcode } = await import('html5-qrcode')
      const scanner = new Html5Qrcode('qr-reader')
      scannerRef.current = scanner
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 200, height: 200 } },
        (decoded) => onScan(decoded),
        () => {}
      )
      setStarted(true)
      setError('')
    } catch {
      setError('Kamera tidak dapat diakses. Sila benarkan akses kamera.')
    }
  }

  async function stopScanner() {
    if (!scannerRef.current) return
    try { await scannerRef.current.stop(); scannerRef.current.clear() } catch {}
    scannerRef.current = null
    setStarted(false)
  }

  return (
    <div>
      {/* html5-qrcode inject video ke dalam div ini */}
      <div
        id="qr-reader"
        style={{
          width: '220px', height: '220px', margin: '0 auto',
          borderRadius: 'var(--radius-card)', overflow: 'hidden',
          display: started ? 'block' : 'none',
        }}
      />

      {!started && !error && (
        <div className="qr-frame">
          <div className="qr-corner tl" /><div className="qr-corner tr" />
          <div className="qr-corner bl" /><div className="qr-corner br" />
          <div className="qr-scan-line" />
          <div className="qr-icon"><QrCode size={52} weight="thin" /></div>
        </div>
      )}

      {error && (
        <div className="qr-frame" style={{ flexDirection: 'column', gap: '10px', padding: '20px' }}>
          <Camera size={36} weight="thin" style={{ opacity: 0.3, color: 'var(--ink)' }} />
          <div style={{ fontSize: '11px', color: 'var(--red)', fontWeight: 600, textAlign: 'center' }}>{error}</div>
          <button className="btn btn-ghost btn-sm" onClick={startScanner}>Cuba Semula</button>
        </div>
      )}
    </div>
  )
}

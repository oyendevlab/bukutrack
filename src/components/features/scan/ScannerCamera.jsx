import { useEffect, useRef, useState } from 'react'
import { Camera, QrCode } from '@phosphor-icons/react'

export default function ScannerCamera({ onScan, active }) {
  const scannerRef = useRef(null)
  const [started, setStarted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!active) { stopScanner(); return }
    const timer = setTimeout(startScanner, 150)
    return () => { clearTimeout(timer); stopScanner() }
  }, [active])

  async function startScanner() {
    if (scannerRef.current) return
    const el = document.getElementById('qr-reader')
    if (!el) return
    try {
      const { Html5Qrcode } = await import('html5-qrcode')
      const scanner = new Html5Qrcode('qr-reader')
      scannerRef.current = scanner
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decoded) => onScan(decoded),
        () => {}
      )
      setStarted(true)
      setError('')
    } catch (err) {
      console.error('Scanner error:', err)
      setError('Kamera tidak dapat diakses. Sila benarkan akses kamera.')
    }
  }

  async function stopScanner() {
    if (!scannerRef.current) return
    try {
      if (scannerRef.current.isScanning) await scannerRef.current.stop()
      scannerRef.current.clear()
    } catch {}
    scannerRef.current = null
    setStarted(false)
  }

  if (error) {
    return (
      <div className="qr-frame" style={{ flexDirection: 'column', gap: '10px', padding: '20px' }}>
        <Camera size={36} weight="thin" style={{ opacity: 0.3, color: 'var(--ink)' }} />
        <div style={{ fontSize: '11px', color: 'var(--red)', fontWeight: 600, textAlign: 'center' }}>{error}</div>
        <button className="btn btn-ghost btn-sm" onClick={() => { setError(''); startScanner() }}>Cuba Semula</button>
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', width: '280px', height: '280px', margin: '0 auto' }}>
      {/* div#qr-reader sentiasa visible — html5-qrcode inject video ke sini */}
      <div
        id="qr-reader"
        style={{
          width: '280px',
          height: '280px',
          borderRadius: 'var(--radius-card)',
          overflow: 'hidden',
        }}
      />

      {/* Overlay placeholder semasa kamera belum start */}
      {!started && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: 'var(--surface2)',
          borderRadius: 'var(--radius-card)',
          border: '2px dashed var(--rule)',
          pointerEvents: 'none',
          gap: '8px',
        }}>
          <div className="qr-corner tl" /><div className="qr-corner tr" />
          <div className="qr-corner bl" /><div className="qr-corner br" />
          <QrCode size={48} weight="thin" color="var(--ink3)" />
          <div style={{ fontSize: '11px', color: 'var(--ink3)' }}>Memuatkan kamera...</div>
        </div>
      )}
    </div>
  )
}

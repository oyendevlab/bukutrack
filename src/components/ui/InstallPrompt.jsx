import { useState, useEffect } from 'react'
import { DownloadSimple, X, DeviceMobile } from '@phosphor-icons/react'

const DISMISSED_KEY = 'bukutrack_install_dismissed'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [show, setShow]                     = useState(false)
  const [isIos, setIsIos]                   = useState(false)
  const [installed, setInstalled]           = useState(false)

  useEffect(() => {
    // Jika sudah pasang (standalone mode), jangan tunjuk
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    if (isStandalone) { setInstalled(true); return }

    // Jika sudah dismiss dalam sesi ini, jangan tunjuk
    if (sessionStorage.getItem(DISMISSED_KEY)) return

    // iOS Safari — tidak support beforeinstallprompt
    const ua = navigator.userAgent
    const iosDevice = /iphone|ipad|ipod/i.test(ua) && !window.MSStream
    if (iosDevice) {
      setIsIos(true)
      setShow(true)
      return
    }

    // Android / Chrome / Edge — guna beforeinstallprompt
    function handlePrompt(e) {
      e.preventDefault()
      setDeferredPrompt(e)
      setShow(true)
    }

    window.addEventListener('beforeinstallprompt', handlePrompt)
    window.addEventListener('appinstalled', () => {
      setShow(false)
      setInstalled(true)
    })

    return () => window.removeEventListener('beforeinstallprompt', handlePrompt)
  }, [])

  async function handleInstall() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setShow(false)
    setDeferredPrompt(null)
  }

  function handleDismiss() {
    sessionStorage.setItem(DISMISSED_KEY, '1')
    setShow(false)
  }

  if (!show || installed) return null

  return (
    <div className="install-banner">
      <div className="install-banner-icon">
        <DeviceMobile size={20} weight="fill" />
      </div>
      <div className="install-banner-text">
        <div className="install-banner-title">Pasang BukuTrack</div>
        {isIos ? (
          <div className="install-banner-sub">
            Ketik <strong>⎙ Kongsi</strong> lalu <strong>Tambah ke Skrin Utama</strong>
          </div>
        ) : (
          <div className="install-banner-sub">
            Pasang pada peranti untuk akses lebih pantas
          </div>
        )}
      </div>
      <div className="install-banner-actions">
        {!isIos && (
          <button className="btn btn-primary btn-sm" onClick={handleInstall}>
            <DownloadSimple size={13} weight="bold" /> Pasang
          </button>
        )}
        <button className="btn btn-ghost btn-sm" onClick={handleDismiss}>
          <X size={13} weight="bold" />
        </button>
      </div>
    </div>
  )
}

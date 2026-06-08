import { useState, useEffect, useRef } from 'react'
import { DownloadSimple, X, DeviceMobile } from '@phosphor-icons/react'

const DISMISSED_KEY = 'bukutrack_install_dismissed'

export default function InstallPrompt() {
  const [show, setShow]           = useState(false)
  const [isIos, setIsIos]         = useState(false)
  const [installed, setInstalled] = useState(false)
  const promptRef                 = useRef(null)

  useEffect(() => {
    // Sudah dipasang (standalone) — jangan tunjuk
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    if (isStandalone) { setInstalled(true); return }

    // Pernah dismiss — jangan tunjuk dalam sesi ini
    if (sessionStorage.getItem(DISMISSED_KEY)) return

    // iOS Safari — tidak support beforeinstallprompt
    const ua = navigator.userAgent
    const iosDevice = /iphone|ipad|ipod/i.test(ua) && !window.MSStream
    if (iosDevice) { setIsIos(true); setShow(true); return }

    // Ambil prompt yang mungkin sudah ditangkap sebelum React mount
    if (window.__pwaPrompt) {
      promptRef.current = window.__pwaPrompt
      setShow(true)
      return
    }

    // Tunggu event dari main.jsx jika prompt belum fire lagi
    function onPromptReady() {
      if (window.__pwaPrompt && !sessionStorage.getItem(DISMISSED_KEY)) {
        promptRef.current = window.__pwaPrompt
        setShow(true)
      }
    }

    window.addEventListener('pwa-prompt-ready', onPromptReady)
    window.addEventListener('appinstalled', () => {
      setShow(false)
      setInstalled(true)
      window.__pwaPrompt = null
    })

    return () => window.removeEventListener('pwa-prompt-ready', onPromptReady)
  }, [])

  async function handleInstall() {
    const prompt = promptRef.current
    if (!prompt) return
    prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') {
      setShow(false)
      window.__pwaPrompt = null
    }
    promptRef.current = null
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

import { useState, useEffect, useRef } from 'react'
import { DownloadSimple, X, ShareNetwork, ArrowDown } from '@phosphor-icons/react'

const DISMISSED_KEY = 'bukutrack_install_dismissed'

export default function InstallPrompt() {
  const [show, setShow]       = useState(false)
  const [isIos, setIsIos]     = useState(false)
  const [installed, setInstalled] = useState(false)
  const [exiting, setExiting] = useState(false)
  const promptRef             = useRef(null)

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    if (isStandalone) { setInstalled(true); return }

    if (sessionStorage.getItem(DISMISSED_KEY)) return

    const ua = navigator.userAgent
    const iosDevice = /iphone|ipad|ipod/i.test(ua) && !window.MSStream
    if (iosDevice) { setIsIos(true); setShow(true); return }

    if (window.__pwaPrompt) {
      promptRef.current = window.__pwaPrompt
      setShow(true)
      return
    }

    function onPromptReady() {
      if (window.__pwaPrompt && !sessionStorage.getItem(DISMISSED_KEY)) {
        promptRef.current = window.__pwaPrompt
        setShow(true)
      }
    }

    function onInstalled() {
      dismiss()
      setInstalled(true)
      window.__pwaPrompt = null
    }

    window.addEventListener('pwa-prompt-ready', onPromptReady)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('pwa-prompt-ready', onPromptReady)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  function dismiss() {
    setExiting(true)
    setTimeout(() => { setShow(false); setExiting(false) }, 300)
    sessionStorage.setItem(DISMISSED_KEY, '1')
  }

  async function handleInstall() {
    const prompt = promptRef.current
    if (!prompt) return
    prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') { dismiss(); window.__pwaPrompt = null }
    promptRef.current = null
  }

  if (!show || installed) return null

  return (
    <div className={`install-card${exiting ? ' install-card--exit' : ''}`} role="banner">
      <div className="install-card__glow" aria-hidden="true" />

      <div className="install-card__icon">
        <span style={{ fontSize: '22px', lineHeight: 1 }}>📚</span>
      </div>

      <div className="install-card__body">
        <p className="install-card__title">Pasang BukuTrack</p>
        {isIos ? (
          <p className="install-card__sub">
            Ketik{' '}
            <span className="install-card__step">
              <ShareNetwork size={9} weight="bold" /> Kongsi
            </span>
            {' '}→{' '}
            <span className="install-card__step">Tambah ke Skrin Utama</span>
          </p>
        ) : (
          <p className="install-card__sub">Akses pantas · boleh guna offline</p>
        )}
      </div>

      <div className="install-card__actions">
        {isIos ? (
          <div className="install-card__ios-hint" aria-hidden="true">
            <ArrowDown size={15} weight="bold" />
          </div>
        ) : (
          <button className="install-card__cta" onClick={handleInstall}>
            <DownloadSimple size={14} weight="bold" />
            Pasang
          </button>
        )}
        <button className="install-card__dismiss" onClick={dismiss} aria-label="Tutup notifikasi pasang">
          <X size={13} weight="bold" />
        </button>
      </div>
    </div>
  )
}

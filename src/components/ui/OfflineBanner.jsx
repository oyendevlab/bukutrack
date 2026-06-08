import { useState, useEffect } from 'react'
import { WifiSlash, WifiHigh } from '@phosphor-icons/react'

export default function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [visible, setVisible]   = useState(!navigator.onLine)

  useEffect(() => {
    let hideTimer = null

    function handleOnline() {
      setIsOnline(true)
      setVisible(true)
      hideTimer = setTimeout(() => setVisible(false), 3000)
    }

    function handleOffline() {
      clearTimeout(hideTimer)
      setIsOnline(false)
      setVisible(true)
    }

    window.addEventListener('online',  handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online',  handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearTimeout(hideTimer)
    }
  }, [])

  if (!visible) return null

  return (
    <div className={`offline-banner${isOnline ? ' offline-banner-online' : ' offline-banner-offline'}`}>
      {isOnline ? (
        <>
          <WifiHigh size={14} weight="bold" />
          <span>Sambungan internet pulih</span>
        </>
      ) : (
        <>
          <WifiSlash size={14} weight="bold" />
          <span>Tiada sambungan internet — data yang dipaparkan mungkin tidak terkini</span>
        </>
      )}
    </div>
  )
}

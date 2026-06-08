import { useState, useEffect } from 'react'

export function useDarkMode() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('bukutrack-dark')
    if (saved !== null) return saved === 'true'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-dark', dark ? 'true' : 'false')
    localStorage.setItem('bukutrack-dark', String(dark))
  }, [dark])

  return { dark, toggleDark: () => setDark(d => !d) }
}

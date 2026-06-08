import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import './i18n/index.js'
import App from './App.jsx'

// Init dark mode SEBELUM render untuk elak flash
;(function () {
  const saved = localStorage.getItem('bukutrack-dark')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const isDark = saved !== null ? saved === 'true' : prefersDark
  document.documentElement.setAttribute('data-dark', isDark ? 'true' : 'false')
})()

// Tangkap beforeinstallprompt SEBELUM React mount
// supaya event tidak terlepas walaupun ia fire awal
window.__pwaPrompt = null
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  window.__pwaPrompt = e
  window.dispatchEvent(new Event('pwa-prompt-ready'))
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

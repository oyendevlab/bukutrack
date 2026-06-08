import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import './i18n/index.js'
import App from './App.jsx'

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

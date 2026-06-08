import { useState, useEffect } from 'react'
import { Sun, Moon, MagnifyingGlass } from '@phosphor-icons/react'
import { useDarkMode } from '../../hooks/useDarkMode.jsx'
import GlobalSearch from '../ui/GlobalSearch.jsx'

export default function Topbar({ title, breadcrumb, actions, sidebarOpen, onToggleSidebar }) {
  const { dark, toggleDark } = useDarkMode()
  const [searchOpen, setSearchOpen] = useState(false)

  // Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    function handleKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(o => !o)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <>
      <div className="topbar-wrapper">
        <div className="topbar">
          <div
            className={`hamburger hamburger-desktop${sidebarOpen ? ' open' : ''}`}
            onClick={onToggleSidebar}
          >
            <div className="ham-line" />
            <div className="ham-line" />
            <div className="ham-line" />
          </div>

          <div className="topbar-divider" />

          <div className="topbar-left">
            <div className="topbar-title">{title}</div>
            {breadcrumb && <div className="topbar-breadcrumb">{breadcrumb}</div>}
          </div>

          {actions && (
            <div className="topbar-actions topbar-actions-desktop">{actions}</div>
          )}

          {/* Search button */}
          <button
            className="btn btn-ghost btn-sm dark-toggle"
            onClick={() => setSearchOpen(true)}
            title="Cari (⌘K)"
            aria-label="Carian global"
          >
            <MagnifyingGlass size={16} weight="bold" />
          </button>

          {/* Dark mode toggle */}
          <button
            className="btn btn-ghost btn-sm dark-toggle"
            onClick={toggleDark}
            title={dark ? 'Tukar ke mod cerah' : 'Tukar ke mod gelap'}
            aria-label={dark ? 'Light mode' : 'Dark mode'}
          >
            {dark
              ? <Sun size={16} weight="bold" />
              : <Moon size={16} weight="bold" />
            }
          </button>
        </div>
      </div>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}

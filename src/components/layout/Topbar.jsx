import { Sun, Moon } from '@phosphor-icons/react'
import { useDarkMode } from '../../hooks/useDarkMode.jsx'

export default function Topbar({ title, breadcrumb, actions, sidebarOpen, onToggleSidebar }) {
  const { dark, toggleDark } = useDarkMode()

  return (
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
  )
}

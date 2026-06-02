import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../hooks/useAuth.jsx'

const NAV_ITEMS = [
  { section: 'main' },
  { icon: '▣', labelKey: 'nav.dashboard', path: '/' },
  { icon: '◎', labelKey: 'nav.scan', path: '/scan' },
  { icon: '☰', labelKey: 'nav.records', path: '/records', badge: true },
  { section: 'management' },
  { icon: '◫', labelKey: 'nav.classes', path: '/classes' },
  { icon: '◉', labelKey: 'nav.students', path: '/students' },
  { icon: '◈', labelKey: 'nav.books', path: '/books' },
  { icon: '⊟', labelKey: 'nav.printQR', path: '/qr-print' },
  { section: 'info' },
  { icon: '🔒', labelKey: 'nav.privacy', path: '/settings/privacy' },
  { icon: '♥', labelKey: 'nav.donate', path: '/settings/donate' },
  { section: 'account' },
  { icon: '◇', labelKey: 'nav.settings', path: '/settings' },
]

export default function Sidebar({ open, onClose, incompleteCount = 0 }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { teacher } = useAuth()
  const { t } = useTranslation()

  function handleNav(path) {
    navigate(path)
    if (window.innerWidth < 1024) onClose()
  }

  function getInitials(name) {
    if (!name) return '?'
    return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
  }

  return (
    <>
      {open && <div className="sidebar-overlay show" onClick={onClose} />}

      <aside className={`sidebar${open ? ' open' : ''}`}>
        <div className="logo">
          <div className="logo-mark">BUKU<span>TRACK</span></div>
          <div className="logo-sub">v1.0 · Cikgu Portal</div>
        </div>

        <nav className="nav">
          {NAV_ITEMS.map((item, i) => {
            if (item.section) {
              return <div key={i} className="nav-section">{t(`nav.${item.section}`)}</div>
            }

            const isActive = item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path)

            return (
              <div
                key={item.path}
                className={`nav-item${isActive ? ' active' : ''}`}
                onClick={() => handleNav(item.path)}
              >
                <span className="nav-icon">{item.icon}</span>
                {t(item.labelKey)}
                {item.badge && incompleteCount > 0 && (
                  <span className="nav-badge">{incompleteCount}</span>
                )}
              </div>
            )
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-row">
            <div className="user-avatar">{getInitials(teacher?.name)}</div>
            <div>
              <div className="user-name">{teacher?.name || 'Cikgu'}</div>
              <div className="user-role">{teacher?.school_name || 'BukuTrack'}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../hooks/useAuth.jsx'
import BrandLogo from '../ui/BrandLogo.jsx'
import {
  SquaresFour,
  QrCode,
  ClipboardText,
  Chalkboard,
  Users,
  Books,
  Printer,
  ShieldCheck,
  Heart,
  Gear,
} from '@phosphor-icons/react'

const NAV_ITEMS = [
  { section: 'main' },
  { Icon: SquaresFour,  labelKey: 'nav.dashboard', path: '/dashboard' },
  { Icon: QrCode,       labelKey: 'nav.scan',      path: '/scan' },
  { Icon: ClipboardText,labelKey: 'nav.records',   path: '/records', badge: true },
  { section: 'management' },
  { Icon: Chalkboard,   labelKey: 'nav.classes',   path: '/classes' },
  { Icon: Users,        labelKey: 'nav.students',  path: '/students' },
  { Icon: Books,        labelKey: 'nav.books',     path: '/books' },
  { Icon: Printer,      labelKey: 'nav.printQR',   path: '/qr-print' },
  { section: 'info' },
  { Icon: ShieldCheck,  labelKey: 'nav.privacy',   path: '/settings/privacy' },
  { Icon: Heart,        labelKey: 'nav.donate',    path: '/settings/donate' },
  { section: 'account' },
  { Icon: Gear,         labelKey: 'nav.settings',  path: '/settings' },
]

export default function Sidebar({ open, collapsed = false, onClose, incompleteCount = 0 }) {
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
    return name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase()
  }

  return (
    <>
      {open && <div className="sidebar-overlay show" onClick={onClose} />}

      <aside className={`sidebar${open ? ' open' : ''}${collapsed ? ' sidebar-collapsed' : ''}`}>

        {/* Logo */}
        <div className="logo">
          {collapsed
            ? <span className="logo-emoji">📚</span>
            : <BrandLogo size="md" />
          }
        </div>

        <nav className="nav">
          {NAV_ITEMS.map((item, i) => {
            if (item.section) {
              // Section header — sembunyikan text bila collapsed, tunjuk divider
              return (
                <div key={i} className={`nav-section${collapsed ? ' nav-section-collapsed' : ''}`}>
                  {!collapsed && t(`nav.${item.section}`)}
                </div>
              )
            }

            const isActive = item.path === '/dashboard'
              ? location.pathname === '/dashboard'
              : location.pathname.startsWith(item.path)

            return (
              <div
                key={item.path}
                className={`nav-item${isActive ? ' active' : ''}`}
                onClick={() => handleNav(item.path)}
                title={collapsed ? t(item.labelKey) : undefined}
              >
                <span className="nav-icon">
                  <item.Icon size={18} weight={isActive ? 'fill' : 'regular'} />
                </span>
                {!collapsed && (
                  <>
                    <span className="nav-label">{t(item.labelKey)}</span>
                    {item.badge && incompleteCount > 0 && (
                      <span className="nav-badge">{incompleteCount}</span>
                    )}
                  </>
                )}
                {collapsed && item.badge && incompleteCount > 0 && (
                  <span className="nav-badge-dot" />
                )}
              </div>
            )
          })}
        </nav>

        {/* Footer — compact bila collapsed */}
        <div className="sidebar-footer">
          <div className={`user-row${collapsed ? ' user-row-collapsed' : ''}`}>
            <div className="user-avatar" title={collapsed ? (teacher?.name || 'Cikgu') : undefined}>
              {getInitials(teacher?.name)}
            </div>
            {!collapsed && (
              <div>
                <div className="user-name">{teacher?.name || 'Cikgu'}</div>
                <div className="user-role">{teacher?.school_name || 'BukuTrack'}</div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}

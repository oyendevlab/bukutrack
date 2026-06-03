import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  SquaresFour,
  Camera,
  ClipboardText,
  Chalkboard,
  Gear,
} from '@phosphor-icons/react'

const BOTTOM_NAV_ITEMS = [
  { Icon: SquaresFour,  labelKey: 'nav.dashboard', path: '/' },
  { Icon: Chalkboard,   labelKey: 'nav.classes',   path: '/classes' },
  { Icon: Camera,       labelKey: 'nav.scan',       path: '/scan',  center: true },
  { Icon: ClipboardText,labelKey: 'nav.records',   path: '/records' },
  { Icon: Gear,         labelKey: 'nav.settings',  path: '/settings' },
]

export default function BottomNav({ incompleteCount = 0 }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()

  return (
    <nav className="bottom-nav">
      {BOTTOM_NAV_ITEMS.map((item) => {
        const isActive = item.path === '/'
          ? location.pathname === '/'
          : location.pathname.startsWith(item.path)

        if (item.center) {
          return (
            <button
              key={item.path}
              className={`bottom-nav-center${isActive ? ' active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <item.Icon size={28} weight={isActive ? 'fill' : 'regular'} />
            </button>
          )
        }

        return (
          <button
            key={item.path}
            className={`bottom-nav-item${isActive ? ' active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="bottom-nav-icon">
              <item.Icon size={22} weight={isActive ? 'fill' : 'regular'} />
              {item.path === '/records' && incompleteCount > 0 && (
                <span className="bottom-nav-dot" />
              )}
            </span>
            <span className="bottom-nav-label">{t(item.labelKey)}</span>
          </button>
        )
      })}
    </nav>
  )
}

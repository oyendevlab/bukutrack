import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  SquaresFour,
  Camera,
  ClipboardText,
  Chalkboard,
  Gear,
  Users,
  Books,
  Printer,
  X,
} from '@phosphor-icons/react'

const MGMT_ITEMS = [
  { Icon: Chalkboard, labelKey: 'nav.classes',  path: '/classes' },
  { Icon: Users,      labelKey: 'nav.students', path: '/students' },
  { Icon: Books,      labelKey: 'nav.books',    path: '/books' },
  { Icon: Printer,    labelKey: 'nav.printQR',  path: '/qr-print' },
]

const MGMT_PATHS = MGMT_ITEMS.map(i => i.path)

export default function BottomNav({ incompleteCount = 0 }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const [mgmtOpen, setMgmtOpen] = useState(false)

  const isMgmtActive = MGMT_PATHS.some(p => location.pathname.startsWith(p))

  function handleNav(path) {
    setMgmtOpen(false)
    navigate(path)
  }

  return (
    <>
      {/* Bottom sheet overlay */}
      {mgmtOpen && (
        <div className="mgmt-overlay" onClick={() => setMgmtOpen(false)} />
      )}

      {/* Bottom sheet drawer */}
      <div className={`mgmt-sheet${mgmtOpen ? ' open' : ''}`}>
        <div className="mgmt-sheet-handle" />
        <div className="mgmt-sheet-title">{t('nav.managementNav')}</div>
        <div className="mgmt-sheet-list">
          {MGMT_ITEMS.map(item => {
            const isActive = location.pathname.startsWith(item.path)
            return (
              <button
                key={item.path}
                className={`mgmt-sheet-item${isActive ? ' active' : ''}`}
                onClick={() => handleNav(item.path)}
              >
                <item.Icon size={22} weight={isActive ? 'fill' : 'regular'} />
                <span>{t(item.labelKey)}</span>
              </button>
            )
          })}
        </div>
        <button className="mgmt-sheet-close" onClick={() => setMgmtOpen(false)}>
          <X size={18} weight="bold" />
        </button>
      </div>

      {/* Bottom nav bar */}
      <nav className="bottom-nav">
        <button
          className={`bottom-nav-item${location.pathname === '/' ? ' active' : ''}`}
          onClick={() => handleNav('/')}
        >
          <span className="bottom-nav-icon">
            <SquaresFour size={22} weight={location.pathname === '/' ? 'fill' : 'regular'} />
          </span>
          <span className="bottom-nav-label">{t('nav.dashboard')}</span>
        </button>

        <button
          className={`bottom-nav-item${isMgmtActive ? ' active' : ''}`}
          onClick={() => setMgmtOpen(o => !o)}
        >
          <span className="bottom-nav-icon">
            <Chalkboard size={22} weight={isMgmtActive ? 'fill' : 'regular'} />
          </span>
          <span className="bottom-nav-label">{t('nav.managementNav')}</span>
        </button>

        <button
          className={`bottom-nav-center${location.pathname === '/scan' ? ' active' : ''}`}
          onClick={() => handleNav('/scan')}
        >
          <Camera size={28} weight={location.pathname === '/scan' ? 'fill' : 'regular'} />
        </button>

        <button
          className={`bottom-nav-item${location.pathname.startsWith('/records') ? ' active' : ''}`}
          onClick={() => handleNav('/records')}
        >
          <span className="bottom-nav-icon">
            <ClipboardText size={22} weight={location.pathname.startsWith('/records') ? 'fill' : 'regular'} />
            {incompleteCount > 0 && <span className="bottom-nav-dot" />}
          </span>
          <span className="bottom-nav-label">{t('nav.recordsNav')}</span>
        </button>

        <button
          className={`bottom-nav-item${location.pathname.startsWith('/settings') ? ' active' : ''}`}
          onClick={() => handleNav('/settings')}
        >
          <span className="bottom-nav-icon">
            <Gear size={22} weight={location.pathname.startsWith('/settings') ? 'fill' : 'regular'} />
          </span>
          <span className="bottom-nav-label">{t('nav.settings')}</span>
        </button>
      </nav>
    </>
  )
}

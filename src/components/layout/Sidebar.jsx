import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'

const NAV_ITEMS = [
  { section: 'UTAMA' },
  { icon: '▣', label: 'Dashboard', path: '/' },
  { icon: '◎', label: 'Scan QR', path: '/scan' },
  { icon: '☰', label: 'Rekod & Laporan', path: '/records', badge: true },
  { section: 'PENGURUSAN' },
  { icon: '◫', label: 'Senarai Kelas', path: '/classes' },
  { icon: '◉', label: 'Senarai Murid', path: '/students' },
  { icon: '◈', label: 'Senarai Buku', path: '/books' },
  { icon: '⊟', label: 'Print QR', path: '/qr-print' },
  { section: 'MAKLUMAT' },
  { icon: '🔒', label: 'Privasi & Keselamatan', path: '/settings/privacy' },
  { icon: '♥', label: 'Sokong Pembangun', path: '/settings/donate' },
  { section: 'AKAUN' },
  { icon: '◇', label: 'Tetapan', path: '/settings' },
]

export default function Sidebar({ open, onClose, incompleteCount = 0 }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { teacher } = useAuth()

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
              return <div key={i} className="nav-section">{item.section}</div>
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
                {item.label}
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

export default function Topbar({ title, breadcrumb, actions, sidebarOpen, onToggleSidebar }) {
  return (
    <div className="topbar">
      <div
        className={`hamburger${sidebarOpen ? ' open' : ''}`}
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

      {actions && <div className="topbar-actions">{actions}</div>}
    </div>
  )
}

export default function Topbar({ title, breadcrumb, actions, sidebarOpen, onToggleSidebar }) {
  return (
    <div className="topbar-wrapper">
      {/* Baris utama — tajuk sahaja */}
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

        {/* Desktop sahaja: butang dalam topbar kanan */}
        {actions && (
          <div className="topbar-actions topbar-actions-desktop">{actions}</div>
        )}
      </div>
    </div>
  )
}

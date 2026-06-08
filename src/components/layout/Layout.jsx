import { useState, useEffect } from 'react'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import BottomNav from './BottomNav.jsx'
import OfflineBanner from '../ui/OfflineBanner.jsx'

export default function Layout({ title, breadcrumb, actions, children, incompleteCount }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)       // mobile slide-in
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false) // desktop hide

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) setSidebarOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  function handleToggle() {
    if (window.innerWidth >= 1024) {
      setSidebarCollapsed(c => !c)
    } else {
      setSidebarOpen(o => !o)
    }
  }

  return (
    <div>
      <Sidebar
        open={sidebarOpen}
        collapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        incompleteCount={incompleteCount}
      />
      <div className={`main${sidebarCollapsed ? ' sidebar-icon-mode' : ''}`}>
        <Topbar
          title={title}
          breadcrumb={breadcrumb}
          actions={actions}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={handleToggle}
        />
        <OfflineBanner />
        <div className="content">
          {children}
        </div>
      </div>
      <BottomNav incompleteCount={incompleteCount} />
    </div>
  )
}

import { useState, useEffect } from 'react'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'

export default function Layout({ title, breadcrumb, actions, children, incompleteCount }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) setSidebarOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div>
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        incompleteCount={incompleteCount}
      />
      <div className="main">
        <Topbar
          title={title}
          breadcrumb={breadcrumb}
          actions={actions}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(o => !o)}
        />
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  )
}

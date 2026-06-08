import { useState, useEffect, useRef, useCallback } from 'react'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import BottomNav from './BottomNav.jsx'
import OfflineBanner from '../ui/OfflineBanner.jsx'
import InstallPrompt from '../ui/InstallPrompt.jsx'
import { useAppContext } from '../../context/AppContext.jsx'
import { ArrowClockwise } from '@phosphor-icons/react'

const PTR_THRESHOLD = 72
const PTR_MAX = 96

export default function Layout({ title, breadcrumb, actions, children, incompleteCount }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [pullY, setPullY] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const touchStartY = useRef(0)
  const contentRef = useRef(null)
  const { fetchAll } = useAppContext()

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) setSidebarOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  function handleToggle() {
    if (window.innerWidth >= 1024) setSidebarCollapsed(c => !c)
    else setSidebarOpen(o => !o)
  }

  const onTouchStart = useCallback(e => {
    touchStartY.current = e.touches[0].clientY
  }, [])

  const onTouchMove = useCallback(e => {
    if (refreshing) return
    const el = contentRef.current
    if (!el || el.scrollTop > 0) return
    const dy = e.touches[0].clientY - touchStartY.current
    if (dy <= 0) return
    e.preventDefault()
    setPullY(Math.min(dy * 0.5, PTR_MAX))
  }, [refreshing])

  const onTouchEnd = useCallback(async () => {
    if (pullY >= PTR_THRESHOLD) {
      setRefreshing(true)
      setPullY(PTR_MAX)
      await fetchAll()
      setRefreshing(false)
    }
    setPullY(0)
  }, [pullY, fetchAll])

  const indicatorProgress = Math.min(pullY / PTR_THRESHOLD, 1)
  const showIndicator = pullY > 4 || refreshing

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
        <InstallPrompt />

        {showIndicator && (
          <div className="ptr-indicator" style={{ opacity: Math.max(indicatorProgress, refreshing ? 1 : 0) }}>
            <div
              className={`ptr-icon${refreshing ? ' ptr-icon--spinning' : ''}`}
              style={{ transform: `rotate(${indicatorProgress * 180}deg)` }}
            >
              <ArrowClockwise size={16} weight="bold" />
            </div>
            <span className="ptr-label">
              {refreshing ? 'Mengemaskini...' : pullY >= PTR_THRESHOLD ? 'Lepas untuk refresh' : 'Tarik untuk refresh'}
            </span>
          </div>
        )}

        <div
          ref={contentRef}
          className="content"
          style={{
            transform: pullY > 0 ? `translateY(${pullY}px)` : undefined,
            transition: pullY === 0 ? 'transform 0.25s ease' : 'none',
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {children}
        </div>
      </div>
      <BottomNav incompleteCount={incompleteCount} />
    </div>
  )
}

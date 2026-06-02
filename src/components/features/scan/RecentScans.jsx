import { useTranslation } from 'react-i18next'

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' })
}

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

export default function RecentScans({ scans }) {
  const { t } = useTranslation()
  if (!scans.length) return null

  return (
    <div style={{ marginTop: '20px', width: '100%', maxWidth: '380px' }}>
      <div className="recent-label">{t('scan.recentScans')}</div>
      {scans.slice(0, 5).map((scan, i) => (
        <div key={i} className="recent-item">
          <div className="recent-dot" style={{ background: scan.booksAdded > 0 ? 'var(--green)' : 'var(--ink3)', borderRadius: '50%' }} />
          <div style={{ width: '26px', height: '26px', background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
            {getInitials(scan.studentName)}
          </div>
          <div className="recent-name" style={{ fontSize: '12px' }}>{scan.studentName}</div>
          <div style={{ fontSize: '10px', color: 'var(--ink3)', fontFamily: 'var(--font-mono)' }}>
            {scan.booksAdded > 0
              ? <span style={{ color: 'var(--green)', fontWeight: 700 }}>+{scan.booksAdded} buku</span>
              : <span>tiada perubahan</span>}
          </div>
          <div className="recent-time">{formatTime(scan.time)}</div>
        </div>
      ))}
    </div>
  )
}

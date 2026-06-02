import { useTranslation } from 'react-i18next'

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' })
}

export default function RecentActivity({ submissions }) {
  const { t } = useTranslation()
  const recent = submissions.slice(0, 10)

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">{t('dashboard.recentActivity')}</div>
        <span style={{ fontSize: '10px', color: 'var(--ink3)', fontFamily: 'var(--font-mono)' }}>{t('dashboard.today')}</span>
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>{t('records.time')}</th>
              <th>{t('records.class')}</th>
              <th>{t('records.student')}</th>
              <th>{t('records.book')}</th>
              <th>{t('records.status')}</th>
            </tr>
          </thead>
          <tbody>
            {recent.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--ink3)', padding: '24px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                  — tiada aktiviti —
                </td>
              </tr>
            ) : recent.map(sub => (
              <tr key={sub.id}>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink3)' }}>
                  {formatTime(sub.submitted_at)}
                </td>
                <td>
                  <span className="tag tag-ink" style={{ fontSize: '9px' }}>
                    {sub.students?.classes?.year_name || '—'}
                  </span>
                </td>
                <td>
                  <div className="s-name">
                    <div className="s-init">{getInitials(sub.students?.name)}</div>
                    {sub.students?.name}
                  </div>
                </td>
                <td style={{ fontSize: '12px' }}>
                  {sub.books?.emoji} {sub.books?.name}
                </td>
                <td><span className="badge badge-ok">✓ Rekod</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

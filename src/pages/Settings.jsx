import Layout from '../components/layout/Layout.jsx'
import ThemeSwitcher from '../components/features/settings/ThemeSwitcher.jsx'
import StyleSwitcher from '../components/features/settings/StyleSwitcher.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { useLanguage } from '../hooks/useLanguage.jsx'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export default function Settings() {
  const { teacher, user, signOut } = useAuth()
  const { language, setLanguage } = useLanguage(user?.id)
  const { t } = useTranslation()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <Layout title={t('settings.title')} breadcrumb={t('settings.subtitle')}>
      <div className="card" style={{ marginBottom: '16px' }}>
        <div className="card-header"><div className="card-title">Tema Gaya</div></div>
        <div className="card-body"><StyleSwitcher /></div>
      </div>

      <div className="card" style={{ marginBottom: '16px' }}>
        <div className="card-header"><div className="card-title">Tema Warna</div></div>
        <div className="card-body"><ThemeSwitcher /></div>
      </div>

      <div className="card" style={{ marginBottom: '16px' }}>
        <div className="card-header"><div className="card-title">Profil</div></div>
        <div className="card-body">
          <div style={{ fontSize: '13px', color: 'var(--ink2)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div><strong>Nama:</strong> {teacher?.name}</div>
            <div><strong>E-mel:</strong> {teacher?.email}</div>
            <div><strong>Sekolah:</strong> {teacher?.school_name || '—'}</div>
          </div>
        </div>
      </div>

      {/* Bahasa */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <div className="card-header"><div className="card-title">{t('settings.language')}</div></div>
        <div className="card-body">
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { value: 'bm', label: 'Bahasa Melayu' },
              { value: 'bi', label: 'English' },
            ].map(lang => (
              <button
                key={lang.value}
                onClick={() => setLanguage(lang.value)}
                className="btn"
                style={{
                  background: language === lang.value ? 'var(--accent)' : 'var(--surface2)',
                  color: language === lang.value ? '#fff' : 'var(--ink2)',
                  border: `1.5px solid ${language === lang.value ? 'var(--accent)' : 'var(--rule)'}`,
                  fontWeight: language === lang.value ? 700 : 600,
                }}
              >
                {lang.label}
                {language === lang.value && ' ✓'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <button className="btn btn-ghost" onClick={handleSignOut}>{t('settings.signOut')}</button>
        </div>
      </div>
    </Layout>
  )
}

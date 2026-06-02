import Layout from '../components/layout/Layout.jsx'
import ThemeSwitcher from '../components/features/settings/ThemeSwitcher.jsx'
import StyleSwitcher from '../components/features/settings/StyleSwitcher.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { useNavigate } from 'react-router-dom'

export default function Settings() {
  const { teacher, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <Layout title="Tetapan" breadcrumb="Akaun & Keutamaan">
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

      <div className="card">
        <div className="card-body">
          <button className="btn btn-ghost" onClick={handleSignOut}>Keluar dari akaun</button>
        </div>
      </div>
    </Layout>
  )
}

import { useNavigate } from 'react-router-dom'
import Layout from '../components/layout/Layout.jsx'
import { useAuth } from '../hooks/useAuth.jsx'

export default function Dashboard() {
  const navigate = useNavigate()
  const { signOut, teacher } = useAuth()

  const today = new Date().toLocaleDateString('ms-MY', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <Layout
      title="Dashboard"
      breadcrumb={`Semua Kelas · ${today}`}
      actions={
        <>
          <button className="btn btn-ghost btn-sm">↗ Laporan</button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/scan')}>◎ Mula Scan</button>
          <button className="btn btn-ghost btn-sm" onClick={handleSignOut}>Keluar</button>
        </>
      }
    >
      <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--ink3)', fontFamily: 'var(--font-body)' }}>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', color: 'var(--ink)', marginBottom: '8px' }}>
          Selamat datang, {teacher?.name?.split(' ')[0] || 'Cikgu'}!
        </div>
        <div style={{ fontSize: '13px' }}>Dashboard akan dibina dalam langkah seterusnya.</div>
      </div>
    </Layout>
  )
}

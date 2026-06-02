import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    if (error) {
      setError('E-mel atau kata laluan tidak sah.')
      setLoading(false)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-mark">BUKU<span>TRACK</span></div>
        <div className="login-heading">Log Masuk</div>
        <div className="login-sub">Portal Cikgu · Sistem Rekod Buku</div>

        {error && (
          <div className="alert alert-warn" style={{ marginBottom: '16px' }}>
            ▲ &nbsp;{error}
          </div>
        )}

        {resetSent && (
          <div className="alert alert-ok" style={{ marginBottom: '16px' }}>
            ✓ &nbsp;E-mel reset kata laluan telah dihantar.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="input-label">E-mel</label>
          <input
            className="input"
            type="email"
            placeholder="cikgu@sekolah.edu.my"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <label className="input-label">Kata Laluan</label>
          <input
            className="input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '13px', letterSpacing: '1px', borderRadius: 'var(--radius-btn)' }}
            disabled={loading}
          >
            {loading ? 'Sedang masuk...' : 'Masuk →'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '11.5px', color: 'var(--ink3)' }}>
          Lupa kata laluan?{' '}
          <ResetPassword email={email} onSent={() => setResetSent(true)} />
        </div>

        <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '11.5px', color: 'var(--ink3)' }}>
          Belum ada akaun?{' '}
          <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>
            Daftar di sini
          </Link>
        </div>
      </div>
    </div>
  )
}

function ResetPassword({ email, onSent }) {
  const [loading, setLoading] = useState(false)

  async function handleReset() {
    if (!email) { alert('Sila masukkan e-mel anda dahulu.'); return }
    setLoading(true)
    const { supabase } = await import('../lib/supabase')
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setLoading(false)
    onSent()
  }

  return (
    <span
      onClick={handleReset}
      style={{ color: 'var(--red)', cursor: 'pointer', fontWeight: 700 }}
    >
      {loading ? 'Menghantar...' : 'Reset'}
    </span>
  )
}

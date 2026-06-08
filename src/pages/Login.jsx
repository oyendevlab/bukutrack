import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import { supabase } from '../lib/supabase'
import BrandLogo from '../components/ui/BrandLogo.jsx'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    if (error) {
      setError('E-mel atau kata laluan tidak sah.')
      setLoading(false)
    } else {
      navigate('/dashboard')
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
    if (error) {
      setError('Gagal log masuk dengan Google.')
      setGoogleLoading(false)
    }
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div style={{ marginBottom: '26px' }}><BrandLogo size="lg" /></div>
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

        {/* Google Sign In */}
        <button
          onClick={handleGoogle}
          disabled={googleLoading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '11px',
            background: 'var(--surface)',
            border: '1.5px solid var(--rule)',
            borderRadius: 'var(--radius-btn)',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 700,
            color: 'var(--ink)',
            fontFamily: 'var(--font-body)',
            marginBottom: '16px',
            transition: 'all 0.15s',
          }}
          onMouseOver={e => e.currentTarget.style.borderColor = 'var(--ink2)'}
          onMouseOut={e => e.currentTarget.style.borderColor = 'var(--rule)'}
        >
          <GoogleIcon />
          {googleLoading ? 'Mengalihkan...' : 'Teruskan dengan Google'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--rule)' }} />
          <span style={{ fontSize: '10px', color: 'var(--ink3)', fontWeight: 700, letterSpacing: '1px' }}>ATAU</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--rule)' }} />
        </div>

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
            style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '13px', letterSpacing: '1px' }}
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
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setLoading(false)
    onSent()
  }

  return (
    <span onClick={handleReset} style={{ color: 'var(--red)', cursor: 'pointer', fontWeight: 700 }}>
      {loading ? 'Menghantar...' : 'Reset'}
    </span>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

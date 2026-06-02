import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'

export default function Register() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', schoolName: '', password: '', confirm: '' })
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function update(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!agreed) { setError('Sila setuju dengan terma privasi untuk meneruskan.'); return }
    if (form.password.length < 6) { setError('Kata laluan mestilah sekurang-kurangnya 6 aksara.'); return }
    if (form.password !== form.confirm) { setError('Kata laluan tidak sepadan.'); return }

    setLoading(true)
    const { error } = await signUp(form.email, form.password, form.name, form.schoolName)
    if (error) {
      setError(error.message === 'User already registered' ? 'E-mel ini sudah didaftarkan.' : error.message)
      setLoading(false)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="login-screen">
      <div className="login-card" style={{ maxWidth: '440px' }}>
        <div className="login-mark">BUKU<span>TRACK</span></div>
        <div className="login-heading">Daftar Akaun</div>
        <div className="login-sub">Portal Cikgu · Sistem Rekod Buku</div>

        {error && (
          <div className="alert alert-warn" style={{ marginBottom: '16px' }}>
            ▲ &nbsp;{error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="input-label">Nama Penuh</label>
          <input
            className="input"
            type="text"
            placeholder="Cikgu Ahmad bin Abdullah"
            value={form.name}
            onChange={e => update('name', e.target.value)}
            required
          />

          <label className="input-label">E-mel</label>
          <input
            className="input"
            type="email"
            placeholder="cikgu@sekolah.edu.my"
            value={form.email}
            onChange={e => update('email', e.target.value)}
            required
          />

          <label className="input-label">Nama Sekolah <span style={{ color: 'var(--ink3)', fontWeight: 400 }}>(pilihan)</span></label>
          <input
            className="input"
            type="text"
            placeholder="SK Taman Maju"
            value={form.schoolName}
            onChange={e => update('schoolName', e.target.value)}
          />

          <label className="input-label">Kata Laluan</label>
          <input
            className="input"
            type="password"
            placeholder="Minimum 6 aksara"
            value={form.password}
            onChange={e => update('password', e.target.value)}
            required
          />

          <label className="input-label">Sahkan Kata Laluan</label>
          <input
            className="input"
            type="password"
            placeholder="Ulang kata laluan"
            value={form.confirm}
            onChange={e => update('confirm', e.target.value)}
            required
          />

          {/* Penafian Privasi — wajib tick */}
          <div
            onClick={() => setAgreed(!agreed)}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: '10px',
              padding: '12px', border: `1.5px solid ${agreed ? 'var(--green)' : 'var(--rule)'}`,
              borderRadius: 'var(--radius-input)', background: agreed ? 'var(--green-bg)' : 'var(--surface2)',
              cursor: 'pointer', marginBottom: '16px', transition: 'all 0.15s',
            }}
          >
            <div style={{
              width: '18px', height: '18px', border: `2px solid ${agreed ? 'var(--green)' : 'var(--ink3)'}`,
              borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, background: agreed ? 'var(--green)' : 'transparent', marginTop: '1px',
              transition: 'all 0.15s',
            }}>
              {agreed && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 800 }}>✓</span>}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--ink2)', lineHeight: 1.5 }}>
              Saya faham dan bersetuju bahawa saya bertanggungjawab memastikan kebenaran ibu bapa/penjaga telah diperoleh berkaitan penggunaan nama murid dalam aplikasi ini, selaras dengan{' '}
              <span style={{ color: 'var(--accent)', fontWeight: 700 }}>PDPA Malaysia</span>.
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: '100%', justifyContent: 'center', padding: '13px',
              fontSize: '13px', letterSpacing: '1px', borderRadius: 'var(--radius-btn)',
              opacity: agreed ? 1 : 0.5,
            }}
            disabled={loading || !agreed}
          >
            {loading ? 'Mendaftar...' : 'Daftar Akaun →'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '11.5px', color: 'var(--ink3)' }}>
          Sudah ada akaun?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>
            Log masuk di sini
          </Link>
        </div>
      </div>
    </div>
  )
}

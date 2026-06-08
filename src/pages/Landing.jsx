import { useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'

/* ─── Design tokens — selaras dengan app blue theme ─ */
const T = {
  canvas:   '#eef1f8',        // --bg blue theme
  surface:  '#ffffff',        // --surface
  accent:   '#6b8fd4',        // --accent
  accentDk: '#4a6fb8',        // darker accent
  accentBg: 'rgba(107,143,212,0.10)', // --accent-bg
  ink:      '#2c3a52',        // --ink
  ink2:     '#6b7fa3',        // --ink2
  ink3:     '#a8b8d0',        // --ink3
  rule:     '#d8e2f0',        // --rule
  surface2: '#e8eef8',        // --surface2 / sidebar-bg inspired
  dark:     '#2c3a52',        // deep pastel navy (--ink) for closing band
  font:     "'Plus Jakarta Sans', system-ui, sans-serif",
  ease:     'cubic-bezier(0.32, 0.72, 0, 1)',
}

const pill = {
  display: 'inline-flex', alignItems: 'center', gap: '6px',
  padding: '4px 12px', borderRadius: '999px',
  background: T.accentBg,
  color: T.accent, fontSize: '10px', fontWeight: 700,
  letterSpacing: '0.18em', textTransform: 'uppercase',
  fontFamily: "'Geist Mono', 'Courier New', monospace",
  border: `1px solid rgba(107,143,212,0.22)`,
}

const bezelOuter = {
  padding: '6px',
  borderRadius: '36px',
  background: T.surface,
  border: `1px solid ${T.rule}`,
  boxShadow: '0 12px 40px -16px rgba(44,58,82,0.10)',
}

const bezelInner = (bg = '#f4f7fc') => ({
  borderRadius: 'calc(36px - 6px)',
  background: bg,
  overflow: 'hidden',
  height: '100%',
})

const MARQUEE = [
  '📷 Scan QR Murid', '📊 Jadual Matriks', '🏫 Multi-Kelas',
  '🖨️ Cetak Kad QR', '📱 Boleh Install', '🔒 Data Selamat',
  '✓ Percuma Selamanya', '⚡ Pantas & Ringan', '📋 Rekod Lengkap',
]

export default function Landing() {
  const { user } = useAuth()
  const navigate  = useNavigate()

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true })
  }, [user, navigate])

  useEffect(() => {
    const ids   = ['pjs-font', 'geist-font']
    const hrefs = [
      'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap',
      'https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&display=swap',
    ]
    hrefs.forEach((href, i) => {
      if (!document.getElementById(ids[i])) {
        const l = Object.assign(document.createElement('link'), { id: ids[i], rel: 'stylesheet', href })
        document.head.appendChild(l)
      }
    })
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity    = '1'
          e.target.style.transform  = 'none'
          e.target.style.filter     = 'none'
        }
      }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('[data-fade]').forEach(el => {
      el.style.opacity    = '0'
      el.style.transform  = 'translateY(20px)'
      el.style.filter     = 'blur(6px)'
      el.style.transition = `opacity 700ms ${T.ease}, transform 700ms ${T.ease}, filter 700ms ${T.ease}`
      obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  return (
    <div style={{ fontFamily: T.font, background: T.canvas, color: T.ink, overflowX: 'hidden' }}>

      {/* ── FLOATING NAVBAR ───────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: '16px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 100, display: 'flex', alignItems: 'center', gap: '8px',
        padding: '8px 8px 8px 20px', borderRadius: '999px',
        background: 'rgba(226,234,244,0.92)', backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${T.rule}`,
        boxShadow: '0 4px 24px -4px rgba(44,58,82,0.10)',
        width: 'clamp(300px, 90vw, 640px)',
      }}>
        <span style={{ fontSize: '17px', fontWeight: 800, letterSpacing: '1px', flex: 1, fontFamily: 'var(--font-heading, inherit)' }}>
          📚 <span style={{ color: T.ink }}>BUKU</span><span style={{ color: T.accent }}>TRACK</span>
        </span>
        <Link to="/login" style={{
          padding: '8px 16px', borderRadius: '999px', fontSize: '13px',
          fontWeight: 600, color: T.ink2, textDecoration: 'none',
          transition: `color 300ms ${T.ease}`,
        }}
          onMouseOver={e => e.currentTarget.style.color = T.ink}
          onMouseOut={e => e.currentTarget.style.color = T.ink2}
        >Log Masuk</Link>
        <Link to="/register" style={{
          padding: '10px 20px', borderRadius: '999px', fontSize: '13px',
          fontWeight: 700, background: T.accent, color: '#fff', textDecoration: 'none',
          transition: `transform 300ms ${T.ease}, background 300ms ${T.ease}`,
          display: 'flex', alignItems: 'center', gap: '6px',
          boxShadow: '0 2px 12px -2px rgba(107,143,212,0.4)',
        }}
          onMouseOver={e => { e.currentTarget.style.background = T.accentDk; e.currentTarget.style.transform = 'scale(0.98)' }}
          onMouseOut={e => { e.currentTarget.style.background = T.accent; e.currentTarget.style.transform = 'scale(1)' }}
        >
          Daftar Percuma
          <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>→</span>
        </Link>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{
        minHeight: '100dvh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(100px, 14vw, 160px) clamp(20px, 6vw, 80px) 80px',
        position: 'relative', textAlign: 'center',
      }}>
        {/* Ambient blob — warna pastel login-bg */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
          <div style={{
            position: 'absolute', top: '20%', left: '30%',
            width: 'min(500px, 70vw)', height: 'min(500px, 70vw)', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(220,232,245,0.7) 0%, transparent 70%)',
            filter: 'blur(48px)', animation: 'blobDrift 22s ease-in-out infinite alternate',
          }} />
          <div style={{
            position: 'absolute', top: '30%', right: '20%',
            width: 'min(400px, 55vw)', height: 'min(400px, 55vw)', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(232,226,245,0.6) 0%, transparent 70%)',
            filter: 'blur(56px)', animation: 'blobDrift 28s ease-in-out infinite alternate-reverse',
          }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '840px' }}>
          <div style={{ ...pill, marginBottom: '24px' }}>
            ✦ SISTEM REKOD BUKU · PERCUMA SELAMANYA
          </div>

          <h1 style={{
            fontSize: 'clamp(44px, 7.5vw, 88px)',
            fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 0.96,
            color: T.ink, marginBottom: '28px',
          }}>
            Rekod Buku<br />
            <span style={{ color: T.accent }}>Murid</span> Lebih<br />
            Pantas
          </h1>

          <p style={{
            fontSize: 'clamp(15px, 1.8vw, 17px)', color: T.ink2, lineHeight: 1.8,
            maxWidth: '52ch', margin: '0 auto 40px', fontWeight: 500,
          }}>
            BukuTrack membantu cikgu rekod semakan buku teks dan buku kerja murid
            dalam masa beberapa saat — guna kamera telefon, tanpa kertas, tanpa kira-kira manual.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {/* Primary CTA — pastel accent */}
            <Link to="/register" style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '14px 14px 14px 24px', borderRadius: '999px',
              background: T.accent, color: '#fff', textDecoration: 'none',
              fontSize: '15px', fontWeight: 700,
              transition: `transform 300ms ${T.ease}`,
              boxShadow: '0 8px 24px -8px rgba(107,143,212,0.5)',
            }}
              onMouseOver={e => { e.currentTarget.style.transform = 'scale(0.98)'; e.currentTarget.style.background = T.accentDk }}
              onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = T.accent }}
            >
              Mula Guna Percuma
              <span style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.22)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>→</span>
            </Link>
            {/* Ghost CTA */}
            <a href="#cara-guna" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 24px', borderRadius: '999px', fontSize: '15px',
              fontWeight: 600, color: T.ink2, textDecoration: 'none',
              border: `1px solid ${T.rule}`, background: 'rgba(255,255,255,0.7)',
              transition: `all 300ms ${T.ease}`,
            }}
              onMouseOver={e => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.color = T.ink }}
              onMouseOut={e => { e.currentTarget.style.borderColor = T.rule; e.currentTarget.style.color = T.ink2 }}
            >
              Lihat Cara Kerja ↓
            </a>
          </div>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '48px' }}>
            {['✓ Percuma Selamanya', '✓ Tiada Iklan', '✓ Data Selamat', '✓ Tiada Had Murid'].map(t => (
              <span key={t} style={{ padding: '6px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, color: T.ink2, background: T.surface, border: `1px solid ${T.rule}` }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARQUEE ──────────────────────────────────────────── */}
      <div style={{ overflow: 'hidden', borderTop: `1px solid ${T.rule}`, borderBottom: `1px solid ${T.rule}`, padding: '16px 0', background: T.surface }}>
        <div style={{ display: 'flex', animation: 'marquee 30s linear infinite', whiteSpace: 'nowrap' }}>
          {[...MARQUEE, ...MARQUEE].map((item, i) => (
            <span key={i} style={{ padding: '0 32px', fontSize: '13px', fontWeight: 600, color: T.ink3, flexShrink: 0 }}>{item}</span>
          ))}
        </div>
      </div>

      {/* ── BENTO GRID ───────────────────────────────────────── */}
      <section style={{ padding: 'clamp(80px, 10vw, 120px) clamp(20px, 6vw, 80px)' }}>
        <div data-fade style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{ ...pill, marginBottom: '16px' }}>CIRI-CIRI</div>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05 }}>
            Semua yang cikgu perlukan
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', maxWidth: '1100px', margin: '0 auto' }}>

          {/* Wide — Scan QR */}
          <div data-fade style={{ ...bezelOuter, gridColumn: 'span 2' }}>
            <div style={{ ...bezelInner('linear-gradient(135deg, #dce8f5 0%, #e8eef8 100%)'), padding: '40px', minHeight: '220px' }}>
              <div style={{ fontSize: '40px', marginBottom: '14px' }}>📷</div>
              <div style={{ ...pill, marginBottom: '12px' }}>FUNGSI UTAMA</div>
              <h3 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.02em', color: T.ink, marginBottom: '10px' }}>Scan QR Murid</h3>
              <p style={{ fontSize: '14px', color: T.ink2, lineHeight: 1.7, maxWidth: '38ch' }}>
                Imbas kad QR murid menggunakan kamera telefon. Rekod tersimpan serta-merta — tiada perlu taip atau tulis tangan.
              </p>
            </div>
          </div>

          {/* Tall — Matriks */}
          <div data-fade style={{ ...bezelOuter, gridRow: 'span 2' }}>
            <div style={{ ...bezelInner('linear-gradient(160deg, #e8e2f5 0%, #eeeaf8 100%)'), padding: '36px', minHeight: '460px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '36px', marginBottom: '14px' }}>📊</div>
              <div style={{ ...pill, marginBottom: '12px' }}>PAPARAN DATA</div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em', color: T.ink, marginBottom: '10px' }}>Jadual Matriks</h3>
              <p style={{ fontSize: '13px', color: T.ink2, lineHeight: 1.7, marginBottom: '24px' }}>
                Lihat rekod semua murid dan semua sesi dalam satu jadual — siapa hadir, siapa tidak, pada tarikh bila.
              </p>
              <div style={{ marginTop: 'auto', background: 'rgba(255,255,255,0.9)', borderRadius: '16px', padding: '16px', border: `1px solid ${T.rule}` }}>
                {[['Ahmad', '✓', '✓', '✗'], ['Amirah', '✓', '✓', '✓'], ['Danish', '✗', '✓', '✓']].map(([name, ...cells]) => (
                  <div key={name} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: T.ink2, width: '52px' }}>{name}</span>
                    {cells.map((c, i) => (
                      <span key={i} style={{ width: '24px', height: '24px', borderRadius: '50%', fontSize: '11px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: c === '✓' ? 'rgba(74,148,112,0.14)' : 'rgba(192,96,122,0.12)', color: c === '✓' ? '#4a9470' : '#c0607a' }}>{c}</span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Small — Multi-kelas */}
          <div data-fade style={{ ...bezelOuter }}>
            <div style={{ ...bezelInner('linear-gradient(135deg, #ddf0ea 0%, #e8f5f0 100%)'), padding: '32px', minHeight: '200px' }}>
              <div style={{ fontSize: '34px', marginBottom: '12px' }}>🏫</div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, letterSpacing: '-0.02em', color: T.ink, marginBottom: '8px' }}>Urus Berbilang Kelas</h3>
              <p style={{ fontSize: '13px', color: T.ink2, lineHeight: 1.6 }}>Tambah kelas, murid dan buku tanpa had. Semua tersusun kemas.</p>
            </div>
          </div>

          {/* Small — Cetak QR */}
          <div data-fade style={{ ...bezelOuter }}>
            <div style={{ ...bezelInner('linear-gradient(135deg, #f0eefc 0%, #eae8f8 100%)'), padding: '32px', minHeight: '200px' }}>
              <div style={{ fontSize: '34px', marginBottom: '12px' }}>🖨️</div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, letterSpacing: '-0.02em', color: T.ink, marginBottom: '8px' }}>Cetak Kad QR</h3>
              <p style={{ fontSize: '13px', color: T.ink2, lineHeight: 1.6 }}>Jana dan cetak kad QR unik untuk setiap murid secara automatik.</p>
            </div>
          </div>

        </div>
      </section>

      {/* ── CARA GUNA ────────────────────────────────────────── */}
      <section id="cara-guna" style={{ padding: 'clamp(80px, 10vw, 120px) clamp(20px, 6vw, 80px)', background: T.surface }}>
        <div data-fade style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{ ...pill, marginBottom: '16px' }}>CARA GUNA</div>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05, color: T.ink }}>
            Mulakan dalam<br />3 langkah mudah
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', maxWidth: '900px', margin: '0 auto' }}>
          {[
            { n: '01', icon: '👤', title: 'Daftar & Tambah Kelas', desc: 'Cipta akaun percuma dalam 1 minit. Tambah kelas, senarai murid dan buku kerja yang perlu disemak.' },
            { n: '02', icon: '🖨️', title: 'Cetak Kad QR Murid',  desc: 'Jana kad QR unik untuk setiap murid secara automatik. Cetak dan tampal pada buku atau fail murid.' },
            { n: '03', icon: '📷', title: 'Scan & Rekod Selesai', desc: 'Buka kamera dalam BukuTrack, imbas QR murid — rekod tersimpan serta-merta tanpa perlu taip.' },
          ].map(({ n, icon, title, desc }) => (
            <div key={n} data-fade style={{ ...bezelOuter }}>
              <div style={{ ...bezelInner(T.canvas), padding: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, fontFamily: "'Geist Mono', monospace", color: T.accent, letterSpacing: '0.1em' }}>{n}</span>
                  <div style={{ flex: 1, height: '1px', background: T.rule }} />
                  <span style={{ fontSize: '26px' }}>{icon}</span>
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, letterSpacing: '-0.02em', color: T.ink, marginBottom: '10px' }}>{title}</h3>
                <p style={{ fontSize: '13px', color: T.ink2, lineHeight: 1.7 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PERCUMA SELAMANYA ─────────────────────────────────── */}
      <section style={{ padding: 'clamp(80px, 10vw, 120px) clamp(20px, 6vw, 80px)', background: T.canvas }}>
        <div data-fade style={{ ...bezelOuter, maxWidth: '780px', margin: '0 auto' }}>
          <div style={{ ...bezelInner('linear-gradient(135deg, #dce8f5 0%, #e8e2f5 50%, #ddf0ea 100%)'), padding: 'clamp(40px, 6vw, 64px)', textAlign: 'center' }}>
            <div style={{ fontSize: '44px', marginBottom: '16px' }}>♥</div>
            <div style={{ ...pill, marginBottom: '20px', justifyContent: 'center' }}>KOMITMEN KAMI</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.03em', color: T.ink, marginBottom: '16px', lineHeight: 1.1 }}>
              Tiada bayaran.<br />Tiada helah.
            </h2>
            <p style={{ fontSize: '15px', color: T.ink2, lineHeight: 1.8, maxWidth: '48ch', margin: '0 auto 32px' }}>
              BukuTrack dibina oleh pembangun tempatan untuk membantu cikgu-cikgu Malaysia.
              Kami percaya alat yang baik patut dapat digunakan oleh semua orang — tanpa langganan, tanpa iklan.
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {['✓ Percuma', '✓ Tiada Iklan', '✓ Tiada Had Murid', '✓ Data Tidak Dijual'].map(t => (
                <span key={t} style={{ padding: '8px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: 600, color: T.accentDk, background: 'rgba(255,255,255,0.85)', border: `1px solid ${T.rule}` }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BAND — pastel deep navy ──────────────────────── */}
      <section style={{ background: T.dark, padding: 'clamp(80px, 10vw, 120px) clamp(20px, 6vw, 80px)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '400px', borderRadius: '50%', background: `radial-gradient(circle, rgba(107,143,212,0.2) 0%, transparent 70%)`, filter: 'blur(48px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ ...pill, background: 'rgba(107,143,212,0.18)', border: '1px solid rgba(107,143,212,0.3)', color: '#a0b8e8', marginBottom: '24px', justifyContent: 'center' }}>
            SEDIA UNTUK MULAKAN?
          </div>
          <h2 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 800, letterSpacing: '-0.035em', color: '#fff', marginBottom: '16px', lineHeight: 1.05 }}>
            Daftar dalam<br />masa 1 minit
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.55)', margin: '0 auto 40px', maxWidth: '40ch', lineHeight: 1.7 }}>
            Mula rekod buku murid anda hari ini — percuma selamanya.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 14px 14px 24px', borderRadius: '999px', background: T.accent, color: '#fff', fontSize: '15px', fontWeight: 700, textDecoration: 'none', transition: `all 300ms ${T.ease}`, boxShadow: '0 8px 32px -8px rgba(107,143,212,0.5)' }}
              onMouseOver={e => { e.currentTarget.style.transform = 'scale(0.98)'; e.currentTarget.style.background = T.accentDk }}
              onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = T.accent }}
            >
              Daftar Sekarang — Percuma
              <span style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.22)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>→</span>
            </Link>
            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', padding: '14px 24px', borderRadius: '999px', fontSize: '15px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.2)', textDecoration: 'none', transition: `all 300ms ${T.ease}` }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; e.currentTarget.style.color = '#fff' }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
            >
              Sudah ada akaun? Log masuk →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer style={{ background: T.dark, borderTop: '1px solid rgba(107,143,212,0.15)', padding: '24px clamp(20px, 6vw, 80px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ fontSize: '11px', fontFamily: "'Geist Mono', monospace", color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em' }}>
            © 2026 BUKUTRACK · OYENDEVLAB
          </span>
          <div style={{ display: 'flex', gap: '20px' }}>
            {[['Privasi', '/settings/privacy'], ['Log Masuk', '/login'], ['Daftar', '/register']].map(([label, to]) => (
              <Link key={to} to={to} style={{ fontSize: '11px', fontFamily: "'Geist Mono', monospace", color: 'rgba(255,255,255,0.35)', textDecoration: 'none', letterSpacing: '0.05em', transition: `color 300ms ${T.ease}` }}
                onMouseOver={e => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
                onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
              >{label}</Link>
            ))}
          </div>
        </div>
      </footer>

      {/* ── KEYFRAMES ────────────────────────────────────────── */}
      <style>{`
        @keyframes blobDrift {
          0%   { transform: translateX(-50%) translateY(0px) scale(1); }
          50%  { transform: translateX(-50%) translateY(-28px) scale(1.06); }
          100% { transform: translateX(-50%) translateY(12px) scale(0.96); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (max-width: 768px) {
          .bento-wide { grid-column: span 1 !important; }
          .bento-tall { grid-row: span 1 !important; }
        }
      `}</style>
    </div>
  )
}

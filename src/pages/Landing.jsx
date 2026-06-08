import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'

/* ─── Design tokens ─────────────────────────────────────── */
const T = {
  canvas:   '#edf1f9',
  surface:  '#ffffff',
  accent:   '#3d70d6',        // vibrant blue — bukan pastel
  accentDk: '#2a58c2',
  accentBg: 'rgba(61,112,214,0.10)',
  green:    '#2ea87a',        // ceria green — brand colour kedua
  greenDk:  '#1f8a61',
  greenBg:  'rgba(46,168,122,0.10)',
  warm:     '#d4924e',
  warmDk:   '#b8763a',
  warmBg:   'rgba(212,146,78,0.10)',
  ink:      '#1e2d45',
  ink2:     '#5a6f8f',
  ink3:     '#9aaec8',
  rule:     '#d4dff0',
  dark:     '#111b2e',        // dark band sebenar — jauh lebih gelap dari teks
  display:  "'Bricolage Grotesque', system-ui, sans-serif",
  body:     "'Manrope', system-ui, sans-serif",
  mono:     "'Geist Mono', 'Courier New', monospace",
  ease:     'cubic-bezier(0.32, 0.72, 0, 1)',
}

const pill = (color = T.accent, bg = T.accentBg, border = 'rgba(61,112,214,0.22)') => ({
  display: 'inline-flex', alignItems: 'center', gap: '6px',
  padding: '4px 12px', borderRadius: '999px',
  background: bg, color, fontSize: '10px', fontWeight: 700,
  letterSpacing: '0.18em', textTransform: 'uppercase',
  fontFamily: T.mono, border: `1px solid ${border}`,
})

const bezelOuter = {
  padding: '6px', borderRadius: '36px',
  background: T.surface, border: `1px solid ${T.rule}`,
  boxShadow: '0 16px 48px -16px rgba(30,45,70,0.14)',
}

const bezelInner = (bg = '#f4f7fc') => ({
  borderRadius: 'calc(36px - 6px)', background: bg,
  overflow: 'hidden', height: '100%',
})

/* ─── Phone Mockup ───────────────────────────────────────── */
function PhoneMockup() {
  return (
    <div style={{
      width: 'clamp(180px, 24vw, 264px)',
      aspectRatio: '9/18',
      background: T.dark,
      borderRadius: '36px',
      padding: '7px',
      boxShadow: '0 32px 80px -16px rgba(17,27,46,0.55), 0 0 0 1px rgba(255,255,255,0.07)',
      flexShrink: 0,
    }}>
      <div style={{
        background: '#f0f4fb', borderRadius: '30px',
        height: '100%', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Status bar */}
        <div style={{ background: T.accent, padding: '10px 14px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: '10px', color: '#fff', letterSpacing: '0.4px' }}>📚 BukuTrack</span>
          <span style={{ fontFamily: T.mono, fontSize: '8px', color: 'rgba(255,255,255,0.65)' }}>9:41</span>
        </div>
        {/* Scan screen */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '14px', gap: '10px' }}>
          <p style={{ fontFamily: T.body, fontSize: '8px', fontWeight: 600, color: T.ink2, margin: 0 }}>Imbas Kad QR Murid</p>
          {/* Viewfinder */}
          <div style={{ width: '90px', height: '90px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {[
              { top: 0, left: 0, borderTop: `2px solid ${T.accent}`, borderLeft: `2px solid ${T.accent}` },
              { top: 0, right: 0, borderTop: `2px solid ${T.accent}`, borderRight: `2px solid ${T.accent}` },
              { bottom: 0, left: 0, borderBottom: `2px solid ${T.accent}`, borderLeft: `2px solid ${T.accent}` },
              { bottom: 0, right: 0, borderBottom: `2px solid ${T.accent}`, borderRight: `2px solid ${T.accent}` },
            ].map((s, i) => (
              <div key={i} style={{ position: 'absolute', width: '14px', height: '14px', borderRadius: '2px', ...s }} />
            ))}
            <div className="scan-line" style={{
              position: 'absolute', left: '6px', right: '6px', height: '1px',
              background: `linear-gradient(90deg, transparent, ${T.accent}, transparent)`,
            }} />
            {/* QR dots decorative */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '3px' }}>
              {Array.from({ length: 25 }).map((_, i) => {
                const on = [0,1,2,5,7,10,12,14,17,22,23,24,6,8,16,18].includes(i)
                return <div key={i} style={{ width: '6px', height: '6px', borderRadius: '1px', background: on ? T.ink : 'transparent' }} />
              })}
            </div>
          </div>
          {/* Murid card */}
          <div style={{ width: '100%', background: '#fff', borderRadius: '10px', padding: '7px 9px', border: `1px solid ${T.rule}`, display: 'flex', alignItems: 'center', gap: '7px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: T.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', flexShrink: 0 }}>👤</div>
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontFamily: T.body, fontSize: '7px', fontWeight: 700, color: T.ink }}>Ahmad Danial</p>
              <p style={{ margin: 0, fontFamily: T.mono, fontSize: '6px', color: T.ink3 }}>4 Amanah · #007</p>
            </div>
            <div style={{ marginLeft: 'auto', width: '16px', height: '16px', borderRadius: '50%', background: T.greenBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', color: T.green, fontWeight: 800, flexShrink: 0 }}>✓</div>
          </div>
          <div style={{ width: '100%', background: T.green, borderRadius: '9px', padding: '6px', textAlign: 'center' }}>
            <p style={{ margin: 0, fontFamily: T.body, fontSize: '7px', fontWeight: 700, color: '#fff' }}>✓ Rekod Disimpan</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Landing() {
  const { user }  = useAuth()
  const navigate  = useNavigate()

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true })
  }, [user, navigate])

  /* Load fonts */
  useEffect(() => {
    const fonts = [
      { id: 'bricolage-font', href: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,700;12..96,800&display=swap' },
      { id: 'manrope-font',   href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap' },
      { id: 'geist-font',     href: 'https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&display=swap' },
    ]
    fonts.forEach(({ id, href }) => {
      if (!document.getElementById(id)) {
        const l = Object.assign(document.createElement('link'), { id, rel: 'stylesheet', href })
        document.head.appendChild(l)
      }
    })
  }, [])

  /* Fade-in on scroll — respects prefers-reduced-motion */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity   = '1'
          e.target.style.transform = 'none'
          e.target.style.filter    = 'none'
        }
      }),
      { threshold: 0.08 }
    )
    document.querySelectorAll('[data-fade]').forEach(el => {
      el.style.opacity    = '0'
      el.style.transform  = 'translateY(22px)'
      el.style.filter     = 'blur(6px)'
      el.style.transition = `opacity 700ms ${T.ease}, transform 700ms ${T.ease}, filter 700ms ${T.ease}`
      obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  return (
    <div style={{ fontFamily: T.body, background: T.canvas, color: T.ink, overflowX: 'hidden' }}>

      {/* ── FLOATING NAVBAR ───────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: '16px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 100, display: 'flex', alignItems: 'center', gap: '8px',
        padding: '8px 8px 8px 20px', borderRadius: '999px',
        background: 'rgba(226,234,244,0.92)', backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${T.rule}`,
        boxShadow: '0 4px 24px -4px rgba(17,27,46,0.12)',
        width: 'clamp(300px, 90vw, 640px)',
      }}>
        <span style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '0.5px', flex: 1, fontFamily: T.display }}>
          📚 <span style={{ color: T.ink }}>BUKU</span><span style={{ color: T.accent }}>TRACK</span>
        </span>
        <Link to="/login" className="nav-ghost">Log Masuk</Link>
        <Link to="/register" className="nav-cta">
          Daftar Percuma
          <span className="btn-circle">→</span>
        </Link>
      </nav>

      {/* ── HERO — asymmetric, phone mockup kanan ─────────────── */}
      <section style={{
        minHeight: '100dvh',
        display: 'flex', alignItems: 'center',
        padding: 'clamp(110px, 14vw, 160px) clamp(20px, 6vw, 80px) 80px',
        position: 'relative',
        gap: 'clamp(40px, 6vw, 80px)',
        maxWidth: '1200px', margin: '0 auto',
      }}>
        {/* Ambient blobs */}
        <div aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <div className="blob blob-blue" />
          <div className="blob blob-amber" />
        </div>

        {/* Left — text */}
        <div style={{ position: 'relative', zIndex: 1, flex: '1 1 400px', minWidth: 0 }}>
          <div style={{ ...pill(), marginBottom: '28px' }}>
            ✦ SISTEM REKOD BUKU · PERCUMA SELAMANYA
          </div>
          <h1 style={{
            fontFamily: T.display,
            fontSize: 'clamp(48px, 7vw, 84px)',
            fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.95,
            color: T.ink, marginBottom: '28px',
          }}>
            Rekod Buku<br />
            Murid <span style={{ color: T.accent }}>Lebih</span><br />
            <span style={{ color: T.green }}>Pantas.</span>
          </h1>
          <p style={{
            fontSize: 'clamp(15px, 1.8vw, 17px)', color: T.ink2, lineHeight: 1.8,
            maxWidth: '46ch', marginBottom: '40px', fontWeight: 500,
          }}>
            BukuTrack membantu cikgu rekod semakan buku teks dan buku kerja
            dalam beberapa saat — scan QR, tanpa kertas, tanpa kira-kira manual.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '36px' }}>
            <Link to="/register" className="cta-primary">
              Mula Guna Percuma
              <span className="btn-circle">→</span>
            </Link>
            <a href="#cara-guna" className="cta-ghost">
              Lihat Cara Kerja ↓
            </a>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['✓ Percuma Selamanya', '✓ Tiada Iklan', '✓ Data Selamat', '✓ Tiada Had Murid'].map(t => (
              <span key={t} style={{
                padding: '5px 12px', borderRadius: '999px',
                fontSize: '11px', fontWeight: 600, color: T.ink2,
                background: T.surface, border: `1px solid ${T.rule}`,
              }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Right — phone mockup */}
        <div style={{ position: 'relative', zIndex: 1, flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div aria-hidden="true" style={{
            position: 'absolute',
            width: 'min(320px, 45vw)', height: 'min(320px, 45vw)',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${T.accentBg} 0%, transparent 70%)`,
            filter: 'blur(32px)', pointerEvents: 'none',
          }} />
          <PhoneMockup />
        </div>
      </section>

      {/* ── BENTO GRID ───────────────────────────────────────── */}
      <section style={{ padding: 'clamp(80px, 10vw, 120px) clamp(20px, 6vw, 80px)' }}>
        <div data-fade style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{ ...pill(), marginBottom: '16px' }}>CIRI-CIRI</div>
          <h2 style={{ fontFamily: T.display, fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05 }}>
            Semua yang cikgu perlukan
          </h2>
        </div>

        <div className="bento-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', maxWidth: '1100px', margin: '0 auto' }}>

          <div data-fade style={{ ...bezelOuter, gridColumn: 'span 2' }} className="bento-wide">
            <div style={{ ...bezelInner('linear-gradient(135deg, #d4e5f8 0%, #e2ecf8 100%)'), padding: '40px', minHeight: '220px' }}>
              <div style={{ fontSize: '40px', marginBottom: '14px' }}>📷</div>
              <div style={{ ...pill(), marginBottom: '12px' }}>FUNGSI UTAMA</div>
              <h3 style={{ fontFamily: T.display, fontSize: '22px', fontWeight: 800, letterSpacing: '-0.02em', color: T.ink, marginBottom: '10px' }}>Scan QR Murid</h3>
              <p style={{ fontSize: '14px', color: T.ink2, lineHeight: 1.7, maxWidth: '38ch' }}>
                Imbas kad QR murid menggunakan kamera telefon. Rekod tersimpan serta-merta — tiada perlu taip atau tulis tangan.
              </p>
            </div>
          </div>

          <div data-fade style={{ ...bezelOuter, gridRow: 'span 2' }} className="bento-tall">
            <div style={{ ...bezelInner('linear-gradient(160deg, #e2ddf5 0%, #ece8f8 100%)'), padding: '36px', minHeight: '460px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '36px', marginBottom: '14px' }}>📊</div>
              <div style={{ ...pill(), marginBottom: '12px' }}>PAPARAN DATA</div>
              <h3 style={{ fontFamily: T.display, fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em', color: T.ink, marginBottom: '10px' }}>Jadual Matriks</h3>
              <p style={{ fontSize: '13px', color: T.ink2, lineHeight: 1.7, marginBottom: '24px' }}>
                Lihat rekod semua murid dan semua sesi dalam satu jadual — siapa hadir, siapa tidak, pada tarikh bila.
              </p>
              <div style={{ marginTop: 'auto', background: 'rgba(255,255,255,0.9)', borderRadius: '16px', padding: '16px', border: `1px solid ${T.rule}` }}>
                {[['Ahmad', '✓', '✓', '✗'], ['Amirah', '✓', '✓', '✓'], ['Danish', '✗', '✓', '✓']].map(([name, ...cells]) => (
                  <div key={name} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: T.ink2, width: '52px' }}>{name}</span>
                    {cells.map((c, i) => (
                      <span key={i} style={{
                        width: '24px', height: '24px', borderRadius: '50%', fontSize: '11px', fontWeight: 800,
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        background: c === '✓' ? T.greenBg : 'rgba(192,96,122,0.12)',
                        color: c === '✓' ? T.green : '#c0607a',
                      }}>{c}</span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div data-fade style={{ ...bezelOuter }}>
            <div style={{ ...bezelInner('linear-gradient(135deg, #fdebd8 0%, #f9e0c4 100%)'), padding: '32px', minHeight: '200px' }}>
              <div style={{ fontSize: '34px', marginBottom: '12px' }}>🏫</div>
              <h3 style={{ fontFamily: T.display, fontSize: '17px', fontWeight: 800, letterSpacing: '-0.02em', color: T.ink, marginBottom: '8px' }}>Urus Berbilang Kelas</h3>
              <p style={{ fontSize: '13px', color: T.ink2, lineHeight: 1.6 }}>Tambah kelas, murid dan buku tanpa had. Semua tersusun kemas.</p>
            </div>
          </div>

          <div data-fade style={{ ...bezelOuter }}>
            <div style={{ ...bezelInner('linear-gradient(135deg, #d4f0e6 0%, #e0f5ee 100%)'), padding: '32px', minHeight: '200px' }}>
              <div style={{ fontSize: '34px', marginBottom: '12px' }}>🖨️</div>
              <h3 style={{ fontFamily: T.display, fontSize: '17px', fontWeight: 800, letterSpacing: '-0.02em', color: T.ink, marginBottom: '8px' }}>Cetak Kad QR</h3>
              <p style={{ fontSize: '13px', color: T.ink2, lineHeight: 1.6 }}>Jana dan cetak kad QR unik untuk setiap murid secara automatik.</p>
            </div>
          </div>

        </div>
      </section>

      {/* ── CARA GUNA — numbered step-by-step visual ─────────── */}
      <section id="cara-guna" style={{ padding: 'clamp(80px, 10vw, 120px) clamp(20px, 6vw, 80px)', background: T.surface }}>
        <div data-fade style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{ ...pill(), marginBottom: '16px' }}>CARA GUNA</div>
          <h2 style={{ fontFamily: T.display, fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05, color: T.ink }}>
            Mulakan dalam<br />3 langkah mudah
          </h2>
        </div>

        <div style={{ maxWidth: '760px', margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
          {[
            { n: '01', icon: '👤', title: 'Daftar & Tambah Kelas', desc: 'Cipta akaun percuma dalam 1 minit. Tambah kelas, senarai murid dan buku kerja yang perlu disemak.', color: T.accent, bg: T.accentBg, border: 'rgba(61,112,214,0.3)' },
            { n: '02', icon: '🖨️', title: 'Cetak Kad QR Murid',  desc: 'Jana kad QR unik untuk setiap murid secara automatik. Cetak dan tampal pada buku atau fail murid.', color: T.warm, bg: T.warmBg, border: 'rgba(212,146,78,0.3)' },
            { n: '03', icon: '📷', title: 'Scan & Rekod Selesai', desc: 'Buka kamera dalam BukuTrack, imbas QR murid — rekod tersimpan serta-merta tanpa perlu taip.', color: T.green, bg: T.greenBg, border: 'rgba(46,168,122,0.3)' },
          ].map(({ n, icon, title, desc, color, bg, border }, idx, arr) => (
            <div key={n} data-fade style={{ display: 'flex', gap: '24px' }}>
              {/* Number column + connector */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '50%',
                  background: bg, border: `2px solid ${border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: T.mono, fontSize: '12px', fontWeight: 700, color,
                  flexShrink: 0, zIndex: 1,
                }}>{n}</div>
                {idx < arr.length - 1 && (
                  <div style={{ width: '2px', flex: 1, background: T.rule, minHeight: '36px', margin: '4px 0' }} />
                )}
              </div>
              {/* Content */}
              <div style={{ paddingBottom: idx < arr.length - 1 ? '44px' : 0, paddingTop: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '22px' }}>{icon}</span>
                  <h3 style={{ fontFamily: T.display, fontSize: '19px', fontWeight: 800, letterSpacing: '-0.02em', color: T.ink, margin: 0 }}>{title}</h3>
                </div>
                <p style={{ fontSize: '14px', color: T.ink2, lineHeight: 1.75, margin: 0, maxWidth: '50ch' }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PERCUMA SELAMANYA — statement typography besar ────── */}
      <section style={{ padding: 'clamp(100px, 12vw, 160px) clamp(20px, 6vw, 80px)', background: T.canvas, position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{
          position: 'absolute', top: '10%', right: '-8%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: `radial-gradient(circle, ${T.warmBg} 0%, transparent 70%)`,
          filter: 'blur(64px)', pointerEvents: 'none',
        }} />
        <div data-fade style={{ maxWidth: '860px', position: 'relative', zIndex: 1 }}>
          <div style={{ ...pill(T.warm, T.warmBg, 'rgba(212,146,78,0.25)'), marginBottom: '32px' }}>♥ KOMITMEN KAMI</div>
          <h2 style={{
            fontFamily: T.display,
            fontSize: 'clamp(56px, 9.5vw, 120px)',
            fontWeight: 800, letterSpacing: '-0.045em', lineHeight: 0.9,
            color: T.ink, marginBottom: '44px',
          }}>
            Percuma.<br />
            <span style={{ color: T.warm }}>Selamanya.</span><br />
            <span style={{ color: T.green, fontSize: '0.72em' }}>Tanpa Syarat.</span>
          </h2>
          <p style={{ fontSize: 'clamp(15px, 1.8vw, 17px)', color: T.ink2, lineHeight: 1.8, maxWidth: '52ch', marginBottom: '36px', fontWeight: 500 }}>
            BukuTrack dibina khusus untuk cikgu-cikgu Malaysia — tanpa langganan bulanan,
            tanpa iklan mengganggu, tanpa data dijual. Setiap cikgu berhak mendapat
            alat terbaik, tanpa perlu bayar satu sen pun.
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {['✓ Percuma', '✓ Tiada Iklan', '✓ Tiada Had Murid', '✓ Data Tidak Dijual'].map(t => (
              <span key={t} style={{
                padding: '9px 18px', borderRadius: '999px', fontSize: '13px',
                fontWeight: 600, color: T.warmDk,
                background: T.surface, border: `1px solid rgba(212,146,78,0.3)`,
              }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BAND — dark navy sebenar ─────────────────────── */}
      <section style={{ background: T.dark, padding: 'clamp(80px, 10vw, 120px) clamp(20px, 6vw, 80px)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: '20%', left: '15%', width: '400px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(61,112,214,0.18) 0%, transparent 70%)', filter: 'blur(48px)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', bottom: '20%', right: '10%', width: '300px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(46,168,122,0.12) 0%, transparent 70%)', filter: 'blur(48px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ ...pill('#8aabe0', 'rgba(61,112,214,0.18)', 'rgba(61,112,214,0.32)'), marginBottom: '24px', justifyContent: 'center' }}>
            SEDIA UNTUK MULAKAN?
          </div>
          <h2 style={{ fontFamily: T.display, fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', marginBottom: '16px', lineHeight: 1.0 }}>
            Daftar dalam<br />masa 1 minit
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', margin: '0 auto 40px', maxWidth: '38ch', lineHeight: 1.7 }}>
            Mula rekod buku murid anda hari ini — percuma selamanya.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="cta-primary">
              Daftar Sekarang — Percuma
              <span className="btn-circle">→</span>
            </Link>
            <Link to="/login" className="cta-ghost-dark">
              Sudah ada akaun? Log masuk →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer style={{ background: T.dark, borderTop: '1px solid rgba(61,112,214,0.12)', padding: '24px clamp(20px, 6vw, 80px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ fontSize: '11px', fontFamily: T.mono, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.06em' }}>
            © 2026 BUKUTRACK · OYENDEVLAB
          </span>
          <div style={{ display: 'flex', gap: '20px' }}>
            {[['Privasi', '/settings/privacy'], ['Log Masuk', '/login'], ['Daftar', '/register']].map(([label, to]) => (
              <Link key={to} to={to} className="footer-link">{label}</Link>
            ))}
          </div>
        </div>
      </footer>

      {/* ── GLOBAL STYLES ────────────────────────────────────── */}
      <style>{`
        /* Focus rings — visible keyboard accessibility */
        a:focus-visible, button:focus-visible {
          outline: 2px solid #3d70d6;
          outline-offset: 3px;
          border-radius: 4px;
        }

        /* Navbar */
        .nav-ghost {
          padding: 8px 16px; border-radius: 999px; font-size: 13px;
          font-weight: 600; color: #5a6f8f; text-decoration: none;
          transition: color 220ms;
        }
        .nav-ghost:hover { color: #1e2d45; }

        .nav-cta {
          padding: 10px 20px; border-radius: 999px; font-size: 13px;
          font-weight: 700; background: #3d70d6; color: #fff;
          text-decoration: none; display: inline-flex; align-items: center;
          gap: 6px; box-shadow: 0 2px 12px -2px rgba(61,112,214,0.4);
          transition: background 220ms, transform 220ms;
        }
        .nav-cta:hover { background: #2a58c2; transform: scale(0.97); }

        /* CTA buttons */
        .cta-primary {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 14px 14px 14px 24px; border-radius: 999px;
          background: #3d70d6; color: #fff; text-decoration: none;
          font-size: 15px; font-weight: 700;
          box-shadow: 0 8px 24px -8px rgba(61,112,214,0.5);
          transition: background 220ms, transform 220ms;
        }
        .cta-primary:hover { background: #2a58c2; transform: scale(0.97); }

        .cta-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 24px; border-radius: 999px; font-size: 15px;
          font-weight: 600; color: #5a6f8f; text-decoration: none;
          border: 1px solid #d4dff0; background: rgba(255,255,255,0.7);
          transition: border-color 220ms, color 220ms;
        }
        .cta-ghost:hover { border-color: #3d70d6; color: #1e2d45; }

        .cta-ghost-dark {
          display: inline-flex; align-items: center;
          padding: 14px 24px; border-radius: 999px; font-size: 15px;
          font-weight: 600; color: rgba(255,255,255,0.5);
          border: 1px solid rgba(255,255,255,0.16); text-decoration: none;
          transition: border-color 220ms, color 220ms;
        }
        .cta-ghost-dark:hover { border-color: rgba(255,255,255,0.5); color: #fff; }

        .btn-circle {
          width: 32px; height: 32px; border-radius: 50%;
          background: rgba(255,255,255,0.22);
          display: inline-flex; align-items: center; justify-content: center;
          font-size: 16px; flex-shrink: 0;
        }

        .footer-link {
          font-size: 11px; font-family: 'Geist Mono', monospace;
          color: rgba(255,255,255,0.30); text-decoration: none;
          letter-spacing: 0.05em; transition: color 220ms;
        }
        .footer-link:hover { color: rgba(255,255,255,0.72); }

        /* Ambient blobs */
        .blob { position: absolute; border-radius: 50%; pointer-events: none; }
        .blob-blue {
          top: 10%; left: 18%;
          width: min(520px, 68vw); height: min(520px, 68vw);
          background: radial-gradient(circle, rgba(61,112,214,0.13) 0%, transparent 68%);
          filter: blur(52px);
          animation: blobDrift 22s ease-in-out infinite alternate;
        }
        .blob-amber {
          top: 38%; right: 8%;
          width: min(400px, 54vw); height: min(400px, 54vw);
          background: radial-gradient(circle, rgba(212,146,78,0.10) 0%, transparent 68%);
          filter: blur(60px);
          animation: blobDrift 30s ease-in-out infinite alternate-reverse;
        }

        /* Scan line animation */
        .scan-line { animation: scanDrift 2.2s ease-in-out infinite alternate; }

        /* Bento responsive */
        @media (max-width: 768px) {
          .bento-wide { grid-column: span 1 !important; }
          .bento-tall  { grid-row: span 1 !important; }
          .bento-grid  { grid-template-columns: 1fr !important; }
        }

        @keyframes blobDrift {
          from { transform: translateY(0px) scale(1); }
          to   { transform: translateY(-30px) scale(1.05); }
        }
        @keyframes scanDrift {
          from { top: 18%; }
          to   { top: 76%; }
        }

        /* Respects prefers-reduced-motion */
        @media (prefers-reduced-motion: reduce) {
          .blob, .scan-line { animation: none !important; }
          [data-fade] {
            opacity: 1 !important; transform: none !important;
            filter: none !important; transition: none !important;
          }
        }
      `}</style>
    </div>
  )
}

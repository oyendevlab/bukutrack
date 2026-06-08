import Layout from '../components/layout/Layout.jsx'

const SupportCard = ({ icon, title, desc, action, href }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block', marginBottom: '10px' }}>
    <div style={{
      display: 'flex', alignItems: 'center', gap: '16px', padding: '16px',
      border: '1.5px solid var(--rule)', borderRadius: 'var(--radius-card)',
      background: 'var(--surface)', cursor: 'pointer', transition: 'all 0.15s',
    }}
      onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-bg)' }}
      onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--rule)'; e.currentTarget.style.background = 'var(--surface)' }}
    >
      <div style={{ fontSize: '28px', flexShrink: 0, width: '44px', textAlign: 'center' }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)', marginBottom: '3px' }}>{title}</div>
        <div style={{ fontSize: '11.5px', color: 'var(--ink3)', lineHeight: 1.5 }}>{desc}</div>
      </div>
      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', flexShrink: 0 }}>{action} →</div>
    </div>
  </a>
)

const AppInfoRow = ({ label, value, mono }) => (
  <div style={{ display: 'flex', gap: '12px', padding: '8px 0', borderBottom: '1px solid var(--rule)', alignItems: 'center' }}>
    <div style={{ width: '120px', flexShrink: 0, color: 'var(--ink3)', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
    <div style={{ flex: 1, fontSize: '12.5px', color: 'var(--ink2)', fontFamily: mono ? 'var(--font-mono)' : 'inherit' }}>{value}</div>
  </div>
)

export default function Donate() {
  return (
    <Layout title="Sokong Pembangun" breadcrumb="Maklumat · Sokongan">

      {/* Hero */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <div className="card-body" style={{ textAlign: 'center', padding: '36px 24px' }}>
          <div style={{ fontSize: '44px', marginBottom: '12px' }}>♥</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', letterSpacing: '2px', color: 'var(--ink)', marginBottom: '10px' }}>
            TERIMA KASIH
          </div>
          <p style={{ fontSize: '13px', color: 'var(--ink2)', lineHeight: 1.8, maxWidth: '480px', margin: '0 auto 18px' }}>
            BukuTrack dibina secara percuma untuk membantu cikgu-cikgu Malaysia mengurus rekod buku dengan lebih mudah.
            Setiap sokongan anda membantu kami teruskan pembangunan dan kekalkan aplikasi ini percuma untuk semua.
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <span className="badge badge-ok">✓ Percuma Selamanya</span>
            <span className="badge badge-ok">✓ Tiada Iklan</span>
            <span className="badge badge-ok">✓ Data Selamat</span>
          </div>
        </div>
      </div>

      {/* Cara sokong */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <div className="card-header"><div className="card-title">Cara Sokong Kami</div></div>
        <div className="card-body">
          <SupportCard icon="☕" title="Belanja Kopi" action="Ko-fi"
            desc="Sokong melalui Ko-fi. Sebarang jumlah amat dihargai — secawan kopi sudah cukup!"
            href="https://ko-fi.com" />
          <SupportCard icon="⭐" title="Kongsi BukuTrack" action="Kongsi"
            desc="Ceritakan BukuTrack kepada rakan-rakan guru. Setiap perkongsian memberi impak besar."
            href="https://bukutrack.vercel.app" />
          <SupportCard icon="🐛" title="Laporkan Bug / Cadangan" action="GitHub"
            desc="Jumpa masalah atau ada idea ciri baru? Buka isu di GitHub — kami baca setiap satu."
            href="https://github.com/oyendevlab/bukutrack/issues" />
          <SupportCard icon="💬" title="Maklum Balas" action="E-mel"
            desc="Ceritakan pengalaman anda menggunakan BukuTrack. Pandangan cikgu sangat berharga untuk kami."
            href="mailto:syafidazuan@gmail.com?subject=BukuTrack%20Maklum%20Balas" />
        </div>
      </div>

      {/* Maklumat Aplikasi */}
      <div className="card">
        <div className="card-header"><div className="card-title">Maklumat Aplikasi</div></div>
        <div className="card-body">
          <AppInfoRow label="Versi" value="v1.0.0" mono />
          <AppInfoRow label="Pembangun" value="oyendevlab" />
          <div style={{ height: 1 }} />
        </div>
      </div>

    </Layout>
  )
}

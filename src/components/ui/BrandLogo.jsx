/**
 * BrandLogo — logo seragam untuk semua halaman
 * Gaya ikut landing page: 📚 BUKU(gelap) + TRACK(aksen)
 */
export default function BrandLogo({ size = 'md', className = '' }) {
  const cfg = {
    sm: { emoji: '16px', text: '13px', gap: '5px' },
    md: { emoji: '20px', text: '17px', gap: '7px' },
    lg: { emoji: '26px', text: '22px', gap: '8px' },
    xl: { emoji: '32px', text: '28px', gap: '10px' },
  }
  const s = cfg[size] ?? cfg.md

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: s.gap,
        fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
        fontWeight: 800,
        letterSpacing: '0.4px',
        lineHeight: 1,
        userSelect: 'none',
      }}
    >
      <span style={{ fontSize: s.emoji, lineHeight: 1 }}>📚</span>
      <span style={{ fontSize: s.text }}>
        <span style={{ color: 'var(--ink, #1e2d45)' }}>BUKU</span>
        <span style={{ color: 'var(--accent, #3d70d6)' }}>TRACK</span>
      </span>
    </span>
  )
}

import { useStyle } from '../../../hooks/useStyle.jsx'
import { useAuth } from '../../../hooks/useAuth.jsx'

const STYLE_META = {
  minimal: { label: 'Minimal Ink',   headingFont: 'Bebas Neue',       bodyFont: 'Plus Jakarta Sans', fonts: 'Bebas Neue · Plus Jakarta Sans', radius: '4px',  desc: 'Editorial & Bold'       },
  sage:    { label: 'Sage & Cream',  headingFont: 'Playfair Display',  bodyFont: 'Lato',              fonts: 'Playfair Display · Lato',        radius: '8px',  desc: 'Natural & Elegant'      },
  bubbly:  { label: 'Bubbly School', headingFont: 'Nunito',            bodyFont: 'Nunito',            fonts: 'Nunito · Nunito',                radius: '14px', desc: 'Playful & Fun'          },
  sunset:  { label: 'Sunset Warm',   headingFont: 'Outfit',            bodyFont: 'Outfit',            fonts: 'Outfit · Outfit',                radius: '6px',  desc: 'Warm & Geometric'       },
  ocean:   { label: 'Deep Ocean',    headingFont: 'DM Sans',           bodyFont: 'DM Sans',           fonts: 'DM Sans · DM Sans',              radius: '2px',  desc: 'Professional & Clean'   },
}

export default function StyleSwitcher() {
  const { user } = useAuth()
  const { style, setStyle } = useStyle(user?.id)

  return (
    <div>
      <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--ink3)', marginBottom: '12px' }}>
        Tema Gaya
      </div>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {Object.entries(STYLE_META).map(([key, meta]) => (
          <div
            key={key}
            onClick={() => setStyle(key)}
            style={{
              width: '120px',
              border: `1.5px solid ${style === key ? 'var(--accent)' : 'var(--rule)'}`,
              borderRadius: 'var(--radius-card)',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.15s',
              background: 'var(--surface)',
              boxShadow: style === key ? '0 0 0 3px var(--accent-bg)' : '0 2px 6px rgba(0,0,0,0.06)',
              transform: style === key ? 'translateY(-2px)' : 'none',
            }}
          >
            <div style={{ padding: '12px 10px 8px', background: 'var(--surface2)' }}>
              <div style={{ fontFamily: `'${meta.headingFont}', sans-serif`, fontSize: '18px', color: 'var(--ink)', lineHeight: 1, marginBottom: '4px', letterSpacing: key === 'minimal' ? '2px' : '0' }}>
                BukuTrack
              </div>
              <div style={{ fontFamily: `'${meta.bodyFont}', sans-serif`, fontSize: '9px', color: 'var(--ink3)' }}>
                {meta.desc}
              </div>
              <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                <div style={{ height: '16px', flex: 1, background: 'var(--accent)', borderRadius: meta.radius, opacity: 0.8 }} />
                <div style={{ height: '16px', width: '20px', background: 'var(--surface3)', borderRadius: meta.radius }} />
              </div>
            </div>
            <div style={{ padding: '6px 8px', borderTop: '1px solid var(--rule)', fontSize: '10px', fontWeight: 700, color: style === key ? 'var(--accent)' : 'var(--ink2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{meta.label}</span>
              {style === key && <span style={{ color: 'var(--accent)' }}>✓</span>}
            </div>
            <div style={{ padding: '0 8px 6px', fontSize: '8.5px', color: 'var(--ink3)', fontFamily: 'var(--font-mono)' }}>
              {meta.fonts}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

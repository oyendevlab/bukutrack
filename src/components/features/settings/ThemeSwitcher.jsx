import { useTheme } from '../../../hooks/useTheme.jsx'
import { useAuth } from '../../../hooks/useAuth.jsx'

const THEME_META = {
  blue:     { label: 'Powder Blue',  accent: '#6b8fd4', sidebar: '#e2eaf4', bg: '#f0f4f8' },
  sage:     { label: 'Sage Green',   accent: '#5a9460', sidebar: '#deeede', bg: '#f0f5f0' },
  lavender: { label: 'Lavender',     accent: '#8060c0', sidebar: '#e8e4f4', bg: '#f2f0f8' },
  rose:     { label: 'Dusty Rose',   accent: '#b86078', sidebar: '#f0e0e6', bg: '#f8f0f2' },
  ivory:    { label: 'Warm Ivory',   accent: '#9a7040', sidebar: '#f0e6d6', bg: '#f8f4ee' },
}

export default function ThemeSwitcher() {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme(user?.id)

  return (
    <div>
      <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--ink3)', marginBottom: '12px' }}>
        Tema Warna
      </div>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {Object.entries(THEME_META).map(([key, meta]) => (
          <div
            key={key}
            onClick={() => setTheme(key)}
            style={{
              width: '100px',
              border: `1.5px solid ${theme === key ? 'var(--accent)' : 'var(--rule)'}`,
              borderRadius: 'var(--radius-card)',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.15s',
              boxShadow: theme === key ? '0 0 0 3px var(--accent-bg)' : '0 2px 6px rgba(0,0,0,0.06)',
              transform: theme === key ? 'translateY(-2px)' : 'none',
            }}
          >
            <div style={{ height: '52px', background: meta.bg, padding: '6px', display: 'flex', gap: '4px' }}>
              <div style={{ width: '20px', background: meta.sidebar, borderRadius: '3px', flexShrink: 0 }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px', justifyContent: 'center' }}>
                <div style={{ height: '6px', background: meta.accent, borderRadius: '2px', width: '70%' }} />
                <div style={{ height: '4px', background: meta.accent + '40', borderRadius: '2px', width: '90%' }} />
                <div style={{ height: '4px', background: meta.accent + '20', borderRadius: '2px', width: '60%' }} />
              </div>
            </div>
            <div style={{
              padding: '6px 8px', background: 'var(--surface)', borderTop: '1px solid var(--rule)',
              fontSize: '10px', fontWeight: 700,
              color: theme === key ? 'var(--accent)' : 'var(--ink2)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span>{meta.label}</span>
              {theme === key && <span style={{ color: 'var(--accent)' }}>✓</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

import { useState } from 'react'
import Layout from '../components/layout/Layout.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { useLanguage } from '../hooks/useLanguage.jsx'
import { useStyle } from '../hooks/useStyle.jsx'
import { useTheme } from '../hooks/useTheme.jsx'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Heart, PencilSimple, Check, X } from '@phosphor-icons/react'
import { supabase } from '../lib/supabase'

const STYLE_OPTIONS = [
  { value: 'minimal', label: 'Minimal Ink',   desc: 'Editorial & Bold' },
  { value: 'sage',    label: 'Sage & Cream',  desc: 'Natural & Elegant' },
  { value: 'bubbly',  label: 'Bubbly School', desc: 'Playful & Fun' },
  { value: 'sunset',  label: 'Sunset Warm',   desc: 'Warm & Geometric' },
  { value: 'ocean',   label: 'Deep Ocean',    desc: 'Professional & Clean' },
]

const THEME_OPTIONS = [
  { value: 'blue',     label: 'Powder Blue' },
  { value: 'sage',     label: 'Sage Green' },
  { value: 'lavender', label: 'Lavender' },
  { value: 'rose',     label: 'Dusty Rose' },
  { value: 'ivory',    label: 'Warm Ivory' },
]

export default function Settings() {
  const { teacher, user, signOut } = useAuth()
  const { language, setLanguage } = useLanguage(user?.id)
  const { style, setStyle } = useStyle(user?.id)
  const { theme, setTheme } = useTheme(user?.id)
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [editingProfile, setEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({ name: '', school_name: '' })
  const [savingProfile, setSavingProfile] = useState(false)

  function startEditProfile() {
    setProfileForm({ name: teacher?.name || '', school_name: teacher?.school_name || '' })
    setEditingProfile(true)
  }

  async function handleSaveProfile() {
    setSavingProfile(true)
    await supabase.from('teachers').update({
      name: profileForm.name.trim(),
      school_name: profileForm.school_name.trim(),
    }).eq('id', user.id)
    setSavingProfile(false)
    setEditingProfile(false)
    window.location.reload()
  }

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <Layout title={t('settings.title')} breadcrumb={t('settings.subtitle')}>

      {/* Profil */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <div className="card-header">
          <div className="card-title">Profil</div>
          {!editingProfile && (
            <button className="btn btn-ghost btn-sm" onClick={startEditProfile}>
              <PencilSimple size={14} weight="bold" /> Edit
            </button>
          )}
        </div>
        <div className="card-body">
          {editingProfile ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label className="input-label">Nama</label>
                <input className="input" value={profileForm.name}
                  onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="input-label">Sekolah</label>
                <input className="input" placeholder="Nama sekolah"
                  value={profileForm.school_name}
                  onChange={e => setProfileForm(f => ({ ...f, school_name: e.target.value }))} />
              </div>
              <div style={{ fontSize: '11px', color: 'var(--ink3)' }}>
                E-mel: {teacher?.email} (tidak boleh ditukar)
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-primary btn-sm" onClick={handleSaveProfile} disabled={savingProfile}>
                  <Check size={13} weight="bold" /> {savingProfile ? 'Menyimpan...' : 'Simpan'}
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => setEditingProfile(false)}>
                  <X size={13} weight="bold" /> Batal
                </button>
              </div>
            </div>
          ) : (
            <div className="settings-profile-rows">
              <div className="settings-profile-row">
                <span className="settings-profile-label">Nama</span>
                <span className="settings-profile-value">{teacher?.name || '—'}</span>
              </div>
              <div className="settings-profile-row">
                <span className="settings-profile-label">E-mel</span>
                <span className="settings-profile-value">{teacher?.email || '—'}</span>
              </div>
              <div className="settings-profile-row">
                <span className="settings-profile-label">Sekolah</span>
                <span className="settings-profile-value">{teacher?.school_name || '—'}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Paparan */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <div className="card-header"><div className="card-title">Paparan</div></div>
        <div className="settings-select-list">
          <div className="settings-select-row">
            <span className="settings-select-label">Gaya</span>
            <select className="input settings-select-input"
              value={style} onChange={e => setStyle(e.target.value)}>
              {STYLE_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label} — {o.desc}</option>
              ))}
            </select>
          </div>
          <div className="settings-select-row">
            <span className="settings-select-label">Warna</span>
            <select className="input settings-select-input"
              value={theme} onChange={e => setTheme(e.target.value)}>
              {THEME_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="settings-select-row">
            <span className="settings-select-label">{t('settings.language')}</span>
            <div className="settings-lang-toggle">
              {[{ value: 'bm', label: 'BM' }, { value: 'bi', label: 'EN' }].map(lang => (
                <button key={lang.value}
                  className={`settings-lang-btn${language === lang.value ? ' active' : ''}`}
                  onClick={() => setLanguage(lang.value)}>
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lain-lain — mobile only */}
      <div className="settings-mobile-links">
        <div className="card" style={{ marginBottom: '16px' }}>
          <div className="card-header"><div className="card-title">Lain-lain</div></div>
          <div className="settings-nav-list">
            <button className="settings-nav-item" onClick={() => navigate('/settings/privacy')}>
              <ShieldCheck size={18} weight="regular" />
              <span>{t('nav.privacy')}</span>
            </button>
            <button className="settings-nav-item" onClick={() => navigate('/settings/donate')}>
              <Heart size={18} weight="regular" />
              <span>{t('nav.donate')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Keluar */}
      <div className="card">
        <div className="card-body">
          <button className="btn btn-ghost" onClick={handleSignOut}
            style={{ color: 'var(--red)', borderColor: 'var(--red)' }}>
            {t('settings.signOut')}
          </button>
        </div>
      </div>
    </Layout>
  )
}

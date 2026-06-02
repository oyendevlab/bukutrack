import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleLogo, Key, EnvelopeSimple } from '@phosphor-icons/react'
import Layout from '../components/layout/Layout.jsx'
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { supabase } from '../lib/supabase.js'

const Section = ({ title, children }) => (
  <div className="card" style={{ marginBottom: '16px' }}>
    <div className="card-header"><div className="card-title">{title}</div></div>
    <div className="card-body">{children}</div>
  </div>
)

const InfoRow = ({ label, value }) => (
  <div style={{ display: 'flex', gap: '12px', padding: '9px 0', borderBottom: '1px solid var(--rule)', alignItems: 'flex-start' }}>
    <div style={{ width: '160px', flexShrink: 0, color: 'var(--ink3)', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', paddingTop: '1px' }}>{label}</div>
    <div style={{ flex: 1, fontSize: '13px', color: 'var(--ink2)' }}>{value}</div>
  </div>
)

export default function Privacy() {
  const { user, teacher } = useAuth()
  const navigate = useNavigate()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  async function handleResetPassword() {
    if (!user?.email) return
    await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/`,
    })
    setResetSent(true)
  }

  async function handleDeleteAccount() {
    setDeleting(true)
    await supabase.from('teachers').delete().eq('id', user.id)
    await supabase.auth.signOut()
    navigate('/login')
  }

  const isGoogle = user?.app_metadata?.provider === 'google'
  const createdAt = teacher?.created_at
    ? new Date(teacher.created_at).toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—'

  return (
    <Layout title="Privasi & Keselamatan" breadcrumb="Maklumat · Dasar Privasi">

      {/* PDPA */}
      <Section title="Pematuhan PDPA Malaysia">
        <p style={{ fontSize: '13px', color: 'var(--ink2)', lineHeight: 1.8, marginBottom: '14px' }}>
          BukuTrack direka dengan mengambil kira <strong>Akta Perlindungan Data Peribadi 2010 (PDPA)</strong> Malaysia.
          Sebagai pengguna, anda bertanggungjawab memastikan penggunaan nama murid adalah sah dan telah mendapat kebenaran yang diperlukan.
        </p>
        <div style={{ background: 'var(--amber-bg)', border: '1px solid var(--amber)', borderRadius: 'var(--radius-card)', padding: '12px 16px' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--amber)', marginBottom: '8px', letterSpacing: '1px' }}>▲ TANGGUNGJAWAB CIKGU</div>
          <ul style={{ paddingLeft: '16px', fontSize: '12px', color: 'var(--ink2)', lineHeight: 1.9, margin: 0 }}>
            <li>Dapatkan kebenaran ibu bapa / penjaga sebelum memasukkan nama murid</li>
            <li>Jangan kongsi akaun BukuTrack dengan pihak yang tidak berkenaan</li>
            <li>Log keluar selepas selesai menggunakan di peranti dikongsi</li>
            <li>Padam data murid apabila tidak diperlukan lagi</li>
          </ul>
        </div>
      </Section>

      {/* Data */}
      <Section title="Data Yang Disimpan">
        <InfoRow label="Data Anda" value="Nama, e-mel, nama sekolah, pilihan tema & bahasa" />
        <InfoRow label="Data Murid" value="Nama, no. murid, kod QR (auto-jana UUID), kelas" />
        <InfoRow label="Rekod Buku" value="Tarikh & masa penyerahan, dikaitkan dengan ID murid" />
        <InfoRow label="Pelayan" value="Supabase — Singapore (ap-southeast-1), penyulitan TLS" />
        <InfoRow label="Pihak Ketiga" value="Tiada data dikongsi atau dijual kepada mana-mana pihak" />
        <InfoRow label="Pemadaman" value="Padam akaun = semua data dipadam kekal dari pelayan" />
        <div style={{ height: 1 }} />
      </Section>

      {/* Keselamatan */}
      <Section title="Keselamatan Akaun">
        <InfoRow label="E-mel" value={user?.email || '—'} />
        <InfoRow
          label="Log Masuk"
          value={
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              {isGoogle
                ? <><GoogleLogo size={16} weight="fill" color="#4285F4" /> Google OAuth</>
                : <><EnvelopeSimple size={16} weight="duotone" color="var(--accent)" /> E-mel & Kata Laluan</>}
            </span>
          }
        />
        <InfoRow label="Akaun Dibuat" value={createdAt} />
        <div style={{ height: 1 }} />
        <div style={{ marginTop: '14px' }}>
          {resetSent ? (
            <div className="alert alert-ok" style={{ marginBottom: 0 }}>✓ &nbsp;E-mel reset kata laluan telah dihantar ke <strong>{user?.email}</strong></div>
          ) : !isGoogle && (
            <button className="btn btn-ghost" onClick={handleResetPassword}>
              <Key size={14} weight="bold" />
              Reset Kata Laluan
            </button>
          )}
        </div>
      </Section>

      {/* Padam Akaun */}
      <Section title="Padam Akaun">
        <p style={{ fontSize: '13px', color: 'var(--ink2)', marginBottom: '16px', lineHeight: 1.7 }}>
          Memadam akaun akan <strong style={{ color: 'var(--red)' }}>membuang semua data secara kekal</strong> — termasuk semua kelas, murid, buku, dan rekod penyerahan. Tindakan ini <strong>tidak boleh dibalik</strong>.
        </p>
        <button
          className="btn"
          style={{ background: 'var(--red-bg)', color: 'var(--red)', border: '1.5px solid var(--red)', borderRadius: 'var(--radius-btn)' }}
          onClick={() => setShowDeleteConfirm(true)}
          disabled={deleting}
        >
          {deleting ? 'Sedang memadam...' : '✕ Padam Akaun Saya'}
        </button>
      </Section>

      {showDeleteConfirm && (
        <ConfirmDialog
          message={`Padam akaun "${teacher?.name || user?.email}" secara kekal? Semua data kelas, murid, buku dan rekod akan hilang selama-lamanya. Tindakan ini tidak boleh dibalik.`}
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </Layout>
  )
}

# BukuTrack — Project Brief untuk Claude Code

> Dokumen ini adalah rujukan lengkap untuk membina aplikasi BukuTrack dari awal menggunakan Claude Code. Baca keseluruhan dokumen sebelum menulis sebarang kod.

---

## 1. Ringkasan Projek

**BukuTrack** ialah aplikasi web progresif (PWA) untuk cikgu merekod penyerahan buku teks murid menggunakan QR kod. Setiap cikgu mempunyai akaun individu dan boleh menguruskan berbilang kelas.

| Perkara | Nilai |
|---|---|
| Nama App | BukuTrack |
| Platform | Web (PWA) + Mobile-friendly |
| Bahasa | Bahasa Melayu + Bahasa Inggeris |
| Hosting | Vercel |
| Backend | Supabase (Auth + Database + RLS) |
| Model | Multi-tenant individu (Model B) |
| Harga | Percuma + Derma sukarela |

---

## 2. Tech Stack

```
Frontend   : React + Vite
Styling    : Tailwind CSS
QR Scanner : html5-qrcode
QR Generate: qrcode.react
Database   : Supabase (PostgreSQL)
Auth       : Supabase Auth (email + password)
Export     : xlsx (Excel/CSV) + jsPDF (PDF)
PWA        : vite-plugin-pwa
Deploy     : Vercel
i18n       : i18next (BM + BI)
```

---

## 3. Design System

### 3.1 Tema Style (5 Style)

App menyokong 5 style estetik yang berbeza. Style disimpan dalam `localStorage` dan `teachers.style`. Style diaplikasi melalui `data-style` attribute pada `<html>`, dan mengubah font, border-radius, border-weight, dan tipografi secara menyeluruh.

Style dan warna adalah **bebas dan boleh digabung** — contoh: Style *Bubbly School* + Warna *Dusty Rose*.

---

#### Style 01 — Minimal Ink *(default)*
```
Heading font  : Bebas Neue
Body font     : Plus Jakarta Sans
Data font     : JetBrains Mono
Border weight : 1px (halus)
Border radius : card 8px, button 6px, input 6px
Estetik       : Editorial, bold, tipografi kuat, hitam-putih dominan
Ciri khas     : Huruf besar untuk heading, progress bar nipis 4px,
                border tegas pada card header
```

#### Style 02 — Sage & Cream
```
Heading font  : Playfair Display (serif)
Body font     : Lato
Data font     : Lato (monospace fallback)
Border weight : 1px
Border radius : card 12px, button 8px, input 8px
Estetik       : Natural, organic, premium — rasa buku nota cikgu yang elegan
Ciri khas     : Serif heading, warna tanah, border halus,
                spacing lebih longgar, nombor stat guna Playfair
```

#### Style 03 — Bubbly School
```
Heading font  : Nunito (ExtraBold)
Body font     : Nunito
Data font     : Nunito
Border weight : 2px
Border radius : card 16px, button 20px (pill), input 12px
Estetik       : Playful, fun, mesra kanak-kanak — rasa seronok sekolah
Ciri khas     : Border-radius besar, icon emoji lebih besar,
                shadow lebih ketara, stat num lebih besar dan tebal
```

#### Style 04 — Sunset Warm
```
Heading font  : Outfit (Bold)
Body font     : Outfit
Data font     : Outfit (monospace fallback)
Border weight : 1px
Border radius : card 10px, button 8px, input 8px
Estetik       : Warm, cozy, geometric — rasa hangat dan mesra
Ciri khas     : Gradient subtle pada card header, icon rounded,
                typography geometric yang bersih
```

#### Style 05 — Deep Ocean
```
Heading font  : DM Sans (Bold)
Body font     : DM Sans
Data font     : DM Sans
Border weight : 1px
Border radius : card 6px, button 4px, input 4px
Estetik       : Professional, corporate, clean — serius tapi menarik
Ciri khas     : Border-radius minimum, layout lebih compact,
                typografi bersih tanpa dekorasi berlebihan
```

---

**Google Fonts yang diperlukan (load semua):**
```
Bebas Neue
Plus Jakarta Sans (300,400,500,600,700,800)
JetBrains Mono (400,500,600)
Playfair Display (400,600,700)
Lato (300,400,700)
Nunito (400,600,700,800,900)
Outfit (400,500,600,700,800)
DM Sans (300,400,500,600,700)
```

### 3.2 Tema Warna (5 Warna Pastel)

Warna adalah lapisan berasingan daripada style. Setiap kombinasi style + warna adalah sah.

#### Tema 1 — Powder Blue (Default)
```css
--bg: #f0f4f8
--surface: #ffffff
--surface2: #edf1f7
--surface3: #dde5f0
--ink: #2c3a52
--ink2: #6b7fa3
--ink3: #a8b8d0
--rule: #d8e2f0
--sidebar-bg: #e2eaf4
--sidebar-border: #cdd8ec
--sidebar-text: #7a96b8
--sidebar-text-active: #3a5480
--sidebar-active-bg: rgba(100,140,200,0.12)
--sidebar-section: #a8bcd8
--accent: #6b8fd4
--accent-bg: rgba(107,143,212,0.1)
--red: #c0607a
--red-bg: rgba(192,96,122,0.08)
--green: #4a9470
--green-bg: rgba(74,148,112,0.09)
--amber: #b07840
--amber-bg: rgba(176,120,64,0.09)
```

#### Tema 2 — Sage Green
```css
--sidebar-bg: #deeede
--accent: #5a9460
--ink: #2a3c2a
```

#### Tema 3 — Lavender
```css
--sidebar-bg: #e8e4f4
--accent: #8060c0
--ink: #3a2c52
```

#### Tema 4 — Dusty Rose
```css
--sidebar-bg: #f0e0e6
--accent: #b86078
--ink: #4a2830
```

#### Tema 5 — Warm Ivory
```css
--sidebar-bg: #f0e6d6
--accent: #9a7040
--ink: #3c2e1e
```

### 3.3 Sistem Tema (Style + Warna)

```
data-style="minimal"   → Style Minimal Ink (default)
data-style="sage"      → Style Sage & Cream
data-style="bubbly"    → Style Bubbly School
data-style="sunset"    → Style Sunset Warm
data-style="ocean"     → Style Deep Ocean

data-theme="blue"      → Warna Powder Blue (default)
data-theme="sage"      → Warna Sage Green
data-theme="lavender"  → Warna Lavender
data-theme="rose"      → Warna Dusty Rose
data-theme="ivory"     → Warna Warm Ivory
```

**HTML attribute:**
```html
<html lang="ms" data-style="minimal" data-theme="blue">
```

**CSS implementation:**
```css
/* Style mengawal: font-family, border-radius, border-weight, spacing */
[data-style="minimal"] { --font-heading: 'Bebas Neue'; --radius-card: 8px; ... }
[data-style="bubbly"]  { --font-heading: 'Nunito'; --radius-card: 16px; ... }

/* Warna mengawal: semua CSS color variables */
[data-theme="blue"]    { --accent: #6b8fd4; --sidebar-bg: #e2eaf4; ... }
[data-theme="rose"]    { --accent: #b86078; --sidebar-bg: #f0e0e6; ... }

/* Kedua-dua boleh digabung bebas */
[data-style="bubbly"][data-theme="rose"] { /* Bubbly + Rose */ }
```

**Simpan dalam:**
- `localStorage`: `bukutrack-style` dan `bukutrack-theme`
- Database: `teachers.style` dan `teachers.theme`
- Sync antara kedua-dua bila cikgu log masuk

### 3.4 Komponen UI

- **Border**: 1px solid `var(--rule)` — tiada border keras 2px
- **Border-radius**: card `8px`, button `6px`, input `6px`, modal `12px`
- **Shadow**: `0 2px 8px rgba(100,140,200,0.06)` untuk card
- **Sidebar**: lebar `240px`, overlay mode pada mobile, persistent pada desktop (≥1024px)
- **Topbar**: tinggi `54px`, sticky, hamburger menu

---

## 4. Struktur Database (Supabase)

### 4.1 Jadual

```sql
-- Profil cikgu (extends Supabase auth.users)
CREATE TABLE teachers (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  school_name TEXT,
  language    TEXT DEFAULT 'bm',   -- 'bm' atau 'bi'
  theme       TEXT DEFAULT 'blue', -- warna: blue|sage|lavender|rose|ivory
  style       TEXT DEFAULT 'minimal', -- estetik: minimal|sage|bubbly|sunset|ocean
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Kelas
CREATE TABLE classes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  subject    TEXT NOT NULL,  -- cth: "English"
  year_name  TEXT NOT NULL,  -- cth: "Tahun 5A"
  color      TEXT DEFAULT 'blue', -- warna aksen kad kelas
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Murid
CREATE TABLE students (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  class_id   UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  student_no TEXT,           -- no. murid / IC (pilihan)
  qr_code    TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Buku
CREATE TABLE books (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  class_id   UUID REFERENCES classes(id) ON DELETE CASCADE, -- NULL = semua kelas
  name       TEXT NOT NULL,
  emoji      TEXT DEFAULT '📚',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rekod penyerahan
CREATE TABLE submissions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id  UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  student_id  UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  book_id     UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, book_id) -- satu rekod per murid per buku
);
```

### 4.2 Row Level Security (RLS)

```sql
-- Aktifkan RLS pada semua jadual
ALTER TABLE teachers   ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes    ENABLE ROW LEVEL SECURITY;
ALTER TABLE students   ENABLE ROW LEVEL SECURITY;
ALTER TABLE books      ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Policy: cikgu hanya boleh akses data mereka sendiri
CREATE POLICY "teachers_own" ON teachers
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "classes_own" ON classes
  FOR ALL USING (auth.uid() = teacher_id);

CREATE POLICY "students_own" ON students
  FOR ALL USING (auth.uid() = teacher_id);

CREATE POLICY "books_own" ON books
  FOR ALL USING (auth.uid() = teacher_id);

CREATE POLICY "submissions_own" ON submissions
  FOR ALL USING (auth.uid() = teacher_id);
```

---

## 5. Struktur Folder Projek

```
bukutrack/
├── public/
│   ├── icons/          # PWA icons
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Topbar.jsx
│   │   │   └── Layout.jsx
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   └── Tag.jsx
│   │   └── features/
│   │       ├── dashboard/
│   │       │   ├── ClassCard.jsx
│   │       │   ├── OverviewStats.jsx
│   │       │   └── RecentActivity.jsx
│   │       ├── scan/
│   │       │   ├── QRScanner.jsx
│   │       │   ├── BookChecklist.jsx
│   │       │   └── ScanModal.jsx
│   │       ├── records/
│   │       │   ├── RecordsTable.jsx
│   │       │   └── ExportButtons.jsx
│   │       ├── students/
│   │       │   ├── StudentList.jsx
│   │       │   └── StudentForm.jsx
│   │       ├── books/
│   │       │   ├── BookList.jsx
│   │       │   └── BookForm.jsx
│   │       ├── qr/
│   │       │   └── QRPrintGrid.jsx
│   │       └── settings/
│   │           ├── ThemeSwitcher.jsx    # Colour switcher (5 warna)
│   │           ├── StyleSwitcher.jsx    # Style switcher (5 estetik)
│   │           ├── ProfileForm.jsx
│   │           ├── SecurityForm.jsx
│   │           ├── PrivacyPage.jsx
│   │           └── DonatePage.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ClassDetail.jsx
│   │   ├── Scan.jsx
│   │   ├── Records.jsx
│   │   ├── Classes.jsx
│   │   ├── Students.jsx
│   │   ├── Books.jsx
│   │   ├── QRPrint.jsx
│   │   └── Settings.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useTheme.js      # Colour theme management
│   │   ├── useStyle.js      # Style/estetik management
│   │   ├── useClasses.js
│   │   ├── useStudents.js
│   │   ├── useBooks.js
│   │   └── useSubmissions.js
│   ├── lib/
│   │   ├── supabase.js     # Supabase client
│   │   ├── export.js       # Excel, CSV, PDF helpers
│   │   └── qr.js           # QR helpers
│   ├── i18n/
│   │   ├── index.js
│   │   ├── bm.json         # Bahasa Melayu
│   │   └── bi.json         # Bahasa Inggeris
│   ├── styles/
│   │   ├── themes.css      # CSS colour variables (5 warna)
│   │   ├── styles.css      # CSS style variables (5 estetik: font, radius, weight)
│   │   └── index.css
│   ├── App.jsx
│   └── main.jsx
├── .env.local              # SUPABASE keys
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 6. Halaman & Fungsi

### 6.1 Auth

**Login (`/login`)**
- Email + password
- Link ke register
- Reset password

**Register (`/register`)**
- Nama cikgu
- Email
- Nama sekolah (pilihan)
- Password
- Checkbox penafian privasi (wajib tick sebelum boleh daftar)
- Auto-create profil dalam `teachers` table

### 6.2 Dashboard (`/`)

**Overview semua kelas:**
- 3 stat global: Jumlah Murid, Lengkap Semua Buku, Belum Lengkap
- Grid kad kelas — 1 kolum (mobile), 2 kolum (tablet), 3 kolum (desktop)
- Setiap kad tunjuk: nama subjek, tahun/kelas, bil. murid, progress bar per buku, stat ringkas
- Klik kad → masuk detail kelas
- Senarai aktiviti terkini (semua kelas)

### 6.3 Detail Kelas (`/class/:id`)

- Breadcrumb: Dashboard › Nama Kelas
- 4 stat: Jumlah Murid, Lengkap, Belum, Scan Hari Ini
- Progress bar per buku
- Trend chart mingguan
- Senarai murid belum lengkap
- Jadual rekod murid dengan status setiap buku
- Butang export Excel/PDF untuk kelas ini

### 6.4 Scan QR (`/scan`)

- Selector kelas aktif (pill buttons)
- Kamera QR scanner (`html5-qrcode`)
- Setelah scan → Modal popup:
  - Avatar + nama murid + kelas
  - Progress dots (berapa buku dah hantar)
  - Checklist semua buku (✓ = dah, – = belum)
  - Boleh tick/untick
  - Butang Simpan → update `submissions` table
- Senarai scan terkini (3 terakhir)

### 6.5 Rekod & Laporan (`/records`)

- Tab: Ikut Murid / Ikut Buku
- Filter: Semua Kelas / per kelas / status (Lengkap/Separa/Belum)
- Search murid
- Jadual dengan tag kelas berwarna
- Export: Excel, CSV, PDF

### 6.6 Senarai Kelas (`/classes`)

- Senarai semua kelas
- Tambah kelas baru (subjek + tahun/kelas)
- Edit / padam kelas
- Klik → masuk detail kelas

### 6.7 Senarai Murid (`/students`)

- Filter ikut kelas
- Search nama
- Tambah murid (nama, no. murid, kelas)
- Import dari CSV/Excel
- Edit / padam murid
- QR code dijana automatik (UUID)

### 6.8 Senarai Buku (`/books`)

- Senarai buku (boleh share semua kelas atau spesifik kelas)
- Tambah buku (nama, emoji, kelas)
- Edit / padam buku

### 6.9 Print QR (`/qr-print`)

- Filter ikut kelas
- Grid QR kad murid (4 kolum)
- Setiap kad: QR code sebenar + nama murid + ID
- Print semua / Download ZIP
- QR encode: `student.qr_code` (UUID)

### 6.10 Tetapan (`/settings`)

**Bahagian dalam Settings:**

1. **Tema Style** — 5 kad preview estetik (Minimal Ink, Sage & Cream, Bubbly School, Sunset Warm, Deep Ocean). Setiap kad tunjuk preview font dan estetik berbeza. Klik untuk tukar serta-merta. Simpan dalam localStorage + database.

2. **Tema Warna** — 5 kad preview warna pastel (Powder Blue, Sage Green, Lavender, Dusty Rose, Warm Ivory). Bebas digabung dengan mana-mana style di atas. Klik untuk tukar serta-merta. Simpan dalam localStorage + database.

3. **Bahasa** — toggle BM / BI

4. **Profil** — nama, email, nama sekolah

5. **Keselamatan** — tukar kata laluan, padam akaun (dengan pengesahan)

6. **Privasi & Keselamatan** — halaman dedicated (lihat §8)

7. **Sokong Pembangun** — halaman derma (lihat §9)

**UI Layout Style Switcher:**
- Grid 5 kad (scroll horizontal pada mobile)
- Setiap kad tunjuk:
  - Preview mini: font heading, font body, border-radius
  - Nama style
  - Tag contoh font (cth: "Bebas Neue · Plus Jakarta Sans")
- Kad aktif ada border aksen + tanda ✓
- Tukar style → app re-render serta-merta tanpa reload

**UI Layout Colour Switcher:**
- Grid 5 kad (scroll horizontal pada mobile)
- Setiap kad tunjuk:
  - Preview mini: warna sidebar, warna aksen, warna background
  - Nama warna
- Kad aktif ada border aksen + tanda ✓
- Tukar warna → app re-render serta-merta tanpa reload

---

## 7. Navigation / Sidebar

```
UTAMA
  ▣  Dashboard
  ◎  Scan QR
  ☰  Rekod & Laporan  [badge: bil. belum lengkap]

PENGURUSAN
  ◫  Senarai Kelas
  ◉  Senarai Murid
  ◈  Senarai Buku
  ⊟  Print QR

MAKLUMAT
  🔒  Privasi & Keselamatan
  ♥   Sokong Pembangun

AKAUN
  ◇  Tetapan
```

**Sidebar behaviour:**
- Mobile/tablet (< 1024px): hidden by default, overlay slide-in bila hamburger diklik
- Desktop (≥ 1024px): persistent, boleh toggle collapse/expand
- Hamburger bertukar jadi X bila sidebar terbuka

---

## 8. Halaman Privasi & Keselamatan

URL: `/settings/privacy` atau modal dalam Settings

**Kandungan:**

### Data Yang Dikumpul
- Nama cikgu dan email (untuk log masuk)
- Nama murid dan kelas sahaja
- Rekod penyerahan buku (tarikh dan masa)
- **Tiada** IC penuh, alamat, maklumat kewangan, atau data sensitif lain dikumpul

### Bagaimana Data Disimpan
- Disimpan dalam Supabase (infrastruktur AWS, rantau Asia Pasifik)
- Dilindungi dengan Row Level Security — hanya anda yang boleh akses data anda
- Kata laluan dienkripsi dan tidak disimpan dalam teks biasa
- Sambungan dilindungi dengan HTTPS/SSL

### Penafian (Disclaimer)
> *Dengan menggunakan BukuTrack, anda sebagai pengguna bertanggungjawab sepenuhnya untuk memastikan kebenaran yang diperlukan telah diperoleh daripada ibu bapa atau penjaga murid berkaitan penggunaan nama murid dalam aplikasi ini, selaras dengan Akta Perlindungan Data Peribadi 2010 (PDPA) Malaysia.*

### Hak Pengguna
- Anda boleh meminta eksport semua data anda pada bila-bila masa
- Anda boleh memadam akaun dan semua data anda secara kekal dalam Tetapan
- BukuTrack tidak berkongsi data anda dengan pihak ketiga

### Hubungi
- Email pembangun untuk sebarang pertanyaan berkaitan privasi

---

## 9. Halaman Sokong Pembangun

URL: `/settings/donate`

**Kandungan:**
- Mesej pendek dari pembangun (BM + BI)
- QR GX Bank untuk derma
- Jumlah derma: sukarela, tiada minimum
- Ucapan terima kasih
- Nota: "BukuTrack kekal percuma untuk semua cikgu"

**Layout:**
- Kad besar di tengah
- QR code GX Bank (gambar/image statik)
- Teks penghargaan
- Tiada butang bayaran automatik — scan QR sahaja

---

## 10. Fungsi Export

### Excel (.xlsx)
Menggunakan library `xlsx`:
- Sheet 1: Semua murid dengan status setiap buku (✓ / ✗)
- Sheet 2: Ringkasan per buku (bil. hantar / belum)
- Filter ikut kelas sebelum export

### CSV
Format mudah, satu baris per murid:
```
Nama,Kelas,Buku1,Buku2,Buku3,Status
Ahmad Faris,5A,✓,✓,✗,2/3
```

### PDF
Menggunakan `jsPDF` + `jspdf-autotable`:
- Header: nama cikgu, kelas, tarikh export
- Jadual murid dengan status
- Footer: BukuTrack watermark

---

## 11. PWA Configuration

```javascript
// vite.config.js
VitePWA({
  registerType: 'autoUpdate',
  manifest: {
    name: 'BukuTrack',
    short_name: 'BukuTrack',
    description: 'Sistem Rekod Buku Murid',
    theme_color: '#6b8fd4',
    background_color: '#f0f4f8',
    display: 'standalone',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ]
  }
})
```

---

## 12. i18n (Dwibahasa)

Gunakan `i18next` + `react-i18next`.

Contoh key dalam `bm.json`:
```json
{
  "nav": {
    "dashboard": "Dashboard",
    "scan": "Imbas QR",
    "records": "Rekod & Laporan",
    "classes": "Senarai Kelas",
    "students": "Senarai Murid",
    "books": "Senarai Buku",
    "printQR": "Cetak QR",
    "privacy": "Privasi & Keselamatan",
    "donate": "Sokong Pembangun",
    "settings": "Tetapan"
  },
  "dashboard": {
    "title": "Dashboard",
    "allClasses": "Semua Kelas",
    "totalStudents": "Jumlah Murid",
    "completeAll": "Lengkap Semua Buku",
    "incomplete": "Belum Lengkap",
    "viewDetail": "Lihat Detail"
  }
}
```

Cikgu boleh tukar bahasa dalam Tetapan. Simpan dalam `teachers.language` dan localStorage.

---

## 13. Environment Variables

```bash
# .env.local
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
```

---

## 14. Supabase Client

```javascript
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

---

## 15. Route Structure

```javascript
// App.jsx dengan React Router v6
/                     → Dashboard (protected)
/class/:id            → ClassDetail (protected)
/scan                 → Scan (protected)
/records              → Records (protected)
/classes              → Classes (protected)
/students             → Students (protected)
/books                → Books (protected)
/qr-print             → QRPrint (protected)
/settings             → Settings (protected)
/settings/privacy     → Privacy (protected)
/settings/donate      → Donate (protected)
/login                → Login (public)
/register             → Register (public)
```

---

## 16. Vercel Deployment

```json
// vercel.json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "env": {
    "VITE_SUPABASE_URL": "@supabase-url",
    "VITE_SUPABASE_ANON_KEY": "@supabase-anon-key"
  }
}
```

---

## 17. Urutan Pembinaan (Build Order)

Cadangan urutan untuk Claude Code:

1. **Setup projek** — Vite + React + Tailwind + Supabase
2. **Database** — Buat semua jadual dan RLS dalam Supabase
3. **Auth** — Login, Register, session management
4. **Layout** — Sidebar, Topbar, hamburger, routing
5. **Theme + Style system** — CSS variables dwi-lapisan, ThemeSwitcher + StyleSwitcher component, load semua Google Fonts
6. **i18n** — Setup dwibahasa BM/BI
7. **Dashboard** — Overview stats + class cards
8. **Scan** — QR scanner + modal checklist
9. **Classes** — CRUD kelas
10. **Students** — CRUD murid + import CSV
11. **Books** — CRUD buku
12. **Records** — Jadual + filter + export
13. **QR Print** — Grid print
14. **Settings** — Profile, security, style switcher, colour switcher, bahasa
15. **Privacy page** — Halaman privasi statik
16. **Donate page** — Halaman derma + QR GX Bank
17. **PWA** — Manifest + service worker
18. **Deploy** — Vercel

---

## 18. Nota Penting untuk Claude Code

- **Jangan hardcode** warna atau font — guna CSS variables sahaja
- **Dua lapisan tema**: `data-style` untuk estetik (font/radius/weight) dan `data-theme` untuk warna — kedua-dua bebas dan boleh digabung
- **CSS variables style** mengawal: `--font-heading`, `--font-body`, `--font-mono`, `--radius-card`, `--radius-btn`, `--radius-input`, `--border-weight`, `--spacing-base`
- **CSS variables warna** mengawal: semua `--ink`, `--accent`, `--sidebar-*`, `--red`, `--green`, `--amber`
- **Google Fonts**: load semua 8 font families sekaligus pada app launch — ia dibutuhkan oleh semua style
- **RLS wajib** — pastikan semua query melalui authenticated Supabase client
- **Mobile-first** — semua layout bermula dari mobile, kemudian responsive ke atas
- **Sidebar** collapsed by default pada mobile, persistent pada desktop ≥1024px
- **QR code** di-generate dari `student.qr_code` (UUID string)
- **Scan** perlu kamera permission — handle error gracefully jika ditolak
- **Export** baca semua data dari Supabase dulu sebelum generate fail
- **Theme + Style** disimpan dalam dua tempat: localStorage (UI segera) + `teachers.theme` / `teachers.style` (sync ke database)
- **Bahasa** disimpan dalam dua tempat: localStorage + `teachers.language` (sync)
- Gunakan **Supabase realtime** untuk update scan secara live (pilihan, fasa 2)
- Semua teks UI mesti melalui **i18n keys** — tiada teks hardcode dalam BM atau BI

---

*Dokumen ini disediakan berdasarkan UI mockup yang telah disetujui. Rujuk mockup HTML (buku-tracker-v4.html) untuk visual reference.*

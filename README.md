# SIM-OPS SMA (Sistem Informasi Manajemen Operasional Sekolah)

Aplikasi Web Dashboard Manajemen Operasional Sekolah SMA berbasis **React + Vite + TypeScript + Tailwind CSS**, dimigrasikan dari Stitch UI prototype dengan arsitektur komponen modular dan token desain dari `DESIGN.md`.

---

## 🚀 Fitur Utama

- **Header Operasional Interaktif**:
  - Pencarian global cepat dengan shortcut keyboard `Ctrl + K`.
  - Indikator status sinkronisasi live Dapodik Kemdikbudristek.
  - Switcher peran pengguna multi-level (*OPS*, *Kurikulum*, *Kepala Sekolah*).
  - Modal input **Jurnal Harian OPS** dengan validasi form.
  - Dukungan toggle Dark Mode & Light Mode.

- **Banner Countdown & Residu Data**:
  - Hitung mundur batas cut-off Dapodik semester genap secara dinamis.
  - Progress bar kelengkapan validasi data (88%).
  - Modal interaktif **12 Residu Data** dengan filter per kategori (*Peserta Didik*, *GTK*, *Sarpras*).

- **8 Kartu Metrik Inti**:
  1. **Total Tenaga Pendidik (GTK)**: 74 GTK (PNS, PPPK, Honorer) + badge +2 baru.
  2. **Peserta Didik Aktif**: 1.080 siswa dengan 100% NISN valid terdistribusi pada Fase E, F-XI, F-XII.
  3. **Rombongan Belajar**: 30 Rombel aktif (10 rombel/tingkat, rata-rata 36 siswa/kelas).
  4. **GTK Bersertifikasi**: 58 Guru (78.3% rasio, antrean PPG, non-sergu).
  5. **Program PIP**: 142 siswa penerima (Rp 255.600.000).
  6. **Dokumen Belum Lengkap**: 34 berkas pending (21 siswa, 13 GTK).
  7. **Beban Ajar &lt; 24 JTM**: 3 guru kritis memerlukan ekuivalensi tugas tambahan.
  8. **Agenda & Deadline Dekat**: 5 agenda prioritas minggu berjalan.

- **Modul Analisis Operasional & Kurikulum**:
  - **Distribusi Siswa & Peminatan**: Visualisasi sebaran Kurikulum Merdeka (MIPA 50%, IPS 40%, Bahasa 10%).
  - **Status Pemenuhan Beban JTM**: Breakdown kategori Memenuhi (≥ 24 Jam), Warning, dan Kurang JTM beserta alert nama GTK terdampak.
  - **Monitoring Penyaluran PIP**: Pipeline tracker 4 tahap (SK Nominasi &rarr; Aktivasi Rekening &rarr; Pencairan &rarr; Unggah Bukti) dilengkapi aksi cetak SPTJM & Kuasa Kolektif Bank BNI.

- **Panel Aktivitas & Aksi Cepat**:
  - **Tenggat & Agenda Krusial**: Kalender countdown timeline H-4, H-8, H-14.
  - **Aktivitas Terkini Operator**: Timeline log kegiatan OPS dengan tombol perluas riwayat.
  - **Aksi Cepat Data**: Tombol navigasi cepat Tambah Siswa, Update GTK, Cetak SPTJM, dan Upload Berkas.

- **Integrasi Database Cloud Supabase (PostgreSQL 15+)**:
  - Replikasi multi-perangkat real-time dengan basis data Supabase PostgreSQL.
  - Skrip DDL schema lengkap (`database/supabase_schema.sql`) dengan Row Level Security (RLS) dan Realtime publication.
  - Modul client native (`src/lib/supabase.ts`) tanpa bloat dependensi eksternal.
  - Dukungan kontrol UI di *Konfigurasi Sistem* untuk uji koneksi, migrasi data, dan tarik data.
  - Fallback otomatis ke Cloudflare Pages Functions KV & LocalStorage jika offline.

---

## 📁 Struktur Direktori

```
OPS SMA/
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── ActivityTimelineCard.tsx
│   │   │   ├── CountdownBanner.tsx
│   │   │   ├── DeadlineListCard.tsx
│   │   │   ├── JTMStatusCard.tsx
│   │   │   ├── MetricCardsGrid.tsx
│   │   │   ├── PIPPipelineCard.tsx
│   │   │   ├── QuickActionsCard.tsx
│   │   │   └── StudentDistributionCard.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Sidebar.tsx
│   │   └── modals/
│   │       ├── JurnalModal.tsx
│   │       ├── ResiduModal.tsx
│   │       └── SyncModal.tsx
│   ├── data/
│   │   └── mockData.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── DESIGN.md
├── code.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🛠️ Menjalankan Project

### 1. Menjalankan Server Pengembangan (Dev)
```bash
npm run dev
```
Akses dashboard di browser melalui: `http://localhost:3000`

### 2. Membangun untuk Produksi (Production Build)
```bash
npm run build
```
File build siap rilis akan berada di folder `dist/`.

### 3. Meninjau Hasil Build (Preview)
```bash
npm run preview
```


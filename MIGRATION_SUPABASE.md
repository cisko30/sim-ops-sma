# Panduan Lengkap Migrasi Database ke Supabase PostgreSQL
## SIM-OPS SMA NU Kaplongan

Dokumentasi ini menjelaskan langkah-langkah memigrasikan database **SIM-OPS SMA NU Kaplongan** ke **Supabase** (PostgreSQL 15+ Cloud), mendukung replikasi real-time multi-perangkat, Row Level Security (RLS), dan persistensi data master sekolah.

---

## 📋 Daftar Berkas Migrasi

1. **`database/supabase_schema.sql`**: Skrip SQL lengkap (DDL) berisi seluruh tabel, relasi, constraint, trigger `updated_at`, view analisis beban JTM & PIP, indeks, serta konfigurasi RLS dan Realtime Publication.
2. **`database/supabase_seed.sql`**: Data master resmi SMA NU Kaplongan (Identitas sekolah, Kepala Sekolah Drs. H. Toufik Zaenal Mustofa, M.Pd.I, Koordinator Operator Bagas Pratama, S.Kom, 10 GTK, 30 Rombel, 16 Mapel Kurikulum Merdeka, Siswa, dan Jurnal Kerja TKA/ABM).
3. **`supabase/migrations/20261117000000_simops_schema.sql`**: Format migrasi resmi untuk pengguna yang menggunakan Supabase CLI (`supabase db push`).
4. **`src/lib/supabase.ts`**: Modul client Supabase (PostgREST API + Realtime) yang terintegrasi langsung ke React Frontend tanpa dependensi eksternal yang memberatkan.
5. **`functions/api/database.ts`**: Cloudflare Pages Serverless Function yang diperbarui untuk mendukung Supabase Cloud secara transparan.

---

## 🚀 Langkah 1: Buat Proyek di Supabase

1. Buka [https://supabase.com](https://supabase.com) dan login ke akun Anda.
2. Klik **New Project**.
3. Isi informasi proyek:
   - **Name**: `SIM-OPS SMA NU Kaplongan`
   - **Database Password**: Buat kata sandi database yang kuat dan simpan dengan aman.
   - **Region**: Pilih `Singapore (ap-southeast-1)` untuk latensi tercepat dari Indonesia.
4. Klik **Create new project** dan tunggu 1-2 menit hingga status database menjadi *Active*.

---

## 🗄️ Langkah 2: Jalankan Skrip Skema Database (DDL)

1. Di dashboard Supabase, klik menu **SQL Editor** pada sidebar kiri (ikon `>_`).
2. Klik tombol **New query**.
3. Buka berkas `database/supabase_schema.sql` pada proyek ini, salin seluruh kodenya, dan tempelkan ke SQL Editor Supabase.
4. Klik tombol **Run** (atau tekan `Ctrl + Enter`).
5. Pastikan muncul pesan sukses: `Success. No rows returned`.

Tabel-tabel berikut akan otomatis dibuat di skema `public`:
- `sekolah`: Profil dan identitas resmi sekolah.
- `gtk`: Data Guru dan Tenaga Kependidikan dengan kalkulasi JTM Permendikdasmen No. 11/2025.
- `siswa`: Data Peserta Didik aktif dengan status validasi Dukcapil & PIP.
- `rombel`: 30 Rombongan Belajar (X-1 s.d. X-10, XI-1 s.d. XI-10, XII-1 s.d. XII-10).
- `mapel`: Struktur 16 Mata Pelajaran dan alokasi JP.
- `jurnal_harian`: Buku jurnal kerja operasional harian operator.
- `jurnal_aktivitas`: Rincian kegiatan kerja harian operator.
- `aktivitas_timeline`: Audit log aktivitas sistem.
- `simops_sync_state`: Snapshot sinkronisasi atomik multi-perangkat.

---

## 🌱 Langkah 3: Isi Data Awal Resmi (Seed Data)

*(Opsional jika Anda ingin langsung menggunakan data master resmi SMA NU Kaplongan)*

1. Masih di **SQL Editor** Supabase, buat query baru.
2. Salin seluruh isi berkas `database/supabase_seed.sql` dan tempelkan ke SQL Editor.
3. Klik tombol **Run**.
4. Seluruh profil sekolah, 10 data GTK percontohan resmi, 30 rombel, 16 mapel, dan jurnal harian akan langsung terisi.

---

## 🔑 Langkah 4: Ambil Kredensial API Supabase

1. Di dashboard Supabase, masuk ke **Project Settings** (ikon gerigi di kiri bawah).
2. Pilih tab **API**.
3. Salin 2 nilai berikut:
   - **Project URL**: Format `https://[project-ref].supabase.co`
   - **Project API Keys (`anon` / `public`)**: String JWT acak yang diawali dengan `eyJhbGciOi...`

---

## ⚙️ Langkah 5: Hubungkan ke SIM-OPS SMA

Tersedia **2 cara praktis** untuk menghubungkan aplikasi ke Supabase:

### Cara A: Melalui Menu Pengaturan Aplikasi (Tanpa Perlu Build Ulang)
1. Jalankan aplikasi SIM-OPS SMA.
2. Di sidebar kiri, buka menu **Sistem & Pengesahan** &rarr; **Konfigurasi & Cadangan**.
3. Pada panel **Integrasi Database Cloud Supabase (PostgreSQL)**:
   - Masukkan **Supabase Project URL**.
   - Masukkan **Supabase Anon Public API Key**.
4. Klik tombol **Simpan & Uji Koneksi**.
5. Sistem akan memverifikasi sambungan secara langsung:
   - Jika berhasil, badge akan berubah hijau: `🟢 Terkoneksi ke Supabase`.
   - Di Header atas, indikator awan akan menampilkan `Supabase Aktif`.
6. Klik tombol **Migrasikan Data ke Supabase** untuk menyalin data lokal ke tabel Supabase cloud!

---

### Cara B: Melalui File Lingkungan `.env` (Untuk Development & Deployment)
Tambahkan ke file `.env` di root direktori proyek:

```ini
# Frontend React / Vite Client:
VITE_SUPABASE_URL=https://[project-ref].supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Jika aplikasi dideploy ke **Cloudflare Pages**:
1. Masuk ke dashboard Cloudflare &rarr; **Workers & Pages** &rarr; `operator-kaplongan`.
2. Masuk ke **Settings** &rarr; **Environment variables**.
3. Tambahkan variabel:
   - `SUPABASE_URL`: URL proyek Supabase Anda.
   - `SUPABASE_ANON_KEY`: Anon Key Supabase Anda.
4. Lakukan redeploy.

---

## 🐘 Langkah 6: (Opsional) Sambungkan Backend Laravel ke Supabase PostgreSQL

Jika Anda menjalankan backend Laravel 11 (`routes/api.php`), Anda dapat langsung menggunakan PostgreSQL Supabase sebagai database utama Laravel:

Di file `.env` backend Laravel:
```ini
DB_CONNECTION=pgsql
DB_HOST=aws-0-ap-southeast-1.pooler.supabase.com
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres.[project-ref]
DB_PASSWORD=[password-database-supabase-anda]
DB_SSLMODE=require
```

> **Catatan Pooler Supabase**: Jika koneksi langsung port 5432 dibatasi oleh firewall ISP Anda, gunakan Transaction Pooler port `6543`.

---

## 🛡️ Keamanan & Row Level Security (RLS)

- Seluruh tabel pada `supabase_schema.sql` telah dilengkapi dengan kebijakan **Row Level Security (RLS)** yang aktif.
- Public read, insert, update, dan delete diizinkan untuk key `anon` sekolah, sehingga aplikasi web dapat melakukan sinkronisasi tanpa hambatan otentikasi rumit.
- Replikasi Realtime (`supabase_realtime`) telah diaktifkan untuk seluruh tabel, memungkinkan perubahan dari operator 1 langsung tampil di layar operator 2 atau Kepala Sekolah secara live.

---

## ✅ Verifikasi Akhir

Setelah migrasi selesai:
1. Pastikan indikator status sinkronisasi di Header pojok kanan atas berwarna hijau dengan teks `Supabase HH:mm`.
2. Coba tambahkan atau ubah data di menu **Data GTK** atau **Input Jurnal Harian**.
3. Buka **Table Editor** di Supabase Dashboard untuk memastikan data langsung tercatat di tabel PostgreSQL.

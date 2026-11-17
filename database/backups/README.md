# Dokumentasi & Panduan Backup Database SIM-OPS SMA NU Kaplongan

Direktori ini memuat arsip cadangan (backup) data PostgreSQL Supabase Cloud resmi untuk **SMA NU Kaplongan**.

## 📌 Identitas Sekolah & Penanggung Jawab
- **Nama Sekolah**: SMA NU Kaplongan (Indramayu, Jawa Barat)
- **NPSN**: 20216007 • **Akreditasi**: A
- **Kepala Sekolah**: Drs. H. Toufik Zaenal Mustofa, M.Pd.I
- **Koordinator Operator**: Bagas Pratama, S.Kom (NIP/NUPTK: 199104152020121008)
- **Supabase Project**: `SIM-OPS SMA` (`qyiurmxyoqbyfounrttq`)

---

## 📁 Berkas Backup Aktif
1. **`latest_backup.sql`**: Dump SQL PostgreSQL lengkap (Tabel `sekolah`, `gtk`, `rombel`, `mapel`, `siswa`, `jurnal_harian`, `jurnal_aktivitas`, `aktivitas_timeline`, `simops_sync_state`).
2. **`latest_backup.json`**: Snapshot data format JSON terstruktur lengkap dengan metadata tanggal dan ringkasan baris.
3. Berkas backup historis otomatis disimpan dengan format nama: `backup_simops_smanukaplongan_YYYYMMDD_HHmmss.[sql|json]`.

---

## 🔄 Cara Menjalankan Backup Baru Sewaktu-waktu
Cukup jalankan perintah PowerShell berikut di terminal:
```powershell
powershell -ExecutionPolicy Bypass -File database\export_backup.ps1
```
Skrip akan otomatis mengunduh 100% data live dari Supabase Cloud dan memperbarui berkas `latest_backup.sql` serta `latest_backup.json`.

---

## 📥 Cara Restore (Pemulihan Data)
### Opsi 1: Lewat Supabase SQL Editor
1. Buka dashboard Supabase: [https://supabase.com/dashboard/project/qyiurmxyoqbyfounrttq/sql](https://supabase.com/dashboard/project/qyiurmxyoqbyfounrttq/sql)
2. Buka berkas `latest_backup.sql` dengan teks editor, copy seluruh isinya.
3. Paste ke dalam **SQL Editor** Supabase, lalu klik tombol **Run**.

### Opsi 2: Lewat Frontend SIM-OPS SMA
Masuk ke menu **Laporan & Jadwal** -> Tab **Database Cloud**, lalu klik tombol **Tarik Data Cloud (Pull)** untuk menyinkronkan data langsung ke aplikasi.

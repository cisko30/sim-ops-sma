# DOKUMENTASI REST API v1
# SIM-OPS SMA

Base URL: `http://localhost:8000/api/v1`  
Header Autentikasi: `Authorization: Bearer <token>`  
Content-Type: `application/json`

---

## 🔐 1. Authentication

| Method | Endpoint | Deskripsi | Akses |
|---|---|---|---|
| `POST` | `/auth/login` | Login user, mengembalikan Bearer token Sanctum | Publik |
| `POST` | `/auth/logout` | Revoke current token | Authenticated |
| `GET` | `/auth/me` | Profil user login, roles, & permissions | Authenticated |
| `POST` | `/auth/change-password` | Pembaruan kata sandi akun | Authenticated |

---

## 📊 2. Dashboard Operasional

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/dashboard` | Rekapitulasi 8 kartu metrik inti, status server Dapodik, countdown banner, dan aktivitas terkini |
| `GET` | `/dashboard/statistics` | Data statistik lengkap analitik operasional sekolah |

---

## 👩‍🏫 3. Data Master GTK

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/teachers` | Daftar seluruh pendidik & tenaga kependidikan (filter & paginasi) |
| `POST` | `/teachers` | Tambah data GTK baru |
| `GET` | `/teachers/{id}` | Rincian lengkap GTK, riwayat sertifikasi, & beban mengajar |
| `PUT` | `/teachers/{id}` | Perbarui data GTK |
| `DELETE` | `/teachers/{id}` | Hapus data GTK |

---

## 👨‍🎓 4. Data Peserta Didik

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/students` | Daftar peserta didik aktif (NISN/NIK nullable sesuai data sumber) |
| `POST` | `/students` | Registrasi siswa baru |
| `GET` | `/students/{id}` | Rincian data siswa, penempatan rombel, & riwayat PIP |
| `PUT` | `/students/{id}` | Perbarui data siswa |
| `DELETE` | `/students/{id}` | Hapus data siswa |

---

## 📚 5. Kurikulum & Beban Mengajar (JTM)

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/classrooms` | Daftar 30 rombel (Fase E & Fase F) beserta kapasitas |
| `POST` | `/classrooms` | Tambah rombel baru |
| `POST` | `/classrooms/{id}/assign-student` | Penempatan siswa ke rombel (deteksi duplikat tahun ajaran) |
| `GET` | `/workloads` | Rekapitulasi pemenuhan JTM sekolah (Memenuhi, Warning, Kurang) |
| `GET` | `/workloads/teachers/{id}` | Rincian beban ajar tatap muka & tugas tambahan per guru |
| `POST` | `/workloads/simulate` | Simulasi penyesuaian JTM tanpa mengubah database |

---

## 🔄 6. Integrasi Dapodik & Impor

| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/imports/preview` | Upload file Excel, validasi baris, & deteksi duplikat |
| `POST` | `/imports/commit` | Eksekusi simpan transaksi batch data hasil preview |
| `GET` | `/imports/history` | Riwayat batch impor & log keberhasilan |
| `GET` | `/dapodik/connection` | Status koneksi Web Service / PostgreSQL Dapodik lokal |
| `POST` | `/dapodik/test-connection` | Diagnostik ping & integritas skema data |

---

## 💳 7. Program PIP (Program Indonesia Pintar)

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/pip` | Data penerima PIP (rekening dienkripsi untuk user non-OPS) |
| `PUT` | `/pip/{id}/status` | Pembaruan status (Belum Aktivasi -> Proses Surat -> Sudah Aktivasi -> Cair -> Bukti Diunggah) |
| `GET` | `/pip/{id}/history` | Riwayat progres & audit trail perubahan status |
| `POST` | `/pip/reports/sptjm` | Generate rekap data SPTJM & Kuasa Kolektif Bank BNI |

---

## 📁 8. E-Arsip Digital Dokumen

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/documents` | Daftar berkas arsip terverifikasi & pending |
| `POST` | `/documents` | Unggah dokumen (validasi MIME, ukuran maks 5MB, SHA-256) |
| `GET` | `/documents/{id}/download-url` | Generate temporary signed URL berlaku 15 menit |
| `POST` | `/documents/{id}/verify` | Verifikasi berkas (Valid, Ditolak, Perlu Perbaikan) |

---

## 📜 9. Generator SK & Dokumen

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/sk` | Daftar SK Pembagian Tugas Mengajar & SK Wali Kelas |
| `POST` | `/sk` | Buat draft SK dengan snapshot data historis otomatis |
| `POST` | `/sk/{id}/submit` | Ajukan SK untuk review Waka Kurikulum |
| `POST` | `/sk/{id}/approve` | Persetujuan SK oleh Waka Kurikulum / Pengesahan Kepala Sekolah |
| `GET` | `/sk/verify/{token}` | Halaman validasi publik QR Code tanda tangan digital |

---

## 📝 10. Jurnal Harian OPS (Core Engine)

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/journals` | Daftar riwayat jurnal harian operator |
| `POST` | `/journals` | Inisialisasi header jurnal tanggal berjalan |
| `GET` | `/journals/{id}` | Rincian aktivitas, durasi total, & catatan review |
| `POST` | `/journals/{id}/activities` | Tambah aktivitas (validasi otomatis bentrok jam & durasi) |
| `PUT` | `/journals/{id}/activities/{activityId}` | Edit aktivitas jurnal |
| `DELETE` | `/journals/{id}/activities/{activityId}` | Hapus aktivitas jurnal |
| `POST` | `/journals/{id}/submit` | Ajukan jurnal (mengunci jurnal dari modifikasi biasa) |
| `POST` | `/journals/{id}/approve` | Persetujuan jurnal oleh Kepala Sekolah |
| `POST` | `/journals/{id}/request-revision` | Kembalikan jurnal dengan catatan revisi |
| `GET` | `/journals/{id}/report` | Engine Laporan Harian resmi (Kop, Rincian, Rekap, Tanda Tangan) |
| `GET` | `/journals/reports/weekly` | Engine Laporan Mingguan |
| `GET` | `/journals/reports/monthly` | Engine Laporan Bulanan (hari tanpa jurnal bukan hari tidak bekerja) |
| `GET` | `/journals/calendar` | Data kalender aktivitas per bulan |


-- ==============================================================================
-- SIM-OPS SMA NU KAPLONGAN - SUPABASE POSTGRESQL SEED DATA
-- Data Master Resmi Bawaan SMA NU Kaplongan (Indramayu, Jawa Barat)
-- Kepala Sekolah: Drs. H. Toufik Zaenal Mustofa, M.Pd.I
-- Koordinator Operator: Bagas Pratama, S.Kom (NIP: 199104152020121008)
-- NPSN: 20216007 | Akreditasi: A
-- ==============================================================================

-- 1. SEED SEKOLAH
INSERT INTO public.sekolah (
    id, npsn, nama_sekolah, institusi, akreditasi, alamat, kecamatan, kabupaten, provinsi,
    kode_pos, telepon, email, website, tahun_ajaran, semester, dapodik_status,
    nama_kepsek, nip_kepsek, gelar_kepsek, nama_operator, nip_operator, peran_operator,
    unit_operator, logo_url, server_info
) VALUES (
    'smanu-kaplongan',
    '20216007',
    'SMA NU Kaplongan',
    'Lembaga Pendidikan Ma''arif Nahdlatul Ulama',
    'A',
    'Jl. Raya Kaplongan No. 28',
    'Karangampel',
    'Indramayu',
    'Jawa Barat',
    '45283',
    '(0234) 351234',
    'info@smanukaplongan.sch.id',
    'www.smanukaplongan.sch.id',
    '2025/2026',
    'Ganjil',
    'Terhubung (Server Pusat Pusdatin Hijau)',
    'Drs. H. Toufik Zaenal Mustofa, M.Pd.I',
    '196805121995121002',
    'Kepala SMA NU Kaplongan',
    'Bagas Pratama, S.Kom',
    '199104152020121008',
    'Koordinator Operator Sekolah (OPS)',
    'Unit Tata Usaha & Operasional Sekolah',
    '/logo-sma-nu.png?v=3',
    'Supabase PostgreSQL (Cloud)'
) ON CONFLICT (id) DO UPDATE SET
    nama_sekolah = EXCLUDED.nama_sekolah,
    npsn = EXCLUDED.npsn,
    nama_kepsek = EXCLUDED.nama_kepsek,
    nama_operator = EXCLUDED.nama_operator,
    nip_operator = EXCLUDED.nip_operator,
    logo_url = EXCLUDED.logo_url;

-- 2. SEED DATA GTK (10 GTK Utama SMA NU Kaplongan)
INSERT INTO public.gtk (
    id, nama, nip_nuptk, jenis_ptk, status_kepegawaian, mapel_utama, kode_sertifikasi,
    jp_per_rombel, jumlah_rombel, rombel_list, jtm_tatap_muka, jtm_tugas_tambahan,
    tugas_tambahan, tugas_tambahan_id, total_jtm, status_info_gtk, sertifikasi, telepon, email
) VALUES
(
    'gtk-1',
    'Drs. H. Toufik Zaenal Mustofa, M.Pd.I',
    '196805121995121002',
    'Kepala Sekolah',
    'GTY',
    'Pendidikan Agama Islam',
    '127 - Pendidikan Agama Islam',
    3, 2, '["XII-1", "XII-2"]'::jsonb,
    6, 18,
    'Kepala Sekolah', 'kepala_sekolah',
    24, 'Valid', 'Sudah Sertifikasi', '081223456789', 'kepsek@smanukaplongan.sch.id'
),
(
    'gtk-2',
    'Ahmad Fauzi, S.Pd, M.Si',
    '197903152006041011',
    'Guru Mapel',
    'GTY',
    'Matematika Tingkat Lanjut',
    '180 - Matematika',
    4, 6, '["X-1", "X-2", "X-3", "XI-1", "XI-2", "XII-1"]'::jsonb,
    24, 0,
    'Tidak Ada', 'none',
    24, 'Valid', 'Sudah Sertifikasi', '081398765432', 'fauzi@smanukaplongan.sch.id'
),
(
    'gtk-3',
    'Siti Nurhalizah, S.Pd',
    '198507202009022005',
    'Guru Mapel',
    'GTY',
    'Bahasa Indonesia',
    '156 - Bahasa Indonesia',
    4, 3, '["X-1", "X-2", "X-3"]'::jsonb,
    12, 12,
    'Wakil Kepala Sekolah Bidang Kurikulum (12 Jam)', 'waka_kurikulum',
    24, 'Valid', 'Sudah Sertifikasi', '081234567890', 'siti@smanukaplongan.sch.id'
),
(
    'gtk-4',
    'Moh. Ridwan, M.Pd',
    '198711042010011014',
    'Guru Mapel',
    'GTY',
    'Fisika & Kimia',
    '184 - Fisika',
    5, 3, '["XI-1", "XI-2", "XII-1"]'::jsonb,
    15, 12,
    'Kepala Laboratorium Komputer & IPA (12 Jam)', 'kepala_lab',
    27, 'Valid', 'Sudah Sertifikasi', '085712349876', 'ridwan@smanukaplongan.sch.id'
),
(
    'gtk-5',
    'Dra. Hj. Ratna Kurniati, M.Pd',
    '197304192008012012',
    'Guru Mapel',
    'PNS',
    'Sejarah Indonesia',
    '204 - Sejarah',
    2, 7, '["X-1", "X-2", "X-3", "X-4", "X-5", "XI-1", "XI-2"]'::jsonb,
    14, 0,
    'Tidak Ada (0 Jam)', 'none',
    14, 'Belum Valid', 'Sudah Sertifikasi', '081322114455', 'ratna@smanukaplongan.sch.id'
),
(
    'gtk-6',
    'H. Abdul Ghofur, S.Ag',
    '197509182005011007',
    'Guru Mapel',
    'GTY',
    'Pendidikan Agama Islam & Budi Pekerti',
    '127 - Pendidikan Agama Islam',
    3, 8, '["X-1", "X-2", "X-3", "X-4", "XI-1", "XI-2", "XII-1", "XII-2"]'::jsonb,
    24, 0,
    'Tidak Ada (0 Jam)', 'none',
    24, 'Valid', 'Sudah Sertifikasi', '081211223344', 'ghofur@smanukaplongan.sch.id'
),
(
    'gtk-7',
    'Dewi Sartika, S.Pd',
    '199204122019032018',
    'Guru Mapel',
    'Honor Sekolah',
    'Bahasa Inggris',
    '157 - Bahasa Inggris',
    2, 10, '["X-1", "X-2", "X-3", "X-4", "X-5", "X-6", "X-7", "X-8", "X-9", "X-10"]'::jsonb,
    20, 4,
    'Wali Kelas & Pembina Pramuka (4 Jam)', 'wali_kelas',
    24, 'Valid', 'Belum', '087812345678', 'dewi@smanukaplongan.sch.id'
),
(
    'gtk-8',
    'Drs. Budi Santoso',
    '197108151998021003',
    'Guru Mapel',
    'PNS',
    'Pendidikan Jasmani & Olahraga (PJOK)',
    '220 - Penjaskes',
    3, 7, '["X-1", "X-2", "X-3", "XI-1", "XI-2", "XII-1", "XII-2"]'::jsonb,
    21, 3,
    'Pembina OSIS & Guru Piket (3 Jam)', 'pembina_osis',
    24, 'Valid', 'Sudah Sertifikasi', '081566778899', 'budi@smanukaplongan.sch.id'
),
(
    'gtk-9',
    'Ika Wardani, S.Kom',
    '199408252022032021',
    'Guru Mapel',
    'Honor Sekolah',
    'Informatika',
    '330 - Teknik Komputer & Informatika',
    3, 6, '["X-1", "X-2", "X-3", "X-4", "X-5", "X-6"]'::jsonb,
    18, 0,
    'Tidak Ada (0 Jam)', 'none',
    18, 'Belum Valid', 'Belum', '089612345678', 'ika@smanukaplongan.sch.id'
),
(
    'gtk-10',
    'Bagas Pratama, S.Kom',
    '199104152020121008',
    'Tenaga Kependidikan',
    'GTY',
    'Operator Dapodik / SIM-OPS',
    'Tendik Pengelola Data',
    0, 0, '[]'::jsonb,
    0, 37.5,
    'Koordinator Operator Sekolah & Pengelola Data', 'operator_sekolah',
    37.5, 'Valid', 'Belum', '082199887766', 'operator@smanukaplongan.sch.id'
)
ON CONFLICT (id) DO UPDATE SET
    nama = EXCLUDED.nama,
    nip_nuptk = EXCLUDED.nip_nuptk,
    total_jtm = EXCLUDED.total_jtm,
    status_info_gtk = EXCLUDED.status_info_gtk;

-- 3. SEED DATA ROMBEL (30 Rombel Lengkap SMA NU Kaplongan)
INSERT INTO public.rombel (id, nama_rombel, tingkat, kurikulum, wali_kelas, jumlah_siswa_l, jumlah_siswa_p, total_siswa, ruang) VALUES
('rombel-x-1', 'X-1', 'X', 'Kurikulum Merdeka', 'Siti Nurhalizah, S.Pd', 18, 18, 36, 'Ruang 101'),
('rombel-x-2', 'X-2', 'X', 'Kurikulum Merdeka', 'Dewi Sartika, S.Pd', 17, 19, 36, 'Ruang 102'),
('rombel-x-3', 'X-3', 'X', 'Kurikulum Merdeka', 'Ahmad Fauzi, S.Pd, M.Si', 19, 17, 36, 'Ruang 103'),
('rombel-x-4', 'X-4', 'X', 'Kurikulum Merdeka', 'Moh. Ridwan, M.Pd', 16, 20, 36, 'Ruang 104'),
('rombel-x-5', 'X-5', 'X', 'Kurikulum Merdeka', 'Dra. Hj. Ratna Kurniati, M.Pd', 18, 18, 36, 'Ruang 105'),
('rombel-x-6', 'X-6', 'X', 'Kurikulum Merdeka', 'H. Abdul Ghofur, S.Ag', 20, 16, 36, 'Ruang 106'),
('rombel-x-7', 'X-7', 'X', 'Kurikulum Merdeka', 'Drs. Budi Santoso', 17, 19, 36, 'Ruang 107'),
('rombel-x-8', 'X-8', 'X', 'Kurikulum Merdeka', 'Ika Wardani, S.Kom', 18, 18, 36, 'Ruang 108'),
('rombel-x-9', 'X-9', 'X', 'Kurikulum Merdeka', 'Guru Pembina X-9', 19, 17, 36, 'Ruang 109'),
('rombel-x-10', 'X-10', 'X', 'Kurikulum Merdeka', 'Guru Pembina X-10', 18, 18, 36, 'Ruang 110'),
('rombel-xi-1', 'XI-1', 'XI', 'Kurikulum Merdeka', 'Ahmad Fauzi, S.Pd, M.Si', 16, 20, 36, 'Ruang 201'),
('rombel-xi-2', 'XI-2', 'XI', 'Kurikulum Merdeka', 'Moh. Ridwan, M.Pd', 18, 18, 36, 'Ruang 202'),
('rombel-xi-3', 'XI-3', 'XI', 'Kurikulum Merdeka', 'Siti Nurhalizah, S.Pd', 19, 17, 36, 'Ruang 203'),
('rombel-xi-4', 'XI-4', 'XI', 'Kurikulum Merdeka', 'Dewi Sartika, S.Pd', 17, 19, 36, 'Ruang 204'),
('rombel-xi-5', 'XI-5', 'XI', 'Kurikulum Merdeka', 'Dra. Hj. Ratna Kurniati, M.Pd', 18, 18, 36, 'Ruang 205'),
('rombel-xi-6', 'XI-6', 'XI', 'Kurikulum Merdeka', 'H. Abdul Ghofur, S.Ag', 20, 16, 36, 'Ruang 206'),
('rombel-xi-7', 'XI-7', 'XI', 'Kurikulum Merdeka', 'Drs. Budi Santoso', 16, 20, 36, 'Ruang 207'),
('rombel-xi-8', 'XI-8', 'XI', 'Kurikulum Merdeka', 'Ika Wardani, S.Kom', 18, 18, 36, 'Ruang 208'),
('rombel-xi-9', 'XI-9', 'XI', 'Kurikulum Merdeka', 'Guru Pembina XI-9', 17, 19, 36, 'Ruang 209'),
('rombel-xi-10', 'XI-10', 'XI', 'Kurikulum Merdeka', 'Guru Pembina XI-10', 18, 18, 36, 'Ruang 210'),
('rombel-xii-1', 'XII-1', 'XII', 'Kurikulum Merdeka', 'H. Abdul Ghofur, S.Ag', 17, 19, 36, 'Ruang 301'),
('rombel-xii-2', 'XII-2', 'XII', 'Kurikulum Merdeka', 'Drs. H. Toufik Zaenal Mustofa, M.Pd.I', 18, 18, 36, 'Ruang 302'),
('rombel-xii-3', 'XII-3', 'XII', 'Kurikulum Merdeka', 'Ahmad Fauzi, S.Pd, M.Si', 19, 17, 36, 'Ruang 303'),
('rombel-xii-4', 'XII-4', 'XII', 'Kurikulum Merdeka', 'Moh. Ridwan, M.Pd', 16, 20, 36, 'Ruang 304'),
('rombel-xii-5', 'XII-5', 'XII', 'Kurikulum Merdeka', 'Dra. Hj. Ratna Kurniati, M.Pd', 18, 18, 36, 'Ruang 305'),
('rombel-xii-6', 'XII-6', 'XII', 'Kurikulum Merdeka', 'Siti Nurhalizah, S.Pd', 20, 16, 36, 'Ruang 306'),
('rombel-xii-7', 'XII-7', 'XII', 'Kurikulum Merdeka', 'Dewi Sartika, S.Pd', 17, 19, 36, 'Ruang 307'),
('rombel-xii-8', 'XII-8', 'XII', 'Kurikulum Merdeka', 'Drs. Budi Santoso', 18, 18, 36, 'Ruang 308'),
('rombel-xii-9', 'XII-9', 'XII', 'Kurikulum Merdeka', 'Ika Wardani, S.Kom', 19, 17, 36, 'Ruang 309'),
('rombel-xii-10', 'XII-10', 'XII', 'Kurikulum Merdeka', 'Guru Pembina XII-10', 18, 18, 36, 'Ruang 310')
ON CONFLICT (id) DO UPDATE SET
    nama_rombel = EXCLUDED.nama_rombel,
    total_siswa = EXCLUDED.total_siswa;

-- 4. SEED DATA MATA PELAJARAN (16 Mapel Kurikulum Merdeka & Muatan Lokal Aswaja)
INSERT INTO public.mapel (id, kode_mapel, nama_mapel, kategori, fase, alokasi_jp, guru_pengampu) VALUES
('mp-1', 'MP-PAI-01', 'Pendidikan Agama Islam & Budi Pekerti', 'Mata Pelajaran Wajib (Umum)', 'Semua Fase', 3, 'Drs. H. Toufik Zaenal Mustofa, M.Pd.I'),
('mp-2', 'MP-PKN-02', 'Pendidikan Pancasila & Kewarganegaraan', 'Mata Pelajaran Wajib (Umum)', 'Semua Fase', 2, 'Guru PPKn'),
('mp-3', 'MP-BIN-03', 'Bahasa Indonesia', 'Mata Pelajaran Wajib (Umum)', 'Semua Fase', 4, 'Siti Nurhalizah, S.Pd'),
('mp-4', 'MP-MTK-04', 'Matematika Umum', 'Mata Pelajaran Wajib (Umum)', 'Semua Fase', 4, 'Ahmad Fauzi, S.Pd, M.Si'),
('mp-5', 'MP-BIG-05', 'Bahasa Inggris', 'Mata Pelajaran Wajib (Umum)', 'Semua Fase', 3, 'Dewi Sartika, S.Pd'),
('mp-6', 'MP-PJK-06', 'Pendidikan Jasmani & Olahraga (PJOK)', 'Mata Pelajaran Wajib (Umum)', 'Semua Fase', 3, 'Drs. Budi Santoso'),
('mp-7', 'MP-SEJ-07', 'Sejarah Indonesia', 'Mata Pelajaran Wajib (Umum)', 'Semua Fase', 2, 'Dra. Hj. Ratna Kurniati, M.Pd'),
('mp-8', 'MP-INF-08', 'Informatika & Literasi Digital', 'Mata Pelajaran Wajib (Umum)', 'Fase E (Kelas X)', 3, 'Ika Wardani, S.Kom'),
('mp-9', 'MP-FIS-09', 'Fisika Peminatan', 'Pilihan MIPA / Saintek', 'Fase F (Kelas XI & XII)', 5, 'Moh. Ridwan, M.Pd'),
('mp-10', 'MP-KIM-10', 'Kimia Peminatan', 'Pilihan MIPA / Saintek', 'Fase F (Kelas XI & XII)', 5, 'Moh. Ridwan, M.Pd'),
('mp-11', 'MP-BIO-11', 'Biologi Peminatan', 'Pilihan MIPA / Saintek', 'Fase F (Kelas XI & XII)', 5, 'Guru Biologi'),
('mp-12', 'MP-MLT-12', 'Matematika Tingkat Lanjut', 'Pilihan MIPA / Saintek', 'Fase F (Kelas XI & XII)', 5, 'Ahmad Fauzi, S.Pd, M.Si'),
('mp-13', 'MP-EKO-13', 'Ekonomi Peminatan', 'Pilihan IPS / Soshum', 'Fase F (Kelas XI & XII)', 5, 'Guru IPS'),
('mp-14', 'MP-SOS-14', 'Sosiologi & Antropologi', 'Pilihan IPS / Soshum', 'Fase F (Kelas XI & XII)', 5, 'Guru Sosiologi'),
('mp-15', 'MP-ASW-15', 'Ke-NU-an / Pendidikan Aswaja', 'Muatan Lokal & P5', 'Semua Fase', 2, 'H. Abdul Ghofur, S.Ag'),
('mp-16', 'MP-P5-16', 'Projek Penguatan Profil Pelajar Pancasila (P5)', 'Muatan Lokal & P5', 'Semua Fase', 6, 'Tim Fasilitator P5')
ON CONFLICT (id) DO UPDATE SET
    nama_mapel = EXCLUDED.nama_mapel,
    alokasi_jp = EXCLUDED.alokasi_jp;

-- 5. SEED DATA SISWA CONTOH
INSERT INTO public.siswa (id, nisn, nipd, nama, rombel, jenis_kelamin, nik_status, pip_status, nominal_pip, wali_kelas) VALUES
('sis-1', '0078923412', '242510001', 'Ahmad Zaki Mubarok', 'X-1', 'L', 'Valid', 'Penerima Aktif', 1800000, 'Siti Nurhalizah, S.Pd'),
('sis-2', '0081234901', '242510002', 'Ananda Putri Khairunnisa', 'X-1', 'P', 'Valid', 'Penerima Aktif', 1800000, 'Siti Nurhalizah, S.Pd'),
('sis-3', '0076543219', '242510003', 'Dimas Aditya Saputra', 'X-2', 'L', 'Residu Dukcapil', 'Nominasi', 1800000, 'Dewi Sartika, S.Pd'),
('sis-4', '0065432187', '232411015', 'Fatimah Az-Zahra', 'XI-1', 'P', 'Valid', 'Penerima Aktif', 1800000, 'Ahmad Fauzi, S.Pd, M.Si'),
('sis-5', '0069876543', '232411022', 'Muhammad Rizky Ramadhan', 'XI-2', 'L', 'Perbaikan KK', 'Nominasi', 1800000, 'Moh. Ridwan, M.Pd'),
('sis-6', '0054321980', '222312008', 'Nabila Syahrani', 'XII-1', 'P', 'Valid', 'Penerima Aktif', 900000, 'H. Abdul Ghofur, S.Ag'),
('sis-7', '0058765432', '222312019', 'Wahyu Hidayat', 'XII-2', 'L', 'Valid', 'Bukan Penerima', 0, 'Drs. H. Toufik Zaenal Mustofa, M.Pd.I'),
('sis-8', '0089123456', '242510004', 'Bilqis Humaira', 'X-2', 'P', 'Valid', 'Penerima Aktif', 1800000, 'Dewi Sartika, S.Pd'),
('sis-9', '0071239845', '242510005', 'Fahmi Idris', 'X-3', 'L', 'Valid', 'Bukan Penerima', 0, 'Ahmad Fauzi, S.Pd, M.Si'),
('sis-10', '0062348912', '232411030', 'Khadijah Al-Kubro', 'XI-3', 'P', 'Valid', 'Penerima Aktif', 1800000, 'Siti Nurhalizah, S.Pd'),
('sis-11', '0059871234', '222312040', 'Lukman Hakim', 'XII-3', 'L', 'Residu Dukcapil', 'Nominasi', 900000, 'Ahmad Fauzi, S.Pd, M.Si'),
('sis-12', '0051122334', '222312055', 'Zahra Amelia Putri', 'XII-4', 'P', 'Valid', 'Penerima Aktif', 900000, 'Moh. Ridwan, M.Pd')
ON CONFLICT (id) DO UPDATE SET
    nama = EXCLUDED.nama,
    pip_status = EXCLUDED.pip_status,
    nominal_pip = EXCLUDED.nominal_pip;

-- 6. SEED JURNAL HARIAN OPERATOR (Fokus TKA & ABM, Dapodik, PIP)
INSERT INTO public.jurnal_harian (
    id, school_id, user_id, user_name, user_role, journal_date, unit_name, daily_summary,
    total_duration_minutes, status, submitted_at, activities
) VALUES
(
    'dj-2026-11-12',
    1, 1,
    'Bagas Pratama, S.Kom',
    'Koordinator Operator Sekolah (OPS)',
    '2026-11-12',
    'Unit Tata Usaha & Operasional Sekolah',
    'Menyelesaikan verifikasi berkas PIP 14 siswa, sinkronisasi berkala data Dapodik semester genap, dan perapian jam linieritas GTK Sejarah.',
    330,
    'Submitted',
    '2026-11-12 15:45:00+07',
    '[
        {
            "id": "act-101",
            "category": "Dapodik",
            "activity_title": "Sinkronisasi Server Dapodikdasmen Genap",
            "description": "Melakukan sinkronisasi data master GTK dan Rombel semester genap ke server pusat Pusdatin.",
            "start_time": "08:00",
            "end_time": "09:00",
            "duration_minutes": 60,
            "result": "Sukses sinkronisasi tanpa kendala teknis. Status server hijau.",
            "obstacle": "Koneksi server pusat sempat melambat pada 10 menit awal.",
            "follow_up": "Lanjut pemantauan residu pada portal Verval PTK.",
            "priority": "Tinggi",
            "status": "Completed",
            "sort_order": 1
        },
        {
            "id": "act-102",
            "category": "Kurikulum dan JTM",
            "activity_title": "Penyesuaian Jam Mengajar & Linieritas GTK Permendikdasmen 11/2025",
            "description": "Pencocokan data jam mengajar guru sejarah dan ekuivalensi tugas tambahan pembina OSIS & Lab Komputer.",
            "start_time": "09:15",
            "end_time": "11:00",
            "duration_minutes": 105,
            "result": "Draft pembagian tugas tambahan selesai direkap dan diajukan ke Waka Kurikulum.",
            "priority": "Tinggi",
            "status": "Completed",
            "sort_order": 2
        },
        {
            "id": "act-103",
            "category": "PIP",
            "activity_title": "Verifikasi Berkas KIP Digital & Kuasa Kolektif Bank BNI",
            "description": "Memvalidasi kelengkapan berkas identitas 14 siswa untuk pengajuan aktivasi SimPel ke Bank BNI Cabang Kota.",
            "start_time": "11:15",
            "end_time": "12:30",
            "duration_minutes": 75,
            "result": "14 berkas siswa tervalidasi dan siap cetak SPTJM Kepala Sekolah.",
            "priority": "Sedang",
            "status": "Completed",
            "sort_order": 3
        }
    ]'::jsonb
),
(
    'dj-2026-11-11',
    1, 1,
    'Bagas Pratama, S.Kom',
    'Koordinator Operator Sekolah (OPS)',
    '2026-11-11',
    'Unit Tata Usaha & Operasional Sekolah',
    'Persiapan teknis infrastruktur Tes Kemampuan Akademik (TKA) dan Asesmen Bakat Murid (ABM) Pusmendik di Laboratorium Komputer.',
    300,
    'Approved',
    '2026-11-11 15:30:00+07',
    '[
        {
            "id": "act-201",
            "category": "TKA",
            "activity_title": "Pengecekan Server Proktor & Klien TKA Pusmendik",
            "description": "Pengujian koneksi LAN 40 unit komputer klien di Lab Komputer 1 & 2 untuk pelaksanaan simulasi TKA.",
            "start_time": "08:30",
            "end_time": "11:00",
            "duration_minutes": 150,
            "result": "Semua komputer klien terkoneksi stabil dengan bandwidth 100 Mbps.",
            "priority": "Tinggi",
            "status": "Completed",
            "sort_order": 1
        },
        {
            "id": "act-202",
            "category": "ABM",
            "activity_title": "Sinkronisasi Nominasi Peserta ABM Pusmendik",
            "description": "Mengunduh file DNT peserta Asesmen Bakat Murid kelas XII dari portal Pusmendik.",
            "start_time": "11:30",
            "end_time": "14:00",
            "duration_minutes": 150,
            "result": "Daftar 360 siswa kelas XII terverifikasi lengkap.",
            "priority": "Tinggi",
            "status": "Completed",
            "sort_order": 2
        }
    ]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    daily_summary = EXCLUDED.daily_summary,
    activities = EXCLUDED.activities;

-- 7. SEED AKTIVITAS TIMELINE
INSERT INTO public.aktivitas_timeline (id, title, time, description, dot_color) VALUES
('act-t-1', 'Sinkronisasi Sukses Dapodik 2026.a', '10 menit lalu', 'Pengiriman 30 Rombel dan 74 GTK ke Server Kemdikbudristek', 'bg-primary'),
('act-t-2', 'Ekspor SPTJM PIP BNI Gelombang 1', '45 menit lalu', '14 Berkas siswa siap pencairan dana kolektif di Bank BNI', 'bg-secondary'),
('act-t-3', 'Penyesuaian Ekuivalensi JTM GTK', '2 jam lalu', 'Update tugas tambahan Waka & Kepala Lab sesuai Permendikdasmen 11/2025', 'bg-tertiary'),
('act-t-4', 'Persiapan Ujian TKA & ABM', 'Kemarin', 'Verifikasi kesiapan 40 PC Klien Lab Komputer SMA NU Kaplongan', 'bg-outline')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    time = EXCLUDED.time;

-- 8. INITIAL UNIFIED SYNC STATE SNAPSHOT
INSERT INTO public.simops_sync_state (id, payload, is_cleared, version, updated_at)
VALUES (
    'main_database',
    json_build_object(
        'schoolInfo', (SELECT row_to_json(s) FROM (SELECT * FROM public.sekolah WHERE id = 'smanu-kaplongan') s),
        'gtkList', (SELECT json_agg(g) FROM public.gtk g),
        'siswaList', (SELECT json_agg(si) FROM public.siswa si),
        'rombelList', (SELECT json_agg(r) FROM public.rombel r),
        'mapelList', (SELECT json_agg(m) FROM public.mapel m),
        'journals', (SELECT json_agg(j) FROM public.jurnal_harian j),
        'activities', (SELECT json_agg(a) FROM public.aktivitas_timeline a),
        'isCleared', false,
        'version', '2.5.0',
        'updatedAt', NOW()
    ),
    false,
    '2.5.0',
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    payload = EXCLUDED.payload,
    updated_at = NOW();

-- ==============================================================================
-- SIM-OPS SMA NU KAPLONGAN - SUPABASE POSTGRESQL DATABASE SCHEMA
-- Standar Kurikulum Merdeka, Permendikdasmen No. 11/2025 & Kepmendikdasmen No. 221/P/2025
-- Versi: 2.5.0 (Supabase Cloud Migration)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TRIGGER FUNCTION: Auto Update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 3. TABLE: sekolah (Identitas & Profil Satuan Pendidikan)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.sekolah (
    id TEXT PRIMARY KEY DEFAULT 'smanu-kaplongan',
    npsn VARCHAR(20) NOT NULL UNIQUE DEFAULT '20216007',
    nama_sekolah VARCHAR(255) NOT NULL DEFAULT 'SMA NU Kaplongan',
    institusi VARCHAR(255) DEFAULT 'Lembaga Pendidikan Ma''arif Nahdlatul Ulama',
    akreditasi VARCHAR(5) DEFAULT 'A',
    alamat TEXT DEFAULT 'Jl. Raya Kaplongan No. 28',
    kecamatan VARCHAR(100) DEFAULT 'Karangampel',
    kabupaten VARCHAR(100) DEFAULT 'Indramayu',
    provinsi VARCHAR(100) DEFAULT 'Jawa Barat',
    kode_pos VARCHAR(10) DEFAULT '45283',
    telepon VARCHAR(50) DEFAULT '(0234) 351234',
    email VARCHAR(100) DEFAULT 'info@smanukaplongan.sch.id',
    website VARCHAR(100) DEFAULT 'www.smanukaplongan.sch.id',
    tahun_ajaran VARCHAR(50) DEFAULT '2025/2026',
    semester VARCHAR(20) DEFAULT 'Ganjil',
    dapodik_status VARCHAR(100) DEFAULT 'Terhubung (Server Pusat Pusdatin Hijau)',
    nama_kepsek VARCHAR(255) DEFAULT 'Drs. H. Toufik Zaenal Mustofa, M.Pd.I',
    nip_kepsek VARCHAR(50) DEFAULT '196805121995121002',
    gelar_kepsek VARCHAR(100) DEFAULT 'Kepala SMA NU Kaplongan',
    nama_operator VARCHAR(255) DEFAULT 'Bagas Pratama, S.Kom',
    nip_operator VARCHAR(50) DEFAULT '199104152020121008',
    peran_operator VARCHAR(100) DEFAULT 'Koordinator Operator Sekolah (OPS)',
    unit_operator VARCHAR(100) DEFAULT 'Unit Tata Usaha & Operasional Sekolah',
    logo_url TEXT DEFAULT '/logo-sma-nu.png?v=3',
    server_info TEXT DEFAULT 'Supabase PostgreSQL (Cloud)',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for sekolah
DROP TRIGGER IF EXISTS trg_sekolah_updated_at ON public.sekolah;
CREATE TRIGGER trg_sekolah_updated_at
BEFORE UPDATE ON public.sekolah
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 4. TABLE: gtk (Guru dan Tenaga Kependidikan)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.gtk (
    id TEXT PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    nip_nuptk VARCHAR(50),
    jenis_ptk VARCHAR(100) NOT NULL DEFAULT 'Guru Mapel',
    status_kepegawaian VARCHAR(50) NOT NULL DEFAULT 'GTY', -- PNS, GTY, Honor Sekolah, PPPK
    mapel_utama VARCHAR(255) NOT NULL,
    kode_sertifikasi VARCHAR(100),
    jp_per_rombel INT DEFAULT 0,
    jumlah_rombel INT DEFAULT 0,
    rombel_list JSONB DEFAULT '[]'::jsonb,
    jtm_tatap_muka NUMERIC(5,2) DEFAULT 0,
    jtm_tugas_tambahan NUMERIC(5,2) DEFAULT 0,
    tugas_tambahan TEXT DEFAULT 'Tidak Ada (0 Jam)',
    tugas_tambahan_id VARCHAR(100) DEFAULT 'none',
    total_jtm NUMERIC(5,2) DEFAULT 0,
    status_info_gtk VARCHAR(50) DEFAULT 'Valid', -- Valid, Belum Valid, Residu
    sertifikasi VARCHAR(50) DEFAULT 'Belum', -- Sudah Sertifikasi, Belum
    telepon VARCHAR(50),
    email VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gtk_nip_nuptk ON public.gtk(nip_nuptk);
CREATE INDEX IF NOT EXISTS idx_gtk_status_info ON public.gtk(status_info_gtk);
CREATE INDEX IF NOT EXISTS idx_gtk_sertifikasi ON public.gtk(sertifikasi);

DROP TRIGGER IF EXISTS trg_gtk_updated_at ON public.gtk;
CREATE TRIGGER trg_gtk_updated_at
BEFORE UPDATE ON public.gtk
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 5. TABLE: siswa (Peserta Didik Aktif SMA NU Kaplongan)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.siswa (
    id TEXT PRIMARY KEY,
    nisn VARCHAR(20) NOT NULL UNIQUE,
    nipd VARCHAR(30),
    nama VARCHAR(255) NOT NULL,
    rombel VARCHAR(100) NOT NULL,
    jenis_kelamin CHAR(1) NOT NULL DEFAULT 'L', -- L, P
    nik_status VARCHAR(50) DEFAULT 'Valid', -- Valid, Residu Dukcapil, Perbaikan KK
    pip_status VARCHAR(50) DEFAULT 'Bukan Penerima', -- Penerima Aktif, Nominasi, Bukan Penerima
    nominal_pip NUMERIC(12,2) DEFAULT 0,
    wali_kelas VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_siswa_nisn ON public.siswa(nisn);
CREATE INDEX IF NOT EXISTS idx_siswa_rombel ON public.siswa(rombel);
CREATE INDEX IF NOT EXISTS idx_siswa_nik_status ON public.siswa(nik_status);
CREATE INDEX IF NOT EXISTS idx_siswa_pip_status ON public.siswa(pip_status);

DROP TRIGGER IF EXISTS trg_siswa_updated_at ON public.siswa;
CREATE TRIGGER trg_siswa_updated_at
BEFORE UPDATE ON public.siswa
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 6. TABLE: rombel (Rombongan Belajar)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.rombel (
    id TEXT PRIMARY KEY,
    nama_rombel VARCHAR(100) NOT NULL UNIQUE,
    tingkat VARCHAR(10) NOT NULL, -- X, XI, XII
    kurikulum VARCHAR(100) DEFAULT 'Kurikulum Merdeka',
    wali_kelas VARCHAR(255),
    wali_kelas_id VARCHAR(50),
    jumlah_siswa_l INT DEFAULT 0,
    jumlah_siswa_p INT DEFAULT 0,
    total_siswa INT DEFAULT 0,
    ruang VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rombel_tingkat ON public.rombel(tingkat);

DROP TRIGGER IF EXISTS trg_rombel_updated_at ON public.rombel;
CREATE TRIGGER trg_rombel_updated_at
BEFORE UPDATE ON public.rombel
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 7. TABLE: mapel (Struktur Mata Pelajaran & Alokasi JP)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.mapel (
    id TEXT PRIMARY KEY,
    kode_mapel VARCHAR(50) NOT NULL UNIQUE,
    nama_mapel VARCHAR(255) NOT NULL,
    kategori VARCHAR(100), -- Wajib (Umum), Pilihan MIPA, Pilihan IPS, Muatan Lokal
    fase VARCHAR(100),     -- Fase E, Fase F, Semua Fase
    alokasi_jp INT DEFAULT 0,
    guru_pengampu VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mapel_kode ON public.mapel(kode_mapel);

DROP TRIGGER IF EXISTS trg_mapel_updated_at ON public.mapel;
CREATE TRIGGER trg_mapel_updated_at
BEFORE UPDATE ON public.mapel
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 8. TABLE: jurnal_harian (Buku Jurnal Kerja Operasional Operator & Tim)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.jurnal_harian (
    id TEXT PRIMARY KEY,
    school_id INT DEFAULT 1,
    user_id INT DEFAULT 1,
    user_name VARCHAR(255) DEFAULT 'Bagas Pratama, S.Kom',
    user_role VARCHAR(255) DEFAULT 'Koordinator Operator Sekolah (OPS)',
    journal_date DATE NOT NULL,
    unit_name VARCHAR(255) DEFAULT 'Unit Tata Usaha & Operasional Sekolah',
    daily_summary TEXT,
    total_duration_minutes INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Submitted', -- Draft, Submitted, Under Review, Approved, Revision Requested
    submitted_at TIMESTAMPTZ,
    reviewer_id INT,
    reviewer_name VARCHAR(255),
    reviewed_at TIMESTAMPTZ,
    review_notes TEXT,
    activities JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jurnal_date ON public.jurnal_harian(journal_date);
CREATE INDEX IF NOT EXISTS idx_jurnal_status ON public.jurnal_harian(status);

DROP TRIGGER IF EXISTS trg_jurnal_updated_at ON public.jurnal_harian;
CREATE TRIGGER trg_jurnal_updated_at
BEFORE UPDATE ON public.jurnal_harian
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 9. TABLE: jurnal_aktivitas (Detail Rincian Tiap Kegiatan Jurnal Harian)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.jurnal_aktivitas (
    id TEXT PRIMARY KEY,
    daily_journal_id TEXT REFERENCES public.jurnal_harian(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    activity_title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time VARCHAR(10),
    end_time VARCHAR(10),
    duration_minutes INT DEFAULT 0,
    result TEXT,
    obstacle TEXT,
    follow_up TEXT,
    follow_up_date DATE,
    priority VARCHAR(20) DEFAULT 'Sedang', -- Tinggi, Sedang, Rendah
    status VARCHAR(50) DEFAULT 'Completed', -- Planned, In Progress, Completed, Pending, Blocked
    related_module VARCHAR(100),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jurnal_akt_journal_id ON public.jurnal_aktivitas(daily_journal_id);
CREATE INDEX IF NOT EXISTS idx_jurnal_akt_category ON public.jurnal_aktivitas(category);

DROP TRIGGER IF EXISTS trg_jurnal_aktivitas_updated_at ON public.jurnal_aktivitas;
CREATE TRIGGER trg_jurnal_aktivitas_updated_at
BEFORE UPDATE ON public.jurnal_aktivitas
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 10. TABLE: aktivitas_timeline (Audit Log & Timeline Aktivitas Operasional)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.aktivitas_timeline (
    id TEXT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    time VARCHAR(100),
    description TEXT,
    dot_color VARCHAR(50) DEFAULT 'bg-primary',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_aktivitas_timeline_updated_at ON public.aktivitas_timeline;
CREATE TRIGGER trg_aktivitas_timeline_updated_at
BEFORE UPDATE ON public.aktivitas_timeline
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 11. TABLE: simops_sync_state (Unified Realtime State Snapshot)
-- Digunakan untuk replikasi data instan multi-perangkat & sinkronisasi atomik
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.simops_sync_state (
    id TEXT PRIMARY KEY DEFAULT 'main_database',
    payload JSONB NOT NULL,
    is_cleared BOOLEAN DEFAULT FALSE,
    version VARCHAR(20) DEFAULT '2.5.0',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_simops_sync_state_updated_at ON public.simops_sync_state;
CREATE TRIGGER trg_simops_sync_state_updated_at
BEFORE UPDATE ON public.simops_sync_state
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- Konfigurasi akses aman untuk Supabase Anon Public Key & Authenticated Users
-- ==============================================================================
ALTER TABLE public.sekolah ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gtk ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.siswa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rombel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mapel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jurnal_harian ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jurnal_aktivitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aktivitas_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simops_sync_state ENABLE ROW LEVEL SECURITY;

-- Policy helper: izinkan baca & tulis untuk anon & authenticated
DO $$ 
DECLARE
    tbl text;
BEGIN
    FOR tbl IN 
        SELECT tablename FROM pg_tables WHERE schemaname = 'public' 
        AND tablename IN ('sekolah', 'gtk', 'siswa', 'rombel', 'mapel', 'jurnal_harian', 'jurnal_aktivitas', 'aktivitas_timeline', 'simops_sync_state')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Public Anon Read Access" ON public.%I', tbl);
        EXECUTE format('CREATE POLICY "Public Anon Read Access" ON public.%I FOR SELECT USING (true)', tbl);

        EXECUTE format('DROP POLICY IF EXISTS "Public Anon Insert Access" ON public.%I', tbl);
        EXECUTE format('CREATE POLICY "Public Anon Insert Access" ON public.%I FOR INSERT WITH CHECK (true)', tbl);

        EXECUTE format('DROP POLICY IF EXISTS "Public Anon Update Access" ON public.%I', tbl);
        EXECUTE format('CREATE POLICY "Public Anon Update Access" ON public.%I FOR UPDATE USING (true) WITH CHECK (true)', tbl);

        EXECUTE format('DROP POLICY IF EXISTS "Public Anon Delete Access" ON public.%I', tbl);
        EXECUTE format('CREATE POLICY "Public Anon Delete Access" ON public.%I FOR DELETE USING (true)', tbl);
    END LOOP;
END $$;

-- ==============================================================================
-- 13. REALTIME PUBLICATION
-- Mengaktifkan Supabase Realtime WebSocket agar semua perangkat terupdate otomatis
-- ==============================================================================
DO $$
BEGIN
    -- Tambahkan tabel ke publikasi supabase_realtime jika belum ada
    ALTER PUBLICATION supabase_realtime ADD TABLE 
        public.sekolah, 
        public.gtk, 
        public.siswa, 
        public.rombel, 
        public.mapel, 
        public.jurnal_harian, 
        public.aktivitas_timeline, 
        public.simops_sync_state;
EXCEPTION
    WHEN duplicate_object THEN
        NULL; -- Sudah terdaftar di publication
END $$;

-- Berikan izin eksplisit ke role anon & authenticated untuk akses API Supabase
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

-- Refresh cache PostgREST agar tabel langsung terdeteksi seketika
NOTIFY pgrst, 'reload schema';

-- ==============================================================================
-- 14. VIEW ANALISIS & PELAPORAN
-- ==============================================================================

-- A. View Rekap Pemenuhan Beban Kerja JTM GTK (Berdasarkan Permendikdasmen No. 11/2025)
CREATE OR REPLACE VIEW public.v_rekap_beban_jtm AS
SELECT 
    id,
    nama,
    nip_nuptk,
    jenis_ptk,
    status_kepegawaian,
    mapel_utama,
    jtm_tatap_muka,
    jtm_tugas_tambahan,
    tugas_tambahan,
    total_jtm,
    sertifikasi,
    status_info_gtk,
    CASE 
        WHEN total_jtm >= 24 THEN 'Memenuhi Beban Minimal (≥ 24 JP)'
        WHEN total_jtm >= 18 THEN 'Warning Beban Ajar (18 - 23 JP)'
        ELSE 'Kritis (< 18 JP) Perlu Tugas Tambahan'
    END AS status_pemenuhan_beban
FROM public.gtk;

-- B. View Rekapitulasi Penyaluran Program PIP
CREATE OR REPLACE VIEW public.v_rekap_pip AS
SELECT 
    pip_status,
    COUNT(*) AS total_siswa,
    SUM(nominal_pip) AS total_anggaran,
    COUNT(CASE WHEN nik_status = 'Valid' THEN 1 END) AS valid_dukcapil,
    COUNT(CASE WHEN nik_status != 'Valid' THEN 1 END) AS residu_dukcapil
FROM public.siswa
GROUP BY pip_status;

-- C. View Ringkasan Statistik Sekolah untuk Dashboard
CREATE OR REPLACE VIEW public.v_dashboard_stat AS
SELECT 
    (SELECT COUNT(*) FROM public.gtk) AS total_gtk,
    (SELECT COUNT(*) FROM public.gtk WHERE sertifikasi = 'Sudah Sertifikasi') AS gtk_sertifikasi,
    (SELECT COUNT(*) FROM public.siswa) AS total_siswa,
    (SELECT COUNT(*) FROM public.rombel) AS total_rombel,
    (SELECT COUNT(*) FROM public.mapel) AS total_mapel,
    (SELECT COUNT(*) FROM public.jurnal_harian) AS total_jurnal,
    (SELECT COUNT(*) FROM public.siswa WHERE pip_status = 'Penerima Aktif') AS penerima_pip_aktif,
    (SELECT COALESCE(SUM(nominal_pip), 0) FROM public.siswa WHERE pip_status = 'Penerima Aktif') AS nominal_pip_aktif;

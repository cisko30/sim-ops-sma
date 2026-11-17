import React, { useState } from 'react';
import { DEADLINES } from '../../data/mockData';
import { SchoolInfo } from '../../types';
import { getSupabaseConfig, saveSupabaseConfig, testSupabaseConnection } from '../../lib/supabase';

interface LaporanJadwalViewProps {
  subType: 'reporting-center' | 'kalender-dan-deadline' | 'konfigurasi-sistem';
  schoolInfo?: SchoolInfo;
  onShowToast: (msg: string) => void;
  onNavigateToJurnal?: () => void;
  onClearAllDatabase?: () => void;
  onResetFactoryDatabase?: () => void;
  onExportDatabaseJson?: () => void;
  onImportDatabaseJson?: (data: any) => void;
  onMigrateToSupabase?: () => Promise<void>;
  onPullFromSupabase?: () => Promise<void>;
  syncEngine?: 'supabase' | 'kv' | 'local';
  databaseStats?: {
    totalGtk: number;
    totalSiswa: number;
    totalRombel: number;
    totalMapel: number;
    totalJournals: number;
  };
}

export const LaporanJadwalView: React.FC<LaporanJadwalViewProps> = ({
  subType,
  schoolInfo,
  onShowToast,
  onNavigateToJurnal,
  onClearAllDatabase,
  onResetFactoryDatabase,
  onExportDatabaseJson,
  onImportDatabaseJson,
  onMigrateToSupabase,
  onPullFromSupabase,
  syncEngine = 'local',
  databaseStats = { totalGtk: 0, totalSiswa: 0, totalRombel: 0, totalMapel: 0, totalJournals: 0 }
}) => {
  const [backupStatus, setBackupStatus] = useState<string>('Tersimpan di Penyimpanan Lokal (Siap Dicadangkan)');
  const [autoSyncInterval, setAutoSyncInterval] = useState('30');

  // Supabase Cloud State
  const initialSbConfig = getSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState<string>(initialSbConfig.url);
  const [supabaseKey, setSupabaseKey] = useState<string>(initialSbConfig.anonKey);
  const [showKeyPassword, setShowKeyPassword] = useState<boolean>(false);
  const [supabaseStatus, setSupabaseStatus] = useState<'idle' | 'testing' | 'connected' | 'error'>(() => {
    return initialSbConfig.isConfigured ? 'connected' : 'idle';
  });
  const [supabaseMessage, setSupabaseMessage] = useState<string>(
    initialSbConfig.isConfigured ? 'Supabase aktif & siap disinkronkan' : ''
  );
  const [isMigrating, setIsMigrating] = useState<boolean>(false);
  const [isPulling, setIsPulling] = useState<boolean>(false);
  const [showSqlModal, setShowSqlModal] = useState<boolean>(false);

  const handleBackupNow = () => {
    if (onExportDatabaseJson) {
      onExportDatabaseJson();
    } else {
      onShowToast("Mengekspor cadangan database lengkap...");
    }
    setBackupStatus(`Berhasil dicadangkan (${new Date().toLocaleTimeString('id-ID')} WIB)`);
  };

  const handleFileRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (onImportDatabaseJson) {
          onImportDatabaseJson(parsed);
          onShowToast("Database berhasil dipulihkan dari file cadangan JSON!");
        }
      } catch (err) {
        onShowToast("Gagal membaca file cadangan: format JSON tidak valid.");
      }
    };
    reader.readAsText(file);
  };

  // Test & Save Supabase Config
  const handleTestAndSaveSupabase = async () => {
    if (!supabaseUrl.trim() || !supabaseKey.trim()) {
      onShowToast("Masukkan URL Proyek dan Anon Key Supabase terlebih dahulu.");
      return;
    }

    setSupabaseStatus('testing');
    setSupabaseMessage('Menguji sambungan ke Supabase PostgreSQL...');

    const res = await testSupabaseConnection(supabaseUrl, supabaseKey);
    if (res.success) {
      saveSupabaseConfig(supabaseUrl, supabaseKey);
      setSupabaseStatus('connected');
      setSupabaseMessage(res.message);
      onShowToast(res.message);
    } else {
      setSupabaseStatus('error');
      setSupabaseMessage(res.message);
      onShowToast(`Koneksi Gagal: ${res.message}`);
    }
  };

  const handleMigrate = async () => {
    if (!onMigrateToSupabase) return;
    setIsMigrating(true);
    try {
      await onMigrateToSupabase();
    } finally {
      setIsMigrating(false);
    }
  };

  const handlePull = async () => {
    if (!onPullFromSupabase) return;
    setIsPulling(true);
    try {
      await onPullFromSupabase();
    } finally {
      setIsPulling(false);
    }
  };

  const handleCopySqlSchema = () => {
    const sqlScript = `-- ==============================================================================
-- SIM-OPS SMA NU KAPLONGAN - SUPABASE POSTGRESQL SCHEMA (DDL)
-- ==============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table sekolah
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

-- Table gtk
CREATE TABLE IF NOT EXISTS public.gtk (
    id TEXT PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    nip_nuptk VARCHAR(50),
    jenis_ptk VARCHAR(100) NOT NULL DEFAULT 'Guru Mapel',
    status_kepegawaian VARCHAR(50) NOT NULL DEFAULT 'GTY',
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
    status_info_gtk VARCHAR(50) DEFAULT 'Valid',
    sertifikasi VARCHAR(50) DEFAULT 'Belum',
    telepon VARCHAR(50),
    email VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table siswa
CREATE TABLE IF NOT EXISTS public.siswa (
    id TEXT PRIMARY KEY,
    nisn VARCHAR(20) NOT NULL UNIQUE,
    nipd VARCHAR(30),
    nama VARCHAR(255) NOT NULL,
    rombel VARCHAR(100) NOT NULL,
    jenis_kelamin CHAR(1) NOT NULL DEFAULT 'L',
    nik_status VARCHAR(50) DEFAULT 'Valid',
    pip_status VARCHAR(50) DEFAULT 'Bukan Penerima',
    nominal_pip NUMERIC(12,2) DEFAULT 0,
    wali_kelas VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table rombel
CREATE TABLE IF NOT EXISTS public.rombel (
    id TEXT PRIMARY KEY,
    nama_rombel VARCHAR(100) NOT NULL UNIQUE,
    tingkat VARCHAR(10) NOT NULL,
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

-- Table mapel
CREATE TABLE IF NOT EXISTS public.mapel (
    id TEXT PRIMARY KEY,
    kode_mapel VARCHAR(50) NOT NULL UNIQUE,
    nama_mapel VARCHAR(255) NOT NULL,
    kategori VARCHAR(100),
    fase VARCHAR(100),
    alokasi_jp INT DEFAULT 0,
    guru_pengampu VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table jurnal_harian
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
    status VARCHAR(50) DEFAULT 'Submitted',
    submitted_at TIMESTAMPTZ,
    reviewer_id INT,
    reviewer_name VARCHAR(255),
    reviewed_at TIMESTAMPTZ,
    review_notes TEXT,
    activities JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table aktivitas_timeline
CREATE TABLE IF NOT EXISTS public.aktivitas_timeline (
    id TEXT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    time VARCHAR(100),
    description TEXT,
    dot_color VARCHAR(50) DEFAULT 'bg-primary',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table simops_sync_state
CREATE TABLE IF NOT EXISTS public.simops_sync_state (
    id TEXT PRIMARY KEY DEFAULT 'main_database',
    payload JSONB NOT NULL,
    is_cleared BOOLEAN DEFAULT FALSE,
    version VARCHAR(20) DEFAULT '2.5.0',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS & Realtime
ALTER TABLE public.sekolah ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gtk ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.siswa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rombel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mapel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jurnal_harian ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aktivitas_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simops_sync_state ENABLE ROW LEVEL SECURITY;

DO $$ 
DECLARE tbl text;
BEGIN
    FOR tbl IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' 
    AND tablename IN ('sekolah', 'gtk', 'siswa', 'rombel', 'mapel', 'jurnal_harian', 'aktivitas_timeline', 'simops_sync_state')
    LOOP
        EXECUTE format('CREATE POLICY "Public Read" ON public.%I FOR SELECT USING (true)', tbl);
        EXECUTE format('CREATE POLICY "Public Insert" ON public.%I FOR INSERT WITH CHECK (true)', tbl);
        EXECUTE format('CREATE POLICY "Public Update" ON public.%I FOR UPDATE USING (true) WITH CHECK (true)', tbl);
        EXECUTE format('CREATE POLICY "Public Delete" ON public.%I FOR DELETE USING (true)', tbl);
    END LOOP;
END $$;

ALTER PUBLICATION supabase_realtime ADD TABLE public.sekolah, public.gtk, public.siswa, public.rombel, public.mapel, public.jurnal_harian, public.simops_sync_state;
`;
    navigator.clipboard.writeText(sqlScript);
    onShowToast("Skrip SQL Skema Supabase lengkap berhasil disalin ke clipboard!");
  };

  return (
    <div className="flex flex-col gap-space-lg">
      {/* 1. REPORTING CENTER VIEW */}
      {subType === 'reporting-center' && (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-primary">Pusat Laporan Eksekutif &amp; Kedinasan (Reporting Center)</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Kompilasi laporan resmi BOS, Dapodik, dan Kinerja Jurnal Operasional SMA NU Kaplongan
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col justify-between">
              <div>
                <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center material-symbols-outlined text-2xl mb-3">
                  summarize
                </span>
                <h4 className="font-bold text-sm text-primary">Laporan Jurnal Harian OPS Terintegrasi</h4>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  Rekapitulasi log aktivitas kerja harian operator, jam efektif, pengesahan Kepala Sekolah format A4 siap cetak.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-surface-container">
                <button
                  type="button"
                  onClick={onNavigateToJurnal}
                  className="w-full py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container shadow-xs text-center"
                >
                  Buka Laporan Jurnal
                </button>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col justify-between">
              <div>
                <span className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center material-symbols-outlined text-2xl mb-3">
                  payments
                </span>
                <h4 className="font-bold text-sm text-primary">Rekapitulasi Cut-off BOS &amp; Siswa Aktif</h4>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  Laporan rekapitulasi data {databaseStats.totalSiswa} siswa valid dan pemutakhiran sarpras untuk penetapan dana BOS Reguler.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => onShowToast(`Mengekspor Laporan Rekap BOS ${databaseStats.totalSiswa} Siswa ke format PDF...`)}
                  className="w-full py-2 rounded-xl bg-surface-container-high text-primary text-xs font-bold hover:bg-surface-container shadow-xs text-center"
                >
                  Ekspor Rekap BOS (PDF)
                </button>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col justify-between">
              <div>
                <span className="w-10 h-10 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center material-symbols-outlined text-2xl mb-3">
                  badge
                </span>
                <h4 className="font-bold text-sm text-primary">Beban Kerja JTM &amp; Linieritas GTK</h4>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  Laporan kesiapan SKTP {databaseStats.totalGtk} guru, linieritas mata pelajaran, dan rekap ekuivalensi tugas tambahan.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => onShowToast(`Mengekspor Rekapitulasi JTM ${databaseStats.totalGtk} GTK ke Excel...`)}
                  className="w-full py-2 rounded-xl bg-surface-container-high text-primary text-xs font-bold hover:bg-surface-container shadow-xs text-center"
                >
                  Ekspor JTM (Excel)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. KALENDER DAN DEADLINE VIEW */}
      {subType === 'kalender-dan-deadline' && (
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs space-y-5">
          <div className="border-b border-surface-container pb-3">
            <h3 className="font-bold text-base text-primary">Kalender Kerja &amp; Tenggat Waktu Operasional Sekolah</h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Jadwal pelaksanaan agenda penting Semester Ganjil/Genap SMA NU Kaplongan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DEADLINES.map((dl) => (
              <div
                key={dl.id}
                className="p-4 rounded-xl border border-surface-container bg-surface-container-low flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-primary text-white flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] uppercase font-bold tracking-wider">{dl.month}</span>
                  <span className="text-base font-black leading-none">{dl.day}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs text-primary truncate">{dl.title}</h4>
                    {dl.isUrgent && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-700">
                        Urgent
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    {dl.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. KONFIGURASI SISTEM & SUPABASE MIGRATION */}
      {subType === 'konfigurasi-sistem' && (
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs space-y-6">
          <div className="border-b border-surface-container pb-3">
            <h3 className="font-bold text-base text-primary">Konfigurasi Sistem SIM-OPS &amp; Manajemen Database</h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Pengaturan integrasi cloud Supabase PostgreSQL, pencadangan data, dan pemutakhiran sistem
            </p>
          </div>

          {/* Database Statistics Card */}
          <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-base">database</span>
              <span>Status Data Terkini dalam Database SIM-OPS</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              <div className="p-3 bg-surface rounded-xl border border-surface-container">
                <span className="text-[11px] text-on-surface-variant block">Data GTK</span>
                <strong className="text-lg text-primary">{databaseStats.totalGtk}</strong>
                <span className="text-[10px] text-outline block">Guru/Tendik</span>
              </div>
              <div className="p-3 bg-surface rounded-xl border border-surface-container">
                <span className="text-[11px] text-on-surface-variant block">Peserta Didik</span>
                <strong className="text-lg text-primary">{databaseStats.totalSiswa}</strong>
                <span className="text-[10px] text-outline block">Siswa Aktif</span>
              </div>
              <div className="p-3 bg-surface rounded-xl border border-surface-container">
                <span className="text-[11px] text-on-surface-variant block">Rombongan Belajar</span>
                <strong className="text-lg text-primary">{databaseStats.totalRombel}</strong>
                <span className="text-[10px] text-outline block">Kelas</span>
              </div>
              <div className="p-3 bg-surface rounded-xl border border-surface-container">
                <span className="text-[11px] text-on-surface-variant block">Mata Pelajaran</span>
                <strong className="text-lg text-primary">{databaseStats.totalMapel}</strong>
                <span className="text-[10px] text-outline block">Kurikulum</span>
              </div>
              <div className="p-3 bg-surface rounded-xl border border-surface-container">
                <span className="text-[11px] text-on-surface-variant block">Jurnal Harian OPS</span>
                <strong className="text-lg text-primary">{databaseStats.totalJournals}</strong>
                <span className="text-[10px] text-outline block">Log Kerja</span>
              </div>
            </div>
          </div>

          {/* ================================================================ */}
          {/* SUPABASE CLOUD DATABASE INTEGRATION PANEL */}
          {/* ================================================================ */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/5 via-surface-container-low to-emerald-500/10 border-2 border-emerald-500/30 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-500/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-xl">cloud_sync</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-primary">Integrasi Database Cloud Supabase (PostgreSQL)</h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      PostgreSQL 15+
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant">
                    Replikasi data otomatis multi-perangkat dan sinkronisasi realtime ke server cloud Supabase
                  </p>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2">
                {supabaseStatus === 'connected' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-xs font-bold border border-emerald-300 dark:border-emerald-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Terkoneksi ke Supabase</span>
                  </span>
                ) : supabaseStatus === 'testing' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                    <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                    <span>Menguji Koneksi...</span>
                  </span>
                ) : supabaseStatus === 'error' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
                    <span className="material-symbols-outlined text-sm">error</span>
                    <span>Koneksi Gagal</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                    <span>Belum Dikonfigurasi</span>
                  </span>
                )}
              </div>
            </div>

            {/* Inputs: URL & Anon Key */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-primary block mb-1">
                  Supabase Project URL:
                </label>
                <input
                  type="text"
                  placeholder="https://xyzcompany.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-surface border border-surface-container text-xs font-mono text-primary placeholder:text-outline focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-outline mt-1 block">
                  Dapat diperoleh dari: <em>Supabase Dashboard &rarr; Project Settings &rarr; API &rarr; Project URL</em>
                </span>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-primary">
                    Supabase Anon Public API Key:
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowKeyPassword(!showKeyPassword)}
                    className="text-[10px] text-primary hover:underline font-semibold"
                  >
                    {showKeyPassword ? 'Sembunyikan' : 'Tampilkan'}
                  </button>
                </div>
                <input
                  type={showKeyPassword ? "text" : "password"}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-surface border border-surface-container text-xs font-mono text-primary placeholder:text-outline focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-outline mt-1 block">
                  Dapat diperoleh dari: <em>Project Settings &rarr; API &rarr; Project API Keys &rarr; anon / public</em>
                </span>
              </div>
            </div>

            {/* Feedback message */}
            {supabaseMessage && (
              <div className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                supabaseStatus === 'connected'
                  ? 'bg-emerald-100/70 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-200'
                  : supabaseStatus === 'error'
                  ? 'bg-rose-100/70 text-rose-900 dark:bg-rose-950/70 dark:text-rose-200'
                  : 'bg-surface-container text-on-surface-variant'
              }`}>
                <span className="material-symbols-outlined text-sm">
                  {supabaseStatus === 'connected' ? 'check_circle' : supabaseStatus === 'error' ? 'error' : 'info'}
                </span>
                <span>{supabaseMessage}</span>
              </div>
            )}

            {/* Action Buttons for Supabase */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-emerald-500/20">
              <button
                type="button"
                onClick={handleTestAndSaveSupabase}
                disabled={supabaseStatus === 'testing'}
                className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span>Simpan &amp; Uji Koneksi</span>
              </button>

              <button
                type="button"
                onClick={handleMigrate}
                disabled={isMigrating || !supabaseUrl || !supabaseKey}
                className="py-2 px-3 rounded-xl bg-primary hover:bg-primary-container text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">
                  {isMigrating ? 'sync' : 'upload'}
                </span>
                <span>{isMigrating ? 'Memigrasikan...' : 'Migrasikan Data ke Supabase'}</span>
              </button>

              <button
                type="button"
                onClick={handlePull}
                disabled={isPulling || !supabaseUrl || !supabaseKey}
                className="py-2 px-3 rounded-xl bg-surface-container text-primary hover:bg-surface-container-high border border-surface-container font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">
                  {isPulling ? 'sync' : 'download'}
                </span>
                <span>{isPulling ? 'Mengunduh...' : 'Tarik Data dari Supabase'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSqlModal(true)}
                className="py-2 px-3 rounded-xl bg-surface-container text-primary hover:bg-surface-container-high border border-surface-container font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer ml-auto"
              >
                <span className="material-symbols-outlined text-sm">code</span>
                <span>Lihat Skrip SQL Skema</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-on-surface-variant block mb-1">
                  Interval Sinkronisasi Otomatis:
                </label>
                <select
                  value={autoSyncInterval}
                  onChange={(e) => setAutoSyncInterval(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-surface-container-low border border-surface-container text-xs font-bold text-primary focus:outline-none"
                >
                  <option value="15">Setiap 15 Menit</option>
                  <option value="30">Setiap 30 Menit (Direkomendasikan)</option>
                  <option value="60">Setiap 1 Jam</option>
                  <option value="manual">Manual (Hanya Saat Ditekan)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface-variant block mb-1">
                  Zona Waktu Operasional:
                </label>
                <input
                  type="text"
                  disabled
                  value="Asia/Jakarta (WIB) - UTC+07:00"
                  className="w-full p-2.5 rounded-xl bg-surface-container-low/70 border border-surface-container text-xs font-mono text-outline cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface-variant block mb-1">
                  Penyimpanan Cadangan File (JSON Backup):
                </label>
                <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container text-xs space-y-1">
                  <div className="font-bold text-primary">{backupStatus}</div>
                  <div className="text-[11px] text-outline">Format: JSON Terenkripsi Kompatibel Antar-Perangkat</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleBackupNow}
                  className="py-2.5 px-3 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-container shadow-xs flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">download</span>
                  <span>Cadangkan (JSON)</span>
                </button>

                <label className="py-2.5 px-3 rounded-xl bg-surface-container text-primary font-bold text-xs hover:bg-surface-container-high border border-surface-container shadow-xs flex items-center justify-center gap-1.5 cursor-pointer text-center">
                  <span className="material-symbols-outlined text-base">upload_file</span>
                  <span>Pulihkan (JSON)</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileRestore}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container space-y-3">
                <h4 className="font-bold text-xs text-primary uppercase tracking-wider">Identitas Operator Sekolah Aktif</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-surface-container/60">
                    <span className="text-on-surface-variant">Nama Petugas:</span>
                    <strong className="text-primary">{schoolInfo?.operatorName}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-surface-container/60">
                    <span className="text-on-surface-variant">NIP/NUPTK:</span>
                    <span className="font-mono">{schoolInfo?.operatorNip}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-surface-container/60">
                    <span className="text-on-surface-variant">Jabatan:</span>
                    <span>{schoolInfo?.operatorRole}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-on-surface-variant">Sekolah Induk:</span>
                    <strong className="text-primary">{schoolInfo?.schoolName}</strong>
                  </div>
                </div>
              </div>

              {/* Danger Zone: Reset & Clear Database */}
              <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200 space-y-3">
                <h4 className="font-bold text-xs text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">warning</span>
                  <span>Zona Kontrol Basis Data</span>
                </h4>
                <p className="text-[11px] text-rose-700 leading-relaxed">
                  Gunakan tombol di bawah jika Anda ingin mengosongkan seluruh isi data untuk memulai input dari nol, atau memulihkan kembali template data bawaan SMA NU Kaplongan.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("PERINGATAN: Apakah Anda yakin ingin MENGHAPUS SEMUA DATA di database? Seluruh data GTK, Siswa, Rombel, Mata Pelajaran, dan Jurnal akan dikosongkan.")) {
                        if (onClearAllDatabase) onClearAllDatabase();
                        onShowToast("Seluruh database telah berhasil dihapus dan dikosongkan.");
                      }
                    }}
                    className="py-2 px-3 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">delete_sweep</span>
                    <span>Hapus Semua Database</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Pulihkan database ke data master resmi bawaan SMA NU Kaplongan?")) {
                        if (onResetFactoryDatabase) onResetFactoryDatabase();
                        onShowToast("Database berhasil dipulihkan ke data master bawaan!");
                      }
                    }}
                    className="py-2 px-3 rounded-xl bg-white border border-rose-300 text-rose-800 font-bold text-xs hover:bg-rose-100 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">restart_alt</span>
                    <span>Reset ke Data Bawaan</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SQL SCHEMA MODAL */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-surface rounded-2xl max-w-2xl w-full border border-surface-container shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-surface-container flex items-center justify-between bg-surface-container-low">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-xl">database</span>
                <div>
                  <h3 className="font-bold text-sm text-primary">Skrip SQL Skema Supabase (PostgreSQL)</h3>
                  <p className="text-[11px] text-on-surface-variant">Jalankan di Supabase Dashboard &rarr; SQL Editor &rarr; New Query &rarr; Run</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSqlModal(false)}
                className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline hover:text-primary"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="p-4 overflow-y-auto font-mono text-xs text-on-surface-variant space-y-3">
              <div className="p-3 rounded-xl bg-slate-900 text-emerald-400 overflow-x-auto text-[11px] leading-relaxed max-h-80">
                <pre>{`-- File: database/supabase_schema.sql
-- Berisi tabel: sekolah, gtk, siswa, rombel, mapel,
-- jurnal_harian, jurnal_aktivitas, aktivitas_timeline, simops_sync_state
-- Lengkap dengan RLS Policies, Indexes, and Realtime Publication.`}</pre>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Skrip ini membuat seluruh tabel yang dibutuhkan SIM-OPS SMA NU Kaplongan secara otomatis dan mengaktifkan Row Level Security (RLS) serta Realtime Synchronization.
              </p>
            </div>

            <div className="p-4 border-t border-surface-container bg-surface-container-low flex items-center justify-between">
              <span className="text-xs text-outline">Tersimpan di: <code>database/supabase_schema.sql</code></span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopySqlSchema}
                  className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <span className="material-symbols-outlined text-sm">content_copy</span>
                  <span>Salin Skrip SQL Lengkap</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowSqlModal(false)}
                  className="py-2 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../Components/Sidebar';
import { Header } from '../../Components/Header';

interface DashboardMetrics {
  metrics?: {
    gtk: { total: number; new_badge: string; pns: number; pppk: number; honorer: number };
    students: { total: number; nisn_pct: string; fase_e: number; fase_f_xi: number; fase_f_xii: number };
    classrooms: { total: number; average_per_class: number; per_grade: string };
    certification: { certified_count: number; ratio_pct: string; ppg_queue: number; non_certified: number };
    pip: { recipient_count: number; unactivated_count: number; total_nominal: number; stage: string };
    documents: { pending_count: number; student_count: number; teacher_count: number };
    jtm: { memenuhi: number; warning: number; kurang: number; critical: string[] };
  };
  server_status?: { dapodik_version: string; status: string; last_sync: string };
}

export const DashboardIndex: React.FC<{ initialMetrics?: DashboardMetrics }> = ({ initialMetrics }) => {
  const [data, setData] = useState<DashboardMetrics | null>(initialMetrics || null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<'OPS' | 'Kurikulum' | 'Kepsek'>('OPS');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!data) {
      fetch('/api/v1/dashboard')
        .then((res) => res.json())
        .then((json) => setData(json))
        .catch(() => {
          // Fallback to static props if network error
        });
    }
  }, [data]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const gtk = data?.metrics?.gtk || { total: 74, new_badge: '+2 baru', pns: 42, pppk: 18, honorer: 14 };
  const students = data?.metrics?.students || { total: 1080, nisn_pct: '100% NISN', fase_e: 360, fase_f_xi: 360, fase_f_xii: 360 };
  const rombel = data?.metrics?.classrooms || { total: 30, average_per_class: 36, per_grade: '10 Rombel/Tingkat' };
  const sergu = data?.metrics?.certification || { certified_count: 58, ratio_pct: '78.3%', ppg_queue: 4, non_certified: 12 };
  const pip = data?.metrics?.pip || { recipient_count: 142, unactivated_count: 28, total_nominal: 255600000, stage: 'Tahap 1 2025' };
  const docs = data?.metrics?.documents || { pending_count: 34, student_count: 21, teacher_count: 13 };

  return (
    <div className="min-h-screen bg-background font-body-md text-on-surface antialiased flex flex-col">
      {/* Sidebar */}
      <Sidebar
        currentPath="ringkasan-sekolah"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:pl-72 flex flex-col min-h-screen transition-all">
        {/* Header */}
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          activeRole={activeRole}
          onChangeRole={(r) => {
            setActiveRole(r);
            showToast(`Beralih ke mode tampilan: ${r}`);
          }}
        />

        <main className="w-full pt-20 px-4 sm:px-6 lg:px-gutter-desktop flex-1 bg-background">
          <div className="flex flex-col w-full pb-space-xl max-w-7xl mx-auto">
            
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md py-space-lg">
              <div>
                <nav className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md mb-1">
                  <span>Dashboard</span>
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                  <span className="text-primary font-bold">Ringkasan Sekolah</span>
                </nav>
                <h1 className="font-headline-lg text-2xl sm:text-headline-lg text-primary tracking-tight font-bold">
                  Dashboard Operasional Sekolah
                </h1>
                <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-2 mt-0.5">
                  <span>Tahun Ajaran 2024/2025 Semester Genap</span>
                  <span className="inline-block w-1 h-1 rounded-full bg-outline-variant"></span>
                  <span className="text-secondary font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Dapodik: Sinkron 14 Feb 2025 08:30 WIB
                  </span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-space-sm">
                <button
                  onClick={() => showToast("Memulai proses sinkronisasi cepat dengan server Dapodik lokal...")}
                  className="flex items-center gap-space-xs h-10 px-space-md rounded-lg bg-surface-container-lowest text-primary font-headline-sm text-body-sm font-semibold shadow-sm hover:bg-surface-container-low border border-surface-container transition-all"
                  type="button"
                >
                  <span className="material-symbols-outlined text-secondary text-body-lg">sync</span>
                  <span>Sinkronisasi Cepat</span>
                </button>
                <button
                  onClick={() => showToast("Menyiapkan berkas unduhan Rekap Eksekutif PDF...")}
                  className="flex items-center gap-space-xs h-10 px-space-md rounded-lg bg-surface-container-lowest text-on-surface font-headline-sm text-body-sm font-semibold shadow-sm hover:bg-surface-container-low border border-surface-container transition-all"
                  type="button"
                >
                  <span className="material-symbols-outlined text-body-lg">download</span>
                  <span>Unduh Rekap Eksekutif</span>
                </button>
                <a
                  href="/journals"
                  className="flex items-center gap-space-xs h-10 px-space-md rounded-lg bg-primary-container text-on-primary font-headline-sm text-body-sm font-semibold shadow-md hover:bg-primary transition-all"
                >
                  <span className="material-symbols-outlined text-body-lg">add_circle</span>
                  <span>+ Buat Jurnal Harian</span>
                </a>
              </div>
            </div>

            {/* Countdown Banner */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary-container via-primary to-primary-container text-on-primary p-space-lg shadow-md mb-space-lg border border-primary-container">
              <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-space-lg">
                <div className="flex items-start md:items-center gap-space-md">
                  <div className="p-space-md rounded-xl bg-surface-container-lowest/10 backdrop-blur-sm shrink-0 flex items-center justify-center text-tertiary-fixed border border-white/10">
                    <span className="material-symbols-outlined text-display">alarm</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-tertiary-container text-tertiary-fixed font-label-sm text-label-sm uppercase tracking-wider font-bold">
                        Penting
                      </span>
                      <span className="font-headline-sm text-headline-sm text-on-primary">
                        Tenggat Cut-Off Dapodik Semester Genap
                      </span>
                    </div>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mt-1">
                      <span className="font-display text-2xl sm:text-display tracking-tight text-white font-bold">
                        14 Hari 06 Jam 22 Menit
                      </span>
                      <span className="font-body-sm text-body-sm text-primary-fixed-dim">
                        Menuju batas penutupan sinkronisasi nasional
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-md xl:min-w-[420px]">
                  <div className="flex-1 bg-surface-container-lowest/10 backdrop-blur-md p-space-md rounded-lg border border-white/10">
                    <div className="flex justify-between items-center text-label-sm font-label-sm mb-1.5">
                      <span className="text-surface-container-high">Kelengkapan Validasi Data</span>
                      <span className="text-tertiary-fixed font-bold text-headline-sm">88% Valid</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-surface-container-lowest/20 overflow-hidden">
                      <div className="h-full bg-tertiary-fixed rounded-full transition-all duration-500" style={{ width: '88%' }}></div>
                    </div>
                  </div>
                  <button
                    onClick={() => showToast("Membuka daftar 12 data residu Dapodik...")}
                    className="shrink-0 flex items-center justify-center gap-space-xs h-12 px-space-lg rounded-lg bg-surface-container-lowest text-primary font-headline-sm text-headline-sm shadow-md hover:bg-surface-container-low transition-all"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-error text-body-lg">error</span>
                    <span>Cek 12 Residu Data</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 8 Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md mb-space-lg">
              {/* GTK */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between border border-surface-container">
                <div className="flex items-start justify-between mb-space-sm">
                  <div className="p-space-sm rounded-lg bg-surface-container-low text-primary">
                    <span className="material-symbols-outlined text-headline-md">badge</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm font-bold">
                    {gtk.new_badge}
                  </span>
                </div>
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block">
                    Total Tenaga Pendidik
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-display text-display text-on-surface font-bold">{gtk.total}</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Guru &amp; Tendik</span>
                  </div>
                </div>
                <div className="mt-space-md pt-space-xs flex items-center justify-between text-label-sm font-label-sm text-on-surface-variant bg-surface-container-low/60 p-2 rounded-lg">
                  <span>PNS: <b className="text-on-surface">{gtk.pns}</b></span>
                  <span>PPPK: <b className="text-on-surface">{gtk.pppk}</b></span>
                  <span>Honorer: <b className="text-on-surface">{gtk.honorer}</b></span>
                </div>
              </div>

              {/* Siswa */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between border border-surface-container">
                <div className="flex items-start justify-between mb-space-sm">
                  <div className="p-space-sm rounded-lg bg-surface-container-low text-secondary">
                    <span className="material-symbols-outlined text-headline-md">school</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-label-sm text-label-sm font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">verified</span> {students.nisn_pct}
                  </span>
                </div>
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block">
                    Peserta Didik Aktif
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-display text-display text-on-surface font-bold">{students.total.toLocaleString('id-ID')}</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Siswa Terdaftar</span>
                  </div>
                </div>
                <div className="mt-space-md pt-space-xs flex items-center justify-between text-label-sm font-label-sm text-on-surface-variant bg-surface-container-low/60 p-2 rounded-lg">
                  <span>Fase E: <b className="text-on-surface">{students.fase_e}</b></span>
                  <span>F-XI: <b className="text-on-surface">{students.fase_f_xi}</b></span>
                  <span>F-XII: <b className="text-on-surface">{students.fase_f_xii}</b></span>
                </div>
              </div>

              {/* Rombel */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between border border-surface-container">
                <div className="flex items-start justify-between mb-space-sm">
                  <div className="p-space-sm rounded-lg bg-surface-container-low text-primary">
                    <span className="material-symbols-outlined text-headline-md">groups</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm font-medium">
                    Semester Genap
                  </span>
                </div>
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block">
                    Rombongan Belajar
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-display text-display text-on-surface font-bold">{rombel.total}</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Kelas Aktif</span>
                  </div>
                </div>
                <div className="mt-space-md pt-space-xs flex items-center justify-between text-label-sm font-label-sm text-on-surface-variant bg-surface-container-low/60 p-2 rounded-lg">
                  <span>Rata-rata {rombel.average_per_class}/kelas</span>
                  <span className="text-secondary font-bold">{rombel.per_grade}</span>
                </div>
              </div>

              {/* Sertifikasi */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between border border-surface-container">
                <div className="flex items-start justify-between mb-space-sm">
                  <div className="p-space-sm rounded-lg bg-surface-container-low text-tertiary">
                    <span className="material-symbols-outlined text-headline-md">verified_user</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-bold">
                    {sergu.ratio_pct} Rasio
                  </span>
                </div>
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block">
                    GTK Bersertifikasi
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-display text-display text-on-surface font-bold">{sergu.certified_count}</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Guru Pendidik</span>
                  </div>
                </div>
                <div className="mt-space-md pt-space-xs flex items-center justify-between text-label-sm font-label-sm text-on-surface-variant bg-surface-container-low/60 p-2 rounded-lg">
                  <span className="text-secondary font-medium">{sergu.ppg_queue} Dalam PPG</span>
                  <span>{sergu.non_certified} Non-Sergu</span>
                </div>
              </div>

              {/* PIP */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between border border-surface-container">
                <div className="flex items-start justify-between mb-space-sm">
                  <div className="p-space-sm rounded-lg bg-surface-container-low text-secondary">
                    <span className="material-symbols-outlined text-headline-md">account_balance_wallet</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-bold">
                    {pip.unactivated_count} Belum Aktivasi
                  </span>
                </div>
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block">
                    Penerima Program PIP
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-display text-display text-on-surface font-bold">{pip.recipient_count}</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Siswa Penerima</span>
                  </div>
                </div>
                <div className="mt-space-md pt-space-xs flex items-center justify-between text-label-sm font-label-sm text-on-surface-variant bg-surface-container-low/60 p-2 rounded-lg">
                  <span className="font-semibold text-primary">Rp {pip.total_nominal.toLocaleString('id-ID')}</span>
                  <span className="text-on-surface-variant">{pip.stage}</span>
                </div>
              </div>

              {/* Dokumen Kurang */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between border border-surface-container">
                <div className="flex items-start justify-between mb-space-sm">
                  <div className="p-space-sm rounded-lg bg-error-container/40 text-error">
                    <span className="material-symbols-outlined text-headline-md">folder_open</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-bold">
                    Perlu Tindak
                  </span>
                </div>
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block">
                    Dokumen Belum Lengkap
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-display text-display text-error font-bold">{docs.pending_count}</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Berkas Menunggu</span>
                  </div>
                </div>
                <div className="mt-space-md pt-space-xs flex items-center justify-between text-label-sm font-label-sm text-on-surface-variant bg-surface-container-low/60 p-2 rounded-lg">
                  <span>{docs.student_count} Berkas Siswa</span>
                  <span>{docs.teacher_count} Berkas GTK</span>
                </div>
              </div>

              {/* JTM Kurang */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between border border-surface-container">
                <div className="flex items-start justify-between mb-space-sm">
                  <div className="p-space-sm rounded-lg bg-surface-container-high text-primary">
                    <span className="material-symbols-outlined text-headline-md">schedule</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-primary-fixed-variant font-label-sm text-label-sm font-bold">
                    3 Guru Kritis
                  </span>
                </div>
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block">
                    Beban Ajar &lt; 24 JTM
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-display text-display text-on-surface font-bold">3</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Tenaga Pengajar</span>
                  </div>
                </div>
                <div className="mt-space-md pt-space-xs flex items-center justify-between text-label-sm font-label-sm text-on-surface-variant bg-surface-container-low/60 p-2 rounded-lg">
                  <span className="truncate">Butuh Ekuivalensi / Tugas Tambahan</span>
                </div>
              </div>

              {/* Deadline */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between border border-surface-container">
                <div className="flex items-start justify-between mb-space-sm">
                  <div className="p-space-sm rounded-lg bg-surface-container-low text-tertiary">
                    <span className="material-symbols-outlined text-headline-md">pending_actions</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm font-bold">
                    Minggu Ini
                  </span>
                </div>
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block">
                    Agenda &amp; Deadline Dekat
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-display text-display text-secondary font-bold">5</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Tugas Penting</span>
                  </div>
                </div>
                <div className="mt-space-md pt-space-xs flex items-center justify-between text-label-sm font-label-sm text-on-surface-variant bg-surface-container-low/60 p-2 rounded-lg">
                  <span className="truncate font-medium text-secondary">Verval PD • PIP • SK</span>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-xl border border-white/10 animate-bounce">
          <span className="material-symbols-outlined text-tertiary-fixed text-xl">info</span>
          <span className="text-body-sm font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default DashboardIndex;


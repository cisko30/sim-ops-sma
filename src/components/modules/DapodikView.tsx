import React, { useState } from 'react';
import { QUICK_LINKS_LIST } from '../../data/modulesData';
import { SchoolInfo } from '../../types';

interface DapodikViewProps {
  subType: 'koneksi-dan-sinkronisasi' | 'quick-links-portal-pusat';
  schoolInfo?: SchoolInfo;
  onShowToast: (msg: string) => void;
  onNavigateToJurnal?: () => void;
}

export const DapodikView: React.FC<DapodikViewProps> = ({
  subType,
  schoolInfo,
  onShowToast,
  onNavigateToJurnal
}) => {
  const [syncState, setSyncState] = useState<'idle' | 'validating' | 'syncing' | 'completed'>('idle');
  const [syncProgress, setSyncProgress] = useState(0);

  // Search & Filter State for Kedinasan Portal Quick Links
  const [portalSearchQuery, setPortalSearchQuery] = useState<string>('');
  const [portalCategoryFilter, setPortalCategoryFilter] = useState<string>('ALL');

  const filteredQuickLinks = QUICK_LINKS_LIST.filter((link) => {
    const matchesCategory =
      portalCategoryFilter === 'ALL' || link.kategori === portalCategoryFilter;

    if (!matchesCategory) return false;

    if (!portalSearchQuery.trim()) return true;

    const q = portalSearchQuery.toLowerCase().trim();
    const matchName = link.nama.toLowerCase().includes(q);
    const matchSingkatan = link.singkatan?.toLowerCase().includes(q) ?? false;
    const matchDeskripsi = link.deskripsi.toLowerCase().includes(q);
    const matchUrl = link.url.toLowerCase().includes(q);
    const matchBadge = link.badge.toLowerCase().includes(q);
    const matchCategory = link.kategori.toLowerCase().includes(q);
    const matchTags = link.tags?.some((t) => t.toLowerCase().includes(q)) ?? false;

    return (
      matchName ||
      matchSingkatan ||
      matchDeskripsi ||
      matchUrl ||
      matchBadge ||
      matchCategory ||
      matchTags
    );
  });

  const handleCopyLink = (e: React.MouseEvent, url: string, name: string) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    onShowToast(`Tautan ${name} disalin ke clipboard!`);
  };

  const startSyncSimulation = () => {
    setSyncState('validating');
    setSyncProgress(15);
    onShowToast("Memulai validasi data lokal Dapodikdasmen SMA NU Kaplongan...");

    setTimeout(() => {
      setSyncState('syncing');
      setSyncProgress(50);
      onShowToast("Validasi lokal berhasil (0 Data Invalid). Mengirim data ke server Pusdatin...");
    }, 1200);

    setTimeout(() => {
      setSyncProgress(85);
    }, 2200);

    setTimeout(() => {
      setSyncState('completed');
      setSyncProgress(100);
      onShowToast("Sinkronisasi Berhasil 100%! Data server pusat telah terbarui.");
    }, 3200);
  };

  return (
    <div className="flex flex-col gap-space-lg">
      {/* 1. KONEKSI & SINKRONISASI VIEW */}
      {subType === 'koneksi-dan-sinkronisasi' && (
        <div className="space-y-5">
          {/* Status Hub Card */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-container pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-3xl">sync</span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-primary">Web Service Integrasi Dapodikdasmen</h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Koneksi Server Lokal SMA NU Kaplongan ke Server Pusat Kemdikbudristek (Pusdatin)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                  <span>Server Terhubung (v2025.b)</span>
                </span>
              </div>
            </div>

            {/* Server Technical Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 text-xs">
              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <span className="text-on-surface-variant text-[11px] block">Database Server:</span>
                <span className="font-bold text-primary block mt-0.5">PostgreSQL 14.2</span>
                <span className="text-[10px] text-emerald-700 font-semibold">Port 5774 (Localhost)</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <span className="text-on-surface-variant text-[11px] block">Status Validasi Lokal:</span>
                <span className="font-bold text-emerald-700 block mt-0.5">0 Invalid / 0 Error</span>
                <span className="text-[10px] text-on-surface-variant">4 Peringatan Wajar</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <span className="text-on-surface-variant text-[11px] block">Terakhir Sinkron:</span>
                <span className="font-bold text-primary block mt-0.5">Hari Ini, 08:30 WIB</span>
                <span className="text-[10px] text-on-surface-variant">Oleh {schoolInfo?.operatorName?.split(',')[0] || 'Operator'}</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <span className="text-on-surface-variant text-[11px] block">Waktu Respon Server:</span>
                <span className="font-bold text-emerald-700 block mt-0.5">28 ms (Sangat Cepat)</span>
                <span className="text-[10px] text-emerald-700 font-semibold">Latency Normal</span>
              </div>
            </div>

            {/* Sync Action Area with Realtime Progress */}
            <div className="pt-4 border-t border-surface-container">
              {syncState !== 'idle' && (
                <div className="mb-4 p-4 rounded-xl bg-surface-container-low border border-surface-container space-y-2">
                  <div className="flex justify-between text-xs font-bold text-primary">
                    <span>
                      {syncState === 'validating' && '1. Memvalidasi Kelengkapan Data GTK & Rombel Lokal...'}
                      {syncState === 'syncing' && '2. Mengirim Data Terenkripsi ke Server Pusdatin Kemdikbud...'}
                      {syncState === 'completed' && '3. Sinkronisasi Selesai Sukses 100%!'}
                    </span>
                    <span>{syncProgress}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-surface-container overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${
                        syncState === 'completed' ? 'bg-emerald-600' : 'bg-primary'
                      }`}
                      style={{ width: `${syncProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-on-surface-variant">
                  Tekan tombol di kanan untuk memulai sinkronisasi berkala data Dapodik ke pusat.
                </div>
                <div className="flex items-center gap-2">
                  {onNavigateToJurnal && (
                    <button
                      type="button"
                      onClick={onNavigateToJurnal}
                      className="px-3.5 py-2 rounded-xl bg-surface-container-low text-primary text-xs font-semibold hover:bg-surface-container border border-surface-container flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">edit_note</span>
                      <span>Catat ke Jurnal</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      onShowToast("Menjalankan validasi mandiri data peserta didik dan kurikulum...");
                    }}
                    className="px-4 py-2 rounded-xl bg-surface-container-low text-primary text-xs font-semibold hover:bg-surface-container border border-surface-container"
                  >
                    Validasi Saja
                  </button>
                  <button
                    type="button"
                    onClick={startSyncSimulation}
                    disabled={syncState === 'validating' || syncState === 'syncing'}
                    className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container shadow-sm flex items-center gap-2 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-base">cloud_sync</span>
                    <span>{syncState === 'syncing' ? 'Sedang Sinkronisasi...' : 'Kirim Sinkronisasi Sekarang'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sync History Logs */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs space-y-3">
            <h4 className="font-bold text-sm text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-base">history</span>
              <span>Riwayat Sinkronisasi Terakhir (Log Server)</span>
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container/60 flex items-center justify-between">
                <div>
                  <strong className="text-primary block">Sinkronisasi Pagi (GTK, Sarpras &amp; Rombel)</strong>
                  <span className="text-[11px] text-on-surface-variant">12 November 2026, 08:30:14 WIB • Waktu kirim: 1m 45s</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                  Sukses (Status 200)
                </span>
              </div>
              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container/60 flex items-center justify-between">
                <div>
                  <strong className="text-primary block">Sinkronisasi Registrasi Peserta Didik Baru</strong>
                  <span className="text-[11px] text-on-surface-variant">10 November 2026, 14:12:05 WIB • Waktu kirim: 2m 10s</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                  Sukses (Status 200)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. QUICK LINKS PORTAL PUSAT VIEW */}
      {subType === 'quick-links-portal-pusat' && (
        <div className="space-y-5">
          {/* Main Hero Header & Search Command Bar */}
          <div className="p-5 sm:p-6 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-container pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-indigo-900 text-white flex items-center justify-center shrink-0 shadow-md shadow-primary/25">
                  <span className="material-symbols-outlined text-2xl">travel_explore</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base sm:text-lg text-primary tracking-tight">
                      Direktori Portal Kedinasan Resmi (SSO Terintegrasi)
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                      {QUICK_LINKS_LIST.length} Portal Aktif
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Akses SSO instan satu klik ke seluruh sistem informasi Kemdikbudristek, Pusdatin, Pusmendik, SNPMB, dan Cadisdik
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                  <span>Semua Server Online</span>
                </span>
              </div>
            </div>

            {/* Live Search Input Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-primary">
                <span className="material-symbols-outlined text-xl text-primary">search</span>
              </div>
              <input
                type="text"
                value={portalSearchQuery}
                onChange={(e) => setPortalSearchQuery(e.target.value)}
                placeholder="Cari portal kedinasan (contoh: TKA, ABM, SNBP, PDSS, Verval PD, Info GTK, PIP, BOS, Ijazah, Dukcapil)..."
                className="w-full pl-11 pr-10 py-3 bg-surface-container-low border border-surface-container rounded-xl text-xs font-semibold text-primary placeholder:text-outline placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-primary/25 focus:bg-white transition-all shadow-inner"
              />
              {portalSearchQuery && (
                <button
                  type="button"
                  onClick={() => setPortalSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-outline hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              )}
            </div>

            {/* Quick Keyword Suggestion Pills */}
            <div className="flex items-center gap-1.5 flex-wrap text-xs pt-0.5">
              <span className="text-[11px] font-bold text-on-surface-variant flex items-center gap-1 mr-1">
                <span className="material-symbols-outlined text-sm text-primary">bolt</span>
                <span>Pencarian Cepat:</span>
              </span>
              {[
                'TKA',
                'ABM',
                'Belajar.id',
                'PDSS',
                'SNBP',
                'Verval PD',
                'Info GTK',
                'PIP',
                'BOS',
                'SIVIL Ijazah',
                'SIMPKB'
              ].map((keyword) => (
                <button
                  key={keyword}
                  type="button"
                  onClick={() => setPortalSearchQuery(keyword)}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all ${
                    portalSearchQuery.toLowerCase() === keyword.toLowerCase()
                      ? 'bg-primary text-white border-primary shadow-xs'
                      : 'bg-surface-container-low text-primary border-surface-container hover:bg-surface-container hover:border-primary/30'
                  }`}
                >
                  {keyword}
                </button>
              ))}
            </div>

            {/* Category Filter Pills (No Scrollbar Cut) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-surface-container/60 text-xs [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {[
                { id: 'ALL', label: 'Semua Portal', count: QUICK_LINKS_LIST.length },
                {
                  id: 'Asesmen & Ujian',
                  label: 'Asesmen & Ujian (TKA, ABM, BioSMA)',
                  count: QUICK_LINKS_LIST.filter((l) => l.kategori === 'Asesmen & Ujian').length
                },
                {
                  id: 'Kelulusan & SNBP',
                  label: 'Kelulusan & SNBP/PDSS',
                  count: QUICK_LINKS_LIST.filter((l) => l.kategori === 'Kelulusan & SNBP').length
                },
                {
                  id: 'Pusdatin & Dapodik',
                  label: 'Pusdatin & Dapodik',
                  count: QUICK_LINKS_LIST.filter((l) => l.kategori === 'Pusdatin & Dapodik').length
                },
                {
                  id: 'GTK & Guru',
                  label: 'GTK & Info GTK',
                  count: QUICK_LINKS_LIST.filter((l) => l.kategori === 'GTK & Guru').length
                },
                {
                  id: 'Bantuan & Keuangan',
                  label: 'Bantuan (PIP & BOS)',
                  count: QUICK_LINKS_LIST.filter((l) => l.kategori === 'Bantuan & Keuangan').length
                },
                {
                  id: 'Verifikasi & Ijazah',
                  label: 'Verifikasi Ijazah',
                  count: QUICK_LINKS_LIST.filter((l) => l.kategori === 'Verifikasi & Ijazah').length
                }
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setPortalCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border shrink-0 ${
                    portalCategoryFilter === cat.id
                      ? 'bg-primary text-white border-primary shadow-xs'
                      : 'bg-surface-container-low text-on-surface-variant border-surface-container hover:text-primary hover:bg-surface-container'
                  }`}
                >
                  {cat.label} ({cat.count})
                </button>
              ))}
            </div>
          </div>

          {/* Results Summary Bar */}
          <div className="flex items-center justify-between text-xs px-1">
            <span className="text-on-surface-variant font-medium">
              Menampilkan <strong>{filteredQuickLinks.length}</strong> dari{' '}
              {QUICK_LINKS_LIST.length} portal kedinasan
              {portalSearchQuery ? ` untuk kata kunci "${portalSearchQuery}"` : ''}
            </span>
            {(portalSearchQuery || portalCategoryFilter !== 'ALL') && (
              <button
                type="button"
                onClick={() => {
                  setPortalSearchQuery('');
                  setPortalCategoryFilter('ALL');
                }}
                className="text-primary hover:underline font-bold text-[11px] flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">restart_alt</span>
                <span>Reset Pencarian</span>
              </button>
            )}
          </div>

          {/* Cards Grid */}
          {filteredQuickLinks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredQuickLinks.map((link) => (
                <div
                  key={link.id}
                  onClick={() => {
                    onShowToast(`Membuka portal resmi: ${link.nama}...`);
                    window.open(link.url, '_blank', 'noopener,noreferrer');
                  }}
                  className={`p-5 rounded-2xl bg-surface-container-lowest border border-surface-container/80 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group cursor-pointer ${link.accentBorder || 'hover:border-primary/40'}`}
                  title={`Klik untuk membuka portal: ${link.nama}`}
                >
                  <div>
                    {/* Top Row: Colorful Brand Icon Badge + Category Pills */}
                    <div className="flex items-start justify-between gap-3 mb-3.5">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${link.iconBg || 'bg-primary text-white'}`}
                      >
                        <span className="material-symbols-outlined text-2xl">{link.icon}</span>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${link.badgeColor || 'bg-surface-container-low text-primary border-surface-container'}`}>
                          {link.badge}
                        </span>
                        <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
                          {link.kategori.split('&')[0].trim()}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h4 className="font-bold text-sm text-primary group-hover:text-emerald-700 transition-colors leading-snug flex items-center gap-1.5">
                      <span>{link.nama}</span>
                      <span className="material-symbols-outlined text-xs opacity-0 group-hover:opacity-100 transition-opacity text-emerald-600 shrink-0">
                        open_in_new
                      </span>
                    </h4>

                    {/* Description */}
                    <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed line-clamp-2">
                      {link.deskripsi}
                    </p>

                    {/* Search Tags / Keywords */}
                    {link.tags && link.tags.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap mt-3 pt-2.5 border-t border-surface-container/50">
                        {link.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md bg-surface-container-low text-[10.5px] text-outline font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer Row: URL & Direct Open Button & Copy Button */}
                  <div className="mt-4 pt-3 border-t border-surface-container/60 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0 pr-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                      <span
                        className="text-[11px] text-outline font-mono truncate hover:text-primary transition-colors"
                        title={link.url}
                      >
                        {link.url.replace('https://', '')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={(e) => handleCopyLink(e, link.url, link.nama)}
                        className="p-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors border border-surface-container shadow-2xs cursor-pointer"
                        title="Salin tautan resmi ke clipboard"
                      >
                        <span className="material-symbols-outlined text-sm">content_copy</span>
                      </button>

                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => onShowToast(`Membuka portal resmi: ${link.nama}...`)}
                        className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container flex items-center gap-1 shadow-sm group-hover:shadow transition-all shrink-0 active:scale-95 cursor-pointer"
                      >
                        <span>Akses</span>
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="p-10 rounded-2xl bg-surface-container-lowest border border-dashed border-surface-container text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-2xl">search_off</span>
              </div>
              <div>
                <h5 className="font-bold text-sm text-primary">Tidak Ada Portal yang Cocok</h5>
                <p className="text-xs text-on-surface-variant mt-1">
                  Tidak ditemukan portal kedinasan dengan kata kunci &ldquo;{portalSearchQuery}&rdquo;
                  {portalCategoryFilter !== 'ALL' ? ` pada kategori "${portalCategoryFilter}"` : ''}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPortalSearchQuery('');
                  setPortalCategoryFilter('ALL');
                }}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container"
              >
                Tampilkan Semua {QUICK_LINKS_LIST.length} Portal
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

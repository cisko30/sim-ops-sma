import React, { useState } from 'react';

interface PortalLink {
  id: string;
  name: string;
  shortName: string;
  category: 'Pusdatin' | 'Asesmen' | 'Kelulusan' | 'Bantuan';
  badge: string;
  description: string;
  url: string;
  icon: string;
  tags?: string[];
  themeColor: {
    bg: string;
    text: string;
    border: string;
    iconBg: string;
  };
  isInternal?: boolean;
  internalPath?: string;
}

interface OperatorPortalLinksCardProps {
  onShowToast: (msg: string) => void;
  onNavigateInternal?: (path: string) => void;
}

export const OperatorPortalLinksCard: React.FC<OperatorPortalLinksCardProps> = ({
  onShowToast,
  onNavigateInternal
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const PORTAL_LINKS: PortalLink[] = [
    {
      id: 'tka',
      name: 'TKA Pusmendik (Tes Kemampuan Akademik)',
      shortName: 'TKA Pusmendik',
      category: 'Asesmen',
      badge: 'Pusmendik BSKAP',
      description: 'Portal resmi pelaksanaan Tes Kemampuan Akademik (TKA) Pusmendik Kemendikdasmen untuk pemetaan capaian skolastik murid SMA.',
      url: 'https://tka.kemendikdasmen.go.id',
      icon: 'history_edu',
      tags: ['tka', 'pusmendik', 'skolastik', 'akademik', 'ujian', 'asesmen'],
      themeColor: {
        bg: 'bg-indigo-50/70 hover:bg-indigo-50',
        text: 'text-indigo-900',
        border: 'border-indigo-200',
        iconBg: 'bg-indigo-600 text-white'
      }
    },
    {
      id: 'abm',
      name: 'ABM Pusmendik (Asesmen Bakat Murid)',
      shortName: 'ABM Pusmendik',
      category: 'Asesmen',
      badge: 'Kelas XII SMA',
      description: 'Portal tes bakat minat murid kelas XII, cetak kartu sesi laboratorium, dan upload berita acara.',
      url: 'https://dashboard-abm.bppp.kemendikdasmen.go.id/login',
      icon: 'psychology',
      tags: ['abm', 'pusmendik', 'bakat', 'minat', 'asesmen', 'laboratorium'],
      themeColor: {
        bg: 'bg-cyan-50/70 hover:bg-cyan-50',
        text: 'text-cyan-900',
        border: 'border-cyan-200',
        iconBg: 'bg-cyan-600 text-white'
      }
    },
    {
      id: 'dapodik',
      name: 'Dapodikdasmen (SP Datadik)',
      shortName: 'Dapodik SP',
      category: 'Pusdatin',
      badge: 'SSO Utama',
      description: 'Login SSO manajemen sekolah, penarikan data mutasi siswa baru, validasi lokal & kirim sinkronisasi.',
      url: 'https://sp.datadik.kemendikdasmen.go.id',
      icon: 'sync_alt',
      tags: ['dapodik', 'sp datadik', 'sinkron', 'sptjm', 'mutasi'],
      themeColor: {
        bg: 'bg-blue-50/70 hover:bg-blue-50',
        text: 'text-blue-900',
        border: 'border-blue-200',
        iconBg: 'bg-blue-600 text-white'
      }
    },
    {
      id: 'verval-pd',
      name: 'Verval PD (Peserta Didik & Dukcapil)',
      shortName: 'Verval PD',
      category: 'Pusdatin',
      badge: 'Pemadanan NIK',
      description: 'Verifikasi & validasi identitas siswa, pemadanan NIK Dukcapil, perbaikan akta lahir, dan penanganan residu KK.',
      url: 'https://vervalpd.data.kemendikdasmen.go.id',
      icon: 'verified',
      tags: ['verval pd', 'nisn', 'nik', 'dukcapil', 'residu', 'kk'],
      themeColor: {
        bg: 'bg-emerald-50/70 hover:bg-emerald-50',
        text: 'text-emerald-900',
        border: 'border-emerald-200',
        iconBg: 'bg-emerald-600 text-white'
      }
    },
    {
      id: 'snbp-pdss',
      name: 'PDSS & SNBP (Portal SNPMB)',
      shortName: 'Portal SNPMB',
      category: 'Kelulusan',
      badge: 'Dashboard SNPMB',
      description: 'Portal resmi Pangkalan Data Sekolah dan Siswa (PDSS), pendaftaran akun SNBP & SNBT perguruan tinggi.',
      url: 'https://portal.snpmb.id/dashboard/index.html',
      icon: 'school',
      tags: ['pdss', 'snbp', 'snpmb', 'ptn', 'ledger', 'rapor', 'prestasi'],
      themeColor: {
        bg: 'bg-orange-50/70 hover:bg-orange-50',
        text: 'text-orange-900',
        border: 'border-orange-200',
        iconBg: 'bg-orange-600 text-white'
      }
    },
    {
      id: 'verval-ptk',
      name: 'Verval PTK (Guru & Tendik)',
      shortName: 'Verval PTK',
      category: 'Pusdatin',
      badge: 'NUPTK & Ijazah',
      description: 'Pengelolaan arsip dokumen GTK, penerbitan NUPTK baru, perbaikan riwayat formal kepegawaian.',
      url: 'https://vervalptk.data.kemendikdasmen.go.id',
      icon: 'badge',
      tags: ['verval ptk', 'nuptk', 'gtk', 'guru', 'tendik', 'ijazah s1'],
      themeColor: {
        bg: 'bg-purple-50/70 hover:bg-purple-50',
        text: 'text-purple-900',
        border: 'border-purple-200',
        iconBg: 'bg-purple-600 text-white'
      }
    },
    {
      id: 'info-gtk',
      name: 'Info GTK Kemdikbudristek',
      shortName: 'Info GTK',
      category: 'Pusdatin',
      badge: 'Validasi SKTP',
      description: 'Pengecekan linieritas jam mengajar tatap muka (24 JTM) dan penerbitan SK Tunjangan Profesi (SKTP).',
      url: 'https://info.gtk.kemendikdasmen.go.id',
      icon: 'workspace_premium',
      tags: ['info gtk', 'sktp', 'tpg', 'sertifikasi', '24 jtm', 'linieritas'],
      themeColor: {
        bg: 'bg-amber-50/70 hover:bg-amber-50',
        text: 'text-amber-900',
        border: 'border-amber-200',
        iconBg: 'bg-amber-600 text-white'
      }
    },
    {
      id: 'pip',
      name: 'SiPintar PIP (SimPel Bank BNI)',
      shortName: 'Program PIP',
      category: 'Bantuan',
      badge: 'Bank BNI SimPel',
      description: 'Pemeriksaan SK Nominasi & Pemberian bantuan siswa SMA, cetak surat kuasa kolektif Kepala Sekolah.',
      url: 'https://pip.kemendikdasmen.go.id',
      icon: 'account_balance_wallet',
      tags: ['pip', 'sipintar', 'simpel', 'bni', 'bantuan', 'kip'],
      themeColor: {
        bg: 'bg-rose-50/70 hover:bg-rose-50',
        text: 'text-rose-900',
        border: 'border-rose-200',
        iconBg: 'bg-rose-600 text-white'
      }
    },
    {
      id: 'bos',
      name: 'BOS Salur & ARKAS SMA',
      shortName: 'BOS Salur',
      category: 'Bantuan',
      badge: 'Dana BOSP',
      description: 'Konfirmasi penyaluran dana operasional sekolah tahap 2 dan pelaporan realisasi belanja ARKAS.',
      url: 'https://bos.kemendikdasmen.go.id',
      icon: 'payments',
      tags: ['bos', 'bosp', 'arkas', 'keuangan', 'penyaluran'],
      themeColor: {
        bg: 'bg-teal-50/70 hover:bg-teal-50',
        text: 'text-teal-900',
        border: 'border-teal-200',
        iconBg: 'bg-teal-600 text-white'
      }
    },
    {
      id: 'simpkb',
      name: 'SIMPKB (Portal PPG & Diklat GTK)',
      shortName: 'SIMPKB',
      category: 'Pusdatin',
      badge: 'PPG & Diklat',
      description: 'Sistem Informasi Manajemen Pengembangan Keprofesian, seleksi akademik PPG Daljab, dan Guru Penggerak.',
      url: 'https://paspor-gtk.belajar.kemendikdasmen.go.id',
      icon: 'cast_for_education',
      tags: ['simpkb', 'ppg', 'guru penggerak', 'diklat'],
      themeColor: {
        bg: 'bg-sky-50/70 hover:bg-sky-50',
        text: 'text-sky-900',
        border: 'border-sky-200',
        iconBg: 'bg-sky-600 text-white'
      }
    },
    {
      id: 'biosma',
      name: 'BioSMA (Pendataan Peserta Ujian)',
      shortName: 'BioSMA',
      category: 'Asesmen',
      badge: 'DNT Siswa',
      description: 'Pendataan DNT/DNS siswa SMA untuk pelaksanaan asesmen nasional dan kelengkapan nomor ujian sekolah.',
      url: 'https://bioportal.kemendikdasmen.go.id',
      icon: 'fact_check',
      tags: ['biosma', 'dns', 'dnt', 'asesmen', 'ujian'],
      themeColor: {
        bg: 'bg-lime-50/70 hover:bg-lime-50',
        text: 'text-lime-900',
        border: 'border-lime-200',
        iconBg: 'bg-lime-700 text-white'
      }
    },
    {
      id: 'sivil-ijazah',
      name: 'SIVIL (Verifikasi Ijazah Elektronik)',
      shortName: 'SIVIL Ijazah',
      category: 'Kelulusan',
      badge: 'Nomor Ijazah',
      description: 'Pengecekan keabsahan nomor seri ijazah nasional dan legalitas lulusan siswa SMA serta ijazah GTK.',
      url: 'https://ijazah.data.kemendikdasmen.go.id',
      icon: 'description',
      tags: ['sivil', 'ijazah', 'kelulusan', 'verifikasi', 'legalisir'],
      themeColor: {
        bg: 'bg-stone-50/70 hover:bg-stone-50',
        text: 'text-stone-900',
        border: 'border-stone-200',
        iconBg: 'bg-stone-700 text-white'
      }
    },
    {
      id: 'kip-kuliah',
      name: 'KIP Kuliah Kemendikbudristek',
      shortName: 'KIP Kuliah',
      category: 'Kelulusan',
      badge: 'Beasiswa PTN',
      description: 'Pendampingan siswa SMA pemegang KIP/PIP untuk mendapatkan beasiswa kuliah gratis dan biaya hidup di PTN.',
      url: 'https://kip-kuliah.kemdiktisaintek.go.id',
      icon: 'military_tech',
      tags: ['kip kuliah', 'beasiswa', 'ptn', 'snbp', 'kuliah'],
      themeColor: {
        bg: 'bg-amber-50/70 hover:bg-amber-50',
        text: 'text-amber-900',
        border: 'border-amber-200',
        iconBg: 'bg-amber-600 text-white'
      }
    },
    {
      id: 'jurnal-harian',
      name: 'Jurnal Harian OPS Terintegrasi',
      shortName: 'Jurnal Harian',
      category: 'Pusdatin',
      badge: 'Siap Cetak A4',
      description: 'Catatan log aktivitas harian operator SMA NU Kaplongan, pengesahan Kepala Sekolah, dan siap cetak.',
      url: '#',
      icon: 'edit_calendar',
      tags: ['jurnal', 'harian', 'ops', 'cetak', 'a4'],
      themeColor: {
        bg: 'bg-emerald-50/90 hover:bg-emerald-50',
        text: 'text-emerald-950',
        border: 'border-emerald-300',
        iconBg: 'bg-primary text-white'
      },
      isInternal: true,
      internalPath: 'input-dan-riwayat-jurnal'
    },
    {
      id: 'bank-skills',
      name: 'Bank Skills & SOP OPS',
      shortName: 'Bank Skills',
      category: 'Pusdatin',
      badge: 'SOP & Panduan',
      description: 'Kompilasi panduan teknis langkah demi langkah (SOP) Dapodik, Verval PD, ABM, TKA, PIP, dan rumus JTM.',
      url: '#',
      icon: 'psychology_alt',
      tags: ['skills', 'sop', 'panduan', 'dapodik', 'tka', 'abm'],
      themeColor: {
        bg: 'bg-violet-50/80 hover:bg-violet-50',
        text: 'text-violet-950',
        border: 'border-violet-200',
        iconBg: 'bg-violet-600 text-white'
      },
      isInternal: true,
      internalPath: 'bank-skills-ops'
    }
  ];

  const filteredLinks = PORTAL_LINKS.filter((item) => {
    if (selectedFilter !== 'ALL' && item.category !== selectedFilter) return false;
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase().trim();
    const matchName = item.name.toLowerCase().includes(q);
    const matchShort = item.shortName.toLowerCase().includes(q);
    const matchDesc = item.description.toLowerCase().includes(q);
    const matchUrl = item.url.toLowerCase().includes(q);
    const matchBadge = item.badge.toLowerCase().includes(q);
    const matchTags = item.tags?.some((t) => t.toLowerCase().includes(q)) ?? false;

    return matchName || matchShort || matchDesc || matchUrl || matchBadge || matchTags;
  });

  const handleOpenLink = (link: PortalLink) => {
    if (link.isInternal && link.internalPath && onNavigateInternal) {
      onShowToast(`Membuka modul internal: ${link.name}`);
      onNavigateInternal(link.internalPath);
    } else {
      onShowToast(`Membuka portal resmi: ${link.name}...`);
      window.open(link.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-sm space-y-4">
      {/* Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-surface-container/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center shadow-sm shrink-0">
            <span className="material-symbols-outlined text-2xl">rocket_launch</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-primary tracking-tight">
                Portal Cepat &amp; Tautan Kedinasan Operator (OPS Command Center)
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10.5px] font-extrabold uppercase">
                1-Klik Akses
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Tautan langsung ke seluruh aplikasi kementerian pusat, portal ujian nasional (ABM &amp; TKA), pangkalan data SNBP, dan bantuan PIP
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-container-low border border-surface-container text-xs overflow-x-auto">
          <button
            type="button"
            onClick={() => setSelectedFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
              selectedFilter === 'ALL'
                ? 'bg-primary text-white shadow-xs'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Semua Portal ({PORTAL_LINKS.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('Pusdatin')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
              selectedFilter === 'Pusdatin'
                ? 'bg-primary text-white shadow-xs'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Dapodik &amp; Verval
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('Asesmen')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
              selectedFilter === 'Asesmen'
                ? 'bg-primary text-white shadow-xs'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            TKA &amp; ABM
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('Kelulusan')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
              selectedFilter === 'Kelulusan'
                ? 'bg-primary text-white shadow-xs'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            SNBP &amp; PDSS
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('Bantuan')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
              selectedFilter === 'Bantuan'
                ? 'bg-primary text-white shadow-xs'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            PIP &amp; BOS
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-primary">
          <span className="material-symbols-outlined text-lg text-primary">search</span>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari portal kedinasan (contoh: TKA, ABM, SNBP, PDSS, Verval PD, PIP, BOS, Info GTK, Ijazah)..."
          className="w-full pl-10 pr-9 py-2.5 bg-surface-container-low border border-surface-container rounded-xl text-xs font-semibold text-primary placeholder:text-outline placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-primary/25 focus:bg-white transition-all shadow-inner"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        )}
      </div>

      {/* Grid of 1-Click Launchers */}
      {filteredLinks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
          {filteredLinks.map((link) => (
            <div
              key={link.id}
              onClick={() => handleOpenLink(link)}
              className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between group ${link.themeColor.bg} ${link.themeColor.border}`}
            >
              <div>
                {/* Top row: Icon + Badge */}
                <div className="flex items-center justify-between mb-2.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-xs transition-transform group-hover:scale-110 ${link.themeColor.iconBg}`}>
                    <span className="material-symbols-outlined text-xl">
                      {link.icon}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/80 shadow-xs text-on-surface border border-surface-container/60">
                    {link.badge}
                  </span>
                </div>

                {/* Title & Description */}
                <h4 className={`font-bold text-xs tracking-tight leading-snug line-clamp-1 group-hover:underline ${link.themeColor.text}`}>
                  {link.name}
                </h4>
                <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed line-clamp-2">
                  {link.description}
                </p>
              </div>

              {/* Bottom Action Footer */}
              <div className="mt-3 pt-2.5 border-t border-black/5 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-0.5">
                  <span>{link.isInternal ? 'Buka Modul' : 'Akses Portal'}</span>
                  <span className="material-symbols-outlined text-xs transition-transform group-hover:translate-x-0.5">
                    {link.isInternal ? 'arrow_forward' : 'open_in_new'}
                  </span>
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 rounded-xl bg-surface-container-low border border-dashed border-surface-container text-center space-y-2">
          <span className="material-symbols-outlined text-2xl text-outline">search_off</span>
          <p className="text-xs text-on-surface-variant font-medium">
            Tidak ada portal kedinasan yang cocok dengan &ldquo;{searchQuery}&rdquo;.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedFilter('ALL');
            }}
            className="text-xs text-primary font-bold hover:underline"
          >
            Reset Pencarian
          </button>
        </div>
      )}
    </div>
  );
};

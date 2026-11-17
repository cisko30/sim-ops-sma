import React, { useState, useEffect, useMemo } from 'react';
import { SCHOOL_INFO as DEFAULT_SCHOOL_INFO } from '../../data/mockData';
import { SchoolInfo } from '../../types';

interface SidebarProps {
  currentPath: string;
  onSelectPath: (path: string) => void;
  isOpen: boolean;
  onClose: () => void;
  schoolInfo?: SchoolInfo;
  activeRole?: string;
}

interface NavItem {
  name: string;
  path: string;
  icon: string;
  badge?: string;
  indicator?: boolean;
}

interface NavSection {
  title: string;
  icon: string;
  badge?: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Dashboard',
    icon: 'space_dashboard',
    items: [
      { name: 'Ringkasan Sekolah', path: 'ringkasan-sekolah', icon: 'dashboard' },
      { name: 'Bank Skills & SOP OPS', path: 'bank-skills-ops', icon: 'psychology_alt', indicator: true },
      { name: 'Aktivitas Terbaru', path: 'aktivitas-terbaru', icon: 'history' },
    ]
  },
  {
    title: 'Jurnal Harian OPS',
    icon: 'edit_calendar',
    badge: 'Harian',
    items: [
      { name: 'Dashboard Jurnal', path: 'dashboard-jurnal', icon: 'query_stats' },
      { name: 'Input & Riwayat Jurnal', path: 'input-dan-riwayat-jurnal', icon: 'edit_note' },
      { name: 'Generator Jurnal Otomatis', path: 'generator-jurnal-otomatis', icon: 'auto_awesome', indicator: true },
      { name: 'Kalender Jurnal', path: 'kalender-jurnal', icon: 'calendar_month' },
      { name: 'Laporan & Review Jurnal', path: 'laporan-dan-review-jurnal', icon: 'summarize' },
    ]
  },
  {
    title: 'Data Master',
    icon: 'database',
    items: [
      { name: 'Profil Sekolah', path: 'profil-sekolah', icon: 'account_balance' },
      { name: 'Data GTK', path: 'data-gtk', icon: 'badge' },
      { name: 'Data Peserta Didik', path: 'data-peserta-didik', icon: 'school' },
      { name: 'Data Rombel', path: 'data-rombel', icon: 'groups' },
      { name: 'Mata Pelajaran & Kurikulum', path: 'mata-pelajaran-dan-kurikulum', icon: 'menu_book' },
    ]
  },
  {
    title: 'Manajemen Kurikulum',
    icon: 'calculate',
    items: [
      { name: 'Rombel & Kalkulator JTM', path: 'rombel-dan-kalkulator-jtm', icon: 'calculate' },
      { name: 'Distribusi Mengajar', path: 'distribusi-mengajar', icon: 'assignment_ind' },
      { name: 'Linieritas Sertifikasi', path: 'linieritas-sertifikasi', icon: 'verified_user' },
    ]
  },
  {
    title: 'Integrasi Dapodik',
    icon: 'sync_alt',
    items: [
      { name: 'Koneksi & Sinkronisasi', path: 'koneksi-dan-sinkronisasi', icon: 'sync', indicator: true },
      { name: 'Quick Links Portal Pusat', path: 'quick-links-portal-pusat', icon: 'hub' },
    ]
  },
  {
    title: 'Program PIP',
    icon: 'account_balance_wallet',
    items: [
      { name: 'Manajemen PIP', path: 'manajemen-pip', icon: 'account_balance_wallet' },
      { name: 'Surat & Kuasa Kolektif', path: 'surat-dan-kuasa-kolektif', icon: 'description' },
    ]
  },
  {
    title: 'E-Arsip & Generator',
    icon: 'folder_shared',
    items: [
      { name: 'E-Arsip Digital Dokumen', path: 'e-arsip-digital-dokumen', icon: 'folder_shared' },
      { name: 'Generator SK & Surat', path: 'generator-sk-dan-surat', icon: 'draft' },
    ]
  },
  {
    title: 'Laporan & Jadwal',
    icon: 'analytics',
    items: [
      { name: 'Reporting Center', path: 'reporting-center', icon: 'analytics' },
      { name: 'Kalender & Deadline', path: 'kalender-dan-deadline', icon: 'event_available' },
      { name: 'Konfigurasi Sistem', path: 'konfigurasi-sistem', icon: 'settings' },
    ]
  }
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onSelectPath,
  isOpen,
  onClose,
  schoolInfo: propSchoolInfo,
  activeRole = 'OPS'
}) => {
  const school = propSchoolInfo || DEFAULT_SCHOOL_INFO;
  const [searchQuery, setSearchQuery] = useState('');

  // Store open state for each menu section
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    NAV_SECTIONS.forEach((sec) => {
      // Default open: section with active item or Dashboard & Jurnal
      const hasActive = sec.items.some((item) => item.path === currentPath);
      initialState[sec.title] = hasActive || sec.title === 'Dashboard' || sec.title === 'Jurnal Harian OPS';
    });
    return initialState;
  });

  // Whenever currentPath changes, make sure the section containing the active route is expanded
  useEffect(() => {
    NAV_SECTIONS.forEach((sec) => {
      if (sec.items.some((item) => item.path === currentPath)) {
        setOpenSections((prev) => ({ ...prev, [sec.title]: true }));
      }
    });
  }, [currentPath]);

  // Toggle single section
  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  // Toggle all sections
  const allOpen = Object.values(openSections).every(Boolean);
  const toggleAll = () => {
    const nextState = !allOpen;
    const updated: Record<string, boolean> = {};
    NAV_SECTIONS.forEach((s) => {
      updated[s.title] = nextState;
    });
    setOpenSections(updated);
  };

  // Filter sections by search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return NAV_SECTIONS;
    const q = searchQuery.toLowerCase().trim();
    return NAV_SECTIONS.map((sec) => {
      const matchSection = sec.title.toLowerCase().includes(q);
      const matchedItems = sec.items.filter(
        (item) => item.name.toLowerCase().includes(q) || item.path.toLowerCase().includes(q)
      );
      if (matchSection) {
        return sec; // return all items if section matches
      }
      return {
        ...sec,
        items: matchedItems
      };
    }).filter((sec) => sec.items.length > 0);
  }, [searchQuery]);

  // Operator initials for avatar
  const initials = useMemo(() => {
    const names = (school.operatorName || 'Bagas Pratama').split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return names[0].substring(0, 2).toUpperCase();
  }, [school.operatorName]);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen w-80 bg-surface-container-lowest border-r border-surface-container/70 shadow-sm z-50 flex flex-col justify-between transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Section: Brand + Search + Menu */}
        <div className="flex flex-col min-h-0 flex-1">
          {/* Brand Header */}
          <div className="p-4 bg-surface-container-low/50 dark:bg-slate-900 border-b border-surface-container/60 dark:border-slate-800">
            <div className="flex items-center gap-3">
              {/* Logo container with subtle glow */}
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 p-1.5 shadow-sm border border-surface-container dark:border-slate-700 flex items-center justify-center">
                  <img
                    src="/logo-sma-nu.png?v=3"
                    alt="Logo SMA NU Kaplongan"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Fallback if image fails
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="material-symbols-outlined text-primary dark:text-sky-400 text-2xl hidden fallback-icon">
                    account_balance
                  </span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-800 flex items-center justify-center" title="Server Aktif">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                </div>
              </div>

              {/* Identity text */}
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base text-primary dark:text-sky-400 tracking-tight truncate">
                    SIM-OPS SMA
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 dark:bg-sky-500/20 text-primary dark:text-sky-300 text-[11px] font-extrabold uppercase">
                    v2.5
                  </span>
                </div>
                <span className="font-semibold text-sm text-on-surface dark:text-slate-100 truncate mt-0.5">
                  {school.schoolName}
                </span>
                <span className="text-xs text-on-surface-variant dark:text-slate-400 font-medium truncate flex items-center gap-1.5 mt-0.5">
                  <span>NPSN {school.npsn}</span>
                  <span className="text-outline dark:text-slate-500">•</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">Akred. {school.accreditation}</span>
                </span>
              </div>
            </div>

            {/* Quick Live Search Bar */}
            <div className="mt-3.5 relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-base text-outline dark:text-slate-400 pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari modul atau menu..."
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-surface-container-low/70 dark:bg-slate-800/80 border border-surface-container dark:border-slate-700 text-sm text-on-surface dark:text-slate-100 placeholder:text-outline/70 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-sky-500/30 focus:border-primary dark:focus:border-sky-500 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface p-1 rounded-full"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}
            </div>
          </div>

          {/* Section Toolbar: Navigasi + Toggle All */}
          <div className="px-4 py-2.5 flex items-center justify-between border-b border-surface-container/50 dark:border-slate-800 bg-surface-container-lowest/50 dark:bg-slate-900 text-xs text-on-surface-variant dark:text-slate-400 font-medium">
            <span className="uppercase tracking-wider font-bold text-outline dark:text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary dark:bg-sky-400"></span>
              <span>Navigasi Modul</span>
            </span>
            <button
              type="button"
              onClick={toggleAll}
              className="text-primary dark:text-sky-400 hover:text-primary-container font-semibold flex items-center gap-1.5 transition-colors px-2 py-1 rounded-lg hover:bg-surface-container dark:hover:bg-slate-800 text-xs"
              title={allOpen ? 'Tutup semua submenu' : 'Buka semua submenu'}
            >
              <span className="material-symbols-outlined text-sm">
                {allOpen ? 'unfold_less' : 'unfold_more'}
              </span>
              <span>{allOpen ? 'Ciutkan' : 'Buka Semua'}</span>
            </button>
          </div>

          {/* Navigation Links Scrollable Area */}
          <nav className="flex-1 px-3 py-2.5 space-y-1.5 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-400 dark:hover:[&::-webkit-scrollbar-thumb]:bg-slate-600">
            {filteredSections.map((section) => {
              const isSectionOpen = searchQuery.trim() ? true : !!openSections[section.title];
              const hasActiveChild = section.items.some((item) => item.path === currentPath);

              return (
                <div key={section.title} className="rounded-xl transition-all">
                  {/* Section Accordion Header */}
                  <button
                    type="button"
                    onClick={() => toggleSection(section.title)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all cursor-pointer group select-none ${
                      hasActiveChild
                        ? 'bg-primary/10 text-primary font-bold'
                        : 'text-on-surface hover:text-primary hover:bg-surface-container-low/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                          hasActiveChild
                            ? 'bg-primary text-white shadow-xs'
                            : 'bg-surface-container-low text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-lg">
                          {section.icon}
                        </span>
                      </div>
                      <span className="text-sm tracking-normal font-semibold truncate">
                        {section.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {section.badge && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          {section.badge}
                        </span>
                      )}

                      {/* Count badge */}
                      <span
                        className={`text-xs min-w-5 text-center px-2 py-0.5 rounded-full font-bold transition-colors ${
                          hasActiveChild
                            ? 'bg-primary/15 text-primary'
                            : 'bg-surface-container-low text-outline group-hover:text-on-surface'
                        }`}
                      >
                        {section.items.length}
                      </span>

                      {/* Chevron Indicator */}
                      <span
                        className={`material-symbols-outlined text-base transition-transform duration-200 ${
                          isSectionOpen ? 'rotate-180 text-primary' : 'text-outline/70 group-hover:text-on-surface'
                        }`}
                      >
                        expand_more
                      </span>
                    </div>
                  </button>

                  {/* Submenu Items */}
                  <div
                    className={`overflow-hidden transition-all duration-200 ease-in-out ${
                      isSectionOpen ? 'max-h-96 opacity-100 mt-1 mb-1.5' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="ml-6 pl-3 space-y-1 border-l-2 border-surface-container">
                      {section.items.map((item) => {
                        const isActive = currentPath === item.path;
                        return (
                          <button
                            key={item.path}
                            type="button"
                            onClick={() => {
                              onSelectPath(item.path);
                              if (window.innerWidth < 1024) onClose();
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-left group/item ${
                              isActive
                                ? 'bg-primary text-white font-semibold shadow-xs'
                                : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span
                                className={`material-symbols-outlined text-base shrink-0 transition-transform group-hover/item:scale-110 ${
                                  isActive ? 'text-white' : 'text-outline group-hover/item:text-primary'
                                }`}
                              >
                                {item.icon}
                              </span>
                              <span className="truncate text-sm leading-normal font-medium">
                                {item.name}
                              </span>
                            </div>

                            {item.indicator && (
                              <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-200 animate-pulse shrink-0"></span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredSections.length === 0 && (
              <div className="p-4 text-center text-sm text-outline">
                <span className="material-symbols-outlined text-2xl block mb-1">manage_search</span>
                Tidak ada menu &ldquo;{searchQuery}&rdquo;
              </div>
            )}
          </nav>
        </div>

        {/* Bottom Section: Operator Card + Server Status */}
        <div className="p-3.5 bg-surface-container-low/70 dark:bg-slate-900 border-t border-surface-container dark:border-slate-800 space-y-2.5">
          {/* Operator Profile Pill */}
          <button
            type="button"
            onClick={() => {
              onSelectPath('profil-sekolah');
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full p-2.5 rounded-xl bg-surface-container-lowest dark:bg-slate-800 hover:bg-surface-container dark:hover:bg-slate-700/80 border border-surface-container dark:border-slate-700 shadow-xs flex items-center justify-between gap-3 transition-all text-left group"
            title="Buka Pengaturan Profil Sekolah"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-primary/10 dark:bg-sky-500/20 text-primary dark:text-sky-300 font-bold text-sm flex items-center justify-center shrink-0 border border-primary/20 dark:border-sky-500/30 group-hover:bg-primary group-hover:text-white transition-colors">
                {initials}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-sm text-on-surface dark:text-slate-100 truncate group-hover:text-primary dark:group-hover:text-sky-400 transition-colors">
                  {school.operatorName}
                </span>
                <span className="text-xs text-on-surface-variant dark:text-slate-400 truncate mt-0.5">
                  {school.operatorRole || 'Operator Sekolah'} ({activeRole})
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-lg text-outline dark:text-slate-400 group-hover:text-primary dark:group-hover:text-sky-400 transition-transform group-hover:translate-x-0.5">
              chevron_right
            </span>
          </button>

          {/* Dapodik Server Health Pill */}
          <div className="px-3.5 py-2.5 rounded-xl bg-surface-container-lowest dark:bg-slate-800 border border-surface-container dark:border-slate-700 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <span className="font-bold text-slate-800 dark:text-slate-200 truncate">Dapodikdasmen v2025.b</span>
            </div>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold shrink-0 text-xs">Terhubung</span>
          </div>
        </div>
      </aside>
    </>
  );
};

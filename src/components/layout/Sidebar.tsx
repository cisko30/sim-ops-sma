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
  activeRole: _activeRole = 'OPS'
}) => {
  const school = propSchoolInfo || DEFAULT_SCHOOL_INFO;

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
        className={`fixed left-0 top-0 h-screen w-72 bg-white dark:bg-[#0c1322] border-r border-slate-200/80 dark:border-slate-800/80 shadow-md dark:shadow-2xl dark:shadow-black/30 z-50 flex flex-col justify-between transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Section: Brand + Menu */}
        <div className="flex flex-col min-h-0 flex-1">
          {/* Brand Header */}
          <div className="p-3.5 bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800/80">
            <div className="flex items-center gap-3">
              {/* Logo container with pulse indicator */}
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 p-1 shadow-xs border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center">
                  <img
                    src="/logo-sma-nu.png?v=3"
                    alt="Logo SMA NU Kaplongan"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="material-symbols-outlined text-sky-500 text-xl hidden fallback-icon">
                    account_balance
                  </span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-800 flex items-center justify-center" title="Server Aktif">
                  <span className="w-1 h-1 rounded-full bg-white animate-pulse"></span>
                </div>
              </div>

              {/* Identity text */}
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-[15px] text-slate-800 dark:text-sky-400 tracking-tight truncate">
                    SIM-OPS SMA
                  </span>
                  <span className="px-1.5 py-0.2 rounded-full bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-300 text-[10px] font-bold uppercase tracking-wider">
                    v2.5
                  </span>
                </div>
                <span className="font-semibold text-xs text-slate-700 dark:text-slate-200 truncate mt-0.5">
                  {school.schoolName}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate flex items-center gap-1.5 mt-0.5">
                  <span>NPSN {school.npsn}</span>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Akred. {school.accreditation}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links Scrollable Area */}
          <nav className="flex-1 px-2.5 py-3 space-y-1 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700/80 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-400 dark:hover:[&::-webkit-scrollbar-thumb]:bg-slate-600">
            {NAV_SECTIONS.map((section) => {
              const isSectionOpen = !!openSections[section.title];
              const hasActiveChild = section.items.some((item) => item.path === currentPath);

              return (
                <div key={section.title} className="rounded-xl transition-all">
                  {/* Section Accordion Header */}
                  <button
                    type="button"
                    onClick={() => toggleSection(section.title)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-all cursor-pointer group select-none ${
                      hasActiveChild
                        ? 'bg-sky-500/10 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 font-semibold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                          hasActiveChild
                            ? 'bg-sky-500/15 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400'
                            : 'bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700/70 group-hover:text-slate-800 dark:group-hover:text-slate-200'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {section.icon}
                        </span>
                      </div>
                      <span className="text-[13px] tracking-tight truncate">
                        {section.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {section.badge && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">
                          {section.badge}
                        </span>
                      )}

                      {/* Count badge */}
                      <span
                        className={`text-[10px] min-w-4 text-center px-1.5 py-0.2 rounded-full font-bold transition-colors ${
                          hasActiveChild
                            ? 'bg-sky-500/15 text-sky-700 dark:text-sky-300'
                            : 'bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                        }`}
                      >
                        {section.items.length}
                      </span>

                      {/* Chevron Indicator */}
                      <span
                        className={`material-symbols-outlined text-sm transition-transform duration-200 ${
                          isSectionOpen
                            ? hasActiveChild
                              ? 'rotate-180 text-sky-600 dark:text-sky-400'
                              : 'rotate-180 text-slate-500 dark:text-slate-400'
                            : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
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
                    <div className="ml-5 pl-2.5 space-y-0.5 border-l border-slate-200/80 dark:border-slate-800/80">
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
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all text-left group/item ${
                              isActive
                                ? 'bg-sky-600 text-white font-medium shadow-xs shadow-sky-600/20 dark:bg-sky-500/20 dark:text-sky-300 dark:border dark:border-sky-500/30'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className={`material-symbols-outlined text-[17px] shrink-0 transition-transform group-hover/item:scale-105 ${
                                  isActive
                                    ? 'text-white dark:text-sky-300'
                                    : 'text-slate-400 dark:text-slate-500 group-hover/item:text-slate-600 dark:group-hover/item:text-slate-300'
                                }`}
                              >
                                {item.icon}
                              </span>
                              <span className="truncate text-xs font-medium">
                                {item.name}
                              </span>
                            </div>

                            {item.indicator && (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ring-2 ring-emerald-400/30 animate-pulse shrink-0"></span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Operator Card + Server Status */}
        <div className="p-3 bg-slate-50/80 dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2">
          {/* Operator Profile Pill */}
          <button
            type="button"
            onClick={() => {
              onSelectPath('profil-sekolah');
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full p-2 rounded-xl bg-white dark:bg-slate-800/70 hover:bg-slate-100/90 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 shadow-xs flex items-center justify-between gap-2.5 transition-all text-left group"
            title="Buka Pengaturan Profil Sekolah"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-sky-500/15 dark:bg-sky-500/20 text-sky-600 dark:text-sky-300 font-bold text-xs flex items-center justify-center shrink-0 border border-sky-500/30 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                {initials}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  {school.operatorName}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {school.operatorRole || 'Koordinator Operator Sekolah'}
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-base text-slate-400 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-transform group-hover:translate-x-0.5">
              chevron_right
            </span>
          </button>

          {/* Dapodik Server Health Pill */}
          <div className="px-3 py-1.5 rounded-lg bg-white/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px] truncate">Dapodikdasmen v2025.b</span>
            </div>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0 text-[11px]">Terhubung</span>
          </div>
        </div>
      </aside>
    </>
  );
};

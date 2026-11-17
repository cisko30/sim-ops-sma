import React, { useState, useEffect, useRef, useMemo } from 'react';
import { SCHOOL_INFO as DEFAULT_SCHOOL_INFO } from '../../data/mockData';
import { SchoolInfo } from '../../types';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'urgent' | 'warning' | 'info' | 'success';
  actionPath?: string;
  actionModal?: 'residu' | 'sync';
}

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Batas Cut-off Sinkronisasi Dapodik',
    message: 'Tersisa 18 hari menuju batas cut-off perbaikan data Dapodik semester genap. Pastikan seluruh residu terselesaikan.',
    time: '10 menit lalu',
    read: false,
    type: 'warning',
    actionPath: 'koneksi-dan-sinkronisasi'
  },
  {
    id: 'notif-2',
    title: '14 Residu NISN Siswa Perlu Validasi',
    message: 'Ditemukan 14 data NISN siswa yang belum terpadan di Dukcapil / Verval PD.',
    time: '45 menit lalu',
    read: false,
    type: 'urgent',
    actionPath: 'data-peserta-didik',
    actionModal: 'residu'
  },
  {
    id: 'notif-3',
    title: 'Verifikasi 8 Info GTK Memenuhi Syarat',
    message: '8 guru bersertifikasi telah mencapai beban minimal 24 JP tatap muka linier.',
    time: '2 jam lalu',
    read: false,
    type: 'success',
    actionPath: 'linieritas-sertifikasi'
  },
  {
    id: 'notif-4',
    title: 'Pemberkasan SPTJM & Kuasa PIP BNI',
    message: '14 berkas aktivasi rekening PIP siswa perlu dicetak dan ditandatangani Kepala Sekolah.',
    time: '5 jam lalu',
    read: true,
    type: 'info',
    actionPath: 'surat-dan-kuasa-kolektif'
  }
];

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenJurnalModal?: () => void;
  schoolInfo?: SchoolInfo;
  activeRole?: 'OPS' | 'Kurikulum' | 'Kepsek';
  onChangeRole?: (role: 'OPS' | 'Kurikulum' | 'Kepsek') => void;
  onSearch?: (query: string) => void;
  onNavigate?: (path: string) => void;
  onOpenResiduModal?: () => void;
  onOpenSyncModal?: () => void;
  onShowToast?: (msg: string) => void;
  isCloudSyncing?: boolean;
  cloudSyncedAt?: string | null;
  syncEngine?: 'supabase' | 'kv' | 'local';
  onManualSync?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  schoolInfo: propSchoolInfo,
  onNavigate,
  onOpenResiduModal,
  onOpenSyncModal,
  onShowToast,
  isCloudSyncing,
  cloudSyncedAt,
  syncEngine = 'local',
  onManualSync
}) => {
  const school = propSchoolInfo || DEFAULT_SCHOOL_INFO;

  // Dynamic initials for operator avatar
  const initials = useMemo(() => {
    const rawName = (school.operatorName || 'Operator')
      .replace(/^(H\.|Hj\.|Drs\.|Dr\.|Ir\.|M\.)\s*/i, '')
      .trim();
    const cleanName = rawName.split(',')[0].trim();
    const names = cleanName.split(/\s+/).filter(Boolean);
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return cleanName.substring(0, 2).toUpperCase();
  }, [school.operatorName]);
  
  // Dark Mode State
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('simops_theme');
      if (saved === 'dark') {
        document.documentElement.classList.add('dark');
        return true;
      }
      if (saved === 'light') {
        document.documentElement.classList.remove('dark');
        return false;
      }
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  // Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem('simops_notifications');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load notifications", e);
    }
    return DEFAULT_NOTIFICATIONS;
  });

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  // Sync notifications to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('simops_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.error(e);
    }
  }, [notifications]);

  // Click outside listener for notification dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    if (isNotifOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotifOpen]);

  const toggleDarkMode = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('simops_theme', 'dark');
      if (onShowToast) onShowToast("Mode Gelap diaktifkan");
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('simops_theme', 'light');
      if (onShowToast) onShowToast("Mode Terang diaktifkan");
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    if (onShowToast) onShowToast("Semua notifikasi telah ditandai sudah dibaca.");
  };

  const handleClearAllNotif = () => {
    setNotifications([]);
    setIsNotifOpen(false);
    if (onShowToast) onShowToast("Semua riwayat notifikasi telah dibersihkan.");
  };

  const handleNotificationClick = (item: AppNotification) => {
    // Mark as read
    setNotifications(prev =>
      prev.map(n => (n.id === item.id ? { ...n, read: true } : n))
    );
    setIsNotifOpen(false);

    if (item.actionModal === 'residu' && onOpenResiduModal) {
      onOpenResiduModal();
      return;
    }
    if (item.actionModal === 'sync' && onOpenSyncModal) {
      onOpenSyncModal();
      return;
    }
    if (item.actionPath && onNavigate) {
      onNavigate(item.actionPath);
      if (onShowToast) onShowToast(`Membuka: ${item.title}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-surface/90 backdrop-blur-xl border-b border-surface-container shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-30 flex items-center justify-between px-4 lg:px-space-lg transition-all">
      {/* Left: Mobile hamburger & system branding */}
      <div className="flex items-center gap-space-md">
        <button
          onClick={onToggleSidebar}
          className="p-space-xs rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors lg:hidden"
          title="Toggle Sidebar"
          type="button"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        <div className="flex items-center gap-2">
          <img
            src="/logo-sma-nu.png"
            alt="Logo SMA NU"
            className="w-6 h-6 object-contain lg:hidden"
          />
          <span className="font-headline-sm text-sm sm:text-base font-bold text-primary tracking-tight">
            {school.name}
          </span>
          <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-outline-variant"></span>
          <span className="hidden sm:inline text-xs text-on-surface-variant font-medium">
            {school.schoolName}
          </span>
        </div>
      </div>

      {/* Right: Notifications, dark mode, profile */}
      <div className="flex items-center gap-2 lg:gap-space-md">
        {/* Cloud Sync Status Indicator */}
        <button
          type="button"
          onClick={onManualSync}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] shadow-2xs transition-all cursor-pointer select-none active:scale-95 ${
            syncEngine === 'supabase'
              ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
              : 'bg-surface-container-low dark:bg-slate-800 border-surface-container dark:border-slate-700 text-on-surface-variant dark:text-slate-300 hover:bg-surface-container dark:hover:bg-slate-700'
          }`}
          title={
            isCloudSyncing
              ? "Sedang menyinkronkan dengan database cloud..."
              : syncEngine === 'supabase'
              ? "Tersinkronisasi Realtime dengan Supabase PostgreSQL Cloud (Klik untuk paksa sinkronisasi)"
              : "Tersinkronisasi dengan Server Awan (Klik untuk paksa sinkronisasi)"
          }
        >
          {isCloudSyncing ? (
            <>
              <span className="material-symbols-outlined text-xs text-amber-500 animate-spin">sync</span>
              <span className="hidden sm:inline text-amber-600 dark:text-amber-400 font-semibold tracking-tight">Menyinkronkan...</span>
            </>
          ) : (
            <>
              <span className={`w-2 h-2 rounded-full shrink-0 ${
                syncEngine === 'supabase' 
                  ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' 
                  : 'bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.6)]'
              }`}></span>
              <span className="font-medium tracking-tight">
                <span className="hidden sm:inline">
                  {syncEngine === 'supabase' ? 'Supabase ' : 'Sinkron Awan '}
                </span>
                {cloudSyncedAt ? cloudSyncedAt : 'Aktif'}
              </span>
            </>
          )}
        </button>

        {/* Notification Container & Popover */}
        <div className="relative" ref={notifDropdownRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`relative p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors ${
              isNotifOpen ? 'bg-surface-container text-primary font-bold' : ''
            }`}
            title="Pusat Notifikasi Sistem"
            type="button"
            aria-label="Pusat Notifikasi"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-white font-mono text-[10px] font-bold shadow-xs animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Popover Dropdown */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Header */}
              <div className="p-3.5 px-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-primary">notifications_active</span>
                  <span className="text-xs font-bold text-primary">Notifikasi Sistem</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-error/10 text-error text-[10px] font-bold">
                      {unreadCount} Baru
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="text-[11px] font-semibold text-secondary hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">done_all</span>
                    <span>Tandai dibaca</span>
                  </button>
                )}
              </div>

              {/* Notification Items List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-surface-container/60">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-outline">
                    <span className="material-symbols-outlined text-3xl mb-1 text-outline-variant block">
                      notifications_off
                    </span>
                    <p className="text-xs font-medium">Tidak ada notifikasi saat ini</p>
                  </div>
                ) : (
                  notifications.map((item) => {
                    const iconConfig = {
                      urgent: { icon: 'error', color: 'text-error bg-error/10' },
                      warning: { icon: 'warning', color: 'text-amber-700 bg-amber-100' },
                      success: { icon: 'verified', color: 'text-emerald-700 bg-emerald-100' },
                      info: { icon: 'info', color: 'text-secondary bg-secondary/10' }
                    }[item.type];

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleNotificationClick(item)}
                        className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                          !item.read
                            ? 'bg-surface-container-low/50 hover:bg-surface-container'
                            : 'hover:bg-surface-container-low/30'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${iconConfig.color}`}
                        >
                          <span className="material-symbols-outlined text-base">
                            {iconConfig.icon}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h5
                              className={`text-xs truncate ${
                                !item.read ? 'font-bold text-primary' : 'font-medium text-on-surface'
                              }`}
                            >
                              {item.title}
                            </h5>
                            {!item.read && (
                              <span className="w-2 h-2 rounded-full bg-secondary shrink-0"></span>
                            )}
                          </div>
                          <p className="text-[11px] text-on-surface-variant line-clamp-2 mt-0.5 leading-relaxed">
                            {item.message}
                          </p>
                          <div className="flex items-center justify-between mt-1.5 pt-1 text-[10px] text-outline">
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-xs">schedule</span>
                              <span>{item.time}</span>
                            </span>
                            {item.actionPath && (
                              <span className="text-secondary font-bold flex items-center gap-0.5 hover:underline">
                                <span>Buka</span>
                                <span className="material-symbols-outlined text-xs">chevron_right</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-2.5 px-4 bg-surface-container-low/80 border-t border-surface-container flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={handleClearAllNotif}
                    className="text-[11px] text-outline hover:text-error transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">delete_sweep</span>
                    <span>Hapus Semua</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsNotifOpen(false)}
                    className="text-[11px] text-primary font-bold hover:underline"
                  >
                    Tutup
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dark mode button */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          title={isDark ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
          type="button"
          aria-label="Toggle Mode Tampilan"
        >
          <span className="material-symbols-outlined text-xl">
            {isDark ? 'dark_mode' : 'light_mode'}
          </span>
        </button>

        {/* User profile */}
        <div
          onClick={() => onNavigate?.('profil-sekolah')}
          className="flex items-center gap-2 pl-3 border-l border-surface-container dark:border-slate-800 cursor-pointer group"
          title="Buka Pengaturan Profil Sekolah"
        >
          <div className="w-8 h-8 rounded-full bg-primary dark:bg-sky-500/20 text-white dark:text-sky-300 flex items-center justify-center font-bold text-xs ring-2 ring-primary/20 dark:ring-sky-500/30 shadow-xs group-hover:scale-105 transition-transform">
            {initials}
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="font-label-md text-xs text-on-surface dark:text-slate-100 font-bold leading-tight group-hover:text-primary dark:group-hover:text-sky-400 transition-colors">
              {school.operatorName}
            </span>
            <span className="font-label-sm text-[11px] text-on-surface-variant dark:text-slate-400 leading-tight">
              {school.operatorRole}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

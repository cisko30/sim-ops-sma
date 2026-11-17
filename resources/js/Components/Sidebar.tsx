import React from 'react';

interface SidebarProps {
  currentPath: string;
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { group: 'Dashboard', items: [{ name: 'Ringkasan Sekolah', path: '/dashboard', icon: 'dashboard', active: true }, { name: 'Aktivitas Terbaru', path: '/dashboard#aktivitas', icon: 'history' }] },
  { group: 'Data Master', items: [{ name: 'Data GTK', path: '/gtk', icon: 'badge' }, { name: 'Data Peserta Didik', path: '/students', icon: 'school' }, { name: 'Data Rombel', path: '/classrooms', icon: 'groups' }] },
  { group: 'Manajemen Kurikulum', items: [{ name: 'Rombel & Kalkulator JTM', path: '/curriculum', icon: 'calculate' }] },
  { group: 'Integrasi Dapodik', items: [{ name: 'Koneksi & Sinkronisasi', path: '/dapodik', icon: 'sync', indicator: true }] },
  { group: 'Program PIP', items: [{ name: 'Manajemen PIP', path: '/pip', icon: 'account_balance_wallet' }] },
  { group: 'E-Arsip & Generator', items: [{ name: 'E-Arsip Digital', path: '/archives', icon: 'folder_shared' }, { name: 'Generator SK & Surat', path: '/documents/sk', icon: 'draft' }] },
  { group: 'Jurnal Harian OPS', items: [{ name: 'Jurnal & Laporan', path: '/journals', icon: 'edit_note' }] },
  { group: 'Laporan & Jadwal', items: [{ name: 'Reporting Center', path: '/reports', icon: 'analytics' }, { name: 'Kalender & Deadline', path: '/calendar', icon: 'event_available' }, { name: 'Konfigurasi Sistem', path: '/settings', icon: 'settings' }] },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentPath, isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
      )}
      <aside className={`fixed left-0 top-0 h-screen w-72 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div>
          <div className="p-space-lg flex items-center gap-space-md bg-surface-container-low border-b border-surface-container">
            <div className="h-10 w-10 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold text-lg shadow-sm">
              <span className="material-symbols-outlined text-2xl">account_balance</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-headline-sm text-headline-sm text-primary tracking-tight truncate">SIM-OPS SMA</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant truncate">SMA Cipta Bangsa Mandiri</span>
              <span className="font-label-sm text-label-sm text-secondary truncate">NPSN 20108920 • Akred. A</span>
            </div>
          </div>
          <nav className="flex-1 px-space-sm py-space-md space-y-space-md">
            {NAV_ITEMS.map((g) => (
              <div key={g.group} className="space-y-space-xs">
                <div className="px-space-md py-space-xs font-label-sm text-label-sm text-outline tracking-wider uppercase">{g.group}</div>
                {g.items.map((item) => (
                  <a
                    key={item.name}
                    href={item.path}
                    className={`flex items-center justify-between px-space-md py-space-sm rounded-lg transition-colors ${
                      item.active ? 'bg-primary-container text-on-primary font-headline-sm shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-body-sm text-body-sm'
                    }`}
                  >
                    <div className="flex items-center gap-space-md">
                      <span className="material-symbols-outlined text-body-lg">{item.icon}</span>
                      <span>{item.name}</span>
                    </div>
                    {item.indicator && <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></span>}
                  </a>
                ))}
              </div>
            ))}
          </nav>
        </div>
        <div className="p-space-md bg-surface-container-low border-t border-surface-container">
          <div className="flex items-center gap-space-sm p-space-sm rounded-lg bg-surface-container-lowest border border-surface-container-high/60 shadow-sm">
            <span className="material-symbols-outlined text-secondary text-headline-sm">dns</span>
            <div className="flex flex-col min-w-0 leading-tight">
              <span className="font-label-sm text-label-sm text-on-surface font-bold truncate">Server Dapodik V.2024</span>
              <span className="font-label-sm text-label-sm text-emerald-600 font-medium">Status: Terhubung &amp; Aktif</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};


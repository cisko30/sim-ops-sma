import React from 'react';

interface HeaderProps {
  onToggleSidebar: () => void;
  activeRole: 'OPS' | 'Kurikulum' | 'Kepsek';
  onChangeRole: (role: 'OPS' | 'Kurikulum' | 'Kepsek') => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, activeRole, onChangeRole }) => {
  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-surface/90 backdrop-blur-xl border-b border-surface-container shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-30 flex items-center justify-between px-4 lg:px-space-lg transition-all">
      <div className="flex items-center gap-space-md flex-1 max-w-xl">
        <button
          onClick={onToggleSidebar}
          className="p-space-xs rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          type="button"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline font-body-sm">search</span>
          <input
            className="w-full h-10 pl-9 pr-16 bg-surface-container-low rounded-lg text-body-sm font-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all"
            placeholder="Cari NISN, NUPTK, Nama Guru, Dokumen SK..."
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-space-md">
        <div className="hidden sm:flex items-center gap-space-xs bg-surface-container-low rounded-lg p-0.5 border border-surface-container">
          {(['OPS', 'Kurikulum', 'Kepsek'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onChangeRole(r)}
              className={`px-space-sm py-1 rounded font-label-sm text-label-sm ${
                activeRole === r ? 'bg-primary-container text-on-primary font-bold shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <a
          href="/journals"
          className="flex items-center gap-space-xs h-10 px-3 lg:px-space-md rounded-lg bg-primary-container text-on-primary font-body-sm text-body-sm hover:bg-primary transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-body-sm">add</span>
          <span className="hidden md:inline">Tambah Jurnal OPS</span>
        </a>

        <div className="flex items-center gap-space-sm pl-space-sm border-l border-surface-container">
          <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs">
            BP
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="font-label-md text-label-md text-on-surface font-bold leading-tight">Bagas Pratama, S.Kom</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant leading-tight">Koordinator Dapodik &amp; SIM</span>
          </div>
        </div>
      </div>
    </header>
  );
};


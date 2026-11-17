import React from 'react';

interface QuickActionsCardProps {
  onAction?: (actionName: string) => void;
}

export const QuickActionsCard: React.FC<QuickActionsCardProps> = ({ onAction }) => {
  const actions = [
    { id: 'tambah-siswa', name: 'Tambah Siswa', icon: 'person_add' },
    { id: 'update-gtk', name: 'Update GTK', icon: 'badge' },
    { id: 'cetak-sptjm', name: 'Cetak SPTJM', icon: 'feed' },
    { id: 'upload-berkas', name: 'Upload Berkas', icon: 'cloud_upload' },
  ];

  return (
    <div className="bg-surface-container-lowest dark:bg-slate-900 p-space-lg rounded-2xl shadow-xs flex flex-col gap-space-sm border border-surface-container/80 dark:border-slate-800">
      <span className="font-label-md text-label-md text-primary dark:text-sky-400 font-bold uppercase tracking-wider">
        Aksi Cepat Data
      </span>
      <div className="grid grid-cols-2 gap-space-sm">
        {actions.map((act) => (
          <button
            key={act.id}
            onClick={() => onAction?.(act.id)}
            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 shadow-xs transition-all flex items-center gap-2.5 text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-sky-400 text-left cursor-pointer active:scale-95"
            type="button"
          >
            <span className="material-symbols-outlined text-sky-500 dark:text-sky-400 text-xl">
              {act.icon}
            </span>
            <span className="font-headline-sm text-xs font-semibold truncate">
              {act.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};


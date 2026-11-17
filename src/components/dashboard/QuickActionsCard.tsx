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
    <div className="bg-gradient-to-br from-surface-container-lowest to-surface-container-low p-space-lg rounded-xl shadow-sm flex flex-col gap-space-sm border border-surface-container">
      <span className="font-label-md text-label-md text-primary font-bold uppercase tracking-wider">
        Aksi Cepat Data
      </span>
      <div className="grid grid-cols-2 gap-space-sm">
        {actions.map((act) => (
          <button
            key={act.id}
            onClick={() => onAction?.(act.id)}
            className="p-space-sm rounded-lg bg-surface-container-lowest shadow-sm hover:shadow hover:bg-surface-container-low transition-all flex items-center gap-2 text-on-surface border border-surface-container text-left cursor-pointer active:scale-95"
            type="button"
          >
            <span className="material-symbols-outlined text-secondary text-xl">
              {act.icon}
            </span>
            <span className="font-headline-sm text-body-sm font-semibold truncate">
              {act.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { RESIDU_LIST } from '../../data/mockData';

interface ResiduModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResiduModal: React.FC<ResiduModalProps> = ({ isOpen, onClose }) => {
  const [filter, setFilter] = useState<'Semua' | 'Peserta Didik' | 'GTK' | 'Sarpras'>('Semua');

  if (!isOpen) return null;

  const filteredItems = filter === 'Semua' 
    ? RESIDU_LIST 
    : RESIDU_LIST.filter(item => item.kategori === filter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-2xl border border-surface-container overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-space-lg bg-surface-container-low border-b border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-error text-2xl">error</span>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-primary">Daftar Residu &amp; Validasi Data</h3>
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                12 data residu yang berpotensi menyebabkan ketidakvalidan cut-off Dapodik
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-space-lg py-2 bg-surface-container-low/50 border-b border-surface-container flex items-center gap-2">
          {(['Semua', 'Peserta Didik', 'GTK', 'Sarpras'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-full font-label-sm text-label-sm font-semibold transition-all ${
                filter === tab
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Residu List */}
        <div className="p-space-lg overflow-y-auto space-y-space-sm flex-1">
          {filteredItems.map((item) => {
            let badgeStyle = 'bg-amber-100 text-amber-800 border-amber-200';
            if (item.status === 'Kritis') badgeStyle = 'bg-error-container text-on-error-container border-error/20';
            if (item.status === 'Perbaikan') badgeStyle = 'bg-blue-100 text-blue-800 border-blue-200';

            return (
              <div
                key={item.id}
                className="p-space-md rounded-xl bg-surface-container-low border border-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-container-high/40 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-headline-sm text-body-sm font-bold text-on-surface">
                      {item.nama}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant px-2 py-0.5 rounded bg-surface-container">
                      {item.kategori}
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {item.keterangan}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <span className={`px-2.5 py-1 rounded-full font-label-sm text-label-sm font-bold border ${badgeStyle}`}>
                    {item.status}
                  </span>
                  <button
                    className="px-3 py-1 rounded-lg bg-surface-container-lowest text-primary hover:bg-primary hover:text-on-primary font-label-md text-label-md font-bold border border-surface-container transition-all"
                  >
                    Perbaiki
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-space-md bg-surface-container-low border-t border-surface-container flex justify-between items-center">
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            Menampilkan {filteredItems.length} dari {RESIDU_LIST.length} entri residu
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-primary-container text-on-primary font-headline-sm text-body-sm hover:bg-primary transition-all"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { MapelItem } from './MapelFormModal';

interface MapelJpAdjustModalProps {
  isOpen: boolean;
  onClose: () => void;
  mapelList: MapelItem[];
  onSaveAll: (updated: MapelItem[]) => void;
}

export const MapelJpAdjustModal: React.FC<MapelJpAdjustModalProps> = ({
  isOpen,
  onClose,
  mapelList,
  onSaveAll
}) => {
  const [items, setItems] = useState<MapelItem[]>(mapelList);

  React.useEffect(() => {
    setItems(mapelList);
  }, [mapelList, isOpen]);

  if (!isOpen) return null;

  const updateJp = (id: string, delta: number) => {
    setItems(prev => prev.map(m => {
      if (m.id === id) {
        const next = Math.max(1, Math.min(10, m.alokasiJp + delta));
        return { ...m, alokasiJp: next };
      }
      return m;
    }));
  };

  const totalJp = items.reduce((acc, curr) => acc + curr.alokasiJp, 0);

  const handleApply = () => {
    onSaveAll(items);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-surface rounded-2xl border border-surface-container shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">tune</span>
            </div>
            <div>
              <h3 className="font-bold text-base text-primary">
                Atur Alokasi Beban Jam Pelajaran (JP / Minggu)
              </h3>
              <p className="text-xs text-on-surface-variant">
                Struktur Kurikulum Merdeka SMA NU Kaplongan TA 2026/2027
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-outline"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Total Badge Bar */}
        <div className="px-6 py-3 bg-surface-container-lowest border-b border-surface-container flex items-center justify-between text-xs">
          <span className="text-on-surface-variant">
            Total Jam Pelajaran Terjadwal: <strong className="text-primary text-sm">{totalJp} JP / Minggu</strong>
          </span>
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
            Sesuai Standar Kurikulum Merdeka (44 - 48 JP)
          </span>
        </div>

        {/* Subject list with steppers */}
        <div className="p-6 overflow-y-auto space-y-2 text-xs">
          {items.map((m) => (
            <div 
              key={m.id} 
              className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex items-center justify-between gap-3 hover:bg-surface-container/60 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-surface border text-outline">
                    {m.kodeMapel}
                  </span>
                  <strong className="text-primary">{m.namaMapel}</strong>
                </div>
                <div className="text-[11px] text-on-surface-variant mt-0.5">
                  {m.kategori} • <span className="text-primary">{m.guruPengampu}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateJp(m.id, -1)}
                  className="w-7 h-7 rounded-lg bg-surface border border-surface-container hover:bg-surface-container flex items-center justify-center font-bold text-primary"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-sm text-primary">
                  {m.alokasiJp} JP
                </span>
                <button
                  type="button"
                  onClick={() => updateJp(m.id, 1)}
                  className="w-7 h-7 rounded-lg bg-surface border border-surface-container hover:bg-surface-container flex items-center justify-center font-bold text-primary"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-surface-container-low border-t border-surface-container flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high font-semibold text-xs text-on-surface-variant"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-5 py-2 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-container flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-base">check</span>
            <span>Terapkan Perubahan</span>
          </button>
        </div>
      </div>
    </div>
  );
};


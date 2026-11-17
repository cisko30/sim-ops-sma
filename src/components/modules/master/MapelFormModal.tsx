import React, { useState, useEffect } from 'react';
import { GTKItem } from '../../../data/modulesData';

export interface MapelItem {
  id: string;
  kodeMapel: string;
  namaMapel: string;
  kategori: 'Mata Pelajaran Wajib (Umum)' | 'Pilihan MIPA / Saintek' | 'Pilihan IPS / Soshum' | 'Pilihan Bahasa & Budaya' | 'Muatan Lokal & P5';
  fase: 'Fase E (Kelas X)' | 'Fase F (Kelas XI & XII)' | 'Semua Fase';
  alokasiJp: number;
  guruPengampu: string;
}

interface MapelFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (mapel: MapelItem) => void;
  initialData?: MapelItem | null;
  gtkList: GTKItem[];
}

export const MapelFormModal: React.FC<MapelFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  gtkList
}) => {
  const [formData, setFormData] = useState<Partial<MapelItem>>({
    kodeMapel: '',
    namaMapel: '',
    kategori: 'Mata Pelajaran Wajib (Umum)',
    fase: 'Semua Fase',
    alokasiJp: 3,
    guruPengampu: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        kodeMapel: `MP-${Math.floor(10 + Math.random() * 90)}`,
        namaMapel: '',
        kategori: 'Mata Pelajaran Wajib (Umum)',
        fase: 'Semua Fase',
        alokasiJp: 3,
        guruPengampu: gtkList[0]?.nama || 'Guru Mapel'
      });
    }
  }, [initialData, isOpen, gtkList]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaMapel?.trim()) return;

    const newMapel: MapelItem = {
      id: initialData?.id || `mp-${Date.now()}`,
      kodeMapel: formData.kodeMapel?.trim() || `MP-${Math.floor(10 + Math.random() * 90)}`,
      namaMapel: formData.namaMapel.trim(),
      kategori: formData.kategori || 'Mata Pelajaran Wajib (Umum)',
      fase: formData.fase || 'Semua Fase',
      alokasiJp: Number(formData.alokasiJp) || 2,
      guruPengampu: formData.guruPengampu || gtkList[0]?.nama || 'Belum Ditentukan'
    };

    onSave(newMapel);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div 
        className="w-full max-w-lg bg-surface rounded-2xl border border-surface-container shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">
                {initialData ? 'edit_document' : 'menu_book'}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-base text-primary">
                {initialData ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran Baru'}
              </h3>
              <p className="text-xs text-on-surface-variant">
                Struktur Kurikulum Merdeka SMA NU Kaplongan
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-on-surface-variant mb-1">
                Kode Mapel
              </label>
              <input
                type="text"
                value={formData.kodeMapel || ''}
                onChange={(e) => setFormData({ ...formData, kodeMapel: e.target.value })}
                placeholder="MP-01"
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-surface-container font-mono font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="col-span-2">
              <label className="block font-bold text-on-surface-variant mb-1">
                Nama Mata Pelajaran <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.namaMapel || ''}
                onChange={(e) => setFormData({ ...formData, namaMapel: e.target.value })}
                placeholder="Contoh: Matematika Tingkat Lanjut"
                className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-surface-container font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-on-surface-variant mb-1">
              Kategori Kurikulum
            </label>
            <select
              value={formData.kategori}
              onChange={(e) => setFormData({ ...formData, kategori: e.target.value as any })}
              className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-surface-container font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="Mata Pelajaran Wajib (Umum)">Mata Pelajaran Wajib (Umum)</option>
              <option value="Pilihan MIPA / Saintek">Pilihan MIPA / Saintek (Fase F)</option>
              <option value="Pilihan IPS / Soshum">Pilihan IPS / Soshum (Fase F)</option>
              <option value="Pilihan Bahasa & Budaya">Pilihan Bahasa &amp; Budaya</option>
              <option value="Muatan Lokal & P5">Muatan Lokal &amp; Projek P5</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-on-surface-variant mb-1">
                Tingkat / Fase
              </label>
              <select
                value={formData.fase}
                onChange={(e) => setFormData({ ...formData, fase: e.target.value as any })}
                className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-surface-container font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Semua Fase">Semua Fase (X, XI, XII)</option>
                <option value="Fase E (Kelas X)">Fase E (Kelas X)</option>
                <option value="Fase F (Kelas XI & XII)">Fase F (Kelas XI &amp; XII)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-on-surface-variant mb-1">
                Beban Jam (JP / Minggu)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.alokasiJp ?? 3}
                onChange={(e) => setFormData({ ...formData, alokasiJp: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-surface-container font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-on-surface-variant mb-1">
              Guru Pengampu Utama
            </label>
            <select
              value={formData.guruPengampu}
              onChange={(e) => setFormData({ ...formData, guruPengampu: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-surface-container font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {gtkList.map((g) => (
                <option key={g.id} value={g.nama}>
                  {g.nama} ({g.mapelUtama})
                </option>
              ))}
            </select>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-surface-container flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high font-semibold text-on-surface-variant"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-primary text-white font-bold hover:bg-primary-container flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-base">check</span>
              <span>{initialData ? 'Simpan Perubahan' : 'Tambahkan Mapel'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


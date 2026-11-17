import React, { useState, useEffect } from 'react';
import { RombelItem, GTKItem } from '../../../data/modulesData';

interface RombelFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rombel: RombelItem) => void;
  initialData?: RombelItem | null;
  gtkList: GTKItem[];
}

export const RombelFormModal: React.FC<RombelFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  gtkList
}) => {
  const [formData, setFormData] = useState<Partial<RombelItem>>({
    namaRombel: '',
    tingkat: 'X',
    kurikulum: 'Kurikulum Merdeka',
    waliKelas: '',
    ruang: 'R. Teori 01',
    jumlahSiswaL: 17,
    jumlahSiswaP: 18,
    totalSiswa: 35
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        namaRombel: '',
        tingkat: 'X',
        kurikulum: 'Kurikulum Merdeka',
        waliKelas: gtkList[0]?.nama || 'Belum Ditentukan',
        ruang: `R. Teori ${Math.floor(1 + Math.random() * 12)}`,
        jumlahSiswaL: 17,
        jumlahSiswaP: 18,
        totalSiswa: 35
      });
    }
  }, [initialData, isOpen, gtkList]);

  if (!isOpen) return null;

  const totalSiswa = (Number(formData.jumlahSiswaL) || 0) + (Number(formData.jumlahSiswaP) || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaRombel?.trim()) return;

    const newRombel: RombelItem = {
      id: initialData?.id || `rom-${Date.now()}`,
      namaRombel: formData.namaRombel.trim(),
      tingkat: formData.tingkat || 'X',
      kurikulum: formData.kurikulum || 'Kurikulum Merdeka',
      waliKelas: formData.waliKelas || gtkList[0]?.nama || 'Wali Kelas SMA NU',
      ruang: formData.ruang || 'R. Teori 01',
      jumlahSiswaL: Number(formData.jumlahSiswaL) || 0,
      jumlahSiswaP: Number(formData.jumlahSiswaP) || 0,
      totalSiswa: totalSiswa
    };

    onSave(newRombel);
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
                {initialData ? 'edit_square' : 'add_box'}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-base text-primary">
                {initialData ? 'Edit Rombongan Belajar' : 'Tambah Rombel Baru'}
              </h3>
              <p className="text-xs text-on-surface-variant">
                Manajemen Rombel Semester Ganjil TA 2026/2027
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
          <div>
            <label className="block font-bold text-on-surface-variant mb-1">
              Nama Rombel <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.namaRombel || ''}
              onChange={(e) => setFormData({ ...formData, namaRombel: e.target.value })}
              placeholder="Contoh: X-1, XI-MIPA 1, XII-IPS 2"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-surface-container font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-on-surface-variant mb-1">Tingkat Kelas</label>
              <select
                value={formData.tingkat}
                onChange={(e) => setFormData({ ...formData, tingkat: e.target.value as any })}
                className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-surface-container font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="X">Kelas X (Fase E)</option>
                <option value="XI">Kelas XI (Fase F)</option>
                <option value="XII">Kelas XII (Fase F)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-on-surface-variant mb-1">Kurikulum</label>
              <select
                value={formData.kurikulum}
                onChange={(e) => setFormData({ ...formData, kurikulum: e.target.value as any })}
                className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-surface-container font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Kurikulum Merdeka">Kurikulum Merdeka</option>
                <option value="Kurikulum 2013">Kurikulum 2013</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-on-surface-variant mb-1">Ruangan Kelas</label>
            <input
              type="text"
              value={formData.ruang || ''}
              onChange={(e) => setFormData({ ...formData, ruang: e.target.value })}
              placeholder="Contoh: R. Teori 01, Lab Komputer A"
              className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-surface-container font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block font-bold text-on-surface-variant mb-1">Wali Kelas</label>
            <select
              value={formData.waliKelas}
              onChange={(e) => setFormData({ ...formData, waliKelas: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-surface-container font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {gtkList.map((g) => (
                <option key={g.id} value={g.nama}>
                  {g.nama} ({g.mapelUtama})
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container space-y-2">
            <span className="font-bold text-primary block">Distribusi Siswa dalam Rombel</span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-on-surface-variant mb-1">Laki-Laki (L)</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={formData.jumlahSiswaL ?? 17}
                  onChange={(e) => setFormData({ ...formData, jumlahSiswaL: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 rounded-lg bg-surface border border-surface-container font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] text-on-surface-variant mb-1">Perempuan (P)</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={formData.jumlahSiswaP ?? 18}
                  onChange={(e) => setFormData({ ...formData, jumlahSiswaP: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 rounded-lg bg-surface border border-surface-container font-bold"
                />
              </div>
            </div>
            <div className="text-right text-[11px] text-emerald-700 font-bold pt-1">
              Total Kapasitas: {totalSiswa} Siswa
            </div>
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
              <span>{initialData ? 'Simpan Perubahan' : 'Tambahkan Rombel'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


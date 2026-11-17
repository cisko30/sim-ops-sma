import React, { useState, useEffect } from 'react';
import { SiswaItem, DAFTAR_30_ROMBEL } from '../../../data/modulesData';

interface SiswaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (siswa: SiswaItem) => void;
  initialData?: SiswaItem | null;
}

export const SiswaFormModal: React.FC<SiswaFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [formData, setFormData] = useState<Partial<SiswaItem>>({
    nama: '',
    nisn: '',
    nipd: '',
    rombel: 'X-1 (Fase E)',
    jenisKelamin: 'L',
    nikStatus: 'Valid',
    pipStatus: 'Bukan Penerima',
    nominalPip: 0,
    waliKelas: 'Siti Nurhalizah, S.Pd'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        nama: '',
        nisn: '',
        nipd: `2425${Math.floor(10000 + Math.random() * 90000)}`,
        rombel: 'X-1 (Fase E)',
        jenisKelamin: 'L',
        nikStatus: 'Valid',
        pipStatus: 'Bukan Penerima',
        nominalPip: 0,
        waliKelas: 'Siti Nurhalizah, S.Pd'
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama?.trim() || !formData.nisn?.trim()) return;

    const newSiswa: SiswaItem = {
      id: initialData?.id || `sis-${Date.now()}`,
      nama: formData.nama.trim(),
      nisn: formData.nisn.trim(),
      nipd: formData.nipd?.trim() || `2425${Math.floor(10000 + Math.random() * 90000)}`,
      rombel: formData.rombel || 'X-1 (Fase E)',
      jenisKelamin: formData.jenisKelamin || 'L',
      nikStatus: formData.nikStatus || 'Valid',
      pipStatus: formData.pipStatus || 'Bukan Penerima',
      nominalPip: formData.pipStatus !== 'Bukan Penerima' ? (Number(formData.nominalPip) || 1800000) : 0,
      waliKelas: formData.waliKelas || 'Wali Kelas SMA NU'
    };

    onSave(newSiswa);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div 
        className="w-full max-w-xl bg-surface rounded-2xl border border-surface-container shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">
                {initialData ? 'edit_note' : 'person_add'}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-base text-primary">
                {initialData ? 'Edit Data Peserta Didik' : 'Tambah Siswa Baru'}
              </h3>
              <p className="text-xs text-on-surface-variant">
                Master Data Peserta Didik SMA NU Kaplongan
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-on-surface-variant mb-1">
                Nama Lengkap Siswa <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.nama || ''}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                placeholder="Contoh: Muhammad Rizky Pratama"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-xs font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1">
                NISN (10 Digit) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={10}
                value={formData.nisn || ''}
                onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                placeholder="0078923412"
                className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-surface-container text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1">
                NIPD (Nomor Induk Peserta Didik)
              </label>
              <input
                type="text"
                value={formData.nipd || ''}
                onChange={(e) => setFormData({ ...formData, nipd: e.target.value })}
                placeholder="242510012"
                className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-surface-container text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1">
                Rombongan Belajar (Rombel)
              </label>
              <select
                value={formData.rombel}
                onChange={(e) => setFormData({ ...formData, rombel: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-surface-container text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {DAFTAR_30_ROMBEL.map((r) => (
                  <option key={r} value={`${r} (${r.startsWith('X-') ? 'Fase E' : 'Fase F'})`}>
                    Kelas {r} ({r.startsWith('X-') ? 'Fase E' : 'Fase F'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1">
                Jenis Kelamin
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, jenisKelamin: 'L' })}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                    formData.jenisKelamin === 'L'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-surface-container-low text-on-surface-variant border-surface-container'
                  }`}
                >
                  Laki-Laki (L)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, jenisKelamin: 'P' })}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                    formData.jenisKelamin === 'P'
                      ? 'bg-pink-600 text-white border-pink-600'
                      : 'bg-surface-container-low text-on-surface-variant border-surface-container'
                  }`}
                >
                  Perempuan (P)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1">
                Status Verval Dukcapil (NIK)
              </label>
              <select
                value={formData.nikStatus}
                onChange={(e) => setFormData({ ...formData, nikStatus: e.target.value as any })}
                className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-surface-container text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Valid">Valid (Padan Dukcapil)</option>
                <option value="Residu Dukcapil">Residu Dukcapil</option>
                <option value="Perbaikan KK">Perbaikan KK</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1">
                Nama Wali Kelas
              </label>
              <input
                type="text"
                value={formData.waliKelas || ''}
                onChange={(e) => setFormData({ ...formData, waliKelas: e.target.value })}
                placeholder="Contoh: Siti Nurhalizah, S.Pd"
                className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-surface-container text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="sm:col-span-2 p-3.5 rounded-xl bg-surface-container-low border border-surface-container space-y-2">
              <label className="block text-xs font-bold text-primary">
                Program Indonesia Pintar (PIP) SimPel
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] text-on-surface-variant block mb-1">Status PIP</span>
                  <select
                    value={formData.pipStatus}
                    onChange={(e) => {
                      const st = e.target.value as any;
                      setFormData({ 
                        ...formData, 
                        pipStatus: st,
                        nominalPip: st !== 'Bukan Penerima' ? 1800000 : 0
                      });
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-surface text-xs font-semibold border border-surface-container"
                  >
                    <option value="Bukan Penerima">Bukan Penerima</option>
                    <option value="Penerima Aktif">Penerima Aktif (SK Pemberian)</option>
                    <option value="Nominasi">Nominasi (Aktivasi Rekening)</option>
                  </select>
                </div>
                {formData.pipStatus !== 'Bukan Penerima' && (
                  <div>
                    <span className="text-[11px] text-on-surface-variant block mb-1">Nominal Bantuan PIP</span>
                    <input
                      type="number"
                      step="100000"
                      value={formData.nominalPip || 1800000}
                      onChange={(e) => setFormData({ ...formData, nominalPip: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 rounded-lg bg-surface text-xs font-bold text-emerald-700 border border-surface-container"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-surface-container flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface-variant"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-base">check</span>
              <span>{initialData ? 'Simpan Perubahan' : 'Tambahkan Siswa'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


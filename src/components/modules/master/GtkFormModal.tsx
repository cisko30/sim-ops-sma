import React, { useState, useEffect } from 'react';
import { GTKItem, DAPODIK_TUGAS_TAMBAHAN_LIST } from '../../../data/modulesData';

interface GtkFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (gtk: GTKItem) => void;
  initialData?: GTKItem | null;
}

export const GtkFormModal: React.FC<GtkFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [formData, setFormData] = useState<Partial<GTKItem>>({
    nama: '',
    nipNuptk: '',
    jenisPtk: 'Guru Mapel',
    statusKepegawaian: 'GTY',
    mapelUtama: '',
    kodeSertifikasi: '',
    jtmTatapMuka: 24,
    tugasTambahanId: 'none',
    tugasTambahan: 'Tidak Ada',
    jtmTugasTambahan: 0,
    sertifikasi: 'Belum',
    telepon: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        nama: '',
        nipNuptk: '',
        jenisPtk: 'Guru Mapel',
        statusKepegawaian: 'GTY',
        mapelUtama: '',
        kodeSertifikasi: '',
        jtmTatapMuka: 24,
        tugasTambahanId: 'none',
        tugasTambahan: 'Tidak Ada',
        jtmTugasTambahan: 0,
        sertifikasi: 'Belum',
        telepon: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Selected tugas tambahan jam
  const selectedTugas = DAPODIK_TUGAS_TAMBAHAN_LIST.find(t => t.id === formData.tugasTambahanId);
  const jtmTugasTambahan = selectedTugas ? selectedTugas.jam : 0;
  const jtmTatapMuka = Number(formData.jtmTatapMuka) || 0;
  const totalJtm = jtmTatapMuka + jtmTugasTambahan;
  const statusInfoGtk = totalJtm >= 24 ? 'Valid' : 'Belum Valid';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama?.trim()) return;

    const newGtk: GTKItem = {
      id: initialData?.id || `gtk-${Date.now()}`,
      nama: formData.nama.trim(),
      nipNuptk: formData.nipNuptk?.trim() || '-',
      jenisPtk: formData.jenisPtk || 'Guru Mapel',
      statusKepegawaian: formData.statusKepegawaian || 'GTY',
      mapelUtama: formData.mapelUtama?.trim() || 'Umum',
      kodeSertifikasi: formData.kodeSertifikasi?.trim() || (formData.sertifikasi === 'Sudah Sertifikasi' ? 'Bersertifikat' : '-'),
      jpPerRombel: 3,
      jumlahRombel: Math.ceil(jtmTatapMuka / 3) || 1,
      rombelList: ['X-1', 'XI-1'],
      jtmTatapMuka: jtmTatapMuka,
      jtmTugasTambahan: jtmTugasTambahan,
      tugasTambahan: selectedTugas && selectedTugas.id !== 'none' ? selectedTugas.nama : 'Tidak Ada',
      tugasTambahanId: selectedTugas ? selectedTugas.id : 'none',
      totalJtm: totalJtm,
      statusInfoGtk: statusInfoGtk,
      sertifikasi: formData.sertifikasi || 'Belum',
      telepon: formData.telepon?.trim() || '-'
    };

    onSave(newGtk);
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
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">
                {initialData ? 'badge' : 'person_add'}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-base text-primary">
                {initialData ? 'Edit Data PTK / Guru' : 'Tambah GTK Baru'}
              </h3>
              <p className="text-xs text-on-surface-variant">
                Master Data Pendidik &amp; Tenaga Kependidikan SMA NU Kaplongan
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
                Nama Lengkap &amp; Gelar <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.nama || ''}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                placeholder="Contoh: Drs. H. Toufik Zaenal Mustofa, M.Pd.I"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-xs font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1">
                NIP / NUPTK / NIPD
              </label>
              <input
                type="text"
                value={formData.nipNuptk || ''}
                onChange={(e) => setFormData({ ...formData, nipNuptk: e.target.value })}
                placeholder="Contoh: 197903152006041011"
                className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-surface-container text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1">
                Nomor Telepon / WhatsApp
              </label>
              <input
                type="text"
                value={formData.telepon || ''}
                onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                placeholder="081234567890"
                className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-surface-container text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1">
                Jenis PTK
              </label>
              <select
                value={formData.jenisPtk}
                onChange={(e) => setFormData({ ...formData, jenisPtk: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-surface-container text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Guru Mapel">Guru Mapel</option>
                <option value="Guru BK">Guru BK / Konselor</option>
                <option value="Kepala Sekolah">Kepala Sekolah</option>
                <option value="Tenaga Kependidikan">Tenaga Kependidikan / TU</option>
                <option value="Laboran">Laboran</option>
                <option value="Pustakawan">Pustakawan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1">
                Status Kepegawaian
              </label>
              <select
                value={formData.statusKepegawaian}
                onChange={(e) => setFormData({ ...formData, statusKepegawaian: e.target.value as any })}
                className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-surface-container text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="GTY">GTY (Guru Tetap Yayasan)</option>
                <option value="PNS">PNS (Pegawai Negeri Sipil)</option>
                <option value="PPPK">PPPK</option>
                <option value="Honor Sekolah">Honor Sekolah</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1">
                Mata Pelajaran Utama / Bidang Tugas
              </label>
              <input
                type="text"
                value={formData.mapelUtama || ''}
                onChange={(e) => setFormData({ ...formData, mapelUtama: e.target.value })}
                placeholder="Contoh: Matematika, Bahasa Indonesia"
                className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-surface-container text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1">
                Sertifikasi Pendidik
              </label>
              <select
                value={formData.sertifikasi}
                onChange={(e) => setFormData({ ...formData, sertifikasi: e.target.value as any })}
                className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-surface-container text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Sudah Sertifikasi">Sudah Sertifikasi (SKTP Aktif)</option>
                <option value="Belum">Belum Sertifikasi</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-on-surface-variant mb-1">
                Tugas Tambahan Resmi Dapodik (Aturan 2025)
              </label>
              <select
                value={formData.tugasTambahanId}
                onChange={(e) => setFormData({ ...formData, tugasTambahanId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-xs font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {DAPODIK_TUGAS_TAMBAHAN_LIST.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nama}
                  </option>
                ))}
              </select>
              {selectedTugas && (
                <p className="text-[11px] text-on-surface-variant mt-1">
                  Regulasi: <strong className="text-primary">{selectedTugas.nomorRegulasi}</strong> • Ekuivalensi: <strong>+{selectedTugas.jam} Jam</strong>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1">
                Jam Tatap Muka Reguler (JP/Minggu)
              </label>
              <input
                type="number"
                min="0"
                max="60"
                value={formData.jtmTatapMuka ?? 24}
                onChange={(e) => setFormData({ ...formData, jtmTatapMuka: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-surface-container text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Calculated JTM Summary Card */}
            <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex flex-col justify-center">
              <span className="text-[11px] text-on-surface-variant font-medium">Kalkulasi Total Beban Kerja (JTM):</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs">
                  {jtmTatapMuka} TM + {jtmTugasTambahan} TT = <strong className="text-base text-primary font-bold">{totalJtm} Jam</strong>
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  totalJtm >= 24 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {totalJtm >= 24 ? '✓ Info GTK Valid (24+ JP)' : '⚠ Kurang Jam Tatap Muka'}
                </span>
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
              <span>{initialData ? 'Simpan Perubahan' : 'Tambahkan GTK'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


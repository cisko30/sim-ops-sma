import React, { useState } from 'react';

interface JurnalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { tanggal: string; kategori: string; uraian: string; status: string }) => void;
}

export const JurnalModal: React.FC<JurnalModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [kategori, setKategori] = useState('Verifikasi Dokumen');
  const [uraian, setUraian] = useState('');
  const [status, setStatus] = useState('Selesai');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uraian.trim()) return;
    onSubmit({ tanggal, kategori, uraian, status });
    setUraian('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl border border-surface-container overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-space-lg bg-surface-container-low border-b border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">edit_note</span>
            <h3 className="font-headline-sm text-headline-sm text-primary">Input Jurnal Harian OPS</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-space-lg space-y-space-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-1 font-semibold">
                Tanggal Kegiatan
              </label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-surface-container text-body-sm font-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-1 font-semibold">
                Kategori Kegiatan
              </label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-surface-container text-body-sm font-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Verifikasi Dokumen">Verifikasi Dokumen</option>
                <option value="Sinkronisasi Dapodik">Sinkronisasi Dapodik</option>
                <option value="Distribusi Mengajar / JTM">Distribusi Mengajar / JTM</option>
                <option value="Pengelolaan PIP">Pengelolaan PIP</option>
                <option value="Verval Peserta Didik">Verval Peserta Didik</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-label-md text-label-md text-on-surface-variant mb-1 font-semibold">
              Uraian Pekerjaan &amp; Hasil
            </label>
            <textarea
              value={uraian}
              onChange={(e) => setUraian(e.target.value)}
              rows={4}
              placeholder="Contoh: Menyelesaikan verval NIK 15 peserta didik baru dan upload SPTJM kolektif ke portal..."
              className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-surface-container text-body-sm font-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              required
            ></textarea>
          </div>

          <div>
            <label className="block font-label-md text-label-md text-on-surface-variant mb-1 font-semibold">
              Status Penyelesaian
            </label>
            <div className="flex items-center gap-3">
              {['Selesai', 'Dalam Proses', 'Menunggu Validasi'].map((st) => (
                <label key={st} className="flex items-center gap-1.5 text-body-sm cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value={st}
                    checked={status === st}
                    onChange={(e) => setStatus(e.target.value)}
                    className="accent-primary"
                  />
                  <span>{st}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-space-sm pt-space-md border-t border-surface-container">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-body-sm font-body-sm text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-primary-container text-on-primary font-headline-sm text-body-sm hover:bg-primary shadow-sm transition-all"
            >
              Simpan Jurnal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


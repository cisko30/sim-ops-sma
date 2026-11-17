import React from 'react';
import { GTKItem, SiswaItem } from '../../../data/modulesData';

interface DetailViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'gtk' | 'siswa';
  data: GTKItem | SiswaItem | null;
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
}

export const DetailViewModal: React.FC<DetailViewModalProps> = ({
  isOpen,
  onClose,
  type,
  data,
  onEdit,
  onDelete
}) => {
  if (!isOpen || !data) return null;

  const isGtk = type === 'gtk';
  const gtk = data as GTKItem;
  const siswa = data as SiswaItem;

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
                {isGtk ? 'badge' : 'person'}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-base text-primary">
                {isGtk ? 'Rincian Data Pendidik (GTK)' : 'Biodata Peserta Didik'}
              </h3>
              <p className="text-xs text-on-surface-variant font-mono">
                {isGtk ? `NIP/NUPTK: ${gtk.nipNuptk}` : `NISN: ${siswa.nisn}`}
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Main ID card */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary text-white font-bold text-lg flex items-center justify-center shrink-0">
              {data.nama.charAt(0)}
            </div>
            <div>
              <h4 className="font-bold text-sm text-primary">{data.nama}</h4>
              <p className="text-on-surface-variant text-[11px] mt-0.5">
                {isGtk ? `${gtk.jenisPtk} • ${gtk.statusKepegawaian}` : `${siswa.rombel} • ${siswa.jenisKelamin === 'L' ? 'Laki-Laki' : 'Perempuan'}`}
              </p>
            </div>
          </div>

          {/* Details list */}
          <div className="space-y-2 divide-y divide-surface-container/60">
            {isGtk ? (
              <>
                <div className="flex justify-between py-1.5">
                  <span className="text-on-surface-variant">Mata Pelajaran Utama:</span>
                  <strong className="text-primary">{gtk.mapelUtama}</strong>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-on-surface-variant">Sertifikasi Pendidik:</span>
                  <span className={`font-semibold ${gtk.sertifikasi === 'Sudah Sertifikasi' ? 'text-emerald-700' : 'text-on-surface-variant'}`}>
                    {gtk.sertifikasi}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-on-surface-variant">Tugas Tambahan:</span>
                  <strong className="text-primary">{gtk.tugasTambahan || 'Tidak Ada'}</strong>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-on-surface-variant">Beban Tatap Muka:</span>
                  <span>{gtk.jtmTatapMuka} JP / Minggu</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-on-surface-variant">Ekuivalensi Tugas Tambahan:</span>
                  <span>{gtk.jtmTugasTambahan} JP</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-on-surface-variant">Total Beban Mengajar (JTM):</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-xs ${
                    gtk.totalJtm >= 24 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {gtk.totalJtm} Jam / Minggu
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-on-surface-variant">Status Info GTK Dapodik:</span>
                  <span className={`font-bold ${gtk.statusInfoGtk === 'Valid' ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {gtk.statusInfoGtk}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-on-surface-variant">Kontak / Telepon:</span>
                  <span className="font-mono">{gtk.telepon || '-'}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between py-1.5">
                  <span className="text-on-surface-variant">NISN Siswa:</span>
                  <strong className="font-mono text-primary">{siswa.nisn}</strong>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-on-surface-variant">NIPD:</span>
                  <span className="font-mono">{siswa.nipd}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-on-surface-variant">Rombongan Belajar:</span>
                  <strong className="text-primary">{siswa.rombel}</strong>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-on-surface-variant">Wali Kelas:</span>
                  <span>{siswa.waliKelas}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-on-surface-variant">Verval Dukcapil (NIK/KK):</span>
                  <span className={`font-bold ${siswa.nikStatus === 'Valid' ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {siswa.nikStatus}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-on-surface-variant">Status Bantuan PIP:</span>
                  <strong className={siswa.pipStatus !== 'Bukan Penerima' ? 'text-emerald-700' : 'text-on-surface-variant'}>
                    {siswa.pipStatus} {siswa.nominalPip ? `(Rp ${siswa.nominalPip.toLocaleString('id-ID')})` : ''}
                  </strong>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-surface-container-low border-t border-surface-container flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Yakin ingin menghapus data ${data.nama}?`)) {
                onDelete(data.id);
                onClose();
              }
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-700 hover:bg-rose-50 flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-base">delete</span>
            <span>Hapus</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface-variant"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(data);
              }}
              className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-base">edit</span>
              <span>Edit Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


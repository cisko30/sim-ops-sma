import React from 'react';
import { RombelItem } from '../../../data/modulesData';

interface RombelJadwalModalProps {
  isOpen: boolean;
  onClose: () => void;
  rombel: RombelItem | null;
}

export const RombelJadwalModal: React.FC<RombelJadwalModalProps> = ({
  isOpen,
  onClose,
  rombel
}) => {
  if (!isOpen || !rombel) return null;

  // Realistic Indonesian high school schedule for this rombel
  const days = [
    {
      hari: 'Senin',
      slots: [
        { jam: '07.00 - 07.45', mapel: 'Upacara Bendera', guru: 'Seluruh Dewan Guru & Tendik' },
        { jam: '07.45 - 09.45', mapel: 'Pendidikan Agama Islam (PAI)', guru: 'Drs. H. Toufik Zaenal Mustofa, M.Pd.I' },
        { jam: '09.45 - 10.00', mapel: 'Istirahat I', guru: '-' },
        { jam: '10.00 - 12.00', mapel: 'Matematika Reguler / Lanjut', guru: 'Ahmad Fauzi, S.Pd, M.Si' },
        { jam: '12.00 - 12.45', mapel: 'Ishoma (Sholat Dzuhur Berjamaah)', guru: '-' },
        { jam: '12.45 - 14.15', mapel: 'Bahasa Indonesia', guru: 'Siti Nurhalizah, S.Pd' }
      ]
    },
    {
      hari: 'Selasa',
      slots: [
        { jam: '07.00 - 09.15', mapel: 'Pendidikan Jasmani & Olahraga (PJOK)', guru: 'Guru Penjaskes' },
        { jam: '09.15 - 09.30', mapel: 'Istirahat I', guru: '-' },
        { jam: '09.30 - 11.45', mapel: 'Sejarah Indonesia', guru: 'Dra. Hj. Ratna Kurniati, M.Pd' },
        { jam: '11.45 - 12.45', mapel: 'Ishoma', guru: '-' },
        { jam: '12.45 - 15.00', mapel: 'Bahasa Inggris', guru: 'Dewi Sartika, S.Pd' }
      ]
    },
    {
      hari: 'Rabu',
      slots: [
        { jam: '07.00 - 09.15', mapel: rombel.tingkat === 'X' ? 'IPA Terpadu (Fisika)' : 'Fisika Peminatan', guru: 'Moh. Ridwan, M.Pd' },
        { jam: '09.15 - 09.30', mapel: 'Istirahat I', guru: '-' },
        { jam: '09.30 - 11.45', mapel: rombel.tingkat === 'X' ? 'IPS Terpadu (Ekonomi)' : 'Kimia / Biologi', guru: 'Guru Mapel' },
        { jam: '11.45 - 12.45', mapel: 'Ishoma', guru: '-' },
        { jam: '12.45 - 15.00', mapel: 'Projek Penguatan Profil Pelajar Pancasila (P5)', guru: 'Tim Fasilitator P5' }
      ]
    },
    {
      hari: 'Kamis',
      slots: [
        { jam: '07.00 - 09.15', mapel: 'Informatika & Keterampilan Komputer', guru: 'Ika Wardani, S.Kom' },
        { jam: '09.15 - 09.30', mapel: 'Istirahat I', guru: '-' },
        { jam: '09.30 - 11.45', mapel: 'Pendidikan Pancasila (PPKn)', guru: 'Guru PPKn' },
        { jam: '11.45 - 12.45', mapel: 'Ishoma', guru: '-' },
        { jam: '12.45 - 14.15', mapel: 'Bimbingan Konseling (BK)', guru: 'Guru BK' }
      ]
    },
    {
      hari: 'Jumat',
      slots: [
        { jam: '06.45 - 07.45', mapel: 'Sholat Dhuha Bersama & Pengajian Kitab', guru: 'H. Abdul Ghofur, S.Ag' },
        { jam: '07.45 - 09.15', mapel: 'Seni Budaya & Keterampilan', guru: 'Guru Seni' },
        { jam: '09.15 - 09.30', mapel: 'Istirahat', guru: '-' },
        { jam: '09.30 - 11.00', mapel: 'Muatan Lokal Ke-NU-an / Aswaja', guru: 'H. Abdul Ghofur, S.Ag' },
        { jam: '11.00 - 12.45', mapel: 'Persiapan & Sholat Jumat Berjamaah', guru: 'DKM Masjid Sekolah' }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div 
        className="w-full max-w-4xl bg-surface rounded-2xl border border-surface-container shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">calendar_month</span>
            </div>
            <div>
              <h3 className="font-bold text-base text-primary">
                Jadwal Pelajaran Resmi — Rombel {rombel.namaRombel}
              </h3>
              <p className="text-xs text-on-surface-variant">
                SMA NU Kaplongan • Ruangan: <strong>{rombel.ruang}</strong> • Wali Kelas: <strong>{rombel.waliKelas}</strong>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl bg-surface text-primary border border-surface-container text-xs font-semibold hover:bg-surface-container flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">print</span>
              <span>Cetak Jadwal</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-outline"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {days.map((day) => (
              <div key={day.hari} className="p-4 rounded-xl bg-surface-container-low border border-surface-container flex flex-col">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-surface-container">
                  <strong className="text-sm text-primary flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span>{day.hari}</span>
                  </strong>
                  <span className="text-[10px] text-outline font-semibold">Reguler</span>
                </div>
                <div className="space-y-2 flex-1">
                  {day.slots.map((s, idx) => (
                    <div 
                      key={idx} 
                      className={`p-2 rounded-lg border text-[11px] ${
                        s.mapel.includes('Istirahat') || s.mapel.includes('Ishoma') || s.mapel.includes('Sholat Jumat')
                          ? 'bg-amber-50/60 border-amber-200/50 text-amber-900'
                          : 'bg-surface border-surface-container'
                      }`}
                    >
                      <div className="flex justify-between font-mono text-[10px] text-outline">
                        <span>{s.jam}</span>
                      </div>
                      <div className="font-bold text-primary mt-0.5">{s.mapel}</div>
                      {s.guru !== '-' && (
                        <div className="text-[10px] text-on-surface-variant truncate mt-0.5">
                          {s.guru}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-surface-container-low border-t border-surface-container flex items-center justify-between text-xs text-on-surface-variant">
          <span>Total Alokasi Pembelajaran: <strong>44 Jam Pelajaran (JP) / Minggu</strong> • Kurikulum Merdeka</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high font-semibold text-primary"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};


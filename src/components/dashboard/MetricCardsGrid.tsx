import React from 'react';
import { GTKItem, SiswaItem, RombelItem } from '../../data/modulesData';
import { DailyJournal } from '../../types/journal';

interface MetricCardsGridProps {
  onCardClick?: (cardType: string) => void;
  gtkList?: GTKItem[];
  siswaList?: SiswaItem[];
  rombelList?: RombelItem[];
  journals?: DailyJournal[];
}

export const MetricCardsGrid: React.FC<MetricCardsGridProps> = ({
  onCardClick,
  gtkList = [],
  siswaList = [],
  rombelList = [],
  journals = []
}) => {
  // Dynamic GTK calculations
  const totalGtk = gtkList.length;
  const pnsCount = gtkList.filter(g => g.statusKepegawaian === 'PNS').length;
  const pppkCount = gtkList.filter(g => g.statusKepegawaian === 'PPPK').length;
  const honorCount = gtkList.filter(g => g.statusKepegawaian === 'Honor Sekolah' || g.statusKepegawaian === 'GTY').length;
  const sertifikasiCount = gtkList.filter(g => g.sertifikasi === 'Sudah Sertifikasi').length;
  const jtmKritisCount = gtkList.filter(g => g.totalJtm < 24 && g.statusInfoGtk !== 'Valid').length;

  // Dynamic Siswa calculations
  const totalSiswa = siswaList.length;
  const faseECount = siswaList.filter(s => s.rombel.includes('X-') || s.rombel.includes('Fase E')).length;
  const faseF11Count = siswaList.filter(s => s.rombel.includes('XI-')).length;
  const faseF12Count = siswaList.filter(s => s.rombel.includes('XII-')).length;
  const residuCount = siswaList.filter(s => s.nikStatus !== 'Valid').length;
  const pipStudents = siswaList.filter(s => s.pipStatus !== 'Bukan Penerima');
  const pipCount = pipStudents.length;
  const pipTotalNominal = pipStudents.reduce((acc, s) => acc + (s.nominalPip || 1800000), 0);

  // Dynamic Rombel calculations
  const totalRombel = rombelList.length;
  const avgSiswaPerRombel = totalRombel > 0 ? Math.round(totalSiswa / totalRombel) : 0;

  // Dynamic Journal calculations
  const submittedJournalsCount = journals.filter(j => j.status === 'Submitted' || j.status === 'Approved').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Card 1: GTK */}
      <div 
        onClick={() => onCardClick?.('gtk')}
        className="p-5 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-surface-container/80 dark:border-slate-800 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between cursor-pointer group"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-2xl">badge</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-sky-950/60 text-blue-700 dark:text-sky-300 border border-blue-200/80 dark:border-sky-800/60 text-[11px] font-bold">
            {totalGtk > 0 ? 'Dapodik Aktif' : 'Belum Ada Data'}
          </span>
        </div>
        <div>
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">
            Total Tenaga Pendidik
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-primary tracking-tight">{totalGtk}</span>
            <span className="text-xs text-on-surface-variant font-medium">Guru &amp; Tendik</span>
          </div>
        </div>
        <div className="mt-4 pt-2.5 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
          <span>PNS: <b className="text-primary font-bold">{pnsCount}</b></span>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
          <span>PPPK: <b className="text-primary font-bold">{pppkCount}</b></span>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
          <span>GTY/Honor: <b className="text-primary font-bold">{honorCount}</b></span>
        </div>
      </div>

      {/* Card 2: Siswa */}
      <div 
        onClick={() => onCardClick?.('siswa')}
        className="p-5 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-surface-container/80 dark:border-slate-800 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between cursor-pointer group"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-2xl">school</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-[11px] font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">verified</span>
            <span>{totalSiswa > 0 ? `${Math.round(((totalSiswa - residuCount) / totalSiswa) * 100)}% Valid` : '0 Siswa'}</span>
          </span>
        </div>
        <div>
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">
            Peserta Didik Aktif
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-primary tracking-tight">{totalSiswa.toLocaleString('id-ID')}</span>
            <span className="text-xs text-on-surface-variant font-medium">Siswa Terdaftar</span>
          </div>
        </div>
        <div className="mt-4 pt-2.5 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
          <span>Fase E: <b className="text-primary font-bold">{faseECount}</b></span>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
          <span>F-XI: <b className="text-primary font-bold">{faseF11Count}</b></span>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
          <span>F-XII: <b className="text-primary font-bold">{faseF12Count}</b></span>
        </div>
      </div>

      {/* Card 3: Rombel */}
      <div 
        onClick={() => onCardClick?.('rombel')}
        className="p-5 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-surface-container/80 dark:border-slate-800 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between cursor-pointer group"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-violet-500/20 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-2xl">groups</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-violet-50 dark:bg-violet-950/60 text-violet-800 dark:text-violet-300 border border-violet-200 dark:border-violet-800/60 text-[11px] font-bold">
            Semester Ganjil
          </span>
        </div>
        <div>
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">
            Rombongan Belajar
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-primary tracking-tight">{totalRombel}</span>
            <span className="text-xs text-on-surface-variant font-medium">Kelas Aktif</span>
          </div>
        </div>
        <div className="mt-4 pt-2.5 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-primary">equalizer</span>
            <span>Rata-rata {avgSiswaPerRombel}/kelas</span>
          </span>
          <span className="text-primary font-bold">{totalRombel} Rombel</span>
        </div>
      </div>

      {/* Card 4: Sertifikasi Guru */}
      <div 
        onClick={() => onCardClick?.('sertifikasi')}
        className="p-5 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-surface-container/80 dark:border-slate-800 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between cursor-pointer group"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-2xl">verified_user</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 text-[11px] font-bold">
            {totalGtk > 0 ? `${Math.round((sertifikasiCount / totalGtk) * 100)}% Rasio` : '0%'}
          </span>
        </div>
        <div>
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">
            GTK Bersertifikasi
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-primary tracking-tight">{sertifikasiCount}</span>
            <span className="text-xs text-on-surface-variant font-medium">Guru Pendidik</span>
          </div>
        </div>
        <div className="mt-4 pt-2.5 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">SKTP Aktif</span>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
          <span>{totalGtk - sertifikasiCount} Non-Sergu</span>
        </div>
      </div>

      {/* Card 5: PIP */}
      <div 
        onClick={() => onCardClick?.('pip')}
        className="p-5 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-surface-container/80 dark:border-slate-800 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between cursor-pointer group"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 text-[11px] font-bold">
            {pipCount} Siswa
          </span>
        </div>
        <div>
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">
            Penerima Program PIP
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-primary tracking-tight">{pipCount}</span>
            <span className="text-xs text-on-surface-variant font-medium">Siswa Terdaftar</span>
          </div>
        </div>
        <div className="mt-4 pt-2.5 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
          <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">Rp {pipTotalNominal.toLocaleString('id-ID')}</span>
          <span>SimPel BNI</span>
        </div>
      </div>

      {/* Card 6: Residu Dukcapil */}
      <div 
        onClick={() => onCardClick?.('berkas')}
        className="p-5 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-surface-container/80 dark:border-slate-800 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between cursor-pointer group"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-2xl">folder_open</span>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
            residuCount > 0 
              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60' 
              : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
          }`}>
            {residuCount > 0 ? 'Perlu Tindak' : 'Semua Valid'}
          </span>
        </div>
        <div>
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">
            Residu NIK / KK Siswa
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-3xl font-black tracking-tight ${residuCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {residuCount}
            </span>
            <span className="text-xs text-on-surface-variant font-medium">Siswa Residu</span>
          </div>
        </div>
        <div className="mt-4 pt-2.5 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
          <span>{totalSiswa - residuCount} Padan Dukcapil</span>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
          <span>Verval PD</span>
        </div>
      </div>

      {/* Card 7: JTM Kurang */}
      <div 
        onClick={() => onCardClick?.('jtm')}
        className="p-5 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-surface-container/80 dark:border-slate-800 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between cursor-pointer group"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-500 to-rose-700 text-white flex items-center justify-center shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-2xl">schedule</span>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
            jtmKritisCount > 0 
              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60' 
              : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
          }`}>
            {jtmKritisCount > 0 ? `${jtmKritisCount} Guru Kritis` : 'Semua Terpenuhi'}
          </span>
        </div>
        <div>
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">
            Beban Ajar &lt; 24 JTM
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-3xl font-black tracking-tight ${jtmKritisCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {jtmKritisCount}
            </span>
            <span className="text-xs text-on-surface-variant font-medium">Tenaga Pengajar</span>
          </div>
        </div>
        <div className="mt-4 pt-2.5 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
          <span className="truncate text-rose-600 dark:text-rose-400 font-semibold">
            {jtmKritisCount > 0 ? 'Butuh Ekuivalensi Kepmen 221' : '100% Beban Terpenuhi'}
          </span>
        </div>
      </div>

      {/* Card 8: Jurnal OPS Terisi */}
      <div 
        onClick={() => onCardClick?.('jurnal')}
        className="p-5 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-surface-container/80 dark:border-slate-800 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between cursor-pointer group"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-2xl">menu_book</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 text-[11px] font-bold">
            {submittedJournalsCount} Terkirim
          </span>
        </div>
        <div>
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">
            Jurnal Harian OPS
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-primary tracking-tight">{journals.length}</span>
            <span className="text-xs text-on-surface-variant font-medium">Total Catatan</span>
          </div>
        </div>
        <div className="mt-4 pt-2.5 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
          <span className="truncate font-bold text-primary">Siap Cetak Format A4</span>
        </div>
      </div>
    </div>
  );
};

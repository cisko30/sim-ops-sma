import React from 'react';
import { SiswaItem, RombelItem } from '../../data/modulesData';

interface StudentDistributionCardProps {
  siswaList?: SiswaItem[];
  rombelList?: RombelItem[];
  onNavigateToSiswa?: () => void;
}

export const StudentDistributionCard: React.FC<StudentDistributionCardProps> = ({
  siswaList = [],
  rombelList = [],
  onNavigateToSiswa
}) => {
  const totalSiswa = siswaList.length;
  const totalRombel = rombelList.length;

  const faseECount = siswaList.filter(s => s.rombel.includes('X-') || s.rombel.includes('Fase E')).length;
  const faseF11Count = siswaList.filter(s => s.rombel.includes('XI-')).length;
  const faseF12Count = siswaList.filter(s => s.rombel.includes('XII-')).length;

  const rombelXCount = rombelList.filter(r => r.tingkat === 'X').length;
  const rombelXICount = rombelList.filter(r => r.tingkat === 'XI').length;
  const rombelXIICount = rombelList.filter(r => r.tingkat === 'XII').length;

  const pctE = totalSiswa > 0 ? Math.round((faseECount / totalSiswa) * 100) : 0;
  const pctF11 = totalSiswa > 0 ? Math.round((faseF11Count / totalSiswa) * 100) : 0;
  const pctF12 = totalSiswa > 0 ? Math.round((faseF12Count / totalSiswa) * 100) : 0;

  return (
    <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-surface-container/80 flex flex-col gap-5 hover:shadow-md transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
            <span className="material-symbols-outlined text-xl">pie_chart</span>
          </div>
          <div>
            <h3 className="font-bold text-base text-primary tracking-tight">
              Distribusi Siswa &amp; Peminatan
            </h3>
            <p className="text-xs text-on-surface-variant">
              Sebaran {totalSiswa.toLocaleString('id-ID')} Peserta Didik per Fase Kurikulum Merdeka ({totalRombel} Rombel)
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onNavigateToSiswa}
          className="px-3 py-1.5 rounded-xl bg-surface-container-low dark:bg-slate-800 text-primary dark:text-sky-300 text-xs font-bold border border-surface-container/80 dark:border-slate-700 hover:bg-surface-container dark:hover:bg-slate-700 transition-all self-start sm:self-auto shadow-2xs flex items-center gap-1 cursor-pointer"
        >
          <span>Kelola Siswa</span>
          <span className="material-symbols-outlined text-xs">arrow_forward</span>
        </button>
      </div>

      {totalSiswa === 0 ? (
        <div className="p-8 rounded-xl bg-surface-container-low/40 dark:bg-slate-800/40 border border-dashed border-surface-container dark:border-slate-700/80 text-center space-y-2.5">
          <span className="material-symbols-outlined text-3xl text-outline dark:text-slate-400">group_off</span>
          <p className="text-sm font-bold text-on-surface dark:text-slate-100">Data Peserta Didik Kosong</p>
          <p className="text-xs text-on-surface-variant dark:text-slate-400">Belum ada siswa yang terdaftar. Tambahkan data atau impor dari Excel.</p>
          <div className="pt-1">
            <button
              type="button"
              onClick={onNavigateToSiswa}
              className="px-4 py-2 rounded-xl bg-primary dark:bg-blue-600 hover:bg-primary-container dark:hover:bg-blue-500 text-white text-xs font-bold shadow-sm inline-flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <span className="material-symbols-outlined text-sm">person_add</span>
              <span>Tambah Siswa Baru</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 pt-1">
          {/* Fase E (Kelas X) */}
          <div className="space-y-2 p-3.5 rounded-xl bg-surface-container-low/60 border border-surface-container/60 hover:bg-surface-container-low transition-colors">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span className="font-bold text-on-surface">Fase E (Kelas X Umum)</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10.5px] font-semibold border border-emerald-200/60">
                  {rombelXCount} Rombel
                </span>
              </div>
              <span className="text-primary font-bold text-xs">{faseECount} Siswa ({pctE}%)</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-surface-container-high/60 overflow-hidden flex">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.max(pctE, 5)}%` }}
              />
            </div>
          </div>

          {/* Fase F XI (Peminatan) */}
          <div className="space-y-2 p-3.5 rounded-xl bg-surface-container-low/60 border border-surface-container/60 hover:bg-surface-container-low transition-colors">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span className="font-bold text-on-surface">Fase F (Kelas XI Peminatan)</span>
                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 text-[10.5px] font-semibold border border-blue-200/60">
                  {rombelXICount} Rombel
                </span>
              </div>
              <span className="text-primary font-bold text-xs">{faseF11Count} Siswa ({pctF11}%)</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-surface-container-high/60 overflow-hidden flex">
              <div 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.max(pctF11, 5)}%` }}
              />
            </div>
          </div>

          {/* Fase F XII (Peminatan) */}
          <div className="space-y-2 p-3.5 rounded-xl bg-surface-container-low/60 border border-surface-container/60 hover:bg-surface-container-low transition-colors">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                <span className="font-bold text-on-surface">Fase F (Kelas XII Peminatan)</span>
                <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 text-[10.5px] font-semibold border border-purple-200/60">
                  {rombelXIICount} Rombel
                </span>
              </div>
              <span className="text-primary font-bold text-xs">{faseF12Count} Siswa ({pctF12}%)</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-surface-container-high/60 overflow-hidden flex">
              <div 
                className="bg-gradient-to-r from-purple-500 to-indigo-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.max(pctF12, 5)}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

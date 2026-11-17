import React from 'react';
import { GTKItem } from '../../data/modulesData';

interface JTMStatusCardProps {
  gtkList?: GTKItem[];
  onManageJTM?: () => void;
  onDetailDistribusi?: () => void;
}

export const JTMStatusCard: React.FC<JTMStatusCardProps> = ({
  gtkList = [],
  onManageJTM,
  onDetailDistribusi
}) => {
  const totalGtk = gtkList.length;

  const validTeachers = gtkList.filter(g => g.totalJtm >= 24);
  const warningTeachers = gtkList.filter(g => g.totalJtm >= 18 && g.totalJtm < 24);
  const criticalTeachers = gtkList.filter(g => g.totalJtm < 18);

  const validCount = validTeachers.length;
  const warningCount = warningTeachers.length;
  const criticalCount = criticalTeachers.length;

  const validPct = totalGtk > 0 ? Math.round((validCount / totalGtk) * 100) : 0;
  const warningPct = totalGtk > 0 ? Math.round((warningCount / totalGtk) * 100) : 0;
  const criticalPct = totalGtk > 0 ? Math.round((criticalCount / totalGtk) * 100) : 0;

  return (
    <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-surface-container/80 flex flex-col gap-5 hover:shadow-md transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
            <span className="material-symbols-outlined text-xl">clinical_notes</span>
          </div>
          <div>
            <h3 className="font-bold text-base text-primary tracking-tight">
              Status Pemenuhan Beban Jam Mengajar (JTM)
            </h3>
            <p className="text-xs text-on-surface-variant">
              Ambang Batas 24 JTM Linier • Permendikdasmen No. 11 &amp; Kepmendikdasmen No. 221/P/2025
            </p>
          </div>
        </div>
        <button
          onClick={onDetailDistribusi}
          className="text-xs font-bold text-primary dark:text-sky-300 hover:text-primary-container dark:hover:text-sky-200 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-low dark:bg-slate-800 border border-surface-container/80 dark:border-slate-700 hover:bg-surface-container dark:hover:bg-slate-700 transition-all self-start sm:self-auto cursor-pointer"
          type="button"
        >
          <span>Detail Distribusi</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>

      {totalGtk === 0 ? (
        <div className="p-8 rounded-xl bg-surface-container-low/40 dark:bg-slate-800/40 border border-dashed border-surface-container dark:border-slate-700/80 text-center space-y-2.5">
          <span className="material-symbols-outlined text-3xl text-outline dark:text-slate-400">badge</span>
          <p className="text-sm font-bold text-on-surface dark:text-slate-100">Data GTK Kosong</p>
          <p className="text-xs text-on-surface-variant dark:text-slate-400">Belum ada data guru/tendik. Tambahkan GTK untuk menghitung pemenuhan jam linier.</p>
          <div className="pt-1">
            <button
              type="button"
              onClick={onManageJTM}
              className="px-4 py-2 rounded-xl bg-primary dark:bg-blue-600 hover:bg-primary-container dark:hover:bg-blue-500 text-white text-xs font-bold shadow-sm inline-flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <span className="material-symbols-outlined text-sm">person_add</span>
              <span>Tambah GTK Baru</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
          {/* Hijau: Memenuhi */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex flex-col justify-between border border-emerald-500/30 dark:border-emerald-500/30 hover:border-emerald-500/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-emerald-600 dark:text-emerald-400">check_circle</span>
                <span>Memenuhi (Valid)</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 font-bold text-xs text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                {validCount} Guru
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="w-full bg-slate-200 dark:bg-slate-700/80 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.max(validPct, 5)}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400">
                <span>≥ 24 JTM linier</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{validPct}%</span>
              </div>
            </div>
          </div>

          {/* Kuning: Warning / Ekuivalensi */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex flex-col justify-between border border-amber-500/30 dark:border-amber-500/30 hover:border-amber-500/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-amber-700 dark:text-amber-400 font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-amber-600 dark:text-amber-400">warning</span>
                <span>Warning JTM</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 font-bold text-xs text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                {warningCount} Guru
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="w-full bg-slate-200 dark:bg-slate-700/80 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.max(warningPct, 5)}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400">
                <span>18 - 23 JTM</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">{warningPct}%</span>
              </div>
            </div>
          </div>

          {/* Merah: Kritis */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex flex-col justify-between border border-rose-500/30 dark:border-rose-500/30 hover:border-rose-500/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-rose-700 dark:text-rose-400 font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-rose-600 dark:text-rose-400">error</span>
                <span>Kritis (&lt; 18 JTM)</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 font-bold text-xs text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
                {criticalCount} Guru
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="w-full bg-slate-200 dark:bg-slate-700/80 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-rose-500 to-pink-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.max(criticalPct, 5)}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400">
                <span>Kurang jam ajar</span>
                <span className="font-bold text-rose-600 dark:text-rose-400">{criticalPct}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

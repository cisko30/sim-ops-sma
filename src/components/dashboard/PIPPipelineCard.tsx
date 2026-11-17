import React from 'react';
import { SiswaItem } from '../../data/modulesData';

interface PIPPipelineCardProps {
  siswaList?: SiswaItem[];
  onPrintSPTJM?: () => void;
  onNavigateToPip?: () => void;
}

export const PIPPipelineCard: React.FC<PIPPipelineCardProps> = ({
  siswaList = [],
  onPrintSPTJM,
  onNavigateToPip
}) => {
  const pipStudents = siswaList.filter(s => s.pipStatus !== 'Bukan Penerima');
  const totalPip = pipStudents.length;

  const nominasiCount = pipStudents.filter(s => s.pipStatus === 'Nominasi').length;
  const pemberianCount = pipStudents.filter(s => s.pipStatus === 'Penerima Aktif').length;
  const totalNominal = pipStudents.reduce((acc, s) => acc + (s.nominalPip || 1800000), 0);

  return (
    <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-surface-container/80 flex flex-col gap-5 hover:shadow-md transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-md shadow-rose-500/20 shrink-0">
            <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
          </div>
          <div>
            <h3 className="font-bold text-base text-primary tracking-tight">
              Penyaluran Bantuan PIP SimPel
            </h3>
            <p className="text-xs text-on-surface-variant">
              Program Indonesia Pintar SMA • Bank Penyalur BNI
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onNavigateToPip && (
            <button
              onClick={onNavigateToPip}
              className="px-3 py-1.5 rounded-xl bg-surface-container-low text-primary text-xs font-bold border border-surface-container/80 hover:bg-surface-container transition-all flex items-center gap-1 cursor-pointer"
              type="button"
            >
              <span>Kelola PIP</span>
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </button>
          )}
          <button
            onClick={onPrintSPTJM}
            className="text-xs font-bold text-primary hover:text-primary-container flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-low border border-surface-container/80 hover:bg-surface-container transition-all cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-sm text-emerald-700">print</span>
            <span>Cetak SPTJM</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <div className="p-4 rounded-xl bg-surface-container-low/70 border border-surface-container">
          <span className="text-[11px] text-on-surface-variant font-medium block">Total Siswa Terdaftar PIP</span>
          <div className="text-2xl font-bold text-primary mt-1">{totalPip} Siswa</div>
          <span className="text-[10.5px] text-emerald-700 font-semibold mt-0.5 block">
            Rp {totalNominal.toLocaleString('id-ID')}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-low/70 border border-surface-container">
          <span className="text-[11px] text-on-surface-variant font-medium block">SK Nominasi (Aktivasi)</span>
          <div className="text-2xl font-bold text-amber-700 mt-1">{nominasiCount} Siswa</div>
          <span className="text-[10.5px] text-on-surface-variant mt-0.5 block">Menunggu buku tabungan</span>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-low/70 border border-surface-container">
          <span className="text-[11px] text-on-surface-variant font-medium block">SK Pemberian (Siap Cair)</span>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{pemberianCount} Siswa</div>
          <span className="text-[10.5px] text-emerald-700 font-semibold mt-0.5 block">Rekening aktif BNI</span>
        </div>
      </div>
    </div>
  );
};

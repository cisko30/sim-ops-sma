import React from 'react';
import { MOCK_SISWA_LIST, SiswaItem } from '../../data/modulesData';
import { PIP_STEPS } from '../../data/mockData';
import { SchoolInfo } from '../../types';

interface PipManagementViewProps {
  subType: 'manajemen-pip' | 'surat-dan-kuasa-kolektif';
  schoolInfo?: SchoolInfo;
  siswaList?: SiswaItem[];
  onShowToast: (msg: string) => void;
}

export const PipManagementView: React.FC<PipManagementViewProps> = ({
  subType,
  schoolInfo,
  siswaList = MOCK_SISWA_LIST,
  onShowToast
}) => {
  const pipStudents = siswaList.filter((s) => s.pipStatus !== 'Bukan Penerima');

  const handlePrintKuasa = () => {
    onShowToast("Menyiapkan dialog cetak Surat Kuasa Kolektif Bank BNI...");
    setTimeout(() => {
      window.print();
    }, 400);
  };

  return (
    <div className="flex flex-col gap-space-lg">
      {/* 1. MANAJEMEN PIP VIEW */}
      {subType === 'manajemen-pip' && (
        <div className="space-y-5">
          {/* Stepper Pipeline */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div>
                <h3 className="font-bold text-base text-primary">Pipeline Penyaluran Bantuan PIP (Program Indonesia Pintar)</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">Monitoring SK Nominasi, Aktivasi Rekening SimPel BNI, hingga Pencairan Dana</p>
              </div>
              <span className="material-symbols-outlined text-primary text-2xl">account_balance_wallet</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {PIP_STEPS.map((step) => (
                <div
                  key={step.step}
                  className="p-4 rounded-xl bg-surface-container-low border border-surface-container flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-outline">
                      {step.label}
                    </span>
                    <span className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary material-symbols-outlined text-base">
                      {step.icon}
                    </span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{step.count} Siswa</div>
                    <div className="text-xs font-semibold text-on-surface mt-0.5">{step.sublabel}</div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-surface-container/60 text-[11px] font-medium text-emerald-700">
                    {step.statusNote}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recipient Students Table */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-container pb-3">
              <div>
                <h4 className="font-bold text-sm text-primary">Daftar Siswa Penerima Manfaat PIP SimPel BNI</h4>
                <p className="text-xs text-on-surface-variant mt-0.5">SMA NU Kaplongan Semester Ganjil 2026/2027</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onShowToast("Mengekspor daftar penerima PIP ke format Excel...")}
                  className="px-3.5 py-1.5 rounded-xl bg-surface-container-low text-primary text-xs font-semibold hover:bg-surface-container border border-surface-container flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm text-emerald-700">table_view</span>
                  <span>Ekspor Nominasi</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-container-low text-primary font-bold border-b border-surface-container">
                    <th className="py-2.5 px-3">Nama Siswa</th>
                    <th className="py-2.5 px-3">NISN</th>
                    <th className="py-2.5 px-3">Rombel</th>
                    <th className="py-2.5 px-3 text-right">Nominal Dana</th>
                    <th className="py-2.5 px-3 text-center">Status Rekening SimPel BNI</th>
                    <th className="py-2.5 px-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container/60">
                  {pipStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-surface-container-low/40">
                      <td className="py-3 px-3 font-bold text-primary">{s.nama}</td>
                      <td className="py-3 px-3 font-mono text-on-surface-variant">{s.nisn}</td>
                      <td className="py-3 px-3 font-medium text-on-surface">{s.rombel}</td>
                      <td className="py-3 px-3 text-right font-bold text-emerald-700">
                        Rp {(s.nominalPip || 0).toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                          {s.pipStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => onShowToast(`Membuka berkas persyaratan PIP ${s.nama}...`)}
                          className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-semibold text-[11px]"
                        >
                          Berkas
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. SURAT & KUASA KOLEKTIF VIEW */}
      {subType === 'surat-dan-kuasa-kolektif' && (
        <div className="space-y-5">
          {/* Action Toolbar */}
          <div className="no-print p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-primary">Generator Surat Kuasa Kolektif &amp; SPTJM Kepala Sekolah</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Format kedinasan penarikan dana bantuan PIP ke Bank BNI Cabang Pembantu Karangampel
              </p>
            </div>
            <button
              type="button"
              onClick={handlePrintKuasa}
              className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-container shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">print</span>
              <span>Cetak Surat Kuasa Resmi</span>
            </button>
          </div>

          {/* Printable Letter Preview */}
          <div className="p-8 sm:p-12 bg-white rounded-2xl border border-surface-container shadow-md text-black print:shadow-none print:border-none print:p-0">
            {/* Kop Surat */}
            <div className="text-center pb-4 border-b-2 border-black">
              <h4 className="text-xs font-bold uppercase tracking-wider">{schoolInfo?.institution || "LEMBAGA PENDIDIKAN MA'ARIF NU"}</h4>
              <h2 className="text-2xl font-extrabold uppercase font-serif tracking-wide my-0.5 text-[#0f5927]">
                {schoolInfo?.schoolName || "SMA NU KAPLONGAN"}
              </h2>
              <h3 className="text-xs font-bold uppercase">{schoolInfo?.subdistrict || "KARANGAMPEL INDRAMAYU"}</h3>
              <p className="text-[11px] mt-1">{schoolInfo?.address || "Jl. Raya Kaplongan No. 28 Karangampel Kab. Indramayu"}</p>
            </div>

            {/* Letter Title */}
            <div className="text-center my-6">
              <h3 className="text-sm font-bold uppercase underline tracking-wider">
                SURAT KUASA KOLEKTIF PENCAIRAN PIP KEPALA SEKOLAH
              </h3>
              <p className="text-xs mt-1">Nomor: 421.3/048/SMA-NU/KUASA-PIP/XI/2026</p>
            </div>

            {/* Letter Body */}
            <div className="space-y-4 text-xs leading-relaxed">
              <p>Yang bertanda tangan di bawah ini:</p>
              <div className="pl-6 space-y-1">
                <div className="flex">
                  <span className="w-36 font-semibold">Nama</span>
                  <span>: {schoolInfo?.principalName || "Drs. H. Toufik Zaenal Mustofa, M.Pd.I"}</span>
                </div>
                <div className="flex">
                  <span className="w-36 font-semibold">Jabatan</span>
                  <span>: {schoolInfo?.principalTitle || "Kepala SMA NU Kaplongan"}</span>
                </div>
                <div className="flex">
                  <span className="w-36 font-semibold">NPSN Satuan</span>
                  <span>: {schoolInfo?.npsn || "20216007"}</span>
                </div>
              </div>

              <p>
                Dengan ini memberikan kuasa penuh kepada Pihak Kedua (Operator Sekolah):
              </p>
              <div className="pl-6 space-y-1">
                <div className="flex">
                  <span className="w-36 font-semibold">Nama Petugas</span>
                  <span>: {schoolInfo?.operatorName || "Bagas Pratama, S.Kom"}</span>
                </div>
                <div className="flex">
                  <span className="w-36 font-semibold">NIP/NUPTK</span>
                  <span>: {schoolInfo?.operatorNip || "199104152020121008"}</span>
                </div>
                <div className="flex">
                  <span className="w-36 font-semibold">Jabatan</span>
                  <span>: {schoolInfo?.operatorRole || "Operator Sekolah (OPS)"}</span>
                </div>
              </div>

              <p>
                Untuk melakukan pengurusan aktivasi rekening SimPel dan penarikan dana bantuan Program Indonesia Pintar (PIP) secara kolektif pada Bank BNI untuk peserta didik terlampir.
              </p>
            </div>

            {/* Signatures */}
            <div className="mt-12 pt-6 grid grid-cols-2 gap-8 text-xs text-center">
              <div>
                <p>Penerima Kuasa (Operator),</p>
                <div className="h-20 my-1"></div>
                <p className="font-bold underline">{schoolInfo?.operatorName || "Bagas Pratama, S.Kom"}</p>
                <p className="text-[11px]">NIP. {schoolInfo?.operatorNip || "199104152020121008"}</p>
              </div>

              <div>
                <p>Indramayu, 12 November 2026</p>
                <p>Pemberi Kuasa (Kepala Sekolah),</p>
                <div className="h-20 my-1"></div>
                <p className="font-bold underline">{schoolInfo?.principalName || "Drs. H. Toufik Zaenal Mustofa, M.Pd.I"}</p>
                <p className="text-[11px]">Kepala SMA NU Kaplongan</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

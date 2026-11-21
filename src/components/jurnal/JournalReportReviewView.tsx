import React, { useState, useMemo } from 'react';
import { DailyJournal } from '../../types/journal';
import { INITIAL_JOURNALS } from '../../data/mockJournals';
import { SCHOOL_INFO as DEFAULT_SCHOOL_INFO } from '../../data/mockData';
import { SchoolInfo } from '../../types';

interface JournalReportReviewViewProps {
  journals?: DailyJournal[];
  schoolInfo?: SchoolInfo;
  activeRole?: 'OPS' | 'Kurikulum' | 'Kepsek' | 'Bendahara' | 'Wali Kelas';
  onNavigateToProfile?: () => void;
  onShowToast: (msg: string) => void;
}

export const JournalReportReviewView: React.FC<JournalReportReviewViewProps> = ({
  journals: propJournals,
  schoolInfo: propSchoolInfo,
  onNavigateToProfile,
  onShowToast
}) => {
  const info = propSchoolInfo || DEFAULT_SCHOOL_INFO;
  const [reportType, setReportType] = useState<'all' | 'weekly' | 'monthly'>('all');

  // Use live journals passed from App
  const journals = useMemo(() => {
    const list = propJournals || INITIAL_JOURNALS;
    // Sort chronologically ascending for the official report
    return [...list].sort((a, b) => a.journal_date.localeCompare(b.journal_date));
  }, [propJournals]);

  // Filter journals based on report type
  const activeJournals = useMemo(() => {
    if (reportType === 'all') {
      return journals;
    } else if (reportType === 'monthly') {
      // Current month or all
      return journals;
    } else {
      // Latest 5-7 working days for weekly
      return journals.slice(-7);
    }
  }, [journals, reportType]);

  // Aggregate statistics
  const totalMinutes = useMemo(() => {
    return activeJournals.reduce((acc, curr) => acc + curr.total_duration_minutes, 0);
  }, [activeJournals]);

  const totalHours = (totalMinutes / 60).toFixed(1);

  // Flatten all activities
  const allActivities = useMemo(() => {
    return activeJournals.flatMap((j) =>
      j.activities.map((act) => ({
        ...act,
        journal_date: j.journal_date
      }))
    );
  }, [activeJournals]);

  // Real Print / PDF Trigger
  const handlePrint = () => {
    onShowToast("Menyiapkan dialog cetak / Simpan sebagai PDF...");
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleExportExcel = () => {
    onShowToast(`Mengekspor ${allActivities.length} data kegiatan jurnal ke format Excel (.xlsx)...`);
  };

  return (
    <div className="flex flex-col gap-space-lg">
      {/* Action & Filter Toolbar (Hidden on print) */}
      <div className="no-print print:hidden p-4 sm:p-5 bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm space-y-4">
        {/* Row 1: Summary Info on Left + Action Buttons on Right */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">verified</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm text-primary">Laporan Terintegrasi SIM-OPS</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  {activeJournals.length} Hari Kerja ({allActivities.length} Kegiatan)
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Total <strong className="text-primary font-bold">{totalHours} Jam Efektif</strong> • Dokumen Kedinasan SMA NU Kaplongan
              </p>
            </div>
          </div>

          {/* Action Buttons: Always Grouped Together */}
          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            {onNavigateToProfile && (
              <button
                type="button"
                onClick={onNavigateToProfile}
                className="px-3.5 py-2 rounded-xl bg-surface-container-low text-primary font-semibold text-xs hover:bg-surface-container transition-colors flex items-center gap-1.5 border border-surface-container shadow-sm shrink-0"
                title="Edit Nama Sekolah, Kop Surat, Kepala Sekolah, dan Operator"
              >
                <span className="material-symbols-outlined text-base">edit</span>
                <span>Edit Profil Sekolah</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleExportExcel}
              className="px-3.5 py-2 rounded-xl bg-surface-container-low text-on-surface font-semibold text-xs hover:bg-surface-container transition-colors flex items-center gap-1.5 border border-surface-container shadow-sm shrink-0"
              title="Unduh format spreadsheet .xlsx"
            >
              <span className="material-symbols-outlined text-base text-emerald-700">table_view</span>
              <span>Ekspor XLSX</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-container shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer shrink-0"
              title="Cetak lembar fisik atau simpan sebagai file PDF resmi"
            >
              <span className="material-symbols-outlined text-base">print</span>
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>
        </div>

        {/* Row 2: Period Filter Selector with Clear Label */}
        <div className="pt-3 border-t border-surface-container/60 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-primary">filter_alt</span>
              <span>Pilihan Periode:</span>
            </span>

            <div className="flex rounded-xl bg-surface-container-low p-1 text-xs font-semibold border border-surface-container">
              <button
                type="button"
                onClick={() => setReportType('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  reportType === 'all'
                    ? 'bg-primary text-white shadow-sm font-bold'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                Semua Jurnal ({journals.length} Hari)
              </button>
              <button
                type="button"
                onClick={() => setReportType('weekly')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  reportType === 'weekly'
                    ? 'bg-primary text-white shadow-sm font-bold'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                Rekap Mingguan
              </button>
              <button
                type="button"
                onClick={() => setReportType('monthly')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  reportType === 'monthly'
                    ? 'bg-primary text-white shadow-sm font-bold'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                Rekap Bulanan
              </button>
            </div>
          </div>

          <div className="text-[11px] text-outline font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-xs text-emerald-700">check_circle</span>
            <span>Format Standar A4 Kedinasan • Siap Ditandatangani Kepala Sekolah</span>
          </div>
        </div>
      </div>

      {/* Official Report Preview Sheet (Target Print Sheet) */}
      <div id="printable-report" className="p-4 sm:p-space-xl bg-white rounded-2xl border border-surface-container shadow-lg print:shadow-none print:border-none print:p-0 print:m-0">
        {/* Document Header / Kop Surat Resmi SMA NU KAPLONGAN */}
        <div className="pb-3 text-center kop-wrapper">
          <div className="kop-header-container flex items-center justify-center gap-3 sm:gap-6 mb-2">
            {/* Logo SMA NU Kaplongan */}
            <div className="kop-logo-box shrink-0 w-20 sm:w-24 flex items-center justify-center">
              <img
                src="/logo-sma-nu.png?v=3"
                alt="Logo SMA NU Kaplongan"
                className="w-full max-h-24 sm:max-h-28 object-contain"
              />
            </div>

            {/* Kop Text Info */}
            <div className="kop-text-box flex flex-col text-center">
              <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-black font-sans leading-tight">
                {info.institution}
              </h4>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wide text-[#0f5927] font-serif uppercase my-0.5 leading-tight">
                {info.schoolName}
              </h2>
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wide text-black leading-tight">
                {info.subdistrict}
              </h3>
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wide text-black leading-tight">
                TERAKREDITASI &ldquo;{info.accreditation}&rdquo;
              </h4>
              <p className="text-[11px] sm:text-xs text-black font-normal mt-1 leading-tight">
                {info.address}
              </p>
              <p className="text-[11px] sm:text-xs text-black font-normal leading-tight">
                Kode Pos {info.postalCode} Telp. {info.phone} E-mail : <span className="underline">{info.email}</span>
              </p>
            </div>
          </div>

          {/* Double garis kop resmi (Garis tebal atas + garis tipis bawah) */}
          <div className="w-full border-b-[3px] border-black mt-2"></div>
          <div className="w-full border-b border-black mt-[2px]"></div>

          {/* Judul Dokumen Laporan */}
          <div className="mt-3 inline-block px-5 py-1.5 rounded-full bg-slate-100 border border-slate-300 text-[#002549] text-xs font-bold uppercase tracking-wider print:border print:border-black print:text-[8.5pt] print:py-0.5">
            LAPORAN KINERJA &amp; JURNAL HARIAN OPERATOR SEKOLAH (SIM-OPS)
          </div>
        </div>

        {/* Report Info Meta */}
        <div className="report-meta-grid grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 text-xs border-b-2 border-black print:border-black print:grid-cols-4 print:text-[8pt] print:py-2">
          <div>
            <span className="text-slate-600 font-semibold block">Nama Petugas:</span>
            <span className="font-bold text-[#002549] block mt-0.5 text-sm">{info.operatorName}</span>
          </div>
          <div>
            <span className="text-slate-600 font-semibold block">Satuan Pendidikan:</span>
            <span className="font-bold text-[#002549] block mt-0.5 text-sm">{info.schoolName}</span>
          </div>
          <div>
            <span className="text-slate-600 font-semibold block">Tahun Pelajaran:</span>
            <span className="font-bold text-[#002549] block mt-0.5 text-sm">{info.academicYear}</span>
          </div>
          <div>
            <span className="text-slate-600 font-semibold block">Total Jam Terevaluasi:</span>
            <span className="font-bold text-emerald-800 block mt-0.5 text-sm">{totalHours} Jam Kerja Efektif</span>
          </div>
        </div>

        {/* Aggregated Activities Table */}
        <div className="mt-4 overflow-x-auto print:overflow-visible">
          <table className="w-full text-left border-collapse text-xs print:text-[8pt] print:table-fixed border border-slate-300 print:border-black">
            <thead>
              <tr className="bg-[#002549] text-white font-bold border-b-2 border-black print:bg-gray-100 print:border-black print:text-black">
                <th className="py-2.5 px-1 text-center w-8 text-white print:text-black print:w-[4%]">No</th>
                <th className="py-2.5 px-2 text-white print:text-black whitespace-nowrap print:whitespace-normal print:w-[11%]">Tanggal</th>
                <th className="py-2.5 px-2 text-white print:text-black whitespace-nowrap print:whitespace-normal print:w-[12%]">Waktu (WIB)</th>
                <th className="py-2.5 px-2 text-white print:text-black print:w-[24%]">Kategori &amp; Kegiatan</th>
                <th className="py-2.5 px-2.5 text-white print:text-black print:w-[27%]">Uraian Pelaksanaan</th>
                <th className="py-2.5 px-2 text-white print:text-black print:w-[13%]">Hasil / Output</th>
                <th className="py-2.5 px-1.5 text-center text-white print:text-black print:w-[9%]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 print:divide-black">
              {allActivities.map((act, index) => (
                <tr key={`${act.id}-${index}`} className="hover:bg-slate-50 print:break-inside-avoid print:page-break-inside-avoid">
                  <td className="py-2 px-1 font-semibold text-center text-slate-700 print:text-black">
                    {index + 1}
                  </td>
                  <td className="py-2 px-2 font-bold text-[#002549] print:text-black whitespace-nowrap print:whitespace-normal font-mono text-[11px]">
                    {act.journal_date}
                  </td>
                  <td className="py-2 px-2 text-slate-700 print:text-black whitespace-nowrap print:whitespace-normal text-[11px]">
                    {act.start_time} - {act.end_time} <span className="text-slate-500 font-mono">({act.duration_minutes}m)</span>
                  </td>
                  <td className="py-2 px-2 font-semibold text-slate-900 print:text-black">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-white font-bold text-[9.5px] mr-1.5 print:border print:border-black print:text-[7pt] print:bg-transparent print:text-black">
                      {act.category}
                    </span>
                    <span className="text-slate-900 font-bold">{act.activity_title}</span>
                  </td>
                  <td className="py-2 px-2.5 text-slate-900 print:text-black leading-relaxed font-normal">{act.description}</td>
                  <td className="py-2 px-2 text-slate-800 font-medium print:text-black leading-relaxed">{act.result || '-'}</td>
                  <td className="py-2 px-1.5 text-center whitespace-nowrap">
                    <span className="hidden print:inline text-[8pt] font-semibold text-black">
                      {act.status === 'Completed' ? 'Selesai' : act.status}
                    </span>
                    <span className="print:hidden px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {act.status === 'Completed' ? 'Selesai' : act.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Signatures Footer */}
        <div className="print-signatures mt-6 pt-4 print:mt-4 print:pt-2 border-t-2 border-black grid grid-cols-2 gap-8 text-xs text-center print:break-inside-avoid print:page-break-inside-avoid">
          {/* Petugas Pelaksana */}
          <div className="flex flex-col items-center">
            <div className="h-10 flex flex-col justify-start items-center">
              <p className="text-black font-semibold leading-tight">Petugas Pelaksana,</p>
              <p className="text-black leading-tight">Operator Sekolah (OPS)</p>
            </div>
            {/* Ruang Kosong Tanda Tangan Basah & Cap Stempel */}
            <div className="h-20 print:h-20 my-1"></div>
            <div className="flex flex-col items-center">
              <p className="font-bold underline text-black text-sm">{info.operatorName}</p>
              <p className="text-black text-[11px] mt-0.5">NIP/NUPTK: {info.operatorNip || '-'}</p>
            </div>
          </div>

          {/* Mengetahui & Mengesahkan */}
          <div className="flex flex-col items-center">
            <div className="h-10 flex flex-col justify-start items-center">
              <p className="text-black font-semibold leading-tight">Mengetahui &amp; Mengesahkan,</p>
              <p className="text-black leading-tight">{info.principalTitle || `Kepala ${info.schoolName}`}</p>
            </div>
            {/* Ruang Kosong Tanda Tangan Basah & Cap Stempel */}
            <div className="h-20 print:h-20 my-1"></div>
            <div className="flex flex-col items-center">
              <p className="font-bold underline text-black text-sm">{info.principalName}</p>
              <p className="text-black text-[11px] mt-0.5">NIP/NUPTK: {info.principalNip || '-'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

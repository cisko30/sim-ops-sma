import React from 'react';
import { INITIAL_JOURNALS, CATEGORY_COLORS } from '../../data/mockJournals';
import { DailyJournal } from '../../types/journal';

interface JournalDashboardViewProps {
  journals?: DailyJournal[];
  onNavigateToInput: () => void;
  onNavigateToAutoGenerator?: () => void;
  onNavigateToCalendar?: () => void;
  onNavigateToReport?: () => void;
  onShowToast?: (msg: string) => void;
}

export const JournalDashboardView: React.FC<JournalDashboardViewProps> = ({
  journals: propJournals,
  onNavigateToInput,
  onNavigateToAutoGenerator,
  onNavigateToCalendar,
  onNavigateToReport,
  onShowToast
}) => {
  const journals = propJournals || INITIAL_JOURNALS;
  // Aggregate stats from journals
  const totalJournals = journals.length;
  const approvedJournals = journals.filter((j) => j.status === 'Approved').length;
  const pendingJournals = journals.filter((j) => j.status === 'Submitted').length;
  const totalMinutes = journals.reduce((acc, curr) => acc + curr.total_duration_minutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const averageHoursPerDay = totalJournals > 0 ? (totalMinutes / (totalJournals * 60)).toFixed(1) : '0';

  // Group duration by category
  const categoryMinutesMap: Record<string, number> = {};
  journals.forEach((j) => {
    j.activities.forEach((act) => {
      categoryMinutesMap[act.category] = (categoryMinutesMap[act.category] || 0) + act.duration_minutes;
    });
  });

  const sortedCategories = Object.entries(categoryMinutesMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  return (
    <div className="flex flex-col gap-space-lg">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <div className="p-space-lg bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-label-md text-on-surface-variant font-semibold">Total Jam Kerja Terakumulasi</span>
            <span className="p-2 rounded-xl bg-primary-container text-white material-symbols-outlined text-xl">
              hourglass_bottom
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary font-headline-lg">{totalHours}</span>
            <span className="text-sm font-semibold text-on-surface-variant">Jam Kerja</span>
          </div>
          <span className="text-xs text-secondary font-medium mt-1 block">
            Rata-rata: {averageHoursPerDay} Jam / Hari kerja
          </span>
        </div>

        <div className="p-space-lg bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-label-md text-on-surface-variant font-semibold">Total Log Jurnal Harian</span>
            <span className="p-2 rounded-xl bg-surface-container text-primary material-symbols-outlined text-xl">
              calendar_month
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary font-headline-lg">{totalJournals}</span>
            <span className="text-sm font-semibold text-on-surface-variant">Hari Tercatat</span>
          </div>
          <span className="text-xs text-emerald-700 font-medium mt-1 block">
            100% Kepatuhan Absensi OPS
          </span>
        </div>

        <div className="p-space-lg bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-label-md text-on-surface-variant font-semibold">Jurnal Disetujui (Approved)</span>
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800 material-symbols-outlined text-xl">
              verified
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-700 font-headline-lg">{approvedJournals}</span>
            <span className="text-sm font-semibold text-on-surface-variant">Jurnal Sah</span>
          </div>
          <span className="text-xs text-on-surface-variant font-medium mt-1 block">
            Telah diverifikasi Kepala Sekolah
          </span>
        </div>

        <div className="p-space-lg bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-label-md text-on-surface-variant font-semibold">Menunggu Review Kepsek</span>
            <span className="p-2 rounded-xl bg-amber-100 text-amber-800 material-symbols-outlined text-xl">
              pending_actions
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-amber-700 font-headline-lg">{pendingJournals}</span>
            <span className="text-sm font-semibold text-on-surface-variant">Jurnal Antrean</span>
          </div>
          <span className="text-xs text-amber-800 font-medium mt-1 block">
            Siap ditandatangani hari ini
          </span>
        </div>
      </div>

      {/* Main Analytics: Category Distribution & Weekly Hours Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        {/* Left (7 cols): Time allocation by Category */}
        <div className="lg:col-span-7 p-space-lg bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-space-md border-b border-surface-container">
              <div>
                <h3 className="font-headline-sm text-base font-bold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-lg">pie_chart</span>
                  Distribusi Alokasi Waktu Kerja Operator
                </h3>
                <p className="text-body-sm text-on-surface-variant">
                  Berdasarkan modul operasional sekolah yang dikerjakan bulan ini
                </p>
              </div>
            </div>

            <div className="mt-space-md space-y-3">
              {sortedCategories.map(([cat, mins]) => {
                const percentage = Math.round((mins / totalMinutes) * 100);
                const hours = (mins / 60).toFixed(1);
                const catStyle = CATEGORY_COLORS[cat] || CATEGORY_COLORS['Lainnya'];
                return (
                  <div key={cat} className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs text-primary flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${catStyle.bg}`}></span>
                        {cat}
                      </span>
                      <span className="text-xs font-semibold text-on-surface-variant">
                        {hours} Jam ({percentage}%)
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-2.5 rounded-full bg-surface-container overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-space-lg pt-space-md border-t border-surface-container flex items-center justify-between">
            <span className="text-xs text-on-surface-variant">
              Tercatat 16 kategori tugas operasional sesuai regulasi Kemendikbud
            </span>
            <button
              type="button"
              onClick={() => {
                onShowToast?.("Membuka rincian tugas dan riwayat jurnal...");
                onNavigateToInput();
              }}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>Lihat Detail Semua Tugas</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Right (5 cols): Recent Highlights & Quick Entry */}
        <div className="lg:col-span-5 flex flex-col gap-space-md">
          <div className="p-space-lg bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm">
            <h3 className="font-headline-sm text-base font-bold text-primary mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">bolt</span>
              Aksi Cepat Jurnal
            </h3>
            <p className="text-body-sm text-on-surface-variant mb-4">
              Jaga akurasi pelaporan kerja dengan memperbarui log jurnal setiap selesai menyelesaikan agenda.
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={onNavigateToInput}
                className="w-full py-2.5 px-4 rounded-xl bg-primary text-white font-bold text-body-sm hover:bg-primary-container shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">edit_note</span>
                <span>Buka Form Input Jurnal Hari Ini</span>
              </button>

              {onNavigateToAutoGenerator && (
                <button
                  type="button"
                  onClick={onNavigateToAutoGenerator}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-700 text-white font-bold text-body-sm hover:from-emerald-800 hover:to-teal-800 shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">auto_awesome</span>
                  <span>⚡ Generator Jurnal Otomatis</span>
                </button>
              )}

              <div className="grid grid-cols-2 gap-2 pt-1">
                {onNavigateToCalendar && (
                  <button
                    type="button"
                    onClick={onNavigateToCalendar}
                    className="py-2 px-3 rounded-xl bg-surface-container text-on-surface font-semibold text-xs hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1.5 border border-surface-container"
                  >
                    <span className="material-symbols-outlined text-base text-primary">calendar_month</span>
                    <span>Kalender</span>
                  </button>
                )}
                {onNavigateToReport && (
                  <button
                    type="button"
                    onClick={onNavigateToReport}
                    className="py-2 px-3 rounded-xl bg-surface-container text-on-surface font-semibold text-xs hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1.5 border border-surface-container"
                  >
                    <span className="material-symbols-outlined text-base text-emerald-700">summarize</span>
                    <span>Laporan Cetak</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Verification Status Card */}
          <div className="p-space-lg bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm">
            <h3 className="font-headline-sm text-base font-bold text-primary mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-700 text-lg">fact_check</span>
              Status Pengesahan Kepala Sekolah
            </h3>
            <div className="space-y-3">
              {journals.slice(0, 5).map((j) => (
                <div key={j.id} className="p-2.5 rounded-lg bg-surface-container-low border border-surface-container flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-primary block">
                      {new Date(j.journal_date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="text-xs text-on-surface-variant line-clamp-1">
                      {j.daily_summary}
                    </span>
                  </div>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex-shrink-0 ml-2 ${
                    j.status === 'Approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : j.status === 'Submitted'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {j.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


import React, { useState, useMemo } from 'react';
import { INITIAL_JOURNALS, CATEGORY_COLORS } from '../../data/mockJournals';
import { DailyJournal } from '../../types/journal';
import { SEMESTER_GANJIL_AGENDA, AgendaMilestone } from '../../data/semesterGanjilAgenda';

interface JournalCalendarViewProps {
  journals?: DailyJournal[];
  onSelectDate: (date: string) => void;
  onNavigateToAutoGenerator?: () => void;
  onNavigateToReport?: () => void;
  onShowToast: (msg: string) => void;
}

export const JournalCalendarView: React.FC<JournalCalendarViewProps> = ({
  journals: propJournals,
  onSelectDate,
  onNavigateToAutoGenerator,
  onNavigateToReport,
  onShowToast
}) => {
  const journals = propJournals || INITIAL_JOURNALS;

  // Selected Month Index in Semester Ganjil (Default: November = 10)
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(10);
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-12');

  // Current Month Data
  const currentMonthAgenda = useMemo(() => {
    return (
      SEMESTER_GANJIL_AGENDA.find((m) => m.monthIndex === selectedMonthIndex) ||
      SEMESTER_GANJIL_AGENDA[4] // November default
    );
  }, [selectedMonthIndex]);

  // First day of week for this month in 2026 (0 = Sunday, 1 = Monday, ...)
  const firstDayOfWeek = useMemo(() => {
    return new Date(2026, selectedMonthIndex, 1).getDay();
  }, [selectedMonthIndex]);

  // Helper to check if a date falls in a milestone range or exact date
  const getMilestonesForDay = (dateStr: string): AgendaMilestone[] => {
    return currentMonthAgenda.milestones.filter((m) => {
      if (m.endDate) {
        return dateStr >= m.date && dateStr <= m.endDate;
      }
      return m.date === dateStr;
    });
  };

  // Build calendar days array for the selected month
  const calendarDays = useMemo(() => {
    const monthNum = selectedMonthIndex + 1;
    const monthStr = monthNum < 10 ? `0${monthNum}` : `${monthNum}`;

    return Array.from({ length: currentMonthAgenda.daysCount }, (_, i) => {
      const dayNum = i + 1;
      const dayStr = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
      const dateStr = `2026-${monthStr}-${dayStr}`;
      const journal = journals.find((j) => j.journal_date === dateStr);

      const dateObj = new Date(2026, selectedMonthIndex, dayNum);
      const dayOfWeek = dateObj.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const milestones = getMilestonesForDay(dateStr);

      return {
        dayNum,
        dateStr,
        journal,
        isWeekend,
        dayOfWeek,
        dayName: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'][dayOfWeek],
        milestones
      };
    });
  }, [selectedMonthIndex, currentMonthAgenda, journals]);

  const activeJournal: DailyJournal | undefined = journals.find(
    (j) => j.journal_date === selectedDate
  );

  const activeDayMilestones = useMemo(() => {
    return currentMonthAgenda.milestones.filter((m) => {
      if (m.endDate) {
        return selectedDate >= m.date && selectedDate <= m.endDate;
      }
      return m.date === selectedDate;
    });
  }, [currentMonthAgenda, selectedDate]);

  return (
    <div className="flex flex-col gap-space-lg">
      {/* Semester Ganjil Month Selector Toolbar */}
      <div className="p-space-md bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">event_available</span>
            <h2 className="text-sm font-bold text-primary uppercase tracking-wider">
              Kalender Jurnal Semester Ganjil (Juli &ndash; Desember 2026)
            </h2>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Pilih bulan untuk meninjau roadmap kedinasan, batas cut-off penting, dan rekaman jurnal harian.
          </p>
        </div>

        {/* 6 Months Pills & Quick Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 xl:pb-0">
            {SEMESTER_GANJIL_AGENDA.map((m) => {
              const isCurrent = m.monthIndex === selectedMonthIndex;
              return (
                <button
                  key={m.monthIndex}
                  type="button"
                  onClick={() => {
                    setSelectedMonthIndex(m.monthIndex);
                    // Default selected date to 1st or 15th of that month
                    const monthStr = m.monthIndex + 1 < 10 ? `0${m.monthIndex + 1}` : `${m.monthIndex + 1}`;
                    setSelectedDate(`2026-${monthStr}-15`);
                    onShowToast(`Beralih ke kalender ${m.monthName}`);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                    isCurrent
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-surface-container border border-surface-container'
                  }`}
                >
                  <span>{m.shortName}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full ${
                      isCurrent ? 'bg-white/20 text-white' : 'bg-surface-container-high text-primary'
                    }`}
                  >
                    {m.badge}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-1.5 shrink-0 border-l border-surface-container pl-2">
            {onNavigateToAutoGenerator && (
              <button
                type="button"
                onClick={onNavigateToAutoGenerator}
                className="px-2.5 py-1.5 rounded-xl bg-surface-container text-primary font-bold text-xs hover:bg-surface-container-high transition-all flex items-center gap-1 border border-surface-container shrink-0"
                title="Buka Generator Jurnal Otomatis"
              >
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                <span>Generator</span>
              </button>
            )}
            {onNavigateToReport && (
              <button
                type="button"
                onClick={onNavigateToReport}
                className="px-2.5 py-1.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-container transition-all flex items-center gap-1 shadow-sm shrink-0"
                title="Buka Laporan Siap Cetak"
              >
                <span className="material-symbols-outlined text-sm">print</span>
                <span>Laporan</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Monthly Roadmap Theme Card */}
      <div className="p-space-lg bg-gradient-to-r from-primary/5 via-surface-container-lowest to-surface-container-low rounded-2xl border border-primary/20 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-4xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-wider">
              {currentMonthAgenda.monthName}
            </span>
            <h3 className="font-headline-sm text-base sm:text-lg font-bold text-primary">
              {currentMonthAgenda.themeTitle}
            </h3>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            {currentMonthAgenda.summary}
          </p>
        </div>

        {/* Milestone Quick Badges */}
        <div className="flex flex-wrap md:flex-col gap-1.5 shrink-0 text-[11px]">
          {currentMonthAgenda.milestones.map((m, idx) => (
            <div
              key={idx}
              className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 font-semibold ${
                m.isDeadline
                  ? 'bg-rose-50 text-rose-800 border-rose-300'
                  : 'bg-surface-container-lowest text-primary border-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-xs">
                {m.isDeadline ? 'notification_important' : 'flag'}
              </span>
              <span className="truncate max-w-[220px]">{m.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Calendar View + Day Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        {/* Calendar Grid (8 cols) */}
        <div className="lg:col-span-8 p-space-lg bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm flex flex-col">
          {/* Header Month & Legend */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-surface-container">
            <div className="flex items-center gap-2 text-xs font-bold text-primary">
              <span className="material-symbols-outlined text-lg">calendar_month</span>
              <span>{currentMonthAgenda.monthName} ({currentMonthAgenda.daysCount} Hari)</span>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold">
              <span className="flex items-center gap-1 text-emerald-800">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                Jurnal Disetujui
              </span>
              <span className="flex items-center gap-1 text-amber-800">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                Menunggu Review
              </span>
              <span className="flex items-center gap-1 text-rose-700">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                Agenda / Deadline
              </span>
            </div>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            <div className="text-rose-600">Min</div>
            <div>Sen</div>
            <div>Sel</div>
            <div>Rab</div>
            <div>Kam</div>
            <div>Jum</div>
            <div className="text-rose-600">Sab</div>
          </div>

          {/* Day Cells Grid */}
          <div className="grid grid-cols-7 gap-2 flex-1">
            {/* Blank placeholder cells for offset before day 1 */}
            {Array.from({ length: firstDayOfWeek }, (_, idx) => (
              <div
                key={`blank-${idx}`}
                className="min-h-[85px] p-2 rounded-xl bg-surface-container-lowest/30 border border-transparent opacity-30 pointer-events-none"
              ></div>
            ))}

            {/* Actual Month Days */}
            {calendarDays.map((day) => {
              const isSelected = day.dateStr === selectedDate;
              const hasJournal = !!day.journal;
              const hasMilestone = day.milestones.length > 0;
              const hasDeadline = day.milestones.some((m) => m.isDeadline);

              return (
                <button
                  key={day.dateStr}
                  type="button"
                  onClick={() => {
                    setSelectedDate(day.dateStr);
                    if (hasJournal) {
                      onShowToast(`Menampilkan catatan jurnal ${day.dateStr}`);
                    } else if (hasMilestone) {
                      onShowToast(`Agenda: ${day.milestones[0].title}`);
                    }
                  }}
                  className={`min-h-[88px] p-2 rounded-xl border text-left flex flex-col justify-between transition-all relative ${
                    isSelected
                      ? 'border-primary ring-2 ring-primary/30 bg-primary/10 shadow-sm z-10'
                      : 'border-surface-container bg-surface-container-low hover:bg-surface-container'
                  } ${day.isWeekend ? 'bg-surface-container-high/40' : ''}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs font-bold ${
                        day.isWeekend ? 'text-rose-600' : 'text-primary'
                      } ${isSelected ? 'underline font-extrabold' : ''}`}
                    >
                      {day.dayNum}
                    </span>

                    <div className="flex items-center gap-1">
                      {hasDeadline && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" title="Batas Akhir / Cut-Off"></span>
                      )}
                      {hasJournal && (
                        <span
                          className={`w-2 h-2 rounded-full ${
                            day.journal?.status === 'Approved'
                              ? 'bg-emerald-500'
                              : day.journal?.status === 'Submitted'
                              ? 'bg-amber-500'
                              : 'bg-slate-400'
                          }`}
                          title={`Jurnal: ${day.journal?.status}`}
                        ></span>
                      )}
                    </div>
                  </div>

                  {/* Day Content */}
                  <div className="mt-1 space-y-1 w-full">
                    {/* Agenda Chip if milestone exists */}
                    {hasMilestone && (
                      <span
                        className={`block text-[9px] font-bold px-1 py-0.5 rounded truncate ${
                          hasDeadline
                            ? 'bg-rose-100 text-rose-800 border border-rose-300 font-extrabold'
                            : 'bg-primary/15 text-primary'
                        }`}
                        title={day.milestones.map((m) => m.title).join(' • ')}
                      >
                        {day.milestones[0].category}: {day.milestones[0].title}
                      </span>
                    )}

                    {/* Recorded Journal Info */}
                    {day.journal ? (
                      <span
                        className={`block text-[10px] font-semibold px-1 py-0.5 rounded truncate ${
                          day.journal.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        ✓ {(day.journal.total_duration_minutes / 60).toFixed(1)} Jam
                      </span>
                    ) : !hasMilestone ? (
                      <span className="text-[10px] text-outline italic block">
                        {day.isWeekend ? 'Libur' : '-'}
                      </span>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Details Panel (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-space-md">
          <div className="p-space-lg bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm flex-1 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div>
                <span className="text-xs font-semibold text-on-surface-variant">Rincian Tanggal</span>
                <h3 className="font-headline-sm text-base font-bold text-primary">
                  {new Date(selectedDate).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </h3>
              </div>
              {activeJournal && (
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                    activeJournal.status === 'Approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {activeJournal.status}
                </span>
              )}
            </div>

            <div className="mt-4 space-y-4 flex-1">
              {/* Agenda Kedinasan Milestone (If Any) */}
              {activeDayMilestones.length > 0 && (
                <div className="p-3.5 rounded-xl bg-gradient-to-br from-primary/10 to-surface-container border border-primary/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">event_note</span>
                      Agenda Semester Ganjil
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary text-white font-bold">
                      {activeDayMilestones[0].category}
                    </span>
                  </div>

                  {activeDayMilestones.map((m, idx) => (
                    <div key={idx} className="space-y-1">
                      <h4 className="text-xs font-bold text-primary flex items-center gap-1">
                        {m.isDeadline && (
                          <span className="text-rose-600 font-extrabold">[BATAS AKHIR]</span>
                        )}
                        <span>{m.title}</span>
                      </h4>
                      <p className="text-[11px] text-on-surface leading-relaxed">
                        {m.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Recorded Journal Info (If Any) */}
              {activeJournal ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                    <span className="text-xs font-bold text-primary block mb-1">
                      Ringkasan Jurnal Harian OPS:
                    </span>
                    <p className="text-xs text-on-surface leading-relaxed">
                      {activeJournal.daily_summary}
                    </p>
                    <div className="mt-2 text-xs font-semibold text-secondary flex items-center justify-between">
                      <span>Total Durasi:</span>
                      <span className="font-bold text-emerald-800">
                        {(activeJournal.total_duration_minutes / 60).toFixed(1)} Jam Kerja
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
                      Aktivitas Tercatat ({activeJournal.activities.length}):
                    </h4>
                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                      {activeJournal.activities.map((act) => {
                        const catStyle = CATEGORY_COLORS[act.category] || CATEGORY_COLORS['Lainnya'];
                        return (
                          <div
                            key={act.id}
                            className="p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${catStyle.bg}`}>
                                {act.category}
                              </span>
                              <span className="font-semibold text-on-surface-variant text-[11px]">
                                {act.start_time} - {act.end_time}
                              </span>
                            </div>
                            <span className="font-bold text-primary block">{act.activity_title}</span>
                            <span className="text-on-surface-variant mt-0.5 block line-clamp-2 text-[11px]">
                              {act.description}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectDate(selectedDate)}
                    className="w-full py-2.5 px-4 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-container shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-base">open_in_new</span>
                    <span>Buka / Edit di Halaman Riwayat</span>
                  </button>
                </div>
              ) : (
                <div className="text-center py-8 px-4 bg-surface-container-low rounded-xl border border-dashed border-surface-container">
                  <span className="material-symbols-outlined text-3xl text-outline mb-1">edit_calendar</span>
                  <p className="text-xs font-bold text-primary">Belum Ada Jurnal Tersimpan</p>
                  <p className="text-[11px] text-on-surface-variant mt-1 mb-3">
                    {activeDayMilestones.length > 0
                      ? 'Gunakan agenda kedinasan di atas sebagai referensi pembuatan jurnal hari ini.'
                      : 'Klik tombol di bawah untuk mencatat jurnal harian baru pada tanggal ini.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => onSelectDate(selectedDate)}
                    className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-container shadow-sm inline-flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-base">add</span>
                    <span>+ Buat Jurnal Tanggal Ini</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

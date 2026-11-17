import React, { useState, useMemo } from 'react';
import { JOURNAL_PRESETS, JournalPreset } from '../../data/journalPresets';
import { CATEGORY_COLORS } from '../../data/mockJournals';
import { DailyJournal, JournalActivity } from '../../types/journal';
import { SCHOOL_INFO as DEFAULT_SCHOOL_INFO } from '../../data/mockData';
import { SchoolInfo } from '../../types';

interface JournalAutoGeneratorViewProps {
  schoolInfo?: SchoolInfo;
  onJournalCreated: (newJournal: DailyJournal) => void;
  onJournalsBatchCreated?: (newJournals: DailyJournal[]) => void;
  onNavigateToHistory: () => void;
  onNavigateToReport?: () => void;
  onShowToast: (msg: string) => void;
}

export const JournalAutoGeneratorView: React.FC<JournalAutoGeneratorViewProps> = ({
  schoolInfo: propSchoolInfo,
  onJournalCreated,
  onJournalsBatchCreated,
  onNavigateToHistory,
  onNavigateToReport,
  onShowToast
}) => {
  const school = propSchoolInfo || DEFAULT_SCHOOL_INFO;
  // Mode: single date vs date range
  const [generationMode, setGenerationMode] = useState<'single' | 'range'>('range');

  // Single date state
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-12');

  // Range state: default November 1 s.d. November 30, 2026
  const [startDate, setStartDate] = useState<string>('2026-11-02');
  const [endDate, setEndDate] = useState<string>('2026-11-30');
  const [skipSunday, setSkipSunday] = useState<boolean>(true);
  const [skipSaturday, setSkipSaturday] = useState<boolean>(true);
  const [rotationMode, setRotationMode] = useState<'rotate' | 'fixed'>('rotate');

  // Preset & Status
  const [selectedPresetId, setSelectedPresetId] = useState<string>(JOURNAL_PRESETS[0].id);
  const [initialStatus, setInitialStatus] = useState<'Draft' | 'Submitted'>('Draft');
  const [customSummary, setCustomSummary] = useState<string>('');

  const selectedPreset: JournalPreset =
    JOURNAL_PRESETS.find((p) => p.id === selectedPresetId) || JOURNAL_PRESETS[0];

  const formatHoursMinutes = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m} Menit`;
    if (m === 0) return `${h} Jam`;
    return `${h} Jam ${m} Menit`;
  };

  // Calculate target working days in the range
  const rangeDays = useMemo(() => {
    if (generationMode !== 'range' || !startDate || !endDate) return [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) return [];

    const days: { dateStr: string; dayName: string; isWeekend: boolean }[] = [];
    const cur = new Date(start);

    while (cur <= end) {
      const dayOfWeek = cur.getDay(); // 0 = Sun, 6 = Sat
      const isSun = dayOfWeek === 0;
      const isSat = dayOfWeek === 6;

      const dateStr = cur.toISOString().split('T')[0];
      const dayName = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][dayOfWeek];

      const shouldSkip = (isSun && skipSunday) || (isSat && skipSaturday);
      if (!shouldSkip) {
        days.push({
          dateStr,
          dayName,
          isWeekend: isSun || isSat
        });
      }
      cur.setDate(cur.getDate() + 1);
    }
    return days;
  }, [generationMode, startDate, endDate, skipSunday, skipSaturday]);

  // Calculate total estimated hours for range
  const totalEstimatedMinutes = useMemo(() => {
    if (generationMode === 'single') return selectedPreset.totalDurationMinutes;
    if (rotationMode === 'rotate') {
      return rangeDays.reduce((acc, _, index) => {
        const p = JOURNAL_PRESETS[index % JOURNAL_PRESETS.length];
        return acc + p.totalDurationMinutes;
      }, 0);
    } else {
      return rangeDays.length * selectedPreset.totalDurationMinutes;
    }
  }, [generationMode, selectedPreset, rangeDays, rotationMode]);

  // Single or Batch Generation Handler
  const handleGenerate = (destination: 'report' | 'history' = 'report', statusOverride?: 'Draft' | 'Submitted') => {
    const finalStatus = statusOverride || initialStatus;

    if (generationMode === 'single') {
      // Single day generation
      const journalId = `dj-${selectedDate}-${Date.now()}`;
      const generatedActivities: JournalActivity[] = selectedPreset.activities.map((act, index) => ({
        ...act,
        id: `act-auto-${Date.now()}-${index + 1}`,
        daily_journal_id: journalId,
        sort_order: index + 1
      }));

      const newJournal: DailyJournal = {
        id: journalId,
        school_id: 1,
        user_id: 1,
        user_name: school.operatorName,
        user_role: school.operatorRole,
        journal_date: selectedDate,
        unit_name: 'Unit Tata Usaha & Operasional Sekolah',
        daily_summary: customSummary.trim() || selectedPreset.defaultSummary,
        total_duration_minutes: selectedPreset.totalDurationMinutes,
        status: finalStatus,
        submitted_at: finalStatus === 'Submitted' ? new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) : undefined,
        activities: generatedActivities
      };

      onJournalCreated(newJournal);
      onShowToast(`Jurnal otomatis tanggal ${selectedDate} berhasil disimpan sebagai ${finalStatus === 'Draft' ? 'Draf' : 'Diajukan'}!`);
      if (destination === 'report' && onNavigateToReport) {
        onNavigateToReport();
      } else {
        onNavigateToHistory();
      }
    } else {
      // Batch date range generation
      if (rangeDays.length === 0) {
        onShowToast('Rentang tanggal tidak valid atau semua hari terlewat sebagai hari libur.');
        return;
      }

      const batchJournals: DailyJournal[] = rangeDays.map((day, dIdx) => {
        const preset = rotationMode === 'rotate'
          ? JOURNAL_PRESETS[dIdx % JOURNAL_PRESETS.length]
          : selectedPreset;

        const journalId = `dj-${day.dateStr}-${Date.now()}-${dIdx}`;
        const activities: JournalActivity[] = preset.activities.map((act, aIdx) => ({
          ...act,
          id: `act-auto-${dIdx}-${aIdx + 1}-${Date.now()}`,
          daily_journal_id: journalId,
          sort_order: aIdx + 1
        }));

        return {
          id: journalId,
          school_id: 1,
          user_id: 1,
          user_name: school.operatorName,
          user_role: school.operatorRole,
          journal_date: day.dateStr,
          unit_name: 'Unit Tata Usaha & Operasional Sekolah',
          daily_summary: preset.defaultSummary,
          total_duration_minutes: preset.totalDurationMinutes,
          status: finalStatus,
          submitted_at: finalStatus === 'Submitted' ? new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) : undefined,
          activities
        };
      });

      if (onJournalsBatchCreated) {
        onJournalsBatchCreated(batchJournals);
      } else {
        batchJournals.forEach((j) => onJournalCreated(j));
      }

      onShowToast(`Berhasil menyimpan ${batchJournals.length} jurnal harian sebagai ${finalStatus === 'Draft' ? 'Draf' : 'Diajukan'}!`);
      if (destination === 'report' && onNavigateToReport) {
        onNavigateToReport();
      } else {
        onNavigateToHistory();
      }
    }
  };

  return (
    <div className="flex flex-col gap-space-lg">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        {/* Left Column (5 cols): Controls & Configuration */}
        <div className="lg:col-span-5 flex flex-col gap-space-md">
          {/* Step 1: Mode & Date Selection */}
          <div className="p-space-lg bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm space-y-space-md">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">1</span>
                Pilihan Mode &amp; Tanggal
              </h3>

              {/* Mode Toggle Pills */}
              <div className="flex rounded-lg bg-surface-container p-0.5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setGenerationMode('range')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    generationMode === 'range' ? 'bg-primary text-white shadow-sm font-bold' : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  Rentang Tanggal
                </button>
                <button
                  type="button"
                  onClick={() => setGenerationMode('single')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    generationMode === 'single' ? 'bg-primary text-white shadow-sm font-bold' : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  Satu Hari
                </button>
              </div>
            </div>

            {/* If Single Mode */}
            {generationMode === 'single' ? (
              <div>
                <label className="block text-label-sm font-semibold text-on-surface-variant mb-1">
                  Pilih Tanggal Kegiatan (WIB)
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low rounded-xl border border-surface-container text-body-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
            ) : (
              /* If Range Mode */
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-label-sm font-semibold text-on-surface-variant mb-1">
                      Dari Tanggal (Mulai)
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 bg-surface-container-low rounded-xl border border-surface-container text-xs font-bold text-on-surface focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-label-sm font-semibold text-on-surface-variant mb-1">
                      Sampai Tanggal (Selesai)
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 bg-surface-container-low rounded-xl border border-surface-container text-xs font-bold text-on-surface focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                </div>

                {/* Weekend filter checkboxes */}
                <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container space-y-2">
                  <span className="text-xs font-bold text-primary block">
                    Aturan Hari Kerja Sekolah:
                  </span>
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer font-medium text-on-surface">
                      <input
                        type="checkbox"
                        checked={skipSunday}
                        onChange={(e) => setSkipSunday(e.target.checked)}
                        className="rounded border-surface-container text-primary focus:ring-primary"
                      />
                      <span>Lewati Hari Minggu (Libur)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer font-medium text-on-surface">
                      <input
                        type="checkbox"
                        checked={skipSaturday}
                        onChange={(e) => setSkipSaturday(e.target.checked)}
                        className="rounded border-surface-container text-primary focus:ring-primary"
                      />
                      <span>Lewati Hari Sabtu</span>
                    </label>
                  </div>
                </div>

                {/* Rotation Pattern Toggle */}
                <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                  <label className="block text-xs font-bold text-primary mb-1">
                    Pola Variasi Agenda Tugas:
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setRotationMode('rotate')}
                      className={`p-2 rounded-lg border text-left transition-all ${
                        rotationMode === 'rotate'
                          ? 'bg-primary text-white border-primary shadow-sm font-bold'
                          : 'bg-surface-container-lowest text-on-surface-variant border-surface-container'
                      }`}
                    >
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="material-symbols-outlined text-sm">sync</span>
                        <span>Rotasi 6 Paket Agenda (Realistis)</span>
                      </div>
                      <p className={`text-[10px] ${rotationMode === 'rotate' ? 'text-white/80' : 'text-outline'}`}>
                        Bervariasi harian (Dapodik, PIP, JTM, TKA, ABM, PDSS Ledger)
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRotationMode('fixed')}
                      className={`p-2 rounded-lg border text-left transition-all ${
                        rotationMode === 'fixed'
                          ? 'bg-primary text-white border-primary shadow-sm font-bold'
                          : 'bg-surface-container-lowest text-on-surface-variant border-surface-container'
                      }`}
                    >
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="material-symbols-outlined text-sm">filter_none</span>
                        <span>Paket Terpilih Saja</span>
                      </div>
                      <p className={`text-[10px] ${rotationMode === 'fixed' ? 'text-white/80' : 'text-outline'}`}>
                        Gunakan 1 tema paket yang sama untuk semua hari
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Document Initial Status */}
            <div className="pt-2 border-t border-surface-container/60">
              <label className="block text-label-sm font-semibold text-on-surface-variant mb-1.5">
                Status Dokumen yang Dibuat:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setInitialStatus('Draft')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    initialStatus === 'Draft'
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-surface-container-low text-on-surface-variant border-surface-container hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">edit_note</span>
                  <span>Status: Draf</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInitialStatus('Submitted')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    initialStatus === 'Submitted'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                      : 'bg-surface-container-low text-on-surface-variant border-surface-container hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">send</span>
                  <span>Status: Diajukan</span>
                </button>
              </div>

              {/* Direct Save Action Button */}
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => handleGenerate('history', 'Draft')}
                  disabled={generationMode === 'range' && rangeDays.length === 0}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer disabled:opacity-50"
                  title="Simpan seluruh jurnal otomatis ini sebagai draf dan buka halaman riwayat jurnal"
                >
                  <span className="material-symbols-outlined text-base">save</span>
                  <span>
                    Simpan Sekarang sbg Draf ({generationMode === 'range' ? `${rangeDays.length} Hari Kerja` : '1 Hari'})
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Step 2: Choose Template Preset */}
          {(generationMode === 'single' || rotationMode === 'fixed') && (
            <div className="p-space-lg bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">2</span>
                Pilih Tema Paket Agenda
              </h3>

              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {JOURNAL_PRESETS.map((preset) => {
                  const isSelected = preset.id === selectedPresetId;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setSelectedPresetId(preset.id);
                        setCustomSummary('');
                      }}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-primary-container text-white border-primary shadow-md'
                          : 'bg-surface-container-low hover:bg-surface-container border-surface-container text-on-surface'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-surface-container text-primary'
                        }`}>
                          {preset.badge}
                        </span>
                        <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-secondary'}`}>
                          {formatHoursMinutes(preset.totalDurationMinutes)} ({preset.activities.length} Tugas)
                        </span>
                      </div>

                      <h4 className={`text-xs font-bold mt-1 ${isSelected ? 'text-white' : 'text-primary'}`}>
                        {preset.name}
                      </h4>
                      <p className={`text-[11px] mt-0.5 line-clamp-2 ${isSelected ? 'text-white/80' : 'text-on-surface-variant'}`}>
                        {preset.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (7 cols): Range Analysis / Live Preview & Execution */}
        <div className="lg:col-span-7 flex flex-col gap-space-md">
          <div className="p-space-lg bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm flex flex-col justify-between flex-1">
            <div>
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-space-md border-b border-surface-container">
                <div>
                  <span className="text-xs font-semibold text-secondary block">
                    {generationMode === 'range' ? 'Pratinjau Batch Rentang Tanggal' : 'Pratinjau Jurnal Harian'}
                  </span>
                  <h3 className="font-headline-sm text-lg font-bold text-primary">
                    {generationMode === 'range'
                      ? `Pembuatan ${rangeDays.length} Hari Kerja Sekaligus`
                      : selectedPreset.name}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                    Total Estimasi: {(totalEstimatedMinutes / 60).toFixed(1)} Jam
                  </span>
                </div>
              </div>

              {/* Range Mode Breakdown */}
              {generationMode === 'range' ? (
                <div className="mt-4 space-y-4">
                  {/* Summary Banner */}
                  <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-primary block">
                        Rentang: {startDate} s.d. {endDate}
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        {rotationMode === 'rotate'
                          ? 'Agenda dirotasi otomatis antara Dapodik, PIP, Kurikulum, TKA, ABM, dan PDSS.'
                          : `Semua hari menggunakan paket "${selectedPreset.name}".`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs px-3 py-1 rounded-lg bg-primary text-white font-bold">
                        {rangeDays.length} Hari Kerja Terjadwal
                      </span>
                    </div>
                  </div>

                  {/* List of generated days */}
                  <div>
                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
                      Daftar Tanggal yang Akan Dibuat ({rangeDays.length} Hari):
                    </h4>
                    <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                      {rangeDays.map((day, idx) => {
                        const preset = rotationMode === 'rotate'
                          ? JOURNAL_PRESETS[idx % JOURNAL_PRESETS.length]
                          : selectedPreset;
                        return (
                          <div
                            key={day.dateStr}
                            className="p-2.5 rounded-xl bg-surface-container-low border border-surface-container flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              <div>
                                <span className="font-bold text-primary block">
                                  {day.dayName}, {new Date(day.dateStr).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                  })}
                                </span>
                                <span className="text-[11px] text-on-surface-variant line-clamp-1">
                                  {preset.name}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-right shrink-0">
                              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-surface-container text-secondary">
                                {formatHoursMinutes(preset.totalDurationMinutes)}
                              </span>
                              <span className="text-[10px] font-semibold text-outline">
                                ({preset.activities.length} Tugas)
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                /* Single Day Preview */
                <div className="mt-4 space-y-4">
                  {/* Editable Executive Summary */}
                  <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                    <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-1">
                      Ringkasan Agenda Harian (Dapat Disesuaikan):
                    </label>
                    <textarea
                      value={customSummary || selectedPreset.defaultSummary}
                      onChange={(e) => setCustomSummary(e.target.value)}
                      rows={2}
                      className="w-full p-2 bg-surface-container-lowest rounded-lg border border-surface-container text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    ></textarea>
                  </div>

                  {/* Activities Breakdown */}
                  <div>
                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Daftar {selectedPreset.activities.length} Aktivitas Terjadwal:</span>
                      <span className="text-outline font-normal text-[11px]">Bebas Bentrok Jadwal (*Collision-Free*)</span>
                    </h4>

                    <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                      {selectedPreset.activities.map((act, index) => {
                        const catStyle = CATEGORY_COLORS[act.category] || CATEGORY_COLORS['Lainnya'];
                        return (
                          <div
                            key={index}
                            className="p-3 rounded-xl bg-surface-container-low border border-surface-container text-xs shadow-sm hover:border-primary/30 transition-all"
                          >
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center">
                                  {index + 1}
                                </span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${catStyle.bg}`}>
                                  {act.category}
                                </span>
                              </div>
                              <span className="font-bold text-on-surface bg-surface-container px-2 py-0.5 rounded text-[11px]">
                                {act.start_time} - {act.end_time} ({act.duration_minutes} mnt)
                              </span>
                            </div>

                            <h5 className="font-bold text-primary text-xs mt-1">
                              {act.activity_title}
                            </h5>
                            <p className="text-on-surface-variant text-[11px] mt-0.5 leading-relaxed">
                              {act.description}
                            </p>

                            <div className="mt-2 pt-2 border-t border-surface-container/60 flex items-center justify-between text-[11px]">
                              <span className="text-emerald-800 font-medium">
                                <strong>Output:</strong> {act.result}
                              </span>
                              <span className="text-xs px-2 py-0.2 rounded font-semibold bg-emerald-100 text-emerald-800">
                                {act.status}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Execute Button */}
            <div className="mt-6 pt-4 border-t border-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-on-surface-variant">
                {generationMode === 'range' ? (
                  <span>
                    Akan membuat <strong>{rangeDays.length} Jurnal Harian</strong> sekaligus dengan status <strong>{initialStatus}</strong>.
                  </span>
                ) : (
                  <span>
                    Jurnal akan tersimpan resmi untuk tanggal <strong>{new Date(selectedDate).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}</strong>
                  </span>
                )}
                <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">task_alt</span>
                  <span>Otomatis terintegrasi ke Laporan Resmi SMA NU Kaplongan &amp; Siap Cetak PDF</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleGenerate('history', 'Draft')}
                  disabled={generationMode === 'range' && rangeDays.length === 0}
                  className="py-2.5 px-4 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50 cursor-pointer"
                  title="Simpan seluruh jurnal ini sebagai draf dan buka halaman riwayat jurnal"
                >
                  <span className="material-symbols-outlined text-base">save</span>
                  <span>Simpan sbg Draf ({generationMode === 'range' ? `${rangeDays.length} Jurnal` : '1 Jurnal'})</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleGenerate('report')}
                  disabled={generationMode === 'range' && rangeDays.length === 0}
                  className="py-2.5 px-5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-container shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">print</span>
                  <span>
                    {generationMode === 'range'
                      ? `⚡ Terbitkan & Buka Laporan (${rangeDays.length} Jurnal)`
                      : '⚡ Terbitkan & Buka Laporan'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

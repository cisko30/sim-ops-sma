import React, { useState } from 'react';
import { DailyJournal, JournalActivity, JournalStatus } from '../../types/journal';
import { INITIAL_JOURNALS, CATEGORY_COLORS } from '../../data/mockJournals';
import { AddActivityModal } from './AddActivityModal';

interface JournalHistoryViewProps {
  activeRole: 'OPS' | 'Kurikulum' | 'Kepsek' | 'Bendahara' | 'Wali Kelas';
  journals?: DailyJournal[];
  initialSelectedDate?: string;
  onUpdateJournals?: (journals: DailyJournal[]) => void;
  onNavigateToAutoGenerator?: () => void;
  onNavigateToReport?: () => void;
  onNavigateToCalendar?: () => void;
  onShowToast: (msg: string) => void;
}

export const JournalHistoryView: React.FC<JournalHistoryViewProps> = ({
  activeRole,
  journals: parentJournals,
  initialSelectedDate,
  onUpdateJournals,
  onNavigateToAutoGenerator,
  onNavigateToReport,
  onNavigateToCalendar,
  onShowToast
}) => {
  const [localJournals, setLocalJournals] = useState<DailyJournal[]>(INITIAL_JOURNALS);
  const journals = parentJournals || localJournals;
  const setJournals = (updater: React.SetStateAction<DailyJournal[]>) => {
    if (onUpdateJournals && parentJournals) {
      const next = typeof updater === 'function' ? updater(parentJournals) : updater;
      onUpdateJournals(next);
    } else {
      setLocalJournals(updater);
    }
  };
  const [selectedJournalDate, setSelectedJournalDate] = useState<string>(
    initialSelectedDate || '2026-11-12'
  );

  React.useEffect(() => {
    if (initialSelectedDate) {
      setSelectedJournalDate(initialSelectedDate);
    }
  }, [initialSelectedDate]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal State
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<JournalActivity | null>(null);
  const [submitConfirmOpen, setSubmitConfirmOpen] = useState(false);
  const [newJournalModalOpen, setNewJournalModalOpen] = useState(false);
  const [newJournalDate, setNewJournalDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [newJournalSummary, setNewJournalSummary] = useState('');

  // Currently viewed journal
  const currentJournal = journals.find((j) => j.journal_date === selectedJournalDate) || journals[0];

  const isLocked = currentJournal?.status === 'Submitted' || currentJournal?.status === 'Approved';

  const formatHoursMinutes = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m} Menit`;
    if (m === 0) return `${h} Jam`;
    return `${h} Jam ${m} Menit`;
  };

  const getStatusBadge = (status: JournalStatus) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <span className="material-symbols-outlined text-sm">verified</span>
            Disetujui (Approved)
          </span>
        );
      case 'Submitted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <span className="material-symbols-outlined text-sm">hourglass_top</span>
            Menunggu Verifikasi (Submitted)
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
            <span className="material-symbols-outlined text-sm">visibility</span>
            Sedang Ditinjau
          </span>
        );
      case 'Revision Requested':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
            <span className="material-symbols-outlined text-sm">error</span>
            Perlu Revisi
          </span>
        );
      case 'Draft':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-750">
            <span className="material-symbols-outlined text-sm">edit_note</span>
            Draft (Dapat Diubah)
          </span>
        );
    }
  };

  // Add / Edit Activity Handler
  const handleSaveActivity = (data: Omit<JournalActivity, 'id' | 'daily_journal_id' | 'sort_order'>) => {
    if (!currentJournal) return;

    let updatedActivities: JournalActivity[];

    if (editingActivity) {
      updatedActivities = currentJournal.activities.map((act) =>
        act.id === editingActivity.id
          ? { ...act, ...data }
          : act
      );
      onShowToast(`Kegiatan "${data.activity_title}" berhasil diperbarui.`);
    } else {
      const newAct: JournalActivity = {
        ...data,
        id: `act-${Date.now()}`,
        daily_journal_id: currentJournal.id,
        sort_order: currentJournal.activities.length + 1
      };
      updatedActivities = [...currentJournal.activities, newAct];
      onShowToast(`Kegiatan "${data.activity_title}" berhasil ditambahkan ke jurnal.`);
    }

    const newTotalMinutes = updatedActivities.reduce((acc, curr) => acc + curr.duration_minutes, 0);

    setJournals((prev) =>
      prev.map((j) =>
        j.id === currentJournal.id
          ? {
              ...j,
              activities: updatedActivities,
              total_duration_minutes: newTotalMinutes
            }
          : j
      )
    );

    setEditingActivity(null);
  };

  // Delete Activity Handler
  const handleDeleteActivity = (actId: string, title: string) => {
    if (isLocked) {
      onShowToast('Jurnal sudah dikunci! Tidak dapat menghapus kegiatan.');
      return;
    }

    if (confirm(`Hapus kegiatan "${title}" dari jurnal?`)) {
      const updated = currentJournal.activities.filter((a) => a.id !== actId);
      const newTotal = updated.reduce((acc, curr) => acc + curr.duration_minutes, 0);

      setJournals((prev) =>
        prev.map((j) =>
          j.id === currentJournal.id
            ? { ...j, activities: updated, total_duration_minutes: newTotal }
            : j
        )
      );

      onShowToast(`Kegiatan "${title}" dihapus.`);
    }
  };

  // Submit Journal (Lock for approval)
  const handleSubmitJournal = () => {
    if (!currentJournal) return;
    if (currentJournal.activities.length === 0) {
      onShowToast('Jurnal tidak boleh kosong! Tambahkan minimal 1 kegiatan sebelum submit.');
      return;
    }

    setJournals((prev) =>
      prev.map((j) =>
        j.id === currentJournal.id
          ? {
              ...j,
              status: 'Submitted',
              submitted_at: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
            }
          : j
      )
    );

    setSubmitConfirmOpen(false);
    onShowToast(`Jurnal tanggal ${currentJournal.journal_date} berhasil diserahkan kepada Kepala Sekolah.`);
  };

  // Approval by Kepsek
  const handleApproveJournal = () => {
    if (!currentJournal) return;
    setJournals((prev) =>
      prev.map((j) =>
        j.id === currentJournal.id
          ? {
              ...j,
              status: 'Approved',
              reviewer_name: 'Dr. H. Ahmad Fauzi, M.Pd.',
              reviewed_at: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
              review_notes: 'Jurnal harian terverifikasi valid dan disahkan secara kedinasan.'
            }
          : j
      )
    );
    onShowToast(`Jurnal berhasil disetujui & disahkan oleh Kepala Sekolah.`);
  };

  // Create New Journal Header
  const handleCreateNewJournal = (e: React.FormEvent) => {
    e.preventDefault();
    const exists = journals.find((j) => j.journal_date === newJournalDate);
    if (exists) {
      setSelectedJournalDate(newJournalDate);
      setNewJournalModalOpen(false);
      onShowToast(`Jurnal untuk tanggal ${newJournalDate} sudah ada. Menampilkan jurnal tersebut.`);
      return;
    }

    const newJ: DailyJournal = {
      id: `dj-${newJournalDate}`,
      school_id: 1,
      user_id: 1,
      user_name: 'Bagas Pratama, S.Kom',
      user_role: 'Koordinator Operator Sekolah (OPS)',
      journal_date: newJournalDate,
      unit_name: 'Unit Tata Usaha & Operasional Sekolah',
      daily_summary: newJournalSummary.trim() || 'Aktivitas administrasi dan operasional harian sekolah.',
      total_duration_minutes: 0,
      status: 'Draft',
      activities: []
    };

    setJournals((prev) => [newJ, ...prev]);
    setSelectedJournalDate(newJournalDate);
    setNewJournalModalOpen(false);
    setNewJournalSummary('');
    onShowToast(`Header Jurnal baru tanggal ${newJournalDate} berhasil dibuat (Status: Draft).`);
  };

  // Filtered list of journals for the history list
  const filteredJournals = journals.filter((j) => {
    if (statusFilter !== 'ALL' && j.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchSummary = j.daily_summary.toLowerCase().includes(q);
      const matchDate = j.journal_date.includes(q);
      const matchActivity = j.activities.some((a) =>
        a.activity_title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)
      );
      return matchSummary || matchDate || matchActivity;
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-space-lg">
      {/* Top Banner & Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Durasi */}
        <div className="p-4 bg-surface-container-lowest dark:bg-slate-900 rounded-2xl border border-surface-container dark:border-slate-800 shadow-xs flex items-center justify-between gap-3 overflow-hidden">
          <div className="min-w-0 flex-1">
            <span className="text-xs text-on-surface-variant font-medium block truncate">
              Total Durasi Hari Ini
            </span>
            <span className="text-xl sm:text-2xl font-bold text-primary dark:text-cyan-400 font-headline-lg tracking-tight block truncate">
              {formatHoursMinutes(currentJournal?.total_duration_minutes || 0)}
            </span>
            <span className="text-[11px] text-secondary font-medium block mt-0.5 truncate">
              Target reguler: 5.5 Jam / Hari
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-cyan-400 flex items-center justify-center shrink-0 border border-primary/20 dark:border-primary/30">
            <span className="material-symbols-outlined text-2xl">timer</span>
          </div>
        </div>

        {/* Card 2: Jumlah Kegiatan */}
        <div className="p-4 bg-surface-container-lowest dark:bg-slate-900 rounded-2xl border border-surface-container dark:border-slate-800 shadow-xs flex items-center justify-between gap-3 overflow-hidden">
          <div className="min-w-0 flex-1">
            <span className="text-xs text-on-surface-variant font-medium block truncate">
              Jumlah Kegiatan Hari Ini
            </span>
            <span className="text-xl sm:text-2xl font-bold text-primary dark:text-cyan-400 font-headline-lg tracking-tight block truncate">
              {currentJournal?.activities.length || 0}
            </span>
            <span className="text-[11px] text-secondary font-medium block mt-0.5 truncate">
              Semua tercatat berurutan
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-surface-container-high dark:bg-slate-800 text-primary dark:text-slate-300 flex items-center justify-center shrink-0 border border-surface-container dark:border-slate-700">
            <span className="material-symbols-outlined text-2xl">task_alt</span>
          </div>
        </div>

        {/* Card 3: Status Jurnal */}
        <div className="p-4 bg-surface-container-lowest dark:bg-slate-900 rounded-2xl border border-surface-container dark:border-slate-800 shadow-xs flex items-center justify-between gap-3 overflow-hidden">
          <div className="min-w-0 flex-1">
            <span className="text-xs text-on-surface-variant font-medium block truncate">
              Status Jurnal Tanggal Ini
            </span>
            <div className="mt-1 flex items-center truncate">
              {getStatusBadge(currentJournal?.status || 'Draft')}
            </div>
            <span className="text-[11px] text-on-surface-variant block mt-1 truncate">
              {isLocked ? 'Terkunci dari mutasi' : 'Dapat diedit & ditambah'}
            </span>
          </div>
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
            isLocked
              ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-800/60'
              : 'bg-surface-container-high dark:bg-slate-800 text-on-surface-variant dark:text-slate-300 border-surface-container dark:border-slate-700'
          }`}>
            <span className="material-symbols-outlined text-2xl">
              {isLocked ? 'lock' : 'lock_open'}
            </span>
          </div>
        </div>

        {/* Card 4: Operator Penanggung Jawab */}
        <div className="p-4 bg-surface-container-lowest dark:bg-slate-900 rounded-2xl border border-surface-container dark:border-slate-800 shadow-xs flex items-center justify-between gap-3 overflow-hidden">
          <div className="min-w-0 flex-1">
            <span className="text-xs text-on-surface-variant font-medium block truncate">
              Operator Penanggung Jawab
            </span>
            <span className="text-sm font-bold text-primary dark:text-cyan-400 truncate block mt-0.5" title={currentJournal?.user_name || 'Bagas Pratama, S.Kom'}>
              {currentJournal?.user_name || 'Bagas Pratama, S.Kom'}
            </span>
            <span className="text-[11px] text-on-surface-variant truncate block" title={currentJournal?.unit_name || 'Tata Usaha SMA'}>
              {currentJournal?.unit_name || 'Tata Usaha SMA'}
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-primary/10 dark:bg-slate-800 text-primary dark:text-cyan-400 flex items-center justify-center shrink-0 border border-primary/20 dark:border-slate-700">
            <span className="material-symbols-outlined text-2xl">person</span>
          </div>
        </div>
      </div>

      {/* Main Work Area: Left Active Journal Detail, Right Calendar/History List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        {/* Left Column (8 cols): Active Daily Journal Details & Activities */}
        <div className="lg:col-span-8 flex flex-col gap-space-md">
          {/* Active Journal Header Box */}
          <div className="p-space-lg bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-space-md border-b border-surface-container">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">event</span>
                  <h2 className="font-headline-md text-xl font-bold text-primary">
                    Jurnal Harian: {new Date(selectedJournalDate).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </h2>
                </div>
                <p className="text-body-sm text-on-surface-variant mt-1">
                  Zona Waktu: <strong>Asia/Jakarta (WIB)</strong> • Unit: {currentJournal?.unit_name}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Print button */}
                <button
                  type="button"
                  onClick={() => onShowToast(`Menyiapkan lembar cetak jurnal harian ${selectedJournalDate} (PDF)...`)}
                  className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface font-semibold text-body-sm hover:bg-surface-container-high transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">print</span>
                  <span>Cetak Jurnal</span>
                </button>

                {/* Submit button for OPS */}
                {currentJournal?.status === 'Draft' && (
                  <button
                    type="button"
                    onClick={() => setSubmitConfirmOpen(true)}
                    className="px-4 py-1.5 rounded-lg bg-primary text-white font-semibold text-body-sm hover:bg-primary-container shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-base">send</span>
                    <span>Submit ke Kepsek</span>
                  </button>
                )}

                {/* Kepsek Approval buttons */}
                {activeRole === 'Kepsek' && currentJournal?.status === 'Submitted' && (
                  <button
                    type="button"
                    onClick={handleApproveJournal}
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-body-sm hover:bg-emerald-700 shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-base">verified</span>
                    <span>Setujui Jurnal</span>
                  </button>
                )}
              </div>
            </div>

            {/* Daily Summary */}
            <div className="mt-space-md p-space-md bg-surface-container-low rounded-xl border border-surface-container">
              <span className="text-label-sm font-bold text-primary block mb-1 uppercase tracking-wider">
                Ringkasan Capaian Hari Ini (Executive Summary):
              </span>
              <p className="text-body-sm text-on-surface leading-relaxed">
                {currentJournal?.daily_summary || 'Belum ada ringkasan operasional.'}
              </p>
              {currentJournal?.review_notes && (
                <div className="mt-3 pt-2 border-t border-surface-container text-body-sm text-emerald-800 bg-emerald-50/60 p-2 rounded-lg flex items-start gap-2">
                  <span className="material-symbols-outlined text-base flex-shrink-0">comment</span>
                  <span>
                    <strong>Catatan Review ({currentJournal.reviewer_name}):</strong> {currentJournal.review_notes}
                  </span>
                </div>
              )}
            </div>

            {/* Activities Action Bar */}
            <div className="mt-space-lg flex items-center justify-between">
              <h3 className="font-headline-sm text-base font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">list_alt</span>
                Rincian Kegiatan Terjadwal ({currentJournal?.activities.length || 0})
              </h3>

              {!isLocked ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingActivity(null);
                    setActivityModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-secondary text-white font-semibold text-body-sm hover:bg-secondary-container shadow-sm transition-all flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">add_circle</span>
                  <span>+ Tambah Kegiatan</span>
                </button>
              ) : (
                <span className="text-label-sm text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">lock</span>
                  Jurnal terkunci (Telah diserahkan)
                </span>
              )}
            </div>

            {/* Activities Timeline / Cards */}
            <div className="mt-space-md space-y-space-md">
              {currentJournal?.activities.length === 0 ? (
                <div className="text-center py-10 px-4 bg-surface-container-low/50 rounded-xl border border-dashed border-surface-container">
                  <span className="material-symbols-outlined text-4xl text-outline mb-2">post_add</span>
                  <p className="text-body-md font-semibold text-primary">Belum ada kegiatan pada jurnal ini</p>
                  <p className="text-body-sm text-on-surface-variant mb-4">
                    Catat aktivitas pekerjaan Anda hari ini untuk pelaporan resmi sekolah.
                  </p>
                  {!isLocked && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingActivity(null);
                        setActivityModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-lg bg-primary text-white font-semibold text-body-sm hover:bg-primary-container"
                    >
                      + Tambah Kegiatan Pertama
                    </button>
                  )}
                </div>
              ) : (
                currentJournal?.activities.map((act, index) => {
                  const catStyle = CATEGORY_COLORS[act.category] || CATEGORY_COLORS['Lainnya'];
                  return (
                    <div
                      key={act.id}
                      className="p-space-md bg-surface-container-low rounded-xl border border-surface-container hover:border-primary/30 transition-all shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${catStyle.bg} ${catStyle.border}`}
                              >
                                {act.category}
                              </span>
                              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">schedule</span>
                                {act.start_time} - {act.end_time} WIB ({act.duration_minutes} mnt)
                              </span>
                              <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                                  act.priority === 'Tinggi'
                                    ? 'bg-rose-100 text-rose-800'
                                    : act.priority === 'Sedang'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                Prioritas {act.priority}
                              </span>
                            </div>
                            <h4 className="font-headline-sm text-body-lg font-bold text-primary">
                              {act.activity_title}
                            </h4>
                            <p className="text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                              {act.description}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        {!isLocked && (
                          <div className="flex items-center gap-1 self-end sm:self-start">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingActivity(act);
                                setActivityModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-secondary hover:bg-surface-container transition-colors"
                              title="Edit Kegiatan"
                            >
                              <span className="material-symbols-outlined text-lg">edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteActivity(act.id, act.activity_title)}
                              className="p-1.5 rounded-lg text-error hover:bg-error-container/30 transition-colors"
                              title="Hapus Kegiatan"
                            >
                              <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Result and Obstacle Details */}
                      {(act.result || act.obstacle || act.follow_up) && (
                        <div className="mt-3 pt-3 border-t border-surface-container/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {act.result && (
                            <div className="p-2 rounded bg-surface-container-lowest border border-surface-container">
                              <span className="font-bold text-emerald-800 flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">check_circle</span>
                                Hasil Kerja:
                              </span>
                              <p className="text-on-surface mt-0.5">{act.result}</p>
                            </div>
                          )}
                          {act.obstacle && (
                            <div className="p-2 rounded bg-surface-container-lowest border border-surface-container">
                              <span className="font-bold text-amber-800 flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">warning</span>
                                Kendala &amp; Hambatan:
                              </span>
                              <p className="text-on-surface mt-0.5">{act.obstacle}</p>
                            </div>
                          )}
                          {act.follow_up && (
                            <div className="sm:col-span-2 p-2 rounded bg-surface-container-lowest border border-surface-container">
                              <span className="font-bold text-blue-800 flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">next_plan</span>
                                Rencana Tindak Lanjut:
                              </span>
                              <p className="text-on-surface mt-0.5">{act.follow_up}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Journal Date Selector, Filters, and Journal Archive List */}
        <div className="lg:col-span-4 flex flex-col gap-space-md">
          {/* New Journal Trigger */}
          <div className="p-space-md bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm flex flex-col gap-2">
            {onNavigateToAutoGenerator && (
              <button
                type="button"
                onClick={onNavigateToAutoGenerator}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-700 text-white font-bold text-body-sm hover:from-emerald-800 hover:to-teal-800 shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span className="material-symbols-outlined text-xl">auto_awesome</span>
                <span>⚡ Buat Jurnal Otomatis</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setNewJournalModalOpen(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-primary text-white font-bold text-body-sm hover:bg-primary-container shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-xl">add_box</span>
              <span>+ Buat Jurnal Manual</span>
            </button>

            <div className="grid grid-cols-2 gap-2 mt-1">
              {onNavigateToCalendar && (
                <button
                  type="button"
                  onClick={onNavigateToCalendar}
                  className="py-2 px-3 rounded-xl bg-surface-container-low text-on-surface font-semibold text-xs hover:bg-surface-container transition-all flex items-center justify-center gap-1.5 border border-surface-container"
                >
                  <span className="material-symbols-outlined text-base text-primary">calendar_month</span>
                  <span>Lihat Kalender</span>
                </button>
              )}
              {onNavigateToReport && (
                <button
                  type="button"
                  onClick={onNavigateToReport}
                  className="py-2 px-3 rounded-xl bg-surface-container-low text-on-surface font-semibold text-xs hover:bg-surface-container transition-all flex items-center justify-center gap-1.5 border border-surface-container"
                >
                  <span className="material-symbols-outlined text-base text-emerald-700">print</span>
                  <span>Laporan Cetak</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Date Switcher & Search */}
          <div className="p-space-md bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm">
            <h3 className="font-headline-sm text-base font-bold text-primary mb-3 flex items-center justify-between">
              <span>Riwayat Jurnal Harian</span>
              <span className="text-xs font-normal text-on-surface-variant">
                {filteredJournals.length} Jurnal
              </span>
            </h3>

            {/* Search Input */}
            <div className="relative mb-3">
              <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-outline text-lg">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari uraian atau kegiatan..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface-container-low rounded-lg border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex flex-wrap gap-1 mb-3">
              {['ALL', 'Draft', 'Submitted', 'Approved'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                    statusFilter === st
                      ? 'bg-primary text-white'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {st === 'ALL' ? 'Semua' : st}
                </button>
              ))}
            </div>

            {/* Journal History Cards */}
            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {filteredJournals.map((j) => {
                const isSelected = j.journal_date === selectedJournalDate;
                return (
                  <button
                    key={j.id}
                    type="button"
                    onClick={() => setSelectedJournalDate(j.journal_date)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-primary-container text-white border-primary shadow-md'
                        : 'bg-surface-container-low hover:bg-surface-container border-surface-container text-on-surface'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-primary'}`}>
                        {new Date(j.journal_date).toLocaleDateString('id-ID', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : j.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : j.status === 'Submitted'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {j.status}
                      </span>
                    </div>

                    <p
                      className={`text-xs mt-1 line-clamp-2 ${
                        isSelected ? 'text-white/90' : 'text-on-surface-variant'
                      }`}
                    >
                      {j.daily_summary}
                    </p>

                    <div
                      className={`mt-2 flex items-center justify-between text-xs font-semibold pt-1 border-t ${
                        isSelected ? 'border-white/20 text-white/80' : 'border-surface-container text-secondary'
                      }`}
                    >
                      <span>{j.activities.length} Kegiatan</span>
                      <span>{formatHoursMinutes(j.total_duration_minutes)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Activity Modal */}
      <AddActivityModal
        isOpen={activityModalOpen}
        onClose={() => {
          setActivityModalOpen(false);
          setEditingActivity(null);
        }}
        onSave={handleSaveActivity}
        existingActivities={currentJournal?.activities || []}
        editingActivity={editingActivity}
      />

      {/* Submit Confirmation Modal */}
      {submitConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface-container-lowest max-w-md w-full rounded-2xl shadow-2xl border border-surface-container p-space-lg">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-2xl">lock</span>
            </div>
            <h3 className="font-headline-sm text-lg font-bold text-primary">
              Serahkan Jurnal ke Kepala Sekolah?
            </h3>
            <p className="text-body-sm text-on-surface-variant mt-2 leading-relaxed">
              Setelah diserahkan (Submitted), seluruh daftar kegiatan tanggal{' '}
              <strong>{selectedJournalDate}</strong> akan <strong>terkunci</strong> dan tidak dapat diubah
              atau dihapus oleh operator kecuali jika Kepala Sekolah meminta revisi.
            </p>
            <div className="mt-space-lg flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSubmitConfirmOpen(false)}
                className="px-4 py-2 rounded-lg bg-surface-container text-on-surface font-semibold text-body-sm"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSubmitJournal}
                className="px-4 py-2 rounded-lg bg-primary text-white font-semibold text-body-sm hover:bg-primary-container"
              >
                Ya, Kunci &amp; Serahkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create New Journal Modal */}
      {newJournalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface-container-lowest max-w-md w-full rounded-2xl shadow-2xl border border-surface-container p-space-lg">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <h3 className="font-headline-sm text-lg font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">edit_calendar</span>
                Buat Jurnal Harian Baru
              </h3>
              <button
                onClick={() => setNewJournalModalOpen(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateNewJournal} className="mt-space-md space-y-space-md">
              <div>
                <label className="block text-label-md font-semibold text-on-surface-variant mb-1">
                  Pilih Tanggal Kegiatan (Asia/Jakarta)
                </label>
                <input
                  type="date"
                  value={newJournalDate}
                  onChange={(e) => setNewJournalDate(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-surface-container text-body-sm font-semibold"
                  required
                />
              </div>
              <div>
                <label className="block text-label-md font-semibold text-on-surface-variant mb-1">
                  Ringkasan Agenda Hari Tersebut
                </label>
                <textarea
                  value={newJournalSummary}
                  onChange={(e) => setNewJournalSummary(e.target.value)}
                  rows={3}
                  placeholder="Contoh: Rapat koordinasi kurikulum, verval peserta didik, pencetakan berkas PIP..."
                  className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-surface-container text-body-sm"
                  required
                ></textarea>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setNewJournalModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-surface-container text-on-surface font-semibold text-body-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-white font-semibold text-body-sm hover:bg-primary-container"
                >
                  Buat Jurnal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


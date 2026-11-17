import React, { useState, useEffect } from 'react';
import { JournalActivity, JournalCategory, ActivityPriority, ActivityStatus } from '../../types/journal';
import { JOURNAL_CATEGORIES } from '../../data/mockJournals';

interface AddActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: Omit<JournalActivity, 'id' | 'daily_journal_id' | 'sort_order'>) => void;
  existingActivities: JournalActivity[];
  editingActivity?: JournalActivity | null;
}

export const AddActivityModal: React.FC<AddActivityModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingActivities,
  editingActivity
}) => {
  const [category, setCategory] = useState<JournalCategory>('Dapodik');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('09:00');
  const [calculatedDuration, setCalculatedDuration] = useState(60);
  const [result, setResult] = useState('');
  const [obstacle, setObstacle] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [priority, setPriority] = useState<ActivityPriority>('Sedang');
  const [status, setStatus] = useState<ActivityStatus>('Completed');
  const [collisionWarning, setCollisionWarning] = useState<string | null>(null);

  // Initialize form when opened or editing
  useEffect(() => {
    if (editingActivity) {
      setCategory(editingActivity.category);
      setTitle(editingActivity.activity_title);
      setDescription(editingActivity.description);
      setStartTime(editingActivity.start_time);
      setEndTime(editingActivity.end_time);
      setResult(editingActivity.result || '');
      setObstacle(editingActivity.obstacle || '');
      setFollowUp(editingActivity.follow_up || '');
      setPriority(editingActivity.priority);
      setStatus(editingActivity.status);
    } else {
      setCategory('Dapodik');
      setTitle('');
      setDescription('');
      setStartTime('08:00');
      setEndTime('09:00');
      setResult('');
      setObstacle('');
      setFollowUp('');
      setPriority('Sedang');
      setStatus('Completed');
    }
  }, [editingActivity, isOpen]);

  // Real-time automatic duration calculation and time collision detection
  useEffect(() => {
    if (!startTime || !endTime) return;

    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    const startTotal = startH * 60 + startM;
    const endTotal = endH * 60 + endM;

    if (endTotal > startTotal) {
      const diff = endTotal - startTotal;
      setCalculatedDuration(diff);

      // Check collision with existing activities (excluding currently edited activity)
      const collision = existingActivities.find((act) => {
        if (editingActivity && act.id === editingActivity.id) return false;
        const [aStartH, aStartM] = act.start_time.split(':').map(Number);
        const [aEndH, aEndM] = act.end_time.split(':').map(Number);
        const aStartTotal = aStartH * 60 + aStartM;
        const aEndTotal = aEndH * 60 + aEndM;

        // Overlap condition: start < other_end && end > other_start
        return startTotal < aEndTotal && endTotal > aStartTotal;
      });

      if (collision) {
        setCollisionWarning(`Perhatian: Jam ${startTime} - ${endTime} tumpang tindih dengan "${collision.activity_title}" (${collision.start_time} - ${collision.end_time}).`);
      } else {
        setCollisionWarning(null);
      }
    } else {
      setCalculatedDuration(0);
      setCollisionWarning('Waktu selesai harus lebih besar daripada waktu mulai.');
    }
  }, [startTime, endTime, existingActivities, editingActivity]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || calculatedDuration <= 0) return;

    onSave({
      category,
      activity_title: title.trim(),
      description: description.trim(),
      start_time: startTime,
      end_time: endTime,
      duration_minutes: calculatedDuration,
      result: result.trim(),
      obstacle: obstacle.trim(),
      follow_up: followUp.trim(),
      priority,
      status
    });

    onClose();
  };

  const formatHoursMinutes = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m} Menit`;
    if (m === 0) return `${h} Jam`;
    return `${h} Jam ${m} Menit`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-2xl border border-surface-container overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p- space-md sm:p-space-lg bg-surface-container-low border-b border-surface-container">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-2xl">
                {editingActivity ? 'edit_document' : 'post_add'}
              </span>
            </div>
            <div>
              <h3 className="font-headline-sm text-lg text-primary font-bold">
                {editingActivity ? 'Edit Kegiatan Jurnal OPS' : 'Tambah Kegiatan Jurnal Harian'}
              </h3>
              <p className="text-body-sm text-on-surface-variant">
                Catat rincian jam kerja, tugas, hasil kerja, dan kendala operasional
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-space-lg space-y-space-md overflow-y-auto flex-1">
          {/* Category & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
            <div className="sm:col-span-1">
              <label className="block text-label-md font-semibold text-on-surface-variant mb-1">
                Kategori Modul <span className="text-error">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as JournalCategory)}
                className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-surface-container text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
              >
                {JOURNAL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-label-md font-semibold text-on-surface-variant mb-1">
                Nama / Judul Kegiatan <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Sinkronisasi Dapodik / Verval Peserta Didik"
                className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-surface-container text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                required
              />
            </div>
          </div>

          {/* Time Picker & Automatic Duration Calculator */}
          <div className="p-space-md bg-surface-container-low rounded-xl border border-surface-container">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-label-md font-bold text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">schedule</span>
                Alokasi Waktu Kerja &amp; Perhitungan Durasi Otomatis
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                calculatedDuration > 0 ? 'bg-primary text-white' : 'bg-error-container text-error'
              }`}>
                {calculatedDuration > 0 ? `${calculatedDuration} Menit (${formatHoursMinutes(calculatedDuration)})` : 'Waktu Tidak Valid'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-1 font-medium">
                  Jam Mulai (WIB)
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-lowest rounded-lg border border-surface-container text-body-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              <div>
                <label className="block text-label-sm text-on-surface-variant mb-1 font-medium">
                  Jam Selesai (WIB)
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-lowest rounded-lg border border-surface-container text-body-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
            </div>

            {/* Collision warning banner */}
            {collisionWarning && (
              <div className="mt-3 p-2.5 rounded-lg bg-error-container/40 border border-error/30 text-error flex items-start gap-2 text-body-sm animate-fadeIn">
                <span className="material-symbols-outlined text-lg flex-shrink-0">warning</span>
                <span className="font-medium">{collisionWarning}</span>
              </div>
            )}
          </div>

          {/* Uraian Deskripsi */}
          <div>
            <label className="block text-label-md font-semibold text-on-surface-variant mb-1">
              Deskripsi Detail Tugas
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Jelaskan proses pelaksanaan pekerjaan secara spesifik..."
              className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-surface-container text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            ></textarea>
          </div>

          {/* Hasil & Output */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div>
              <label className="block text-label-md font-semibold text-on-surface-variant mb-1">
                Hasil / Output yang Dicapai
              </label>
              <textarea
                value={result}
                onChange={(e) => setResult(e.target.value)}
                rows={2}
                placeholder="Contoh: Berkas 14 siswa tervalidasi lengkap..."
                className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-surface-container text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-label-md font-semibold text-on-surface-variant mb-1">
                Kendala / Hambatan yang Ditemui
              </label>
              <textarea
                value={obstacle}
                onChange={(e) => setObstacle(e.target.value)}
                rows={2}
                placeholder="Contoh: Server verifikasi lambat atau berkas kurang..."
                className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-surface-container text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              ></textarea>
            </div>
          </div>

          {/* Tindak Lanjut & Prioritas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
            <div className="sm:col-span-1">
              <label className="block text-label-md font-semibold text-on-surface-variant mb-1">
                Prioritas
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as ActivityPriority)}
                className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-surface-container text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
              >
                <option value="Tinggi">Tinggi (Mendesak)</option>
                <option value="Sedang">Sedang (Rutin)</option>
                <option value="Rendah">Rendah</option>
              </select>
            </div>

            <div className="sm:col-span-1">
              <label className="block text-label-md font-semibold text-on-surface-variant mb-1">
                Status Aktivitas
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ActivityStatus)}
                className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-surface-container text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
              >
                <option value="Completed">Completed (Selesai)</option>
                <option value="In Progress">In Progress (Berjalan)</option>
                <option value="Pending">Pending (Tertunda)</option>
                <option value="Blocked">Blocked (Terkendala)</option>
              </select>
            </div>

            <div className="sm:col-span-1">
              <label className="block text-label-md font-semibold text-on-surface-variant mb-1">
                Rencana Tindak Lanjut
              </label>
              <input
                type="text"
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
                placeholder="Langkah berikutnya..."
                className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-surface-container text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-space-md flex items-center justify-end gap-3 border-t border-surface-container">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-surface-container text-on-surface font-semibold text-body-sm hover:bg-surface-container-high transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={calculatedDuration <= 0 || !title.trim()}
              className="px-5 py-2 rounded-lg bg-primary text-white font-semibold text-body-sm hover:bg-primary-container shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-lg">check_circle</span>
              <span>{editingActivity ? 'Simpan Perubahan' : 'Tambahkan ke Jurnal'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


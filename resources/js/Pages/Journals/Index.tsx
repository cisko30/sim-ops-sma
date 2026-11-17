import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../Components/Sidebar';
import { Header } from '../../Components/Header';

interface Activity {
  id?: number;
  category: string;
  activity_title: string;
  description: string;
  start_time: string;
  end_time: string;
  duration_minutes?: number;
  status: string;
  result?: string;
  obstacle?: string;
  follow_up?: string;
}

export const JournalPage: React.FC = () => {
  const [journalDate, setJournalDate] = useState(new Date().toISOString().split('T')[0]);
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 1,
      category: 'Dapodik',
      activity_title: 'Sinkronisasi Server Dapodikdasmen',
      description: 'Melakukan sinkronisasi data master GTK dan Rombel semester genap ke server pusat.',
      start_time: '08:00',
      end_time: '09:00',
      duration_minutes: 60,
      status: 'Completed',
      result: 'Sukses sinkronisasi tanpa kendala teknis.',
    },
    {
      id: 2,
      category: 'Kurikulum dan JTM',
      activity_title: 'Penyesuaian Jam Mengajar & Linieritas GTK',
      description: 'Pencocokan data jam mengajar guru sejarah dan ekuivalensi tugas tambahan.',
      start_time: '09:15',
      end_time: '11:00',
      duration_minutes: 105,
      status: 'Completed',
      result: 'Draft pembagian tugas tambahan selesai direkap.',
    },
    {
      id: 3,
      category: 'PIP',
      activity_title: 'Verifikasi Berkas KIP Digital & Kuasa Kolektif',
      description: 'Memvalidasi kelengkapan dokumen identitas siswa untuk pengajuan buku tabungan SimPel ke Bank BNI.',
      start_time: '11:15',
      end_time: '12:30',
      duration_minutes: 75,
      status: 'Completed',
      result: '14 berkas siswa tervalidasi dan siap cetak SPTJM.',
    },
    {
      id: 4,
      category: 'E-Arsip',
      activity_title: 'Penerbitan SK Kepala Sekolah Format Digital',
      description: 'Generate SK Pembagian Beban Tugas Mengajar dilengkapi validasi QR Code.',
      start_time: '13:30',
      end_time: '15:00',
      duration_minutes: 90,
      status: 'Completed',
      result: 'Dokumen tersimpan aman pada private storage.',
    }
  ]);

  const [form, setForm] = useState<Activity>({
    category: 'Dapodik',
    activity_title: '',
    description: '',
    start_time: '15:15',
    end_time: '16:00',
    status: 'Completed',
    result: '',
    obstacle: '',
    follow_up: '',
  });

  const [journalStatus, setJournalStatus] = useState<'Draft' | 'Submitted' | 'Approved'>('Submitted');
  const [toast, setToast] = useState<string | null>(null);

  const totalMinutes = activities.reduce((acc, curr) => acc + (curr.duration_minutes || 0), 0);

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.activity_title.trim()) return;

    // Hitung durasi otomatis
    let dur = 0;
    if (form.start_time && form.end_time) {
      const [sh, sm] = form.start_time.split(':').map(Number);
      const [eh, em] = form.end_time.split(':').map(Number);
      dur = (eh * 60 + em) - (sh * 60 + sm);
      if (dur <= 0) {
        alert("Waktu selesai harus lebih besar dari waktu mulai!");
        return;
      }
    }

    const newAct: Activity = {
      ...form,
      id: Date.now(),
      duration_minutes: dur,
    };

    setActivities([...activities, newAct]);
    setForm({
      category: 'Dapodik',
      activity_title: '',
      description: '',
      start_time: '',
      end_time: '',
      status: 'Completed',
      result: '',
      obstacle: '',
      follow_up: '',
    });
    setToast("Aktivitas berhasil ditambahkan ke jurnal.");
  };

  return (
    <div className="min-h-screen bg-background font-body-md text-on-surface antialiased flex flex-col">
      <Sidebar currentPath="jurnal-harian" isOpen={false} onClose={() => {}} />

      <div className="lg:pl-72 flex flex-col min-h-screen">
        <Header onToggleSidebar={() => {}} activeRole="OPS" onChangeRole={() => {}} />

        <main className="w-full pt-20 px-4 sm:px-6 lg:px-gutter-desktop flex-1 bg-background">
          <div className="flex flex-col w-full pb-space-xl max-w-7xl mx-auto space-y-space-lg">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-space-md">
              <div>
                <nav className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md mb-1">
                  <span>Jurnal Harian OPS</span>
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                  <span className="text-primary font-bold">Input &amp; Riwayat</span>
                </nav>
                <h1 className="font-headline-lg text-2xl sm:text-headline-lg text-primary tracking-tight font-bold">
                  Jurnal Harian Operasional Sekolah
                </h1>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Pencatatan akuntabilitas kerja harian Operator SIM Dapodik SMA Cipta Bangsa Mandiri
                </p>
              </div>

              <div className="flex items-center gap-space-sm">
                <button
                  onClick={() => alert("Mengunduh Laporan Harian resmi format PDF dengan kop sekolah dan tanda tangan...")}
                  className="px-4 py-2 rounded-lg bg-surface-container-lowest text-primary border border-surface-container font-headline-sm text-body-sm font-semibold shadow-sm hover:bg-surface-container-low transition-all flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
                  <span>Cetak PDF Laporan</span>
                </button>
                <button
                  onClick={() => {
                    setJournalStatus('Submitted');
                    setToast("Jurnal berhasil diajukan ke Kepala Sekolah untuk verifikasi.");
                  }}
                  className="px-5 py-2 rounded-lg bg-primary-container text-on-primary font-headline-sm text-body-sm font-semibold shadow-md hover:bg-primary transition-all flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-lg">send</span>
                  <span>Ajukan Verifikasi</span>
                </button>
              </div>
            </div>

            {/* Date & Summary Card */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-surface-container grid grid-cols-1 md:grid-cols-3 gap-space-md">
              <div>
                <label className="block font-label-md text-on-surface-variant mb-1 font-semibold">Tanggal Jurnal</label>
                <input
                  type="date"
                  value={journalDate}
                  onChange={(e) => setJournalDate(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-surface-container text-body-sm font-body-sm"
                />
              </div>
              <div>
                <label className="block font-label-md text-on-surface-variant mb-1 font-semibold">Total Durasi Tercatat</label>
                <div className="text-2xl font-bold text-primary flex items-baseline gap-2">
                  <span>{totalMinutes} Menit</span>
                  <span className="text-body-sm font-normal text-on-surface-variant">({(totalMinutes / 60).toFixed(1)} Jam)</span>
                </div>
              </div>
              <div>
                <label className="block font-label-md text-on-surface-variant mb-1 font-semibold">Status Jurnal</label>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-label-md">
                  <span className="material-symbols-outlined text-sm">verified</span>
                  {journalStatus}
                </span>
              </div>
            </div>

            {/* Activity List Table */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-surface-container space-y-space-md">
              <h3 className="font-headline-sm text-primary font-bold">Rincian Aktivitas Hari Ini</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-body-sm">
                  <thead className="bg-surface-container-low text-on-surface font-semibold border-b border-surface-container">
                    <tr>
                      <th className="p-3">Waktu</th>
                      <th className="p-3">Kategori</th>
                      <th className="p-3">Uraian Pekerjaan</th>
                      <th className="p-3">Durasi</th>
                      <th className="p-3">Hasil / Output</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container">
                    {activities.map((act) => (
                      <tr key={act.id} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="p-3 font-medium whitespace-nowrap text-secondary">{act.start_time} - {act.end_time}</td>
                        <td className="p-3 whitespace-nowrap"><span className="px-2 py-0.5 rounded bg-surface-container text-xs font-semibold">{act.category}</span></td>
                        <td className="p-3">
                          <div className="font-bold text-on-surface">{act.activity_title}</div>
                          <div className="text-on-surface-variant text-xs">{act.description}</div>
                        </td>
                        <td className="p-3 whitespace-nowrap">{act.duration_minutes} mnt</td>
                        <td className="p-3 text-xs text-on-surface-variant">{act.result || '-'}</td>
                        <td className="p-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">{act.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Add Activity Form */}
            <form onSubmit={handleAddActivity} className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-surface-container space-y-space-md">
              <h3 className="font-headline-sm text-primary font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">add_circle</span>
                Tambah Aktivitas Pekerjaan
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
                <div>
                  <label className="block font-label-md text-on-surface-variant mb-1 font-semibold">Kategori</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-surface-container text-body-sm"
                  >
                    <option value="Dapodik">Dapodik</option>
                    <option value="Data GTK">Data GTK</option>
                    <option value="Peserta Didik">Peserta Didik</option>
                    <option value="Kurikulum dan JTM">Kurikulum dan JTM</option>
                    <option value="PIP">PIP</option>
                    <option value="E-Arsip">E-Arsip</option>
                    <option value="Generator SK">Generator SK</option>
                  </select>
                </div>
                <div>
                  <label className="block font-label-md text-on-surface-variant mb-1 font-semibold">Jam Mulai</label>
                  <input
                    type="time"
                    value={form.start_time}
                    onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-surface-container text-body-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block font-label-md text-on-surface-variant mb-1 font-semibold">Jam Selesai</label>
                  <input
                    type="time"
                    value={form.end_time}
                    onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-surface-container text-body-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-md text-on-surface-variant mb-1 font-semibold">Judul Kegiatan</label>
                <input
                  type="text"
                  placeholder="Contoh: Verifikasi berkas akta kelahiran siswa mutasi masuk..."
                  value={form.activity_title}
                  onChange={(e) => setForm({ ...form, activity_title: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-surface-container text-body-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-label-md text-on-surface-variant mb-1 font-semibold">Deskripsi &amp; Hasil</label>
                <textarea
                  rows={3}
                  placeholder="Rincian proses dan hasil pekerjaan yang diperoleh..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-surface-container text-body-sm resize-none"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-primary text-on-primary font-headline-sm text-body-sm font-semibold shadow hover:bg-primary-container transition-all"
                >
                  Simpan Aktivitas
                </button>
              </div>
            </form>

          </div>
        </main>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-xl">
          <span>{toast}</span>
          <button onClick={() => setToast(null)} className="text-xs text-outline-variant">✕</button>
        </div>
      )}
    </div>
  );
};

export default JournalPage;


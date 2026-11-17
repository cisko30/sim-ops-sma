import { JournalCategory, ActivityPriority, ActivityStatus } from '../types/journal';

export interface PresetActivity {
  category: JournalCategory;
  activity_title: string;
  description: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  result: string;
  obstacle?: string;
  follow_up?: string;
  priority: ActivityPriority;
  status: ActivityStatus;
}

export interface JournalPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  defaultSummary: string;
  totalDurationMinutes: number;
  activities: PresetActivity[];
}

export const JOURNAL_PRESETS: JournalPreset[] = [
  {
    id: 'dapodik-verval',
    name: 'Rutinitas Sinkronisasi Dapodik & Verval PD',
    badge: 'Dapodik & Siswa',
    description: 'Paket lengkap pemutakhiran data semester, verifikasi NIK Dukcapil, dan penanganan residu.',
    defaultSummary: 'Menyelesaikan sinkronisasi berkala data Dapodikdasmen, verifikasi residu NIK siswa pada Verval PD, dan pencadangan database sekolah.',
    totalDurationMinutes: 330, // 5.5 Jam
    activities: [
      {
        category: 'Dapodik',
        activity_title: 'Sinkronisasi Data Pokok Pendidikan (Dapodikdasmen)',
        description: 'Melakukan validasi lokal dan pengiriman sinkronisasi data master GTK, rombel, dan sarpras ke server pusat.',
        start_time: '08:00',
        end_time: '09:30',
        duration_minutes: 90,
        result: 'Sinkronisasi berhasil 100% tanpa invalid data.',
        obstacle: 'Koneksi server pusat sempat antre 10 menit.',
        follow_up: 'Monitoring status kelulusan sync di portal Manajemen Dapodik.',
        priority: 'Tinggi',
        status: 'Completed'
      },
      {
        category: 'Peserta Didik',
        activity_title: 'Pemadanan NIK & Verifikasi Residu Peserta Didik',
        description: 'Pemeriksaan nomor KK dan NIK siswa baru pada portal vervalpd.data.kemdikbud.go.id.',
        start_time: '09:45',
        end_time: '11:30',
        duration_minutes: 105,
        result: '25 data residu NIK siswa terpadankan dengan catatan Disdukcapil.',
        follow_up: 'Menghubungi wali kelas untuk 3 siswa yang dokumen KK belum diperbarui.',
        priority: 'Tinggi',
        status: 'Completed'
      },
      {
        category: 'Administrasi Sekolah',
        activity_title: 'Pencetakan Berkas SPTJM & Pengarsipan Dokumen',
        description: 'Mencetak lembar SPTJM Dapodik untuk ditandatangani Kepala Sekolah dan diunggah ulang ke sistem.',
        start_time: '12:30',
        end_time: '14:00',
        duration_minutes: 90,
        result: 'SPTJM fisik dan digital tertandatangani rapi.',
        priority: 'Sedang',
        status: 'Completed'
      },
      {
        category: 'Pemeliharaan IT',
        activity_title: 'Pencadangan (Backup) Database & Server Sekolah',
        description: 'Menjalankan skrip backup otomatis database aplikasi operasional dan dokumen arsip digital.',
        start_time: '14:15',
        end_time: '15:00',
        duration_minutes: 45,
        result: 'File backup terkompresi tersimpan di penyimpanan sekunder lokal.',
        priority: 'Sedang',
        status: 'Completed'
      }
    ]
  },
  {
    id: 'pip-simpel',
    name: 'Pengelolaan & Verifikasi Program PIP SimPel',
    badge: 'Program PIP',
    description: 'Pemeriksaan status penerima bantuan PIP, verifikasi rekening SimPel BNI, dan surat kuasa kolektif.',
    defaultSummary: 'Verifikasi berkas persyaratan aktivasi rekening SimPel PIP 20 siswa, pencetakan surat kuasa kolektif Kepala Sekolah, dan koordinasi bank mitra.',
    totalDurationMinutes: 330, // 5.5 Jam
    activities: [
      {
        category: 'PIP',
        activity_title: 'Verifikasi Berkas Persyaratan Rekening SimPel BNI',
        description: 'Memeriksa fotokopi KK, KTP orang tua, dan surat keterangan aktif siswa calon penerima PIP.',
        start_time: '08:00',
        end_time: '10:00',
        duration_minutes: 120,
        result: '20 berkas siswa dinyatakan lengkap dan siap diajukan ke perbankan.',
        obstacle: '2 siswa belum melampirkan fotokopi KTP orang tua yang jelas.',
        follow_up: 'Follow up ke siswa bersangkutan saat jam istirahat.',
        priority: 'Tinggi',
        status: 'Completed'
      },
      {
        category: 'PIP',
        activity_title: 'Penyusunan Daftar Nominasi & Cetak Surat Kuasa Kolektif',
        description: 'Membuat rekap daftar nama siswa penerima PIP dan mencetak format surat kuasa kolektif sesuai format perbankan.',
        start_time: '10:15',
        end_time: '12:00',
        duration_minutes: 105,
        result: 'Dokumen SPTJM dan surat kuasa kolektif selesai dicetak dan diberi nomor surat.',
        priority: 'Tinggi',
        status: 'Completed'
      },
      {
        category: 'Koordinasi',
        activity_title: 'Koordinasi Penyerahan Dokumen ke Bank Penyalur',
        description: 'Menyerahkan berkas kuasa aktivasi kolektif ke bagian operasional Bank BNI Cabang Pembantu.',
        start_time: '13:00',
        end_time: '14:45',
        duration_minutes: 105,
        result: 'Berkas diterima oleh customer service bank untuk diproses buku rekening SimPel-nya.',
        priority: 'Sedang',
        status: 'Completed'
      }
    ]
  },
  {
    id: 'kurikulum-jtm',
    name: 'Manajemen Kurikulum, Distribusi JTM & Linieritas',
    badge: 'Kurikulum & GTK',
    description: 'Perhitungan beban jam mengajar mingguan guru, tugas tambahan, dan verifikasi linieritas sertifikasi.',
    defaultSummary: 'Audit beban jam mengajar (JTM) tatap muka semester berjalan, pemetaan ekuivalensi tugas tambahan, dan pengecekan Info GTK.',
    totalDurationMinutes: 345, // 5 Jam 45 Menit
    activities: [
      {
        category: 'Kurikulum dan JTM',
        activity_title: 'Audit Beban Jam Mengajar Tatap Muka (JTM) Guru',
        description: 'Mencocokkan alokasi jam mengajar mingguan pada struktur kurikulum dengan data riil pada jadwal pelajaran sekolah.',
        start_time: '08:00',
        end_time: '10:15',
        duration_minutes: 135,
        result: 'Semua guru mata pelajaran utama telah memenuhi ambang batas 24 JTM.',
        priority: 'Tinggi',
        status: 'Completed'
      },
      {
        category: 'Kurikulum dan JTM',
        activity_title: 'Pemetaan Ekuivalensi Beban Tugas Tambahan',
        description: 'Memvalidasi SK tugas tambahan (Waka, Kepala Laboratorium, Pembina Ekstrakurikuler, dan Guru Piket).',
        start_time: '10:30',
        end_time: '12:15',
        duration_minutes: 105,
        result: 'Ekuivalensi 12 jam waka dan pembina berhasil diinput ke sistem.',
        priority: 'Tinggi',
        status: 'Completed'
      },
      {
        category: 'Sertifikasi',
        activity_title: 'Pencocokan Kode Linieritas Sertifikasi di Info GTK',
        description: 'Mengecek kesesuaian sertifikat pendidik guru matematika, fisika, dan bahasa dengan mata pelajaran yang diampu.',
        start_time: '13:15',
        end_time: '15:00',
        duration_minutes: 105,
        result: 'Status Info GTK 6 guru sertifikasi berstatus "Valid" (centang hijau).',
        priority: 'Sedang',
        status: 'Completed'
      }
    ]
  },
  {
    id: 'tka-akademik',
    name: 'Pelaksanaan & Pengolahan Tes Kemampuan Akademik (TKA)',
    badge: 'TKA & Pemetaan',
    description: 'Penataan data peserta, penyiapan ruang CBT/naskah TKA untuk pemetaan peminatan akademik murid baru & berjalan sejak Juli.',
    defaultSummary: 'Penyiapan sistem tes kemampuan akademik (TKA), pendampingan sesi ujian pemetaan peminatan belajar, dan pengolahan skor akademik siswa.',
    totalDurationMinutes: 345, // 5 Jam 45 Menit
    activities: [
      {
        category: 'TKA',
        activity_title: 'Pendataan & Verifikasi Peserta TKA (Tes Kemampuan Akademik)',
        description: 'Sinkronisasi daftar siswa baru dan kelas XI/XII yang mengikuti asesmen pemetaan mata pelajaran pilihan Kurikulum Merdeka.',
        start_time: '08:00',
        end_time: '10:00',
        duration_minutes: 120,
        result: 'Data 160 siswa peserta TKA terverifikasi sesuai rombel dan mata uji peminatan.',
        priority: 'Tinggi',
        status: 'Completed'
      },
      {
        category: 'TKA',
        activity_title: 'Konfigurasi Aplikasi CBT & Distribusi Akun Login TKA',
        description: 'Pengaturan paket soal kemampuan skolastik & literasi-numerasi pada aplikasi CBT serta pembagian token sesi ujian.',
        start_time: '10:15',
        end_time: '12:30',
        duration_minutes: 135,
        result: 'Sesi 1 dan Sesi 2 TKA berjalan lancar tanpa kendala teknis jaringan.',
        priority: 'Tinggi',
        status: 'Completed'
      },
      {
        category: 'Kurikulum dan JTM',
        activity_title: 'Pengolahan Skor & Rekap Hasil TKA untuk Peminatan Belajar',
        description: 'Mengunduh log nilai tes, mengonversi skor per mata pelajaran, dan menyusun laporan pemetaan akademik untuk Waka Kurikulum.',
        start_time: '13:30',
        end_time: '15:00',
        duration_minutes: 90,
        result: 'Buku rekap skor TKA selesai disusun dan diserahkan ke tim kurikulum dan BK.',
        priority: 'Sedang',
        status: 'Completed'
      }
    ]
  },
  {
    id: 'abm-bakat-murid',
    name: 'Pengelolaan & Pelaksanaan Asesmen Bakat Murid (ABM)',
    badge: 'ABM Pusmendik',
    description: 'Pendataan peserta ABM kelas XII di web Pusmendik BSKAP, pengaturan sesi, cetak kartu, dan pelaksanaan tes bakat minat murid.',
    defaultSummary: 'Finalisasi data peserta ABM di portal Pusmendik, generate sesi dan ruang tes laboratorium, serta pendampingan ujian bakat minat kelas XII.',
    totalDurationMinutes: 360, // 6 Jam
    activities: [
      {
        category: 'ABM',
        activity_title: 'Pendataan Peserta ABM Kelas XII di Web Resmi Pusmendik',
        description: 'Pemeriksaan kelengkapan biodata, NISN, dan penetapan status keikutsertaan siswa kelas XII pada laman abm.pusmendik.kemdikbud.go.id.',
        start_time: '08:00',
        end_time: '10:15',
        duration_minutes: 135,
        result: '100% siswa kelas XII terdaftar valid sebagai peserta resmi ABM 2026.',
        priority: 'Tinggi',
        status: 'Completed'
      },
      {
        category: 'ABM',
        activity_title: 'Pengaturan Sesi, Ruang & Cetak Kartu Login Peserta ABM',
        description: 'Menetapkan jadwal gelombang sesi di laboratorium komputer, menugaskan proktor/teknisi, dan mencetak kartu peserta tes bakat murid.',
        start_time: '10:30',
        end_time: '12:45',
        duration_minutes: 135,
        result: 'Kartu login dan daftar hadir peserta ABM per sesi selesai dicetak.',
        priority: 'Tinggi',
        status: 'Completed'
      },
      {
        category: 'Koordinasi',
        activity_title: 'Pendampingan Teknis Pelaksanaan & Berita Acara ABM',
        description: 'Mengawasi berjalannya aplikasi ABM Pusmendik, mengunggah daftar hadir siswa, dan mengirim berita acara pelaksanaan tes.',
        start_time: '13:45',
        end_time: '15:15',
        duration_minutes: 90,
        result: 'Berita acara dan daftar hadir resmi ABM berhasil diunggah ke web Pusmendik.',
        priority: 'Sedang',
        status: 'Completed'
      }
    ]
  },
  {
    id: 'pdss-snbp',
    name: 'Pemutakhiran PDSS, Kuota SNBP & Ledger Nilai Sekolah',
    badge: 'Kelulusan & SNBP',
    description: 'Audit buku ledger nilai manual sekolah semester 1-5, verifikasi siswa eligible kuota SNBP, dan persiapan pengisian PDSS (tanpa e-Rapor).',
    defaultSummary: 'Rekapitulasi nilai rapor manual siswa kelas XII dari buku ledger sekolah, audit siswa eligible kuota akreditasi A (40%), dan koordinasi SNBP.',
    totalDurationMinutes: 330, // 5.5 Jam
    activities: [
      {
        category: 'PDSS/SNBP',
        activity_title: 'Audit Kelengkapan Buku Ledger Nilai Manual Semester 1 s.d. 5',
        description: 'Memeriksa rekapitulasi ledger nilai manual sekolah dari guru mata pelajaran dan wali kelas XII untuk keperluan pengisian pangkalan data.',
        start_time: '08:30',
        end_time: '11:00',
        duration_minutes: 150,
        result: 'Nilai ledger 120 siswa kelas XII terverifikasi lengkap sesuai buku induk nilai sekolah.',
        priority: 'Tinggi',
        status: 'Completed'
      },
      {
        category: 'PDSS/SNBP',
        activity_title: 'Pemeringkatan Siswa Eligible Kuota 40% Jalur Prestasi SNBP',
        description: 'Menghitung rata-rata nilai seluruh mapel pada buku ledger sesuai ketentuan SNPMB untuk menentukan daftar 48 siswa eligible.',
        start_time: '11:15',
        end_time: '12:45',
        duration_minutes: 90,
        result: 'Daftar 48 siswa eligible jalur prestasi SNBP berhasil disusun dan diverifikasi.',
        priority: 'Tinggi',
        status: 'Completed'
      },
      {
        category: 'Koordinasi',
        activity_title: 'Sosialisasi & Validasi Data Siswa Eligible Bersama Guru BK',
        description: 'Pemeriksaan kecocokan NISN, data asal jurusan, dan program studi pilihan siswa eligible bersama guru BK dan Kepala Sekolah.',
        start_time: '13:45',
        end_time: '15:15',
        duration_minutes: 90,
        result: 'Daftar siswa disetujui bersama dan diumumkan ke peserta didik.',
        priority: 'Sedang',
        status: 'Completed'
      }
    ]
  }
];

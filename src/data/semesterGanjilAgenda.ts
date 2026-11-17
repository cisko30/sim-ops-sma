export interface AgendaMilestone {
  date: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD for range
  title: string;
  category: 'Dapodik' | 'BOS' | 'TKA' | 'ABM' | 'GTK' | 'Rapor' | 'Umum';
  description: string;
  isDeadline?: boolean;
}

export interface SemesterMonthAgenda {
  monthIndex: number; // 6 = Juli, 7 = Agustus, 8 = September, 9 = Oktober, 10 = November, 11 = Desember
  monthName: string; // e.g. "Juli 2026"
  shortName: string; // "Juli"
  daysCount: number; // 31, 31, 30, 31, 30, 31
  badge: string;
  themeTitle: string;
  summary: string;
  milestones: AgendaMilestone[];
}

export const SEMESTER_GANJIL_AGENDA: SemesterMonthAgenda[] = [
  {
    monthIndex: 6,
    monthName: 'Juli 2026',
    shortName: 'Juli',
    daysCount: 31,
    badge: 'Awal Tahun Ajaran',
    themeTitle: 'Awal Tahun Ajaran Baru & Tarik Data',
    summary: 'Melakukan pembaruan aplikasi Dapodik versi terbaru, menarik data peserta didik baru (SPMB/PPDB), serta menaikkan kelas dan meluluskan siswa tingkat akhir.',
    milestones: [
      {
        date: '2026-07-05',
        endDate: '2026-07-12',
        title: 'Pembaruan Aplikasi Dapodik Versi Terbaru',
        category: 'Dapodik',
        description: 'Instalasi patch/installer versi terbaru Dapodikdasmen dan registrasi akun sekolah.'
      },
      {
        date: '2026-07-13',
        endDate: '2026-07-22',
        title: 'Tarik Data Peserta Didik Baru (SPMB / PPDB)',
        category: 'Dapodik',
        description: 'Penarikan data siswa baru dari laman SPMB/PPDB online serta penataan NISN pada Dapodik.'
      },
      {
        date: '2026-07-23',
        endDate: '2026-07-31',
        title: 'Kenaikan Kelas & Meluluskan Siswa Tingkat Akhir',
        category: 'Dapodik',
        description: 'Proses kenaikan kelas X ke XI, XI ke XII, dan status lulus siswa kelas XII angkatan sebelumnya.'
      }
    ]
  },
  {
    monthIndex: 7,
    monthName: 'Agustus 2026',
    shortName: 'Agustus',
    daysCount: 31,
    badge: 'Cut Off BOS',
    themeTitle: 'Cut Off BOS Tahap 2 & Verval',
    summary: 'Memperbarui data sarana prasarana, jam mengajar guru, dan rombel sebelum cut off BOS pada 31 Agustus, serta melakukan Verval PD dan Verval PTK.',
    milestones: [
      {
        date: '2026-08-01',
        endDate: '2026-08-15',
        title: 'Pembaruan Data Sarpras, Jam Mengajar & Rombel',
        category: 'Dapodik',
        description: 'Input ruang kelas, alat peraga, rombongan belajar, dan penugasan jadwal guru semester ganjil.'
      },
      {
        date: '2026-08-16',
        endDate: '2026-08-28',
        title: 'Verval PD & Verval PTK (Residu NIK)',
        category: 'Umum',
        description: 'Pembersihan residu NISN dan NIK siswa serta kelengkapan berkas nuptk/ijazah guru.'
      },
      {
        date: '2026-08-31',
        title: 'Cut Off BOS Tahap 2 (Batas Akhir)',
        category: 'BOS',
        description: 'Batas akhir sinkronisasi Dapodik untuk dasar penarikan pagu Dana BOS Reguler Tahap 2.',
        isDeadline: true
      }
    ]
  },
  {
    monthIndex: 8,
    monthName: 'September 2026',
    shortName: 'September',
    daysCount: 30,
    badge: 'Pendataan TKA',
    themeTitle: 'Asesmen & Pendataan TKA',
    summary: 'Menyiapkan infrastruktur dan peserta untuk asesmen jenjang SMA, sekaligus menyelesaikan pendaftaran dan cut off TKA tingkat akhir (hingga 27 September).',
    milestones: [
      {
        date: '2026-09-01',
        endDate: '2026-09-15',
        title: 'Penyiapan Infrastruktur Lab Komputer & CBT SMA',
        category: 'Umum',
        description: 'Pemeriksaan PC client, switch jaringan, bandwith internet, dan instalasi software ujian.'
      },
      {
        date: '2026-09-16',
        endDate: '2026-09-26',
        title: 'Pendaftaran & Verifikasi Peserta TKA',
        category: 'TKA',
        description: 'Pendataan dan sinkronisasi biodata siswa peserta Tes Kemampuan Akademik (TKA).'
      },
      {
        date: '2026-09-27',
        title: 'Cut Off Pendaftaran TKA Tingkat Akhir',
        category: 'TKA',
        description: 'Batas akhir pendaftaran dan penetapan nominasi peserta TKA jenjang SMA.',
        isDeadline: true
      }
    ]
  },
  {
    monthIndex: 9,
    monthName: 'Oktober 2026',
    shortName: 'Oktober',
    daysCount: 31,
    badge: 'TKA Utama & GTK',
    themeTitle: 'Validasi Info GTK & TKA Utama',
    summary: 'Memastikan validitas data GTK di Info GTK untuk penerbitan SKTP Semester 1, melaksanakan gladi bersih, serta mendampingi pelaksanaan TKA utama (26 Oktober – 8 November).',
    milestones: [
      {
        date: '2026-10-01',
        endDate: '2026-10-15',
        title: 'Validasi Info GTK untuk SKTP Semester 1',
        category: 'GTK',
        description: 'Pengecekan linieritas sertifikasi, beban 24 jam tatap muka, dan keaktifan rekening gaji pendidik.'
      },
      {
        date: '2026-10-16',
        endDate: '2026-10-24',
        title: 'Gladi Bersih Sistem & Laboratorium Ujian',
        category: 'Umum',
        description: 'Simulasi koneksi server CBT dan pengenalan alur ujian bagi proktor, teknisi, dan murid.'
      },
      {
        date: '2026-10-26',
        endDate: '2026-11-08',
        title: 'Pelaksanaan TKA Utama (26 Okt – 8 Nov)',
        category: 'TKA',
        description: 'Mendampingi pelaksanaan sesi tes kemampuan akademik utama bagi seluruh siswa yang terdaftar.',
        isDeadline: true
      }
    ]
  },
  {
    monthIndex: 10,
    monthName: 'November 2026',
    shortName: 'November',
    daysCount: 30,
    badge: 'ABM & TKA Susulan',
    themeTitle: 'TKA Susulan & Pelaksanaan ABM',
    summary: 'Mendampingi ujian susulan TKA (16 – 29 November), menyelesaikan cut off data peserta ABM kelas XI (15 November) dan uji coba serentak (17 November), serta mendampingi pelaksanaan ABM Tahap I (23 – 26 November) dan Tahap II (mulai 30 November).',
    milestones: [
      {
        date: '2026-11-15',
        title: 'Cut Off Data Peserta ABM Kelas XI',
        category: 'ABM',
        description: 'Batas akhir sinkronisasi data peserta Asesmen Bakat Murid (ABM) di portal resmi Pusmendik.',
        isDeadline: true
      },
      {
        date: '2026-11-16',
        endDate: '2026-11-29',
        title: 'Pelaksanaan Ujian Susulan TKA (16 – 29 Nov)',
        category: 'TKA',
        description: 'Mendampingi sesi susulan tes kemampuan akademik bagi murid yang berhalangan di sesi utama.'
      },
      {
        date: '2026-11-17',
        title: 'Uji Coba Serentak ABM Pusmendik',
        category: 'ABM',
        description: 'Uji coba gladi aplikasi ABM secara nasional dari server Pusmendik BSKAP.',
        isDeadline: true
      },
      {
        date: '2026-11-23',
        endDate: '2026-11-26',
        title: 'Pelaksanaan ABM Tahap I (23 – 26 Nov)',
        category: 'ABM',
        description: 'Pendampingan proktor & teknisi pelaksanaan tes Asesmen Bakat Murid gelombang I.'
      },
      {
        date: '2026-11-30',
        endDate: '2026-12-03',
        title: 'Pelaksanaan ABM Tahap II (Mulai 30 Nov)',
        category: 'ABM',
        description: 'Pendampingan pelaksanaan ABM gelombang II di laboratorium sekolah.'
      }
    ]
  },
  {
    monthIndex: 11,
    monthName: 'Desember 2026',
    shortName: 'Desember',
    daysCount: 31,
    badge: 'Hasil TKA & Rapor',
    themeTitle: 'ABM Lanjutan, Rapor & Hasil TKA',
    summary: 'Menyelesaikan ABM Tahap II (hingga 3 Desember) dan ABM Susulan (7 – 10 Desember), mendampingi pengisian ledger nilai rapor semester ganjil, mengunduh hasil TKA/SHTKA (23 Desember), dan memastikan sinkronisasi penuh Dapodik.',
    milestones: [
      {
        date: '2026-12-01',
        endDate: '2026-12-03',
        title: 'Penyelesaian ABM Tahap II',
        category: 'ABM',
        description: 'Finalisasi pelaksanaan gelombang II dan unggah berita acara ke portal Pusmendik.'
      },
      {
        date: '2026-12-07',
        endDate: '2026-12-10',
        title: 'Pelaksanaan ABM Susulan (7 – 10 Des)',
        category: 'ABM',
        description: 'Penyelenggaraan sesi susulan tes bakat murid bagi peserta sakit/izin.'
      },
      {
        date: '2026-12-11',
        endDate: '2026-12-20',
        title: 'Pendampingan Ledger Nilai Rapor Semester Ganjil',
        category: 'Rapor',
        description: 'Rekapitulasi dan audit kelengkapan nilai mata pelajaran dari dewan guru ke buku ledger.'
      },
      {
        date: '2026-12-23',
        title: 'Unduh Hasil TKA / SHTKA Resmi',
        category: 'TKA',
        description: 'Pengunduhan Sertifikat Hasil TKA (SHTKA) resmi dari portal penyelenggara.',
        isDeadline: true
      },
      {
        date: '2026-12-24',
        endDate: '2026-12-31',
        title: 'Sinkronisasi Penuh Akhir Semester Dapodik',
        category: 'Dapodik',
        description: 'Sinkronisasi final semester ganjil sebelum penutupan server periode berjalan.'
      }
    ]
  }
];


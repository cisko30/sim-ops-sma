export interface GTKItem {
  id: string;
  nama: string;
  nipNuptk: string;
  jenisPtk: string;
  statusKepegawaian: 'PNS' | 'GTY' | 'Honor Sekolah' | 'PPPK';
  mapelUtama: string;
  kodeSertifikasi?: string;
  jpPerRombel: number;
  jumlahRombel: number;
  rombelList: string[];
  jtmTatapMuka: number;
  jtmTugasTambahan: number;
  tugasTambahan?: string;
  tugasTambahanId?: string;
  totalJtm: number;
  statusInfoGtk: 'Valid' | 'Belum Valid' | 'Residu';
  sertifikasi: 'Sudah Sertifikasi' | 'Belum';
  telepon: string;
}

export interface DapodikTugasTambahan {
  id: string;
  nama: string;
  jam: number;
  keterangan: string;
  nomorRegulasi: string;
}

export const DAPODIK_TUGAS_TAMBAHAN_LIST: DapodikTugasTambahan[] = [
  { id: 'none', nama: 'Tidak Ada Tugas Tambahan (0 Jam)', jam: 0, keterangan: 'Hanya mengajar tatap muka reguler di kelas', nomorRegulasi: '-' },
  { id: 'waka_kurikulum', nama: 'Wakil Kepala Satuan Pendidikan Bidang Kurikulum (12 Jam)', jam: 12, keterangan: 'Ekuivalensi 12 Jam Tatap Muka (Diakui SK Resmi Kepala Sekolah)', nomorRegulasi: 'Kepmendikdasmen No. 221/P/2025' },
  { id: 'waka_kesiswaan', nama: 'Wakil Kepala Satuan Pendidikan Bidang Kesiswaan (12 Jam)', jam: 12, keterangan: 'Ekuivalensi 12 Jam Tatap Muka (Diakui SK Resmi Kepala Sekolah)', nomorRegulasi: 'Kepmendikdasmen No. 221/P/2025' },
  { id: 'waka_sarpras', nama: 'Wakil Kepala Satuan Pendidikan Bidang Sarpras / Humas (12 Jam)', jam: 12, keterangan: 'Ekuivalensi 12 Jam Tatap Muka (Diakui SK Resmi Kepala Sekolah)', nomorRegulasi: 'Kepmendikdasmen No. 221/P/2025' },
  { id: 'kepala_lab', nama: 'Kepala Laboratorium Komputer / IPA / Bahasa (12 Jam)', jam: 12, keterangan: 'Ekuivalensi 12 Jam Tatap Muka (Memiliki Sertifikat Kepala Lab)', nomorRegulasi: 'Kepmendikdasmen No. 221/P/2025' },
  { id: 'kepala_perpus', nama: 'Kepala Perpustakaan Sekolah (12 Jam)', jam: 12, keterangan: 'Ekuivalensi 12 Jam Tatap Muka (Memiliki Sertifikat Kepala Perpus)', nomorRegulasi: 'Kepmendikdasmen No. 221/P/2025' },
  { id: 'gpk_inklusi', nama: 'Guru Pembimbing Khusus (GPK Inklusi) (6 Jam)', jam: 6, keterangan: 'Ekuivalensi 6 Jam Tatap Muka untuk pendampingan ABK', nomorRegulasi: 'Kepmendikdasmen No. 221/P/2025' },
  { id: 'wali_kelas', nama: 'Wali Kelas (2 Jam)', jam: 2, keterangan: 'Ekuivalensi 2 Jam Tatap Muka per semester (1 rombel)', nomorRegulasi: 'Permendikdasmen No. 11 Th 2025' },
  { id: 'pembina_osis', nama: 'Pembina OSIS / MPK (2 Jam)', jam: 2, keterangan: 'Ekuivalensi 2 Jam Tatap Muka', nomorRegulasi: 'Kepmendikdasmen No. 221/P/2025' },
  { id: 'pembina_ekskul', nama: 'Pembina Pramuka Wajib / Ekstrakurikuler (2 Jam)', jam: 2, keterangan: 'Ekuivalensi 2 Jam Tatap Muka', nomorRegulasi: 'Kepmendikdasmen No. 221/P/2025' },
  { id: 'koordinator_tppk', nama: 'Koordinator TPPK (Tim Pencegahan Kekerasan) (2 Jam)', jam: 2, keterangan: 'Ekuivalensi 2 Jam Tatap Muka di Satuan Pendidikan', nomorRegulasi: 'Kepmendikdasmen No. 221/P/2025' },
  { id: 'koordinator_kombel', nama: 'Pengurus Komunitas Belajar (Kombel) / Tim Kurikulum (2 Jam)', jam: 2, keterangan: 'Ekuivalensi 2 Jam Tatap Muka pengembangan kinerja guru', nomorRegulasi: 'Kepmendikdasmen No. 221/P/2025' },
  { id: 'koordinator_p5_1', nama: 'Koordinator Projek P5 - 1 Rombel (2 Jam)', jam: 2, keterangan: 'Ekuivalensi 2 Jam Tatap Muka (1 rombel)', nomorRegulasi: 'Kepmendikdasmen No. 221/P/2025' },
  { id: 'koordinator_p5_2', nama: 'Koordinator Projek P5 - 2 Rombel (4 Jam)', jam: 4, keterangan: 'Ekuivalensi 4 Jam Tatap Muka (2 rombel)', nomorRegulasi: 'Kepmendikdasmen No. 221/P/2025' },
  { id: 'koordinator_p5_3', nama: 'Koordinator Projek P5 - 3 Rombel Maksimal (6 Jam)', jam: 6, keterangan: 'Ekuivalensi 6 Jam Tatap Muka (Maks 3 rombel diakui)', nomorRegulasi: 'Kepmendikdasmen No. 221/P/2025' },
  { id: 'koordinator_bkk', nama: 'Koordinator Bursa Kerja Khusus (BKK) / Kemitraan (2 Jam)', jam: 2, keterangan: 'Ekuivalensi 2 Jam Tatap Muka', nomorRegulasi: 'Kepmendikdasmen No. 221/P/2025' },
  { id: 'guru_piket', nama: 'Guru Piket Sekolah Harian (1 Jam)', jam: 1, keterangan: 'Ekuivalensi 1 Jam Tatap Muka', nomorRegulasi: 'Kepmendikdasmen No. 221/P/2025' }
];

export const DAFTAR_30_ROMBEL: string[] = [
  'X-1', 'X-2', 'X-3', 'X-4', 'X-5', 'X-6', 'X-7', 'X-8', 'X-9', 'X-10',
  'XI-1', 'XI-2', 'XI-3', 'XI-4', 'XI-5', 'XI-6', 'XI-7', 'XI-8', 'XI-9', 'XI-10',
  'XII-1', 'XII-2', 'XII-3', 'XII-4', 'XII-5', 'XII-6', 'XII-7', 'XII-8', 'XII-9', 'XII-10'
];

export interface SiswaItem {
  id: string;
  nisn: string;
  nipd: string;
  nama: string;
  rombel: string;
  jenisKelamin: 'L' | 'P';
  nikStatus: 'Valid' | 'Residu Dukcapil' | 'Perbaikan KK';
  pipStatus: 'Penerima Aktif' | 'Nominasi' | 'Bukan Penerima';
  nominalPip?: number;
  waliKelas: string;
}

export interface RombelItem {
  id: string;
  namaRombel: string;
  tingkat: 'X' | 'XI' | 'XII';
  kurikulum: 'Kurikulum Merdeka' | 'Kurikulum 2013';
  waliKelas: string;
  jumlahSiswaL: number;
  jumlahSiswaP: number;
  totalSiswa: number;
  ruang: string;
}

export interface QuickLinkItem {
  id: string;
  nama: string;
  singkatan?: string;
  kategori:
    | 'Pusdatin & Dapodik'
    | 'Asesmen & Ujian'
    | 'Kelulusan & SNBP'
    | 'GTK & Guru'
    | 'Bantuan & Keuangan'
    | 'Verifikasi & Ijazah';
  url: string;
  deskripsi: string;
  icon: string;
  badge: string;
  tags?: string[];
  iconBg?: string;
  badgeColor?: string;
  accentBorder?: string;
}

export interface ArsipItem {
  id: string;
  nomorSurat: string;
  judul: string;
  kategori: 'SK Kepala Sekolah' | 'SPTJM & Berita Acara' | 'Dokumen Akreditasi' | 'Ijazah & Nilai';
  tanggal: string;
  ukuranFile: string;
  format: 'PDF' | 'DOCX' | 'XLSX';
  pengunggah: string;
}

// 1. DATA MASTER GTK SMA NU KAPLONGAN
export const MOCK_GTK_LIST: GTKItem[] = [
  {
    id: 'gtk-1',
    nama: 'Drs. H. Toufik Zaenal Mustofa, M.Pd.I',
    nipNuptk: '196805121995121002',
    jenisPtk: 'Kepala Sekolah',
    statusKepegawaian: 'GTY',
    mapelUtama: 'Pendidikan Agama Islam',
    kodeSertifikasi: '127 - Pendidikan Agama Islam',
    jpPerRombel: 3,
    jumlahRombel: 2,
    rombelList: ['XII-1', 'XII-2'],
    jtmTatapMuka: 6,
    jtmTugasTambahan: 18,
    tugasTambahan: 'Kepala Sekolah',
    tugasTambahanId: 'kepala_sekolah',
    totalJtm: 24,
    statusInfoGtk: 'Valid',
    sertifikasi: 'Sudah Sertifikasi',
    telepon: '081223456789'
  },
  {
    id: 'gtk-2',
    nama: 'Ahmad Fauzi, S.Pd, M.Si',
    nipNuptk: '197903152006041011',
    jenisPtk: 'Guru Mapel',
    statusKepegawaian: 'GTY',
    mapelUtama: 'Matematika Tingkat Lanjut',
    kodeSertifikasi: '180 - Matematika',
    jpPerRombel: 4,
    jumlahRombel: 6,
    rombelList: ['X-1', 'X-2', 'X-3', 'XI-1', 'XI-2', 'XII-1'],
    jtmTatapMuka: 24,
    jtmTugasTambahan: 0,
    tugasTambahan: 'Tidak Ada',
    tugasTambahanId: 'none',
    totalJtm: 24,
    statusInfoGtk: 'Valid',
    sertifikasi: 'Sudah Sertifikasi',
    telepon: '081398765432'
  },
  {
    id: 'gtk-3',
    nama: 'Siti Nurhalizah, S.Pd',
    nipNuptk: '198507202009022005',
    jenisPtk: 'Guru Mapel',
    statusKepegawaian: 'GTY',
    mapelUtama: 'Bahasa Indonesia',
    kodeSertifikasi: '156 - Bahasa Indonesia',
    jpPerRombel: 4,
    jumlahRombel: 3,
    rombelList: ['X-1', 'X-2', 'X-3'],
    jtmTatapMuka: 12,
    jtmTugasTambahan: 12,
    tugasTambahan: 'Wakil Kepala Sekolah Bidang Kurikulum (12 Jam)',
    tugasTambahanId: 'waka_kurikulum',
    totalJtm: 24,
    statusInfoGtk: 'Valid',
    sertifikasi: 'Sudah Sertifikasi',
    telepon: '081234567890'
  },
  {
    id: 'gtk-4',
    nama: 'Moh. Ridwan, M.Pd',
    nipNuptk: '198711042010011014',
    jenisPtk: 'Guru Mapel',
    statusKepegawaian: 'GTY',
    mapelUtama: 'Fisika & Kimia',
    kodeSertifikasi: '184 - Fisika',
    jpPerRombel: 5,
    jumlahRombel: 3,
    rombelList: ['XI-1', 'XI-2', 'XII-1'],
    jtmTatapMuka: 15,
    jtmTugasTambahan: 12,
    tugasTambahan: 'Kepala Laboratorium Komputer & IPA (12 Jam)',
    tugasTambahanId: 'kepala_lab',
    totalJtm: 27,
    statusInfoGtk: 'Valid',
    sertifikasi: 'Sudah Sertifikasi',
    telepon: '085712349876'
  },
  {
    id: 'gtk-5',
    nama: 'Dra. Hj. Ratna Kurniati, M.Pd',
    nipNuptk: '197304192008012012',
    jenisPtk: 'Guru Mapel',
    statusKepegawaian: 'PNS',
    mapelUtama: 'Sejarah Indonesia',
    kodeSertifikasi: '204 - Sejarah',
    jpPerRombel: 2,
    jumlahRombel: 7,
    rombelList: ['X-1', 'X-2', 'X-3', 'X-4', 'X-5', 'XI-1', 'XI-2'],
    jtmTatapMuka: 14,
    jtmTugasTambahan: 0,
    tugasTambahan: 'Tidak Ada (0 Jam)',
    tugasTambahanId: 'none',
    totalJtm: 14,
    statusInfoGtk: 'Belum Valid',
    sertifikasi: 'Sudah Sertifikasi',
    telepon: '081322114455'
  },
  {
    id: 'gtk-6',
    nama: 'H. Abdul Ghofur, S.Ag',
    nipNuptk: '197509182005011007',
    jenisPtk: 'Guru Mapel',
    statusKepegawaian: 'GTY',
    mapelUtama: 'Pendidikan Agama Islam & Budi Pekerti',
    kodeSertifikasi: '127 - Pendidikan Agama Islam',
    jpPerRombel: 3,
    jumlahRombel: 8,
    rombelList: ['X-1', 'X-2', 'X-3', 'X-4', 'XI-1', 'XI-2', 'XII-1', 'XII-2'],
    jtmTatapMuka: 24,
    jtmTugasTambahan: 0,
    tugasTambahan: 'Tidak Ada (0 Jam)',
    tugasTambahanId: 'none',
    totalJtm: 24,
    statusInfoGtk: 'Valid',
    sertifikasi: 'Sudah Sertifikasi',
    telepon: '081211223344'
  },
  {
    id: 'gtk-7',
    nama: 'Dewi Sartika, S.Pd',
    nipNuptk: '199204122019032018',
    jenisPtk: 'Guru Mapel',
    statusKepegawaian: 'Honor Sekolah',
    mapelUtama: 'Bahasa Inggris',
    kodeSertifikasi: '157 - Bahasa Inggris',
    jpPerRombel: 2,
    jumlahRombel: 10,
    rombelList: ['X-1', 'X-2', 'X-3', 'X-4', 'X-5', 'X-6', 'X-7', 'X-8', 'X-9', 'X-10'],
    jtmTatapMuka: 20,
    jtmTugasTambahan: 4,
    tugasTambahan: 'Wali Kelas & Pembina Pramuka (4 Jam)',
    tugasTambahanId: 'wali_kelas',
    totalJtm: 24,
    statusInfoGtk: 'Valid',
    sertifikasi: 'Belum',
    telepon: '087812345678'
  },
  {
    id: 'gtk-8',
    nama: 'Drs. Budi Santoso',
    nipNuptk: '197108151998021003',
    jenisPtk: 'Guru Mapel',
    statusKepegawaian: 'PNS',
    mapelUtama: 'Pendidikan Jasmani & Olahraga (PJOK)',
    kodeSertifikasi: '220 - Penjaskes',
    jpPerRombel: 3,
    jumlahRombel: 7,
    rombelList: ['X-1', 'X-2', 'X-3', 'XI-1', 'XI-2', 'XII-1', 'XII-2'],
    jtmTatapMuka: 21,
    jtmTugasTambahan: 3,
    tugasTambahan: 'Pembina OSIS & Guru Piket (3 Jam)',
    tugasTambahanId: 'pembina_osis',
    totalJtm: 24,
    statusInfoGtk: 'Valid',
    sertifikasi: 'Sudah Sertifikasi',
    telepon: '081566778899'
  },
  {
    id: 'gtk-9',
    nama: 'Ika Wardani, S.Kom',
    nipNuptk: '199408252022032021',
    jenisPtk: 'Guru Mapel',
    statusKepegawaian: 'Honor Sekolah',
    mapelUtama: 'Informatika',
    kodeSertifikasi: '330 - Teknik Komputer & Informatika',
    jpPerRombel: 3,
    jumlahRombel: 6,
    rombelList: ['X-1', 'X-2', 'X-3', 'X-4', 'X-5', 'X-6'],
    jtmTatapMuka: 18,
    jtmTugasTambahan: 0,
    tugasTambahan: 'Tidak Ada (0 Jam)',
    tugasTambahanId: 'none',
    totalJtm: 18,
    statusInfoGtk: 'Belum Valid',
    sertifikasi: 'Belum',
    telepon: '089612345678'
  },
  {
    id: 'gtk-10',
    nama: 'Bagas Pratama, S.Kom',
    nipNuptk: '199104152020121008',
    jenisPtk: 'Tenaga Kependidikan',
    statusKepegawaian: 'GTY',
    mapelUtama: 'Operator Dapodik / SIM-OPS',
    kodeSertifikasi: 'Tendik Pengelola Data',
    jpPerRombel: 0,
    jumlahRombel: 0,
    rombelList: [],
    jtmTatapMuka: 0,
    jtmTugasTambahan: 37.5,
    tugasTambahan: 'Koordinator Operator Sekolah & Pengelola Data',
    tugasTambahanId: 'operator_sekolah',
    totalJtm: 37.5,
    statusInfoGtk: 'Valid',
    sertifikasi: 'Belum',
    telepon: '082199887766'
  }
];

// 2. DATA PESERTA DIDIK
export const MOCK_SISWA_LIST: SiswaItem[] = [
  {
    id: 'sis-1',
    nisn: '0078923412',
    nipd: '242510001',
    nama: 'Ahmad Zaki Mubarok',
    rombel: 'X-1',
    jenisKelamin: 'L',
    nikStatus: 'Valid',
    pipStatus: 'Penerima Aktif',
    nominalPip: 1800000,
    waliKelas: 'Abdul Aziz Mustofa'
  },
  {
    id: 'sis-2',
    nisn: '0081234901',
    nipd: '242510002',
    nama: 'Ananda Putri Khairunnisa',
    rombel: 'X-1',
    jenisKelamin: 'P',
    nikStatus: 'Valid',
    pipStatus: 'Penerima Aktif',
    nominalPip: 1800000,
    waliKelas: 'Abdul Aziz Mustofa'
  },
  {
    id: 'sis-3',
    nisn: '0076543219',
    nipd: '242510003',
    nama: 'Dimas Aditya Saputra',
    rombel: 'X-2',
    jenisKelamin: 'L',
    nikStatus: 'Residu Dukcapil',
    pipStatus: 'Nominasi',
    nominalPip: 1800000,
    waliKelas: 'Dewi Sartika, S.Pd'
  },
  {
    id: 'sis-4',
    nisn: '0065432187',
    nipd: '232411015',
    nama: 'Fatimah Az-Zahra',
    rombel: 'XI-1',
    jenisKelamin: 'P',
    nikStatus: 'Valid',
    pipStatus: 'Penerima Aktif',
    nominalPip: 1800000,
    waliKelas: 'Ahmad Fauzi, S.Pd'
  },
  {
    id: 'sis-5',
    nisn: '0069876543',
    nipd: '232411022',
    nama: 'Muhammad Rizky Ramadhan',
    rombel: 'XI-2',
    jenisKelamin: 'L',
    nikStatus: 'Perbaikan KK',
    pipStatus: 'Nominasi',
    nominalPip: 1800000,
    waliKelas: 'Moh. Ridwan, M.Pd'
  },
  {
    id: 'sis-6',
    nisn: '0054321980',
    nipd: '222312008',
    nama: 'Nabila Syahrani',
    rombel: 'XII-1',
    jenisKelamin: 'P',
    nikStatus: 'Valid',
    pipStatus: 'Penerima Aktif',
    nominalPip: 900000,
    waliKelas: 'H. Abdul Ghofur, S.Ag'
  },
  {
    id: 'sis-7',
    nisn: '0058765432',
    nipd: '222312019',
    nama: 'Wahyu Hidayat',
    rombel: 'XII-2',
    jenisKelamin: 'L',
    nikStatus: 'Valid',
    pipStatus: 'Bukan Penerima',
    waliKelas: 'Ika Wardani, S.Kom'
  }
];

// 3. DATA ROMBEL SMA NU KAPLONGAN
export const MOCK_ROMBEL_LIST: RombelItem[] = [
  {
    id: 'rom-1',
    namaRombel: 'X-1',
    tingkat: 'X',
    kurikulum: 'Kurikulum Merdeka',
    waliKelas: 'Abdul Aziz Mustofa',
    jumlahSiswaL: 16,
    jumlahSiswaP: 18,
    totalSiswa: 34,
    ruang: 'R. Teori 01'
  },
  {
    id: 'rom-2',
    namaRombel: 'X-2',
    tingkat: 'X',
    kurikulum: 'Kurikulum Merdeka',
    waliKelas: 'Dewi Sartika, S.Pd',
    jumlahSiswaL: 15,
    jumlahSiswaP: 19,
    totalSiswa: 34,
    ruang: 'R. Teori 02'
  },
  {
    id: 'rom-3',
    namaRombel: 'XI-1',
    tingkat: 'XI',
    kurikulum: 'Kurikulum Merdeka',
    waliKelas: 'Ahmad Fauzi, S.Pd, M.Si',
    jumlahSiswaL: 14,
    jumlahSiswaP: 20,
    totalSiswa: 34,
    ruang: 'R. Teori 03'
  },
  {
    id: 'rom-4',
    namaRombel: 'XI-2',
    tingkat: 'XI',
    kurikulum: 'Kurikulum Merdeka',
    waliKelas: 'Moh. Ridwan, M.Pd',
    jumlahSiswaL: 15,
    jumlahSiswaP: 18,
    totalSiswa: 33,
    ruang: 'R. Teori 04'
  },
  {
    id: 'rom-5',
    namaRombel: 'XII-1',
    tingkat: 'XII',
    kurikulum: 'Kurikulum Merdeka',
    waliKelas: 'H. Abdul Ghofur, S.Ag',
    jumlahSiswaL: 17,
    jumlahSiswaP: 18,
    totalSiswa: 35,
    ruang: 'R. Teori 05'
  },
  {
    id: 'rom-6',
    namaRombel: 'XII-2',
    tingkat: 'XII',
    kurikulum: 'Kurikulum Merdeka',
    waliKelas: 'Ika Wardani, S.Kom',
    jumlahSiswaL: 18,
    jumlahSiswaP: 17,
    totalSiswa: 35,
    ruang: 'R. Teori 06'
  }
];

// 4. QUICK LINKS PORTAL PUSAT KEMDIKBUD & PUSDATIN (18 PORTAL KEDINASAN OPERATOR SMA)
export const QUICK_LINKS_LIST: QuickLinkItem[] = [
  {
    id: 'ql-tka',
    nama: 'TKA Pusmendik (Tes Kemampuan Akademik)',
    singkatan: 'TKA Pusmendik',
    kategori: 'Asesmen & Ujian',
    url: 'https://tka.kemendikdasmen.go.id',
    deskripsi: 'Portal resmi pelaksanaan Tes Kemampuan Akademik (TKA) Pusmendik Kemendikdasmen untuk pemetaan capaian skolastik murid SMA.',
    icon: 'history_edu',
    badge: 'Pusmendik BSKAP',
    tags: ['TKA', 'Pusmendik', 'Asesmen', 'Akademik', 'Skolastik', 'Ujian'],
    iconBg: 'bg-gradient-to-br from-indigo-500 to-violet-700 text-white shadow-md shadow-indigo-500/25',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
    accentBorder: 'hover:border-indigo-400 group-hover:shadow-indigo-500/10'
  },
  {
    id: 'ql-abm',
    nama: 'ABM Pusmendik (Asesmen Bakat Murid)',
    singkatan: 'ABM Pusmendik',
    kategori: 'Asesmen & Ujian',
    url: 'https://dashboard-abm.bppp.kemendikdasmen.go.id/login',
    deskripsi: 'Portal Asesmen Bakat Murid (ABM) kelas XII: manajemen ruang lab, generate token client, cetak kartu sesi peserta, dan upload berita acara.',
    icon: 'psychology',
    badge: 'Kelas XII',
    tags: ['ABM', 'Pusmendik', 'Bakat Murid', 'Kelas XII', 'Asesmen', 'Laboratorium'],
    iconBg: 'bg-gradient-to-br from-cyan-500 to-teal-700 text-white shadow-md shadow-cyan-500/25',
    badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200/80',
    accentBorder: 'hover:border-cyan-400 group-hover:shadow-cyan-500/10'
  },
  {
    id: 'ql-pdss',
    nama: 'PDSS SNPMB (Pangkalan Data Sekolah & Siswa)',
    singkatan: 'PDSS SNBP',
    kategori: 'Kelulusan & SNBP',
    url: 'https://portal.snpmb.id/dashboard/index.html',
    deskripsi: 'Pengisian pangkalan data nilai rapor semester 1 s.d. 5 berdasarkan Buku Ledger Nilai Manual untuk penentuan 40% siswa eligible SNBP.',
    icon: 'school',
    badge: 'SNBP 40%',
    tags: ['PDSS', 'SNBP', 'SNPMB', 'PTN', 'Rapor', 'Ledger', 'Kelulusan'],
    iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/25',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200/80',
    accentBorder: 'hover:border-orange-400 group-hover:shadow-orange-500/10'
  },
  {
    id: 'ql-snpmb',
    nama: 'Portal SNPMB (Dashboard Resmi)',
    singkatan: 'Portal SNPMB',
    kategori: 'Kelulusan & SNBP',
    url: 'https://portal.snpmb.id/dashboard/index.html',
    deskripsi: 'Portal registrasi akun resmi sekolah dan siswa untuk Seleksi Nasional Penerimaan Mahasiswa Baru (SNBP & UTBK-SNBT).',
    icon: 'account_circle',
    badge: 'Akun Sekolah',
    tags: ['SNPMB', 'BPPP', 'Akun', 'Registrasi', 'SNBP', 'SNBT'],
    iconBg: 'bg-gradient-to-br from-blue-600 to-sky-600 text-white shadow-md shadow-blue-500/25',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/80',
    accentBorder: 'hover:border-blue-400 group-hover:shadow-blue-500/10'
  },
  {
    id: 'ql-dapo-sp',
    nama: 'Manajemen Dapodikdasmen (SP Datadik)',
    singkatan: 'SP Datadik',
    kategori: 'Pusdatin & Dapodik',
    url: 'https://sp.datadik.kemendikdasmen.go.id',
    deskripsi: 'Portal login SSO Manajemen Dapodik satuan pendidikan, tarik data mutasi peserta didik baru, approval akun GTK, dan cetak SPTJM resmi.',
    icon: 'sync_alt',
    badge: 'SSO Utama',
    tags: ['Dapodik', 'SP Datadik', 'Manajemen', 'Sinkronisasi', 'SPTJM', 'Mutasi'],
    iconBg: 'bg-gradient-to-br from-blue-700 to-indigo-900 text-white shadow-md shadow-blue-700/25',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200/80',
    accentBorder: 'hover:border-blue-500 group-hover:shadow-blue-600/10'
  },
  {
    id: 'ql-belajar-id',
    nama: 'Portal Akun Belajar.id (SSO Kemendikdasmen)',
    singkatan: 'Akun Belajar.id',
    kategori: 'Pusdatin & Dapodik',
    url: 'https://akun.belajar.id/sso/login?flow=bfe6b11e-913a-4e5c-a115-a9e74b5ab21b',
    deskripsi: 'Portal Single Sign-On (SSO) Akun Pembelajaran resmi Kemendikdasmen untuk PTK, GTK, dan siswa guna mengakses Platform Merdeka Mengajar (PMM), Google Workspace for Education, dan Chromebook.',
    icon: 'vpn_key',
    badge: 'SSO Belajar.id',
    tags: ['Belajar.id', 'Akun Pembelajaran', 'SSO', 'PMM', 'Google Workspace', 'GTK', 'Siswa'],
    iconBg: 'bg-gradient-to-br from-sky-500 to-blue-700 text-white shadow-md shadow-sky-500/25',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200/80',
    accentBorder: 'hover:border-sky-400 group-hover:shadow-sky-500/10'
  },
  {
    id: 'ql-verval-pd',
    nama: 'Verval PD (Peserta Didik & Dukcapil)',
    singkatan: 'Verval PD',
    kategori: 'Pusdatin & Dapodik',
    url: 'https://vervalpd.data.kemendikdasmen.go.id',
    deskripsi: 'Verifikasi & validasi identitas siswa, pemadanan NIK dengan Ditjen Dukcapil Kemendagri, perbaikan akta lahir, dan pembersihan residu NISN.',
    icon: 'verified',
    badge: 'Pemadanan NIK',
    tags: ['Verval PD', 'NISN', 'NIK', 'Dukcapil', 'Akta', 'Residu', 'Siswa'],
    iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-md shadow-emerald-500/25',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    accentBorder: 'hover:border-emerald-400 group-hover:shadow-emerald-500/10'
  },
  {
    id: 'ql-verval-ptk',
    nama: 'Verval PTK (Guru & Tenaga Kependidikan)',
    singkatan: 'Verval PTK',
    kategori: 'GTK & Guru',
    url: 'https://vervalptk.data.kemendikdasmen.go.id',
    deskripsi: 'Penerbitan NUPTK baru pendidik & tenaga kependidikan, perbaikan riwayat formal kepegawaian, verifikasi keabsahan ijazah S1/S2, dan data arsip.',
    icon: 'badge',
    badge: 'NUPTK & Ijazah',
    tags: ['Verval PTK', 'NUPTK', 'GTK', 'Guru', 'Tendik', 'Ijazah S1'],
    iconBg: 'bg-gradient-to-br from-purple-500 to-fuchsia-700 text-white shadow-md shadow-purple-500/25',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200/80',
    accentBorder: 'hover:border-purple-400 group-hover:shadow-purple-500/10'
  },
  {
    id: 'ql-info-gtk',
    nama: 'Info GTK (Puslapdik Kemendikdasmen)',
    singkatan: 'Info GTK',
    kategori: 'GTK & Guru',
    url: 'https://info.gtk.kemendikdasmen.go.id',
    deskripsi: 'Pengecekan validitas SKTP tunjangan profesi guru bersertifikasi, linieritas mata pelajaran, verifikasi syarat 24 JTM beban kerja, dan status NRG.',
    icon: 'workspace_premium',
    badge: 'Validasi SKTP',
    tags: ['Info GTK', 'SKTP', 'TPG', 'Sertifikasi', '24 JTM', 'Tunjangan', 'Guru'],
    iconBg: 'bg-gradient-to-br from-amber-500 to-yellow-600 text-white shadow-md shadow-amber-500/25',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200/80',
    accentBorder: 'hover:border-amber-400 group-hover:shadow-amber-500/10'
  },
  {
    id: 'ql-pip',
    nama: 'SiPintar PIP (Program Indonesia Pintar)',
    singkatan: 'SiPintar PIP',
    kategori: 'Bantuan & Keuangan',
    url: 'https://pip.kemendikdasmen.go.id',
    deskripsi: 'Monitoring daftar SK Nominasi & Pemberian PIP SMA, tracking aktivasi rekening SimPel Bank BNI, dan rekap surat kuasa pencairan kolektif.',
    icon: 'account_balance_wallet',
    badge: 'SimPel BNI',
    tags: ['PIP', 'SiPintar', 'Bantuan', 'KIP', 'BNI', 'SimPel', 'Beasiswa'],
    iconBg: 'bg-gradient-to-br from-rose-500 to-pink-700 text-white shadow-md shadow-rose-500/25',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200/80',
    accentBorder: 'hover:border-rose-400 group-hover:shadow-rose-500/10'
  },
  {
    id: 'ql-bos',
    nama: 'BOS Salur & ARKAS SMA',
    singkatan: 'BOS Salur',
    kategori: 'Bantuan & Keuangan',
    url: 'https://bos.kemendikdasmen.go.id',
    deskripsi: 'Konfirmasi penerimaan penyaluran dana BOSP Reguler SMA, rekonsiliasi belanja operasional sekolah, dan integrasi pelaporan ARKAS.',
    icon: 'payments',
    badge: 'Dana BOSP',
    tags: ['BOS', 'BOSP', 'ARKAS', 'Keuangan', 'Penyaluran', 'Kemenkeu'],
    iconBg: 'bg-gradient-to-br from-teal-500 to-emerald-700 text-white shadow-md shadow-teal-500/25',
    badgeColor: 'bg-teal-50 text-teal-800 border-teal-200/80',
    accentBorder: 'hover:border-teal-400 group-hover:shadow-teal-500/10'
  },
  {
    id: 'ql-simpkb',
    nama: 'SIMPKB (Portal PPG & Pelatihan GTK)',
    singkatan: 'SIMPKB',
    kategori: 'GTK & Guru',
    url: 'https://paspor-gtk.belajar.kemendikdasmen.go.id',
    deskripsi: 'Sistem Informasi Manajemen Pengembangan Keprofesian Berkelanjutan, seleksi akademik PPG Dalam Jabatan, Guru Penggerak, dan Diklat resmi.',
    icon: 'cast_for_education',
    badge: 'PPG & Diklat',
    tags: ['SIMPKB', 'PPG', 'Guru Penggerak', 'Diklat', 'Pelatihan', 'GTK'],
    iconBg: 'bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200/80',
    accentBorder: 'hover:border-sky-400 group-hover:shadow-sky-500/10'
  },
  {
    id: 'ql-biosma',
    nama: 'Bioportal AN & Asesmen Sekolah',
    singkatan: 'Bioportal',
    kategori: 'Asesmen & Ujian',
    url: 'https://bioportal.kemendikdasmen.go.id',
    deskripsi: 'Pendataan biodata Daftar Nominasi Sementara (DNS) dan Daftar Nominasi Tetap (DNT) siswa SMA untuk asesmen dan evaluasi capaian.',
    icon: 'fact_check',
    badge: 'DNT Siswa',
    tags: ['Bioportal', 'BioSMA', 'DNS', 'DNT', 'Peserta Ujian', 'Asesmen'],
    iconBg: 'bg-gradient-to-br from-emerald-600 to-teal-800 text-white shadow-md shadow-emerald-600/25',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    accentBorder: 'hover:border-emerald-500 group-hover:shadow-emerald-600/10'
  },
  {
    id: 'ql-verval-sp',
    nama: 'Verval SP (Satuan Pendidikan & Sarpras)',
    singkatan: 'Verval SP',
    kategori: 'Pusdatin & Dapodik',
    url: 'https://vervalsp.data.kemendikdasmen.go.id',
    deskripsi: 'Pembaruan identitas sekolah, titik koordinat geografis lintang/bujur, izin operasional yayasan/sekolah, nomor SK pendirian, dan legalitas tanah.',
    icon: 'domain',
    badge: 'NPSN & Izin',
    tags: ['Verval SP', 'NPSN', 'Izin Operasional', 'Koordinat', 'Sarpras', 'Legalitas'],
    iconBg: 'bg-gradient-to-br from-slate-600 to-slate-800 text-white shadow-md shadow-slate-600/25',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-200/80',
    accentBorder: 'hover:border-slate-400 group-hover:shadow-slate-500/10'
  },
  {
    id: 'ql-sivil',
    nama: 'Verifikasi Ijazah & Kelulusan Siswa',
    singkatan: 'Verval Ijazah',
    kategori: 'Verifikasi & Ijazah',
    url: 'https://ijazah.data.kemendikdasmen.go.id',
    deskripsi: 'Pengecekan keabsahan nomor seri ijazah nasional, verifikasi kelulusan siswa SMA, dan validasi nomor ijazah nasional (NIN).',
    icon: 'description',
    badge: 'Nomor Ijazah',
    tags: ['SIVIL', 'Ijazah', 'Kelulusan', 'Verifikasi', 'Alumni', 'NIN'],
    iconBg: 'bg-gradient-to-br from-stone-600 to-neutral-800 text-white shadow-md shadow-stone-600/25',
    badgeColor: 'bg-stone-100 text-stone-800 border-stone-200/80',
    accentBorder: 'hover:border-stone-400 group-hover:shadow-stone-500/10'
  },
  {
    id: 'ql-kip-kuliah',
    nama: 'KIP Kuliah (Beasiswa Perguruan Tinggi)',
    singkatan: 'KIP Kuliah',
    kategori: 'Kelulusan & SNBP',
    url: 'https://kip-kuliah.kemdiktisaintek.go.id',
    deskripsi: 'Pendampingan dan rekomendasi siswa eligible pemegang PIP/KIP SMA untuk mendapatkan pembiayaan kuliah gratis dan biaya hidup di PTN.',
    icon: 'military_tech',
    badge: 'Beasiswa PTN',
    tags: ['KIP Kuliah', 'Beasiswa', 'Kuliah', 'SNBP', 'SNBT', 'Bantuan Kuliah'],
    iconBg: 'bg-gradient-to-br from-orange-500 to-rose-600 text-white shadow-md shadow-orange-500/25',
    badgeColor: 'bg-orange-50 text-orange-700 border-orange-200/80',
    accentBorder: 'hover:border-orange-400 group-hover:shadow-orange-500/10'
  },
  {
    id: 'ql-sispena',
    nama: 'SISPENA BAN-PDM (Akreditasi Sekolah)',
    singkatan: 'SISPENA BAN-PDM',
    kategori: 'Pusdatin & Dapodik',
    url: 'https://apps.ban-pdm.id/sispena3/login',
    deskripsi: 'Sistem Penilaian Akreditasi Sekolah Menengah oleh BAN-PDM: unggah instrumen mutu manajerial, sarana prasarana, dan pemenuhan DIA.',
    icon: 'verified_user',
    badge: 'Akreditasi A',
    tags: ['SISPENA', 'BAN-PDM', 'Akreditasi', 'Mutu', 'Evaluasi Diri', 'Kemenag'],
    iconBg: 'bg-gradient-to-br from-violet-600 to-purple-800 text-white shadow-md shadow-violet-600/25',
    badgeColor: 'bg-violet-50 text-violet-800 border-violet-200/80',
    accentBorder: 'hover:border-violet-400 group-hover:shadow-violet-500/10'
  },
  {
    id: 'ql-sso',
    nama: 'SDM Data Pusdatin (Autentikasi Terpadu)',
    singkatan: 'SDM Pusdatin',
    kategori: 'Pusdatin & Dapodik',
    url: 'https://sdm.data.kemendikdasmen.go.id',
    deskripsi: 'Layanan autentikasi akun tunggal operator sekolah untuk akses login terintegrasi ke seluruh ekosistem Pusdatin Kemendikdasmen.',
    icon: 'key',
    badge: 'Single Sign-On',
    tags: ['SSO', 'SDM Data', 'Datadik', 'Akun Operator', 'Login', 'Autentikasi'],
    iconBg: 'bg-gradient-to-br from-blue-600 to-indigo-800 text-white shadow-md shadow-blue-600/25',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/80',
    accentBorder: 'hover:border-blue-400 group-hover:shadow-blue-600/10'
  },
  {
    id: 'ql-disdik-jabar',
    nama: 'Disdik Jawa Barat & Cadisdik Wilayah IX',
    singkatan: 'Disdik Jabar',
    kategori: 'Pusdatin & Dapodik',
    url: 'https://disdik.jabarprov.go.id',
    deskripsi: 'Portal resmi Dinas Pendidikan Provinsi Jawa Barat dan Kantor Cabang Dinas (KCD) Wilayah IX (Indramayu) pembina SMA NU Kaplongan.',
    icon: 'location_city',
    badge: 'Provinsi Jabar',
    tags: ['Disdik Jabar', 'KCD IX', 'Indramayu', 'Provinsi', 'Cadisdik', 'SMA'],
    iconBg: 'bg-gradient-to-br from-emerald-600 to-lime-600 text-white shadow-md shadow-emerald-600/25',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    accentBorder: 'hover:border-emerald-400 group-hover:shadow-emerald-500/10'
  }
];

// 5. E-ARSIP DIGITAL DOKUMEN SEKOLAH
export const MOCK_ARSIP_LIST: ArsipItem[] = [
  {
    id: 'ars-1',
    nomorSurat: '421.3/012/SMA-NU/VII/2026',
    judul: 'SK Pembagian Beban Tugas Mengajar & Tugas Tambahan Semester Ganjil 2026/2027',
    kategori: 'SK Kepala Sekolah',
    tanggal: '15 Juli 2026',
    ukuranFile: '1.8 MB',
    format: 'PDF',
    pengunggah: 'Bagas Pratama, S.Kom'
  },
  {
    id: 'ars-2',
    nomorSurat: 'SPTJM/20216007/2026-1',
    judul: 'Surat Pernyataan Tanggung Jawab Mutlak (SPTJM) Dapodik Semester Ganjil',
    kategori: 'SPTJM & Berita Acara',
    tanggal: '30 Agustus 2026',
    ukuranFile: '640 KB',
    format: 'PDF',
    pengunggah: 'Bagas Pratama, S.Kom'
  },
  {
    id: 'ars-3',
    nomorSurat: 'BAN-SM/SK/2023/SMA/004',
    judul: 'Sertifikat & SK Akreditasi Peringkat "A" SMA NU Kaplongan',
    kategori: 'Dokumen Akreditasi',
    tanggal: '10 Oktober 2023',
    ukuranFile: '2.4 MB',
    format: 'PDF',
    pengunggah: 'Unit Tata Usaha'
  },
  {
    id: 'ars-4',
    nomorSurat: '421.5/088/SMA-NU/XI/2026',
    judul: 'Berita Acara & Daftar Hadir Pelaksanaan Asesmen Bakat Murid (ABM) Tahap I',
    kategori: 'SPTJM & Berita Acara',
    tanggal: '26 November 2026',
    ukuranFile: '1.2 MB',
    format: 'PDF',
    pengunggah: 'Bagas Pratama, S.Kom'
  },
  {
    id: 'ars-5',
    nomorSurat: 'LEDGER/SMA-NU/2025-2',
    judul: 'Buku Ledger Nilai Manual Semester 1 s.d. 5 Siswa Angkatan 2024-2026 (Verifikasi PDSS)',
    kategori: 'Ijazah & Nilai',
    tanggal: '10 November 2026',
    ukuranFile: '4.5 MB',
    format: 'XLSX',
    pengunggah: 'Waka Kurikulum'
  }
];

export interface MapelItem {
  id: string;
  kodeMapel: string;
  namaMapel: string;
  kategori: 'Mata Pelajaran Wajib (Umum)' | 'Pilihan MIPA / Saintek' | 'Pilihan IPS / Soshum' | 'Pilihan Bahasa & Budaya' | 'Muatan Lokal & P5';
  fase: 'Fase E (Kelas X)' | 'Fase F (Kelas XI & XII)' | 'Semua Fase';
  alokasiJp: number;
  guruPengampu: string;
}

export const DEFAULT_MAPEL_LIST: MapelItem[] = [
  { id: 'mp-1', kodeMapel: 'MP-PAI-01', namaMapel: 'Pendidikan Agama Islam & Budi Pekerti', kategori: 'Mata Pelajaran Wajib (Umum)', fase: 'Semua Fase', alokasiJp: 3, guruPengampu: 'Drs. H. Toufik Zaenal Mustofa, M.Pd.I' },
  { id: 'mp-2', kodeMapel: 'MP-PKN-02', namaMapel: 'Pendidikan Pancasila & Kewarganegaraan', kategori: 'Mata Pelajaran Wajib (Umum)', fase: 'Semua Fase', alokasiJp: 2, guruPengampu: 'Guru PPKn' },
  { id: 'mp-3', kodeMapel: 'MP-BIN-03', namaMapel: 'Bahasa Indonesia', kategori: 'Mata Pelajaran Wajib (Umum)', fase: 'Semua Fase', alokasiJp: 4, guruPengampu: 'Siti Nurhalizah, S.Pd' },
  { id: 'mp-4', kodeMapel: 'MP-MTK-04', namaMapel: 'Matematika Umum', kategori: 'Mata Pelajaran Wajib (Umum)', fase: 'Semua Fase', alokasiJp: 4, guruPengampu: 'Ahmad Fauzi, S.Pd, M.Si' },
  { id: 'mp-5', kodeMapel: 'MP-BIG-05', namaMapel: 'Bahasa Inggris', kategori: 'Mata Pelajaran Wajib (Umum)', fase: 'Semua Fase', alokasiJp: 3, guruPengampu: 'Dewi Sartika, S.Pd' },
  { id: 'mp-6', kodeMapel: 'MP-PJK-06', namaMapel: 'Pendidikan Jasmani & Olahraga (PJOK)', kategori: 'Mata Pelajaran Wajib (Umum)', fase: 'Semua Fase', alokasiJp: 3, guruPengampu: 'Guru Penjaskes' },
  { id: 'mp-7', kodeMapel: 'MP-SEJ-07', namaMapel: 'Sejarah Indonesia', kategori: 'Mata Pelajaran Wajib (Umum)', fase: 'Semua Fase', alokasiJp: 2, guruPengampu: 'Dra. Hj. Ratna Kurniati, M.Pd' },
  { id: 'mp-8', kodeMapel: 'MP-INF-08', namaMapel: 'Informatika & Literasi Digital', kategori: 'Mata Pelajaran Wajib (Umum)', fase: 'Fase E (Kelas X)', alokasiJp: 3, guruPengampu: 'Ika Wardani, S.Kom' },
  { id: 'mp-9', kodeMapel: 'MP-FIS-09', namaMapel: 'Fisika Peminatan', kategori: 'Pilihan MIPA / Saintek', fase: 'Fase F (Kelas XI & XII)', alokasiJp: 5, guruPengampu: 'Moh. Ridwan, M.Pd' },
  { id: 'mp-10', kodeMapel: 'MP-KIM-10', namaMapel: 'Kimia Peminatan', kategori: 'Pilihan MIPA / Saintek', fase: 'Fase F (Kelas XI & XII)', alokasiJp: 5, guruPengampu: 'Guru Kimia' },
  { id: 'mp-11', kodeMapel: 'MP-BIO-11', namaMapel: 'Biologi Peminatan', kategori: 'Pilihan MIPA / Saintek', fase: 'Fase F (Kelas XI & XII)', alokasiJp: 5, guruPengampu: 'Guru Biologi' },
  { id: 'mp-12', kodeMapel: 'MP-MLT-12', namaMapel: 'Matematika Tingkat Lanjut', kategori: 'Pilihan MIPA / Saintek', fase: 'Fase F (Kelas XI & XII)', alokasiJp: 5, guruPengampu: 'Ahmad Fauzi, S.Pd, M.Si' },
  { id: 'mp-13', kodeMapel: 'MP-EKO-13', namaMapel: 'Ekonomi Peminatan', kategori: 'Pilihan IPS / Soshum', fase: 'Fase F (Kelas XI & XII)', alokasiJp: 5, guruPengampu: 'Guru IPS' },
  { id: 'mp-14', kodeMapel: 'MP-SOS-14', namaMapel: 'Sosiologi & Antropologi', kategori: 'Pilihan IPS / Soshum', fase: 'Fase F (Kelas XI & XII)', alokasiJp: 5, guruPengampu: 'Guru Sosiologi' },
  { id: 'mp-15', kodeMapel: 'MP-ASW-15', namaMapel: 'Ke-NU-an / Pendidikan Ahlussunnah wal Jamaah (Aswaja)', kategori: 'Muatan Lokal & P5', fase: 'Semua Fase', alokasiJp: 2, guruPengampu: 'H. Abdul Ghofur, S.Ag' },
  { id: 'mp-16', kodeMapel: 'MP-P5-16', namaMapel: 'Projek Penguatan Profil Pelajar Pancasila (P5)', kategori: 'Muatan Lokal & P5', fase: 'Semua Fase', alokasiJp: 6, guruPengampu: 'Tim Fasilitator P5' }
];

import { ActivityLog, OperationalDeadline, PIPStep, ResiduItem, SchoolInfo } from '../types';

export const SCHOOL_INFO: SchoolInfo = {
  name: "SIM-OPS SMA",
  schoolName: "SMA NU Kaplongan",
  institution: "Lembaga Pendidikan Ma'arif Nahdlatul Ulama",
  subdistrict: "Karangampel Kabupaten Indramayu",
  address: "Jl. Raya Kaplongan No. 28 Karangampel Kab. Indramayu",
  postalCode: "45283",
  phone: "(0234) 486009",
  email: "smanukplngn@gmail.com",
  website: "www.smanukaplongan.sch.id",
  npsn: "20216007",
  accreditation: "A",
  academicYear: "2026/2027 Semester Ganjil",
  dapodikStatus: "Online (Sinkron 4 jam lalu)",
  operatorName: "Bagas Pratama, S.Kom",
  operatorNip: "199104152020121008",
  operatorRole: "Koordinator Operator Sekolah (OPS)",
  operatorUnit: "Unit Tata Usaha & Operasional Sekolah",
  principalName: "Drs. H. Toufik Zaenal Mustofa, M.Pd.I",
  principalNip: "-",
  principalTitle: "Kepala SMA NU Kaplongan",
  logoUrl: "/logo-sma-nu.png",
  serverInfo: "Server Dapodikdasmen V.2025 (Terhubung & Aktif)"
};

export const DEADLINES: OperationalDeadline[] = [
  {
    id: "dl-1",
    month: "Feb",
    day: "18",
    title: "Batas Pengajuan Kuasa PIP",
    countdownTag: "H-4",
    isUrgent: true,
    description: "Penyerahan berkas SPTJM Kepala Sekolah ke BNI Cabang Kota."
  },
  {
    id: "dl-2",
    month: "Feb",
    day: "22",
    title: "Verifikasi Linieritas Info GTK",
    countdownTag: "H-8",
    isUrgent: false,
    description: "Pencocokan data jam mengajar dengan kode sertifikasi serdik pendidik."
  },
  {
    id: "dl-3",
    month: "Feb",
    day: "28",
    title: "Cut-Off Dapodik Tahap Awal",
    countdownTag: "H-14",
    isUrgent: false,
    description: "Penetapan kuota dana BOS Reguler Semester Genap tahun anggaran berjalan."
  }
];

export const ACTIVITIES: ActivityLog[] = [
  {
    id: "act-1",
    title: "Verifikasi Berkas KIP Digital",
    time: "10:15 WIB",
    description: "Validasi dokumen identitas siswa Ananda Putri (Kelas X-A) untuk pencairan PIP.",
    dotColor: "bg-primary"
  },
  {
    id: "act-2",
    title: "Update Pembagian JTM Guru",
    time: "09:40 WIB",
    description: "Penyesuaian jam mengajar mata pelajaran Bahasa Inggris Fase F kelas XI & XII.",
    dotColor: "bg-secondary"
  },
  {
    id: "act-3",
    title: "Sinkronisasi Server Dapodik",
    time: "08:30 WIB",
    description: "Sukses sinkronisasi data master GTK & Rombel ke Server Dapodikdasmen Pusat.",
    dotColor: "bg-tertiary-container"
  },
  {
    id: "act-4",
    title: "Generate SK Pembagian Beban",
    time: "Kemarin",
    description: "Penerbitan SK Kepala Sekolah No: 421.3/084/SMA-CB/2025 format digital terenkripsi.",
    dotColor: "bg-outline"
  }
];

export const PIP_STEPS: PIPStep[] = [
  {
    step: 1,
    label: "Tahap 1",
    count: 142,
    sublabel: "SK Nominasi Diterbitkan",
    statusNote: "100% Selesai",
    statusType: "success",
    icon: "description"
  },
  {
    step: 2,
    label: "Tahap 2",
    count: 114,
    sublabel: "Aktivasi Rekening Bank",
    statusNote: "28 Perlu Dampingan",
    statusType: "warning",
    icon: "credit_card"
  },
  {
    step: 3,
    label: "Tahap 3",
    count: 96,
    sublabel: "Dana Telah Cair",
    statusNote: "18 Dalam Proses Bank",
    statusType: "neutral",
    icon: "payments"
  },
  {
    step: 4,
    label: "Tahap 4",
    count: 88,
    sublabel: "Bukti Unggah Sistem",
    statusNote: "8 Berkas Belum Setor",
    statusType: "error",
    icon: "cloud_done"
  }
];

export const RESIDU_LIST: ResiduItem[] = [
  { id: "res-1", kategori: "Peserta Didik", nama: "Dimas Aditya (X-E)", keterangan: "NIK belum terverifikasi Dukcapil / Invalid", status: "Kritis" },
  { id: "res-2", kategori: "Peserta Didik", nama: "Naysilla Azzahra (XI-MIPA 2)", keterangan: "Tempat lahir tidak sinkron dengan Akta Kelahiran", status: "Perbaikan" },
  { id: "res-3", kategori: "Peserta Didik", nama: "Rizky Firmansyah (XII-IPS 1)", keterangan: "Nomor Kartu Keluarga (KK) 15 digit (kurang 1 digit)", status: "Kritis" },
  { id: "res-4", kategori: "GTK", nama: "Dra. Hj. Ratna", keterangan: "Beban mengajar 18 JTM (Kurang 6 JTM linier)", status: "Kritis" },
  { id: "res-5", kategori: "GTK", nama: "Budi Santoso, S.Pd", keterangan: "Rasio konseli BK belum mencapai 150 siswa", status: "Peringatan" },
  { id: "res-6", kategori: "GTK", nama: "Hendra, M.Pd", keterangan: "SK Pembagian Tugas Tambahan belum diunggah", status: "Perbaikan" },
  { id: "res-7", kategori: "Sarpras", nama: "Lab Komputer B", keterangan: "Data luas ruang dan kondisi lantai belum di-update", status: "Perbaikan" }
];


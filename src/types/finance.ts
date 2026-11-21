export type KategoriPosKeuangan =
  | 'Syahriyah / SPP Bulanan'
  | 'SPP Bulanan'
  | 'Tunggakan Tahun Lalu'
  | 'Daftar Ulang'
  | 'Tunggakan Lain-lain'
  | 'DSP / Uang Gedung'
  | 'Praktik & Ujian'
  | 'Seragam & Buku'
  | 'Lainnya';

export interface PembayaranItem {
  id: string;
  siswaId: string;
  nisn: string;
  nipd: string;
  nama: string;
  jenisKelamin?: 'L' | 'P';
  rombel: string;
  waliKelas: string;
  pipStatus: 'Penerima Aktif' | 'Nominasi' | 'Bukan Penerima';
  nominalPip: number;

  // 1. Tunggakan Tahun Lalu
  tagihanTahunLalu: number;
  terbayarTahunLalu: number;
  sisaTahunLalu: number;

  // 2. Daftar Ulang
  tagihanDaftarUlang: number;
  terbayarDaftarUlang: number;
  sisaDaftarUlang: number;

  // 3. Syahriyah / SPP Bulanan
  sppBulanan: number;
  bulanMenunggak: string[];
  totalTagihanSPP: number;
  totalTagihanSyahriyah: number;
  terbayarSyahriyah: number;
  sisaSyahriyah: number;

  // 4. Tunggakan Lain-lain
  tagihanLainLain: number;
  terbayarLainLain: number;
  sisaLainLain: number;

  // Kompatibilitas DSP & Ujian
  tagihanDSP: number;
  terbayarDSP: number;
  tagihanUjian: number;
  terbayarUjian: number;

  // Total Akumulasi
  totalTagihan: number;
  totalTerbayar: number;
  sisaTunggakan: number; // JUMLAH (sisaTahunLalu + sisaDaftarUlang + sisaSyahriyah + sisaLainLain)
  status: 'Lunas' | 'Mencicil' | 'Menunggak' | 'Keringanan';
  terakhirBayar?: string;
  catatan?: string;
}

export interface TransaksiKwitansi {
  id: string;
  nomorKwitansi: string;
  tanggal: string;
  siswaId: string;
  namaSiswa: string;
  nisn: string;
  rombel: string;
  kategori: KategoriPosKeuangan;
  bulanDibayar?: string[];
  jumlah: number;
  metode: 'Tunai Kasir' | 'Transfer Bank BNI' | 'Alokasi Dana PIP';
  keterangan: string;
  penerima: string;
}

export interface TarifKategori {
  rombel: string;
  sppPerBulan: number;
  daftarUlang: number;
  tunggakanTahunLaluDefault?: number;
  tunggakanLainLainDefault?: number;
  dspGedung: number;
  biayaUjian: number;
}

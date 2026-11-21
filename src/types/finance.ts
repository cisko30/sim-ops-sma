export interface PembayaranItem {
  id: string;
  siswaId: string;
  nisn: string;
  nipd: string;
  nama: string;
  rombel: string;
  waliKelas: string;
  pipStatus: 'Penerima Aktif' | 'Nominasi' | 'Bukan Penerima';
  nominalPip: number;
  sppBulanan: number;
  bulanMenunggak: string[];
  totalTagihanSPP: number;
  tagihanDSP: number;
  terbayarDSP: number;
  tagihanUjian: number;
  terbayarUjian: number;
  totalTagihan: number;
  totalTerbayar: number;
  sisaTunggakan: number;
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
  kategori: 'SPP Bulanan' | 'DSP / Uang Gedung' | 'Praktik & Ujian' | 'Seragam & Buku' | 'Lainnya';
  bulanDibayar?: string[];
  jumlah: number;
  metode: 'Tunai Kasir' | 'Transfer Bank BNI' | 'Alokasi Dana PIP';
  keterangan: string;
  penerima: string;
}

export interface TarifKategori {
  rombel: string;
  sppPerBulan: number;
  dspGedung: number;
  biayaUjian: number;
}

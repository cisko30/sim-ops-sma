import React, { useState, useMemo } from 'react';
import { SiswaItem, RombelItem } from '../../data/modulesData';
import { SchoolInfo } from '../../types';
import { PembayaranItem, TransaksiKwitansi, KategoriPosKeuangan } from '../../types/finance';

interface BendaharaKeuanganViewProps {
  subType: 'tunggakan-dan-spp' | 'riwayat-kwitansi-bayar' | 'rekap-surat-tunggakan';
  schoolInfo?: SchoolInfo;
  siswaList?: SiswaItem[];
  rombelList?: RombelItem[];
  transaksiList?: TransaksiKwitansi[];
  paymentOverrides?: Record<string, Partial<PembayaranItem>>;
  onUpdateTransaksi?: (items: TransaksiKwitansi[]) => void;
  onUpdateOverrides?: (overrides: Record<string, Partial<PembayaranItem>>) => void;
  isCloudSyncing?: boolean;
  cloudSyncedAt?: string | null;
  syncEngine?: 'supabase' | 'kv' | 'local';
  onManualSync?: () => void;
  onShowToast: (msg: string) => void;
  onNavigateToSiswa?: () => void;
  onAddActivity?: (title: string, desc: string) => void;
  activeRole?: 'OPS' | 'Kurikulum' | 'Kepsek' | 'Bendahara' | 'Wali Kelas';
}

const BULAN_SEMESTER_GANJIL = ['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

const SIKLUS_2_MINGGUAN = [
  { id: 'siklus-1', label: 'Siklus 1 (1 - 14 Juli 2026)', status: 'Selesai' },
  { id: 'siklus-2', label: 'Siklus 2 (15 - 31 Juli 2026)', status: 'Selesai' },
  { id: 'siklus-3', label: 'Siklus 3 (1 - 14 Agustus 2026)', status: 'Selesai' },
  { id: 'siklus-4', label: 'Siklus 4 (15 - 31 Agustus 2026)', status: 'Selesai' },
  { id: 'siklus-5', label: 'Siklus 5 (1 - 14 September 2026)', status: 'Selesai' },
  { id: 'siklus-6', label: 'Siklus 6 (15 - 30 September 2026)', status: 'Selesai' },
  { id: 'siklus-7', label: 'Siklus 7 (1 - 14 Oktober 2026)', status: 'Selesai' },
  { id: 'siklus-8', label: 'Siklus 8 (15 - 31 Oktober 2026)', status: 'Selesai' },
  { id: 'siklus-9', label: 'Siklus 9 (1 - 14 November 2026)', status: 'Selesai' },
  { id: 'siklus-10', label: 'Siklus 10 (15 - 30 November 2026)', status: 'Jadwal Aktif' },
  { id: 'siklus-11', label: 'Siklus 11 (1 - 14 Desember 2026)', status: 'Mendatang' },
  { id: 'siklus-12', label: 'Siklus 12 (15 - 31 Desember 2026)', status: 'Mendatang' }
];

// Helper to convert number to Indonesian words (Terbilang)
function terbilang(n: number): string {
  const bilangan = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];
  if (n < 12) return bilangan[n];
  if (n < 20) return terbilang(n - 10) + ' Belas';
  if (n < 100) return terbilang(Math.floor(n / 10)) + ' Puluh ' + terbilang(n % 10);
  if (n < 200) return 'Seratus ' + terbilang(n - 100);
  if (n < 1000) return terbilang(Math.floor(n / 100)) + ' Ratus ' + terbilang(n % 100);
  if (n < 2000) return 'Seribu ' + terbilang(n - 1000);
  if (n < 1000000) return terbilang(Math.floor(n / 1000)) + ' Ribu ' + terbilang(n % 1000);
  if (n < 1000000000) return terbilang(Math.floor(n / 1000000)) + ' Juta ' + terbilang(n % 1000000);
  return n.toString();
}

export const BendaharaKeuanganView: React.FC<BendaharaKeuanganViewProps> = ({
  subType,
  schoolInfo,
  siswaList = [],
  rombelList = [],
  transaksiList: propTransaksiList,
  paymentOverrides: propPaymentOverrides,
  onUpdateTransaksi,
  onUpdateOverrides,
  isCloudSyncing = false,
  cloudSyncedAt,
  syncEngine = 'local',
  onManualSync,
  onShowToast,
  onNavigateToSiswa,
  onAddActivity,
  activeRole = 'OPS'
}) => {
  const isWaliKelas = activeRole === 'Wali Kelas';

  // Stored state for payments and transactions (with prop fallback)
  const [localTransaksiList, setLocalTransaksiList] = useState<TransaksiKwitansi[]>(() => {
    try {
      const saved = localStorage.getItem('simops_keuangan_transaksi');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const transaksiList = propTransaksiList !== undefined ? propTransaksiList : localTransaksiList;

  const saveTransaksi = (items: TransaksiKwitansi[]) => {
    if (onUpdateTransaksi) {
      onUpdateTransaksi(items);
    } else {
      setLocalTransaksiList(items);
      try {
        localStorage.setItem('simops_keuangan_transaksi', JSON.stringify(items));
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Custom adjustments for payments (e.g. override payment records)
  const [localOverrides, setLocalOverrides] = useState<Record<string, Partial<PembayaranItem>>>(() => {
    try {
      const saved = localStorage.getItem('simops_keuangan_overrides');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {};
  });

  const paymentOverrides = propPaymentOverrides !== undefined ? propPaymentOverrides : localOverrides;

  const saveOverrides = (overrides: Record<string, Partial<PembayaranItem>>) => {
    if (onUpdateOverrides) {
      onUpdateOverrides(overrides);
    } else {
      setLocalOverrides(overrides);
      try {
        localStorage.setItem('simops_keuangan_overrides', JSON.stringify(overrides));
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Helper map from rombelList to resolve designated Wali Kelas name
  const rombelWaliMap = useMemo(() => {
    const map = new Map<string, string>();
    rombelList.forEach(r => {
      map.set(r.namaRombel, r.waliKelas);
      const cleanName = r.namaRombel.replace(/\s+/g, '-').replace('(', '').replace(')', '');
      map.set(cleanName, r.waliKelas);
    });
    return map;
  }, [rombelList]);

  // View presentation mode: 'ledger' (matching school Excel sheet) or 'compact' (financial overview)
  const [viewMode, setViewMode] = useState<'ledger' | 'compact'>('ledger');
  // Ledger period header (e.g. "SAMPAI AGUSTUS 2026")
  const [ledgerPeriode, setLedgerPeriode] = useState<string>('SAMPAI AGUSTUS 2026');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRombel, setSelectedRombel] = useState<string>('X-1');
  const [selectedStatus, setSelectedStatus] = useState('Semua');
  const [filterPipOnly, setFilterPipOnly] = useState(false);

  // Available Rombels from siswaList and rombelList
  const rombelOptions = useMemo(() => {
    const set = new Set<string>();
    siswaList.forEach(s => {
      if (s.rombel) set.add(s.rombel);
    });
    rombelList.forEach(r => {
      if (r.namaRombel) set.add(r.namaRombel);
    });
    // Default fallback rombels if list is clean
    if (set.size === 0) {
      ['X-1', 'X-2', 'XI-1', 'XI-2', 'XII-1', 'XII-2'].forEach(r => set.add(r));
    }
    return Array.from(set).sort();
  }, [siswaList, rombelList]);

  // Resolved Wali Kelas for the currently selected Rombel
  const activeWaliKelasName = useMemo(() => {
    if (selectedRombel === 'Semua') return 'Semua Wali Kelas';
    // 1. From rombelWaliMap
    if (rombelWaliMap.has(selectedRombel)) {
      return rombelWaliMap.get(selectedRombel)!;
    }
    // 2. From first matching student
    const matchedSiswa = siswaList.find(s => s.rombel === selectedRombel && s.waliKelas);
    if (matchedSiswa?.waliKelas) return matchedSiswa.waliKelas;

    // 3. Defaults based on school standards
    if (selectedRombel.includes('X-1') || selectedRombel.includes('X 1')) return 'ABDUL AZIZ MUSTOFA';
    if (selectedRombel.includes('X-2') || selectedRombel.includes('X 2')) return 'Dewi Sartika, S.Pd';
    if (selectedRombel.includes('XI-1') || selectedRombel.includes('XI 1')) return 'Ahmad Fauzi, S.Pd';
    if (selectedRombel.includes('XI-2') || selectedRombel.includes('XI 2')) return 'Moh. Ridwan, M.Pd';
    if (selectedRombel.includes('XII-1') || selectedRombel.includes('XII 1')) return 'H. Abdul Ghofur, S.Ag';
    if (selectedRombel.includes('XII-2') || selectedRombel.includes('XII 2')) return 'Ika Wardani, S.Kom';
    return 'Wali Kelas SMA NU Kaplongan';
  }, [selectedRombel, rombelWaliMap, siswaList]);

  // Generate dynamic student payment records with the 7 user requested columns
  const pembayaranList: PembayaranItem[] = useMemo(() => {
    return siswaList.map((siswa) => {
      const override = paymentOverrides[siswa.id] || {};

      // 1. Wali Kelas name
      const resolvedWali = override.waliKelas || siswa.waliKelas || rombelWaliMap.get(siswa.rombel) || (siswa.rombel.includes('X-1') || siswa.rombel.includes('X 1') ? 'ABDUL AZIZ MUSTOFA' : 'Wali Kelas');

      // 2. Tunggakan Tahun Lalu
      const defaultTagihanTahunLalu = siswa.rombel.includes('XI') ? 350000 : siswa.rombel.includes('XII') ? 500000 : 0;
      const tagihanTahunLalu = override.tagihanTahunLalu !== undefined ? override.tagihanTahunLalu : defaultTagihanTahunLalu;

      // 3. Daftar Ulang
      const defaultDaftarUlang = 450000;
      const tagihanDaftarUlang = override.tagihanDaftarUlang !== undefined ? override.tagihanDaftarUlang : defaultDaftarUlang;

      // 4. Syariah / SPP Bulanan (Juli - Desember = 6 Bulan)
      const sppPerBulan = override.sppBulanan !== undefined ? override.sppBulanan : 150000;
      const totalMonths = 6;
      const totalTagihanSyahriyah = totalMonths * sppPerBulan;

      // 5. Tunggakan Lain-lain
      const defaultLainLain = 200000;
      const tagihanLainLain = override.tagihanLainLain !== undefined ? override.tagihanLainLain : defaultLainLain;

      // Compute payments made from transaction log
      const studentTx = transaksiList.filter(t => t.siswaId === siswa.id || (t.nisn && t.nisn === siswa.nisn));

      // Payments per category
      const paidTahunLalu = studentTx
        .filter(t => t.kategori === 'Tunggakan Tahun Lalu')
        .reduce((acc, t) => acc + t.jumlah, 0) + (override.terbayarTahunLalu || 0);

      const paidDaftarUlang = studentTx
        .filter(t => t.kategori === 'Daftar Ulang' || t.kategori === 'DSP / Uang Gedung')
        .reduce((acc, t) => acc + t.jumlah, 0) + (override.terbayarDaftarUlang || 0);

      const paidSyahriyah = studentTx
        .filter(t => t.kategori === 'Syahriyah / SPP Bulanan' || t.kategori === 'SPP Bulanan')
        .reduce((acc, t) => acc + t.jumlah, 0) + (override.terbayarSyahriyah || 0);

      const paidLainLain = studentTx
        .filter(t => t.kategori === 'Tunggakan Lain-lain' || t.kategori === 'Praktik & Ujian' || t.kategori === 'Seragam & Buku' || t.kategori === 'Lainnya')
        .reduce((acc, t) => acc + t.jumlah, 0) + (override.terbayarLainLain || 0);

      // Remaining arrears per category
      const sisaTahunLalu = Math.max(0, tagihanTahunLalu - paidTahunLalu);
      const sisaDaftarUlang = Math.max(0, tagihanDaftarUlang - paidDaftarUlang);
      const sisaSyahriyah = Math.max(0, totalTagihanSyahriyah - paidSyahriyah);
      const sisaLainLain = Math.max(0, tagihanLainLain - paidLainLain);

      // Month breakdown
      const monthsPaidCount = Math.min(totalMonths, Math.floor(paidSyahriyah / sppPerBulan));
      const bulanMenunggak = BULAN_SEMESTER_GANJIL.slice(monthsPaidCount);

      // JUMLAH (Total Sisa Tunggakan)
      const sisaTunggakan = sisaTahunLalu + sisaDaftarUlang + sisaSyahriyah + sisaLainLain;
      const totalTagihan = tagihanTahunLalu + tagihanDaftarUlang + totalTagihanSyahriyah + tagihanLainLain;
      const totalTerbayar = paidTahunLalu + paidDaftarUlang + paidSyahriyah + paidLainLain;

      let status: 'Lunas' | 'Mencicil' | 'Menunggak' | 'Keringanan' = 'Menunggak';
      if (sisaTunggakan === 0) {
        status = 'Lunas';
      } else if (totalTerbayar > 0) {
        status = 'Mencicil';
      } else if (override.status) {
        status = override.status;
      }

      return {
        id: `pem-${siswa.id}`,
        siswaId: siswa.id,
        nisn: siswa.nisn,
        nipd: siswa.nipd,
        nama: siswa.nama,
        jenisKelamin: siswa.jenisKelamin || 'L',
        rombel: siswa.rombel,
        waliKelas: resolvedWali,
        pipStatus: siswa.pipStatus,
        nominalPip: siswa.nominalPip || (siswa.pipStatus === 'Penerima Aktif' ? 1800000 : 0),
        
        // 1. Tunggakan Tahun Lalu
        tagihanTahunLalu,
        terbayarTahunLalu: paidTahunLalu,
        sisaTahunLalu,

        // 2. Daftar Ulang
        tagihanDaftarUlang,
        terbayarDaftarUlang: paidDaftarUlang,
        sisaDaftarUlang,

        // 3. Syahriyah Bulanan
        sppBulanan: sppPerBulan,
        bulanMenunggak,
        totalTagihanSPP: totalTagihanSyahriyah,
        totalTagihanSyahriyah,
        terbayarSyahriyah: paidSyahriyah,
        sisaSyahriyah,

        // 4. Tunggakan Lain-lain
        tagihanLainLain,
        terbayarLainLain: paidLainLain,
        sisaLainLain,

        // DSP & Ujian compatibility
        tagihanDSP: tagihanDaftarUlang,
        terbayarDSP: paidDaftarUlang,
        tagihanUjian: tagihanLainLain,
        terbayarUjian: paidLainLain,

        // Totals
        totalTagihan,
        totalTerbayar,
        sisaTunggakan,
        status,
        terakhirBayar: studentTx.length > 0 ? studentTx[0].tanggal : override.terakhirBayar,
        catatan: override.catatan
      };
    });
  }, [siswaList, paymentOverrides, transaksiList, rombelWaliMap]);

  // Filtered List
  const filteredPembayaran = useMemo(() => {
    return pembayaranList.filter(item => {
      const matchSearch =
        item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nisn.includes(searchQuery) ||
        item.nipd.includes(searchQuery);

      const matchRombel = selectedRombel === 'Semua' || item.rombel === selectedRombel || item.rombel.replace(/\s+/g, '-') === selectedRombel.replace(/\s+/g, '-');
      const matchStatus = selectedStatus === 'Semua' || item.status === selectedStatus;
      const matchPip = !filterPipOnly || item.pipStatus === 'Penerima Aktif' || item.pipStatus === 'Nominasi';

      return matchSearch && matchRombel && matchStatus && matchPip;
    });
  }, [pembayaranList, searchQuery, selectedRombel, selectedStatus, filterPipOnly]);

  // Column totals for the current filtered list (Excel bottom totals row)
  const ledgerTotals = useMemo(() => {
    const totalTahunLalu = filteredPembayaran.reduce((acc, p) => acc + p.sisaTahunLalu, 0);
    const totalDaftarUlang = filteredPembayaran.reduce((acc, p) => acc + p.sisaDaftarUlang, 0);
    const totalSyahriyah = filteredPembayaran.reduce((acc, p) => acc + p.sisaSyahriyah, 0);
    const totalLainLain = filteredPembayaran.reduce((acc, p) => acc + p.sisaLainLain, 0);
    const totalJumlah = filteredPembayaran.reduce((acc, p) => acc + p.sisaTunggakan, 0);
    const totalSiswaMenunggak = filteredPembayaran.filter(p => p.sisaTunggakan > 0).length;

    return {
      totalTahunLalu,
      totalDaftarUlang,
      totalSyahriyah,
      totalLainLain,
      totalJumlah,
      totalSiswaMenunggak
    };
  }, [filteredPembayaran]);

  // Overall Financial Summary Metrics
  const summaryMetrics = useMemo(() => {
    const totalTagihanAll = pembayaranList.reduce((acc, p) => acc + p.totalTagihan, 0);
    const totalTerbayarAll = pembayaranList.reduce((acc, p) => acc + p.totalTerbayar, 0);
    const totalTunggakanAll = pembayaranList.reduce((acc, p) => acc + p.sisaTunggakan, 0);
    const siswaMenunggak = pembayaranList.filter(p => p.sisaTunggakan > 0);
    const siswaLunas = pembayaranList.filter(p => p.sisaTunggakan === 0);
    const menunggakDenganPip = siswaMenunggak.filter(p => p.pipStatus === 'Penerima Aktif');
    const totalDanaPipTersedia = menunggakDenganPip.reduce((acc, p) => acc + p.nominalPip, 0);

    return {
      totalTagihanAll,
      totalTerbayarAll,
      totalTunggakanAll,
      countMenunggak: siswaMenunggak.length,
      countLunas: siswaLunas.length,
      countMenunggakPip: menunggakDenganPip.length,
      totalDanaPipTersedia,
      pctLunas: totalTagihanAll > 0 ? Math.round((totalTerbayarAll / totalTagihanAll) * 100) : 0
    };
  }, [pembayaranList]);

  // Modal State for Payment Input
  const [selectedStudentForPay, setSelectedStudentForPay] = useState<PembayaranItem | null>(null);
  const [payKategori, setPayKategori] = useState<KategoriPosKeuangan>('Syahriyah / SPP Bulanan');
  const [payMonths, setPayMonths] = useState<string[]>([]);
  const [payAmount, setPayAmount] = useState<number>(150000);
  const [payMetode, setPayMetode] = useState<'Tunai Kasir' | 'Transfer Bank BNI' | 'Alokasi Dana PIP'>('Tunai Kasir');
  const [payCatatan, setPayCatatan] = useState('');

  // Modal State for Printing Letter, Receipt & Ledger
  const [selectedLetterItem, setSelectedLetterItem] = useState<PembayaranItem | null>(null);
  const [selectedReceiptItem, setSelectedReceiptItem] = useState<TransaksiKwitansi | null>(null);

  // Modal State for 2-Week Automated Notification Broadcast to Homeroom Teachers
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [broadcastTargetRombel, setBroadcastTargetRombel] = useState<string>('X-1');
  const [lastBroadcastDate, setLastBroadcastDate] = useState<string>(() => {
    try {
      return localStorage.getItem('simops_last_broadcast_wali') || '2026-11-15';
    } catch {
      return '2026-11-15';
    }
  });

  // Handle Opening Pay Modal (Disabled for Wali Kelas)
  const handleOpenPay = (student: PembayaranItem) => {
    if (isWaliKelas) {
      onShowToast("Perhatian: Wali Kelas hanya memiliki hak akses cek data (Read-Only). Pembayaran kasir dicatat oleh Bendahara.");
      return;
    }
    setSelectedStudentForPay(student);
    setPayKategori('Syahriyah / SPP Bulanan');
    const firstUnpaid = student.bulanMenunggak[0] || 'Juli';
    setPayMonths([firstUnpaid]);
    setPayAmount(student.sppBulanan);
    setPayMetode(student.pipStatus === 'Penerima Aktif' ? 'Alokasi Dana PIP' : 'Tunai Kasir');
    setPayCatatan(`Pembayaran Syahriyah/SPP Bulan ${firstUnpaid}`);
  };

  // Submit Payment
  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForPay) return;

    if (payAmount <= 0) {
      alert("Jumlah pembayaran harus lebih besar dari Rp 0.");
      return;
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    const receiptNo = `KW/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(Math.floor(1000 + Math.random() * 9000))}`;

    const newTx: TransaksiKwitansi = {
      id: `tx-${Date.now()}`,
      nomorKwitansi: receiptNo,
      tanggal: dateStr,
      siswaId: selectedStudentForPay.siswaId,
      namaSiswa: selectedStudentForPay.nama,
      nisn: selectedStudentForPay.nisn,
      rombel: selectedStudentForPay.rombel,
      kategori: payKategori,
      bulanDibayar: payKategori === 'Syahriyah / SPP Bulanan' || payKategori === 'SPP Bulanan' ? payMonths : undefined,
      jumlah: payAmount,
      metode: payMetode,
      keterangan: payCatatan || `Pembayaran ${payKategori}`,
      penerima: schoolInfo?.operatorName || 'Bendahara SMA NU Kaplongan'
    };

    saveTransaksi([newTx, ...transaksiList]);

    if (onAddActivity) {
      onAddActivity(
        `Pembayaran ${payKategori} Siswa`,
        `Diterima Rp ${payAmount.toLocaleString('id-ID')} via ${payMetode} dari ${selectedStudentForPay.nama} (${selectedStudentForPay.rombel}).`
      );
    }

    onShowToast(`Pembayaran Rp ${payAmount.toLocaleString('id-ID')} dari ${selectedStudentForPay.nama} berhasil dicatat! Kwitansi: ${receiptNo}`);
    setSelectedStudentForPay(null);
  };

  // Integration & Sync Modal State
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [syncModalTab, setSyncModalTab] = useState<'status' | 'ekspor' | 'impor' | 'tarif'>('status');

  // School Tariffs State
  const [tarifSpp, setTarifSpp] = useState<number>(150000);
  const [tarifDaftarUlang, setTarifDaftarUlang] = useState<number>(450000);
  const [tarifLainLain, setTarifLainLain] = useState<number>(200000);

  // Manual Sync with Bendahara & Cloud
  const handleSyncWithBendaharaApp = () => {
    if (onManualSync) {
      onManualSync();
    }
    if (onAddActivity) {
      onAddActivity(
        "Sinkronisasi Aplikasi Bendahara",
        `Sinkronisasi kasir & tunggakan ${siswaList.length} siswa dengan server cloud berhasil.`
      );
    }
    onShowToast("Sinkronisasi dengan server cloud & database operator berhasil dijalankan!");
  };

  // Export to BKU (Buku Kas Umum) Standar Bendahara Sekolah CSV
  const handleExportBKU = () => {
    if (transaksiList.length === 0) {
      onShowToast("Belum ada riwayat transaksi kasir untuk diekspor ke Buku Kas Umum (BKU).");
      return;
    }
    const headers = [
      'No',
      'Tanggal Transaksi',
      'No. Bukti / Kwitansi',
      'Kategori Pos',
      'Uraian Transaksi',
      'Penerimaan / Masuk (Rp)',
      'Pengeluaran / Keluar (Rp)',
      'Saldo Berjalan (Rp)',
      'Nama Siswa',
      'NISN',
      'Rombel',
      'Metode Bayar',
      'Petugas Kasir'
    ];

    let runningSaldo = 0;
    const sortedTx = [...transaksiList].sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());

    const rows = sortedTx.map((tx, idx) => {
      runningSaldo += tx.jumlah;
      return [
        idx + 1,
        `"${tx.tanggal}"`,
        `"${tx.nomorKwitansi}"`,
        `"${tx.kategori}"`,
        `"${tx.keterangan || 'Pembayaran ' + tx.kategori}"`,
        tx.jumlah,
        0,
        runningSaldo,
        `"${tx.namaSiswa}"`,
        `'${tx.nisn}`,
        `"${tx.rombel}"`,
        `"${tx.metode}"`,
        `"${tx.penerima}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BKU_Buku_Kas_Umum_SMA_NU_Kaplongan_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast("Buku Kas Umum (BKU) Standar Bendahara berhasil diunduh.");
  };

  // Export Complete Backup JSON
  const handleExportJSON = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      schoolName: schoolInfo?.schoolName || 'SMA NU Kaplongan',
      npsn: schoolInfo?.npsn || '20216007',
      totalSiswa: siswaList.length,
      totalTransaksi: transaksiList.length,
      totalKasMasuk: summaryMetrics.totalTerbayarAll,
      totalPiutang: summaryMetrics.totalTunggakanAll,
      transaksiList,
      paymentOverrides
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Database_Bendahara_SMA_NU_Kaplongan_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onShowToast("Cadangan database bendahara (JSON) berhasil diunduh.");
  };

  // Import CSV from External Bendahara App
  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        if (!text) return;

        const lines = text.split(/\r\n|\n/).filter(line => line.trim().length > 0);
        if (lines.length <= 1) {
          onShowToast("File CSV kosong atau tidak memiliki data baris.");
          return;
        }

        const headerLine = lines[0].toLowerCase();
        const headers = headerLine.split(',').map(h => h.replace(/["']/g, '').trim());

        const nisnIdx = headers.findIndex(h => h.includes('nisn'));
        const namaIdx = headers.findIndex(h => h.includes('nama'));
        const jumlahIdx = headers.findIndex(h => h.includes('jumlah') || h.includes('nominal') || h.includes('bayar') || h.includes('masuk'));
        const kategoriIdx = headers.findIndex(h => h.includes('kategori') || h.includes('pos'));
        const tanggalIdx = headers.findIndex(h => h.includes('tanggal') || h.includes('tgl'));
        const metodeIdx = headers.findIndex(h => h.includes('metode'));
        const ketIdx = headers.findIndex(h => h.includes('keterangan') || h.includes('uraian'));

        let importedCount = 0;
        const newTransactions: TransaksiKwitansi[] = [];

        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map(c => c.replace(/["']/g, '').trim());
          if (cols.length < 2) continue;

          const rawNisn = nisnIdx !== -1 ? cols[nisnIdx].replace(/['"]+/g, '') : '';
          const rawNama = namaIdx !== -1 ? cols[namaIdx] : '';
          const rawJumlah = jumlahIdx !== -1 ? parseInt(cols[jumlahIdx].replace(/[^0-9]/g, ''), 10) : 150000;
          const rawKategori = kategoriIdx !== -1 ? cols[kategoriIdx] : 'Syahriyah / SPP Bulanan';
          const rawTanggal = tanggalIdx !== -1 && cols[tanggalIdx] ? cols[tanggalIdx] : new Date().toISOString().slice(0, 10);
          const rawMetode = metodeIdx !== -1 && cols[metodeIdx] ? cols[metodeIdx] : 'Tunai Kasir';
          const rawKet = ketIdx !== -1 && cols[ketIdx] ? cols[ketIdx] : `Import dari Aplikasi Bendahara`;

          if (isNaN(rawJumlah) || rawJumlah <= 0) continue;

          const matchedSiswa = siswaList.find(s => 
            (rawNisn && s.nisn === rawNisn) || 
            (rawNama && s.nama.toLowerCase().includes(rawNama.toLowerCase()))
          );

          const studentId = matchedSiswa ? matchedSiswa.id : `ext-${Date.now()}-${i}`;
          const studentName = matchedSiswa ? matchedSiswa.nama : (rawNama || 'Siswa Terdaftar');
          const studentNisn = matchedSiswa ? matchedSiswa.nisn : (rawNisn || '0000000000');
          const studentRombel = matchedSiswa ? matchedSiswa.rombel : 'X-1';

          const validKategori: KategoriPosKeuangan = [
            'Syahriyah / SPP Bulanan',
            'SPP Bulanan',
            'Tunggakan Tahun Lalu',
            'Daftar Ulang',
            'Tunggakan Lain-lain',
            'DSP / Uang Gedung',
            'Praktik & Ujian',
            'Seragam & Buku',
            'Lainnya'
          ].includes(rawKategori as any)
            ? (rawKategori as any)
            : 'Syahriyah / SPP Bulanan';

          const validMetode = ['Tunai Kasir', 'Transfer Bank BNI', 'Alokasi Dana PIP'].includes(rawMetode)
            ? (rawMetode as any)
            : 'Tunai Kasir';

          const receiptNo = `KW/IMP/${new Date().getFullYear()}/${String(Date.now()).slice(-4)}${i}`;

          newTransactions.push({
            id: `tx-imp-${Date.now()}-${i}`,
            nomorKwitansi: receiptNo,
            tanggal: rawTanggal,
            siswaId: studentId,
            namaSiswa: studentName,
            nisn: studentNisn,
            rombel: studentRombel,
            kategori: validKategori,
            jumlah: rawJumlah,
            metode: validMetode,
            keterangan: rawKet,
            penerima: schoolInfo?.operatorName || 'Bendahara SMA NU Kaplongan'
          });

          importedCount++;
        }

        if (importedCount > 0) {
          saveTransaksi([...newTransactions, ...transaksiList]);
          if (onAddActivity) {
            onAddActivity(
              "Impor Berkas Aplikasi Bendahara",
              `Berhasil mengimpor ${importedCount} transaksi pembayaran dari berkas luar.`
            );
          }
          onShowToast(`Berhasil mengimpor ${importedCount} transaksi pembayaran dari aplikasi bendahara!`);
        } else {
          onShowToast("Tidak ada data transaksi yang berhasil diproses dari format file ini.");
        }
      } catch (err: any) {
        onShowToast(`Gagal membaca berkas CSV: ${err.message}`);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  // Apply Global Tariffs
  const handleApplyGlobalTarif = () => {
    if (isWaliKelas) {
      onShowToast("Wali Kelas tidak diizinkan mengubah tarif standar sekolah.");
      return;
    }
    const newOverrides: Record<string, Partial<PembayaranItem>> = { ...paymentOverrides };
    siswaList.forEach(s => {
      const prev = newOverrides[s.id] || {};
      newOverrides[s.id] = {
        ...prev,
        sppBulanan: tarifSpp,
        tagihanDaftarUlang: tarifDaftarUlang,
        tagihanLainLain: tarifLainLain
      };
    });
    saveOverrides(newOverrides);
    onShowToast("Tarif standar Syahriyah, Daftar Ulang, dan Lain-lain berhasil diterapkan ke seluruh peserta didik!");
  };

  // Export Filtered Table to CSV
  const handleExportCSV = () => {
    if (filteredPembayaran.length === 0) {
      alert("Tidak ada data untuk diekspor.");
      return;
    }
    const headers = ['No', 'Nama Siswa', 'JK', 'Kelas', 'Wali Kelas', 'Tahun Lalu', 'Daftar Ulang', 'Syahriyah (Jul-Des)', 'Lain-lain', 'Jumlah Tunggakan', 'Status PIP', 'Keterangan'];
    const rows = filteredPembayaran.map((item, index) => [
      index + 1,
      `"${item.nama}"`,
      item.jenisKelamin,
      `"${item.rombel}"`,
      `"${item.waliKelas}"`,
      item.sisaTahunLalu,
      item.sisaDaftarUlang,
      item.sisaSyahriyah,
      item.sisaLainLain,
      item.sisaTunggakan,
      `"${item.pipStatus}"`,
      `"${item.status}${item.pipStatus === 'Penerima Aktif' ? ' (PIP BNI Rp ' + item.nominalPip.toLocaleString('id-ID') + ')' : ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Buku_Ledger_Tunggakan_Siswa_${selectedRombel}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast("File rekapitulasi buku ledger tunggakan berhasil diunduh.");
  };

  // Target class data for the 2-week broadcast generator
  const broadcastStudents = useMemo(() => {
    return pembayaranList.filter(item => {
      if (broadcastTargetRombel === 'Semua') return true;
      return item.rombel === broadcastTargetRombel || item.rombel.replace(/\s+/g, '-') === broadcastTargetRombel.replace(/\s+/g, '-');
    });
  }, [pembayaranList, broadcastTargetRombel]);

  const targetWaliKelasName = useMemo(() => {
    if (broadcastTargetRombel === 'Semua') return 'Seluruh Bapak/Ibu Wali Kelas';
    return rombelWaliMap.get(broadcastTargetRombel) || activeWaliKelasName;
  }, [broadcastTargetRombel, rombelWaliMap, activeWaliKelasName]);

  // Generate automated 2-week reminder message text
  const generatedBroadcastText = useMemo(() => {
    const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const menunggakList = broadcastStudents.filter(s => s.sisaTunggakan > 0);
    const totalTunggakanKelas = menunggakList.reduce((acc, s) => acc + s.sisaTunggakan, 0);

    let text = `*PEMBERITAHUAN TUNGGAKAN SISWA (UPDATE BERKALA 2 MINGGUAN)*\n`;
    text += `*SMA NU KAPLONGAN INDRAMAYU*\n`;
    text += `Periode Pemantauan: ${today}\n`;
    text += `Target: Kelas ${broadcastTargetRombel} (Wali Kelas: ${targetWaliKelasName})\n\n`;
    text += `Assalamu'alaikum Warahmatullahi Wabarakatuh.\n`;
    text += `Yth. Bapak/Ibu Wali Kelas, berikut kami sampaikan rekapitulasi tunggakan administrasi keuangan peserta didik untuk pemantauan berkala dua mingguan:\n\n`;

    if (menunggakList.length === 0) {
      text += `Alhamdulillah, seluruh peserta didik di kelas ini telah LUNAS menyelesaikan kewajiban administrasi sekolah.\n\n`;
    } else {
      menunggakList.forEach((s, idx) => {
        text += `${idx + 1}. *${s.nama}* (${s.jenisKelamin})\n`;
        text += `   • Th. Lalu      : Rp ${s.sisaTahunLalu.toLocaleString('id-ID')}\n`;
        text += `   • Daftar Ulang  : Rp ${s.sisaDaftarUlang.toLocaleString('id-ID')}\n`;
        text += `   • Syahriyah/SPP : Rp ${s.sisaSyahriyah.toLocaleString('id-ID')}\n`;
        text += `   • Lain-lain     : Rp ${s.sisaLainLain.toLocaleString('id-ID')}\n`;
        text += `   👉 *TOTAL : Rp ${s.sisaTunggakan.toLocaleString('id-ID')}*`;
        if (s.pipStatus === 'Penerima Aktif') {
          text += ` _(Penerima PIP BNI Rp ${s.nominalPip.toLocaleString('id-ID')})_`;
        }
        text += `\n`;
      });

      text += `\n--------------------------------------------\n`;
      text += `*TOTAL TUNGGAKAN KELAS*: Rp ${totalTunggakanKelas.toLocaleString('id-ID')}\n`;
      text += `*Jumlah Siswa Menunggak*: ${menunggakList.length} dari ${broadcastStudents.length} Siswa\n\n`;
    }

    text += `Mohon bantuan Bapak/Ibu Wali Kelas untuk memantau dan memberikan bimbingan kepada peserta didik/wali murid yang bersangkutan.\n\n`;
    text += `Wassalamu'alaikum Warahmatullahi Wabarakatuh.\n`;
    text += `*Koordinator Operator & Bendahara SMA NU Kaplongan*`;

    return text;
  }, [broadcastStudents, broadcastTargetRombel, targetWaliKelasName]);

  const handleCopyBroadcastText = () => {
    navigator.clipboard.writeText(generatedBroadcastText);
    onShowToast("Teks update 2 mingguan berhasil disalin ke clipboard!");
  };

  const handleSendWhatsAppDirect = () => {
    const encoded = encodeURIComponent(generatedBroadcastText);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
    const todayStr = new Date().toISOString().slice(0, 10);
    setLastBroadcastDate(todayStr);
    try {
      localStorage.setItem('simops_last_broadcast_wali', todayStr);
    } catch (e) {
      console.error(e);
    }
    onShowToast("Membuka WhatsApp untuk mengirim informasi berkala...");
  };

  return (
    <div className="flex flex-col gap-5">
      {/* 1. NOTIFIKASI AKSES PERAN WALI KELAS (READ-ONLY) */}
      {isWaliKelas && (
        <div className="no-print p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-950/40 border-2 border-amber-500/30 dark:border-amber-500/40 flex items-start sm:items-center gap-3 text-amber-900 dark:text-amber-200">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-xl">assignment_ind</span>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-black flex items-center gap-2">
              <span>Mode Akses: Wali Kelas (Monitoring Tunggakan - Hak Akses Hanya Lihat / Read-Only)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 font-bold uppercase tracking-wider">
                Read-Only
              </span>
            </h4>
            <p className="text-xs text-amber-800/90 dark:text-amber-300 mt-0.5 leading-relaxed">
              Sebagai Wali Kelas, Anda berwenang mengecek rincian tunggakan siswa kelas binaan Anda, mencetak lembar buku ledger format sekolah A4, dan menyalin format pemberitahuan broadcast 2 mingguan. Fitur pencatatan kasir, pengubahan tarif, dan impor data kasir dikunci untuk Bendahara &amp; Operator.
            </p>
          </div>
        </div>
      )}

      {/* 2. BAR SIKLUS BROADCAST OTOMATIS 2 MINGGUAN KE WALI KELAS */}
      <div className="no-print print:hidden p-4 rounded-2xl bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-teal-500/10 border border-blue-500/20 dark:border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shrink-0">
            <span className="material-symbols-outlined text-xl">send_and_archive</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">
                Informasi Otomatis 2 Mingguan ke Wali Kelas
              </h4>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Siklus 10: 15 - 30 November 2026 (Aktif)</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Rutin tiap 2 minggu: Rekapitulasi tunggakan otomatis digenerate per kelas untuk dikirim ke Wali Kelas via WhatsApp &amp; cetak berkala. Terakhir diperbarui: <b>{lastBroadcastDate}</b>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setBroadcastTargetRombel(selectedRombel !== 'Semua' ? selectedRombel : 'X-1');
              setIsBroadcastModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
            title="Buka generator broadcast 2 mingguan ke Wali Kelas"
          >
            <span className="material-symbols-outlined text-base">campaign</span>
            <span>Broadcast 2 Mingguan</span>
          </button>

          {!isWaliKelas && (
            <button
              type="button"
              onClick={handleSyncWithBendaharaApp}
              disabled={isCloudSyncing}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
              title="Sinkronkan data kasir bendahara dengan database cloud & operator"
            >
              <span className={`material-symbols-outlined text-base ${isCloudSyncing ? 'animate-spin' : ''}`}>
                sync
              </span>
              <span>{isCloudSyncing ? 'Menyinkronkan...' : 'Singkronkan Database'}</span>
            </button>
          )}

          {!isWaliKelas && (
            <button
              type="button"
              onClick={() => setIsSyncModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
              title="Panel ekspor BKU dan tarif standar sekolah"
            >
              <span className="material-symbols-outlined text-base text-primary">hub</span>
              <span>Integrasi &amp; Ekspor BKU</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. FINANCIAL SUMMARY METRIC CARDS */}
      <div className="no-print print:hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-surface-container/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Tagihan Siswa</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-sky-300 flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">receipt</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
              Rp {summaryMetrics.totalTagihanAll.toLocaleString('id-ID')}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Dari <b>{pembayaranList.length}</b> siswa terdaftar
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-surface-container/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Kas Masuk (Lunas)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">payments</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              Rp {summaryMetrics.totalTerbayarAll.toLocaleString('id-ID')}
            </div>
            <div className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold mt-1">
              {summaryMetrics.pctLunas}% Terbayar
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-surface-container/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Sisa Tunggakan</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">trending_down</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
              Rp {summaryMetrics.totalTunggakanAll.toLocaleString('id-ID')}
            </div>
            <div className="text-xs text-rose-600 dark:text-rose-400 mt-1">
              <b>{summaryMetrics.countMenunggak}</b> Siswa memiliki tunggakan
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-surface-container/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Potensi Alokasi PIP</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">account_balance_wallet</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {summaryMetrics.countMenunggakPip} Siswa
            </div>
            <div className="text-xs text-amber-700 dark:text-amber-400 mt-1">
              Tersedia Rp {summaryMetrics.totalDanaPipTersedia.toLocaleString('id-ID')} BNI
            </div>
          </div>
        </div>
      </div>

      {/* 4. MAIN VIEW: BUKU LEDGER TUNGGAKAN SISWA SESUAI FOTO EXCEL SEKOLAH */}
      {subType === 'tunggakan-dan-spp' && (
        <div className="p-5 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-surface-container/80 dark:border-slate-800 shadow-xs space-y-4">
          
          {/* Top Control Bar: View Mode, Periode, Kelas, Wali Kelas & Print */}
          <div className="no-print flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setViewMode('ledger')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === 'ledger'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">table_view</span>
                  <span>Format Buku Ledger Sekolah</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('compact')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === 'compact'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">list_alt</span>
                  <span>Tabel Ringkasan Kasir</span>
                </button>
              </div>

              {/* Periode Selector (Header Buku Ledger) */}
              <div className="flex items-center gap-1 text-xs">
                <span className="text-slate-500 font-medium">Periode:</span>
                <select
                  value={ledgerPeriode}
                  onChange={(e) => setLedgerPeriode(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="SAMPAI AGUSTUS 2026">SAMPAI AGUSTUS 2026</option>
                  <option value="SAMPAI SEPTEMBER 2026">SAMPAI SEPTEMBER 2026</option>
                  <option value="SAMPAI OKTOBER 2026">SAMPAI OKTOBER 2026</option>
                  <option value="SAMPAI NOVEMBER 2026">SAMPAI NOVEMBER 2026</option>
                  <option value="SAMPAI DESEMBER 2026">SAMPAI DESEMBER 2026</option>
                  <option value="SEMESTER GANJIL 2026/2027">SEMESTER GANJIL 2026/2027</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleExportCSV}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm text-emerald-600">download</span>
                <span>Ekspor CSV</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                title="Cetak lembar buku ledger format A4 resmi"
              >
                <span className="material-symbols-outlined text-sm">print</span>
                <span>Cetak Lembar A4</span>
              </button>
            </div>
          </div>

          {/* Filtering Toolbar */}
          <div className="no-print flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama siswa, NISN, atau NIPD..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Kelas / Perkelas Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-bold">Kelas:</span>
                <select
                  value={selectedRombel}
                  onChange={(e) => setSelectedRombel(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-200 focus:outline-none"
                >
                  <option value="Semua">Semua Kelas</option>
                  {rombelOptions.map((r) => (
                    <option key={r} value={r}>Kelas {r}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Status:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Menunggak">Menunggak</option>
                  <option value="Mencicil">Mencicil</option>
                  <option value="Lunas">Lunas</option>
                </select>
              </div>

              {/* Filter PIP Only Toggle */}
              <button
                type="button"
                onClick={() => setFilterPipOnly(!filterPipOnly)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                  filterPipOnly
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
                <span>Penerima PIP</span>
              </button>
            </div>
          </div>

          {/* PRINT-ONLY OFFICIAL KOP SURAT (SESUAI ATURAN GEMINI.md) */}
          <div className="hidden print:block pb-4 mb-3 border-b-4 border-double border-slate-900 text-center">
            <div className="flex items-center justify-center gap-4">
              <img src="/logo-sma-nu.png?v=3" alt="Logo SMA NU Kaplongan" className="w-20 h-20 object-contain" />
              <div className="text-center">
                <h4 className="text-xs uppercase font-bold tracking-widest text-slate-800">
                  LEMBAGA PENDIDIKAN MA'ARIF NAHDLATUL ULAMA
                </h4>
                <h2 className="text-xl font-black tracking-tight text-slate-950 uppercase">
                  SMA NU KAPLONGAN INDRAMAYU
                </h2>
                <p className="text-[10px] text-slate-600 mt-0.5">
                  NPSN: 20216007 • Status Akreditasi: A • Alamat: Jl. Raya Kaplongan No. 28 Karangampel Kab. Indramayu 45283
                </p>
                <p className="text-[10px] text-slate-600">
                  Website: www.smanukaplongan.sch.id • Email: smanukaplongan@gmail.com
                </p>
              </div>
            </div>
          </div>

          {/* TABLE HEADER IDENTIFIER (PERSIS SEPERTI FOTO EXCEL USER) */}
          <div className="p-3 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/20 text-slate-800 dark:text-slate-100">
            {/* Baris Hijau: SAMPAI AGUSTUS 2026 */}
            <div className="bg-emerald-600 text-white font-black text-center py-1.5 px-4 rounded-lg tracking-wider text-sm uppercase shadow-xs">
              {ledgerPeriode}
            </div>

            {/* Subheader: Kelas & Wali Kelas */}
            <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400 w-24">Kelas</span>
                <span className="font-mono text-slate-900 dark:text-slate-100 text-sm font-black">: {selectedRombel}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400 w-24">Wali Kelas</span>
                <span className="text-slate-900 dark:text-slate-100 text-sm font-black uppercase">: {activeWaliKelasName}</span>
              </div>
            </div>
          </div>

          {/* EMPTY STATE */}
          {siswaList.length === 0 ? (
            <div className="p-10 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 text-center space-y-3">
              <span className="material-symbols-outlined text-4xl text-slate-400">group_off</span>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Database Siswa Belum Diisi</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Modul keuangan bendahara terhubung otomatis dengan data Dapodik. Silakan tambahkan data peserta didik di Master Data agar rincian tagihan dan tunggakan terhitung otomatis.
              </p>
              {onNavigateToSiswa && (
                <button
                  type="button"
                  onClick={onNavigateToSiswa}
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm">person_add</span>
                  <span>Input Data Siswa di Master Data</span>
                </button>
              )}
            </div>
          ) : filteredPembayaran.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
              Tidak ada data siswa yang cocok dengan filter pencarian atau kelas &ldquo;{selectedRombel}&rdquo;.
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* TABEL BUKU LEDGER RESMI SEKOLAH */}
              <table className="w-full text-left border-collapse text-xs border border-slate-300 dark:border-slate-700">
                <thead>
                  {/* Header Baris 1: Nama Kolom */}
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-black border-b border-slate-300 dark:border-slate-700">
                    <th className="py-2.5 px-2 text-center border-r border-slate-300 dark:border-slate-700 w-10">NO</th>
                    <th className="py-2.5 px-3 border-r border-slate-300 dark:border-slate-700 min-w-[180px]">NAMA</th>
                    <th className="py-2.5 px-2 text-center border-r border-slate-300 dark:border-slate-700 w-12">JK</th>
                    <th className="py-2.5 px-3 text-right border-r border-slate-300 dark:border-slate-700 min-w-[120px]">TAHUN LALU</th>
                    <th className="py-2.5 px-3 text-right border-r border-slate-300 dark:border-slate-700 min-w-[120px] bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200">DAFTAR ULANG</th>
                    <th className="py-2.5 px-3 text-right border-r border-slate-300 dark:border-slate-700 min-w-[160px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200">
                      SPP / SYAHRIYAH<br /><span className="text-[10px] font-normal">JULI - DESEMBER</span>
                    </th>
                    <th className="py-2.5 px-3 text-right border-r border-slate-300 dark:border-slate-700 min-w-[120px]">LAIN-LAIN</th>
                    <th className="py-2.5 px-3 text-right border-r border-slate-300 dark:border-slate-700 min-w-[130px] bg-slate-200/80 dark:bg-slate-700/80 font-black text-rose-700 dark:text-rose-300">JUMLAH</th>
                    <th className="py-2.5 px-3 border-r border-slate-300 dark:border-slate-700 min-w-[160px]">KETERANGAN</th>
                    {!isWaliKelas && (
                      <th className="no-print py-2.5 px-2 text-center min-w-[110px]">AKSI</th>
                    )}
                  </tr>

                  {/* Header Baris 2: Nomor Urut Kolom (1) s/d (7) Persis Excel */}
                  <tr className="bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 font-bold text-[11px] text-center border-b-2 border-slate-400 dark:border-slate-600">
                    <td className="py-1 border-r border-slate-300 dark:border-slate-700">(1)</td>
                    <td className="py-1 border-r border-slate-300 dark:border-slate-700">(2)</td>
                    <td className="py-1 border-r border-slate-300 dark:border-slate-700">(3)</td>
                    <td className="py-1 border-r border-slate-300 dark:border-slate-700 text-right pr-3">(4)</td>
                    <td className="py-1 border-r border-slate-300 dark:border-slate-700 text-right pr-3">(5)</td>
                    <td className="py-1 border-r border-slate-300 dark:border-slate-700 text-right pr-3">(6)</td>
                    <td className="py-1 border-r border-slate-300 dark:border-slate-700 text-right pr-3">(7)</td>
                    <td className="py-1 border-r border-slate-300 dark:border-slate-700 text-right pr-3 font-black">(8)</td>
                    <td className="py-1 border-r border-slate-300 dark:border-slate-700"></td>
                    {!isWaliKelas && <td className="no-print py-1"></td>}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredPembayaran.map((item, idx) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      {/* (1) NO */}
                      <td className="py-2.5 px-2 text-center font-mono font-bold border-r border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                        {idx + 1}
                      </td>

                      {/* (2) NAMA SISWA */}
                      <td className="py-2.5 px-3 border-r border-slate-300 dark:border-slate-700">
                        <div className="font-bold text-slate-900 dark:text-slate-100">{item.nama}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          NISN: {item.nisn} {selectedRombel === 'Semua' && `• ${item.rombel}`}
                        </div>
                      </td>

                      {/* (3) JK (L/P) */}
                      <td className="py-2.5 px-2 text-center font-bold border-r border-slate-300 dark:border-slate-700">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[11px] ${
                          item.jenisKelamin === 'L'
                            ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                            : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                        }`}>
                          {item.jenisKelamin}
                        </span>
                      </td>

                      {/* (4) TAHUN LALU */}
                      <td className="py-2.5 px-3 text-right font-mono border-r border-slate-300 dark:border-slate-700">
                        {item.sisaTahunLalu > 0 ? (
                          <span className="text-slate-800 dark:text-slate-200 font-bold">
                            {item.sisaTahunLalu.toLocaleString('id-ID')}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* (5) DAFTAR ULANG */}
                      <td className="py-2.5 px-3 text-right font-mono border-r border-slate-300 dark:border-slate-700 bg-sky-50/40 dark:bg-sky-950/20">
                        {item.sisaDaftarUlang > 0 ? (
                          <span className="text-slate-800 dark:text-slate-200 font-bold">
                            {item.sisaDaftarUlang.toLocaleString('id-ID')}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* (6) SPP / SYAHRIYAH / JULI - DESEMBER */}
                      <td className="py-2.5 px-3 text-right font-mono border-r border-slate-300 dark:border-slate-700 bg-emerald-50/40 dark:bg-emerald-950/20">
                        {item.sisaSyahriyah > 0 ? (
                          <span className="text-slate-800 dark:text-slate-200 font-bold">
                            {item.sisaSyahriyah.toLocaleString('id-ID')}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* (7) TUNGGAKAN LAIN-LAIN */}
                      <td className="py-2.5 px-3 text-right font-mono border-r border-slate-300 dark:border-slate-700">
                        {item.sisaLainLain > 0 ? (
                          <span className="text-slate-800 dark:text-slate-200 font-bold">
                            {item.sisaLainLain.toLocaleString('id-ID')}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* (8) JUMLAH TOTAL TUNGGAKAN */}
                      <td className="py-2.5 px-3 text-right font-mono font-black border-r border-slate-300 dark:border-slate-700 bg-slate-100/70 dark:bg-slate-800/70">
                        {item.sisaTunggakan > 0 ? (
                          <span className="text-rose-600 dark:text-rose-400">
                            {item.sisaTunggakan.toLocaleString('id-ID')}
                          </span>
                        ) : (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">LUNAS</span>
                        )}
                      </td>

                      {/* KETERANGAN */}
                      <td className="py-2.5 px-3 border-r border-slate-300 dark:border-slate-700">
                        <div className="space-y-1">
                          {item.pipStatus === 'Penerima Aktif' && (
                            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                              <span>PIP: Rp {item.nominalPip.toLocaleString('id-ID')}</span>
                            </div>
                          )}
                          <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                            {item.sisaTunggakan === 0 ? (
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Lunas Terpenuhi</span>
                            ) : item.totalTerbayar > 0 ? (
                              <span>Tercicil Rp {item.totalTerbayar.toLocaleString('id-ID')}</span>
                            ) : (
                              <span>Belum ada pembayaran</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* AKSI BENDAHARA (HANYA DITAMPILKAN UNTUK BENDAHARA & OPS) */}
                      {!isWaliKelas && (
                        <td className="no-print py-2.5 px-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {item.sisaTunggakan > 0 ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleOpenPay(item)}
                                  className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-0.5 shadow-2xs cursor-pointer"
                                  title="Catat Pembayaran Kasir"
                                >
                                  <span className="material-symbols-outlined text-xs">payments</span>
                                  <span>Bayar</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSelectedLetterItem(item)}
                                  className="p-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                                  title="Cetak Surat Pemberitahuan"
                                >
                                  <span className="material-symbols-outlined text-xs">mail</span>
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  const tx = transaksiList.find(t => t.siswaId === item.siswaId);
                                  if (tx) setSelectedReceiptItem(tx);
                                  else onShowToast("Belum ada kwitansi transaksi tercatat.");
                                }}
                                className="px-2 py-1 rounded bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-bold text-[11px] flex items-center gap-0.5 cursor-pointer"
                                title="Lihat Kwitansi"
                              >
                                <span className="material-symbols-outlined text-xs">receipt</span>
                                <span>Kwitansi</span>
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>

                {/* FOOTER TOTALS ROW (PERSIS TOTAL DI BAGIAN BAWAH EXCEL) */}
                <tfoot>
                  <tr className="bg-slate-200/90 dark:bg-slate-800 font-black text-slate-900 dark:text-slate-100 border-t-2 border-slate-400 dark:border-slate-600 text-xs">
                    <td colSpan={3} className="py-3 px-3 text-center border-r border-slate-300 dark:border-slate-700 font-bold tracking-wider uppercase">
                      JUMLAH / TOTAL KESELURUHAN
                    </td>
                    {/* (4) Total Tahun Lalu */}
                    <td className="py-3 px-3 text-right font-mono border-r border-slate-300 dark:border-slate-700 font-black">
                      {ledgerTotals.totalTahunLalu.toLocaleString('id-ID')}
                    </td>
                    {/* (5) Total Daftar Ulang */}
                    <td className="py-3 px-3 text-right font-mono border-r border-slate-300 dark:border-slate-700 font-black bg-sky-100/60 dark:bg-sky-950/40">
                      {ledgerTotals.totalDaftarUlang.toLocaleString('id-ID')}
                    </td>
                    {/* (6) Total Syahriyah */}
                    <td className="py-3 px-3 text-right font-mono border-r border-slate-300 dark:border-slate-700 font-black bg-emerald-100/60 dark:bg-emerald-950/40">
                      {ledgerTotals.totalSyahriyah.toLocaleString('id-ID')}
                    </td>
                    {/* (7) Total Lain-lain */}
                    <td className="py-3 px-3 text-right font-mono border-r border-slate-300 dark:border-slate-700 font-black">
                      {ledgerTotals.totalLainLain.toLocaleString('id-ID')}
                    </td>
                    {/* (8) Total Jumlah */}
                    <td className="py-3 px-3 text-right font-mono font-black text-rose-600 dark:text-rose-400 border-r border-slate-300 dark:border-slate-700 text-sm">
                      {ledgerTotals.totalJumlah.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-3 text-xs text-slate-600 dark:text-slate-400 font-bold border-r border-slate-300 dark:border-slate-700">
                      {ledgerTotals.totalSiswaMenunggak} Siswa Belum Lunas
                    </td>
                    {!isWaliKelas && <td className="no-print"></td>}
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {/* PRINT-ONLY SIGNATURE SECTION (A4 RESMI) */}
          <div className="hidden print:grid grid-cols-3 gap-6 pt-8 mt-6 text-center text-xs text-slate-900 border-t border-slate-400">
            <div>
              <div>Mengetahui,</div>
              <div className="font-bold">Kepala SMA NU Kaplongan</div>
              <div className="h-16"></div>
              <div className="font-black underline uppercase">{schoolInfo?.principalName || 'Drs. H. Toufik Zaenal Mustofa, M.Pd.I'}</div>
              <div className="text-[10px]">NIP/NUPTK: {schoolInfo?.principalNip || '-'}</div>
            </div>

            <div>
              <div>Mengetahui,</div>
              <div className="font-bold">Wali Kelas {selectedRombel}</div>
              <div className="h-16"></div>
              <div className="font-black underline uppercase">{activeWaliKelasName}</div>
              <div className="text-[10px]">Guru Wali Kelas Bina</div>
            </div>

            <div>
              <div>Kaplongan, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              <div className="font-bold">Bendahara / Unit Keuangan</div>
              <div className="h-16"></div>
              <div className="font-black underline uppercase">{schoolInfo?.operatorName || 'Bagas Pratama, S.Kom'}</div>
              <div className="text-[10px]">Lembaga Pendidikan Ma'arif NU</div>
            </div>
          </div>
        </div>
      )}

      {/* 5. VIEW TAB: RIWAYAT KWITANSI KASIR */}
      {subType === 'riwayat-kwitansi-bayar' && (
        <div className="p-5 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-surface-container/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Riwayat Transaksi &amp; Kwitansi Kasir Sekolah
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Daftar bukti pembayaran yang telah diverifikasi dan masuk ke kas SMA NU Kaplongan.
              </p>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Total <b>{transaksiList.length}</b> transaksi tersimpan
            </div>
          </div>

          {transaksiList.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
              <span className="material-symbols-outlined text-3xl text-slate-400">receipt_long</span>
              <p>Belum ada riwayat transaksi pembayaran yang dicatat.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold">
                    <th className="py-2.5 px-3">No. Kwitansi</th>
                    <th className="py-2.5 px-3">Tanggal</th>
                    <th className="py-2.5 px-3">Siswa &amp; Rombel</th>
                    <th className="py-2.5 px-3">Kategori Pos</th>
                    <th className="py-2.5 px-3 text-right">Jumlah</th>
                    <th className="py-2.5 px-3">Metode Bayar</th>
                    <th className="py-2.5 px-3">Penerima</th>
                    <th className="py-2.5 px-3 text-center">Cetak</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/70">
                  {transaksiList.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-mono font-bold text-sky-700 dark:text-sky-400">
                        {tx.nomorKwitansi}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                        {tx.tanggal}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-800 dark:text-slate-100">{tx.namaSiswa}</div>
                        <div className="text-[11px] text-slate-500">{tx.rombel}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                          {tx.kategori}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                        Rp {tx.jumlah.toLocaleString('id-ID')}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-slate-600 dark:text-slate-300">{tx.metode}</span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">
                        {tx.penerima}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedReceiptItem(tx)}
                          className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold flex items-center gap-1 mx-auto cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">print</span>
                          <span>Cetak</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 6. VIEW TAB: REKAPITULASI ROMBEL */}
      {subType === 'rekap-surat-tunggakan' && (
        <div className="p-5 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-surface-container/80 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Rekapitulasi Tunggakan per Rombongan Belajar
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Pemetaan tunggakan per kelas dan monitoring kinerja Wali Kelas.
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">print</span>
              <span>Cetak Laporan Format A4</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rombelOptions.map(rombelName => {
              const rSiswa = pembayaranList.filter(p => p.rombel === rombelName || p.rombel.replace(/\s+/g, '-') === rombelName.replace(/\s+/g, '-'));
              const rTagihan = rSiswa.reduce((acc, p) => acc + p.totalTagihan, 0);
              const rTerbayar = rSiswa.reduce((acc, p) => acc + p.totalTerbayar, 0);
              const rTunggakan = rSiswa.reduce((acc, p) => acc + p.sisaTunggakan, 0);
              const rMenunggakCount = rSiswa.filter(p => p.sisaTunggakan > 0).length;
              const rWali = rombelWaliMap.get(rombelName) || (rombelName.includes('X-1') ? 'ABDUL AZIZ MUSTOFA' : 'Wali Kelas');
              const rPct = rTagihan > 0 ? Math.round((rTerbayar / rTagihan) * 100) : 0;

              return (
                <div key={rombelName} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-black text-slate-800 dark:text-slate-100">{rombelName}</span>
                        <div className="text-[11px] text-slate-500 font-semibold">{rWali}</div>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {rSiswa.length} Siswa
                      </span>
                    </div>
                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>Penerimaan:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">Rp {rTerbayar.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>Sisa Tunggakan:</span>
                        <span className="font-bold text-rose-600 dark:text-rose-400">Rp {rTunggakan.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-700">
                    <div className="flex justify-between items-center text-[11px] mb-1">
                      <span className="text-slate-500">Kepatuhan Bayar</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{rPct}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${rPct}%` }} />
                    </div>
                    <div className="mt-2 text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
                      {rMenunggakCount} siswa memiliki tunggakan
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. MODAL: BROADCAST OTOMATIS 2 MINGGUAN KE WALI KELAS */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto no-print">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-xl">campaign</span>
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-slate-100">
                    Generator Pesan Tunggakan 2 Mingguan ke Wali Kelas
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Kirim rincian berkala via WhatsApp &amp; cetak lembar monitoring per kelas
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsBroadcastModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            {/* Target Kelas & Wali Kelas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Pilih Kelas / Rombel:</label>
                <select
                  value={broadcastTargetRombel}
                  onChange={(e) => setBroadcastTargetRombel(e.target.value)}
                  className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-bold"
                >
                  {rombelOptions.map((r) => (
                    <option key={r} value={r}>Kelas {r} ({rombelWaliMap.get(r) || (r.includes('X-1') ? 'ABDUL AZIZ MUSTOFA' : 'Wali Kelas')})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Nama Wali Kelas:</label>
                <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-black text-slate-900 dark:text-slate-100">
                  {targetWaliKelasName}
                </div>
              </div>
            </div>

            {/* Preview Pesan WhatsApp */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-emerald-600">chat</span>
                  <span>Pratinjau Format Pesan WhatsApp:</span>
                </label>
                <span className="text-[11px] text-slate-500">
                  {broadcastStudents.filter(s => s.sisaTunggakan > 0).length} siswa menunggak
                </span>
              </div>
              <pre className="p-3.5 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-[11px] whitespace-pre-wrap max-h-56 overflow-y-auto leading-relaxed border border-slate-800 selection:bg-emerald-900">
                {generatedBroadcastText}
              </pre>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="material-symbols-outlined text-base text-blue-600">schedule</span>
                <span>Jadwal Otomatis: Setiap 2 Minggu Sekali</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleCopyBroadcastText}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">content_copy</span>
                  <span>Salin Format WA</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendWhatsAppDirect}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">send</span>
                  <span>Kirim ke Wali Kelas (WA)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. MODAL: INPUT PEMBAYARAN KASIR */}
      {selectedStudentForPay && !isWaliKelas && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl max-w-lg w-full p-5 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                  Pencatatan Pembayaran Siswa
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedStudentForPay.nama} ({selectedStudentForPay.rombel}) • Total Tunggakan: Rp {selectedStudentForPay.sisaTunggakan.toLocaleString('id-ID')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudentForPay(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmitPayment} className="space-y-3.5 text-xs">
              {/* Pos Kategori */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Kategori Pembayaran:</label>
                <select
                  value={payKategori}
                  onChange={(e) => {
                    const cat = e.target.value as KategoriPosKeuangan;
                    setPayKategori(cat);
                    if (cat === 'Syahriyah / SPP Bulanan' || cat === 'SPP Bulanan') {
                      setPayAmount(selectedStudentForPay.sppBulanan);
                    } else if (cat === 'Tunggakan Tahun Lalu') {
                      setPayAmount(selectedStudentForPay.sisaTahunLalu || 350000);
                    } else if (cat === 'Daftar Ulang') {
                      setPayAmount(selectedStudentForPay.sisaDaftarUlang || 450000);
                    } else if (cat === 'Tunggakan Lain-lain') {
                      setPayAmount(selectedStudentForPay.sisaLainLain || 200000);
                    }
                  }}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                >
                  <option value="Syahriyah / SPP Bulanan">Syahriyah / SPP Bulanan (Sisa: Rp {selectedStudentForPay.sisaSyahriyah.toLocaleString('id-ID')})</option>
                  <option value="Tunggakan Tahun Lalu">Tunggakan Tahun Lalu (Sisa: Rp {selectedStudentForPay.sisaTahunLalu.toLocaleString('id-ID')})</option>
                  <option value="Daftar Ulang">Daftar Ulang (Sisa: Rp {selectedStudentForPay.sisaDaftarUlang.toLocaleString('id-ID')})</option>
                  <option value="Tunggakan Lain-lain">Tunggakan Lain-lain (Sisa: Rp {selectedStudentForPay.sisaLainLain.toLocaleString('id-ID')})</option>
                  <option value="Lainnya">Lainnya / Titipan</option>
                </select>
              </div>

              {/* Bulan Checkbox if SPP */}
              {(payKategori === 'Syahriyah / SPP Bulanan' || payKategori === 'SPP Bulanan') && (
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Pilih Bulan yang Dibayar:</label>
                  <div className="grid grid-cols-3 gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    {BULAN_SEMESTER_GANJIL.map((bln) => {
                      const isUnpaid = selectedStudentForPay.bulanMenunggak.includes(bln);
                      const isChecked = payMonths.includes(bln);
                      return (
                        <label
                          key={bln}
                          className={`flex items-center gap-1.5 p-1.5 rounded-lg cursor-pointer ${
                            !isUnpaid ? 'opacity-40 line-through' : 'hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          <input
                            type="checkbox"
                            disabled={!isUnpaid}
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                const updated = [...payMonths, bln];
                                setPayMonths(updated);
                                setPayAmount(updated.length * selectedStudentForPay.sppBulanan);
                              } else {
                                const updated = payMonths.filter(m => m !== bln);
                                setPayMonths(updated);
                                setPayAmount(updated.length * selectedStudentForPay.sppBulanan);
                              }
                            }}
                            className="rounded text-sky-600"
                          />
                          <span className="text-[11px] font-medium">{bln}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Jumlah Bayar */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Nominal Pembayaran (Rp):</label>
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  min={1000}
                  step={5000}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-emerald-600 dark:text-emerald-400"
                  required
                />
              </div>

              {/* Metode Pembayaran */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Metode Pembayaran:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Tunai Kasir', 'Transfer Bank BNI', 'Alokasi Dana PIP'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPayMetode(m)}
                      className={`p-2 rounded-xl border text-[11px] font-bold text-center transition-all ${
                        payMetode === m
                          ? 'bg-sky-500 text-white border-sky-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                {payMetode === 'Alokasi Dana PIP' && (
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
                    * Pembayaran langsung dipotong dari rekening SimPel BNI siswa penerima PIP yang dicairkan secara kolektif.
                  </p>
                )}
              </div>

              {/* Catatan */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Keterangan / Catatan Transaksi:</label>
                <input
                  type="text"
                  value={payCatatan}
                  onChange={(e) => setPayCatatan(e.target.value)}
                  placeholder="Contoh: Pembayaran Syahriyah Juli-Agustus, titipan orang tua"
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedStudentForPay(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">check</span>
                  <span>Simpan Pembayaran</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. MODAL: CETAK KWITANSI PEMBAYARAN RESMI A4 */}
      {selectedReceiptItem && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full p-6 space-y-4 my-8">
            <div className="flex items-center justify-between no-print border-b pb-2">
              <span className="font-bold text-sm text-slate-700">Preview Kwitansi Pembayaran Resmi</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">print</span>
                  <span>Cetak A4</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedReceiptItem(null)}
                  className="px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>

            {/* Kwitansi Body (Format Kedinasan Kop SMA NU Kaplongan) */}
            <div className="border border-slate-300 p-6 rounded-xl space-y-4 bg-white print:border-none print:p-0">
              <div className="flex items-center gap-4 pb-3 border-b-4 border-double border-slate-900 text-center">
                <img src="/logo-sma-nu.png?v=3" alt="Logo SMA NU" className="w-16 h-16 object-contain" />
                <div className="flex-1">
                  <h4 className="text-xs uppercase tracking-widest font-bold">Lembaga Pendidikan Ma'arif Nahdlatul Ulama</h4>
                  <h2 className="text-lg font-black tracking-tight text-slate-900">SMA NU KAPLONGAN INDRAMAYU</h2>
                  <p className="text-[10px] text-slate-600">
                    Akreditasi: A • NPSN: 20216007 • Alamat: Jl. Raya Kaplongan No. 28 Karangampel Kab. Indramayu 45283
                  </p>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-base font-black underline uppercase tracking-wider">KWITANSI PEMBAYARAN</h3>
                <p className="text-xs font-mono text-slate-600">Nomor: {selectedReceiptItem.nomorKwitansi}</p>
              </div>

              <table className="w-full text-xs space-y-2">
                <tbody>
                  <tr className="py-1">
                    <td className="w-36 font-semibold py-1">Telah Diterima Dari</td>
                    <td className="w-3">:</td>
                    <td className="font-bold uppercase py-1">{selectedReceiptItem.namaSiswa} ({selectedReceiptItem.rombel})</td>
                  </tr>
                  <tr className="py-1">
                    <td className="font-semibold py-1">NISN / Identitas</td>
                    <td>:</td>
                    <td className="py-1">{selectedReceiptItem.nisn}</td>
                  </tr>
                  <tr className="py-1">
                    <td className="font-semibold py-1">Uang Sejumlah</td>
                    <td>:</td>
                    <td className="font-bold italic bg-slate-100 p-1.5 rounded py-1">
                      # {terbilang(selectedReceiptItem.jumlah)} Rupiah #
                    </td>
                  </tr>
                  <tr className="py-1">
                    <td className="font-semibold py-1">Untuk Pembayaran</td>
                    <td>:</td>
                    <td className="py-1">{selectedReceiptItem.keterangan} ({selectedReceiptItem.kategori})</td>
                  </tr>
                  <tr className="py-1">
                    <td className="font-semibold py-1">Metode Bayar</td>
                    <td>:</td>
                    <td className="py-1">{selectedReceiptItem.metode}</td>
                  </tr>
                </tbody>
              </table>

              <div className="pt-4 flex items-center justify-between">
                <div className="p-3 border-2 border-dashed border-slate-400 rounded-xl bg-slate-50 text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Jumlah Pembayaran</div>
                  <div className="text-lg font-black text-slate-900 mt-0.5">
                    Rp {selectedReceiptItem.jumlah.toLocaleString('id-ID')}
                  </div>
                </div>

                <div className="text-center text-xs">
                  <div>Kaplongan, {selectedReceiptItem.tanggal}</div>
                  <div className="text-slate-600 font-semibold mt-0.5">Bendahara / Kasir Sekolah,</div>
                  <div className="h-14"></div>
                  <div className="font-bold underline">{selectedReceiptItem.penerima}</div>
                  <div className="text-[10px] text-slate-500">Unit Keuangan SMA NU Kaplongan</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. MODAL: CETAK SURAT PEMBERITAHUAN TUNGGAKAN A4 */}
      {selectedLetterItem && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full p-6 space-y-4 my-8">
            <div className="flex items-center justify-between no-print border-b pb-2">
              <span className="font-bold text-sm text-slate-700">Preview Surat Pemberitahuan Tunggakan Resmi</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">print</span>
                  <span>Cetak A4</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLetterItem(null)}
                  className="px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>

            {/* Surat Resmi A4 */}
            <div className="border border-slate-300 p-6 rounded-xl space-y-3 bg-white text-xs print:border-none print:p-0">
              <div className="flex items-center gap-4 pb-3 border-b-4 border-double border-slate-900 text-center">
                <img src="/logo-sma-nu.png?v=3" alt="Logo SMA NU" className="w-16 h-16 object-contain" />
                <div className="flex-1">
                  <h4 className="text-xs uppercase tracking-widest font-bold">Lembaga Pendidikan Ma'arif Nahdlatul Ulama</h4>
                  <h2 className="text-lg font-black tracking-tight text-slate-900">SMA NU KAPLONGAN INDRAMAYU</h2>
                  <p className="text-[10px] text-slate-600">
                    Akreditasi: A • NPSN: 20216007 • Alamat: Jl. Raya Kaplongan No. 28 Karangampel Kab. Indramayu 45283
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-start pt-2">
                <div>
                  <div>Nomor : 421.3/KEU-TGK/{new Date().getFullYear()}/SMA-NU</div>
                  <div>Lampiran : 1 (Satu) Lembar Rincian</div>
                  <div>Perihal : <b>Pemberitahuan Kewajiban Administrasi Keuangan Sekolah</b></div>
                </div>
                <div>Kaplongan, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              </div>

              <div className="pt-2">
                <div>Kepada Yth.</div>
                <div className="font-bold">Bapak / Ibu Orang Tua / Wali Murid dari:</div>
                <div className="pl-3 font-semibold text-slate-800">
                  {selectedLetterItem.nama} (Kelas {selectedLetterItem.rombel})
                </div>
                <div>di Tempat</div>
              </div>

              <p className="text-justify leading-relaxed">
                <i>Assalamu’alaikum Warahmatullahi Wabarakatuh.</i>
                <br />
                Puji syukur ke hadirat Allah SWT. Dalam rangka kelancaran belajar mengajar di SMA NU Kaplongan Tahun Ajaran 2026/2027, kami memberitahukan rincian kewajiban administrasi keuangan yang belum terselesaikan sebagai berikut:
              </p>

              <table className="w-full border-collapse border border-slate-400 my-2">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold">
                    <th className="border border-slate-400 p-1.5 text-center w-10">No</th>
                    <th className="border border-slate-400 p-1.5 text-left">Komponen Biaya</th>
                    <th className="border border-slate-400 p-1.5 text-left">Keterangan / Periode</th>
                    <th className="border border-slate-400 p-1.5 text-right w-28">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedLetterItem.sisaTahunLalu > 0 && (
                    <tr>
                      <td className="border border-slate-400 p-1.5 text-center">1</td>
                      <td className="border border-slate-400 p-1.5">Tunggakan Tahun Lalu</td>
                      <td className="border border-slate-400 p-1.5">Kewajiban Periode Sebelumnya</td>
                      <td className="border border-slate-400 p-1.5 text-right font-mono">
                        Rp {selectedLetterItem.sisaTahunLalu.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  )}
                  {selectedLetterItem.sisaDaftarUlang > 0 && (
                    <tr>
                      <td className="border border-slate-400 p-1.5 text-center">2</td>
                      <td className="border border-slate-400 p-1.5">Daftar Ulang</td>
                      <td className="border border-slate-400 p-1.5">Administrasi Awal Tahun Pelajaran</td>
                      <td className="border border-slate-400 p-1.5 text-right font-mono">
                        Rp {selectedLetterItem.sisaDaftarUlang.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  )}
                  {selectedLetterItem.sisaSyahriyah > 0 && (
                    <tr>
                      <td className="border border-slate-400 p-1.5 text-center">3</td>
                      <td className="border border-slate-400 p-1.5">Syahriyah / SPP Bulanan</td>
                      <td className="border border-slate-400 p-1.5">Bulan: {selectedLetterItem.bulanMenunggak.join(', ') || '-'}</td>
                      <td className="border border-slate-400 p-1.5 text-right font-mono">
                        Rp {selectedLetterItem.sisaSyahriyah.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  )}
                  {selectedLetterItem.sisaLainLain > 0 && (
                    <tr>
                      <td className="border border-slate-400 p-1.5 text-center">4</td>
                      <td className="border border-slate-400 p-1.5">Tunggakan Lain-lain</td>
                      <td className="border border-slate-400 p-1.5">Biaya Praktik, Infak &amp; Ujian SAS/TKA</td>
                      <td className="border border-slate-400 p-1.5 text-right font-mono">
                        Rp {selectedLetterItem.sisaLainLain.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  )}
                  <tr className="bg-slate-100 font-bold">
                    <td colSpan={3} className="border border-slate-400 p-1.5 text-right">TOTAL SISA TUNGGAKAN:</td>
                    <td className="border border-slate-400 p-1.5 text-right font-black text-rose-600 font-mono">
                      Rp {selectedLetterItem.sisaTunggakan.toLocaleString('id-ID')}
                    </td>
                  </tr>
                </tbody>
              </table>

              {selectedLetterItem.pipStatus === 'Penerima Aktif' && (
                <div className="p-2 rounded bg-amber-50 border border-amber-300 text-[11px] text-amber-800">
                  <b>Catatan Khusus Penerima PIP:</b> Ananda tercatat sebagai Penerima Aktif Program Indonesia Pintar (PIP BNI) sebesar <b>Rp {selectedLetterItem.nominalPip.toLocaleString('id-ID')}</b>. Pembayaran dapat diselesaikan saat pencairan dana kolektif.
                </div>
              )}

              <p className="text-justify leading-relaxed">
                Demikian surat pemberitahuan ini kami sampaikan. Pembayaran dapat dilakukan melalui kasir bendahara sekolah atau transfer ke rekening resmi Bank BNI SMA NU Kaplongan.
                <br />
                <i>Wassalamu’alaikum Warahmatullahi Wabarakatuh.</i>
              </p>

              <div className="pt-4 flex justify-between items-center text-center">
                <div className="w-56">
                  <div>Mengetahui,</div>
                  <div className="font-semibold">Kepala Sekolah,</div>
                  <div className="h-14"></div>
                  <div className="font-bold underline">{schoolInfo?.principalName || 'Drs. H. Toufik Zaenal Mustofa, M.Pd.I'}</div>
                  <div className="text-[10px]">NIP. {schoolInfo?.principalNip || '-'}</div>
                </div>

                <div className="w-56">
                  <div>Kaplongan, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                  <div className="font-semibold">Bendahara Sekolah,</div>
                  <div className="h-14"></div>
                  <div className="font-bold underline">Unit Keuangan SMA NU</div>
                  <div className="text-[10px]">Lembaga Pendidikan Ma'arif NU</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 11. MODAL: SINKRONISASI & INTEGRASI APLIKASI BENDAHARA */}
      {isSyncModalOpen && !isWaliKelas && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto no-print">
          <div className="bg-surface-container-lowest dark:bg-slate-900 border border-surface-container dark:border-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-2xl text-white">hub</span>
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight">
                    Integrasi &amp; Sinkronisasi Aplikasi Bendahara
                  </h3>
                  <p className="text-xs text-emerald-100 mt-0.5">
                    Sinkronisasi data kasir, kwitansi &amp; tunggakan dengan Operator Dapodik dan Server Cloud
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsSyncModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="flex items-center border-b border-surface-container dark:border-slate-800 px-4 bg-surface-container-low/50 dark:bg-slate-800/40 shrink-0 overflow-x-auto">
              <button
                type="button"
                onClick={() => setSyncModalTab('status')}
                className={`py-3 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition-all shrink-0 cursor-pointer ${
                  syncModalTab === 'status'
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800'
                }`}
              >
                <span className="material-symbols-outlined text-base">cloud_sync</span>
                <span>Status &amp; Cloud Sync</span>
              </button>

              <button
                type="button"
                onClick={() => setSyncModalTab('ekspor')}
                className={`py-3 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition-all shrink-0 cursor-pointer ${
                  syncModalTab === 'ekspor'
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800'
                }`}
              >
                <span className="material-symbols-outlined text-base">file_download</span>
                <span>Ekspor Format BKU Bendahara</span>
              </button>

              <button
                type="button"
                onClick={() => setSyncModalTab('impor')}
                className={`py-3 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition-all shrink-0 cursor-pointer ${
                  syncModalTab === 'impor'
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800'
                }`}
              >
                <span className="material-symbols-outlined text-base">file_upload</span>
                <span>Impor File Transaksi Luar</span>
              </button>

              <button
                type="button"
                onClick={() => setSyncModalTab('tarif')}
                className={`py-3 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition-all shrink-0 cursor-pointer ${
                  syncModalTab === 'tarif'
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800'
                }`}
              >
                <span className="material-symbols-outlined text-base">tune</span>
                <span>Tarif Standar Sekolah</span>
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {/* TAB 1: STATUS & CLOUD SYNC */}
              {syncModalTab === 'status' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-surface-container-low dark:bg-slate-800/60 border border-surface-container dark:border-slate-700/60 flex items-center justify-around gap-2 text-center text-xs">
                    <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-white dark:bg-slate-800 shadow-2xs border border-slate-200 dark:border-slate-700 flex-1">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-600 dark:text-sky-300 flex items-center justify-center font-bold">
                        <span className="material-symbols-outlined text-lg">school</span>
                      </div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">Operator Dapodik</span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{siswaList.length} Siswa Terdaftar</span>
                    </div>

                    <div className="flex flex-col items-center text-slate-400">
                      <span className="material-symbols-outlined text-lg animate-pulse">sync_alt</span>
                      <span className="text-[9px] font-mono">Realtime</span>
                    </div>

                    <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-white dark:bg-slate-800 shadow-2xs border border-slate-200 dark:border-slate-700 flex-1">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                        <span className="material-symbols-outlined text-lg">database</span>
                      </div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">Database Cloud</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{syncEngine === 'supabase' ? 'Supabase PG' : 'Cloud Server'}</span>
                    </div>

                    <div className="flex flex-col items-center text-slate-400">
                      <span className="material-symbols-outlined text-lg animate-pulse">sync_alt</span>
                      <span className="text-[9px] font-mono">Bi-Direction</span>
                    </div>

                    <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-white dark:bg-slate-800 shadow-2xs border border-slate-200 dark:border-slate-700 flex-1">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                        <span className="material-symbols-outlined text-lg">payments</span>
                      </div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">Aplikasi Bendahara</span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{transaksiList.length} Kwitansi Kasir</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between gap-3">
                    <div>
                      <h5 className="font-bold text-xs text-emerald-900 dark:text-emerald-200">
                        Sinkronisasi Langsung ke Cloud Database
                      </h5>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5">
                        Tarik perubahan data master siswa terbaru dari Operator dan kirim seluruh rekaman kwitansi bendahara.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleSyncWithBendaharaApp}
                      disabled={isCloudSyncing}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95 shrink-0 disabled:opacity-60 cursor-pointer"
                    >
                      <span className={`material-symbols-outlined text-base ${isCloudSyncing ? 'animate-spin' : ''}`}>
                        sync
                      </span>
                      <span>{isCloudSyncing ? 'Sinkron...' : 'Singkronkan Sekarang'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: EKSPOR BKU */}
              {syncModalTab === 'ekspor' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Unduh berkas transaksi dan tunggakan yang diformat sesuai standar pelaporan bendahara sekolah:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-emerald-600 text-xl">account_balance</span>
                          <h5 className="font-bold text-xs text-slate-800 dark:text-slate-100">Buku Kas Umum (BKU)</h5>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                          Format resmi buku kas umum bendahara dengan kolom debit, kredit, saldo berjalan, no kwitansi, dan nama siswa.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleExportBKU}
                        className="mt-4 w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">download</span>
                        <span>Unduh BKU (.csv)</span>
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-blue-600 text-xl">table_chart</span>
                          <h5 className="font-bold text-xs text-slate-800 dark:text-slate-100">Rekap Tunggakan Siswa</h5>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                          Daftar piutang per siswa, rombel, bulan menunggak, dan rincian alokasi bantuan dana PIP SimPel BNI.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleExportCSV}
                        className="mt-4 w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">download</span>
                        <span>Unduh Rekap Tunggakan (.csv)</span>
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 sm:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-purple-600 text-xl">database</span>
                          <h5 className="font-bold text-xs text-slate-800 dark:text-slate-100">Cadangan Penuh Bendahara (JSON)</h5>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                          Seluruh data transaksi kwitansi dan penyesuaian tagihan dalam format JSON terenkapsulasi.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleExportJSON}
                        className="py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shrink-0 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">save_alt</span>
                        <span>Cadangkan Database</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: IMPOR DARI APLIKASI BENDAHARA */}
              {syncModalTab === 'impor' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/40 text-xs text-sky-800 dark:text-sky-200">
                    <div className="font-bold flex items-center gap-1.5 mb-1">
                      <span className="material-symbols-outlined text-base">info</span>
                      <span>Format Berkas CSV yang Didukung:</span>
                    </div>
                    <p className="leading-relaxed">
                      Baris pertama (header) harus memuat kolom:
                      <br />
                      <code className="font-mono bg-white dark:bg-slate-900 px-1 py-0.5 rounded text-[11px] mt-1 inline-block border border-sky-300 dark:border-sky-700">
                        NISN, Nama, Tanggal, Kategori, Jumlah, Metode, Keterangan
                      </code>
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-center flex flex-col items-center justify-center gap-3 bg-slate-50/50 dark:bg-slate-800/30">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl">upload_file</span>
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                        Pilih Berkas CSV Data Pembayaran Bendahara
                      </h5>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Sistem akan otomatis mencocokkan NISN/Nama siswa ke Dapodik dan mencatat transaksi kasir.
                      </p>
                    </div>

                    <label className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm transition-all active:scale-95">
                      <span className="material-symbols-outlined text-base">file_open</span>
                      <span>Unggah File CSV (.csv)</span>
                      <input
                        type="file"
                        accept=".csv,text/csv"
                        onChange={handleImportCSV}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 4: KONFIGURASI TARIF SEKOLAH */}
              {syncModalTab === 'tarif' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Atur tarif tagihan operasional standar SMA NU Kaplongan:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-1">
                        Syahriyah / SPP Bulanan
                      </label>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                        <input
                          type="number"
                          value={tarifSpp}
                          onChange={(e) => setTarifSpp(Number(e.target.value) || 0)}
                          step={10000}
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">Default: Rp 150.000 / bulan</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-1">
                        Daftar Ulang
                      </label>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                        <input
                          type="number"
                          value={tarifDaftarUlang}
                          onChange={(e) => setTarifDaftarUlang(Number(e.target.value) || 0)}
                          step={25000}
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">Default: Rp 450.000 / tahun</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-1">
                        Tunggakan Lain-lain
                      </label>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                        <input
                          type="number"
                          value={tarifLainLain}
                          onChange={(e) => setTarifLainLain(Number(e.target.value) || 0)}
                          step={25000}
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">Praktik, Infak &amp; Ujian</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleApplyGlobalTarif}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">check_circle</span>
                      <span>Terapkan Tarif Baru ke Seluruh Siswa</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-surface-container-low border-t border-surface-container dark:border-slate-800 flex items-center justify-between text-xs shrink-0">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
                <span className="material-symbols-outlined text-sm text-emerald-600">verified</span>
                <span>Standar LP Ma'arif NU SMA NU Kaplongan</span>
              </div>

              <button
                type="button"
                onClick={() => setIsSyncModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

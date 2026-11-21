import React, { useState, useMemo } from 'react';
import { SiswaItem } from '../../data/modulesData';
import { SchoolInfo } from '../../types';
import { PembayaranItem, TransaksiKwitansi } from '../../types/finance';

interface BendaharaKeuanganViewProps {
  subType: 'tunggakan-dan-spp' | 'riwayat-kwitansi-bayar' | 'rekap-surat-tunggakan';
  schoolInfo?: SchoolInfo;
  siswaList?: SiswaItem[];
  onShowToast: (msg: string) => void;
  onNavigateToSiswa?: () => void;
  onAddActivity?: (title: string, desc: string) => void;
}

const BULAN_SEMESTER_GANJIL = ['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

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
  onShowToast,
  onNavigateToSiswa,
  onAddActivity
}) => {
  // Stored state for payments and transactions
  const [transaksiList, setTransaksiList] = useState<TransaksiKwitansi[]>(() => {
    try {
      const saved = localStorage.getItem('simops_keuangan_transaksi');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const saveTransaksi = (items: TransaksiKwitansi[]) => {
    setTransaksiList(items);
    try {
      localStorage.setItem('simops_keuangan_transaksi', JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  };

  // Custom adjustments for payments (e.g. override payment records)
  const [paymentOverrides, setPaymentOverrides] = useState<Record<string, Partial<PembayaranItem>>>(() => {
    try {
      const saved = localStorage.getItem('simops_keuangan_overrides');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {};
  });

  const saveOverrides = (overrides: Record<string, Partial<PembayaranItem>>) => {
    setPaymentOverrides(overrides);
    try {
      localStorage.setItem('simops_keuangan_overrides', JSON.stringify(overrides));
    } catch (e) {
      console.error(e);
    }
  };

  // Generate dynamic student payment records connected to operator's master siswaList
  const pembayaranList: PembayaranItem[] = useMemo(() => {
    return siswaList.map((siswa, idx) => {
      const override = paymentOverrides[siswa.id] || {};
      
      // Standard billing rates for SMA NU Kaplongan
      const sppPerBulan = override.sppBulanan !== undefined ? override.sppBulanan : 150000;
      const tagihanDSP = override.tagihanDSP !== undefined ? override.tagihanDSP : (siswa.rombel.includes('X-') ? 1200000 : 0);
      const terbayarDSP = override.terbayarDSP !== undefined ? override.terbayarDSP : 0;
      const tagihanUjian = override.tagihanUjian !== undefined ? override.tagihanUjian : 350000;
      const terbayarUjian = override.terbayarUjian !== undefined ? override.terbayarUjian : 0;

      // Compute payments made from transaction log
      const studentTx = transaksiList.filter(t => t.siswaId === siswa.id);
      const paidSppTx = studentTx.filter(t => t.kategori === 'SPP Bulanan').reduce((acc, t) => acc + t.jumlah, 0);
      const paidDspTx = studentTx.filter(t => t.kategori === 'DSP / Uang Gedung').reduce((acc, t) => acc + t.jumlah, 0);
      const paidUjianTx = studentTx.filter(t => t.kategori === 'Praktik & Ujian').reduce((acc, t) => acc + t.jumlah, 0);

      const totalPaidDSP = terbayarDSP + paidDspTx;
      const totalPaidUjian = terbayarUjian + paidUjianTx;

      // Months calculation: default 6 months in semester ganjil
      const monthsTotal = 6;
      const monthsPaidCount = Math.min(monthsTotal, Math.floor(paidSppTx / sppPerBulan));
      const bulanMenunggak = BULAN_SEMESTER_GANJIL.slice(monthsPaidCount);
      const totalTagihanSPP = monthsTotal * sppPerBulan;
      const totalPaidSPP = monthsPaidCount * sppPerBulan;

      const totalTagihan = totalTagihanSPP + tagihanDSP + tagihanUjian;
      const totalTerbayar = totalPaidSPP + totalPaidDSP + totalPaidUjian;
      const sisaTunggakan = Math.max(0, totalTagihan - totalTerbayar);

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
        rombel: siswa.rombel,
        waliKelas: siswa.waliKelas,
        pipStatus: siswa.pipStatus,
        nominalPip: siswa.nominalPip || (siswa.pipStatus === 'Penerima Aktif' ? 1800000 : 0),
        sppBulanan: sppPerBulan,
        bulanMenunggak,
        totalTagihanSPP,
        tagihanDSP,
        terbayarDSP: totalPaidDSP,
        tagihanUjian,
        terbayarUjian: totalPaidUjian,
        totalTagihan,
        totalTerbayar,
        sisaTunggakan,
        status,
        terakhirBayar: studentTx.length > 0 ? studentTx[0].tanggal : override.terakhirBayar,
        catatan: override.catatan
      };
    });
  }, [siswaList, paymentOverrides, transaksiList]);

  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRombel, setSelectedRombel] = useState('Semua');
  const [selectedStatus, setSelectedStatus] = useState('Semua');
  const [filterPipOnly, setFilterPipOnly] = useState(false);

  // Available Rombels from siswaList
  const rombelOptions = useMemo(() => {
    const set = new Set<string>();
    siswaList.forEach(s => set.add(s.rombel));
    return ['Semua', ...Array.from(set).sort()];
  }, [siswaList]);

  // Filtered List
  const filteredPembayaran = useMemo(() => {
    return pembayaranList.filter(item => {
      const matchSearch =
        item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nisn.includes(searchQuery) ||
        item.nipd.includes(searchQuery);

      const matchRombel = selectedRombel === 'Semua' || item.rombel === selectedRombel;
      const matchStatus = selectedStatus === 'Semua' || item.status === selectedStatus;
      const matchPip = !filterPipOnly || item.pipStatus === 'Penerima Aktif' || item.pipStatus === 'Nominasi';

      return matchSearch && matchRombel && matchStatus && matchPip;
    });
  }, [pembayaranList, searchQuery, selectedRombel, selectedStatus, filterPipOnly]);

  // Summary Metrics
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
  const [payKategori, setPayKategori] = useState<'SPP Bulanan' | 'DSP / Uang Gedung' | 'Praktik & Ujian' | 'Lainnya'>('SPP Bulanan');
  const [payMonths, setPayMonths] = useState<string[]>([]);
  const [payAmount, setPayAmount] = useState<number>(150000);
  const [payMetode, setPayMetode] = useState<'Tunai Kasir' | 'Transfer Bank BNI' | 'Alokasi Dana PIP'>('Tunai Kasir');
  const [payCatatan, setPayCatatan] = useState('');

  // Modal State for Printing Letter & Receipt
  const [selectedLetterItem, setSelectedLetterItem] = useState<PembayaranItem | null>(null);
  const [selectedReceiptItem, setSelectedReceiptItem] = useState<TransaksiKwitansi | null>(null);

  // Handle Opening Pay Modal
  const handleOpenPay = (student: PembayaranItem) => {
    setSelectedStudentForPay(student);
    setPayKategori('SPP Bulanan');
    const firstUnpaid = student.bulanMenunggak[0] || 'Juli';
    setPayMonths([firstUnpaid]);
    setPayAmount(student.sppBulanan);
    setPayMetode(student.pipStatus === 'Penerima Aktif' ? 'Alokasi Dana PIP' : 'Tunai Kasir');
    setPayCatatan(`Pembayaran SPP Bulan ${firstUnpaid}`);
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
      bulanDibayar: payKategori === 'SPP Bulanan' ? payMonths : undefined,
      jumlah: payAmount,
      metode: payMetode,
      keterangan: payCatatan || `Pembayaran ${payKategori}`,
      penerima: schoolInfo?.operatorName || 'Bendahara SMA NU Kaplongan'
    };

    saveTransaksi([newTx, ...transaksiList]);

    // Notify operator activity
    if (onAddActivity) {
      onAddActivity(
        `Pembayaran ${payKategori} Siswa`,
        `Diterima Rp ${payAmount.toLocaleString('id-ID')} via ${payMetode} dari ${selectedStudentForPay.nama} (${selectedStudentForPay.rombel}).`
      );
    }

    onShowToast(`Pembayaran Rp ${payAmount.toLocaleString('id-ID')} dari ${selectedStudentForPay.nama} berhasil dicatat! Kwitansi: ${receiptNo}`);
    setSelectedStudentForPay(null);
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (pembayaranList.length === 0) {
      alert("Tidak ada data untuk diekspor.");
      return;
    }
    const headers = ['No', 'NISN', 'NIPD', 'Nama Siswa', 'Rombel', 'Status PIP', 'Total Tagihan', 'Total Terbayar', 'Sisa Tunggakan', 'Status'];
    const rows = filteredPembayaran.map((item, index) => [
      index + 1,
      `'${item.nisn}`,
      `'${item.nipd}`,
      `"${item.nama}"`,
      `"${item.rombel}"`,
      `"${item.pipStatus}"`,
      item.totalTagihan,
      item.totalTerbayar,
      item.sisaTunggakan,
      item.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Tunggakan_Siswa_SMA_NU_Kaplongan_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast("File rekapitulasi tunggakan siswa berhasil diunduh.");
  };

  return (
    <div className="flex flex-col gap-5">
      {/* 1. VIEW TAB: TUNGGAKAN DAN SPP */}
      {subType === 'tunggakan-dan-spp' && (
        <>
          {/* Top Financial Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  Dari total <b>{pembayaranList.length}</b> siswa terdaftar
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
                  {summaryMetrics.pctLunas}% Pembayaran Terpenuhi
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
                  <b>{summaryMetrics.countMenunggak}</b> Siswa belum melunasi
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
                  Tersedia Rp {summaryMetrics.totalDanaPipTersedia.toLocaleString('id-ID')} dana BNI
                </div>
              </div>
            </div>
          </div>

          {/* Connected with Operator Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-500/10 via-blue-500/5 to-transparent border border-sky-500/20 dark:border-sky-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">hub</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Integrasi Otomatis Dapodik Operator &amp; Bendahara Sekolah
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Daftar siswa, rombel, dan status penerima PIP tersinkron langsung dari Master Data Operator ({schoolInfo?.operatorName || 'Bagas Pratama, S.Kom'}).
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportCSV}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-all shadow-xs"
              >
                <span className="material-symbols-outlined text-sm text-emerald-600">download</span>
                <span>Ekspor CSV</span>
              </button>
              {onNavigateToSiswa && (
                <button
                  type="button"
                  onClick={onNavigateToSiswa}
                  className="px-3 py-1.5 rounded-xl bg-primary dark:bg-sky-600 hover:bg-primary-container dark:hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <span className="material-symbols-outlined text-sm">groups</span>
                  <span>Buka Data Siswa Dapodik</span>
                </button>
              )}
            </div>
          </div>

          {/* Table Container */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-surface-container/80 dark:border-slate-800 shadow-xs space-y-4">
            {/* Toolbar Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
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
                {/* Rombel Filter */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Rombel:</span>
                  <select
                    value={selectedRombel}
                    onChange={(e) => setSelectedRombel(e.target.value)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    {rombelOptions.map((r) => (
                      <option key={r} value={r}>{r}</option>
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
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                    filterPipOnly
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
                  <span>Penerima PIP Saja</span>
                </button>
              </div>
            </div>

            {/* Empty State */}
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
                Tidak ada data siswa yang cocok dengan filter pencarian &ldquo;{searchQuery}&rdquo;.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold">
                      <th className="py-3 px-3">Siswa &amp; Identitas</th>
                      <th className="py-3 px-3">Rombel</th>
                      <th className="py-3 px-3">Status PIP</th>
                      <th className="py-3 px-3 text-right">Total Tagihan</th>
                      <th className="py-3 px-3 text-right">Sudah Dibayar</th>
                      <th className="py-3 px-3 text-right">Sisa Tunggakan</th>
                      <th className="py-3 px-3 text-center">Status</th>
                      <th className="py-3 px-3 text-center">Aksi Bendahara</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/70">
                    {filteredPembayaran.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-800 dark:text-slate-100">{item.nama}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            NISN: {item.nisn} • NIPD: {item.nipd}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300">
                            {item.rombel}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          {item.pipStatus === 'Penerima Aktif' ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800 font-bold inline-flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              <span>PIP: Rp {item.nominalPip.toLocaleString('id-ID')}</span>
                            </span>
                          ) : item.pipStatus === 'Nominasi' ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800 font-semibold">
                              Nominasi PIP
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right font-medium text-slate-700 dark:text-slate-300">
                          Rp {item.totalTagihan.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                          Rp {item.totalTerbayar.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-3 text-right">
                          {item.sisaTunggakan > 0 ? (
                            <span className="font-bold text-rose-600 dark:text-rose-400">
                              Rp {item.sisaTunggakan.toLocaleString('id-ID')}
                            </span>
                          ) : (
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Lunas</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {item.status === 'Lunas' ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold">
                              Lunas
                            </span>
                          ) : item.status === 'Mencicil' ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-bold">
                              Mencicil
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-bold">
                              Menunggak
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {item.sisaTunggakan > 0 ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleOpenPay(item)}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 transition-all shadow-2xs"
                                  title="Catat Pembayaran"
                                >
                                  <span className="material-symbols-outlined text-sm">payments</span>
                                  <span>Bayar</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSelectedLetterItem(item)}
                                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1 transition-all"
                                  title="Cetak Surat Pemberitahuan Tunggakan"
                                >
                                  <span className="material-symbols-outlined text-sm">mail</span>
                                  <span>Surat</span>
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  const tx = transaksiList.find(t => t.siswaId === item.siswaId);
                                  if (tx) setSelectedReceiptItem(tx);
                                  else onShowToast("Belum ada kwitansi tersimpan untuk siswa ini.");
                                }}
                                className="px-2.5 py-1 rounded-lg bg-sky-100 dark:bg-sky-950/60 hover:bg-sky-200 text-sky-800 dark:text-sky-300 font-semibold flex items-center gap-1 transition-all"
                              >
                                <span className="material-symbols-outlined text-sm">receipt</span>
                                <span>Kwitansi</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* 2. VIEW TAB: RIWAYAT KWITANSI & TRANSAKSI */}
      {subType === 'riwayat-kwitansi-bayar' && (
        <div className="p-5 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-surface-container/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Riwayat Transaksi &amp; Arsip Kwitansi Bendahara
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Daftar bukti pembayaran yang telah dicatat dan terverifikasi kas sekolah.
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
                          className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold flex items-center gap-1 mx-auto"
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

      {/* 3. VIEW TAB: REKAP DAN SURAT TUNGGAKAN */}
      {subType === 'rekap-surat-tunggakan' && (
        <div className="p-5 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-surface-container/80 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Rekapitulasi Tunggakan per Rombongan Belajar
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Laporan keuangan berkala untuk Kepala Sekolah &amp; Komite Yayasan Darul Ma'arif.
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <span className="material-symbols-outlined text-sm">print</span>
              <span>Cetak Laporan Format A4</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rombelOptions.filter(r => r !== 'Semua').map(rombelName => {
              const rSiswa = pembayaranList.filter(p => p.rombel === rombelName);
              const rTagihan = rSiswa.reduce((acc, p) => acc + p.totalTagihan, 0);
              const rTerbayar = rSiswa.reduce((acc, p) => acc + p.totalTerbayar, 0);
              const rTunggakan = rSiswa.reduce((acc, p) => acc + p.sisaTunggakan, 0);
              const rMenunggakCount = rSiswa.filter(p => p.sisaTunggakan > 0).length;
              const rPct = rTagihan > 0 ? Math.round((rTerbayar / rTagihan) * 100) : 0;

              return (
                <div key={rombelName} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{rombelName}</span>
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

      {/* MODAL: INPUT PEMBAYARAN */}
      {selectedStudentForPay && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl max-w-lg w-full p-5 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                  Pencatatan Pembayaran Siswa
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedStudentForPay.nama} ({selectedStudentForPay.rombel}) • Sisa: Rp {selectedStudentForPay.sisaTunggakan.toLocaleString('id-ID')}
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
                    const cat = e.target.value as any;
                    setPayKategori(cat);
                    if (cat === 'SPP Bulanan') {
                      setPayAmount(selectedStudentForPay.sppBulanan);
                    } else if (cat === 'DSP / Uang Gedung') {
                      setPayAmount(Math.max(0, selectedStudentForPay.tagihanDSP - selectedStudentForPay.terbayarDSP));
                    } else if (cat === 'Praktik & Ujian') {
                      setPayAmount(Math.max(0, selectedStudentForPay.tagihanUjian - selectedStudentForPay.terbayarUjian));
                    }
                  }}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                >
                  <option value="SPP Bulanan">SPP Bulanan (Rp {selectedStudentForPay.sppBulanan.toLocaleString('id-ID')}/bln)</option>
                  <option value="DSP / Uang Gedung">DSP / Uang Gedung (Sisa: Rp {(selectedStudentForPay.tagihanDSP - selectedStudentForPay.terbayarDSP).toLocaleString('id-ID')})</option>
                  <option value="Praktik & Ujian">Praktik &amp; Ujian (Sisa: Rp {(selectedStudentForPay.tagihanUjian - selectedStudentForPay.terbayarUjian).toLocaleString('id-ID')})</option>
                  <option value="Lainnya">Lainnya / Titipan</option>
                </select>
              </div>

              {/* Bulan Checkbox if SPP */}
              {payKategori === 'SPP Bulanan' && (
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
                  placeholder="Contoh: Lunas SPP Juli-Agustus, titipan orang tua"
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedStudentForPay(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">check</span>
                  <span>Simpan Pembayaran</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CETAK KWITANSI PEMBAYARAN RESMI A4 */}
      {selectedReceiptItem && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full p-6 space-y-4 my-8">
            <div className="flex items-center justify-between no-print border-b pb-2">
              <span className="font-bold text-sm text-slate-700">Preview Kwitansi Pembayaran Resmi</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm">print</span>
                  <span>Cetak A4</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedReceiptItem(null)}
                  className="px-3 py-1.5 rounded-xl border text-xs font-semibold"
                >
                  Tutup
                </button>
              </div>
            </div>

            {/* Kwitansi Body (Format Kedinasan Kop SMA NU Kaplongan) */}
            <div className="border border-slate-300 p-6 rounded-xl space-y-4 bg-white print:border-none print:p-0">
              {/* Kop Surat Resmi */}
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

      {/* MODAL: CETAK SURAT PEMBERITAHUAN TUNGGAKAN A4 */}
      {selectedLetterItem && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full p-6 space-y-4 my-8">
            <div className="flex items-center justify-between no-print border-b pb-2">
              <span className="font-bold text-sm text-slate-700">Preview Surat Pemberitahuan Tunggakan Resmi</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm">print</span>
                  <span>Cetak A4</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLetterItem(null)}
                  className="px-3 py-1.5 rounded-xl border text-xs font-semibold"
                >
                  Tutup
                </button>
              </div>
            </div>

            {/* Surat Resmi A4 */}
            <div className="border border-slate-300 p-6 rounded-xl space-y-3 bg-white text-xs print:border-none print:p-0">
              {/* Kop Kedinasan SMA NU Kaplongan */}
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

              {/* Header Surat */}
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
                Puji syukur ke hadirat Allah SWT atas limpahan rahmat dan karunia-Nya. Dalam rangka mendukung kelancaran kegiatan belajar mengajar serta tertib administrasi di SMA NU Kaplongan Tahun Ajaran 2026/2027, kami memberitahukan rincian kewajiban administrasi keuangan ananda yang belum terselesaikan sebagai berikut:
              </p>

              {/* Tabel Rincian Tunggakan */}
              <table className="w-full border-collapse border border-slate-400 my-2">
                <thead>
                  <tr className="bg-slate-100 text-slate-700">
                    <th className="border border-slate-400 p-1.5 text-center w-10">No</th>
                    <th className="border border-slate-400 p-1.5 text-left">Komponen Biaya</th>
                    <th className="border border-slate-400 p-1.5 text-left">Keterangan / Periode</th>
                    <th className="border border-slate-400 p-1.5 text-right w-28">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-400 p-1.5 text-center">1</td>
                    <td className="border border-slate-400 p-1.5">SPP Bulanan</td>
                    <td className="border border-slate-400 p-1.5">Bulan: {selectedLetterItem.bulanMenunggak.join(', ') || '-'}</td>
                    <td className="border border-slate-400 p-1.5 text-right">
                      Rp {(selectedLetterItem.totalTagihanSPP - selectedLetterItem.sppBulanan * (6 - selectedLetterItem.bulanMenunggak.length)).toLocaleString('id-ID')}
                    </td>
                  </tr>
                  {selectedLetterItem.tagihanDSP > selectedLetterItem.terbayarDSP && (
                    <tr>
                      <td className="border border-slate-400 p-1.5 text-center">2</td>
                      <td className="border border-slate-400 p-1.5">DSP / Uang Gedung</td>
                      <td className="border border-slate-400 p-1.5">Kewajiban Awal Masuk</td>
                      <td className="border border-slate-400 p-1.5 text-right">
                        Rp {(selectedLetterItem.tagihanDSP - selectedLetterItem.terbayarDSP).toLocaleString('id-ID')}
                      </td>
                    </tr>
                  )}
                  {selectedLetterItem.tagihanUjian > selectedLetterItem.terbayarUjian && (
                    <tr>
                      <td className="border border-slate-400 p-1.5 text-center">3</td>
                      <td className="border border-slate-400 p-1.5">Biaya Ujian &amp; Praktik</td>
                      <td className="border border-slate-400 p-1.5">Semester Ganjil 2026/2027</td>
                      <td className="border border-slate-400 p-1.5 text-right">
                        Rp {(selectedLetterItem.tagihanUjian - selectedLetterItem.terbayarUjian).toLocaleString('id-ID')}
                      </td>
                    </tr>
                  )}
                  <tr className="bg-slate-100 font-bold">
                    <td colSpan={3} className="border border-slate-400 p-1.5 text-right">TOTAL SISA TUNGGAKAN:</td>
                    <td className="border border-slate-400 p-1.5 text-right font-black text-rose-600">
                      Rp {selectedLetterItem.sisaTunggakan.toLocaleString('id-ID')}
                    </td>
                  </tr>
                </tbody>
              </table>

              {selectedLetterItem.pipStatus === 'Penerima Aktif' && (
                <div className="p-2 rounded bg-amber-50 border border-amber-300 text-[11px] text-amber-800">
                  <b>Catatan Khusus Penerima PIP:</b> Ananda tercatat sebagai Penerima Aktif Program Indonesia Pintar (PIP BNI) sebesar <b>Rp {selectedLetterItem.nominalPip.toLocaleString('id-ID')}</b>. Pembayaran dapat diselesaikan saat pencairan kolektif bersama pihak sekolah.
                </div>
              )}

              <p className="text-justify leading-relaxed">
                Demikian surat pemberitahuan ini kami sampaikan. Pembayaran dapat dilakukan melalui kasir bendahara sekolah atau transfer ke rekening resmi Bank BNI SMA NU Kaplongan. Atas perhatian dan kerja sama Bapak/Ibu, kami ucapkan terima kasih.
                <br />
                <i>Wassalamu’alaikum Warahmatullahi Wabarakatuh.</i>
              </p>

              {/* Tanda Tangan */}
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
    </div>
  );
};

import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_GTK_LIST, MOCK_SISWA_LIST, MOCK_ROMBEL_LIST, DEFAULT_MAPEL_LIST, GTKItem, SiswaItem, RombelItem, MapelItem } from '../../data/modulesData';
import { SchoolInfo } from '../../types';
import { GtkFormModal } from './master/GtkFormModal';
import { SiswaFormModal } from './master/SiswaFormModal';
import { BulkImportModal } from './master/BulkImportModal';
import { DetailViewModal } from './master/DetailViewModal';
import { RombelFormModal } from './master/RombelFormModal';
import { RombelSiswaModal } from './master/RombelSiswaModal';
import { RombelJadwalModal } from './master/RombelJadwalModal';
import { MapelFormModal } from './master/MapelFormModal';
import { MapelJpAdjustModal } from './master/MapelJpAdjustModal';

export interface MasterDataViewProps {
  subType: 'data-gtk' | 'data-peserta-didik' | 'data-rombel' | 'mata-pelajaran-dan-kurikulum';
  schoolInfo?: SchoolInfo;
  onShowToast: (msg: string) => void;
  onNavigateToJurnal?: () => void;
  gtkList?: GTKItem[];
  setGtkList?: React.Dispatch<React.SetStateAction<GTKItem[]>>;
  siswaList?: SiswaItem[];
  setSiswaList?: React.Dispatch<React.SetStateAction<SiswaItem[]>>;
  rombelList?: RombelItem[];
  setRombelList?: React.Dispatch<React.SetStateAction<RombelItem[]>>;
  mapelList?: MapelItem[];
  setMapelList?: React.Dispatch<React.SetStateAction<MapelItem[]>>;
}

export const MasterDataView: React.FC<MasterDataViewProps> = ({
  subType,
  onShowToast,
  gtkList: propGtkList,
  setGtkList: propSetGtkList,
  siswaList: propSiswaList,
  setSiswaList: propSetSiswaList,
  rombelList: propRombelList,
  setRombelList: propSetRombelList,
  mapelList: propMapelList,
  setMapelList: propSetMapelList
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Master data in state with localStorage persistence (fallback if props not passed)
  const [internalGtkList, setInternalGtkList] = useState<GTKItem[]>(() => {
    try {
      const saved = localStorage.getItem('sim_ops_master_gtk');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return MOCK_GTK_LIST;
  });
  const gtkList = propGtkList ?? internalGtkList;
  const setGtkList = propSetGtkList ?? setInternalGtkList;

  const [internalSiswaList, setInternalSiswaList] = useState<SiswaItem[]>(() => {
    try {
      const saved = localStorage.getItem('sim_ops_master_siswa');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return MOCK_SISWA_LIST;
  });
  const siswaList = propSiswaList ?? internalSiswaList;
  const setSiswaList = propSetSiswaList ?? setInternalSiswaList;

  const [internalRombelList, setInternalRombelList] = useState<RombelItem[]>(() => {
    try {
      const saved = localStorage.getItem('sim_ops_master_rombel');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return MOCK_ROMBEL_LIST;
  });
  const rombelList = propRombelList ?? internalRombelList;
  const setRombelList = propSetRombelList ?? setInternalRombelList;

  const [internalMapelList, setInternalMapelList] = useState<MapelItem[]>(() => {
    try {
      const saved = localStorage.getItem('sim_ops_master_mapel');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_MAPEL_LIST;
  });
  const mapelList = propMapelList ?? internalMapelList;
  const setMapelList = propSetMapelList ?? setInternalMapelList;

  // Modals state
  const [isGtkModalOpen, setIsGtkModalOpen] = useState(false);
  const [editingGtk, setEditingGtk] = useState<GTKItem | null>(null);

  const [isSiswaModalOpen, setIsSiswaModalOpen] = useState(false);
  const [editingSiswa, setEditingSiswa] = useState<SiswaItem | null>(null);

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importType, setImportType] = useState<'gtk' | 'siswa'>('gtk');

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailType, setDetailType] = useState<'gtk' | 'siswa'>('gtk');
  const [detailData, setDetailData] = useState<any>(null);

  // Rombel Modals state
  const [isRombelModalOpen, setIsRombelModalOpen] = useState(false);
  const [editingRombel, setEditingRombel] = useState<RombelItem | null>(null);
  const [isRombelSiswaModalOpen, setIsRombelSiswaModalOpen] = useState(false);
  const [activeRombelForSiswa, setActiveRombelForSiswa] = useState<RombelItem | null>(null);
  const [isRombelJadwalModalOpen, setIsRombelJadwalModalOpen] = useState(false);
  const [activeRombelForJadwal, setActiveRombelForJadwal] = useState<RombelItem | null>(null);

  // Mapel Modals state
  const [isMapelModalOpen, setIsMapelModalOpen] = useState(false);
  const [editingMapel, setEditingMapel] = useState<MapelItem | null>(null);
  const [isMapelJpAdjustModalOpen, setIsMapelJpAdjustModalOpen] = useState(false);

  // Synchronize state changes to localStorage
  useEffect(() => {
    localStorage.setItem('sim_ops_master_gtk', JSON.stringify(gtkList));
  }, [gtkList]);

  useEffect(() => {
    localStorage.setItem('sim_ops_master_siswa', JSON.stringify(siswaList));
  }, [siswaList]);

  useEffect(() => {
    localStorage.setItem('sim_ops_master_rombel', JSON.stringify(rombelList));
  }, [rombelList]);

  useEffect(() => {
    localStorage.setItem('sim_ops_master_mapel', JSON.stringify(mapelList));
  }, [mapelList]);

  // Export to CSV helper
  const exportToCSV = (headers: string[], rows: (string | number)[][], filename: string) => {
    const csvContent = "\uFEFF" + [
      headers.join(","),
      ...rows.map(row => row.map(val => `"${String(val ?? '').replace(/"/g, '""')}"`).join(","))
    ].join("\r\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // GTK Handlers
  const handleSaveGtk = (newGtk: GTKItem) => {
    setGtkList(prev => {
      const exists = prev.some(g => g.id === newGtk.id);
      if (exists) {
        return prev.map(g => g.id === newGtk.id ? newGtk : g);
      }
      return [newGtk, ...prev];
    });
    onShowToast(`Data GTK "${newGtk.nama}" berhasil disimpan!`);
  };

  const handleDeleteGtk = (id: string) => {
    setGtkList(prev => prev.filter(g => g.id !== id));
    onShowToast('Data GTK berhasil dihapus.');
  };

  const handleImportGtk = (items: GTKItem[], replace: boolean) => {
    if (replace) {
      setGtkList(items);
      onShowToast(`Berhasil mengganti data master dengan ${items.length} GTK baru.`);
    } else {
      setGtkList(prev => [...items, ...prev]);
      onShowToast(`Berhasil menambahkan ${items.length} GTK ke data master.`);
    }
  };

  const handleExportGtk = () => {
    const headers = ['Nama Lengkap', 'NIP/NUPTK', 'Jenis PTK', 'Status Kepegawaian', 'Mata Pelajaran', 'JTM Tatap Muka', 'JTM Tugas Tambahan', 'Total JTM', 'Status Info GTK', 'Sertifikasi', 'No Telepon'];
    const rows = gtkList.map(g => [
      g.nama,
      g.nipNuptk,
      g.jenisPtk,
      g.statusKepegawaian,
      g.mapelUtama,
      g.jtmTatapMuka,
      g.jtmTugasTambahan,
      g.totalJtm,
      g.statusInfoGtk,
      g.sertifikasi,
      g.telepon || '-'
    ]);
    exportToCSV(headers, rows, `Data_Master_GTK_SMA_NU_Kaplongan_${new Date().toISOString().slice(0, 10)}.csv`);
    onShowToast(`Berhasil mengekspor ${gtkList.length} data GTK ke file CSV Excel!`);
  };

  // Siswa Handlers
  const handleSaveSiswa = (newSiswa: SiswaItem) => {
    setSiswaList(prev => {
      const exists = prev.some(s => s.id === newSiswa.id);
      if (exists) {
        return prev.map(s => s.id === newSiswa.id ? newSiswa : s);
      }
      return [newSiswa, ...prev];
    });
    onShowToast(`Data siswa "${newSiswa.nama}" berhasil disimpan!`);
  };

  const handleDeleteSiswa = (id: string) => {
    setSiswaList(prev => prev.filter(s => s.id !== id));
    onShowToast('Data siswa berhasil dihapus.');
  };

  const handleImportSiswa = (items: SiswaItem[], replace: boolean) => {
    if (replace) {
      setSiswaList(items);
      onShowToast(`Berhasil mengganti data master dengan ${items.length} siswa baru.`);
    } else {
      setSiswaList(prev => [...items, ...prev]);
      onShowToast(`Berhasil menambahkan ${items.length} siswa ke data master.`);
    }
  };

  const handleExportSiswa = () => {
    const headers = ['Nama Siswa', 'NISN', 'NIPD', 'Rombel', 'Jenis Kelamin', 'Status Dukcapil (NIK)', 'Status Bantuan PIP', 'Nominal PIP', 'Wali Kelas'];
    const rows = siswaList.map(s => [
      s.nama,
      s.nisn,
      s.nipd,
      s.rombel,
      s.jenisKelamin,
      s.nikStatus,
      s.pipStatus,
      s.nominalPip || 0,
      s.waliKelas
    ]);
    exportToCSV(headers, rows, `Data_Master_Siswa_SMA_NU_Kaplongan_${new Date().toISOString().slice(0, 10)}.csv`);
    onShowToast(`Berhasil mengekspor ${siswaList.length} data Siswa ke file CSV Excel!`);
  };

  // Rombel Handlers
  const handleSaveRombel = (newRombel: RombelItem) => {
    setRombelList(prev => {
      const exists = prev.some(r => r.id === newRombel.id);
      if (exists) {
        return prev.map(r => r.id === newRombel.id ? newRombel : r);
      }
      return [newRombel, ...prev];
    });
    onShowToast(`Rombel "${newRombel.namaRombel}" berhasil disimpan!`);
  };

  const handleDeleteRombel = (id: string) => {
    setRombelList(prev => prev.filter(r => r.id !== id));
    onShowToast('Rombongan belajar berhasil dihapus.');
  };

  const handleExportRombel = () => {
    const headers = ['Nama Rombel', 'Tingkat', 'Kurikulum', 'Ruangan', 'Wali Kelas', 'Siswa Laki-laki', 'Siswa Perempuan', 'Total Siswa'];
    const rows = rombelList.map(r => [
      r.namaRombel,
      r.tingkat,
      r.kurikulum,
      r.ruang,
      r.waliKelas,
      r.jumlahSiswaL,
      r.jumlahSiswaP,
      r.totalSiswa
    ]);
    exportToCSV(headers, rows, `Data_Rombel_SMA_NU_Kaplongan_${new Date().toISOString().slice(0, 10)}.csv`);
    onShowToast(`Berhasil mengekspor ${rombelList.length} data Rombel ke file CSV Excel!`);
  };

  // Mapel Handlers
  const handleSaveMapel = (newMapel: MapelItem) => {
    setMapelList(prev => {
      const exists = prev.some(m => m.id === newMapel.id);
      if (exists) {
        return prev.map(m => m.id === newMapel.id ? newMapel : m);
      }
      return [newMapel, ...prev];
    });
    onShowToast(`Mata pelajaran "${newMapel.namaMapel}" berhasil disimpan!`);
  };

  const handleDeleteMapel = (id: string) => {
    setMapelList(prev => prev.filter(m => m.id !== id));
    onShowToast('Mata pelajaran berhasil dihapus.');
  };

  const handleSaveAllMapel = (updated: MapelItem[]) => {
    setMapelList(updated);
    onShowToast('Alokasi beban JP kurikulum berhasil diperbarui!');
  };

  const handleExportMapel = () => {
    const headers = ['Kode Mapel', 'Nama Mata Pelajaran', 'Kategori', 'Tingkat / Fase', 'Alokasi JP/Minggu', 'Guru Pengampu'];
    const rows = mapelList.map(m => [
      m.kodeMapel,
      m.namaMapel,
      m.kategori,
      m.fase,
      m.alokasiJp,
      m.guruPengampu
    ]);
    exportToCSV(headers, rows, `Struktur_Kurikulum_Mapel_SMA_NU_Kaplongan_${new Date().toISOString().slice(0, 10)}.csv`);
    onShowToast(`Berhasil mengekspor struktur mata pelajaran ke Excel!`);
  };

  // GTK Filtering
  const filteredGTK = useMemo(() => {
    return gtkList.filter((g) => {
      const matchSearch =
        g.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.mapelUtama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.nipNuptk.includes(searchQuery);
      const matchFilter =
        filterStatus === 'ALL' ||
        (filterStatus === 'VALID' && g.statusInfoGtk === 'Valid') ||
        (filterStatus === 'RESIDU' && g.statusInfoGtk !== 'Valid') ||
        (filterStatus === 'SERTIFIKASI' && g.sertifikasi === 'Sudah Sertifikasi');
      return matchSearch && matchFilter;
    });
  }, [gtkList, searchQuery, filterStatus]);

  // Siswa Filtering
  const filteredSiswa = useMemo(() => {
    return siswaList.filter((s) => {
      const matchSearch =
        s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.nisn.includes(searchQuery) ||
        s.rombel.toLowerCase().includes(searchQuery.toLowerCase());
      const matchFilter =
        filterStatus === 'ALL' ||
        (filterStatus === 'VALID' && s.nikStatus === 'Valid') ||
        (filterStatus === 'RESIDU' && s.nikStatus !== 'Valid') ||
        (filterStatus === 'PIP' && s.pipStatus !== 'Bukan Penerima');
      return matchSearch && matchFilter;
    });
  }, [siswaList, searchQuery, filterStatus]);

  // Rombel Filtering
  const filteredRombel = useMemo(() => {
    return rombelList.filter((r) => {
      const matchSearch =
        r.namaRombel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.ruang.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.waliKelas.toLowerCase().includes(searchQuery.toLowerCase());
      const matchFilter =
        filterStatus === 'ALL' ||
        (filterStatus === 'X' && r.tingkat === 'X') ||
        (filterStatus === 'XI' && r.tingkat === 'XI') ||
        (filterStatus === 'XII' && r.tingkat === 'XII');
      return matchSearch && matchFilter;
    });
  }, [rombelList, searchQuery, filterStatus]);

  // Mapel Filtering
  const filteredMapel = useMemo(() => {
    return mapelList.filter((m) => {
      const matchSearch =
        m.namaMapel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.kodeMapel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.guruPengampu.toLowerCase().includes(searchQuery.toLowerCase());
      const matchFilter =
        filterStatus === 'ALL' ||
        (filterStatus === 'WAJIB' && m.kategori.includes('Wajib')) ||
        (filterStatus === 'PILIHAN' && m.kategori.includes('Pilihan')) ||
        (filterStatus === 'MULOK' && m.kategori.includes('Muatan Lokal'));
      return matchSearch && matchFilter;
    });
  }, [mapelList, searchQuery, filterStatus]);

  return (
    <div className="flex flex-col gap-space-lg">
      {/* 1. DATA GTK VIEW */}
      {subType === 'data-gtk' && (
        <>
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
              <span className="text-xs text-on-surface-variant font-medium">Total Pendidik &amp; Tenaga Kependidikan</span>
              <div className="text-2xl font-bold text-primary mt-1">{gtkList.length} Orang</div>
              <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">100% Terdaftar di Dapodik</span>
            </div>
            <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
              <span className="text-xs text-on-surface-variant font-medium">Sudah Bersertifikasi Pendidik</span>
              <div className="text-2xl font-bold text-primary mt-1">
                {gtkList.filter((g) => g.sertifikasi === 'Sudah Sertifikasi').length} Guru
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">Tunjangan Profesi (SKTP) Aktif</span>
            </div>
            <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
              <span className="text-xs text-on-surface-variant font-medium">Info GTK Valid (24+ JTM)</span>
              <div className="text-2xl font-bold text-emerald-700 mt-1">
                {gtkList.filter((g) => g.statusInfoGtk === 'Valid').length} Guru
              </div>
              <span className="text-[11px] text-on-surface-variant mt-1 block">Beban Mengajar Terpenuhi</span>
            </div>
            <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
              <span className="text-xs text-on-surface-variant font-medium">Perlu Penyesuaian Beban JTM</span>
              <div className="text-2xl font-bold text-amber-700 mt-1">
                {gtkList.filter((g) => g.statusInfoGtk !== 'Valid').length} Guru
              </div>
              <span className="text-[11px] text-amber-700 font-semibold mt-1 block">Kurang Jam Tatap Muka</span>
            </div>
          </div>

          {/* Action & Filter Toolbar */}
          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative w-full">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-outline">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama guru, NIP/NUPTK, atau mata pelajaran..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container-low text-xs border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex rounded-xl bg-surface-container-low p-1 text-xs border border-surface-container">
                <button
                  type="button"
                  onClick={() => setFilterStatus('ALL')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filterStatus === 'ALL' ? 'bg-primary text-white font-bold' : 'text-on-surface-variant'
                  }`}
                >
                  Semua ({gtkList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('VALID')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filterStatus === 'VALID' ? 'bg-primary text-white font-bold' : 'text-on-surface-variant'
                  }`}
                >
                  Valid
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('RESIDU')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filterStatus === 'RESIDU' ? 'bg-primary text-white font-bold' : 'text-on-surface-variant'
                  }`}
                >
                  Kurang JTM
                </button>
              </div>

              <button
                type="button"
                onClick={handleExportGtk}
                className="px-3.5 py-2 rounded-xl bg-surface-container-low text-primary text-xs font-semibold hover:bg-surface-container flex items-center gap-1.5 border border-surface-container"
              >
                <span className="material-symbols-outlined text-base text-emerald-700">table_view</span>
                <span>Ekspor GTK</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setImportType('gtk');
                  setIsImportModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-surface-container-low text-primary text-xs font-semibold hover:bg-surface-container flex items-center gap-1.5 border border-surface-container"
              >
                <span className="material-symbols-outlined text-base text-primary">upload_file</span>
                <span>Import Banyak</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingGtk(null);
                  setIsGtkModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container flex items-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-base">person_add</span>
                <span>Tambah GTK</span>
              </button>
            </div>
          </div>

          {/* Table GTK */}
          <div className="overflow-x-auto rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-surface-container-low text-primary font-bold border-b border-surface-container">
                  <th className="py-3 px-4">Nama Lengkap &amp; NIP/NUPTK</th>
                  <th className="py-3 px-3">Jenis PTK &amp; Status</th>
                  <th className="py-3 px-3">Mata Pelajaran Utama</th>
                  <th className="py-3 px-3 text-center">Tatap Muka</th>
                  <th className="py-3 px-3 text-center">Tugas Tambahan</th>
                  <th className="py-3 px-3 text-center">Total JTM</th>
                  <th className="py-3 px-3 text-center">Info GTK</th>
                  <th className="py-3 px-3 text-center">Sertifikasi</th>
                  <th className="py-3 px-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container/60">
                {filteredGTK.map((g) => (
                  <tr key={g.id} className="hover:bg-surface-container-low/40">
                    <td className="py-3 px-4">
                      <div className="font-bold text-primary">{g.nama}</div>
                      <div className="text-[11px] text-on-surface-variant font-mono mt-0.5">NIP: {g.nipNuptk}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-on-surface block">{g.jenisPtk}</span>
                      <span className="px-2 py-0.5 rounded-full bg-surface-container text-[10px] font-bold text-outline inline-block mt-0.5">
                        {g.statusKepegawaian}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-on-surface">{g.mapelUtama}</span>
                      {g.tugasTambahan && g.tugasTambahan !== 'Tidak Ada' && (
                        <span className="text-[10.5px] text-primary block mt-0.5 font-semibold">
                          + {g.tugasTambahan}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-on-surface">{g.jtmTatapMuka} Jam</td>
                    <td className="py-3 px-3 text-center font-semibold text-on-surface-variant">{g.jtmTugasTambahan} Jam</td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-xs ${
                          g.totalJtm >= 24 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {g.totalJtm} Jam
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          g.statusInfoGtk === 'Valid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        <span className="material-symbols-outlined text-xs">
                          {g.statusInfoGtk === 'Valid' ? 'check_circle' : 'warning'}
                        </span>
                        <span>{g.statusInfoGtk}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-[11px] text-on-surface-variant font-medium">{g.sertifikasi}</span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setDetailType('gtk');
                            setDetailData(g);
                            setIsDetailModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-semibold text-[11px]"
                        >
                          Detail
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingGtk(g);
                            setIsGtkModalOpen(true);
                          }}
                          title="Edit GTK"
                          className="w-7 h-7 rounded-lg hover:bg-surface-container flex items-center justify-center text-primary"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Hapus GTK ${g.nama}?`)) {
                              handleDeleteGtk(g.id);
                            }
                          }}
                          title="Hapus GTK"
                          className="w-7 h-7 rounded-lg hover:bg-rose-50 flex items-center justify-center text-rose-700"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* 2. DATA PESERTA DIDIK VIEW */}
      {subType === 'data-peserta-didik' && (
        <>
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
              <span className="text-xs text-on-surface-variant font-medium">Total Peserta Didik Aktif</span>
              <div className="text-2xl font-bold text-primary mt-1">{siswaList.length} Siswa</div>
              <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">Tercatat di Dapodik 2026</span>
            </div>
            <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
              <span className="text-xs text-on-surface-variant font-medium">Verval PD &amp; Dukcapil Valid</span>
              <div className="text-2xl font-bold text-emerald-700 mt-1">
                {siswaList.filter(s => s.nikStatus === 'Valid').length} Siswa
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">NIK &amp; NISN Padan Nasional</span>
            </div>
            <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
              <span className="text-xs text-on-surface-variant font-medium">Residu NIK / KK Perlu Tindak Lanjut</span>
              <div className="text-2xl font-bold text-amber-700 mt-1">
                {siswaList.filter(s => s.nikStatus !== 'Valid').length} Siswa
              </div>
              <span className="text-[11px] text-amber-700 font-semibold mt-1 block">Dokumen KK belum sinkron</span>
            </div>
            <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
              <span className="text-xs text-on-surface-variant font-medium">Penerima Bantuan PIP SimPel</span>
              <div className="text-2xl font-bold text-primary mt-1">
                {siswaList.filter(s => s.pipStatus !== 'Bukan Penerima').length} Siswa
              </div>
              <span className="text-[11px] text-primary font-semibold mt-1 block">SK Nominasi &amp; Pemberian</span>
            </div>
          </div>

          {/* Action & Filter Toolbar */}
          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative w-full">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-outline">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama siswa, NISN, atau rombel..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container-low text-xs border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex rounded-xl bg-surface-container-low p-1 text-xs border border-surface-container">
                <button
                  type="button"
                  onClick={() => setFilterStatus('ALL')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filterStatus === 'ALL' ? 'bg-primary text-white font-bold' : 'text-on-surface-variant'
                  }`}
                >
                  Semua ({siswaList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('VALID')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filterStatus === 'VALID' ? 'bg-primary text-white font-bold' : 'text-on-surface-variant'
                  }`}
                >
                  NIK Valid
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('RESIDU')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filterStatus === 'RESIDU' ? 'bg-primary text-white font-bold' : 'text-on-surface-variant'
                  }`}
                >
                  Residu
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('PIP')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filterStatus === 'PIP' ? 'bg-primary text-white font-bold' : 'text-on-surface-variant'
                  }`}
                >
                  PIP SimPel
                </button>
              </div>

              <button
                type="button"
                onClick={handleExportSiswa}
                className="px-3.5 py-2 rounded-xl bg-surface-container-low text-primary text-xs font-semibold hover:bg-surface-container flex items-center gap-1.5 border border-surface-container"
              >
                <span className="material-symbols-outlined text-base text-emerald-700">table_view</span>
                <span>Ekspor Siswa</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setImportType('siswa');
                  setIsImportModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-surface-container-low text-primary text-xs font-semibold hover:bg-surface-container flex items-center gap-1.5 border border-surface-container"
              >
                <span className="material-symbols-outlined text-base text-primary">upload_file</span>
                <span>Import Banyak</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingSiswa(null);
                  setIsSiswaModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container flex items-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-base">person_add</span>
                <span>Tambah Siswa</span>
              </button>
            </div>
          </div>

          {/* Table Siswa */}
          <div className="overflow-x-auto rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-surface-container-low text-primary font-bold border-b border-surface-container">
                  <th className="py-3 px-4">Nama Siswa &amp; NISN</th>
                  <th className="py-3 px-3">Rombel &amp; Tingkat</th>
                  <th className="py-3 px-3 text-center">L/P</th>
                  <th className="py-3 px-3">Wali Kelas</th>
                  <th className="py-3 px-3 text-center">Verval Dukcapil</th>
                  <th className="py-3 px-3 text-center">Status Bantuan PIP</th>
                  <th className="py-3 px-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container/60">
                {filteredSiswa.map((s) => (
                  <tr key={s.id} className="hover:bg-surface-container-low/40">
                    <td className="py-3 px-4">
                      <div className="font-bold text-primary">{s.nama}</div>
                      <div className="text-[11px] text-on-surface-variant font-mono mt-0.5">
                        NISN: {s.nisn} • NIPD: {s.nipd}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-on-surface">{s.rombel}</td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                        s.jenisKelamin === 'L' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                      }`}>
                        {s.jenisKelamin}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-on-surface">{s.waliKelas}</td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          s.nikStatus === 'Valid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        <span className="material-symbols-outlined text-xs">
                          {s.nikStatus === 'Valid' ? 'verified' : 'error'}
                        </span>
                        <span>{s.nikStatus}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {s.pipStatus !== 'Bukan Penerima' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                          PIP Rp {(s.nominalPip || 0).toLocaleString('id-ID')}
                        </span>
                      ) : (
                        <span className="text-outline text-[11px] font-medium">-</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setDetailType('siswa');
                            setDetailData(s);
                            setIsDetailModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-semibold text-[11px]"
                        >
                          Profil
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSiswa(s);
                            setIsSiswaModalOpen(true);
                          }}
                          title="Edit Siswa"
                          className="w-7 h-7 rounded-lg hover:bg-surface-container flex items-center justify-center text-primary"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Hapus Siswa ${s.nama}?`)) {
                              handleDeleteSiswa(s.id);
                            }
                          }}
                          title="Hapus Siswa"
                          className="w-7 h-7 rounded-lg hover:bg-rose-50 flex items-center justify-center text-rose-700"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* 3. DATA ROMBEL VIEW */}
      {subType === 'data-rombel' && (
        <>
          {/* Summary Metric Cards for Rombel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
              <span className="text-xs text-on-surface-variant font-medium">Total Rombongan Belajar</span>
              <div className="text-2xl font-bold text-primary mt-1">{rombelList.length} Rombel</div>
              <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">Tercatat Aktif di Dapodik</span>
            </div>
            <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
              <span className="text-xs text-on-surface-variant font-medium">Kelas X (Fase E)</span>
              <div className="text-2xl font-bold text-primary mt-1">
                {rombelList.filter(r => r.tingkat === 'X').length} Rombel
              </div>
              <span className="text-[11px] text-on-surface-variant mt-1 block">Kurikulum Merdeka Mandiri Berbagi</span>
            </div>
            <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
              <span className="text-xs text-on-surface-variant font-medium">Kelas XI &amp; XII (Fase F)</span>
              <div className="text-2xl font-bold text-primary mt-1">
                {rombelList.filter(r => r.tingkat !== 'X').length} Rombel
              </div>
              <span className="text-[11px] text-on-surface-variant mt-1 block">Peminatan Saintek &amp; Soshum</span>
            </div>
            <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
              <span className="text-xs text-on-surface-variant font-medium">Rata-rata Siswa per Kelas</span>
              <div className="text-2xl font-bold text-emerald-700 mt-1">
                {rombelList.length > 0 ? Math.round(rombelList.reduce((acc, r) => acc + r.totalSiswa, 0) / rombelList.length) : 0} Siswa
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">Sesuai Standar SPM Kemendikbud</span>
            </div>
          </div>

          {/* Action & Filter Toolbar */}
          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative w-full">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-outline">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama rombel, ruangan, atau wali kelas..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container-low text-xs border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex rounded-xl bg-surface-container-low p-1 text-xs border border-surface-container">
                <button
                  type="button"
                  onClick={() => setFilterStatus('ALL')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filterStatus === 'ALL' ? 'bg-primary text-white font-bold' : 'text-on-surface-variant'
                  }`}
                >
                  Semua ({rombelList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('X')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filterStatus === 'X' ? 'bg-primary text-white font-bold' : 'text-on-surface-variant'
                  }`}
                >
                  Tingkat X
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('XI')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filterStatus === 'XI' ? 'bg-primary text-white font-bold' : 'text-on-surface-variant'
                  }`}
                >
                  Tingkat XI
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('XII')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filterStatus === 'XII' ? 'bg-primary text-white font-bold' : 'text-on-surface-variant'
                  }`}
                >
                  Tingkat XII
                </button>
              </div>

              <button
                type="button"
                onClick={handleExportRombel}
                className="px-3.5 py-2 rounded-xl bg-surface-container-low text-primary text-xs font-semibold hover:bg-surface-container flex items-center gap-1.5 border border-surface-container"
              >
                <span className="material-symbols-outlined text-base text-emerald-700">table_view</span>
                <span>Ekspor Rombel</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingRombel(null);
                  setIsRombelModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container flex items-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-base">add</span>
                <span>Tambah Rombel</span>
              </button>
            </div>
          </div>

          {/* Grid of Rombel cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRombel.map((rom) => (
              <div
                key={rom.id}
                className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-primary">{rom.namaRombel}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-[11px]">
                        Tingkat {rom.tingkat}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingRombel(rom);
                          setIsRombelModalOpen(true);
                        }}
                        title="Edit Rombel"
                        className="w-7 h-7 rounded-lg hover:bg-surface-container flex items-center justify-center text-primary"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Yakin ingin menghapus rombel ${rom.namaRombel}?`)) {
                            handleDeleteRombel(rom.id);
                          }
                        }}
                        title="Hapus Rombel"
                        className="w-7 h-7 rounded-lg hover:bg-rose-50 flex items-center justify-center text-rose-700"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-on-surface-variant font-medium flex items-center gap-1.5 mb-3">
                    <span className="material-symbols-outlined text-sm text-outline">meeting_room</span>
                    <span>Ruangan: {rom.ruang}</span>
                  </p>

                  <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container/60 space-y-1.5 mb-4 text-xs">
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Wali Kelas:</span>
                      <span className="font-bold text-primary">{rom.waliKelas}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Kurikulum:</span>
                      <span className="font-semibold text-on-surface">{rom.kurikulum}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-surface-container">
                      <span className="text-on-surface-variant">Total Siswa:</span>
                      <span className="font-bold text-emerald-700">
                        {rom.totalSiswa} Siswa ({rom.jumlahSiswaL} L / {rom.jumlahSiswaP} P)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-surface-container/60">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveRombelForSiswa(rom);
                      setIsRombelSiswaModalOpen(true);
                    }}
                    className="flex-1 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-semibold text-xs text-center flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">group</span>
                    <span>Daftar Siswa</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveRombelForJadwal(rom);
                      setIsRombelJadwalModalOpen(true);
                    }}
                    className="py-1.5 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs text-center flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">calendar_month</span>
                    <span>Jadwal</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 4. MATA PELAJARAN & KURIKULUM */}
      {subType === 'mata-pelajaran-dan-kurikulum' && (
        <>
          {/* Summary Metric Cards for Mapel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
              <span className="text-xs text-on-surface-variant font-medium">Total Mata Pelajaran</span>
              <div className="text-2xl font-bold text-primary mt-1">{mapelList.length} Mapel</div>
              <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">Kurikulum Merdeka 2026/2027</span>
            </div>
            <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
              <span className="text-xs text-on-surface-variant font-medium">Mata Pelajaran Wajib (Umum)</span>
              <div className="text-2xl font-bold text-primary mt-1">
                {mapelList.filter(m => m.kategori.includes('Wajib')).length} Mapel
              </div>
              <span className="text-[11px] text-on-surface-variant mt-1 block">Fase E &amp; Fase F Reguler</span>
            </div>
            <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
              <span className="text-xs text-on-surface-variant font-medium">Mapel Pilihan Peminatan</span>
              <div className="text-2xl font-bold text-emerald-700 mt-1">
                {mapelList.filter(m => m.kategori.includes('Pilihan')).length} Mapel
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">Saintek &amp; Soshum (Fase F)</span>
            </div>
            <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
              <span className="text-xs text-on-surface-variant font-medium">Total Alokasi Beban JP</span>
              <div className="text-2xl font-bold text-primary mt-1">
                {mapelList.reduce((acc, m) => acc + m.alokasiJp, 0)} JP
              </div>
              <span className="text-[11px] text-primary font-semibold mt-1 block">Beban Mingguan Terpenuhi</span>
            </div>
          </div>

          {/* Action & Filter Toolbar for Mapel */}
          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative w-full">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-outline">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari mata pelajaran, kode, atau guru pengampu..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container-low text-xs border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex rounded-xl bg-surface-container-low p-1 text-xs border border-surface-container">
                <button
                  type="button"
                  onClick={() => setFilterStatus('ALL')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filterStatus === 'ALL' ? 'bg-primary text-white font-bold' : 'text-on-surface-variant'
                  }`}
                >
                  Semua ({mapelList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('WAJIB')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filterStatus === 'WAJIB' ? 'bg-primary text-white font-bold' : 'text-on-surface-variant'
                  }`}
                >
                  Wajib
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('PILIHAN')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filterStatus === 'PILIHAN' ? 'bg-primary text-white font-bold' : 'text-on-surface-variant'
                  }`}
                >
                  Pilihan
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('MULOK')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filterStatus === 'MULOK' ? 'bg-primary text-white font-bold' : 'text-on-surface-variant'
                  }`}
                >
                  Mulok &amp; P5
                </button>
              </div>

              <button
                type="button"
                onClick={handleExportMapel}
                className="px-3.5 py-2 rounded-xl bg-surface-container-low text-primary text-xs font-semibold hover:bg-surface-container flex items-center gap-1.5 border border-surface-container"
              >
                <span className="material-symbols-outlined text-base text-emerald-700">table_view</span>
                <span>Ekspor Kurikulum</span>
              </button>

              <button
                type="button"
                onClick={() => setIsMapelJpAdjustModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-surface-container-low text-primary text-xs font-semibold hover:bg-surface-container flex items-center gap-1.5 border border-surface-container"
              >
                <span className="material-symbols-outlined text-base text-primary">tune</span>
                <span>Atur Beban JP</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingMapel(null);
                  setIsMapelModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container flex items-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-base">add</span>
                <span>Tambah Mapel</span>
              </button>
            </div>
          </div>

          {/* Table of Mata Pelajaran */}
          <div className="overflow-x-auto rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-surface-container-low text-primary font-bold border-b border-surface-container">
                  <th className="py-3 px-4">Kode &amp; Nama Mata Pelajaran</th>
                  <th className="py-3 px-3">Kategori Kurikulum</th>
                  <th className="py-3 px-3">Tingkat / Fase</th>
                  <th className="py-3 px-3 text-center">Alokasi JP</th>
                  <th className="py-3 px-3">Guru Pengampu Utama</th>
                  <th className="py-3 px-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container/60">
                {filteredMapel.map((m) => (
                  <tr key={m.id} className="hover:bg-surface-container-low/40">
                    <td className="py-3 px-4">
                      <div className="font-bold text-primary">{m.namaMapel}</div>
                      <div className="text-[11px] text-outline font-mono mt-0.5">{m.kodeMapel}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        m.kategori.includes('Wajib') 
                          ? 'bg-blue-100 text-blue-800'
                          : m.kategori.includes('Pilihan')
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {m.kategori}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-on-surface">{m.fase}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs">
                        {m.alokasiJp} JP / Mgg
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-primary">{m.guruPengampu}</td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingMapel(m);
                            setIsMapelModalOpen(true);
                          }}
                          title="Edit Mapel"
                          className="w-7 h-7 rounded-lg hover:bg-surface-container flex items-center justify-center text-primary"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Hapus mata pelajaran ${m.namaMapel}?`)) {
                              handleDeleteMapel(m.id);
                            }
                          }}
                          title="Hapus Mapel"
                          className="w-7 h-7 rounded-lg hover:bg-rose-50 flex items-center justify-center text-rose-700"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modal: Tambah / Edit GTK */}
      <GtkFormModal
        isOpen={isGtkModalOpen}
        onClose={() => {
          setIsGtkModalOpen(false);
          setEditingGtk(null);
        }}
        onSave={handleSaveGtk}
        initialData={editingGtk}
      />

      {/* Modal: Tambah / Edit Siswa */}
      <SiswaFormModal
        isOpen={isSiswaModalOpen}
        onClose={() => {
          setIsSiswaModalOpen(false);
          setEditingSiswa(null);
        }}
        onSave={handleSaveSiswa}
        initialData={editingSiswa}
      />

      {/* Modal: Import Banyak (Bulk Import) */}
      <BulkImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        type={importType}
        onImportGtk={handleImportGtk}
        onImportSiswa={handleImportSiswa}
      />

      {/* Modal: Rincian / Detail View */}
      <DetailViewModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setDetailData(null);
        }}
        type={detailType}
        data={detailData}
        onEdit={(item) => {
          if (detailType === 'gtk') {
            setEditingGtk(item);
            setIsGtkModalOpen(true);
          } else {
            setEditingSiswa(item);
            setIsSiswaModalOpen(true);
          }
        }}
        onDelete={(id) => {
          if (detailType === 'gtk') {
            handleDeleteGtk(id);
          } else {
            handleDeleteSiswa(id);
          }
        }}
      />

      {/* Modal: Tambah / Edit Rombel */}
      <RombelFormModal
        isOpen={isRombelModalOpen}
        onClose={() => {
          setIsRombelModalOpen(false);
          setEditingRombel(null);
        }}
        onSave={handleSaveRombel}
        initialData={editingRombel}
        gtkList={gtkList}
      />

      {/* Modal: Daftar Siswa Rombel */}
      <RombelSiswaModal
        isOpen={isRombelSiswaModalOpen}
        onClose={() => {
          setIsRombelSiswaModalOpen(false);
          setActiveRombelForSiswa(null);
        }}
        rombel={activeRombelForSiswa}
        siswaList={siswaList}
        onAddSiswaToRombel={(rombelName) => {
          setEditingSiswa({
            id: '',
            nama: '',
            nisn: '',
            nipd: '',
            rombel: rombelName,
            jenisKelamin: 'L',
            nikStatus: 'Valid',
            pipStatus: 'Bukan Penerima',
            waliKelas: activeRombelForSiswa?.waliKelas || ''
          });
          setIsSiswaModalOpen(true);
        }}
        onShowToast={onShowToast}
      />

      {/* Modal: Jadwal Pelajaran Rombel */}
      <RombelJadwalModal
        isOpen={isRombelJadwalModalOpen}
        onClose={() => {
          setIsRombelJadwalModalOpen(false);
          setActiveRombelForJadwal(null);
        }}
        rombel={activeRombelForJadwal}
      />

      {/* Modal: Tambah / Edit Mata Pelajaran */}
      <MapelFormModal
        isOpen={isMapelModalOpen}
        onClose={() => {
          setIsMapelModalOpen(false);
          setEditingMapel(null);
        }}
        onSave={handleSaveMapel}
        initialData={editingMapel}
        gtkList={gtkList}
      />

      {/* Modal: Atur Beban JP Kurikulum */}
      <MapelJpAdjustModal
        isOpen={isMapelJpAdjustModalOpen}
        onClose={() => setIsMapelJpAdjustModalOpen(false)}
        mapelList={mapelList}
        onSaveAll={handleSaveAllMapel}
      />
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  MOCK_GTK_LIST,
  GTKItem,
  DAPODIK_TUGAS_TAMBAHAN_LIST,
  DAFTAR_30_ROMBEL
} from '../../data/modulesData';

interface KurikulumViewProps {
  subType: 'rombel-dan-kalkulator-jtm' | 'distribusi-mengajar' | 'linieritas-sertifikasi';
  onShowToast: (msg: string) => void;
  gtkList?: GTKItem[];
}

export const KurikulumView: React.FC<KurikulumViewProps> = ({
  subType,
  onShowToast,
  gtkList = MOCK_GTK_LIST
}) => {
  // Filter for selecting teacher
  const [filterGuruType, setFilterGuruType] = useState<'semua' | 'sertifikasi' | 'kritis'>('sertifikasi');
  
  // Selected teacher ID (default to Dra. Hj. Ratna Kurniati if kritis, or Ahmad Fauzi)
  const [selectedGuruId, setSelectedGuruId] = useState<string>(() => gtkList[4]?.id || gtkList[0]?.id || 'gtk-1');

  // Simulation form states matching Dapodik fields
  const [alokasiJp, setAlokasiJp] = useState<number>(2);
  const [selectedRombels, setSelectedRombels] = useState<string[]>(['X-1', 'X-2', 'X-3', 'X-4', 'X-5', 'XI-1', 'XI-2']);
  const [selectedTugasTambahanId, setSelectedTugasTambahanId] = useState<string>('none');
  const [secondaryDuties, setSecondaryDuties] = useState<{ id: string; nama: string; jam: number }[]>([]);
  const [extraHours, setExtraHours] = useState<number>(0);
  const [showRombelPicker, setShowRombelPicker] = useState<boolean>(false);

  // Synchronize initial simulation state when selected teacher changes
  useEffect(() => {
    const guru = gtkList.find((g) => g.id === selectedGuruId);
    if (guru) {
      setAlokasiJp(guru.jpPerRombel || 2);
      setSelectedRombels(guru.rombelList && guru.rombelList.length > 0 ? [...guru.rombelList] : ['X-1', 'X-2', 'X-3']);
      setSelectedTugasTambahanId(guru.tugasTambahanId || 'none');
      setSecondaryDuties([]);
      setExtraHours(0);
    }
  }, [selectedGuruId, gtkList]);

  const selectedGuru: GTKItem = gtkList.find((g) => g.id === selectedGuruId) || gtkList[0] || {
    id: 'gtk-none',
    nama: 'Belum Ada GTK',
    nipNuptk: '-',
    jenisPtk: 'Guru Mapel',
    statusKepegawaian: 'GTY',
    mapelUtama: 'Umum',
    jpPerRombel: 2,
    jumlahRombel: 1,
    rombelList: [],
    jtmTatapMuka: 0,
    jtmTugasTambahan: 0,
    totalJtm: 0,
    statusInfoGtk: 'Belum Valid',
    sertifikasi: 'Belum',
    telepon: '-'
  };

  // Additional Duty Calculation
  const primaryDuty = DAPODIK_TUGAS_TAMBAHAN_LIST.find((t) => t.id === selectedTugasTambahanId) || DAPODIK_TUGAS_TAMBAHAN_LIST[0];
  const primaryDutyHours = primaryDuty.jam;
  const secondaryDutyHours = secondaryDuties.reduce((acc, curr) => acc + curr.jam, 0);
  const totalDutyHours = primaryDutyHours + secondaryDutyHours;

  // Teaching Hours Calculation
  const calculatedTatapMuka = selectedRombels.length * alokasiJp;
  const simulatedTotal = calculatedTatapMuka + totalDutyHours + extraHours;

  // Compliance analysis
  const isCertified = selectedGuru.sertifikasi === 'Sudah Sertifikasi';
  const isValidSktp = simulatedTotal >= 24 && simulatedTotal <= 40;
  const isUnderload = simulatedTotal < 24;
  const isOverload = simulatedTotal > 40;
  const hoursDeficit = Math.max(0, 24 - simulatedTotal);
  const rombelsNeeded = Math.ceil(hoursDeficit / (alokasiJp || 1));

  // Toggle Rombel in Selection
  const toggleRombel = (rombelName: string) => {
    if (selectedRombels.includes(rombelName)) {
      setSelectedRombels(selectedRombels.filter((r) => r !== rombelName));
    } else {
      setSelectedRombels([...selectedRombels, rombelName]);
    }
  };

  // Add / remove rombel count conveniently
  const adjustRombelCount = (delta: number) => {
    if (delta > 0) {
      // Find first unused rombel
      const unused = DAFTAR_30_ROMBEL.find((r) => !selectedRombels.includes(r));
      if (unused) {
        setSelectedRombels([...selectedRombels, unused]);
      } else if (selectedRombels.length < 30) {
        setSelectedRombels([...selectedRombels, `Rombel-${selectedRombels.length + 1}`]);
      }
    } else if (delta < 0 && selectedRombels.length > 0) {
      setSelectedRombels(selectedRombels.slice(0, selectedRombels.length - 1));
    }
  };

  // Toggle Secondary Duty
  const toggleSecondaryDuty = (duty: { id: string; nama: string; jam: number }) => {
    if (secondaryDuties.some((d) => d.id === duty.id)) {
      setSecondaryDuties(secondaryDuties.filter((d) => d.id !== duty.id));
    } else {
      setSecondaryDuties([...secondaryDuties, duty]);
    }
  };

  // Filtered GTK list for dropdown / quick cards
  const filteredGuruList = gtkList.filter((g) => {
    if (filterGuruType === 'sertifikasi') return g.sertifikasi === 'Sudah Sertifikasi';
    if (filterGuruType === 'kritis') return g.statusInfoGtk !== 'Valid' || g.totalJtm < 24;
    return true;
  });

  // Reset to original Dapodik values
  const handleReset = () => {
    setAlokasiJp(selectedGuru.jpPerRombel || 2);
    setSelectedRombels(selectedGuru.rombelList && selectedGuru.rombelList.length > 0 ? [...selectedGuru.rombelList] : ['X-1', 'X-2', 'X-3']);
    setSelectedTugasTambahanId(selectedGuru.tugasTambahanId || 'none');
    setSecondaryDuties([]);
    setExtraHours(0);
    onShowToast(`Isian simulasi ${selectedGuru.nama} dikembalikan ke data awal Dapodik.`);
  };

  return (
    <div className="flex flex-col gap-space-lg">
      {/* 1. KALKULATOR JTM VIEW */}
      {subType === 'rombel-dan-kalkulator-jtm' && (
        <div className="space-y-6">
          {/* Header & Filter Tabs */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-container pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-2xl">calculate</span>
                  <h3 className="font-bold text-lg text-primary">
                    Kalkulator &amp; Simulator JTM Sertifikasi (Dapodik v2025.b)
                  </h3>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">
                  Simulasi perhitungan beban kerja jam tatap muka (JTM) guru berdasarkan alokasi JP kurikulum, 30 rombongan belajar, dan ekuivalensi tugas tambahan resmi untuk penerbitan SKTP.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-container-low border border-surface-container text-xs">
                <button
                  type="button"
                  onClick={() => setFilterGuruType('sertifikasi')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    filterGuruType === 'sertifikasi'
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  Guru Sertifikasi ({gtkList.filter((g) => g.sertifikasi === 'Sudah Sertifikasi').length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterGuruType('kritis')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    filterGuruType === 'kritis'
                      ? 'bg-rose-700 text-white shadow-xs'
                      : 'text-rose-700 hover:bg-rose-50'
                  }`}
                >
                  Warning / Kritis JTM ({gtkList.filter((g) => g.statusInfoGtk !== 'Valid' || g.totalJtm < 24).length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterGuruType('semua')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    filterGuruType === 'semua'
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  Semua GTK ({gtkList.length})
                </button>
              </div>
            </div>

            {/* Teacher Selection Dropdown with Live Badge */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-8">
                <label className="text-xs font-bold text-on-surface-variant block mb-1.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-primary">person</span>
                  <span>Pilih Guru / PTK yang Disimulasikan:</span>
                </label>
                <select
                  value={selectedGuruId}
                  onChange={(e) => setSelectedGuruId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-surface-container-low border border-surface-container text-xs font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {filteredGuruList.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.nama} — {g.mapelUtama} ({g.sertifikasi} • Real: {g.totalJtm} Jam)
                    </option>
                  ))}
                </select>
              </div>

              {/* Teacher Identity Badge */}
              <div className="md:col-span-4 p-3 rounded-xl bg-surface-container-low border border-surface-container/80 flex items-center justify-between">
                <div>
                  <span className="text-[10.5px] text-on-surface-variant block">Status Sertifikasi:</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isCertified ? 'bg-emerald-600' : 'bg-slate-400'
                      }`}
                    />
                    <span className="text-xs font-bold text-primary">
                      {isCertified ? 'Sudah Sertifikasi (Penerima TPG)' : 'Belum Sertifikasi'}
                    </span>
                  </div>
                  <span className="text-[10px] text-outline block mt-0.5">
                    NUPTK: {selectedGuru.nipNuptk} • Serdik: {selectedGuru.kodeSertifikasi || selectedGuru.mapelUtama}
                  </span>
                </div>
                <span
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold ${
                    isCertified
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {isCertified ? 'Wajib ≥ 24 Jam' : 'Standar'}
                </span>
              </div>
            </div>
          </div>

          {/* Main Simulator Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left 7 Columns: Dapodik Inputs (Rombel & Tugas Tambahan) */}
            <div className="lg:col-span-7 space-y-5">
              {/* Form Card 1: Pembelajaran & Rombel (Sesuai Isian Dapodik Tab Pembelajaran) */}
              <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-surface-container pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-xl">groups</span>
                    <h4 className="font-bold text-sm text-primary">
                      1. Isian Rombel &amp; Jam Tatap Muka (Tab Pembelajaran Dapodik)
                    </h4>
                  </div>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                    Total: {DAFTAR_30_ROMBEL.length} Rombel Sekolah
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* JP Per Rombel Input */}
                  <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container">
                    <label className="text-xs font-bold text-primary block mb-1">
                      Alokasi JP per Rombel:
                    </label>
                    <p className="text-[10.5px] text-on-surface-variant mb-2">
                      Sesuai struktur Kurikulum Merdeka ({selectedGuru.mapelUtama})
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="8"
                        value={alokasiJp}
                        onChange={(e) => setAlokasiJp(Math.max(1, Number(e.target.value)))}
                        className="w-20 p-2 rounded-lg bg-white border border-surface-container text-sm font-bold text-primary text-center focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <span className="text-xs font-semibold text-on-surface">Jam Pelajaran / Minggu</span>
                    </div>
                  </div>

                  {/* Rombel Counter Stepper */}
                  <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container">
                    <label className="text-xs font-bold text-primary block mb-1">
                      Jumlah Rombel yang Diajar:
                    </label>
                    <p className="text-[10.5px] text-on-surface-variant mb-2">
                      Rombongan belajar aktif diampu semester ini
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => adjustRombelCount(-1)}
                        disabled={selectedRombels.length === 0}
                        className="w-8 h-8 rounded-lg bg-white border border-surface-container flex items-center justify-center font-bold text-primary hover:bg-surface-container-high disabled:opacity-40"
                      >
                        -
                      </button>
                      <div className="px-3 py-1.5 rounded-lg bg-white border border-surface-container text-sm font-bold text-primary min-w-[70px] text-center">
                        {selectedRombels.length} Rombel
                      </div>
                      <button
                        type="button"
                        onClick={() => adjustRombelCount(1)}
                        disabled={selectedRombels.length >= 30}
                        className="w-8 h-8 rounded-lg bg-white border border-surface-container flex items-center justify-center font-bold text-primary hover:bg-surface-container-high disabled:opacity-40"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowRombelPicker(!showRombelPicker)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg border font-semibold flex items-center gap-1 transition-all ${
                          showRombelPicker
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-primary border-surface-container hover:bg-surface-container-high'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">checklist</span>
                        <span>{showRombelPicker ? 'Tutup' : 'Pilih Rombel'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Collapsible Detailed 30 Rombel Checklist */}
                {showRombelPicker && (
                  <div className="p-3.5 rounded-xl bg-surface-container-low border border-primary/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-primary">
                        Pilih Rombongan Belajar SMA NU Kaplongan:
                      </span>
                      <div className="flex items-center gap-2 text-[11px]">
                        <button
                          type="button"
                          onClick={() => setSelectedRombels([...DAFTAR_30_ROMBEL])}
                          className="text-primary hover:underline font-semibold"
                        >
                          Pilih Semua (30)
                        </button>
                        <span>•</span>
                        <button
                          type="button"
                          onClick={() => setSelectedRombels([])}
                          className="text-rose-600 hover:underline font-semibold"
                        >
                          Hapus Semua
                        </button>
                      </div>
                    </div>

                    {/* Group by Tingkat */}
                    <div className="space-y-2">
                      <div>
                        <span className="text-[10.5px] font-bold text-on-surface-variant block mb-1">
                          Kelas X (Fase E) — 10 Rombel:
                        </span>
                        <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                          {DAFTAR_30_ROMBEL.slice(0, 10).map((r) => (
                            <button
                              key={r}
                              type="button"
                              onClick={() => toggleRombel(r)}
                              className={`py-1 rounded text-center text-xs font-bold transition-all border ${
                                selectedRombels.includes(r)
                                  ? 'bg-primary text-white border-primary shadow-xs'
                                  : 'bg-white text-on-surface-variant border-surface-container hover:border-primary/40'
                              }`}
                            >
                              {r}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10.5px] font-bold text-on-surface-variant block mb-1">
                          Kelas XI (Fase F) — 10 Rombel:
                        </span>
                        <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                          {DAFTAR_30_ROMBEL.slice(10, 20).map((r) => (
                            <button
                              key={r}
                              type="button"
                              onClick={() => toggleRombel(r)}
                              className={`py-1 rounded text-center text-xs font-bold transition-all border ${
                                selectedRombels.includes(r)
                                  ? 'bg-primary text-white border-primary shadow-xs'
                                  : 'bg-white text-on-surface-variant border-surface-container hover:border-primary/40'
                              }`}
                            >
                              {r}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10.5px] font-bold text-on-surface-variant block mb-1">
                          Kelas XII (Fase F) — 10 Rombel:
                        </span>
                        <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                          {DAFTAR_30_ROMBEL.slice(20, 30).map((r) => (
                            <button
                              key={r}
                              type="button"
                              onClick={() => toggleRombel(r)}
                              className={`py-1 rounded text-center text-xs font-bold transition-all border ${
                                selectedRombels.includes(r)
                                  ? 'bg-primary text-white border-primary shadow-xs'
                                  : 'bg-white text-on-surface-variant border-surface-container hover:border-primary/40'
                              }`}
                            >
                              {r}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Calculation Sub-Total Tatap Muka */}
                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-blue-950 font-medium">
                    <span className="material-symbols-outlined text-blue-700 text-lg">functions</span>
                    <span>
                      Formula Tatap Muka: <strong>{selectedRombels.length} Rombel</strong> &times; <strong>{alokasiJp} JP</strong>
                    </span>
                  </div>
                  <div className="font-bold text-blue-900 text-sm">
                    = {calculatedTatapMuka} Jam Tatap Muka
                  </div>
                </div>
              </div>

              {/* Form Card 2: Tugas Tambahan Dapodik (Permendikdasmen No. 11/2025 & Kepmendikdasmen No. 221/P/2025) */}
              <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-container pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-xl">workspace_premium</span>
                    <h4 className="font-bold text-sm text-primary">
                      2. Isian Tugas Tambahan Resmi Dapodik (Tab GTK)
                    </h4>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10.5px] font-bold border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    <span>Aturan Baru: Kepmendikdasmen No. 221/P/2025</span>
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-primary block mb-1.5">
                    Tugas Tambahan Utama (SK Kepala Sekolah):
                  </label>
                  <select
                    value={selectedTugasTambahanId}
                    onChange={(e) => setSelectedTugasTambahanId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-surface-container-low border border-surface-container text-xs font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {DAPODIK_TUGAS_TAMBAHAN_LIST.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nama} — [{t.nomorRegulasi}]
                      </option>
                    ))}
                  </select>
                  <span className="text-[10.5px] text-outline mt-1 block">
                    {primaryDuty.keterangan} • Dasar: <strong>{primaryDuty.nomorRegulasi}</strong>
                  </span>
                </div>

                {/* Secondary Checkboxes for Additional recognized tasks */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-primary block">
                      Tugas Tambahan Pendukung / Multi-Tugas (Dapat Dikombinasikan):
                    </label>
                    <span className="text-[10.5px] text-outline font-medium">
                      Berdasarkan Kepmendikdasmen 221/P/2025
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {[
                      { id: 'wali_kelas', nama: 'Wali Kelas (+2 Jam)', jam: 2, desc: '1 Rombel di Satminkal' },
                      { id: 'pembina_osis', nama: 'Pembina OSIS / MPK (+2 Jam)', jam: 2, desc: 'Organisasi Siswa' },
                      { id: 'pembina_ekskul', nama: 'Pembina Pramuka / Ekskul (+2 Jam)', jam: 2, desc: 'Kegiatan Resmi' },
                      { id: 'koordinator_tppk', nama: 'Koordinator TPPK (+2 Jam)', jam: 2, desc: 'Pencegahan Kekerasan' },
                      { id: 'koordinator_kombel', nama: 'Pengurus Kombel / Tim Kurikulum (+2 Jam)', jam: 2, desc: 'Komunitas Belajar Guru' },
                      { id: 'koordinator_p5_1', nama: 'Koordinator P5 - 1 Rombel (+2 Jam)', jam: 2, desc: 'Projek Pelajar Pancasila' },
                      { id: 'koordinator_p5_2', nama: 'Koordinator P5 - 2 Rombel (+4 Jam)', jam: 4, desc: 'Projek Pelajar Pancasila' },
                      { id: 'koordinator_p5_3', nama: 'Koordinator P5 - 3 Rombel (+6 Jam)', jam: 6, desc: 'Maks. 3 Rombel Diakui' },
                      { id: 'guru_piket', nama: 'Guru Piket Sekolah Harian (+1 Jam)', jam: 1, desc: 'Jadwal Piket Mingguan' },
                      { id: 'koordinator_bkk', nama: 'Koordinator BKK / Kemitraan (+2 Jam)', jam: 2, desc: 'Bursa Kerja Khusus' },
                      { id: 'gpk_inklusi', nama: 'Guru Pembimbing Khusus Inklusi (+6 Jam)', jam: 6, desc: 'Layanan Siswa ABK' }
                    ].map((duty) => {
                      const isChecked = secondaryDuties.some((d) => d.id === duty.id);
                      return (
                        <button
                          key={duty.id}
                          type="button"
                          onClick={() => toggleSecondaryDuty(duty)}
                          className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                            isChecked
                              ? 'bg-primary/10 border-primary text-primary font-bold shadow-xs'
                              : 'bg-surface-container-low border-surface-container text-on-surface hover:bg-surface-container'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            <span className="material-symbols-outlined text-base shrink-0">
                              {isChecked ? 'check_box' : 'check_box_outline_blank'}
                            </span>
                            <div className="truncate">
                              <span className="block truncate">{duty.nama}</span>
                              <span className="text-[10px] text-outline font-normal block">{duty.desc}</span>
                            </div>
                          </div>
                          <span className="text-[10.5px] opacity-80 font-mono font-bold shrink-0">+{duty.jam} JP</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Jam Tambahan Sekolah / Simulasi Lainnya */}
                <div className="pt-2 border-t border-surface-container/60 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-primary block">
                      Simulasi Tambahan Beban Ajar / Pengayaan Mandiri:
                    </span>
                    <span className="text-[10px] text-outline">
                      Jam tambahan bimbingan intensif / ekstrakurrikuler non-reguler
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="12"
                      value={extraHours}
                      onChange={(e) => setExtraHours(Math.max(0, Number(e.target.value)))}
                      className="w-16 p-1.5 rounded-lg bg-white border border-surface-container text-xs font-bold text-primary text-center"
                    />
                    <span className="text-xs text-on-surface-variant font-medium">Jam</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Real-Time Info GTK Compliance & Live Analysis */}
            <div className="lg:col-span-5 space-y-5">
              {/* Summary Metrics Box */}
              <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-surface-container pb-2.5">
                  <h4 className="font-bold text-sm text-primary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">analytics</span>
                    <span>Ringkasan Beban Kerja Guru (JJM)</span>
                  </h4>
                  <span className="text-[10.5px] text-on-surface-variant font-medium">Info GTK v2025</span>
                </div>

                {/* 4 Cards Breakdown */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                    <span className="text-[10.5px] text-on-surface-variant block">Rombel Diampu</span>
                    <span className="text-xl font-bold text-primary mt-0.5 block">
                      {selectedRombels.length} <span className="text-xs font-normal text-outline">Kelas</span>
                    </span>
                    <span className="text-[10px] text-outline">Dari 30 Rombel</span>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                    <span className="text-[10.5px] text-on-surface-variant block">JTM Tatap Muka</span>
                    <span className="text-xl font-bold text-primary mt-0.5 block">
                      {calculatedTatapMuka} <span className="text-xs font-normal text-outline">Jam</span>
                    </span>
                    <span className="text-[10px] text-outline">
                      {selectedRombels.length} &times; {alokasiJp} JP
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                    <span className="text-[10.5px] text-on-surface-variant block">Tugas Tambahan</span>
                    <span className="text-xl font-bold text-primary mt-0.5 block">
                      {totalDutyHours} <span className="text-xs font-normal text-outline">Jam</span>
                    </span>
                    <span className="text-[10px] text-outline truncate block" title={primaryDuty.nama}>
                      {primaryDutyHours > 0 ? primaryDuty.nama.split('(')[0] : 'Tidak Ada'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                    <span className="text-[10.5px] text-primary block font-semibold">TOTAL BEBAN JJM</span>
                    <span className="text-2xl font-black text-primary mt-0.5 block">
                      {simulatedTotal} <span className="text-xs font-normal">Jam</span>
                    </span>
                    <span className="text-[10px] text-primary/80 block">
                      {simulatedTotal >= 24 ? '≥ 24 Jam (Lolos)' : '< 24 Jam (Kurang)'}
                    </span>
                  </div>
                </div>

                {/* Progress Bar towards 24 JTM */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-on-surface-variant">Progres Ambang Batas 24 JTM:</span>
                    <span className={simulatedTotal >= 24 ? 'text-emerald-700' : 'text-rose-700'}>
                      {Math.min(100, Math.round((simulatedTotal / 24) * 100))}% ({simulatedTotal} / 24 Jam)
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-surface-container overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        simulatedTotal >= 24 ? 'bg-emerald-600' : 'bg-rose-600'
                      }`}
                      style={{ width: `${Math.min(100, (simulatedTotal / 24) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Validation Status Card */}
                {isValidSktp && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-2">
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-emerald-700 text-2xl shrink-0">
                        verified
                      </span>
                      <div>
                        <h5 className="font-bold text-xs uppercase tracking-wide text-emerald-800">
                          STATUS VALID (KODE 01: SIAP TERBIT SKTP)
                        </h5>
                        <p className="text-[11px] text-emerald-900 mt-0.5">
                          {isCertified
                            ? `Guru bersertifikasi telah memenuhi syarat minimal 24 JTM (${simulatedTotal} Jam/minggu). Tunjangan Profesi Guru (TPG) siap dicairkan.`
                            : `Beban mengajar memenuhi standar 24 JTM (${simulatedTotal} Jam/minggu). Siap untuk pengusulan sertifikasi / PPG.`}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {isUnderload && (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-950 space-y-2">
                    <div className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-rose-700 text-2xl shrink-0 mt-0.5">
                        warning
                      </span>
                      <div>
                        <h5 className="font-bold text-xs uppercase tracking-wide text-rose-800">
                          STATUS BELUM VALID (KODE 02: BEBAN MENGAJAR KURANG)
                        </h5>
                        <p className="text-[11px] text-rose-900 mt-0.5">
                          <strong>KURANG {hoursDeficit} JAM TATAP MUKA!</strong> SKTP tidak dapat diterbitkan oleh Puslapdik karena total jam ({simulatedTotal} Jam) belum mencapai syarat 24 JTM.
                        </p>
                      </div>
                    </div>

                    {/* Intelligent Dapodik Recommendations */}
                    <div className="mt-2.5 pt-2 border-t border-rose-200/80 text-[11px] text-rose-900 space-y-1">
                      <strong className="block text-rose-800">Rekomendasi Penyesuaian Dapodik:</strong>
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-xs text-rose-700">arrow_forward</span>
                        <span>
                          Tambahkan minimal <strong>+{rombelsNeeded} Rombel</strong> di rombongan belajar ({alokasiJp} JP/rombel).
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-xs text-rose-700">arrow_forward</span>
                        <span>
                          Atau tetapkan Tugas Tambahan: <strong>Wali Kelas (+2 JP)</strong>, <strong>Pembina OSIS (+2 JP)</strong>, atau <strong>Koordinator P5 (+4 JP)</strong>.
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {isOverload && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-amber-700 text-xl">info</span>
                      <h5 className="font-bold text-xs text-amber-800">
                        PERINGATAN OVERLOAD (&gt; 40 JTM)
                      </h5>
                    </div>
                    <p className="text-[11px] text-amber-900">
                      Total jam mengajar ({simulatedTotal} Jam) melebihi batas maksimal regulasi 40 JP per minggu. Sebaiknya jam mengajar didistribusikan ke guru lain.
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      onShowToast(`Simulasi beban mengajar ${selectedGuru.nama} (${simulatedTotal} JTM) berhasil disimpan ke basis data Dapodik lokal!`);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-base">sync_saved_locally</span>
                    <span>Terapkan ke Dapodik Lokal</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="py-2.5 px-3 rounded-xl bg-surface-container-low text-primary border border-surface-container text-xs font-bold hover:bg-surface-container"
                    title="Kembalikan ke data awal Dapodik"
                  >
                    <span className="material-symbols-outlined text-base">restart_alt</span>
                  </button>
                </div>
              </div>

              {/* Reference Regulations: Permendikdasmen No. 11/2025 & Kepmendikdasmen No. 221/P/2025 */}
              <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-xs text-primary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">gavel</span>
                    <span>Dasar Regulasi Beban Kerja Guru &amp; JTM (Terbaru 2025)</span>
                  </h5>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Resmi 2025
                  </span>
                </div>
                <ul className="text-[11px] text-on-surface-variant space-y-1.5 list-disc pl-4">
                  <li>
                    <strong>Permendikdasmen No. 11 Tahun 2025:</strong> Pemenuhan beban kerja guru minimal 24 JP s.d. 40 JP dan 37,5 jam kerja efektif ASN/Tendik per minggu.
                  </li>
                  <li>
                    <strong>Kepmendikdasmen No. 221/P/2025:</strong> Petunjuk teknis pemenuhan beban kerja &amp; ekuivalensi tugas tambahan: Waka (12 JP), Kepala Lab (12 JP), Kepala Perpus (12 JP), GPK Inklusi (6 JP), TPPK (2 JP), Kombel (2 JP), Wali Kelas (2 JP), Pembina OSIS (2 JP), Koordinator P5 (2-6 JP), Guru Piket (1 JP).
                  </li>
                  <li>
                    <strong>Syarat Keabsahan Info GTK:</strong> Wajib memiliki SK Penugasan dari Kepala Sekolah yang sah, terdata di Dapodik tab Tugas Tambahan, dan diakui di Satminkal (sekolah induk).
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Table: Rekapitulasi Beban JTM Seluruh Guru Bersertifikasi SMA NU Kaplongan */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-container pb-3">
              <div>
                <h4 className="font-bold text-sm text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-emerald-700">verified_user</span>
                  <span>Rekapitulasi JTM &amp; Kelayakan SKTP Guru Bersertifikasi SMA NU Kaplongan</span>
                </h4>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Monitoring kesiapan data mengajar sebelum batas cut-off Info GTK &amp; penarikan tunjangan profesi
                </p>
              </div>
              <button
                type="button"
                onClick={() => onShowToast("Mengekspor rekapitulasi beban JTM guru bersertifikasi ke Excel (.xlsx)...")}
                className="px-3.5 py-1.5 rounded-xl bg-surface-container-low text-primary text-xs font-bold hover:bg-surface-container border border-surface-container flex items-center gap-1.5 self-start sm:self-auto"
              >
                <span className="material-symbols-outlined text-base text-emerald-700">table_view</span>
                <span>Ekspor Rekap JTM</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-container-low text-primary font-bold border-b border-surface-container">
                    <th className="py-2.5 px-3">Nama Guru &amp; NUPTK</th>
                    <th className="py-2.5 px-3">Mata Pelajaran (Serdik)</th>
                    <th className="py-2.5 px-2 text-center">Alokasi JP</th>
                    <th className="py-2.5 px-2 text-center">Rombel Diampu</th>
                    <th className="py-2.5 px-2 text-center">Tatap Muka</th>
                    <th className="py-2.5 px-3">Tugas Tambahan Dapodik</th>
                    <th className="py-2.5 px-2 text-center">Total JJM</th>
                    <th className="py-2.5 px-3 text-center">Status Info GTK</th>
                    <th className="py-2.5 px-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container/60">
                  {gtkList.map((g) => {
                    const isGtkValid = g.totalJtm >= 24;
                    const isSelected = g.id === selectedGuruId;
                    return (
                      <tr
                        key={g.id}
                        className={`transition-colors ${
                          isSelected
                            ? 'bg-primary/5 font-semibold'
                            : 'hover:bg-surface-container-low/50'
                        }`}
                      >
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-primary">{g.nama}</div>
                          <div className="text-[10px] text-outline font-mono">NUPTK: {g.nipNuptk}</div>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="text-on-surface">{g.mapelUtama}</div>
                          <div className="text-[10px] text-on-surface-variant font-mono">
                            {g.kodeSertifikasi || 'Serdik Linier'}
                          </div>
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono">{g.jpPerRombel} JP</td>
                        <td className="py-2.5 px-2 text-center font-bold text-primary">
                          {g.jumlahRombel} Kelas
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono font-bold text-primary">
                          {g.jtmTatapMuka} Jam
                        </td>
                        <td className="py-2.5 px-3">
                          {g.jtmTugasTambahan > 0 ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                              <span className="material-symbols-outlined text-xs text-amber-600">stars</span>
                              <span>{g.tugasTambahan}</span>
                            </span>
                          ) : (
                            <span className="text-outline text-[11px]">-</span>
                          )}
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          <span
                            className={`font-mono font-black text-xs ${
                              isGtkValid ? 'text-emerald-700' : 'text-rose-700'
                            }`}
                          >
                            {g.totalJtm} Jam
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                              isGtkValid
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-rose-100 text-rose-800 border border-rose-200 animate-pulse'
                            }`}
                          >
                            <span className="material-symbols-outlined text-xs">
                              {isGtkValid ? 'check_circle' : 'warning'}
                            </span>
                            <span>{isGtkValid ? 'Valid (24+ Jam)' : 'Kurang Jam'}</span>
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedGuruId(g.id);
                              onShowToast(`Memuat data ${g.nama} ke kalkulator simulasi.`);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border ${
                              isSelected
                                ? 'bg-primary text-white border-primary shadow-xs'
                                : 'bg-white text-primary border-surface-container hover:bg-primary/10'
                            }`}
                          >
                            {isSelected ? 'Sedang Diuji' : 'Simulasikan'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. DISTRIBUSI MENGAJAR VIEW */}
      {subType === 'distribusi-mengajar' && (
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-surface-container pb-3">
            <div>
              <h3 className="font-bold text-base text-primary">Matriks Distribusi Mengajar Guru &amp; Rombel</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">Pemetaan pembagian jam mengajar mingguan SMA NU Kaplongan (30 Rombel)</p>
            </div>
            <button
              type="button"
              onClick={() => onShowToast("Mengekspor jadwal mengajar mingguan ke Excel...")}
              className="px-3.5 py-2 rounded-xl bg-surface-container-low text-primary text-xs font-semibold hover:bg-surface-container flex items-center gap-1.5 border border-surface-container"
            >
              <span className="material-symbols-outlined text-base text-emerald-700">table_view</span>
              <span>Ekspor Matriks</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-surface-container-low text-primary font-bold border-b border-surface-container">
                  <th className="py-2.5 px-3">Nama Guru Pengampu</th>
                  <th className="py-2.5 px-3">Mata Pelajaran</th>
                  <th className="py-2.5 px-2 text-center">JP/Rombel</th>
                  <th className="py-2.5 px-2 text-center">X-1 s/d X-10</th>
                  <th className="py-2.5 px-2 text-center">XI-1 s/d XI-10</th>
                  <th className="py-2.5 px-2 text-center">XII-1 s/d XII-10</th>
                  <th className="py-2.5 px-2 text-center">Tatap Muka</th>
                  <th className="py-2.5 px-2 text-center">Tugas Tambahan</th>
                  <th className="py-2.5 px-3 text-center">Total JTM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container/60">
                {gtkList.filter((g) => g.jtmTatapMuka > 0 || g.jtmTugasTambahan > 0).map((g) => (
                  <tr key={g.id} className="hover:bg-surface-container-low/40">
                    <td className="py-2.5 px-3 font-bold text-primary">{g.nama}</td>
                    <td className="py-2.5 px-3 text-on-surface">{g.mapelUtama}</td>
                    <td className="py-2.5 px-2 text-center font-mono">{g.jpPerRombel} JP</td>
                    <td className="py-2.5 px-2 text-center font-mono text-on-surface">
                      {g.rombelList?.filter((r) => r.startsWith('X-')).length || 0} Rombel
                    </td>
                    <td className="py-2.5 px-2 text-center font-mono text-on-surface">
                      {g.rombelList?.filter((r) => r.startsWith('XI-')).length || 0} Rombel
                    </td>
                    <td className="py-2.5 px-2 text-center font-mono text-on-surface">
                      {g.rombelList?.filter((r) => r.startsWith('XII-')).length || 0} Rombel
                    </td>
                    <td className="py-2.5 px-2 text-center font-mono font-bold text-primary">
                      {g.jtmTatapMuka} Jam
                    </td>
                    <td className="py-2.5 px-2 text-center font-mono text-amber-700 font-semibold">
                      {g.jtmTugasTambahan > 0 ? `+${g.jtmTugasTambahan} Jam` : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold">
                      <span className={g.totalJtm >= 24 ? 'text-emerald-700' : 'text-rose-700'}>
                        {g.totalJtm} Jam
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. LINIERITAS SERTIFIKASI VIEW */}
      {subType === 'linieritas-sertifikasi' && (
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-surface-container pb-3">
            <div>
              <h3 className="font-bold text-base text-primary">Verifikasi Linieritas Sertifikasi Pendidik (Info GTK)</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">Kesesuaian kode bidang studi sertifikasi dengan mata pelajaran riil yang diampu</p>
            </div>
            <button
              type="button"
              onClick={() => onShowToast("Memperbarui status validasi Info GTK dari server pusat...")}
              className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-base">sync</span>
              <span>Tarik Status Info GTK</span>
            </button>
          </div>

          <div className="space-y-3">
            {gtkList.filter((g) => g.sertifikasi === 'Sudah Sertifikasi').map((g) => (
              <div
                key={g.id}
                className="p-4 rounded-xl bg-surface-container-low border border-surface-container flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-2xl">verified_user</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-primary">{g.nama}</h5>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">
                      NUPTK: {g.nipNuptk} • Bidang Studi Serdik: <strong>{g.kodeSertifikasi || g.mapelUtama}</strong>
                    </p>
                    <p className="text-[10px] text-outline mt-0.5">
                      Beban Kerja: {g.totalJtm} Jam ({g.jtmTatapMuka} Tatap Muka + {g.jtmTugasTambahan} Tugas Tambahan)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-700 block">Linier 100%</span>
                    <span className="text-[10.5px] text-on-surface-variant">
                      {g.totalJtm >= 24 ? 'Status SKTP: Siap Terbit' : 'Status SKTP: Kurang Jam'}
                    </span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full font-bold text-xs ${
                      g.totalJtm >= 24
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {g.totalJtm >= 24 ? 'Valid' : 'Kurang Jam'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

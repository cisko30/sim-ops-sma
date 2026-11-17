import React, { useState } from 'react';
import { MOCK_ARSIP_LIST, ArsipItem } from '../../data/modulesData';
import { SchoolInfo } from '../../types';

interface ArsipGeneratorViewProps {
  subType: 'e-arsip-digital-dokumen' | 'generator-sk-dan-surat';
  schoolInfo?: SchoolInfo;
  onShowToast: (msg: string) => void;
}

export const ArsipGeneratorView: React.FC<ArsipGeneratorViewProps> = ({
  subType,
  schoolInfo,
  onShowToast
}) => {
  const [arsipList] = useState<ArsipItem[]>(MOCK_ARSIP_LIST);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('ALL');

  // Generator State
  const [jenisSurat, setJenisSurat] = useState<'sk-tugas' | 'tugas-abm' | 'ket-aktif'>('sk-tugas');
  const [targetNama, setTargetNama] = useState('Ahmad Fauzi, S.Pd, M.Si');
  const [nomorSuratCustom, setNomorSuratCustom] = useState('421.3/095/SMA-NU/XI/2026');

  const filteredArsip = arsipList.filter((a) => {
    const matchSearch =
      a.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.nomorSurat.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedKategori === 'ALL' || a.kategori === selectedKategori;
    return matchSearch && matchCat;
  });

  const handleDownloadArsip = (item: ArsipItem) => {
    onShowToast(`Mengunduh file: ${item.judul} (${item.ukuranFile})...`);
  };

  const handleGenerateSurat = () => {
    onShowToast(`Dokumen ${jenisSurat.toUpperCase()} No: ${nomorSuratCustom} berhasil diterbitkan dan masuk ke E-Arsip!`);
  };

  return (
    <div className="flex flex-col gap-space-lg">
      {/* 1. E-ARSIP DIGITAL VIEW */}
      {subType === 'e-arsip-digital-dokumen' && (
        <div className="space-y-4">
          {/* Header & Upload Bar */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-primary">Brankas E-Arsip Digital SMA NU Kaplongan</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Penyimpanan terpusat dokumen resmi SK Kepala Sekolah, SPTJM Dapodik, Ijazah, dan Berita Acara
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onShowToast("Membuka dialog upload arsip baru...")}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container shadow-xs flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">upload_file</span>
                <span>Unggah Berkas Baru</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-outline">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama dokumen atau nomor surat arsip..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container-low text-xs border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex rounded-xl bg-surface-container-low p-1 text-xs border border-surface-container overflow-x-auto">
              <button
                type="button"
                onClick={() => setSelectedKategori('ALL')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  selectedKategori === 'ALL' ? 'bg-primary text-white font-bold' : 'text-on-surface-variant'
                }`}
              >
                Semua Berkas
              </button>
              <button
                type="button"
                onClick={() => setSelectedKategori('SK Kepala Sekolah')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  selectedKategori === 'SK Kepala Sekolah' ? 'bg-primary text-white font-bold' : 'text-on-surface-variant'
                }`}
              >
                SK Kepsek
              </button>
              <button
                type="button"
                onClick={() => setSelectedKategori('SPTJM & Berita Acara')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  selectedKategori === 'SPTJM & Berita Acara' ? 'bg-primary text-white font-bold' : 'text-on-surface-variant'
                }`}
              >
                SPTJM &amp; Berita Acara
              </button>
            </div>
          </div>

          {/* Arsip List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredArsip.map((a) => (
              <div
                key={a.id}
                className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-[10.5px]">
                      {a.kategori}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-surface-container text-outline">
                      {a.format} • {a.ukuranFile}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-primary leading-snug">{a.judul}</h4>
                  <p className="text-[11px] text-on-surface-variant font-mono mt-1">
                    No: {a.nomorSurat}
                  </p>
                  <p className="text-[11px] text-outline mt-0.5">
                    Tanggal: {a.tanggal} • Diunggah oleh: {a.pengunggah}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-surface-container/60 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">lock</span>
                    <span>Tersimpan Aman</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDownloadArsip(a)}
                    className="px-3.5 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm">download</span>
                    <span>Unduh Berkas</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. GENERATOR SK & SURAT VIEW */}
      {subType === 'generator-sk-dan-surat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-6 p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div>
                <h3 className="font-bold text-base text-primary">Generator SK &amp; Surat Tugas Kedinasan</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Penerbitan otomatis format kedinasan SMA NU Kaplongan bertandatangan Kepala Sekolah
                </p>
              </div>
              <span className="material-symbols-outlined text-primary text-2xl">draft</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-on-surface-variant block mb-1">
                Pilih Jenis Surat Kedinasan:
              </label>
              <select
                value={jenisSurat}
                onChange={(e) => setJenisSurat(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-surface-container-low border border-surface-container text-xs font-bold text-primary focus:outline-none"
              >
                <option value="sk-tugas">SK Pembagian Beban Tugas Guru &amp; Tenaga Kependidikan</option>
                <option value="tugas-abm">Surat Tugas Proktor &amp; Teknisi Asesmen Bakat Murid (ABM)</option>
                <option value="ket-aktif">Surat Keterangan Aktif Belajar Peserta Didik</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-on-surface-variant block mb-1">
                Nomor Surat Resmi:
              </label>
              <input
                type="text"
                value={nomorSuratCustom}
                onChange={(e) => setNomorSuratCustom(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-surface-container-low border border-surface-container text-xs font-mono font-bold text-on-surface"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-on-surface-variant block mb-1">
                Penerima Tugas / Subjek Surat:
              </label>
              <input
                type="text"
                value={targetNama}
                onChange={(e) => setTargetNama(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-surface-container-low border border-surface-container text-xs font-bold text-primary"
              />
            </div>

            <button
              type="button"
              onClick={handleGenerateSurat}
              className="w-full py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-container shadow-sm flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base">auto_awesome</span>
              <span>Terbitkan Dokumen &amp; Simpan ke Arsip</span>
            </button>
          </div>

          <div className="lg:col-span-6 p-6 rounded-2xl bg-white border border-surface-container shadow-md text-black flex flex-col justify-between">
            <div className="space-y-3 text-center border-b-2 border-black pb-3">
              <h4 className="text-[10px] font-bold uppercase">{schoolInfo?.institution || "LEMBAGA MA'ARIF NU"}</h4>
              <h3 className="text-lg font-bold uppercase text-[#0f5927]">{schoolInfo?.schoolName || "SMA NU KAPLONGAN"}</h3>
              <p className="text-[10px]">{schoolInfo?.address || "Jl. Raya Kaplongan No. 28 Karangampel"}</p>
            </div>

            <div className="my-4 text-center space-y-1">
              <h4 className="text-xs font-bold uppercase underline">
                {jenisSurat === 'sk-tugas' && 'SURAT KEPUTUSAN KEPALA SEKOLAH'}
                {jenisSurat === 'tugas-abm' && 'SURAT TUGAS PROKTOR & TEKNISI ABM'}
                {jenisSurat === 'ket-aktif' && 'SURAT KETERANGAN AKTIF SISWA'}
              </h4>
              <p className="text-[10.5px] font-mono">Nomor: {nomorSuratCustom}</p>
            </div>

            <p className="text-[11px] leading-relaxed">
              Menugaskan kepada: <strong>{targetNama}</strong> untuk melaksanakan tugas operasional kedinasan pada satuan pendidikan SMA NU Kaplongan Semester Ganjil Tahun Ajaran 2026/2027.
            </p>

            <div className="mt-6 pt-3 text-right text-[11px]">
              <p>Indramayu, 12 November 2026</p>
              <p className="font-semibold">Kepala Sekolah,</p>
              <div className="h-12 flex items-center justify-end italic text-xs">
                (Drs. H. Toufik Zaenal Mustofa)
              </div>
              <p className="font-bold underline">{schoolInfo?.principalName || "Drs. H. Toufik Zaenal Mustofa, M.Pd.I"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

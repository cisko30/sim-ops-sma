import React, { useState } from 'react';
import { SchoolInfo } from '../../types';
import { SCHOOL_INFO as DEFAULT_SCHOOL_INFO } from '../../data/mockData';

interface SchoolProfileViewProps {
  schoolInfo: SchoolInfo;
  onUpdateSchoolInfo: (updated: SchoolInfo) => void;
  onNavigateToReport: () => void;
  onShowToast: (msg: string) => void;
}

export const SchoolProfileView: React.FC<SchoolProfileViewProps> = ({
  schoolInfo,
  onUpdateSchoolInfo,
  onNavigateToReport,
  onShowToast
}) => {
  const [formData, setFormData] = useState<SchoolInfo>({ ...schoolInfo });
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (field: keyof SchoolInfo, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
    setIsSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSchoolInfo(formData);
    setIsSaved(true);
    onShowToast("Profil sekolah berhasil disimpan! Seluruh kop surat, lembar cetak, dan tanda tangan telah terintegrasi.");
  };

  const handleReset = () => {
    setFormData({ ...DEFAULT_SCHOOL_INFO });
    onUpdateSchoolInfo({ ...DEFAULT_SCHOOL_INFO });
    setIsSaved(true);
    onShowToast("Profil sekolah dikembalikan ke pengaturan awal SMA NU Kaplongan.");
  };

  return (
    <div className="flex flex-col gap-space-lg">
      {/* Page Title & Status Banner */}
      <div className="p-space-lg bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">account_balance</span>
            <h2 className="font-headline-md text-xl font-bold text-primary">
              Profil &amp; Identitas Satuan Pendidikan
            </h2>
          </div>
          <p className="text-body-sm text-on-surface-variant mt-1">
            Data ini terintegrasi langsung ke <strong>Kop Surat Resmi</strong>, <strong>Lembar Pengesahan Laporan</strong>, <strong>Tanda Tangan Dokumen</strong>, dan <strong>SPTJM Kedinasan</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNavigateToReport}
            className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-semibold text-xs hover:bg-surface-container-high transition-colors flex items-center gap-1.5 shrink-0 border border-surface-container shadow-sm"
          >
            <span className="material-symbols-outlined text-base">summarize</span>
            <span>Lihat Lembar Laporan</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        {/* Left Column (7 Cols): Edit Form */}
        <div className="lg:col-span-7 flex flex-col gap-space-md">
          <form onSubmit={handleSubmit} className="p-space-lg bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm space-y-5">
            {/* Section 1: Identitas Lembaga & Satuan Pendidikan */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2 pb-2 border-b border-surface-container">
                <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">1</span>
                Identitas Lembaga &amp; Satuan Pendidikan
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div className="sm:col-span-2">
                  <label className="block text-label-sm font-semibold text-on-surface-variant mb-1">
                    Nama Satuan Pendidikan (Sekolah)
                  </label>
                  <input
                    type="text"
                    value={formData.schoolName}
                    onChange={(e) => handleChange('schoolName', e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-surface-container-low rounded-xl border border-surface-container text-body-sm font-bold text-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Contoh: SMA NU Kaplongan"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-label-sm font-semibold text-on-surface-variant mb-1">
                    Lembaga / Yayasan Penyelenggara (Baris 1 Kop)
                  </label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => handleChange('institution', e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-surface-container-low rounded-xl border border-surface-container text-body-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary/20"
                    placeholder="Contoh: LEMBAGA PENDIDIKAN MA'ARIF NAHDLATUL ULAMA"
                  />
                </div>

                <div>
                  <label className="block text-label-sm font-semibold text-on-surface-variant mb-1">
                    Wilayah / Kecamatan &amp; Kabupaten
                  </label>
                  <input
                    type="text"
                    value={formData.subdistrict}
                    onChange={(e) => handleChange('subdistrict', e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-surface-container-low rounded-xl border border-surface-container text-body-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary/20"
                    placeholder="Contoh: KARANGAMPEL KABUPATEN INDRAMAYU"
                  />
                </div>

                <div>
                  <label className="block text-label-sm font-semibold text-on-surface-variant mb-1">
                    Status Akreditasi Sekolah
                  </label>
                  <input
                    type="text"
                    value={formData.accreditation}
                    onChange={(e) => handleChange('accreditation', e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-surface-container-low rounded-xl border border-surface-container text-body-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary/20"
                    placeholder="Contoh: A (TERAKREDITASI A)"
                  />
                </div>

                <div>
                  <label className="block text-label-sm font-semibold text-on-surface-variant mb-1">
                    Nomor Pokok Sekolah Nasional (NPSN)
                  </label>
                  <input
                    type="text"
                    value={formData.npsn}
                    onChange={(e) => handleChange('npsn', e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low rounded-xl border border-surface-container text-body-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary/20"
                    placeholder="Contoh: 20216007"
                  />
                </div>

                <div>
                  <label className="block text-label-sm font-semibold text-on-surface-variant mb-1">
                    Tahun Pelajaran &amp; Semester Aktif
                  </label>
                  <input
                    type="text"
                    value={formData.academicYear}
                    onChange={(e) => handleChange('academicYear', e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low rounded-xl border border-surface-container text-body-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary/20"
                    placeholder="Contoh: 2026/2027 Semester Ganjil"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Alamat & Kontak Resmi Kedinasan */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2 pb-2 border-b border-surface-container">
                <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">2</span>
                Alamat &amp; Kontak Resmi Kedinasan
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div className="sm:col-span-2">
                  <label className="block text-label-sm font-semibold text-on-surface-variant mb-1">
                    Alamat Lengkap (Jalan, Nomor, Desa)
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-surface-container-low rounded-xl border border-surface-container text-body-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary/20"
                    placeholder="Jl. Raya Kaplongan No. 28 Karangampel Kab. Indramayu"
                  />
                </div>

                <div>
                  <label className="block text-label-sm font-semibold text-on-surface-variant mb-1">
                    Kode Pos
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => handleChange('postalCode', e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low rounded-xl border border-surface-container text-body-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary/20"
                    placeholder="45283"
                  />
                </div>

                <div>
                  <label className="block text-label-sm font-semibold text-on-surface-variant mb-1">
                    Nomor Telepon / Fax
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low rounded-xl border border-surface-container text-body-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary/20"
                    placeholder="(0234) 486009"
                  />
                </div>

                <div>
                  <label className="block text-label-sm font-semibold text-on-surface-variant mb-1">
                    Email Resmi Sekolah
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-surface-container-low rounded-xl border border-surface-container text-body-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary/20"
                    placeholder="smanukplngn@gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-label-sm font-semibold text-on-surface-variant mb-1">
                    Website / Portal Sekolah
                  </label>
                  <input
                    type="text"
                    value={formData.website || ''}
                    onChange={(e) => handleChange('website', e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low rounded-xl border border-surface-container text-body-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary/20"
                    placeholder="www.smanukaplongan.sch.id"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Kepala Sekolah (Pejabat Pengesah Dokumen) */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2 pb-2 border-b border-surface-container">
                <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">3</span>
                Kepala Sekolah (Pejabat Pengesah Dokumen)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div className="sm:col-span-2">
                  <label className="block text-label-sm font-semibold text-on-surface-variant mb-1">
                    Nama Lengkap Kepala Sekolah &amp; Gelar
                  </label>
                  <input
                    type="text"
                    value={formData.principalName}
                    onChange={(e) => handleChange('principalName', e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-surface-container-low rounded-xl border border-surface-container text-body-sm font-bold text-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Contoh: Drs. H. Toufik Zaenal Mustofa, M.Pd.I"
                  />
                </div>

                <div>
                  <label className="block text-label-sm font-semibold text-on-surface-variant mb-1">
                    NIP / NUPTK Kepala Sekolah
                  </label>
                  <input
                    type="text"
                    value={formData.principalNip}
                    onChange={(e) => handleChange('principalNip', e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low rounded-xl border border-surface-container text-body-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary/20"
                    placeholder="Isi '-' jika belum ada NIP"
                  />
                </div>

                <div>
                  <label className="block text-label-sm font-semibold text-on-surface-variant mb-1">
                    Jabatan Resmi di Dokumen
                  </label>
                  <input
                    type="text"
                    value={formData.principalTitle}
                    onChange={(e) => handleChange('principalTitle', e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low rounded-xl border border-surface-container text-body-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary/20"
                    placeholder="Kepala SMA NU Kaplongan"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Operator Sekolah (Petugas Pelaksana SIM-OPS) */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2 pb-2 border-b border-surface-container">
                <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">4</span>
                Operator Sekolah (Petugas Pelaksana SIM-OPS)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div className="sm:col-span-2">
                  <label className="block text-label-sm font-semibold text-on-surface-variant mb-1">
                    Nama Lengkap Operator &amp; Gelar
                  </label>
                  <input
                    type="text"
                    value={formData.operatorName}
                    onChange={(e) => handleChange('operatorName', e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-surface-container-low rounded-xl border border-surface-container text-body-sm font-bold text-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Contoh: Bagas Pratama, S.Kom"
                  />
                </div>

                <div>
                  <label className="block text-label-sm font-semibold text-on-surface-variant mb-1">
                    NIP / NUPTK Operator
                  </label>
                  <input
                    type="text"
                    value={formData.operatorNip}
                    onChange={(e) => handleChange('operatorNip', e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low rounded-xl border border-surface-container text-body-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary/20"
                    placeholder="Contoh: 199104152020121008"
                  />
                </div>

                <div>
                  <label className="block text-label-sm font-semibold text-on-surface-variant mb-1">
                    Unit Kerja / Satuan Operasional
                  </label>
                  <input
                    type="text"
                    value={formData.operatorUnit}
                    onChange={(e) => handleChange('operatorUnit', e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low rounded-xl border border-surface-container text-body-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary/20"
                    placeholder="Unit Tata Usaha & Operasional Sekolah"
                  />
                </div>
              </div>
            </div>

            {/* Submit & Reset Buttons */}
            <div className="pt-4 border-t border-surface-container flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface font-semibold text-xs hover:bg-surface-container transition-all border border-surface-container"
              >
                Kembalikan ke Default
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-container shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-95"
              >
                <span className="material-symbols-outlined text-base">save</span>
                <span>Simpan Perubahan Profil</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column (5 Cols): Live Preview of Official Kop Surat & Signatures */}
        <div className="lg:col-span-5 flex flex-col gap-space-md">
          <div className="p-space-md bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-primary">preview</span>
                Pratinjau Kop &amp; Tanda Tangan Resmi
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                Live Preview
              </span>
            </div>

            {/* Official Kop Preview Box */}
            <div className="p-4 bg-white rounded-xl border border-surface-container text-center shadow-inner">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="shrink-0 w-14 flex items-center justify-center">
                  <img
                    src="/logo-sma-nu.png?v=3"
                    alt="Logo Sekolah"
                    className="w-full max-h-16 object-contain"
                  />
                </div>

                <div className="flex flex-col text-center">
                  <h5 className="text-[10px] font-extrabold uppercase text-black font-sans leading-tight">
                    {formData.institution || "LEMBAGA PENYELENGGARA"}
                  </h5>
                  <h4 className="text-base font-extrabold tracking-wide text-[#0f5927] font-serif uppercase my-0.5 leading-tight">
                    {formData.schoolName || "NAMA SATUAN PENDIDIKAN"}
                  </h4>
                  <h6 className="text-[10px] font-bold uppercase text-black leading-tight">
                    {formData.subdistrict || "WILAYAH / KABUPATEN"}
                  </h6>
                  <h6 className="text-[9px] font-bold uppercase text-black leading-tight">
                    TERAKREDITASI &ldquo;{formData.accreditation || "A"}&rdquo;
                  </h6>
                  <p className="text-[9px] text-black font-normal mt-0.5 leading-tight">
                    {formData.address}
                  </p>
                  <p className="text-[9px] text-black font-normal leading-tight">
                    Kode Pos {formData.postalCode} Telp. {formData.phone} E-mail : <span className="underline">{formData.email}</span>
                  </p>
                </div>
              </div>

              {/* Double border */}
              <div className="w-full border-b-[2px] border-black mt-1"></div>
              <div className="w-full border-b border-black mt-[1.5px]"></div>
            </div>

            {/* Official Signatures Footer Preview */}
            <div className="p-4 bg-white rounded-xl border border-surface-container shadow-inner text-center">
              <h5 className="text-[11px] font-bold text-primary uppercase tracking-wider mb-3">
                Format Tanda Tangan Dokumen
              </h5>

              <div className="grid grid-cols-2 gap-4 text-[10px]">
                {/* Operator Signature */}
                <div className="flex flex-col items-center">
                  <div className="h-9 flex flex-col justify-start items-center">
                    <p className="text-black font-medium leading-tight">Petugas Pelaksana,</p>
                    <p className="text-gray-600 leading-tight">Operator Sekolah (OPS)</p>
                  </div>
                  <div className="h-14 my-1"></div>
                  <div className="flex flex-col items-center">
                    <p className="font-bold underline text-black">{formData.operatorName}</p>
                    <p className="text-gray-600 text-[9px] mt-0.5">NIP/NUPTK: {formData.operatorNip || '-'}</p>
                  </div>
                </div>

                {/* Principal Signature */}
                <div className="flex flex-col items-center">
                  <div className="h-9 flex flex-col justify-start items-center">
                    <p className="text-black font-medium leading-tight">Mengetahui &amp; Mengesahkan,</p>
                    <p className="text-gray-600 leading-tight">{formData.principalTitle || `Kepala ${formData.schoolName}`}</p>
                  </div>
                  <div className="h-14 my-1"></div>
                  <div className="flex flex-col items-center">
                    <p className="font-bold underline text-black">{formData.principalName}</p>
                    <p className="text-gray-600 text-[9px] mt-0.5">NIP/NUPTK: {formData.principalNip || '-'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notification & Integration Status */}
            <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container text-xs text-on-surface-variant space-y-1">
              <div className="font-bold text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-emerald-700">sync_saved_locally</span>
                <span>Sinkronisasi Otomatis Seluruh Fitur</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Setiap kali data disimpan, perubahan otomatis mengalir ke lembar cetak laporan, rekap bulanan, ringkasan dashboard, dan generator jurnal.
              </p>
              {isSaved && (
                <div className="mt-2 p-2 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span>Perubahan telah tersimpan dan aktif di semua modul!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


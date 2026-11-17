import React, { useState, useMemo } from 'react';

export interface OperatorSkillItem {
  id: string;
  title: string;
  category: 'Dapodik' | 'Asesmen' | 'GTK & Siswa' | 'Administrasi';
  level: 'Dasar' | 'Menengah' | 'Lanjutan';
  badge: string;
  summary: string;
  sopSteps: string[];
  keyChecklist: string[];
  relatedPortal?: string;
  relatedPortalUrl?: string;
}

interface OperatorSkillsViewProps {
  onShowToast: (msg: string) => void;
  onNavigateToJurnal?: () => void;
}

export const OPERATOR_SKILLS_DATA: OperatorSkillItem[] = [
  {
    id: 'skill-dapodik-sync',
    title: 'Manajemen Sinkronisasi Dapodik & Pemutakhiran Semester',
    category: 'Dapodik',
    level: 'Dasar',
    badge: 'Tugas Pokok',
    summary: 'Prosedur standar penarikan data peserta didik baru (SPMB), kelulusan tingkat akhir, pembaruan sarana prasarana, dan pengiriman sinkronisasi tanpa invalid.',
    sopSteps: [
      'Lakukan update aplikasi Dapodik versi terbaru dari portal resmi dapo.kemdikbud.go.id.',
      'Tarik data peserta didik baru melalui menu SPMB / Tarik PD Online.',
      'Lakukan validasi lokal pada seluruh tab (Sekolah, Sarpras, GTK, PD, Rombel, Jadwal).',
      'Pastikan jumlah data "Invalid" bernilai 0 (nol) sebelum meminta persetujuan Kepala Sekolah.',
      'Lakukan sinkronisasi menggunakan akun kepala sekolah / operator dan cetak lembar SPTJM.'
    ],
    keyChecklist: [
      'Aplikasi Dapodik versi terkini terpasang',
      'Data Sarpras & Tanah terisi luasan riil',
      'Data Rombel & Jadwal mingguan terisi lengkap',
      '0 Data Invalid pada validasi lokal',
      'SPTJM ditandatangani Kepala Sekolah'
    ],
    relatedPortal: 'Manajemen Dapodik SSO',
    relatedPortalUrl: 'https://dapo.kemdikbud.go.id'
  },
  {
    id: 'skill-verval-pd',
    title: 'Verval PD & Pemadanan NIK Dukcapil',
    category: 'GTK & Siswa',
    level: 'Menengah',
    badge: 'Residu NIK',
    summary: 'Keahlian identifikasi dan perbaikan data identitas siswa (Nama, Tempat/Tanggal Lahir, Nama Ibu Kandung) agar padan dengan catatan kependudukan Disdukcapil pusat.',
    sopSteps: [
      'Buka portal vervalpd.data.kemdikbud.go.id menggunakan akun SSO satuan pendidikan.',
      'Pilih menu "Pengelolaan" > "Perbaikan Identitas" atau "Residu".',
      'Periksa perbedaan karakter antara dokumen KK/Akta Lahir fisik dengan data di sistem.',
      'Ketikkan NIK 16 digit dan nomor Kartu Keluarga yang valid sesuai catatan Dukcapil.',
      'Lampirkan scan dokumen pendukung format JPG/PDF dan kirim pengajuan verifikasi.'
    ],
    keyChecklist: [
      'Pemeriksaan kesesuaian NIK 16 digit',
      'Verifikasi nama ibu kandung sesuai Akta Lahir',
      'Status centang hijau (Padan Dukcapil)',
      'Dokumen KK terbaru siswa telah diarsipkan'
    ],
    relatedPortal: 'Portal Verval PD',
    relatedPortalUrl: 'https://vervalpd.data.kemdikbud.go.id'
  },
  {
    id: 'skill-abm-pusmendik',
    title: 'Pelaksanaan Asesmen Bakat Murid (ABM)',
    category: 'Asesmen',
    level: 'Lanjutan',
    badge: 'ABM 2026',
    summary: 'Teknis penyelenggaraan asesmen bakat minat murid kelas XII Pusmendik BSKAP, manajemen sesi laboratorium komputer, distribusi token, dan pelaporan berita acara.',
    sopSteps: [
      'Akses portal abm.pusmendik.kemdikbud.go.id dan finalisasi data peserta kelas XII sebelum cut-off.',
      'Atur jadwal gelombang, sesi ruangan, dan penetapan proktor serta teknisi laboratorium.',
      'Unduh dan cetak kartu login peserta ABM beserta daftar hadir per sesi.',
      'Pastikan komputer proktor dan client terhubung ke server Pusmendik dengan latensi < 5ms.',
      'Selesai tes, unggah scan berita acara dan daftar hadir bertandatangan Kepala Sekolah.'
    ],
    keyChecklist: [
      'Kesiapan 40 PC client lab komputer',
      'Cetak kartu peserta & daftar hadir sesi',
      'Pelaksanaan ujian tanpa kendala teknis',
      'Upload berita acara resmi ke web Pusmendik'
    ],
    relatedPortal: 'Web Resmi ABM Pusmendik',
    relatedPortalUrl: 'https://abm.pusmendik.kemdikbud.go.id'
  },
  {
    id: 'skill-tka-skolastik',
    title: 'Pengelolaan Tes Kemampuan Akademik (TKA)',
    category: 'Asesmen',
    level: 'Menengah',
    badge: 'Pemetaan Peminatan',
    summary: 'Penyiapan sistem asesmen skolastik dan literasi-numerasi untuk pemetaan peminatan akademik murid Kurikulum Merdeka serta pengolahan buku skor nilai.',
    sopSteps: [
      'Sinkronisasi daftar peserta didik baru dan rombel Fase E/F yang mengikuti asesmen akademik.',
      'Konfigurasi paket soal kemampuan penalaran umum dan matematika dasar pada aplikasi CBT.',
      'Pengawasan sesi tes dan pencatatan log kehadiran peserta didik.',
      'Unduh rekap skor nilai hasil ujian dan konversikan ke format rekapitulasi sekolah.',
      'Serahkan laporan pemetaan akademik kepada Waka Kurikulum dan Guru BK.'
    ],
    keyChecklist: [
      'Data peserta TKA terverifikasi',
      'Aplikasi CBT berjalan lancar',
      'Rekapitulasi skor per rumpun selesai',
      'Hasil diserahkan ke Tim Kurikulum & BK'
    ]
  },
  {
    id: 'skill-pip-simpel',
    title: 'Penatausahaan Bantuan PIP & Rekening SimPel BNI',
    category: 'GTK & Siswa',
    level: 'Menengah',
    badge: 'SimPel BNI',
    summary: 'Pengelolaan data siswa penerima bantuan Program Indonesia Pintar, penerbitan surat kuasa kolektif Kepala Sekolah, dan koordinasi pencairan perbankan.',
    sopSteps: [
      'Cek daftar SK Nominasi dan SK Pemberian di portal SiPintar pip.kemdikbud.go.id.',
      'Kumpulkan berkas persyaratan siswa (fotokopi KK, KTP orang tua, dan surat aktif).',
      'Generate Surat Kuasa Kolektif Kepala Sekolah dan cetak lampiran daftar nama siswa.',
      'Serahkan berkas kolektif ke Customer Service Bank BNI Cabang Pembantu.',
      'Pantau penyaluran dana hingga buku rekening SimPel aktif dan diterima peserta didik.'
    ],
    keyChecklist: [
      'Cek status SK Nominasi & Pemberian',
      'Verifikasi berkas persyaratan 100% lengkap',
      'Cetak Surat Kuasa Kolektif Kepala Sekolah',
      'Laporan SPJ realisasi penyerahan buku tabungan'
    ],
    relatedPortal: 'Portal PIP SiPintar',
    relatedPortalUrl: 'https://pip.kemdikbud.go.id'
  },
  {
    id: 'skill-snbp-pdss',
    title: 'Audit Ledger Nilai Manual & Pengisian PDSS SNBP',
    category: 'Administrasi',
    level: 'Lanjutan',
    badge: 'SNBP Kuota 40%',
    summary: 'Audit kelengkapan buku ledger nilai manual sekolah semester 1 s.d. 5, penentuan 40% siswa eligible akreditasi A, dan verifikasi data pangkalan sekolah SNPMB.',
    sopSteps: [
      'Himpun buku ledger nilai manual kelas X, XI, dan XII dari seluruh guru mata pelajaran.',
      'Hitung rata-rata nilai seluruh mata pelajaran sesuai pedoman SNPMB BPPP.',
      'Buat peringkat kuota 40% siswa eligible (karena SMA NU Kaplongan berakreditasi A).',
      'Sosialisasikan daftar nama siswa eligible kepada siswa dan guru BK.',
      'Lakukan pengisian dan finalisasi data nilai siswa pada portal resmi PDSS.'
    ],
    keyChecklist: [
      'Buku ledger nilai manual semester 1-5 lengkap',
      'Perhitungan rata-rata nilai terverifikasi',
      'Daftar 40% siswa eligible disetujui Kepala Sekolah',
      'Finalisasi portal PDSS sebelum batas cut-off'
    ],
    relatedPortal: 'Portal PDSS SNPMB',
    relatedPortalUrl: 'https://pdss.snpmb.bppp.kemdikbud.go.id'
  },
  {
    id: 'skill-jtm-linieritas',
    title: 'Audit Beban Mengajar (JTM) & Validasi Info GTK',
    category: 'Dapodik',
    level: 'Lanjutan',
    badge: 'SKTP Guru',
    summary: 'Keahlian menghitung pemenuhan minimal 24 JTM guru bersertifikasi, pemetaan ekuivalensi tugas tambahan (Waka, Kepala Lab, Pembina), dan status Info GTK.',
    sopSteps: [
      'Cocokkan jam tatap muka mingguan pada struktur kurikulum dengan jadwal riil.',
      'Input SK Tugas Tambahan resmi yang ditandatangani Kepala Sekolah ke Dapodik.',
      'Pastikan beban total guru sertifikasi mencapai minimal 24 JTM linier.',
      'Periksa status validasi pada portal Info GTK hingga berstatus "Valid / Siap SKTP".'
    ],
    keyChecklist: [
      'Ambang batas 24 JTM terpenuhi',
      'Ekuivalensi tugas tambahan diakui sistem',
      'Kode sertifikasi bidang studi linier',
      'Status Info GTK centang hijau'
    ],
    relatedPortal: 'Portal Info GTK Kemdikbud',
    relatedPortalUrl: 'https://info.gtk.kemdikbud.go.id'
  },
  {
    id: 'skill-arsip-backup',
    title: 'Pencadangan Database Server & E-Arsip Digital',
    category: 'Administrasi',
    level: 'Dasar',
    badge: 'Keamanan Data',
    summary: 'Prosedur pemeliharaan rutin pencadangan database lokal PostgreSQL 5774, digitalisasi dokumen ijazah, dan pengamanan arsip SPTJM kedinasan.',
    sopSteps: [
      'Jalankan skrip dump backup otomatis database Dapodik lokal secara berkala.',
      'Simpan salinan cadangan terkompresi pada media penyimpanan sekunder / flashdisk.',
      'Lakukan pemindaian (scanning) dokumen SK, ijazah, dan SPTJM format PDF resolusi 300 DPI.',
      'Beri penamaan dokumen arsip standar kedinasan dan simpan di brankas digital.'
    ],
    keyChecklist: [
      'File backup database mingguan tersimpan aman',
      'Arsip digital SPTJM & SK tersusun rapi',
      'Penyimpanan sekunder bebas virus'
    ]
  }
];

export const OperatorSkillsView: React.FC<OperatorSkillsViewProps> = ({
  onShowToast,
  onNavigateToJurnal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSkill, setSelectedSkill] = useState<OperatorSkillItem>(OPERATOR_SKILLS_DATA[0]);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const toggleStep = (stepKey: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepKey]: !prev[stepKey]
    }));
  };

  const filteredSkills = useMemo(() => {
    return OPERATOR_SKILLS_DATA.filter((skill) => {
      const matchSearch =
        skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.badge.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === 'ALL' || skill.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="flex flex-col gap-space-lg">
      {/* Top Banner Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-primary to-primary-container text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
            <span className="material-symbols-outlined text-3xl">psychology_alt</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold tracking-tight">
                Bank Skills &amp; Panduan Teknis Operator (OPS Mastery Hub)
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-emerald-950 text-[10.5px] font-extrabold uppercase">
                Standar Nasional
              </span>
            </div>
            <p className="text-xs text-white/80 mt-1 max-w-2xl leading-relaxed">
              Panduan langkah-demi-langkah (SOP), checklist verifikasi dokumen, dan kompetensi teknis operasional sekolah untuk Dapodik, Verval PD, ABM, TKA, PIP, hingga SNBP.
            </p>
          </div>
        </div>

        {onNavigateToJurnal && (
          <button
            type="button"
            onClick={onNavigateToJurnal}
            className="px-4 py-2.5 rounded-xl bg-white text-primary font-bold text-xs hover:bg-white/90 shadow-sm flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">edit_calendar</span>
            <span>Terapkan ke Jurnal Harian</span>
          </button>
        )}
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (5 Cols): Skill Selector List */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {/* Search & Category Filter */}
          <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs space-y-2.5">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-outline">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari panduan SOP atau kompetensi..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-surface-container-low text-xs border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex rounded-xl bg-surface-container-low p-1 text-[11px] border border-surface-container overflow-x-auto">
              {['ALL', 'Dapodik', 'Asesmen', 'GTK & Siswa', 'Administrasi'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {cat === 'ALL' ? 'Semua' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Skill Items List */}
          <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-surface-container [&::-webkit-scrollbar-thumb]:rounded-full">
            {filteredSkills.map((skill) => {
              const isSelected = selectedSkill.id === skill.id;
              return (
                <div
                  key={skill.id}
                  onClick={() => setSelectedSkill(skill)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer shadow-xs text-left flex flex-col justify-between ${
                    isSelected
                      ? 'bg-primary/10 border-primary shadow-sm'
                      : 'bg-surface-container-lowest border-surface-container hover:border-primary/40 hover:bg-surface-container-low/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-surface-container text-primary font-bold text-[10px]">
                        {skill.category}
                      </span>
                      <span
                        className={`text-[9.5px] px-2 py-0.2 rounded-full font-bold ${
                          skill.level === 'Dasar'
                            ? 'bg-blue-100 text-blue-800'
                            : skill.level === 'Menengah'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        Level: {skill.level}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-primary leading-snug">
                      {skill.title}
                    </h4>
                    <p className="text-[11px] text-on-surface-variant mt-1 line-clamp-2 leading-relaxed">
                      {skill.summary}
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-surface-container/60 flex items-center justify-between text-[10.5px]">
                    <span className="text-outline font-medium">
                      {skill.sopSteps.length} Langkah SOP
                    </span>
                    <span className="text-primary font-bold flex items-center gap-0.5">
                      <span>Lihat Panduan</span>
                      <span className="material-symbols-outlined text-xs">chevron_right</span>
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredSkills.length === 0 && (
              <div className="p-8 text-center text-xs text-outline bg-surface-container-lowest rounded-2xl border border-surface-container">
                Tidak ada panduan skill dengan kata kunci &ldquo;{searchQuery}&rdquo;
              </div>
            )}
          </div>
        </div>

        {/* Right Column (7 Cols): Detailed SOP, Checklist & Action */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="p-5 sm:p-6 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs space-y-5">
            {/* Title & Metadata */}
            <div className="border-b border-surface-container pb-4">
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                  {selectedSkill.badge}
                </span>
                <span className="text-xs text-on-surface-variant font-medium">
                  Kategori: <strong className="text-primary">{selectedSkill.category}</strong> • Level {selectedSkill.level}
                </span>
              </div>
              <h3 className="text-lg font-bold text-primary tracking-tight">
                {selectedSkill.title}
              </h3>
              <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                {selectedSkill.summary}
              </p>
            </div>

            {/* SOP Step-by-Step Instructions */}
            <div>
              <h4 className="font-bold text-xs text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-base">format_list_numbered</span>
                <span>Prosedur Operasional Standar (Langkah-Langkah SOP):</span>
              </h4>

              <div className="space-y-2">
                {selectedSkill.sopSteps.map((step, idx) => {
                  const stepKey = `${selectedSkill.id}-step-${idx}`;
                  const isDone = !!completedSteps[stepKey];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleStep(stepKey)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                        isDone
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                          : 'bg-surface-container-low border-surface-container hover:bg-surface-container/70'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : 'bg-primary/10 text-primary'
                        }`}
                      >
                        {isDone ? (
                          <span className="material-symbols-outlined text-sm">check</span>
                        ) : (
                          idx + 1
                        )}
                      </div>
                      <div className="flex-1 text-xs leading-relaxed">
                        <span className={isDone ? 'line-through opacity-70' : 'font-medium'}>
                          {step}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Verification Checklist */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container space-y-2">
              <h5 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-emerald-700">task_alt</span>
                <span>Indikator Keberhasilan (Checklist Verifikasi Dokumen):</span>
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                {selectedSkill.keyChecklist.map((check, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-on-surface">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
                    <span>{check}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-3 border-t border-surface-container flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-on-surface-variant">
                {selectedSkill.relatedPortal && selectedSkill.relatedPortalUrl ? (
                  <a
                    href={selectedSkill.relatedPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-primary hover:underline font-bold"
                  >
                    <span>Buka {selectedSkill.relatedPortal}</span>
                    <span className="material-symbols-outlined text-xs">open_in_new</span>
                  </a>
                ) : (
                  <span>Tersedia secara internal di SIM-OPS SMA NU Kaplongan</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onShowToast(`Mencetak lembar SOP ${selectedSkill.title} ke format PDF...`)}
                  className="px-3.5 py-2 rounded-xl bg-surface-container text-primary text-xs font-semibold hover:bg-surface-container-high flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">print</span>
                  <span>Cetak SOP</span>
                </button>

                {onNavigateToJurnal && (
                  <button
                    type="button"
                    onClick={() => {
                      onShowToast(`Membuka form jurnal untuk mencatat aktivitas "${selectedSkill.title}"...`);
                      onNavigateToJurnal();
                    }}
                    className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container shadow-xs flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm">edit_note</span>
                    <span>Catat ke Jurnal</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


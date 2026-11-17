import React, { useState } from 'react';
import { GTKItem, SiswaItem } from '../../../data/modulesData';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'gtk' | 'siswa';
  onImportGtk: (items: GTKItem[], replace: boolean) => void;
  onImportSiswa: (items: SiswaItem[], replace: boolean) => void;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  isOpen,
  onClose,
  type,
  onImportGtk,
  onImportSiswa
}) => {
  const [inputText, setInputText] = useState('');
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);

  if (!isOpen) return null;

  const isGtk = type === 'gtk';

  // Sample templates
  const gtkTemplate = `Nama Lengkap\tNIP/NUPTK\tJenis PTK\tStatus Kepegawaian\tMapel Utama\tJTM\tTugas Tambahan\tSertifikasi\tNo HP
Drs. Ahmad Mansur, M.Pd\t198001152005011003\tGuru Mapel\tGTY\tFisika\t24\tTidak Ada\tSudah Sertifikasi\t081234567890
Nurul Hidayati, S.Pd\t198904122018022014\tGuru Mapel\tGTY\tKimia\t18\tWali Kelas (2 Jam)\tSudah Sertifikasi\t085712349876
Budi Santoso, S.Kom\t199503102022011005\tTenaga Kependidikan\tHonor Sekolah\tStaff TU\t0\tStaf Administrasi\tBelum\t089912344321`;

  const siswaTemplate = `Nama Siswa\tNISN\tNIPD\tRombel\tL/P\tStatus Dukcapil\tStatus PIP\tNominal PIP\tWali Kelas
Ahmad Maulana\t0089123401\t242510021\tX-1 (Fase E)\tL\tValid\tPenerima Aktif\t1800000\tSiti Nurhalizah, S.Pd
Fatimah Az-Zahra\t0089123402\t242510022\tX-1 (Fase E)\tP\tValid\tBukan Penerima\t0\tSiti Nurhalizah, S.Pd
Muhammad Ilham\t0089123403\t242510023\tXI-1 (Fase F)\tL\tValid\tNominasi\t1800000\tAhmad Fauzi, S.Pd, M.Si
Siti Rahmawati\t0089123404\t242510024\tXII-1 (Fase F)\tP\tResidu Dukcapil\tBukan Penerima\t0\tMoh. Ridwan, M.Pd`;

  const handleUseTemplate = () => {
    setInputText(isGtk ? gtkTemplate : siswaTemplate);
    parseInput(isGtk ? gtkTemplate : siswaTemplate);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInputText(content);
      parseInput(content);
    };
    reader.readAsText(file);
  };

  const parseInput = (text: string) => {
    setParseError(null);
    if (!text.trim()) {
      setParsedRows([]);
      return;
    }

    const lines = text.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length === 0) {
      setParsedRows([]);
      return;
    }

    // Determine delimiter (tab, semicolon, or comma)
    const firstLine = lines[0];
    let delimiter = '\t';
    if (firstLine.includes('\t')) delimiter = '\t';
    else if (firstLine.includes(';')) delimiter = ';';
    else if (firstLine.includes(',')) delimiter = ',';

    // Check if line 0 is a header row
    const lowerFirst = firstLine.toLowerCase();
    const hasHeader = lowerFirst.includes('nama') || lowerFirst.includes('nip') || lowerFirst.includes('nisn');
    const dataLines = hasHeader ? lines.slice(1) : lines;

    if (dataLines.length === 0) {
      setParsedRows([]);
      setParseError('Data kosong atau hanya berisi baris header.');
      return;
    }

    const rows: any[] = [];

    dataLines.forEach((line, index) => {
      const cols = line.split(delimiter).map(c => c.trim().replace(/^"|"$/g, ''));
      if (cols.length < 2) return; // Skip empty / malformed

      if (isGtk) {
        // [Nama, NIP/NUPTK, Jenis PTK, Status Kepegawaian, Mapel, JTM, Tugas Tambahan, Sertifikasi, No HP]
        const nama = cols[0] || `Guru ${index + 1}`;
        const nip = cols[1] || '-';
        const jenisPtk = cols[2] || 'Guru Mapel';
        const statusKepegawaian = (['PNS', 'GTY', 'PPPK', 'Honor Sekolah'].includes(cols[3]) ? cols[3] : 'GTY') as any;
        const mapel = cols[4] || 'Umum';
        const jtm = Number(cols[5]) || 24;
        const tugasTambahan = cols[6] || 'Tidak Ada';
        const sertifikasi = (cols[7] && cols[7].toLowerCase().includes('sudah') ? 'Sudah Sertifikasi' : 'Belum') as any;
        const hp = cols[8] || '-';

        const item: GTKItem = {
          id: `gtk-import-${Date.now()}-${index}`,
          nama,
          nipNuptk: nip,
          jenisPtk,
          statusKepegawaian,
          mapelUtama: mapel,
          kodeSertifikasi: sertifikasi === 'Sudah Sertifikasi' ? 'Bersertifikat' : '-',
          jpPerRombel: 3,
          jumlahRombel: Math.ceil(jtm / 3) || 1,
          rombelList: ['X-1'],
          jtmTatapMuka: jtm,
          jtmTugasTambahan: tugasTambahan !== 'Tidak Ada' ? 2 : 0,
          tugasTambahan,
          tugasTambahanId: 'import',
          totalJtm: jtm,
          statusInfoGtk: jtm >= 24 ? 'Valid' : 'Belum Valid',
          sertifikasi,
          telepon: hp
        };
        rows.push(item);
      } else {
        // Siswa: [Nama, NISN, NIPD, Rombel, L/P, Status Dukcapil, Status PIP, Nominal PIP, Wali Kelas]
        const nama = cols[0] || `Siswa ${index + 1}`;
        const nisn = cols[1] || `00${Math.floor(10000000 + Math.random() * 90000000)}`;
        const nipd = cols[2] || `2425${Math.floor(10000 + Math.random() * 90000)}`;
        const rombel = cols[3] || 'X-1 (Fase E)';
        const jk = (cols[4] && cols[4].toUpperCase().startsWith('P') ? 'P' : 'L') as 'L' | 'P';
        const nikStatus = (cols[5] && cols[5].toLowerCase().includes('residu') ? 'Residu Dukcapil' : 'Valid') as any;
        const pipSt = cols[6] || 'Bukan Penerima';
        const pipStatus = (pipSt.toLowerCase().includes('aktif') ? 'Penerima Aktif' : pipSt.toLowerCase().includes('nominasi') ? 'Nominasi' : 'Bukan Penerima') as any;
        const nominal = Number(cols[7]) || (pipStatus !== 'Bukan Penerima' ? 1800000 : 0);
        const wali = cols[8] || 'Wali Kelas SMA NU';

        const item: SiswaItem = {
          id: `sis-import-${Date.now()}-${index}`,
          nama,
          nisn,
          nipd,
          rombel,
          jenisKelamin: jk,
          nikStatus,
          pipStatus,
          nominalPip: nominal,
          waliKelas: wali
        };
        rows.push(item);
      }
    });

    setParsedRows(rows);
  };

  const handleExecuteImport = () => {
    if (parsedRows.length === 0) {
      setParseError('Tidak ada baris data valid yang siap diimpor.');
      return;
    }

    const replace = importMode === 'replace';
    if (isGtk) {
      onImportGtk(parsedRows as GTKItem[], replace);
    } else {
      onImportSiswa(parsedRows as SiswaItem[], replace);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div 
        className="w-full max-w-4xl bg-surface rounded-2xl border border-surface-container shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">upload_file</span>
            </div>
            <div>
              <h3 className="font-bold text-base text-primary">
                Import Banyak Data {isGtk ? 'GTK / Pendidik' : 'Peserta Didik (Siswa)'}
              </h3>
              <p className="text-xs text-on-surface-variant">
                Mendukung unggah file (.CSV / .TXT) atau Tempel Langsung (Copy-Paste) dari Excel &amp; Dapodik
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-outline"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-surface-container-low border border-surface-container">
            <div className="flex items-center gap-2">
              <label className="px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container cursor-pointer flex items-center gap-1.5 shadow-xs">
                <span className="material-symbols-outlined text-base">file_upload</span>
                <span>Pilih File CSV / TXT</span>
                <input
                  type="file"
                  accept=".csv,.tsv,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={handleUseTemplate}
                className="px-3 py-1.5 rounded-xl bg-surface text-primary border border-surface-container text-xs font-semibold hover:bg-surface-container flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">assignment</span>
                <span>Muat Format Contoh</span>
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-on-surface-variant font-medium">Metode Impor:</span>
              <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-primary">
                <input
                  type="radio"
                  name="importMode"
                  checked={importMode === 'append'}
                  onChange={() => setImportMode('append')}
                  className="text-primary focus:ring-primary/20"
                />
                <span>Tambahkan (Append)</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-rose-700">
                <input
                  type="radio"
                  name="importMode"
                  checked={importMode === 'replace'}
                  onChange={() => setImportMode('replace')}
                  className="text-rose-600 focus:ring-rose-500/20"
                />
                <span>Timpa Semua (Replace)</span>
              </label>
            </div>
          </div>

          {/* Textarea Input */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-on-surface-variant">
                Tempel (Paste) Baris Tabel dari Excel / Dapodik di Bawah Ini:
              </label>
              <span className="text-[11px] text-outline">Pemisah otomatis dideteksi (Tab / Koma / Titik Koma)</span>
            </div>
            <textarea
              rows={6}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                parseInput(e.target.value);
              }}
              placeholder={isGtk ? gtkTemplate : siswaTemplate}
              className="w-full p-3 rounded-xl bg-surface-container-lowest border border-surface-container text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 leading-relaxed"
            />
          </div>

          {parseError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              <span>{parseError}</span>
            </div>
          )}

          {/* Preview Parsed Rows */}
          {parsedRows.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-emerald-700 text-base">check_circle</span>
                  <span>Pratinjau Data Terdeteksi: <strong>{parsedRows.length} Baris Siap Diimpor</strong></span>
                </h4>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  Format Valid
                </span>
              </div>

              <div className="max-h-48 overflow-y-auto rounded-xl border border-surface-container bg-surface-container-lowest text-xs">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-surface-container-low text-primary font-bold sticky top-0 border-b border-surface-container">
                    <tr>
                      <th className="py-2 px-3">#</th>
                      <th className="py-2 px-3">Nama</th>
                      <th className="py-2 px-3">{isGtk ? 'NIP/NUPTK' : 'NISN'}</th>
                      <th className="py-2 px-3">{isGtk ? 'Mata Pelajaran' : 'Rombel'}</th>
                      <th className="py-2 px-3">{isGtk ? 'Status / JTM' : 'Status / Gender'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container/60">
                    {parsedRows.map((r, i) => (
                      <tr key={i} className="hover:bg-surface-container-low/40">
                        <td className="py-2 px-3 text-on-surface-variant font-mono">{i + 1}</td>
                        <td className="py-2 px-3 font-semibold text-primary">{r.nama}</td>
                        <td className="py-2 px-3 font-mono text-[11px]">{isGtk ? r.nipNuptk : r.nisn}</td>
                        <td className="py-2 px-3">{isGtk ? r.mapelUtama : r.rombel}</td>
                        <td className="py-2 px-3">
                          {isGtk ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              {r.totalJtm} Jam ({r.statusKepegawaian})
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">
                              {r.jenisKelamin === 'L' ? 'Laki-Laki' : 'Perempuan'} • {r.nikStatus}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-surface-container-low border-t border-surface-container flex items-center justify-between">
          <div className="text-xs text-on-surface-variant">
            {parsedRows.length > 0 ? (
              <span>Siap menyimpan <strong>{parsedRows.length} data</strong> ke penyimpanan lokal browser.</span>
            ) : (
              <span>Masukkan atau unggah data di atas untuk memulai impor.</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface-variant"
            >
              Batal
            </button>
            <button
              type="button"
              disabled={parsedRows.length === 0}
              onClick={handleExecuteImport}
              className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-base">save_alt</span>
              <span>Proses Impor ({parsedRows.length} Data)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


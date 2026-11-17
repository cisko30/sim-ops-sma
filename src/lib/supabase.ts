/**
 * Supabase Client & Synchronization Engine for SIM-OPS SMA
 * Mendukung akses langsung ke Supabase PostgreSQL via PostgREST API & Realtime
 * SMA NU Kaplongan - Standar Kurikulum Merdeka & Permendikdasmen No. 11/2025
 */

import { SchoolInfo } from '../types';
import { GTKItem, SiswaItem, RombelItem, MapelItem } from '../data/modulesData';
import { DailyJournal } from '../types/journal';
import { ActivityLog } from '../types';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
}

export interface SupabaseSyncPayload {
  gtkList: GTKItem[];
  siswaList: SiswaItem[];
  rombelList: RombelItem[];
  mapelList: MapelItem[];
  journals: DailyJournal[];
  activities: ActivityLog[];
  schoolInfo: SchoolInfo;
  isCleared: boolean;
  version: string;
  updatedAt: string;
}

const STORAGE_KEY_URL = 'simops_supabase_url';
const STORAGE_KEY_ANON = 'simops_supabase_anon_key';

/**
 * Mendapatkan konfigurasi Supabase aktif (dari env Vite atau LocalStorage)
 */
export function getSupabaseConfig(): SupabaseConfig {
  let url = '';
  let anonKey = '';

  // 1. Cek dari LocalStorage override terlebih dahulu (agar bisa disetel via UI)
  if (typeof window !== 'undefined') {
    url = (localStorage.getItem(STORAGE_KEY_URL) || '').trim();
    anonKey = (localStorage.getItem(STORAGE_KEY_ANON) || '').trim();
  }

  // 2. Fallback ke Vite Environment Variables jika belum diisi di LocalStorage
  const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined;
  if (!url && metaEnv?.VITE_SUPABASE_URL) {
    url = String(metaEnv.VITE_SUPABASE_URL).trim();
  }
  if (!anonKey && metaEnv?.VITE_SUPABASE_ANON_KEY) {
    anonKey = String(metaEnv.VITE_SUPABASE_ANON_KEY).trim();
  }

  // Bersihkan trailing slash pada URL jika ada
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }

  return {
    url,
    anonKey,
    isConfigured: Boolean(url && anonKey && url.startsWith('http'))
  };
}

/**
 * Menyimpan konfigurasi Supabase ke LocalStorage
 */
export function saveSupabaseConfig(url: string, anonKey: string): void {
  if (typeof window === 'undefined') return;
  const cleanUrl = url.trim().replace(/\/+$/, '');
  const cleanKey = anonKey.trim();

  if (cleanUrl) {
    localStorage.setItem(STORAGE_KEY_URL, cleanUrl);
  } else {
    localStorage.removeItem(STORAGE_KEY_URL);
  }

  if (cleanKey) {
    localStorage.setItem(STORAGE_KEY_ANON, cleanKey);
  } else {
    localStorage.removeItem(STORAGE_KEY_ANON);
  }
}

/**
 * Helper Header otentikasi PostgREST Supabase
 */
function getHeaders(anonKey: string, prefer = ''): HeadersInit {
  const headers: Record<string, string> = {
    'apikey': anonKey,
    'Authorization': `Bearer ${anonKey}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  if (prefer) {
    headers['Prefer'] = prefer;
  }
  return headers;
}

/**
 * Menguji konektivitas ke Supabase PostgreSQL
 */
export async function testSupabaseConnection(customUrl?: string, customKey?: string): Promise<{
  success: boolean;
  message: string;
  serverVersion?: string;
}> {
  const cfg = getSupabaseConfig();
  const targetUrl = (customUrl || cfg.url).replace(/\/+$/, '');
  const targetKey = customKey || cfg.anonKey;

  if (!targetUrl || !targetKey) {
    return {
      success: false,
      message: 'URL atau Anon Key Supabase belum diisi lengkap.'
    };
  }

  try {
    // 1. Uji endpoint PostgREST schema info atau tabel simops_sync_state / sekolah
    const endpoint = `${targetUrl}/rest/v1/sekolah?select=id,nama_sekolah&limit=1`;
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: getHeaders(targetKey),
      cache: 'no-store'
    });

    if (res.ok) {
      const data = await res.json();
      const schoolName = Array.isArray(data) && data.length > 0 ? data[0].nama_sekolah : 'SMA NU Kaplongan';
      return {
        success: true,
        message: `Koneksi Berhasil! Terhubung ke database Supabase Cloud (${schoolName}).`,
        serverVersion: 'PostgreSQL 15+ (PostgREST)'
      };
    }

    if (res.status === 401 || res.status === 403) {
      return {
        success: false,
        message: 'Akses Ditolak (401/403): Anon Key salah atau tidak memiliki izin akses.'
      };
    }

    if (res.status === 404 || res.status === 400) {
      // Coba periksa tabel simops_sync_state jika tabel sekolah belum dibuat
      const testFallback = await fetch(`${targetUrl}/rest/v1/simops_sync_state?select=id&limit=1`, {
        method: 'GET',
        headers: getHeaders(targetKey),
        cache: 'no-store'
      });
      if (testFallback.ok) {
        return {
          success: true,
          message: 'Koneksi Berhasil! Tabel simops_sync_state siap digunakan.'
        };
      }

      return {
        success: false,
        message: 'Database terhubung tetapi tabel belum dibuat. Harap jalankan skrip supabase_schema.sql di Supabase SQL Editor!'
      };
    }

    return {
      success: false,
      message: `Gagal tersambung (Status ${res.status}): ${res.statusText}`
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Gagal menghubungi server Supabase: ${err.message || 'Periksa jaringan internet / URL'}`
    };
  }
}

/**
 * Mengambil seluruh data terkini dari Supabase
 */
export async function fetchFullStateFromSupabase(): Promise<{
  exists: boolean;
  data?: SupabaseSyncPayload;
  error?: string;
}> {
  const cfg = getSupabaseConfig();
  if (!cfg.isConfigured) {
    return { exists: false, error: 'Supabase belum dikonfigurasi.' };
  }

  try {
    // 1. Coba ambil dari simops_sync_state (atomic unified snapshot)
    const syncRes = await fetch(`${cfg.url}/rest/v1/simops_sync_state?id=eq.main_database&select=*`, {
      method: 'GET',
      headers: getHeaders(cfg.anonKey),
      cache: 'no-store'
    });

    if (syncRes.ok) {
      const records = await syncRes.json();
      if (Array.isArray(records) && records.length > 0 && records[0].payload) {
        return {
          exists: true,
          data: records[0].payload as SupabaseSyncPayload
        };
      }
    }

    // 2. Fallback: jika snapshot belum ada, ambil dari tabel granular (sekolah, gtk, siswa, dll)
    const [_sekolahRes, gtkRes, siswaRes, rombelRes, mapelRes, jurnalRes, timelineRes] = await Promise.allSettled([
      fetch(`${cfg.url}/rest/v1/sekolah?limit=1`, { headers: getHeaders(cfg.anonKey) }).then(r => r.json()),
      fetch(`${cfg.url}/rest/v1/gtk?select=*`, { headers: getHeaders(cfg.anonKey) }).then(r => r.json()),
      fetch(`${cfg.url}/rest/v1/siswa?select=*`, { headers: getHeaders(cfg.anonKey) }).then(r => r.json()),
      fetch(`${cfg.url}/rest/v1/rombel?select=*`, { headers: getHeaders(cfg.anonKey) }).then(r => r.json()),
      fetch(`${cfg.url}/rest/v1/mapel?select=*`, { headers: getHeaders(cfg.anonKey) }).then(r => r.json()),
      fetch(`${cfg.url}/rest/v1/jurnal_harian?select=*&order=journal_date.desc`, { headers: getHeaders(cfg.anonKey) }).then(r => r.json()),
      fetch(`${cfg.url}/rest/v1/aktivitas_timeline?select=*`, { headers: getHeaders(cfg.anonKey) }).then(r => r.json()),
    ]);

    const hasGranularData = gtkRes.status === 'fulfilled' && Array.isArray(gtkRes.value) && gtkRes.value.length > 0;
    if (hasGranularData) {
      const gtkRaw = gtkRes.status === 'fulfilled' ? gtkRes.value : [];
      const siswaRaw = siswaRes.status === 'fulfilled' ? siswaRes.value : [];
      const rombelRaw = rombelRes.status === 'fulfilled' ? rombelRes.value : [];
      const mapelRaw = mapelRes.status === 'fulfilled' ? mapelRes.value : [];
      const jurnalRaw = jurnalRes.status === 'fulfilled' ? jurnalRes.value : [];
      const timelineRaw = timelineRes.status === 'fulfilled' ? timelineRes.value : [];

      // Konversi format database snake_case ke camelCase model aplikasi
      const mappedGtk: GTKItem[] = gtkRaw.map((g: any) => ({
        id: g.id,
        nama: g.nama,
        nipNuptk: g.nip_nuptk || '',
        jenisPtk: g.jenis_ptk || 'Guru Mapel',
        statusKepegawaian: g.status_kepegawaian || 'GTY',
        mapelUtama: g.mapel_utama || '',
        kodeSertifikasi: g.kode_sertifikasi || '',
        jpPerRombel: Number(g.jp_per_rombel) || 0,
        jumlahRombel: Number(g.jumlah_rombel) || 0,
        rombelList: Array.isArray(g.rombel_list) ? g.rombel_list : [],
        jtmTatapMuka: Number(g.jtm_tatap_muka) || 0,
        jtmTugasTambahan: Number(g.jtm_tugas_tambahan) || 0,
        tugasTambahan: g.tugas_tambahan || '',
        tugasTambahanId: g.tugas_tambahan_id || 'none',
        totalJtm: Number(g.total_jtm) || 0,
        statusInfoGtk: g.status_info_gtk || 'Valid',
        sertifikasi: g.sertifikasi || 'Belum',
        telepon: g.telepon || ''
      }));

      const mappedSiswa: SiswaItem[] = siswaRaw.map((s: any) => ({
        id: s.id,
        nisn: s.nisn,
        nipd: s.nipd || '',
        nama: s.nama,
        rombel: s.rombel,
        jenisKelamin: s.jenis_kelamin || 'L',
        nikStatus: s.nik_status || 'Valid',
        pipStatus: s.pip_status || 'Bukan Penerima',
        nominalPip: Number(s.nominal_pip) || 0,
        waliKelas: s.wali_kelas || ''
      }));

      const mappedRombel: RombelItem[] = rombelRaw.map((r: any) => ({
        id: r.id,
        namaRombel: r.nama_rombel,
        tingkat: r.tingkat,
        kurikulum: r.kurikulum,
        waliKelas: r.wali_kelas || '',
        jumlahSiswaL: Number(r.jumlah_siswa_l) || 0,
        jumlahSiswaP: Number(r.jumlah_siswa_p) || 0,
        totalSiswa: Number(r.total_siswa) || 0,
        ruang: r.ruang || ''
      }));

      const mappedMapel: MapelItem[] = mapelRaw.map((m: any) => ({
        id: m.id,
        kodeMapel: m.kode_mapel,
        namaMapel: m.nama_mapel,
        kategori: m.kategori,
        fase: m.fase,
        alokasiJp: Number(m.alokasi_jp) || 0,
        guruPengampu: m.guru_pengampu || ''
      }));

      const mappedJournals: DailyJournal[] = jurnalRaw.map((j: any) => ({
        id: j.id,
        school_id: j.school_id || 1,
        user_id: j.user_id || 1,
        user_name: j.user_name || 'Bagas Pratama, S.Kom',
        user_role: j.user_role || 'Koordinator Operator Sekolah (OPS)',
        journal_date: j.journal_date,
        unit_name: j.unit_name || 'Unit Tata Usaha & Operasional Sekolah',
        daily_summary: j.daily_summary || '',
        total_duration_minutes: Number(j.total_duration_minutes) || 0,
        status: j.status || 'Submitted',
        submitted_at: j.submitted_at,
        reviewer_id: j.reviewer_id,
        reviewer_name: j.reviewer_name,
        reviewed_at: j.reviewed_at,
        review_notes: j.review_notes,
        activities: Array.isArray(j.activities) ? j.activities : []
      }));

      const mappedTimeline: ActivityLog[] = timelineRaw.map((t: any) => ({
        id: t.id,
        title: t.title,
        time: t.time,
        description: t.description,
        dotColor: t.dot_color || 'bg-primary'
      }));

      return {
        exists: true,
        data: {
          gtkList: mappedGtk,
          siswaList: mappedSiswa,
          rombelList: mappedRombel,
          mapelList: mappedMapel,
          journals: mappedJournals,
          activities: mappedTimeline,
          schoolInfo: undefined as any,
          isCleared: false,
          version: '2.5.0',
          updatedAt: new Date().toISOString()
        }
      };
    }

    return { exists: false };
  } catch (err: any) {
    return { exists: false, error: err.message };
  }
}

/**
 * Menyimpan seluruh data aplikasi ke Supabase (baik ke simops_sync_state maupun tabel relasional)
 */
export async function pushFullStateToSupabase(payload: SupabaseSyncPayload): Promise<{
  success: boolean;
  error?: string;
  savedAt?: string;
}> {
  const cfg = getSupabaseConfig();
  if (!cfg.isConfigured) {
    return { success: false, error: 'Supabase belum dikonfigurasi.' };
  }

  try {
    const timestamp = payload.updatedAt || new Date().toISOString();

    // 1. Simpan Snapshot Atomik ke simops_sync_state
    const syncRes = await fetch(`${cfg.url}/rest/v1/simops_sync_state`, {
      method: 'POST',
      headers: getHeaders(cfg.anonKey, 'resolution=merge-duplicates'),
      body: JSON.stringify({
        id: 'main_database',
        payload,
        is_cleared: Boolean(payload.isCleared),
        version: payload.version || '2.5.0',
        updated_at: timestamp
      })
    });

    if (!syncRes.ok) {
      const errText = await syncRes.text();
      throw new Error(`Gagal menyimpan snapshot ke Supabase (${syncRes.status}): ${errText}`);
    }

    // 2. Simpan juga ke tabel relasional granular di background secara asinkron
    pushRelationalTables(cfg, payload).catch((err) => {
      console.warn('Latar belakang sinkronisasi tabel relasional Supabase:', err);
    });

    return {
      success: true,
      savedAt: timestamp
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message
    };
  }
}

/**
 * Helper internal untuk melakukan sinkronisasi ke tabel relasional Supabase
 */
async function pushRelationalTables(cfg: SupabaseConfig, payload: SupabaseSyncPayload) {
  if (payload.isCleared) {
    // Jika diperintahkan kosongkan database: hapus isi tabel
    await Promise.allSettled([
      fetch(`${cfg.url}/rest/v1/siswa?id=neq.empty`, { method: 'DELETE', headers: getHeaders(cfg.anonKey) }),
      fetch(`${cfg.url}/rest/v1/gtk?id=neq.empty`, { method: 'DELETE', headers: getHeaders(cfg.anonKey) }),
      fetch(`${cfg.url}/rest/v1/jurnal_harian?id=neq.empty`, { method: 'DELETE', headers: getHeaders(cfg.anonKey) }),
      fetch(`${cfg.url}/rest/v1/aktivitas_timeline?id=neq.empty`, { method: 'DELETE', headers: getHeaders(cfg.anonKey) })
    ]);
    return;
  }

  // A. Upsert GTK
  if (Array.isArray(payload.gtkList) && payload.gtkList.length > 0) {
    const gtkRows = payload.gtkList.map(g => ({
      id: g.id,
      nama: g.nama,
      nip_nuptk: g.nipNuptk,
      jenis_ptk: g.jenisPtk,
      status_kepegawaian: g.statusKepegawaian,
      mapel_utama: g.mapelUtama,
      kode_sertifikasi: g.kodeSertifikasi || null,
      jp_per_rombel: g.jpPerRombel,
      jumlah_rombel: g.jumlahRombel,
      rombel_list: g.rombelList,
      jtm_tatap_muka: g.jtmTatapMuka,
      jtm_tugas_tambahan: g.jtmTugasTambahan,
      tugas_tambahan: g.tugasTambahan || 'Tidak Ada (0 Jam)',
      tugas_tambahan_id: g.tugasTambahanId || 'none',
      total_jtm: g.totalJtm,
      status_info_gtk: g.statusInfoGtk,
      sertifikasi: g.sertifikasi,
      telepon: g.telepon
    }));

    await fetch(`${cfg.url}/rest/v1/gtk`, {
      method: 'POST',
      headers: getHeaders(cfg.anonKey, 'resolution=merge-duplicates'),
      body: JSON.stringify(gtkRows)
    });
  }

  // B. Upsert Siswa
  if (Array.isArray(payload.siswaList) && payload.siswaList.length > 0) {
    const siswaRows = payload.siswaList.map(s => ({
      id: s.id,
      nisn: s.nisn,
      nipd: s.nipd,
      nama: s.nama,
      rombel: s.rombel,
      jenis_kelamin: s.jenisKelamin,
      nik_status: s.nikStatus,
      pip_status: s.pipStatus,
      nominal_pip: s.nominalPip || 0,
      wali_kelas: s.waliKelas
    }));

    await fetch(`${cfg.url}/rest/v1/siswa`, {
      method: 'POST',
      headers: getHeaders(cfg.anonKey, 'resolution=merge-duplicates'),
      body: JSON.stringify(siswaRows)
    });
  }

  // C. Upsert Rombel
  if (Array.isArray(payload.rombelList) && payload.rombelList.length > 0) {
    const rombelRows = payload.rombelList.map(r => ({
      id: r.id,
      nama_rombel: r.namaRombel,
      tingkat: r.tingkat,
      kurikulum: r.kurikulum,
      wali_kelas: r.waliKelas,
      jumlah_siswa_l: r.jumlahSiswaL,
      jumlah_siswa_p: r.jumlahSiswaP,
      total_siswa: r.totalSiswa,
      ruang: r.ruang
    }));

    await fetch(`${cfg.url}/rest/v1/rombel`, {
      method: 'POST',
      headers: getHeaders(cfg.anonKey, 'resolution=merge-duplicates'),
      body: JSON.stringify(rombelRows)
    });
  }

  // D. Upsert Jurnal Harian
  if (Array.isArray(payload.journals) && payload.journals.length > 0) {
    const journalRows = payload.journals.map(j => ({
      id: j.id,
      school_id: j.school_id,
      user_id: j.user_id,
      user_name: j.user_name,
      user_role: j.user_role,
      journal_date: j.journal_date,
      unit_name: j.unit_name,
      daily_summary: j.daily_summary,
      total_duration_minutes: j.total_duration_minutes,
      status: j.status,
      submitted_at: j.submitted_at || null,
      reviewer_id: j.reviewer_id || null,
      reviewer_name: j.reviewer_name || null,
      reviewed_at: j.reviewed_at || null,
      review_notes: j.review_notes || null,
      activities: j.activities || []
    }));

    await fetch(`${cfg.url}/rest/v1/jurnal_harian`, {
      method: 'POST',
      headers: getHeaders(cfg.anonKey, 'resolution=merge-duplicates'),
      body: JSON.stringify(journalRows)
    });
  }

  // E. Upsert Profil Sekolah
  if (payload.schoolInfo) {
    const s = payload.schoolInfo;
    await fetch(`${cfg.url}/rest/v1/sekolah`, {
      method: 'POST',
      headers: getHeaders(cfg.anonKey, 'resolution=merge-duplicates'),
      body: JSON.stringify([{
        id: 'smanu-kaplongan',
        npsn: s.npsn || '20216007',
        nama_sekolah: s.schoolName || 'SMA NU Kaplongan',
        institusi: s.institution,
        akreditasi: s.accreditation || 'A',
        alamat: s.address,
        kecamatan: s.subdistrict,
        telepon: s.phone,
        email: s.email,
        website: s.website,
        tahun_ajaran: s.academicYear,
        dapodik_status: s.dapodikStatus,
        nama_kepsek: s.principalName,
        nip_kepsek: s.principalNip,
        nama_operator: s.operatorName,
        nip_operator: s.operatorNip,
        peran_operator: s.operatorRole,
        unit_operator: s.operatorUnit,
        logo_url: s.logoUrl || '/logo-sma-nu.png?v=3'
      }])
    });
  }
}

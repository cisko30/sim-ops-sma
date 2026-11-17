import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { CountdownBanner } from './components/dashboard/CountdownBanner';
import { MetricCardsGrid } from './components/dashboard/MetricCardsGrid';
import { StudentDistributionCard } from './components/dashboard/StudentDistributionCard';
import { JTMStatusCard } from './components/dashboard/JTMStatusCard';
import { PIPPipelineCard } from './components/dashboard/PIPPipelineCard';
import { DeadlineListCard } from './components/dashboard/DeadlineListCard';
import { ActivityTimelineCard } from './components/dashboard/ActivityTimelineCard';
import { QuickActionsCard } from './components/dashboard/QuickActionsCard';
import { SCHOOL_INFO, ACTIVITIES } from './data/mockData';
import { INITIAL_JOURNALS } from './data/mockJournals';
import { MOCK_GTK_LIST, MOCK_SISWA_LIST, MOCK_ROMBEL_LIST, DEFAULT_MAPEL_LIST, GTKItem, SiswaItem, RombelItem, MapelItem } from './data/modulesData';
import { DailyJournal } from './types/journal';
import { SchoolInfo, ActivityLog } from './types';
import {
  getSupabaseConfig,
  fetchFullStateFromSupabase,
  pushFullStateToSupabase
} from './lib/supabase';

// Modals imported directly for instant, zero-delay opening
import { JurnalModal } from './components/modals/JurnalModal';
import { SyncModal } from './components/modals/SyncModal';
import { ResiduModal } from './components/modals/ResiduModal';

// Jurnal Harian OPS Views
import { JournalHistoryView } from './components/jurnal/JournalHistoryView';
import { JournalDashboardView } from './components/jurnal/JournalDashboardView';
import { JournalCalendarView } from './components/jurnal/JournalCalendarView';
import { JournalReportReviewView } from './components/jurnal/JournalReportReviewView';
import { JournalAutoGeneratorView } from './components/jurnal/JournalAutoGeneratorView';
import { SchoolProfileView } from './components/profile/SchoolProfileView';

// Core Operational Modules imported directly for instant 0ms tab switching
import { MasterDataView } from './components/modules/MasterDataView';
import { KurikulumView } from './components/modules/KurikulumView';
import { DapodikView } from './components/modules/DapodikView';
import { PipManagementView } from './components/modules/PipManagementView';
import { ArsipGeneratorView } from './components/modules/ArsipGeneratorView';
import { LaporanJadwalView } from './components/modules/LaporanJadwalView';
import { AktivitasTerbaruView } from './components/modules/AktivitasTerbaruView';
import { OperatorSkillsView } from './components/modules/OperatorSkillsView';

export const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash) return hash;
    }
    return 'ringkasan-sekolah';
  });
  const [selectedJournalDate, setSelectedJournalDate] = useState<string>('2026-11-12');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.hash = `/${currentPath}`;
    }
  }, [currentPath]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash) {
        setCurrentPath(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Check if database was explicitly cleared by user
  const isDBCleared = () => {
    try {
      return localStorage.getItem('simops_db_cleared') === 'true';
    } catch {
      return false;
    }
  };

  // Persistent Journals State
  const [journals, setJournals] = useState<DailyJournal[]>(() => {
    try {
      if (isDBCleared()) return [];
      const cached = localStorage.getItem('simops_journals');
      if (cached) return JSON.parse(cached);
    } catch (e) {
      console.error("Failed to load cached journals", e);
    }
    return INITIAL_JOURNALS;
  });

  const handleUpdateJournals = (updater: React.SetStateAction<DailyJournal[]>) => {
    setJournals((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try {
        localStorage.setItem('simops_journals', JSON.stringify(next));
      } catch (e) {
        console.error("Failed to cache journals", e);
      }
      return next;
    });
  };

  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>(() => {
    try {
      const cached = localStorage.getItem('simops_school_info');
      if (cached) return JSON.parse(cached);
    } catch (e) {
      console.error("Failed to load cached school info", e);
    }
    return SCHOOL_INFO;
  });

  const handleUpdateSchoolInfo = (updated: SchoolInfo) => {
    setSchoolInfo(updated);
    try {
      localStorage.setItem('simops_school_info', JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to cache school info", e);
    }
  };

  // Master Data Persistent State
  const [gtkList, setGtkList] = useState<GTKItem[]>(() => {
    try {
      if (isDBCleared()) return [];
      const saved = localStorage.getItem('sim_ops_master_gtk');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return MOCK_GTK_LIST;
  });

  useEffect(() => {
    try {
      localStorage.setItem('sim_ops_master_gtk', JSON.stringify(gtkList));
    } catch (e) {
      console.error(e);
    }
  }, [gtkList]);

  const [siswaList, setSiswaList] = useState<SiswaItem[]>(() => {
    try {
      if (isDBCleared()) return [];
      const saved = localStorage.getItem('sim_ops_master_siswa');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return MOCK_SISWA_LIST;
  });

  useEffect(() => {
    try {
      localStorage.setItem('sim_ops_master_siswa', JSON.stringify(siswaList));
    } catch (e) {
      console.error(e);
    }
  }, [siswaList]);

  const [rombelList, setRombelList] = useState<RombelItem[]>(() => {
    try {
      if (isDBCleared()) return [];
      const saved = localStorage.getItem('sim_ops_master_rombel');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return MOCK_ROMBEL_LIST;
  });

  useEffect(() => {
    try {
      localStorage.setItem('sim_ops_master_rombel', JSON.stringify(rombelList));
    } catch (e) {
      console.error(e);
    }
  }, [rombelList]);

  const [mapelList, setMapelList] = useState<MapelItem[]>(() => {
    try {
      if (isDBCleared()) return [];
      const saved = localStorage.getItem('sim_ops_master_mapel');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_MAPEL_LIST;
  });

  useEffect(() => {
    try {
      localStorage.setItem('sim_ops_master_mapel', JSON.stringify(mapelList));
    } catch (e) {
      console.error(e);
    }
  }, [mapelList]);

  const [activities, setActivities] = useState<ActivityLog[]>(() => {
    try {
      if (isDBCleared()) return [];
      const saved = localStorage.getItem('simops_activities');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return ACTIVITIES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('simops_activities', JSON.stringify(activities));
    } catch (e) {
      console.error(e);
    }
  }, [activities]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<'OPS' | 'Kurikulum' | 'Kepsek'>('OPS');
  
  // Cloud Sync state (Supabase PostgreSQL Cloud + Cloudflare Pages KV Fallback)
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);
  const [cloudSyncedAt, setCloudSyncedAt] = useState<string | null>(null);
  const [syncEngine, setSyncEngine] = useState<'supabase' | 'kv' | 'local'>('local');
  const isApplyingCloudUpdateRef = useRef<boolean>(false);
  const lastCloudTimestampRef = useRef<string>('');
  const isInitialLoadDoneRef = useRef<boolean>(false);
  const syncDebounceTimerRef = useRef<any>(null);

  // Helper function to apply cloud data to local state
  const applyCloudData = (cloudData: any) => {
    if (cloudData.isCleared) {
      localStorage.setItem('simops_db_cleared', 'true');
      setGtkList([]);
      setSiswaList([]);
      setRombelList([]);
      setMapelList([]);
      setJournals([]);
      setActivities([]);
      localStorage.setItem('sim_ops_master_gtk', '[]');
      localStorage.setItem('sim_ops_master_siswa', '[]');
      localStorage.setItem('sim_ops_master_rombel', '[]');
      localStorage.setItem('sim_ops_master_mapel', '[]');
      localStorage.setItem('simops_journals', '[]');
      localStorage.setItem('simops_activities', '[]');
    } else {
      localStorage.removeItem('simops_db_cleared');
      if (Array.isArray(cloudData.gtkList)) {
        setGtkList(cloudData.gtkList);
        localStorage.setItem('sim_ops_master_gtk', JSON.stringify(cloudData.gtkList));
      }
      if (Array.isArray(cloudData.siswaList)) {
        setSiswaList(cloudData.siswaList);
        localStorage.setItem('sim_ops_master_siswa', JSON.stringify(cloudData.siswaList));
      }
      if (Array.isArray(cloudData.rombelList)) {
        setRombelList(cloudData.rombelList);
        localStorage.setItem('sim_ops_master_rombel', JSON.stringify(cloudData.rombelList));
      }
      if (Array.isArray(cloudData.mapelList)) {
        setMapelList(cloudData.mapelList);
        localStorage.setItem('sim_ops_master_mapel', JSON.stringify(cloudData.mapelList));
      }
      if (Array.isArray(cloudData.journals)) {
        setJournals(cloudData.journals);
        localStorage.setItem('simops_journals', JSON.stringify(cloudData.journals));
      }
      if (Array.isArray(cloudData.activities)) {
        setActivities(cloudData.activities);
        localStorage.setItem('simops_activities', JSON.stringify(cloudData.activities));
      }
      if (cloudData.schoolInfo) {
        setSchoolInfo(cloudData.schoolInfo);
        localStorage.setItem('simops_school_info', JSON.stringify(cloudData.schoolInfo));
      }
    }
  };

  // Core function to pull latest state from Supabase / Cloudflare KV
  const syncFromCloud = async (manual = false) => {
    try {
      setIsCloudSyncing(true);
      const sbConfig = getSupabaseConfig();

      // 1. Prioritaskan Supabase jika telah dikonfigurasi
      if (sbConfig.isConfigured) {
        try {
          const sbRes = await fetchFullStateFromSupabase();
          if (sbRes.exists && sbRes.data) {
            const cloudData = sbRes.data;
            const cloudTime = cloudData.updatedAt || '';
            if (manual || !isInitialLoadDoneRef.current || cloudTime !== lastCloudTimestampRef.current) {
              isApplyingCloudUpdateRef.current = true;
              applyCloudData(cloudData);
              lastCloudTimestampRef.current = cloudTime;
              const now = new Date();
              const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
              setCloudSyncedAt(timeStr);
              setSyncEngine('supabase');
              setTimeout(() => { isApplyingCloudUpdateRef.current = false; }, 400);
              if (manual) showToast("Sinkronisasi Supabase Cloud PostgreSQL berhasil! Data terpadu.");
              return;
            }
          } else if (!sbRes.exists && !sbRes.error) {
            // Jika database Supabase masih baru/kosong, inisialisasi dengan data master lokal
            const baselinePayload = {
              gtkList,
              siswaList,
              rombelList,
              mapelList,
              journals,
              activities,
              schoolInfo,
              isCleared: gtkList.length === 0 && siswaList.length === 0,
              updatedAt: new Date().toISOString(),
              version: '2.5.0'
            };
            await pushFullStateToSupabase(baselinePayload);
            setSyncEngine('supabase');
            const now = new Date();
            const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            setCloudSyncedAt(timeStr);
            lastCloudTimestampRef.current = baselinePayload.updatedAt;
            if (manual) showToast("Database Supabase berhasil diinisialisasi & disinkronkan!");
            return;
          }
        } catch (sbErr) {
          console.warn("Supabase fetch failed, fallback ke KV:", sbErr);
        }
      }

      // 2. Fallback ke Cloudflare Pages Functions (/api/database)
      const res = await fetch(`/api/database?t=${Date.now()}`, {
        cache: 'no-store'
      });
      if (res.ok) {
        const jsonResponse = await res.json();
        const cloudData = (jsonResponse && jsonResponse.data) ? jsonResponse.data : jsonResponse;

        if (jsonResponse.source === 'supabase') {
          setSyncEngine('supabase');
        } else {
          setSyncEngine('kv');
        }

        // If cloud is empty or missing data (first run), seed it with current complete data
        if (!cloudData || cloudData.exists === false || !cloudData.version || !cloudData.siswaList) {
          const baselinePayload = {
            gtkList,
            siswaList,
            rombelList,
            mapelList,
            journals,
            activities,
            schoolInfo,
            isCleared: gtkList.length === 0 && siswaList.length === 0,
            updatedAt: new Date().toISOString(),
            version: '2.5.0'
          };
          await fetch('/api/database', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(baselinePayload)
          });
          const now = new Date();
          const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
          setCloudSyncedAt(timeStr);
          lastCloudTimestampRef.current = baselinePayload.updatedAt;
          if (manual) showToast("Database awan berhasil diinisialisasi & disinkronkan!");
          return;
        }

        // Check if cloud data is newer or if this is manual refresh / initial load
        const cloudTime = cloudData.updatedAt || '';
        if (manual || !isInitialLoadDoneRef.current || cloudTime !== lastCloudTimestampRef.current) {
          isApplyingCloudUpdateRef.current = true;
          applyCloudData(cloudData);

          lastCloudTimestampRef.current = cloudTime;
          const now = new Date();
          const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
          setCloudSyncedAt(timeStr);

          setTimeout(() => {
            isApplyingCloudUpdateRef.current = false;
          }, 400);

          if (manual) {
            showToast("Sinkronisasi berhasil! Seluruh data telah terpadu dengan semua perangkat.");
          }
        }
      }
    } catch (err) {
      console.warn("Sync from cloud failed:", err);
      if (manual) showToast("Gagal menyinkronkan dengan server awan. Periksa jaringan internet.");
    } finally {
      setIsCloudSyncing(false);
      isInitialLoadDoneRef.current = true;
    }
  };

  // 1. Initial Load, Tab Focus Re-Sync & 10s Background Auto-Polling
  useEffect(() => {
    syncFromCloud(false);

    // Auto-sync when user returns to this browser tab (from another tab or app)
    const handleFocus = () => syncFromCloud(false);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') syncFromCloud(false);
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    // Multi-device polling every 10 seconds
    const intervalTimer = setInterval(() => {
      syncFromCloud(false);
    }, 10000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(intervalTimer);
    };
  }, []);

  // 2. Debounced auto-save to Supabase & Cloudflare KV when user modifies state locally
  useEffect(() => {
    if (!isInitialLoadDoneRef.current || isApplyingCloudUpdateRef.current) return;

    if (syncDebounceTimerRef.current) {
      clearTimeout(syncDebounceTimerRef.current);
    }

    syncDebounceTimerRef.current = setTimeout(async () => {
      try {
        setIsCloudSyncing(true);
        const newTimestamp = new Date().toISOString();
        const payload = {
          gtkList,
          siswaList,
          rombelList,
          mapelList,
          journals,
          activities,
          schoolInfo,
          isCleared: localStorage.getItem('simops_db_cleared') === 'true',
          updatedAt: newTimestamp,
          version: '2.5.0'
        };

        // A. Simpan ke Supabase jika aktif
        if (getSupabaseConfig().isConfigured) {
          try {
            const sbSaveRes = await pushFullStateToSupabase(payload);
            if (sbSaveRes.success) {
              setSyncEngine('supabase');
            }
          } catch (sbErr) {
            console.warn('Supabase auto-save error:', sbErr);
          }
        }

        // B. Simpan ke KV / backend /api/database
        const res = await fetch('/api/database', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          lastCloudTimestampRef.current = newTimestamp;
          const now = new Date();
          setCloudSyncedAt(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
        }
      } catch (err) {
        console.warn('Cloud sync post failed:', err);
      } finally {
        setIsCloudSyncing(false);
      }
    }, 800);

    return () => {
      if (syncDebounceTimerRef.current) {
        clearTimeout(syncDebounceTimerRef.current);
      }
    };
  }, [gtkList, siswaList, rombelList, mapelList, journals, activities, schoolInfo]);

  // Modals state
  const [jurnalModalOpen, setJurnalModalOpen] = useState(false);
  const [syncModalOpen, setSyncModalOpen] = useState(false);
  const [residuModalOpen, setResiduModalOpen] = useState(false);
  
  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handlePrintSPTJM = () => {
    setCurrentPath('surat-dan-kuasa-kolektif');
    showToast("Membuka dokumen SPTJM & Surat Kuasa Kolektif Bank BNI untuk dicetak...");
  };

  // Database control functions
  const handleClearAllDatabase = async () => {
    localStorage.setItem('simops_db_cleared', 'true');
    setGtkList([]);
    setSiswaList([]);
    setRombelList([]);
    setMapelList([]);
    setJournals([]);
    setActivities([]);
    localStorage.setItem('sim_ops_master_gtk', '[]');
    localStorage.setItem('sim_ops_master_siswa', '[]');
    localStorage.setItem('sim_ops_master_rombel', '[]');
    localStorage.setItem('sim_ops_master_mapel', '[]');
    localStorage.setItem('simops_journals', '[]');
    localStorage.setItem('simops_activities', '[]');

    try {
      setIsCloudSyncing(true);
      const newTimestamp = new Date().toISOString();
      const clearPayload = {
        gtkList: [],
        siswaList: [],
        rombelList: [],
        mapelList: [],
        journals: [],
        activities: [],
        schoolInfo,
        isCleared: true,
        updatedAt: newTimestamp,
        version: '2.5.0'
      };

      // Push ke Supabase jika aktif
      if (getSupabaseConfig().isConfigured) {
        pushFullStateToSupabase(clearPayload).catch(e => console.warn("Supabase clear failed", e));
      }

      await fetch('/api/database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clearPayload)
      });
      lastCloudTimestampRef.current = newTimestamp;
      const now = new Date();
      setCloudSyncedAt(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
    } catch (e) {
      console.warn("Clear cloud sync failed", e);
    } finally {
      setIsCloudSyncing(false);
    }

    showToast("Seluruh database telah berhasil dihapus dan dikosongkan. Tersinkron ke seluruh perangkat!");
  };

  const handleResetFactoryDatabase = async () => {
    localStorage.removeItem('simops_db_cleared');
    setGtkList(MOCK_GTK_LIST);
    setSiswaList(MOCK_SISWA_LIST);
    setRombelList(MOCK_ROMBEL_LIST);
    setMapelList(DEFAULT_MAPEL_LIST);
    setJournals(INITIAL_JOURNALS);
    setActivities(ACTIVITIES);
    localStorage.setItem('sim_ops_master_gtk', JSON.stringify(MOCK_GTK_LIST));
    localStorage.setItem('sim_ops_master_siswa', JSON.stringify(MOCK_SISWA_LIST));
    localStorage.setItem('sim_ops_master_rombel', JSON.stringify(MOCK_ROMBEL_LIST));
    localStorage.setItem('sim_ops_master_mapel', JSON.stringify(DEFAULT_MAPEL_LIST));
    localStorage.setItem('simops_journals', JSON.stringify(INITIAL_JOURNALS));
    localStorage.setItem('simops_activities', JSON.stringify(ACTIVITIES));

    try {
      setIsCloudSyncing(true);
      const newTimestamp = new Date().toISOString();
      const factoryPayload = {
        gtkList: MOCK_GTK_LIST,
        siswaList: MOCK_SISWA_LIST,
        rombelList: MOCK_ROMBEL_LIST,
        mapelList: DEFAULT_MAPEL_LIST,
        journals: INITIAL_JOURNALS,
        activities: ACTIVITIES,
        schoolInfo,
        isCleared: false,
        updatedAt: newTimestamp,
        version: '2.5.0'
      };

      // Push ke Supabase jika aktif
      if (getSupabaseConfig().isConfigured) {
        pushFullStateToSupabase(factoryPayload).catch(e => console.warn("Supabase factory reset failed", e));
      }

      await fetch('/api/database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(factoryPayload)
      });
      lastCloudTimestampRef.current = newTimestamp;
      const now = new Date();
      setCloudSyncedAt(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
    } catch (e) {
      console.warn("Reset factory cloud sync failed", e);
    } finally {
      setIsCloudSyncing(false);
    }

    showToast("Database berhasil dipulihkan ke data master resmi bawaan SMA NU Kaplongan!");
  };

  const handleExportDatabaseJson = () => {
    const fullBackup = {
      schoolInfo,
      gtkList,
      siswaList,
      rombelList,
      mapelList,
      journals,
      activities,
      exportedAt: new Date().toISOString(),
      version: '2.5.0'
    };
    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Backup_Database_SIMOPS_SMANU_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast("Cadangan database lengkap berhasil diunduh dalam format JSON.");
  };

  const handleImportDatabaseJson = (data: any) => {
    if (data) {
      if (Array.isArray(data.gtkList)) setGtkList(data.gtkList);
      if (Array.isArray(data.siswaList)) setSiswaList(data.siswaList);
      if (Array.isArray(data.rombelList)) setRombelList(data.rombelList);
      if (Array.isArray(data.mapelList)) setMapelList(data.mapelList);
      if (Array.isArray(data.journals)) setJournals(data.journals);
      if (Array.isArray(data.activities)) setActivities(data.activities);
      if (data.schoolInfo) handleUpdateSchoolInfo(data.schoolInfo);
      showToast("Database berhasil dipulihkan dari file cadangan JSON!");
    }
  };

  // Supabase Manual Migration Handlers
  const handleMigrateToSupabase = async () => {
    const sbConfig = getSupabaseConfig();
    if (!sbConfig.isConfigured) {
      showToast("Gagal: URL dan Anon Key Supabase belum dikonfigurasi di pengaturan.");
      return;
    }
    try {
      setIsCloudSyncing(true);
      const payload = {
        gtkList,
        siswaList,
        rombelList,
        mapelList,
        journals,
        activities,
        schoolInfo,
        isCleared: false,
        updatedAt: new Date().toISOString(),
        version: '2.5.0'
      };
      const res = await pushFullStateToSupabase(payload);
      if (res.success) {
        setSyncEngine('supabase');
        showToast("Migrasi ke Supabase Berhasil! Seluruh data telah tersimpan di Supabase PostgreSQL.");
      } else {
        showToast(`Migrasi Gagal: ${res.error || 'Terjadi kesalahan'}`);
      }
    } catch (e: any) {
      showToast(`Migrasi Gagal: ${e.message}`);
    } finally {
      setIsCloudSyncing(false);
    }
  };

  const handlePullFromSupabase = async () => {
    try {
      setIsCloudSyncing(true);
      const res = await fetchFullStateFromSupabase();
      if (res.exists && res.data) {
        isApplyingCloudUpdateRef.current = true;
        applyCloudData(res.data);
        setSyncEngine('supabase');
        setTimeout(() => { isApplyingCloudUpdateRef.current = false; }, 400);
        showToast("Data dari Supabase Cloud berhasil dimuat ke aplikasi!");
      } else {
        showToast("Tidak ada data ditemukan di Supabase atau tabel belum dibuat.");
      }
    } catch (e: any) {
      showToast(`Gagal menarik data Supabase: ${e.message}`);
    } finally {
      setIsCloudSyncing(false);
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'tambah-siswa':
        setCurrentPath('data-peserta-didik');
        showToast("Membuka Data Peserta Didik untuk menambah siswa...");
        break;
      case 'update-gtk':
        setCurrentPath('data-gtk');
        showToast("Membuka Data Master GTK untuk pembaruan profil & PTK...");
        break;
      case 'cetak-sptjm':
        handlePrintSPTJM();
        break;
      case 'upload-berkas':
        setCurrentPath('e-arsip-digital-dokumen');
        showToast("Membuka dialog upload berkas arsip digital...");
        break;
      default:
        showToast(`Aksi "${action}" diproses.`);
    }
  };

  const handleMetricCardClick = (type: string) => {
    switch (type) {
      case 'gtk':
        setCurrentPath('data-gtk');
        break;
      case 'siswa':
        setCurrentPath('data-peserta-didik');
        break;
      case 'rombel':
        setCurrentPath('data-rombel');
        break;
      case 'jurnal':
        setCurrentPath('input-dan-riwayat-jurnal');
        break;
      case 'pip':
        setCurrentPath('manajemen-pip');
        break;
      case 'dapodik':
        setCurrentPath('koneksi-dan-sinkronisasi');
        break;
      case 'jtm':
        setCurrentPath('rombel-dan-kalkulator-jtm');
        break;
      case 'berkas':
        setCurrentPath('e-arsip-digital-dokumen');
        break;
      default:
        showToast(`Membuka rincian: ${type.toUpperCase()}`);
    }
  };

  // Helper to render dynamic page title & breadcrumbs
  const getPageMeta = () => {
    switch (currentPath) {
      // 1. Dashboard
      case 'ringkasan-sekolah':
        return {
          section: 'Dashboard',
          title: 'Ringkasan Operasional Sekolah',
          subtitle: `${schoolInfo.schoolName} • ${schoolInfo.academicYear} • Status Dapodik: ${schoolInfo.dapodikStatus}`
        };
      case 'aktivitas-terbaru':
        return {
          section: 'Dashboard',
          title: 'Log Audit & Aktivitas Terbaru',
          subtitle: 'Rekam jejak real-time operasional sistem dan sinkronisasi Dapodik'
        };
      case 'bank-skills-ops':
        return {
          section: 'Dashboard',
          title: 'Bank Skills & Panduan Teknis Operator (OPS Mastery Hub)',
          subtitle: 'Prosedur Operasional Standar (SOP) Dapodik, Verval PD, ABM, TKA, PIP, dan SNBP'
        };

      // 2. Jurnal Harian OPS
      case 'dashboard-jurnal':
        return {
          section: 'Jurnal Harian OPS',
          title: 'Dashboard Kinerja Jurnal',
          subtitle: 'Statistik jam kerja, kepatuhan absensi harian, dan ringkasan pengesahan'
        };
      case 'input-dan-riwayat-jurnal':
        return {
          section: 'Jurnal Harian OPS',
          title: 'Input & Riwayat Jurnal Harian OPS',
          subtitle: 'Pencatatan kegiatan, alokasi jam kerja (Asia/Jakarta), dan pengesahan Kepala Sekolah'
        };
      case 'generator-jurnal-otomatis':
        return {
          section: 'Jurnal Harian OPS',
          title: 'Generator Jurnal Harian Otomatis',
          subtitle: 'Pembuatan log aktivitas harian otomatis berbasis paket agenda operasional sekolah'
        };
      case 'kalender-jurnal':
        return {
          section: 'Jurnal Harian OPS',
          title: 'Kalender Jurnal Operasional',
          subtitle: 'Visualisasi status kehadiran, rekapitulasi harian, dan agenda sekolah'
        };
      case 'laporan-dan-review-jurnal':
        return {
          section: 'Jurnal Harian OPS',
          title: 'Laporan & Pengesahan Jurnal Harian',
          subtitle: 'Rekapitulasi berkala, pengesahan Kepala Sekolah, dan ekspor dokumen kedinasan'
        };

      // 3. Data Master
      case 'profil-sekolah':
        return {
          section: 'Data Master',
          title: 'Profil & Identitas Satuan Pendidikan',
          subtitle: 'Konfigurasi identitas lembaga, kop surat resmi, penanggung jawab operator, dan pengesahan Kepala Sekolah'
        };
      case 'data-gtk':
        return {
          section: 'Data Master',
          title: 'Data Pendidik & Tenaga Kependidikan (GTK)',
          subtitle: 'Master data guru, beban tatap muka mingguan (JTM), dan status Info GTK'
        };
      case 'data-peserta-didik':
        return {
          section: 'Data Master',
          title: 'Data Induk Peserta Didik & Verval Dukcapil',
          subtitle: 'Data siswa aktif, NISN, pemadanan NIK Dukcapil, dan penanganan residu'
        };
      case 'data-rombel':
        return {
          section: 'Data Master',
          title: 'Data Rombongan Belajar (Rombel)',
          subtitle: 'Distribusi kelas X, XI, XII Kurikulum Merdeka, wali kelas, dan kuota ruang'
        };
      case 'mata-pelajaran-dan-kurikulum':
        return {
          section: 'Data Master',
          title: 'Mata Pelajaran & Struktur Kurikulum',
          subtitle: 'Struktur kurikulum Fase E & Fase F, alokasi jam per minggu, dan koordinator mata pelajaran'
        };

      // 4. Manajemen Kurikulum
      case 'rombel-dan-kalkulator-jtm':
        return {
          section: 'Manajemen Kurikulum',
          title: 'Kalkulator Beban Jam Tatap Muka (JTM)',
          subtitle: 'Simulasi pemenuhan ambang batas 24 JTM sertifikasi dan ekuivalensi tugas tambahan'
        };
      case 'distribusi-mengajar':
        return {
          section: 'Manajemen Kurikulum',
          title: 'Matriks Distribusi Mengajar Guru',
          subtitle: 'Pemetaan jadwal mingguan dan guru pengampu tiap rombel'
        };
      case 'linieritas-sertifikasi':
        return {
          section: 'Manajemen Kurikulum',
          title: 'Linieritas Sertifikasi Pendidik (Info GTK)',
          subtitle: 'Validasi kesesuaian kode bidang studi sertifikat pendidik dengan mata pelajaran yang diampu'
        };

      // 5. Integrasi Dapodik
      case 'koneksi-dan-sinkronisasi':
        return {
          section: 'Integrasi Dapodik',
          title: 'Web Service Koneksi & Sinkronisasi',
          subtitle: 'Status koneksi database lokal PostgreSQL 5774 ke server pusat Pusdatin Kemdikbudristek'
        };
      case 'quick-links-portal-pusat':
        return {
          section: 'Integrasi Dapodik',
          title: 'Tautan Cepat Portal Pusat Kedinasan',
          subtitle: 'Akses SSO instan ke Akun Belajar.id, Manajemen Dapodik, Verval PD/PTK, Info GTK, ABM Pusmendik, dan PDSS'
        };

      // 6. Program PIP
      case 'manajemen-pip':
        return {
          section: 'Program PIP',
          title: 'Manajemen & Penyaluran Bantuan PIP SimPel',
          subtitle: 'Pipeline 4 tahap pencairan, monitoring buku tabungan BNI SimPel siswa, dan status SPJ'
        };
      case 'surat-dan-kuasa-kolektif':
        return {
          section: 'Program PIP',
          title: 'Generator Surat Kuasa Kolektif Kepala Sekolah',
          subtitle: 'Pembuatan surat kuasa kolektif pencairan dana PIP ke Bank BNI format dinas resmi'
        };

      // 7. E-Arsip & Generator
      case 'e-arsip-digital-dokumen':
        return {
          section: 'E-Arsip & Generator',
          title: 'Brankas E-Arsip Digital Dokumen Sekolah',
          subtitle: 'Penyimpanan terenkripsi SK Kepala Sekolah, SPTJM Dapodik, Ijazah, dan Berita Acara ABM'
        };
      case 'generator-sk-dan-surat':
        return {
          section: 'E-Arsip & Generator',
          title: 'Generator SK & Surat Tugas Kedinasan',
          subtitle: 'Penerbitan surat tugas resmi dengan kop dinas SMA NU Kaplongan dan pengesahan Kepala Sekolah'
        };

      // 8. Laporan & Jadwal
      case 'reporting-center':
        return {
          section: 'Laporan & Jadwal',
          title: 'Pusat Laporan Eksekutif (Reporting Center)',
          subtitle: 'Kompilasi rekapitulasi data BOS, Rombel, JTM GTK, dan Jurnal Kerja format PDF/Excel'
        };
      case 'kalender-dan-deadline':
        return {
          section: 'Laporan & Jadwal',
          title: 'Kalender Batas Waktu Operasional (Deadlines)',
          subtitle: 'Pemantauan cut-off Dapodik, verifikasi TKA, pelaksanaan ABM, dan Info GTK'
        };
      case 'konfigurasi-sistem':
        return {
          section: 'Laporan & Jadwal',
          title: 'Konfigurasi Sistem & Cadangan Database',
          subtitle: 'Pengaturan interval sinkronisasi, backup lokal, dan identitas operator aktif'
        };

      default:
        return {
          section: 'Dashboard',
          title: 'Dashboard Operasional Sekolah',
          subtitle: `${schoolInfo.schoolName} • ${schoolInfo.academicYear} • Status Dapodik: ${schoolInfo.dapodikStatus}`
        };
    }
  };

  const pageMeta = getPageMeta();

  return (
    <div className="min-h-screen bg-background font-body-md text-on-surface antialiased flex flex-col">
      {/* Sidebar */}
      <Sidebar
        currentPath={currentPath}
        onSelectPath={(path) => {
          setCurrentPath(path);
          setSidebarOpen(false);
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        schoolInfo={schoolInfo}
        activeRole={activeRole}
      />

      {/* Main Content Area */}
      <div className="lg:pl-80 flex flex-col min-h-screen transition-all">
        {/* Header */}
        <Header
          schoolInfo={schoolInfo}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenJurnalModal={() => {
            setCurrentPath('input-dan-riwayat-jurnal');
            showToast("Membuka modul Input & Riwayat Jurnal Harian");
          }}
          activeRole={activeRole}
          onChangeRole={(role) => {
            setActiveRole(role);
            showToast(`Beralih ke tampilan profil: ${role}`);
          }}
          onSearch={() => {}}
          onNavigate={(path) => setCurrentPath(path)}
          onOpenResiduModal={() => setResiduModalOpen(true)}
          onOpenSyncModal={() => setSyncModalOpen(true)}
          onShowToast={showToast}
          isCloudSyncing={isCloudSyncing}
          cloudSyncedAt={cloudSyncedAt}
          syncEngine={syncEngine}
          onManualSync={() => syncFromCloud(true)}
        />

        {/* Page Main */}
        <main className="w-full pt-20 px-4 sm:px-6 lg:px-gutter-desktop flex-1 bg-background">
          <div className="flex flex-col w-full pb-space-xl max-w-7xl mx-auto">
            
            {/* Page Header & Action Bar (Hidden completely on Laporan Kedinasan) */}
            {currentPath !== 'laporan-dan-review-jurnal' && (
              <div className="no-print print:hidden flex flex-col lg:flex-row lg:items-center justify-between gap-2 py-3 sm:py-3.5">
                <div className="flex flex-col min-w-0">
                  <nav className="flex items-center gap-1.5 text-on-surface-variant text-[11px] mb-1 flex-wrap">
                    <span className="px-1.5 py-0.5 rounded bg-surface-container-low font-medium border border-surface-container/60 text-outline dark:text-slate-400">
                      {pageMeta.section}
                    </span>
                    <span className="material-symbols-outlined text-[10px] text-outline">chevron_right</span>
                    <span className="text-primary dark:text-sky-400 font-semibold">{pageMeta.title}</span>
                  </nav>
                  <h1 className="text-lg sm:text-xl text-primary dark:text-sky-300 tracking-tight font-bold">
                    {pageMeta.title}
                  </h1>
                  <p className="text-xs text-on-surface-variant dark:text-slate-400 flex flex-wrap items-center gap-2 mt-0.5">
                    <span>{pageMeta.subtitle}</span>
                  </p>
                </div>
              </div>
            )}

            {/* JURNAL HARIAN OPS: UNIFIED SUB-NAV TABS */}
            {[
              'dashboard-jurnal',
              'input-dan-riwayat-jurnal',
              'generator-jurnal-otomatis',
              'kalender-jurnal',
              'laporan-dan-review-jurnal'
            ].includes(currentPath) && (
              <div className="no-print print:hidden mb-4 flex items-center gap-1.5 p-1 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-sm overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setCurrentPath('dashboard-jurnal')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                    currentPath === 'dashboard-jurnal'
                      ? 'bg-primary text-white shadow-md'
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">query_stats</span>
                  <span>Dashboard Jurnal</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentPath('input-dan-riwayat-jurnal')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                    currentPath === 'input-dan-riwayat-jurnal'
                      ? 'bg-primary text-white shadow-md'
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">edit_note</span>
                  <span>Input &amp; Riwayat</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentPath('generator-jurnal-otomatis')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                    currentPath === 'generator-jurnal-otomatis'
                      ? 'bg-primary text-white shadow-md'
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">auto_awesome</span>
                  <span>Generator Otomatis</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentPath('kalender-jurnal')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                    currentPath === 'kalender-jurnal'
                      ? 'bg-primary text-white shadow-md'
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">calendar_month</span>
                  <span>Kalender Jurnal</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentPath('laporan-dan-review-jurnal')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                    currentPath === 'laporan-dan-review-jurnal'
                      ? 'bg-primary text-white shadow-md'
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">summarize</span>
                  <span>Laporan &amp; Review Jurnal</span>
                </button>
              </div>
            )}

            {/* DYNAMIC CONTENT ROUTER (Instant In-Memory Rendering) */}
            {currentPath === 'dashboard-jurnal' && (
              <JournalDashboardView
                journals={journals}
                onNavigateToInput={() => setCurrentPath('input-dan-riwayat-jurnal')}
                onNavigateToAutoGenerator={() => setCurrentPath('generator-jurnal-otomatis')}
                onNavigateToCalendar={() => setCurrentPath('kalender-jurnal')}
                onNavigateToReport={() => setCurrentPath('laporan-dan-review-jurnal')}
                onShowToast={showToast}
              />
            )}

            {currentPath === 'input-dan-riwayat-jurnal' && (
              <JournalHistoryView
                activeRole={activeRole}
                journals={journals}
                initialSelectedDate={selectedJournalDate}
                onUpdateJournals={handleUpdateJournals}
                onNavigateToAutoGenerator={() => setCurrentPath('generator-jurnal-otomatis')}
                onNavigateToCalendar={() => setCurrentPath('kalender-jurnal')}
                onNavigateToReport={() => setCurrentPath('laporan-dan-review-jurnal')}
                onShowToast={showToast}
              />
            )}

            {currentPath === 'generator-jurnal-otomatis' && (
              <JournalAutoGeneratorView
                schoolInfo={schoolInfo}
                onJournalCreated={(newJ) => {
                  handleUpdateJournals((prev) => [newJ, ...prev.filter((j) => j.journal_date !== newJ.journal_date)]);
                }}
                onJournalsBatchCreated={(batch) => {
                  handleUpdateJournals((prev) => {
                    const batchDates = new Set(batch.map((b) => b.journal_date));
                    return [...batch, ...prev.filter((j) => !batchDates.has(j.journal_date))];
                  });
                }}
                onNavigateToHistory={() => setCurrentPath('input-dan-riwayat-jurnal')}
                onNavigateToReport={() => setCurrentPath('laporan-dan-review-jurnal')}
                onShowToast={showToast}
              />
            )}

            {currentPath === 'kalender-jurnal' && (
              <JournalCalendarView
                journals={journals}
                onSelectDate={(date) => {
                  setSelectedJournalDate(date);
                  setCurrentPath('input-dan-riwayat-jurnal');
                }}
                onNavigateToAutoGenerator={() => setCurrentPath('generator-jurnal-otomatis')}
                onNavigateToReport={() => setCurrentPath('laporan-dan-review-jurnal')}
                onShowToast={showToast}
              />
            )}

            {currentPath === 'laporan-dan-review-jurnal' && (
              <JournalReportReviewView
                journals={journals}
                schoolInfo={schoolInfo}
                activeRole={activeRole}
                onNavigateToProfile={() => setCurrentPath('profil-sekolah')}
                onShowToast={showToast}
              />
            )}

            {currentPath === 'profil-sekolah' && (
              <SchoolProfileView
                schoolInfo={schoolInfo}
                onUpdateSchoolInfo={handleUpdateSchoolInfo}
                onNavigateToReport={() => setCurrentPath('laporan-dan-review-jurnal')}
                onShowToast={showToast}
              />
            )}

            {/* 1. Dashboard: Ringkasan Sekolah & Aktivitas Terbaru */}
            {currentPath === 'ringkasan-sekolah' && (
              <>
                {/* Alert & Countdown Banner */}
                <CountdownBanner onCheckResidu={() => setResiduModalOpen(true)} />

                {/* 8 Core Metric Cards Grid */}
                <MetricCardsGrid
                  gtkList={gtkList}
                  siswaList={siswaList}
                  rombelList={rombelList}
                  journals={journals}
                  onCardClick={handleMetricCardClick}
                />

                {/* Main Section: 2 Columns Operational Detail */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
                  {/* Left Column (7 Cols): Visual Analytics, PIP Stepper, JTM Status */}
                  <div className="lg:col-span-7 flex flex-col gap-space-lg">
                    <StudentDistributionCard
                      siswaList={siswaList}
                      rombelList={rombelList}
                    />
                    <JTMStatusCard
                      gtkList={gtkList}
                      onManageJTM={() => setCurrentPath('rombel-dan-kalkulator-jtm')}
                      onDetailDistribusi={() => setCurrentPath('linieritas-sertifikasi')}
                    />
                    <PIPPipelineCard
                      siswaList={siswaList}
                      onPrintSPTJM={handlePrintSPTJM}
                    />
                  </div>

                  {/* Right Column (5 Cols): Timeline & Quick Deadlines */}
                  <div className="lg:col-span-5 flex flex-col gap-space-lg">
                    <DeadlineListCard
                      onViewAllCalendar={() => setCurrentPath('kalender-dan-deadline')}
                    />
                    <ActivityTimelineCard
                      activities={activities}
                    />
                    <QuickActionsCard onAction={handleQuickAction} />
                  </div>
                </div>
              </>
            )}

            {currentPath === 'aktivitas-terbaru' && (
              <AktivitasTerbaruView
                onShowToast={showToast}
                onNavigateToJurnal={() => setCurrentPath('input-dan-riwayat-jurnal')}
                activities={activities}
              />
            )}

            {currentPath === 'bank-skills-ops' && (
              <OperatorSkillsView
                onShowToast={showToast}
                onNavigateToJurnal={() => setCurrentPath('input-dan-riwayat-jurnal')}
              />
            )}

            {/* 2. Data Master Views */}
            {[
              'data-gtk',
              'data-peserta-didik',
              'data-rombel',
              'mata-pelajaran-dan-kurikulum'
            ].includes(currentPath) && (
              <MasterDataView
                subType={currentPath as any}
                schoolInfo={schoolInfo}
                onShowToast={showToast}
                onNavigateToJurnal={() => setCurrentPath('input-dan-riwayat-jurnal')}
                gtkList={gtkList}
                setGtkList={setGtkList}
                siswaList={siswaList}
                setSiswaList={setSiswaList}
                rombelList={rombelList}
                setRombelList={setRombelList}
                mapelList={mapelList}
                setMapelList={setMapelList}
              />
            )}

            {/* 3. Manajemen Kurikulum Views */}
            {[
              'rombel-dan-kalkulator-jtm',
              'distribusi-mengajar',
              'linieritas-sertifikasi'
            ].includes(currentPath) && (
              <KurikulumView
                subType={currentPath as any}
                onShowToast={showToast}
                gtkList={gtkList}
              />
            )}

            {/* 4. Integrasi Dapodik Views */}
            {[
              'koneksi-dan-sinkronisasi',
              'quick-links-portal-pusat'
            ].includes(currentPath) && (
              <DapodikView
                subType={currentPath as any}
                schoolInfo={schoolInfo}
                onShowToast={showToast}
                onNavigateToJurnal={() => setCurrentPath('input-dan-riwayat-jurnal')}
              />
            )}

            {/* 5. Program PIP Views */}
            {[
              'manajemen-pip',
              'surat-dan-kuasa-kolektif'
            ].includes(currentPath) && (
              <PipManagementView
                subType={currentPath as any}
                schoolInfo={schoolInfo}
                onShowToast={showToast}
                siswaList={siswaList}
              />
            )}

            {/* 6. E-Arsip & Generator Views */}
            {[
              'e-arsip-digital-dokumen',
              'generator-sk-dan-surat'
            ].includes(currentPath) && (
              <ArsipGeneratorView
                subType={currentPath as any}
                schoolInfo={schoolInfo}
                onShowToast={showToast}
              />
            )}

            {/* 7. Laporan & Jadwal Views */}
            {[
              'reporting-center',
              'kalender-dan-deadline',
              'konfigurasi-sistem'
            ].includes(currentPath) && (
              <LaporanJadwalView
                subType={currentPath as any}
                schoolInfo={schoolInfo}
                onShowToast={showToast}
                onNavigateToJurnal={() => setCurrentPath('laporan-dan-review-jurnal')}
                onClearAllDatabase={handleClearAllDatabase}
                onResetFactoryDatabase={handleResetFactoryDatabase}
                onExportDatabaseJson={handleExportDatabaseJson}
                onImportDatabaseJson={handleImportDatabaseJson}
                onMigrateToSupabase={handleMigrateToSupabase}
                onPullFromSupabase={handlePullFromSupabase}
                syncEngine={syncEngine}
                databaseStats={{
                  totalGtk: gtkList.length,
                  totalSiswa: siswaList.length,
                  totalRombel: rombelList.length,
                  totalMapel: mapelList.length,
                  totalJournals: journals.length
                }}
              />
            )}

          </div>
        </main>
      </div>

      {/* Modals rendered instantly */}
      {jurnalModalOpen && (
        <JurnalModal
          isOpen={jurnalModalOpen}
          onClose={() => setJurnalModalOpen(false)}
          onSubmit={(data) => {
            showToast(`Jurnal berhasil disimpan: "${data.uraian.slice(0, 30)}..."`);
          }}
        />
      )}

      {syncModalOpen && (
        <SyncModal
          isOpen={syncModalOpen}
          onClose={() => setSyncModalOpen(false)}
          onComplete={() => {
            showToast("Sinkronisasi Dapodik berhasil diperbarui!");
          }}
        />
      )}

      {residuModalOpen && (
        <ResiduModal
          isOpen={residuModalOpen}
          onClose={() => setResiduModalOpen(false)}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-xl border border-white/10 animate-bounce">
          <span className="material-symbols-outlined text-tertiary-fixed text-xl">info</span>
          <span className="text-body-sm font-medium">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-outline-variant hover:text-white"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}
    </div>
  );
};
export default App;

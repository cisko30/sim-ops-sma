export type JournalStatus = 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Revision Requested';

export type ActivityStatus = 'Planned' | 'In Progress' | 'Completed' | 'Pending' | 'Blocked';

export type ActivityPriority = 'Tinggi' | 'Sedang' | 'Rendah';

export type JournalCategory = 
  | 'Dapodik'
  | 'Data GTK'
  | 'Peserta Didik'
  | 'Rombel'
  | 'Kurikulum dan JTM'
  | 'Sertifikasi'
  | 'PIP'
  | 'E-Arsip'
  | 'Generator SK'
  | 'Administrasi Sekolah'
  | 'Pelaporan'
  | 'TKA'
  | 'ABM'
  | 'PDSS/SNBP'
  | 'Pemeliharaan IT'
  | 'Koordinasi'
  | 'Lainnya';

export interface JournalActivity {
  id: string;
  daily_journal_id: string;
  category: JournalCategory;
  activity_title: string;
  description: string;
  start_time: string; // HH:mm
  end_time: string;   // HH:mm
  duration_minutes: number;
  result?: string;
  obstacle?: string;
  follow_up?: string;
  follow_up_date?: string;
  priority: ActivityPriority;
  status: ActivityStatus;
  related_module?: string;
  sort_order: number;
}

export interface DailyJournal {
  id: string;
  school_id: number;
  user_id: number;
  user_name: string;
  user_role: string;
  journal_date: string; // YYYY-MM-DD
  unit_name: string;
  daily_summary: string;
  total_duration_minutes: number;
  status: JournalStatus;
  submitted_at?: string;
  reviewer_id?: number;
  reviewer_name?: string;
  reviewed_at?: string;
  review_notes?: string;
  activities: JournalActivity[];
}


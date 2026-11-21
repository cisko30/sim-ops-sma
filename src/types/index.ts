export interface MetricCard {
  id: string;
  title: string;
  value: string | number;
  unit: string;
  badge?: {
    text: string;
    variant: 'primary' | 'secondary' | 'tertiary' | 'warning' | 'error' | 'neutral';
    icon?: string;
  };
  icon: string;
  iconColor: string;
  footer: {
    left?: React.ReactNode;
    right?: React.ReactNode;
    fullText?: string;
  };
}

export interface ActivityLog {
  id: string;
  title: string;
  time: string;
  description: string;
  dotColor: string;
}

export interface OperationalDeadline {
  id: string;
  month: string;
  day: string;
  title: string;
  countdownTag: string;
  isUrgent?: boolean;
  description: string;
}

export interface PIPStep {
  step: number;
  label: string;
  count: number;
  sublabel: string;
  statusNote: string;
  statusType: 'success' | 'warning' | 'neutral' | 'error';
  icon: string;
}

export interface ResiduItem {
  id: string;
  kategori: 'Peserta Didik' | 'GTK' | 'Sarpras';
  nama: string;
  keterangan: string;
  status: 'Kritis' | 'Peringatan' | 'Perbaikan';
}

export interface SchoolInfo {
  name: string;
  schoolName: string;
  institution: string; // Lembaga Pendidikan Ma'arif Nahdlatul Ulama
  subdistrict: string; // Karangampel Kabupaten Indramayu
  address: string;
  postalCode: string;
  phone: string;
  email: string;
  website?: string;
  npsn: string;
  accreditation: string; // "A"
  academicYear: string;
  dapodikStatus: string;
  operatorName: string;
  operatorNip: string;
  operatorRole: string;
  operatorUnit: string;
  principalName: string;
  principalNip: string;
  principalTitle: string;
  logoUrl?: string;
  serverInfo?: string;
}

export type UserRole = 'OPS' | 'Kurikulum' | 'Kepsek' | 'Bendahara' | 'Wali Kelas';



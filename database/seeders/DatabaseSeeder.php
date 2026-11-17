<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\School;
use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use App\Models\AcademicYear;
use App\Models\Semester;
use App\Models\Teacher;
use App\Models\Subject;
use App\Models\Student;
use App\Models\Classroom;
use App\Models\ClassroomStudent;
use App\Models\WorkloadAssignment;
use App\Models\AdditionalDuty;
use App\Models\RegulatoryRule;
use App\Models\PipRecord;
use App\Models\DocumentType;
use App\Models\DailyJournal;
use App\Models\JournalActivity;
use App\Models\OpsEvent;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. School Profile
        $school = School::create([
            'name' => 'SMA Cipta Bangsa Mandiri',
            'npsn' => '20108920',
            'address' => 'Jl. Pendidikan No. 45, Kompleks Kebangsaan',
            'phone' => '(021) 7890123',
            'email' => 'info@smaciptabangsa.sch.id',
            'principal_name' => 'Dr. H. Ahmad Fauzi, M.Pd.',
            'principal_nip' => '19750812 200003 1 002',
            'operator_name' => 'Bagas Pratama, S.Kom',
            'settings_json' => [
                'accreditation' => 'A',
                'curriculum_type' => 'Kurikulum Merdeka',
                'dapodik_server_host' => '192.168.1.100',
            ],
        ]);

        // 2. Roles
        $roleOps = Role::create(['name' => 'SUPER ADMIN / OPS', 'label' => 'Operator Sekolah (OPS)', 'description' => 'Akses penuh ke seluruh modul sistem.']);
        $roleKurikulum = Role::create(['name' => 'WAKA KURIKULUM', 'label' => 'Waka Kurikulum', 'description' => 'Akses manajemen rombel, JTM, linieritas, dan rekomendasi kurikulum.']);
        $roleKepsek = Role::create(['name' => 'KEPALA SEKOLAH', 'label' => 'Kepala Sekolah', 'description' => 'Dashboard eksekutif, persetujuan SK, dan review jurnal.']);
        $roleSiswa = Role::create(['name' => 'SISWA / WALI SISWA', 'label' => 'Siswa / Wali Siswa', 'description' => 'Portal dokumen dan monitoring PIP (opsional).']);

        // 3. Permissions
        $modules = ['DASHBOARD', 'GTK', 'SISWA', 'ROMBEL', 'KURIKULUM', 'DAPODIK', 'PIP', 'ARSIP', 'SK', 'JURNAL', 'LAPORAN', 'SETTINGS'];
        foreach ($modules as $mod) {
            foreach (['VIEW', 'CREATE', 'EDIT', 'DELETE', 'EXPORT', 'APPROVE'] as $act) {
                $perm = Permission::create([
                    'name' => "{$mod}_{$act}",
                    'label' => ucfirst(strtolower($act)) . " " . ucfirst(strtolower($mod)),
                    'module' => $mod,
                ]);
                $roleOps->permissions()->attach($perm);
                if (in_array($mod, ['GTK', 'ROMBEL', 'KURIKULUM']) && in_array($act, ['VIEW', 'CREATE', 'EDIT', 'EXPORT'])) {
                    $roleKurikulum->permissions()->attach($perm);
                }
                if ($act === 'VIEW' || ($mod === 'SK' && $act === 'APPROVE') || ($mod === 'JURNAL' && $act === 'APPROVE')) {
                    $roleKepsek->permissions()->attach($perm);
                }
            }
        }

        // 4. Core Users
        $userOps = User::create([
            'school_id' => $school->id,
            'name' => 'Bagas Pratama, S.Kom',
            'email' => 'operator@smaciptabangsa.sch.id',
            'password' => Hash::make('password123'),
            'phone' => '081234567890',
            'is_active' => true,
        ]);
        $userOps->roles()->attach($roleOps);

        $userKurikulum = User::create([
            'school_id' => $school->id,
            'name' => 'Drs. Hendro Wibowo, M.Pd.',
            'email' => 'kurikulum@smaciptabangsa.sch.id',
            'password' => Hash::make('password123'),
            'phone' => '081298765432',
            'is_active' => true,
        ]);
        $userKurikulum->roles()->attach($roleKurikulum);

        $userKepsek = User::create([
            'school_id' => $school->id,
            'name' => 'Dr. H. Ahmad Fauzi, M.Pd.',
            'email' => 'kepsek@smaciptabangsa.sch.id',
            'password' => Hash::make('password123'),
            'phone' => '081345678901',
            'is_active' => true,
        ]);
        $userKepsek->roles()->attach($roleKepsek);

        // 5. Academic Years & Semesters
        $academicYear = AcademicYear::create([
            'school_id' => $school->id,
            'name' => '2024/2025',
            'start_date' => '2024-07-15',
            'end_date' => '2025-06-25',
            'is_active' => true,
        ]);

        $semesterGanjil = Semester::create([
            'academic_year_id' => $academicYear->id,
            'semester_type' => 'Ganjil',
            'name' => '2024/2025 Semester Ganjil',
            'start_date' => '2024-07-15',
            'end_date' => '2024-12-20',
            'is_active' => false,
        ]);

        $semesterGenap = Semester::create([
            'academic_year_id' => $academicYear->id,
            'semester_type' => 'Genap',
            'name' => '2024/2025 Semester Genap',
            'start_date' => '2025-01-06',
            'end_date' => '2025-06-25',
            'is_active' => true,
        ]);

        // 6. Regulatory Rules
        RegulatoryRule::create([
            'school_id' => $school->id,
            'rule_category' => 'JTM',
            'rule_name' => 'MIN_JTM_CERTIFICATION',
            'rule_value' => '24',
            'effective_from' => '2024-01-01',
            'reference_document' => 'Permendikbudristek Nomor 16 Tahun 2022',
            'is_active' => true,
        ]);

        // 7. Subjects
        $subjects = [
            ['MAT', 'Matematika Tingkat Lanjut', 'Fase F', 4],
            ['FIS', 'Fisika', 'Fase F', 5],
            ['KIM', 'Kimia', 'Fase F', 5],
            ['BIO', 'Biologi', 'Fase F', 5],
            ['EKO', 'Ekonomi', 'Fase F', 5],
            ['GEO', 'Geografi', 'Fase F', 5],
            ['SOS', 'Sosiologi', 'Fase F', 5],
            ['SEJ', 'Sejarah', 'Semua', 2],
            ['IND', 'Bahasa Indonesia', 'Semua', 3],
            ['ING', 'Bahasa Inggris', 'Semua', 3],
            ['PAI', 'Pendidikan Agama Islam', 'Semua', 3],
            ['PJOK', 'Pendidikan Jasmani & Olahraga', 'Semua', 3],
        ];

        foreach ($subjects as $s) {
            Subject::create([
                'school_id' => $school->id,
                'subject_code' => $s[0],
                'name' => $s[1],
                'phase' => $s[2],
                'standard_jtm' => $s[3],
                'is_active' => true,
            ]);
        }

        // 8. Classrooms (30 Classes: 10 per Grade, avg 36 students)
        // Grade 10: X-A s/d X-J (Fase E)
        for ($i = 1; $i <= 10; $i++) {
            $char = chr(64 + $i);
            Classroom::create([
                'school_id' => $school->id,
                'academic_year_id' => $academicYear->id,
                'grade_level' => 10,
                'phase' => 'Fase E',
                'name' => "X-{$char}",
                'specialization' => 'Umum',
                'student_capacity' => 36,
            ]);
        }

        // Grade 11: XI-MIPA 1-5, XI-IPS 1-4, XI-BAHASA 1
        for ($i = 1; $i <= 5; $i++) {
            Classroom::create([
                'school_id' => $school->id,
                'academic_year_id' => $academicYear->id,
                'grade_level' => 11,
                'phase' => 'Fase F',
                'name' => "XI-MIPA {$i}",
                'specialization' => 'MIPA',
                'student_capacity' => 36,
            ]);
        }
        for ($i = 1; $i <= 4; $i++) {
            Classroom::create([
                'school_id' => $school->id,
                'academic_year_id' => $academicYear->id,
                'grade_level' => 11,
                'phase' => 'Fase F',
                'name' => "XI-IPS {$i}",
                'specialization' => 'IPS',
                'student_capacity' => 36,
            ]);
        }
        Classroom::create([
            'school_id' => $school->id,
            'academic_year_id' => $academicYear->id,
            'grade_level' => 11,
            'phase' => 'Fase F',
            'name' => "XI-BAHASA 1",
            'specialization' => 'Bahasa',
            'student_capacity' => 36,
        ]);

        // Grade 12: XII-MIPA 1-5, XII-IPS 1-4, XII-BAHASA 1
        for ($i = 1; $i <= 5; $i++) {
            Classroom::create([
                'school_id' => $school->id,
                'academic_year_id' => $academicYear->id,
                'grade_level' => 12,
                'phase' => 'Fase F',
                'name' => "XII-MIPA {$i}",
                'specialization' => 'MIPA',
                'student_capacity' => 36,
            ]);
        }
        for ($i = 1; $i <= 4; $i++) {
            Classroom::create([
                'school_id' => $school->id,
                'academic_year_id' => $academicYear->id,
                'grade_level' => 12,
                'phase' => 'Fase F',
                'name' => "XII-IPS {$i}",
                'specialization' => 'IPS',
                'student_capacity' => 36,
            ]);
        }
        Classroom::create([
            'school_id' => $school->id,
            'academic_year_id' => $academicYear->id,
            'grade_level' => 12,
            'phase' => 'Fase F',
            'name' => "XII-BAHASA 1",
            'specialization' => 'Bahasa',
            'student_capacity' => 36,
        ]);

        // 9. Teachers Sample (Includes the 3 critical teachers from prompt)
        $teachersData = [
            ['Dra. Hj. Ratna', 'PNS', '19680512 199303 2 004', '8745746648200032', 'Sejarah', false, 18],
            ['Budi Santoso, S.Pd', 'PPPK', '19890214 202221 1 005', '9854761234100012', 'BK', false, 16],
            ['Hendra, M.Pd', 'Honorer', null, '1245789654100054', 'Sosiologi', false, 18],
            ['Dra. Siti Aminah, M.Pd', 'PNS', '19700315 199512 2 001', '3214567890123456', 'Matematika', true, 26],
            ['Ahmad Syarif, S.Si', 'PNS', '19810420 200501 1 008', '4321567890123456', 'Fisika', true, 24],
            ['Rina Marlina, S.Pd', 'PPPK', '19920810 202321 2 015', '5432167890123456', 'Bahasa Inggris', true, 24],
        ];

        foreach ($teachersData as $t) {
            $teacher = Teacher::create([
                'school_id' => $school->id,
                'name' => $t[0],
                'gender' => str_contains($t[0], 'Hj.') || str_contains($t[0], 'Rina') || str_contains($t[0], 'Siti') ? 'P' : 'L',
                'employment_status' => $t[1],
                'nip' => $t[2],
                'nuptk' => $t[3],
                'education' => 'S1 / S2 Pendidikan',
                'is_certified' => $t[5],
                'certification_subject_code' => $t[4],
                'is_active' => true,
            ]);

            // Tambahkan tugas tambahan jika ada
            if ($t[6] < 24 && $t[1] !== 'Honorer') {
                AdditionalDuty::create([
                    'teacher_id' => $teacher->id,
                    'semester_id' => $semesterGenap->id,
                    'duty_type' => 'Wali Kelas & Pembina Ekstrakurikuler',
                    'equivalency_jtm' => 4,
                    'sk_reference' => 'SK/421.3/084/2025',
                ]);
            }
        }

        // 10. Sample Students (Fictitious)
        for ($i = 1; $i <= 30; $i++) {
            $student = Student::create([
                'school_id' => $school->id,
                'nisn' => '007' . str_pad($i, 7, '0', STR_PAD_LEFT),
                'nik' => '3276' . str_pad($i, 12, '1', STR_PAD_LEFT),
                'no_kk' => '3276' . str_pad($i, 12, '2', STR_PAD_LEFT),
                'name' => "Siswa Contoh {$i}",
                'gender' => $i % 2 === 0 ? 'P' : 'L',
                'birth_place' => 'Jakarta',
                'birth_date' => Carbon::now()->subYears(16)->format('Y-m-d'),
                'parent_name' => "Orang Tua Siswa {$i}",
                'kip_status' => $i <= 5,
                'kip_number' => $i <= 5 ? "KIP-2025-{$i}" : null,
                'is_active' => true,
            ]);

            if ($i <= 5) {
                PipRecord::create([
                    'school_id' => $school->id,
                    'student_id' => $student->id,
                    'fiscal_year' => 2025,
                    'assistance_stage' => 'Tahap 1',
                    'sk_type' => 'SK Pemberian',
                    'sk_number' => '142/P/PIP/2025',
                    'nominal_amount' => 1800000.00,
                    'bank_name' => 'Bank BNI',
                    'account_number_encrypted' => '045981234' . $i,
                    'activation_status' => $i <= 3 ? 'Sudah Aktivasi' : 'Belum Aktivasi',
                    'disbursement_status' => $i <= 2 ? 'Dana Sudah Cair' : 'Proses Bank',
                ]);
            }
        }

        // 11. Sample Daily Journal (Today's realistic OPS tasks)
        $todayJournal = DailyJournal::create([
            'school_id' => $school->id,
            'user_id' => $userOps->id,
            'journal_date' => Carbon::today('Asia/Jakarta')->format('Y-m-d'),
            'unit_name' => 'Unit Tata Usaha & Operasional Sekolah',
            'daily_summary' => 'Menyelesaikan sinkronisasi data Dapodik semester genap, verifikasi berkas PIP 14 siswa, dan penataan distribusi JTM guru sejarah.',
            'total_duration_minutes' => 330,
            'status' => 'Submitted',
            'submitted_at' => now(),
        ]);

        $activities = [
            [
                'category' => 'Dapodik',
                'activity_title' => 'Sinkronisasi Server Dapodikdasmen',
                'description' => 'Melakukan sinkronisasi data master GTK dan Rombel semester genap ke server pusat.',
                'start_time' => '08:00',
                'end_time' => '09:00',
                'duration_minutes' => 60,
                'result' => 'Sukses sinkronisasi tanpa kendala teknis.',
                'obstacle' => 'Koneksi server sempat melambat pada menit awal.',
                'status' => 'Completed',
            ],
            [
                'category' => 'Kurikulum dan JTM',
                'activity_title' => 'Penyesuaian Jam Mengajar & Linieritas GTK',
                'description' => 'Pencocokan data jam mengajar guru sejarah dan ekuivalensi tugas tambahan.',
                'start_time' => '09:15',
                'end_time' => '11:00',
                'duration_minutes' => 105,
                'result' => 'Draft pembagian tugas tambahan selesai direkap.',
                'status' => 'Completed',
            ],
            [
                'category' => 'PIP',
                'activity_title' => 'Verifikasi Berkas KIP Digital & Kuasa Kolektif',
                'description' => 'Memvalidasi kelengkapan dokumen identitas siswa untuk pengajuan buku tabungan SimPel ke Bank BNI.',
                'start_time' => '11:15',
                'end_time' => '12:30',
                'duration_minutes' => 75,
                'result' => '14 berkas siswa tervalidasi dan siap cetak SPTJM.',
                'status' => 'Completed',
            ],
            [
                'category' => 'E-Arsip',
                'activity_title' => 'Penerbitan SK Kepala Sekolah Format Digital',
                'description' => 'Generate SK Pembagian Beban Tugas Mengajar dilengkapi validasi QR Code.',
                'start_time' => '13:30',
                'end_time' => '15:00',
                'duration_minutes' => 90,
                'result' => 'Dokumen tersimpan aman pada private storage.',
                'status' => 'Completed',
            ],
        ];

        foreach ($activities as $idx => $act) {
            JournalActivity::create(array_merge($act, [
                'daily_journal_id' => $todayJournal->id,
                'sort_order' => $idx + 1,
            ]));
        }

        // 12. Ops Events & Deadlines
        OpsEvent::create([
            'school_id' => $school->id,
            'title' => 'Batas Pengajuan Kuasa PIP',
            'category' => 'PIP',
            'deadline_date' => Carbon::now()->addDays(4)->format('Y-m-d'),
            'priority' => 'Urgent',
            'description' => 'Penyerahan berkas SPTJM Kepala Sekolah ke BNI Cabang Kota.',
            'assigned_to' => $userOps->id,
            'status' => 'In Progress',
        ]);

        OpsEvent::create([
            'school_id' => $school->id,
            'title' => 'Verifikasi Linieritas Info GTK',
            'category' => 'GTK',
            'deadline_date' => Carbon::now()->addDays(8)->format('Y-m-d'),
            'priority' => 'High',
            'description' => 'Pencocokan data jam mengajar dengan kode sertifikasi serdik pendidik.',
            'assigned_to' => $userKurikulum->id,
            'status' => 'Upcoming',
        ]);

        OpsEvent::create([
            'school_id' => $school->id,
            'title' => 'Cut-Off Dapodik Tahap Awal',
            'category' => 'Dapodik',
            'deadline_date' => Carbon::now()->addDays(14)->format('Y-m-d'),
            'priority' => 'Urgent',
            'description' => 'Penetapan kuota dana BOS Reguler Semester Genap tahun anggaran berjalan.',
            'assigned_to' => $userOps->id,
            'status' => 'Upcoming',
        ]);

        // 13. Document Types
        DocumentType::create(['name' => 'KTP / Identitas GTK', 'category' => 'GTK', 'allowed_extensions' => 'pdf,jpg,png', 'max_file_size_kb' => 2048, 'is_mandatory' => true]);
        DocumentType::create(['name' => 'Ijazah Terakhir', 'category' => 'GTK', 'allowed_extensions' => 'pdf', 'max_file_size_kb' => 5120, 'is_mandatory' => true]);
        DocumentType::create(['name' => 'Akta Kelahiran', 'category' => 'Siswa', 'allowed_extensions' => 'pdf,jpg', 'max_file_size_kb' => 2048, 'is_mandatory' => true]);
        DocumentType::create(['name' => 'Kartu Keluarga (KK)', 'category' => 'Siswa', 'allowed_extensions' => 'pdf,jpg', 'max_file_size_kb' => 2048, 'is_mandatory' => true]);
        DocumentType::create(['name' => 'Buku Rekening SimPel', 'category' => 'PIP', 'allowed_extensions' => 'pdf,jpg,png', 'max_file_size_kb' => 3072, 'is_mandatory' => true]);
    }
}


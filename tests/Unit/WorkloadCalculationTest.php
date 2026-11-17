<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Teacher;
use App\Models\Semester;
use App\Models\AcademicYear;
use App\Models\School;
use App\Models\Subject;
use App\Models\Classroom;
use App\Models\WorkloadAssignment;
use App\Models\AdditionalDuty;
use App\Models\RegulatoryRule;
use App\Services\Curriculum\WorkloadCalculationService;

class WorkloadCalculationTest extends TestCase
{
    public function test_calculate_teacher_workload_combines_regular_and_additional_duties()
    {
        $school = School::create(['name' => 'SMA Test', 'npsn' => '12345678']);
        $year = AcademicYear::create([
            'school_id' => $school->id,
            'name' => '2024/2025',
            'start_date' => '2024-07-01',
            'end_date' => '2025-06-30',
        ]);
        $semester = Semester::create([
            'academic_year_id' => $year->id,
            'semester_type' => 'Genap',
            'name' => 'Genap 2024/2025',
            'start_date' => '2025-01-01',
            'end_date' => '2025-06-30',
            'is_active' => true,
        ]);

        RegulatoryRule::create([
            'school_id' => $school->id,
            'rule_category' => 'JTM',
            'rule_name' => 'MIN_JTM_CERTIFICATION',
            'rule_value' => '24',
            'is_active' => true,
        ]);

        $teacher = Teacher::create([
            'school_id' => $school->id,
            'name' => 'Dra. Hj. Ratna',
            'gender' => 'P',
            'employment_status' => 'PNS',
            'is_certified' => true,
        ]);

        $subject = Subject::create([
            'school_id' => $school->id,
            'subject_code' => 'SEJ',
            'name' => 'Sejarah',
            'standard_jtm' => 2,
        ]);

        $classroom = Classroom::create([
            'school_id' => $school->id,
            'academic_year_id' => $year->id,
            'grade_level' => 10,
            'phase' => 'Fase E',
            'name' => 'X-A',
        ]);

        // 18 Jam Mengajar Reguler
        WorkloadAssignment::create([
            'semester_id' => $semester->id,
            'teacher_id' => $teacher->id,
            'subject_id' => $subject->id,
            'classroom_id' => $classroom->id,
            'weekly_jtm' => 18,
            'is_linear' => true,
        ]);

        $service = new WorkloadCalculationService();
        $workloadBeforeDuty = $service->calculateTeacherWorkload($teacher, $semester);

        // Sebelum tugas tambahan: Total 18 JTM (< 24 JTM) -> Kurang JTM
        $this->assertEquals(18, $workloadBeforeDuty['total_jtm']);
        $this->assertEquals(6, $workloadBeforeDuty['deficit_jtm']);
        $this->assertEquals('Kurang JTM', $workloadBeforeDuty['status']);

        // Tambahkan Ekuivalensi Tugas Tambahan (6 JTM)
        AdditionalDuty::create([
            'teacher_id' => $teacher->id,
            'semester_id' => $semester->id,
            'duty_type' => 'Kepala Laboratorium IPS',
            'equivalency_jtm' => 6,
        ]);

        $workloadAfterDuty = $service->calculateTeacherWorkload($teacher, $semester);

        // Setelah tugas tambahan: Total 24 JTM -> Warning JTM (karena jam reguler 18 < 24)
        $this->assertEquals(24, $workloadAfterDuty['total_jtm']);
        $this->assertEquals(0, $workloadAfterDuty['deficit_jtm']);
        $this->assertEquals('Warning JTM', $workloadAfterDuty['status']);
    }

    public function test_simulate_workload_does_not_mutate_actual_database()
    {
        $school = School::create(['name' => 'SMA Test', 'npsn' => '87654321']);
        $year = AcademicYear::create(['school_id' => $school->id, 'name' => '2024/2025', 'start_date' => '2024-07-01', 'end_date' => '2025-06-30']);
        $semester = Semester::create(['academic_year_id' => $year->id, 'semester_type' => 'Genap', 'name' => 'Genap', 'start_date' => '2025-01-01', 'end_date' => '2025-06-30', 'is_active' => true]);

        $teacher = Teacher::create([
            'school_id' => $school->id,
            'name' => 'Guru Simulasi',
            'gender' => 'L',
        ]);

        $service = new WorkloadCalculationService();
        $simulation = $service->simulateWorkloadChanges(
            $teacher,
            $semester,
            [['weekly_jtm' => 20]],
            [['equivalency_jtm' => 4]]
        );

        $this->assertTrue($simulation['is_simulation']);
        $this->assertEquals(24, $simulation['simulated_total_jtm']);
        $this->assertEquals(0, $simulation['deficit']);
        $this->assertEquals(0, WorkloadAssignment::count()); // Database remains unmutated
    }
}


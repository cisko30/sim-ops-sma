<?php

namespace App\Services\Curriculum;

use App\Models\Teacher;
use App\Models\Semester;
use App\Models\RegulatoryRule;
use App\Models\WorkloadAssignment;
use App\Models\AdditionalDuty;
use Illuminate\Support\Collection;

class WorkloadCalculationService
{
    /**
     * Menghitung rincian beban kerja (JTM) per guru pada semester aktif
     * Total JTM = Jam Mengajar Reguler + Ekuivalensi Tugas Tambahan.
     */
    public function calculateTeacherWorkload(Teacher $teacher, Semester $semester): array
    {
        // 1. Ambil batasan regulasi JTM minimal (default 24 jam)
        $minJtmRule = RegulatoryRule::where('school_id', $teacher->school_id)
            ->where('rule_category', 'JTM')
            ->where('rule_name', 'MIN_JTM_CERTIFICATION')
            ->where('is_active', true)
            ->value('rule_value') ?? 24;

        $minJtm = (int) $minJtmRule;

        // 2. Ambil penugasan jam reguler tatap muka
        $regularAssignments = WorkloadAssignment::with(['subject', 'classroom'])
            ->where('semester_id', $semester->id)
            ->where('teacher_id', $teacher->id)
            ->get();

        $regularJtm = $regularAssignments->sum('weekly_jtm');
        $linearJtm = $regularAssignments->where('is_linear', true)->sum('weekly_jtm');

        // 3. Ambil ekuivalensi tugas tambahan
        $additionalDuties = AdditionalDuty::where('semester_id', $semester->id)
            ->where('teacher_id', $teacher->id)
            ->get();

        $additionalJtm = $additionalDuties->sum('equivalency_jtm');

        // 4. Hitung Total JTM
        $totalJtm = $regularJtm + $additionalJtm;

        // 5. Evaluasi status pemenuhan
        $deficit = max(0, $minJtm - $totalJtm);
        $status = 'Memenuhi';
        if ($totalJtm < $minJtm) {
            $status = 'Kurang JTM';
        } elseif ($regularJtm < $minJtm && $totalJtm >= $minJtm) {
            $status = 'Warning JTM'; // Terpenuhi melalui tugas tambahan
        }

        return [
            'teacher_id' => $teacher->id,
            'teacher_name' => $teacher->full_name,
            'nuptk' => $teacher->nuptk,
            'is_certified' => $teacher->is_certified,
            'certification_code' => $teacher->certification_subject_code,
            'regular_jtm' => $regularJtm,
            'linear_jtm' => $linearJtm,
            'additional_jtm' => $additionalJtm,
            'total_jtm' => $totalJtm,
            'minimum_required_jtm' => $minJtm,
            'deficit_jtm' => $deficit,
            'status' => $status,
            'assignments' => $regularAssignments,
            'additional_duties' => $additionalDuties,
        ];
    }

    /**
     * Rekapitulasi pemenuhan JTM untuk seluruh guru di sekolah
     */
    public function calculateSchoolSummary(int $schoolId, Semester $semester): array
    {
        $teachers = Teacher::where('school_id', $schoolId)
            ->where('is_active', true)
            ->get();

        $results = [];
        $memenuhi = 0;
        $warning = 0;
        $kurang = 0;
        $criticalTeachers = [];

        foreach ($teachers as $teacher) {
            $workload = $this->calculateTeacherWorkload($teacher, $semester);
            $results[] = $workload;

            if ($workload['status'] === 'Memenuhi') {
                $memenuhi++;
            } elseif ($workload['status'] === 'Warning JTM') {
                $warning++;
            } else {
                $kurang++;
                $criticalTeachers[] = [
                    'id' => $teacher->id,
                    'name' => $teacher->full_name,
                    'total_jtm' => $workload['total_jtm'],
                    'deficit' => $workload['deficit_jtm'],
                ];
            }
        }

        $totalTeachers = count($teachers);

        return [
            'total_teachers' => $totalTeachers,
            'memenuhi_count' => $memenuhi,
            'memenuhi_pct' => $totalTeachers > 0 ? round(($memenuhi / $totalTeachers) * 100, 1) : 0,
            'warning_count' => $warning,
            'warning_pct' => $totalTeachers > 0 ? round(($warning / $totalTeachers) * 100, 1) : 0,
            'kurang_count' => $kurang,
            'kurang_pct' => $totalTeachers > 0 ? round(($kurang / $totalTeachers) * 100, 1) : 0,
            'critical_teachers' => $criticalTeachers,
            'details' => $results,
        ];
    }

    /**
     * Simulasi beban kerja tanpa merubah data final database
     */
    public function simulateWorkloadChanges(
        Teacher $teacher,
        Semester $semester,
        array $simulatedAssignments,
        array $simulatedDuties
    ): array {
        $minJtmRule = RegulatoryRule::where('school_id', $teacher->school_id)
            ->where('rule_category', 'JTM')
            ->where('rule_name', 'MIN_JTM_CERTIFICATION')
            ->where('is_active', true)
            ->value('rule_value') ?? 24;

        $minJtm = (int) $minJtmRule;

        $simRegularJtm = array_sum(array_column($simulatedAssignments, 'weekly_jtm'));
        $simDutyJtm = array_sum(array_column($simulatedDuties, 'equivalency_jtm'));
        $simTotalJtm = $simRegularJtm + $simDutyJtm;

        $deficit = max(0, $minJtm - $simTotalJtm);
        $status = $simTotalJtm >= $minJtm ? ($simRegularJtm >= $minJtm ? 'Memenuhi' : 'Warning JTM') : 'Kurang JTM';

        return [
            'is_simulation' => true,
            'teacher_id' => $teacher->id,
            'simulated_regular_jtm' => $simRegularJtm,
            'simulated_additional_jtm' => $simDutyJtm,
            'simulated_total_jtm' => $simTotalJtm,
            'status' => $status,
            'deficit' => $deficit,
        ];
    }
}


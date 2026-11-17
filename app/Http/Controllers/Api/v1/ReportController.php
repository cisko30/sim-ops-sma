<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\School;
use App\Models\Teacher;
use App\Models\Student;
use App\Models\PipRecord;
use App\Models\Document;
use App\Models\Semester;
use App\Services\Curriculum\WorkloadCalculationService;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function __construct(
        protected WorkloadCalculationService $workloadService
    ) {}

    public function executiveSummary(Request $request)
    {
        $schoolId = $request->user()->school_id ?? 1;
        $school = School::findOrFail($schoolId);
        $semester = Semester::where('is_active', true)->first();

        $gtkCount = Teacher::where('school_id', $schoolId)->where('is_active', true)->count();
        $studentCount = Student::where('school_id', $schoolId)->where('is_active', true)->count();
        $pipCount = PipRecord::where('school_id', $schoolId)->count();
        $pipTotal = PipRecord::where('school_id', $schoolId)->sum('nominal_amount');

        $jtmSummary = $semester ? $this->workloadService->calculateSchoolSummary($schoolId, $semester) : null;

        return response()->json([
            'school_name' => $school->name,
            'npsn' => $school->npsn,
            'accreditation' => 'A',
            'academic_period' => $semester?->name ?? '2024/2025 Semester Genap',
            'cut_off_dapodik' => '14 Hari 06 Jam Menuju Penutupan',
            'validation_completeness' => '88% Valid',
            'metrics' => [
                'total_gtk' => $gtkCount,
                'total_students' => $studentCount,
                'total_pip_recipients' => $pipCount,
                'total_pip_funds' => $pipTotal,
                'jtm_compliance_rate' => $jtmSummary['memenuhi_pct'] ?? 87.8,
            ],
            'generated_at' => now()->translatedFormat('d F Y H:i:s'),
            'signatory' => $school->principal_name,
        ]);
    }

    public function gtkReport(Request $request)
    {
        $schoolId = $request->user()->school_id ?? 1;
        $teachers = Teacher::where('school_id', $schoolId)
            ->with(['certificationRecords', 'workloadAssignments.subject'])
            ->get();

        return response()->json([
            'total_teachers' => $teachers->count(),
            'teachers' => $teachers,
        ]);
    }

    public function studentReport(Request $request)
    {
        $schoolId = $request->user()->school_id ?? 1;
        $students = Student::where('school_id', $schoolId)
            ->with('classroomStudents.classroom')
            ->get();

        return response()->json([
            'total_students' => $students->count(),
            'students' => $students,
        ]);
    }
}


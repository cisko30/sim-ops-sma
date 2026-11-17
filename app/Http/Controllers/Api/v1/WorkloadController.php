<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use App\Models\Semester;
use App\Services\Curriculum\WorkloadCalculationService;
use Illuminate\Http\Request;

class WorkloadController extends Controller
{
    public function __construct(
        protected WorkloadCalculationService $workloadService
    ) {}

    public function index(Request $request)
    {
        $schoolId = $request->user()->school_id ?? 1;
        $semesterId = $request->get('semester_id');

        $semester = $semesterId 
            ? Semester::findOrFail($semesterId) 
            : Semester::where('is_active', true)->firstOrFail();

        $summary = $this->workloadService->calculateSchoolSummary($schoolId, $semester);

        return response()->json($summary);
    }

    public function teacherWorkload(int $teacherId, Request $request)
    {
        $teacher = Teacher::findOrFail($teacherId);
        $semesterId = $request->get('semester_id');

        $semester = $semesterId 
            ? Semester::findOrFail($semesterId) 
            : Semester::where('is_active', true)->firstOrFail();

        $workload = $this->workloadService->calculateTeacherWorkload($teacher, $semester);

        return response()->json($workload);
    }

    public function simulate(Request $request)
    {
        $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'semester_id' => 'required|exists:semesters,id',
            'assignments' => 'required|array',
            'assignments.*.weekly_jtm' => 'required|integer|min:1',
            'additional_duties' => 'nullable|array',
            'additional_duties.*.equivalency_jtm' => 'required|integer|min:1',
        ]);

        $teacher = Teacher::findOrFail($request->teacher_id);
        $semester = Semester::findOrFail($request->semester_id);

        $result = $this->workloadService->simulateWorkloadChanges(
            $teacher,
            $semester,
            $request->assignments,
            $request->additional_duties ?? []
        );

        return response()->json($result);
    }
}


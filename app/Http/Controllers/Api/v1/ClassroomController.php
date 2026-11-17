<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\ClassroomStudent;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ClassroomController extends Controller
{
    public function index(Request $request)
    {
        $schoolId = $request->user()->school_id ?? 1;

        $query = Classroom::with(['homeroomTeacher', 'academicYear'])
            ->withCount('students')
            ->where('school_id', $schoolId);

        if ($request->has('grade_level')) {
            $query->where('grade_level', $request->grade_level);
        }

        if ($request->has('phase')) {
            $query->where('phase', $request->phase);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'academic_year_id' => 'required|exists:academic_years,id',
            'grade_level' => 'required|integer|in:10,11,12',
            'name' => 'required|string|max:50',
            'specialization' => 'nullable|string|max:50',
            'homeroom_teacher_id' => 'nullable|exists:teachers,id',
            'student_capacity' => 'nullable|integer|min:20|max:40',
        ]);

        // Auto-assign Phase based on grade
        $validated['phase'] = ($validated['grade_level'] == 10) ? 'Fase E' : 'Fase F';
        $validated['school_id'] = $request->user()->school_id ?? 1;

        $classroom = Classroom::create($validated);

        ActivityLog::log('CREATE', 'ROMBEL', Classroom::class, $classroom->id, null, $classroom->toArray());

        return response()->json([
            'message' => 'Rombongan belajar berhasil dibuat.',
            'classroom' => $classroom->load('homeroomTeacher'),
        ], 201);
    }

    public function show(int $id)
    {
        $classroom = Classroom::with(['homeroomTeacher', 'academicYear', 'students'])->findOrFail($id);

        return response()->json($classroom);
    }

    public function assignStudent(Request $request, int $classroomId)
    {
        $classroom = Classroom::findOrFail($classroomId);

        $request->validate([
            'student_id' => 'required|exists:students,id',
        ]);

        // Check double placement in same academic year
        $existing = ClassroomStudent::where('student_id', $request->student_id)
            ->where('academic_year_id', $classroom->academic_year_id)
            ->first();

        if ($existing) {
            throw ValidationException::withMessages([
                'student_id' => 'Siswa sudah ditempatkan di rombel lain pada tahun ajaran yang sama.'
            ]);
        }

        // Check capacity
        $currentCount = $classroom->students()->count();
        if ($currentCount >= $classroom->student_capacity) {
            throw ValidationException::withMessages([
                'classroom' => "Rombel telah mencapai batas kapasitas maksimum ({$classroom->student_capacity} siswa)."
            ]);
        }

        ClassroomStudent::create([
            'classroom_id' => $classroomId,
            'student_id' => $request->student_id,
            'academic_year_id' => $classroom->academic_year_id,
            'assigned_at' => now(),
        ]);

        ActivityLog::log('ASSIGN', 'ROMBEL', Classroom::class, $classroomId, null, ['student_id' => $request->student_id]);

        return response()->json([
            'message' => 'Siswa berhasil ditempatkan ke dalam rombel.',
        ]);
    }
}


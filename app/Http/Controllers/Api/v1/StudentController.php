<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $schoolId = $request->user()->school_id ?? 1;

        $query = Student::with(['classroomStudents.classroom', 'pipRecords'])
            ->where('school_id', $schoolId);

        if ($request->has('gender')) {
            $query->where('gender', $request->gender);
        }

        if ($request->has('kip_status')) {
            $query->where('kip_status', filter_var($request->kip_status, FILTER_VALIDATE_BOOLEAN));
        }

        if ($request->has('classroom_id')) {
            $classId = $request->classroom_id;
            $query->whereHas('classroomStudents', function ($q) use ($classId) {
                $q->where('classroom_id', $classId);
            });
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('nisn', 'like', "%{$search}%")
                    ->orWhere('nik', 'like', "%{$search}%");
            });
        }

        return response()->json($query->paginate(25));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'gender' => 'required|in:L,P',
            'nisn' => 'nullable|string|max:20', // Nullable per requirement
            'nik' => 'nullable|string|max:20',  // Nullable per requirement
            'no_kk' => 'nullable|string|max:20',
            'birth_place' => 'nullable|string|max:100',
            'birth_date' => 'nullable|date',
            'religion' => 'nullable|string|max:30',
            'address' => 'nullable|string',
            'parent_name' => 'nullable|string|max:255',
            'parent_phone' => 'nullable|string|max:30',
            'kip_status' => 'boolean',
            'kip_number' => 'nullable|string|max:50',
            'pkh_status' => 'boolean',
        ]);

        $validated['school_id'] = $request->user()->school_id ?? 1;
        $student = Student::create($validated);

        ActivityLog::log('CREATE', 'SISWA', Student::class, $student->id, null, $student->toArray());

        return response()->json([
            'message' => 'Data peserta didik berhasil ditambahkan.',
            'student' => $student,
        ], 201);
    }

    public function show(int $id)
    {
        $student = Student::with(['classroomStudents.classroom', 'pipRecords', 'documents.documentType'])->findOrFail($id);

        return response()->json($student);
    }

    public function update(Request $request, int $id)
    {
        $student = Student::findOrFail($id);
        $old = $student->toArray();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'gender' => 'sometimes|in:L,P',
            'nisn' => 'nullable|string|max:20',
            'nik' => 'nullable|string|max:20',
            'no_kk' => 'nullable|string|max:20',
            'birth_place' => 'nullable|string|max:100',
            'birth_date' => 'nullable|date',
            'religion' => 'nullable|string|max:30',
            'address' => 'nullable|string',
            'parent_name' => 'nullable|string|max:255',
            'parent_phone' => 'nullable|string|max:30',
            'kip_status' => 'boolean',
            'kip_number' => 'nullable|string|max:50',
            'pkh_status' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $student->update($validated);

        ActivityLog::log('UPDATE', 'SISWA', Student::class, $student->id, $old, $student->toArray());

        return response()->json([
            'message' => 'Data peserta didik berhasil diperbarui.',
            'student' => $student,
        ]);
    }

    public function destroy(int $id)
    {
        $student = Student::findOrFail($id);
        $old = $student->toArray();
        $student->delete();

        ActivityLog::log('DELETE', 'SISWA', Student::class, $id, $old, null);

        return response()->json([
            'message' => 'Data peserta didik berhasil dihapus.',
        ]);
    }
}


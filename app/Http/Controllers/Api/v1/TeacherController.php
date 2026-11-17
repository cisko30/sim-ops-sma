<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class TeacherController extends Controller
{
    public function index(Request $request)
    {
        $schoolId = $request->user()->school_id ?? 1;

        $query = Teacher::with(['certificationRecords', 'workloadAssignments.subject', 'additionalDuties'])
            ->where('school_id', $schoolId);

        if ($request->has('employment_status')) {
            $query->where('employment_status', $request->employment_status);
        }

        if ($request->has('is_certified')) {
            $query->where('is_certified', filter_var($request->is_certified, FILTER_VALIDATE_BOOLEAN));
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('nuptk', 'like', "%{$search}%")
                    ->orWhere('nip', 'like', "%{$search}%");
            });
        }

        return response()->json($query->paginate(20));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'title_front' => 'nullable|string|max:20',
            'title_back' => 'nullable|string|max:20',
            'gender' => 'required|in:L,P',
            'employment_status' => 'required|in:PNS,PPPK,GTT,Honorer,GTY',
            'nuptk' => 'nullable|string|max:25',
            'nip' => 'nullable|string|max:30',
            'nik' => 'nullable|string|max:20',
            'education' => 'nullable|string|max:50',
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:30',
            'is_certified' => 'boolean',
            'nrg' => 'nullable|string|max:30',
            'certification_subject_code' => 'nullable|string|max:30',
        ]);

        $validated['school_id'] = $request->user()->school_id ?? 1;
        $teacher = Teacher::create($validated);

        ActivityLog::log('CREATE', 'GTK', Teacher::class, $teacher->id, null, $teacher->toArray());

        return response()->json([
            'message' => 'Data GTK berhasil ditambahkan.',
            'teacher' => $teacher,
        ], 201);
    }

    public function show(int $id)
    {
        $teacher = Teacher::with(['certificationRecords', 'workloadAssignments.subject', 'workloadAssignments.classroom', 'additionalDuties'])
            ->findOrFail($id);

        return response()->json($teacher);
    }

    public function update(Request $request, int $id)
    {
        $teacher = Teacher::findOrFail($id);
        $old = $teacher->toArray();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'title_front' => 'nullable|string|max:20',
            'title_back' => 'nullable|string|max:20',
            'gender' => 'sometimes|in:L,P',
            'employment_status' => 'sometimes|in:PNS,PPPK,GTT,Honorer,GTY',
            'nuptk' => 'nullable|string|max:25',
            'nip' => 'nullable|string|max:30',
            'nik' => 'nullable|string|max:20',
            'education' => 'nullable|string|max:50',
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:30',
            'is_certified' => 'boolean',
            'nrg' => 'nullable|string|max:30',
            'certification_subject_code' => 'nullable|string|max:30',
            'is_active' => 'boolean',
        ]);

        $teacher->update($validated);

        ActivityLog::log('UPDATE', 'GTK', Teacher::class, $teacher->id, $old, $teacher->toArray());

        return response()->json([
            'message' => 'Data GTK berhasil diperbarui.',
            'teacher' => $teacher,
        ]);
    }

    public function destroy(int $id)
    {
        $teacher = Teacher::findOrFail($id);
        $old = $teacher->toArray();
        $teacher->delete();

        ActivityLog::log('DELETE', 'GTK', Teacher::class, $id, $old, null);

        return response()->json([
            'message' => 'Data GTK berhasil dihapus.',
        ]);
    }
}


<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\PipRecord;
use App\Models\PipStatusHistory;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class PipController extends Controller
{
    public function index(Request $request)
    {
        $schoolId = $request->user()->school_id ?? 1;

        $query = PipRecord::with(['student.classroomStudents.classroom'])
            ->where('school_id', $schoolId);

        if ($request->has('activation_status')) {
            $query->where('activation_status', $request->activation_status);
        }

        if ($request->has('disbursement_status')) {
            $query->where('disbursement_status', $request->disbursement_status);
        }

        if ($request->has('fiscal_year')) {
            $query->where('fiscal_year', $request->fiscal_year);
        }

        $records = $query->paginate(20);

        // Mask encrypted account number for non-privileged users
        $records->getCollection()->transform(function ($rec) use ($request) {
            if (!$request->user()->hasRole('SUPER ADMIN / OPS')) {
                $rec->account_number_encrypted = '••••••••' . substr((string)$rec->account_number_encrypted, -4);
            }
            return $rec;
        });

        return response()->json($records);
    }

    public function updateStatus(Request $request, int $id)
    {
        $pip = PipRecord::findOrFail($id);

        $validated = $request->validate([
            'status_field' => 'required|in:activation_status,disbursement_status,sk_type',
            'new_status' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $field = $validated['status_field'];
        $oldStatus = $pip->{$field};
        $newStatus = $validated['new_status'];

        $pip->update([$field => $newStatus]);

        PipStatusHistory::create([
            'pip_record_id' => $pip->id,
            'status_field' => $field,
            'old_status' => $oldStatus,
            'new_status' => $newStatus,
            'changed_by' => $request->user()->id,
            'notes' => $validated['notes'] ?? null,
            'changed_at' => now(),
        ]);

        ActivityLog::log('UPDATE_STATUS', 'PIP', PipRecord::class, $pip->id, [
            $field => $oldStatus,
        ], [
            $field => $newStatus,
            'notes' => $validated['notes'] ?? null,
        ]);

        return response()->json([
            'message' => 'Status PIP berhasil diperbarui.',
            'pip' => $pip->fresh(),
        ]);
    }

    public function history(int $id)
    {
        $pip = PipRecord::findOrFail($id);
        $histories = $pip->histories()->with('changer:id,name')->get();

        return response()->json($histories);
    }

    public function generateSptjmReport(Request $request)
    {
        $schoolId = $request->user()->school_id ?? 1;
        $pipStudents = PipRecord::with(['student.classroomStudents.classroom'])
            ->where('school_id', $schoolId)
            ->where('fiscal_year', $request->get('fiscal_year', 2025))
            ->get();

        return response()->json([
            'bank_partner' => 'Bank Negara Indonesia (BNI) Cabang Kota',
            'sptjm_number' => '421.3/SPTJM-PIP/SMA-CB/2025',
            'total_students' => $pipStudents->count(),
            'total_nominal' => $pipStudents->sum('nominal_amount'),
            'students' => $pipStudents,
            'generated_at' => now()->toIso8601String(),
        ]);
    }
}


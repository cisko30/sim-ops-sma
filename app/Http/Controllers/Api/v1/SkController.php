<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\SkDocument;
use App\Models\SkApproval;
use App\Models\ActivityLog;
use App\Services\DocumentGenerator\DocumentGenerationService;
use Illuminate\Http\Request;

class SkController extends Controller
{
    public function __construct(
        protected DocumentGenerationService $docService
    ) {}

    public function index(Request $request)
    {
        $schoolId = $request->user()->school_id ?? 1;

        $documents = SkDocument::with(['academicYear', 'semester', 'creator', 'approver'])
            ->where('school_id', $schoolId)
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($documents);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'academic_year_id' => 'required|exists:academic_years,id',
            'semester_id' => 'required|exists:semesters,id',
            'sk_number' => 'required|string|max:100',
            'title' => 'required|string|max:255',
            'document_date' => 'required|date',
        ]);

        $sk = $this->docService->generateTeachingAssignmentSK(
            $request->user()->school_id ?? 1,
            $validated['academic_year_id'],
            $validated['semester_id'],
            $validated['sk_number'],
            $validated['title'],
            $validated['document_date'],
            $request->user()->id
        );

        ActivityLog::log('CREATE', 'SK', SkDocument::class, $sk->id, null, ['sk_number' => $sk->sk_number]);

        return response()->json([
            'message' => 'Draft SK Pembagian Beban Mengajar dan snapshot data berhasil dibuat.',
            'sk' => $sk,
        ], 201);
    }

    public function show(int $id)
    {
        $sk = SkDocument::with(['academicYear', 'semester', 'creator', 'approver', 'approvals.reviewer'])
            ->findOrFail($id);

        return response()->json($sk);
    }

    public function submit(Request $request, int $id)
    {
        $sk = SkDocument::findOrFail($id);
        $sk->update(['status' => 'Review Kurikulum']);

        SkApproval::create([
            'sk_document_id' => $sk->id,
            'reviewer_id' => $request->user()->id,
            'action' => 'Submit',
            'notes' => 'Diajukan untuk review Waka Kurikulum.',
            'acted_at' => now(),
        ]);

        ActivityLog::log('SUBMIT', 'SK', SkDocument::class, $sk->id);

        return response()->json([
            'message' => 'SK berhasil diajukan ke Waka Kurikulum.',
            'sk' => $sk,
        ]);
    }

    public function approve(Request $request, int $id)
    {
        $sk = SkDocument::findOrFail($id);
        $user = $request->user();

        if ($user->hasRole('WAKA KURIKULUM')) {
            $sk->update(['status' => 'Persetujuan Kepala Sekolah']);
            $action = 'Recommend';
            $msg = 'SK disetujui Waka Kurikulum dan diteruskan ke Kepala Sekolah.';
        } else {
            $sk->update([
                'status' => 'Final',
                'approved_by' => $user->id,
                'approved_at' => now(),
            ]);
            $action = 'Approve';
            $msg = 'SK telah disahkan dan difinalisasi oleh Kepala Sekolah.';
        }

        SkApproval::create([
            'sk_document_id' => $sk->id,
            'reviewer_id' => $user->id,
            'action' => $action,
            'notes' => $request->notes ?? $msg,
            'acted_at' => now(),
        ]);

        ActivityLog::log($action, 'SK', SkDocument::class, $sk->id);

        return response()->json([
            'message' => $msg,
            'sk' => $sk,
        ]);
    }

    public function verifyQr(string $token)
    {
        $result = $this->docService->verifyDocumentByToken($token);

        return response()->json($result);
    }
}


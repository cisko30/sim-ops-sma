<?php

namespace App\Services\DocumentGenerator;

use App\Models\SkDocument;
use App\Models\DocumentTemplate;
use App\Models\Teacher;
use App\Models\School;
use App\Models\Semester;
use App\Models\WorkloadAssignment;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class DocumentGenerationService
{
    /**
     * Membuat draft SK Pembagian Beban Mengajar dan snapshot data
     */
    public function generateTeachingAssignmentSK(
        int $schoolId,
        int $academicYearId,
        int $semesterId,
        string $skNumber,
        string $title,
        string $documentDate,
        int $createdByUserId
    ): SkDocument {
        $school = School::findOrFail($schoolId);
        $semester = Semester::with('academicYear')->findOrFail($semesterId);

        // 1. Ambil data penugasan untuk snapshot historis
        $teachers = Teacher::where('school_id', $schoolId)
            ->where('is_active', true)
            ->with(['workloadAssignments' => function ($q) use ($semesterId) {
                $q->where('semester_id', $semesterId)->with(['subject', 'classroom']);
            }, 'additionalDuties' => function ($q) use ($semesterId) {
                $q->where('semester_id', $semesterId);
            }])
            ->get();

        $snapshotTeachers = $teachers->map(function ($t) {
            $regJtm = $t->workloadAssignments->sum('weekly_jtm');
            $dutyJtm = $t->additionalDuties->sum('equivalency_jtm');
            return [
                'teacher_id' => $t->id,
                'name' => $t->full_name,
                'nip' => $t->nip ?? '-',
                'nuptk' => $t->nuptk ?? '-',
                'employment_status' => $t->employment_status,
                'regular_jtm' => $regJtm,
                'additional_jtm' => $dutyJtm,
                'total_jtm' => $regJtm + $dutyJtm,
                'assignments' => $t->workloadAssignments->map(fn($a) => [
                    'subject' => $a->subject->name ?? '',
                    'classroom' => $a->classroom->name ?? '',
                    'jtm' => $a->weekly_jtm,
                ]),
                'additional_duties' => $t->additionalDuties->map(fn($d) => [
                    'duty' => $d->duty_type,
                    'jtm' => $d->equivalency_jtm,
                ]),
            ];
        });

        // 2. Buat snapshot JSON lengkap
        $snapshot = [
            'school_name' => $school->name,
            'npsn' => $school->npsn,
            'principal_name' => $school->principal_name,
            'principal_nip' => $school->principal_nip,
            'academic_year' => $semester->academicYear->name,
            'semester' => $semester->name,
            'document_date' => $documentDate,
            'generated_at' => now()->toIso8601String(),
            'teacher_count' => $teachers->count(),
            'teachers' => $snapshotTeachers,
        ];

        // 3. Generate QR Verification Token
        $qrToken = Str::random(40);

        // 4. Buat record SK
        $sk = SkDocument::create([
            'school_id' => $schoolId,
            'academic_year_id' => $academicYearId,
            'semester_id' => $semesterId,
            'sk_number' => $skNumber,
            'title' => $title,
            'document_date' => $documentDate,
            'document_snapshot_json' => $snapshot,
            'qr_verification_token' => $qrToken,
            'status' => 'Draft',
            'created_by' => $createdByUserId,
            'generated_docx_path' => "private/documents/sk/sk_{$skNumber}_draft.docx",
            'generated_pdf_path' => "private/documents/sk/sk_{$skNumber}_draft.pdf",
        ]);

        return $sk;
    }

    /**
     * Memvalidasi keabsahan dokumen melalui QR Code tanpa membocorkan data pribadi secara publik
     */
    public function verifyDocumentByToken(string $token): array
    {
        $sk = SkDocument::with(['school', 'semester.academicYear'])
            ->where('qr_verification_token', $token)
            ->first();

        if (!$sk) {
            return [
                'is_valid' => false,
                'message' => 'Dokumen tidak ditemukan atau tanda tangan digital tidak valid.',
            ];
        }

        return [
            'is_valid' => true,
            'document_title' => $sk->title,
            'sk_number' => $sk->sk_number,
            'school_name' => $sk->school->name,
            'npsn' => $sk->school->npsn,
            'issued_date' => $sk->document_date->translatedFormat('d F Y'),
            'status' => $sk->status,
            'signatory' => $sk->school->principal_name,
            'verification_timestamp' => now()->toIso8601String(),
        ];
    }
}


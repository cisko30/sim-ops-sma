<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\School;
use App\Models\AcademicYear;
use App\Models\Semester;
use App\Models\Teacher;
use App\Models\User;
use App\Services\DocumentGenerator\DocumentGenerationService;

class SkGenerationTest extends TestCase
{
    public function test_sk_generation_preserves_immutable_data_snapshot()
    {
        $school = School::create([
            'name' => 'SMA Cipta Bangsa Mandiri',
            'npsn' => '20108920',
            'principal_name' => 'Dr. H. Ahmad Fauzi, M.Pd.',
        ]);

        $user = User::create(['school_id' => $school->id, 'name' => 'Bagas Pratama', 'email' => 'ops@test.com', 'password' => 'secret']);
        $year = AcademicYear::create(['school_id' => $school->id, 'name' => '2024/2025', 'start_date' => '2024-07-01', 'end_date' => '2025-06-30']);
        $semester = Semester::create(['academic_year_id' => $year->id, 'semester_type' => 'Genap', 'name' => 'Genap', 'start_date' => '2025-01-01', 'end_date' => '2025-06-30', 'is_active' => true]);

        Teacher::create([
            'school_id' => $school->id,
            'name' => 'Dra. Hj. Ratna',
            'gender' => 'P',
            'employment_status' => 'PNS',
        ]);

        $service = new DocumentGenerationService();
        $sk = $service->generateTeachingAssignmentSK(
            $school->id,
            $year->id,
            $semester->id,
            '421.3/084/SMA-CB/2025',
            'SK Pembagian Beban Tugas Mengajar Semester Genap',
            '2025-01-06',
            $user->id
        );

        $this->assertNotNull($sk->document_snapshot_json);
        $this->assertEquals('SMA Cipta Bangsa Mandiri', $sk->document_snapshot_json['school_name']);
        $this->assertEquals('421.3/084/SMA-CB/2025', $sk->sk_number);
        $this->assertNotEmpty($sk->qr_verification_token);

        // Test QR Verification public endpoint
        $verification = $service->verifyDocumentByToken($sk->qr_verification_token);
        $this->assertTrue($verification['is_valid']);
        $this->assertEquals('421.3/084/SMA-CB/2025', $verification['sk_number']);
        $this->assertEquals('SMA Cipta Bangsa Mandiri', $verification['school_name']);
    }
}


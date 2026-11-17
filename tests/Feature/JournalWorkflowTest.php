<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\School;
use App\Models\DailyJournal;
use App\Models\JournalActivity;
use App\Services\Journal\JournalService;
use Illuminate\Validation\ValidationException;

class JournalWorkflowTest extends TestCase
{
    public function test_journal_duration_is_calculated_automatically()
    {
        $school = School::create(['name' => 'SMA Test', 'npsn' => '11223344']);
        $user = User::create(['school_id' => $school->id, 'name' => 'Operator OPS', 'email' => 'ops@test.com', 'password' => 'secret']);

        $service = new JournalService();
        $journal = $service->getOrCreateDailyJournal($user->id, '2025-02-14', $school->id);

        $activity = $service->addActivity($journal, [
            'category' => 'Dapodik',
            'activity_title' => 'Verval NIK Siswa',
            'description' => 'Mengecek validitas NIK ke Dukcapil',
            'start_time' => '08:00',
            'end_time' => '09:30',
        ]);

        $this->assertEquals(90, $activity->duration_minutes);
        $this->assertEquals(90, $journal->fresh()->total_duration_minutes);
    }

    public function test_journal_detects_time_conflicts()
    {
        $this->expectException(ValidationException::class);

        $school = School::create(['name' => 'SMA Test', 'npsn' => '99887766']);
        $user = User::create(['school_id' => $school->id, 'name' => 'Operator OPS', 'email' => 'ops2@test.com', 'password' => 'secret']);

        $service = new JournalService();
        $journal = $service->getOrCreateDailyJournal($user->id, '2025-02-14', $school->id);

        // First activity: 08:00 to 10:00
        $service->addActivity($journal, [
            'category' => 'Dapodik',
            'activity_title' => 'Tugas 1',
            'description' => 'Aktivitas pertama',
            'start_time' => '08:00',
            'end_time' => '10:00',
        ]);

        // Second overlapping activity: 09:00 to 11:00 -> Must throw ValidationException
        $service->addActivity($journal, [
            'category' => 'PIP',
            'activity_title' => 'Tugas 2',
            'description' => 'Aktivitas bentrok',
            'start_time' => '09:00',
            'end_time' => '11:00',
        ]);
    }

    public function test_submitted_journal_is_locked_from_modifications()
    {
        $school = School::create(['name' => 'SMA Test', 'npsn' => '55443322']);
        $user = User::create(['school_id' => $school->id, 'name' => 'Operator OPS', 'email' => 'ops3@test.com', 'password' => 'secret']);

        $service = new JournalService();
        $journal = $service->getOrCreateDailyJournal($user->id, '2025-02-14', $school->id);

        $service->addActivity($journal, [
            'category' => 'Dapodik',
            'activity_title' => 'Tugas Valid',
            'description' => 'Uraian pekerjaan',
            'start_time' => '08:00',
            'end_time' => '09:00',
        ]);

        $service->submitJournal($journal);
        $this->assertEquals('Submitted', $journal->fresh()->status);
        $this->assertTrue($journal->fresh()->isLocked());

        // Attempting to add activity after submit must fail
        $this->expectException(ValidationException::class);
        $service->addActivity($journal, [
            'category' => 'Lainnya',
            'activity_title' => 'Tugas Tambahan Terlarang',
            'description' => 'Tidak boleh masuk karena sudah submit',
        ]);
    }
}


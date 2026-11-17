<?php

namespace App\Services\Journal;

use App\Models\DailyJournal;
use App\Models\JournalActivity;
use App\Models\JournalReview;
use App\Models\JournalRevision;
use App\Models\ActivityLog;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Collection;

class JournalService
{
    /**
     * Membuat atau mengambil header jurnal harian pengguna
     */
    public function getOrCreateDailyJournal(int $userId, ?string $date = null, int $schoolId = 1): DailyJournal
    {
        $journalDate = $date ? Carbon::parse($date)->format('Y-m-d') : Carbon::now('Asia/Jakarta')->format('Y-m-d');

        return DailyJournal::firstOrCreate(
            [
                'user_id' => $userId,
                'journal_date' => $journalDate,
            ],
            [
                'school_id' => $schoolId,
                'unit_name' => 'Unit Tata Usaha & Operasional Sekolah',
                'status' => 'Draft',
                'total_duration_minutes' => 0,
            ]
        );
    }

    /**
     * Menambahkan aktivitas baru ke dalam jurnal
     */
    public function addActivity(DailyJournal $journal, array $data): JournalActivity
    {
        if ($journal->isLocked()) {
            throw ValidationException::withMessages([
                'journal' => 'Jurnal telah dikunci (status: ' . $journal->status . '). Tidak dapat menambah aktivitas.'
            ]);
        }

        $durationMinutes = 0;
        $startTime = $data['start_time'] ?? null;
        $endTime = $data['end_time'] ?? null;

        if ($startTime && $endTime) {
            $start = Carbon::parse($startTime);
            $end = Carbon::parse($endTime);

            if ($end->lessThanOrEqualTo($start)) {
                throw ValidationException::withMessages([
                    'end_time' => 'Waktu selesai harus lebih besar dari waktu mulai.'
                ]);
            }

            // Validasi bentrok waktu dengan aktivitas yang sudah ada pada tanggal yang sama
            $this->validateTimeConflict($journal->id, $startTime, $endTime);

            $durationMinutes = $start->diffInMinutes($end);
        }

        $activity = JournalActivity::create([
            'daily_journal_id' => $journal->id,
            'category' => $data['category'],
            'activity_title' => $data['activity_title'],
            'description' => $data['description'],
            'start_time' => $startTime,
            'end_time' => $endTime,
            'duration_minutes' => $durationMinutes,
            'result' => $data['result'] ?? null,
            'obstacle' => $data['obstacle'] ?? null,
            'follow_up' => $data['follow_up'] ?? null,
            'follow_up_date' => $data['follow_up_date'] ?? null,
            'priority' => $data['priority'] ?? 'Normal',
            'status' => $data['status'] ?? 'Completed',
            'related_module' => $data['related_module'] ?? null,
            'sort_order' => $journal->activities()->count() + 1,
        ]);

        $journal->recalculateDuration();

        ActivityLog::log('CREATE', 'JURNAL', JournalActivity::class, $activity->id, null, $activity->toArray());

        return $activity;
    }

    /**
     * Memperbarui aktivitas jurnal
     */
    public function updateActivity(JournalActivity $activity, array $data): JournalActivity
    {
        $journal = $activity->dailyJournal;

        if ($journal->isLocked()) {
            throw ValidationException::withMessages([
                'journal' => 'Jurnal telah dikunci. Tidak dapat mengubah aktivitas.'
            ]);
        }

        $startTime = $data['start_time'] ?? $activity->start_time;
        $endTime = $data['end_time'] ?? $activity->end_time;
        $durationMinutes = 0;

        if ($startTime && $endTime) {
            $start = Carbon::parse($startTime);
            $end = Carbon::parse($endTime);

            if ($end->lessThanOrEqualTo($start)) {
                throw ValidationException::withMessages([
                    'end_time' => 'Waktu selesai harus lebih besar dari waktu mulai.'
                ]);
            }

            // Validasi bentrok waktu (kecuali aktivitas saat ini)
            $this->validateTimeConflict($journal->id, $startTime, $endTime, $activity->id);
            $durationMinutes = $start->diffInMinutes($end);
        }

        $oldValues = $activity->toArray();

        $activity->update(array_merge($data, [
            'duration_minutes' => $durationMinutes,
        ]));

        $journal->recalculateDuration();

        ActivityLog::log('UPDATE', 'JURNAL', JournalActivity::class, $activity->id, $oldValues, $activity->toArray());

        return $activity;
    }

    /**
     * Menghapus aktivitas
     */
    public function deleteActivity(JournalActivity $activity): void
    {
        $journal = $activity->dailyJournal;

        if ($journal->isLocked()) {
            throw ValidationException::withMessages([
                'journal' => 'Jurnal telah dikunci. Tidak dapat menghapus aktivitas.'
            ]);
        }

        $oldValues = $activity->toArray();
        $activity->delete();
        $journal->recalculateDuration();

        ActivityLog::log('DELETE', 'JURNAL', JournalActivity::class, $activity->id, $oldValues, null);
    }

    /**
     * Mengajukan jurnal untuk direview kepala sekolah
     */
    public function submitJournal(DailyJournal $journal): DailyJournal
    {
        if ($journal->activities()->count() === 0) {
            throw ValidationException::withMessages([
                'activities' => 'Jurnal tidak dapat diajukan karena belum memiliki aktivitas.'
            ]);
        }

        $journal->update([
            'status' => 'Submitted',
            'submitted_at' => now(),
        ]);

        ActivityLog::log('SUBMIT', 'JURNAL', DailyJournal::class, $journal->id, null, ['status' => 'Submitted']);

        return $journal;
    }

    /**
     * Review jurnal oleh Kepala Sekolah / Reviewer
     */
    public function reviewJournal(DailyJournal $journal, int $reviewerId, string $action, ?string $comments = null): DailyJournal
    {
        $newStatus = ($action === 'Approve') ? 'Approved' : 'Revision Requested';

        $journal->update([
            'status' => $newStatus,
            'reviewer_id' => $reviewerId,
            'reviewed_at' => now(),
            'review_notes' => $comments,
        ]);

        JournalReview::create([
            'daily_journal_id' => $journal->id,
            'reviewer_id' => $reviewerId,
            'action' => $action === 'Approve' ? 'Approved' : 'Revision Requested',
            'comments' => $comments,
            'reviewed_at' => now(),
        ]);

        ActivityLog::log($action === 'Approve' ? 'APPROVE' : 'REJECT', 'JURNAL', DailyJournal::class, $journal->id, null, [
            'status' => $newStatus,
            'comments' => $comments,
        ]);

        return $journal;
    }

    /**
     * Validasi tidak adanya aktivitas yang bertabrakan waktu
     */
    public function validateTimeConflict(int $journalId, string $startTime, string $endTime, ?int $ignoreActivityId = null): void
    {
        $query = JournalActivity::where('daily_journal_id', $journalId)
            ->whereNotNull('start_time')
            ->whereNotNull('end_time');

        if ($ignoreActivityId) {
            $query->where('id', '!=', $ignoreActivityId);
        }

        $conflicts = $query->where(function ($q) use ($startTime, $endTime) {
            $q->whereBetween('start_time', [$startTime, $endTime])
                ->orWhereBetween('end_time', [$startTime, $endTime])
                ->orWhere(function ($sub) use ($startTime, $endTime) {
                    $sub->where('start_time', '<=', $startTime)
                        ->where('end_time', '>=', $endTime);
                });
        })->exists();

        if ($conflicts) {
            throw ValidationException::withMessages([
                'time_conflict' => "Terdapat bentrok jadwal aktivitas pada rentang jam $startTime - $endTime."
            ]);
        }
    }

    /**
     * Reporting Engine: Laporan Jurnal Harian Resmi
     */
    public function generateDailyReport(DailyJournal $journal): array
    {
        $journal->load(['user', 'school', 'reviewer', 'activities.attachments']);

        $activities = $journal->activities;
        $totalActivities = $activities->count();
        $completedCount = $activities->where('status', 'Completed')->count();
        $pendingCount = $activities->whereIn('status', ['Planned', 'In Progress', 'Pending', 'Blocked'])->count();

        return [
            'header' => [
                'school_name' => $journal->school->name ?? 'SMA Cipta Bangsa Mandiri',
                'npsn' => $journal->school->npsn ?? '20108920',
                'address' => $journal->school->address ?? 'Jl. Pendidikan No. 45',
                'title' => 'LAPORAN JURNAL HARIAN OPERATOR SEKOLAH',
            ],
            'operator' => [
                'name' => $journal->user->name,
                'email' => $journal->user->email,
                'unit' => $journal->unit_name,
                'date' => $journal->journal_date->translatedFormat('l, d F Y'),
                'status' => $journal->status,
            ],
            'activities' => $activities->map(function ($act, $idx) {
                return [
                    'no' => $idx + 1,
                    'time' => $act->start_time && $act->end_time ? "{$act->start_time} - {$act->end_time}" : 'Fleksibel',
                    'duration' => $act->duration_minutes > 0 ? "{$act->duration_minutes} menit" : '-',
                    'category' => $act->category,
                    'title' => $act->activity_title,
                    'description' => $act->description,
                    'result' => $act->result ?? '-',
                    'obstacle' => $act->obstacle ?? '-',
                    'follow_up' => $act->follow_up ?? '-',
                    'status' => $act->status,
                ];
            }),
            'summary' => [
                'total_activities' => $totalActivities,
                'completed' => $completedCount,
                'pending' => $pendingCount,
                'total_duration' => "{$journal->total_duration_minutes} Menit (" . round($journal->total_duration_minutes / 60, 1) . " Jam)",
                'daily_summary' => $journal->daily_summary,
                'review_notes' => $journal->review_notes,
            ],
            'signatures' => [
                'operator' => $journal->user->name,
                'principal' => $journal->school->principal_name ?? 'Dr. H. Ahmad Fauzi, M.Pd.',
                'principal_nip' => $journal->school->principal_nip ?? '19750812 200003 1 002',
            ]
        ];
    }

    /**
     * Reporting Engine: Laporan Jurnal Mingguan
     */
    public function generateWeeklyReport(int $schoolId, ?int $userId, string $startDate, string $endDate): array
    {
        $query = DailyJournal::with(['user', 'activities'])
            ->where('school_id', $schoolId)
            ->whereBetween('journal_date', [$startDate, $endDate]);

        if ($userId) {
            $query->where('user_id', $userId);
        }

        $journals = $query->get();
        $activities = $journals->flatMap->activities;

        $categoryDistribution = $activities->groupBy('category')->map->count();
        $statusDistribution = $activities->groupBy('status')->map->count();

        return [
            'period' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
            'total_journals' => $journals->count(),
            'total_activities' => $activities->count(),
            'total_duration_minutes' => $journals->sum('total_duration_minutes'),
            'category_distribution' => $categoryDistribution,
            'completed_activities' => $activities->where('status', 'Completed')->count(),
            'pending_activities' => $activities->where('status', '!=', 'Completed')->count(),
            'dominant_obstacles' => $activities->pluck('obstacle')->filter()->unique()->values()->take(5),
            'follow_up_plans' => $activities->pluck('follow_up')->filter()->unique()->values()->take(5),
        ];
    }

    /**
     * Reporting Engine: Laporan Jurnal Bulanan
     */
    public function generateMonthlyReport(int $schoolId, ?int $userId, int $year, int $month): array
    {
        $startDate = Carbon::createFromDate($year, $month, 1)->startOfMonth()->format('Y-m-d');
        $endDate = Carbon::createFromDate($year, $month, 1)->endOfMonth()->format('Y-m-d');

        $query = DailyJournal::with(['user', 'activities'])
            ->where('school_id', $schoolId)
            ->whereBetween('journal_date', [$startDate, $endDate]);

        if ($userId) {
            $query->where('user_id', $userId);
        }

        $journals = $query->get();
        $activities = $journals->flatMap->activities;

        $totalDaysInMonth = Carbon::createFromDate($year, $month, 1)->daysInMonth;
        $daysWithJournal = $journals->unique('journal_date')->count();
        $daysWithoutJournal = $totalDaysInMonth - $daysWithJournal;

        return [
            'period' => [
                'year' => $year,
                'month' => $month,
                'month_name' => Carbon::createFromDate($year, $month, 1)->translatedFormat('F Y'),
            ],
            'total_days_in_month' => $totalDaysInMonth,
            'days_with_journal' => $daysWithJournal,
            'days_without_journal_note' => "{$daysWithoutJournal} hari belum tercatat jurnal (bukan absensi/tidak hadir)",
            'total_activities' => $activities->count(),
            'total_duration_minutes' => $journals->sum('total_duration_minutes'),
            'category_breakdown' => $activities->groupBy('category')->map->count(),
            'status_percentage' => [
                'completed' => $activities->count() > 0 ? round(($activities->where('status', 'Completed')->count() / $activities->count()) * 100, 1) : 0,
                'in_progress' => $activities->count() > 0 ? round(($activities->where('status', 'In Progress')->count() / $activities->count()) * 100, 1) : 0,
                'pending' => $activities->count() > 0 ? round(($activities->where('status', 'Pending')->count() / $activities->count()) * 100, 1) : 0,
            ],
            'unresolved_follow_ups' => $activities->where('status', '!=', 'Completed')->filter(fn($a) => !empty($a->follow_up))->values(),
        ];
    }
}


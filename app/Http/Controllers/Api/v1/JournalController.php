<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\DailyJournal;
use App\Models\JournalActivity;
use App\Services\Journal\JournalService;
use Illuminate\Http\Request;
use Carbon\Carbon;

class JournalController extends Controller
{
    public function __construct(
        protected JournalService $journalService
    ) {}

    public function index(Request $request)
    {
        $userId = $request->user()->id;
        $isReviewer = $request->user()->hasRole(['SUPER ADMIN / OPS', 'KEPALA SEKOLAH']);

        $query = DailyJournal::with(['user', 'activities'])
            ->where('school_id', $request->user()->school_id ?? 1);

        if (!$isReviewer) {
            $query->where('user_id', $userId);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('journal_date', [$request->start_date, $request->end_date]);
        }

        $journals = $query->orderBy('journal_date', 'desc')->paginate(15);

        return response()->json($journals);
    }

    public function store(Request $request)
    {
        $request->validate([
            'journal_date' => 'nullable|date',
            'daily_summary' => 'nullable|string',
        ]);

        $journal = $this->journalService->getOrCreateDailyJournal(
            $request->user()->id,
            $request->journal_date,
            $request->user()->school_id ?? 1
        );

        if ($request->filled('daily_summary')) {
            $journal->update(['daily_summary' => $request->daily_summary]);
        }

        return response()->json([
            'message' => 'Jurnal harian berhasil disiapkan.',
            'journal' => $journal->load('activities'),
        ], 201);
    }

    public function show(int $id)
    {
        $journal = DailyJournal::with(['user', 'reviewer', 'activities.attachments', 'reviews'])->findOrFail($id);

        return response()->json($journal);
    }

    public function addActivity(Request $request, int $journalId)
    {
        $journal = DailyJournal::findOrFail($journalId);

        $validated = $request->validate([
            'category' => 'required|string',
            'activity_title' => 'required|string|max:255',
            'description' => 'required|string',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i',
            'result' => 'nullable|string',
            'obstacle' => 'nullable|string',
            'follow_up' => 'nullable|string',
            'follow_up_date' => 'nullable|date',
            'priority' => 'nullable|in:Low,Normal,High,Urgent',
            'status' => 'nullable|in:Planned,In Progress,Completed,Pending,Blocked',
            'related_module' => 'nullable|string',
        ]);

        $activity = $this->journalService->addActivity($journal, $validated);

        return response()->json([
            'message' => 'Aktivitas berhasil ditambahkan ke jurnal.',
            'activity' => $activity,
            'journal_total_duration' => $journal->fresh()->total_duration_minutes,
        ], 201);
    }

    public function updateActivity(Request $request, int $journalId, int $activityId)
    {
        $activity = JournalActivity::where('daily_journal_id', $journalId)->findOrFail($activityId);

        $validated = $request->validate([
            'category' => 'sometimes|string',
            'activity_title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i',
            'result' => 'nullable|string',
            'obstacle' => 'nullable|string',
            'follow_up' => 'nullable|string',
            'follow_up_date' => 'nullable|date',
            'priority' => 'nullable|in:Low,Normal,High,Urgent',
            'status' => 'nullable|in:Planned,In Progress,Completed,Pending,Blocked',
            'related_module' => 'nullable|string',
        ]);

        $updated = $this->journalService->updateActivity($activity, $validated);

        return response()->json([
            'message' => 'Aktivitas berhasil diperbarui.',
            'activity' => $updated,
        ]);
    }

    public function deleteActivity(int $journalId, int $activityId)
    {
        $activity = JournalActivity::where('daily_journal_id', $journalId)->findOrFail($activityId);
        $this->journalService->deleteActivity($activity);

        return response()->json([
            'message' => 'Aktivitas berhasil dihapus.',
        ]);
    }

    public function submit(int $id)
    {
        $journal = DailyJournal::findOrFail($id);
        $submitted = $this->journalService->submitJournal($journal);

        return response()->json([
            'message' => 'Jurnal harian berhasil diajukan untuk verifikasi.',
            'journal' => $submitted,
        ]);
    }

    public function approve(Request $request, int $id)
    {
        $journal = DailyJournal::findOrFail($id);
        $approved = $this->journalService->reviewJournal($journal, $request->user()->id, 'Approve', $request->comments);

        return response()->json([
            'message' => 'Jurnal harian berhasil disetujui.',
            'journal' => $approved,
        ]);
    }

    public function requestRevision(Request $request, int $id)
    {
        $request->validate(['comments' => 'required|string']);
        $journal = DailyJournal::findOrFail($id);
        $reviewed = $this->journalService->reviewJournal($journal, $request->user()->id, 'Request Revision', $request->comments);

        return response()->json([
            'message' => 'Jurnal harian dikembalikan untuk perbaikan.',
            'journal' => $reviewed,
        ]);
    }

    public function dailyReport(int $id)
    {
        $journal = DailyJournal::findOrFail($id);
        $report = $this->journalService->generateDailyReport($journal);

        return response()->json($report);
    }

    public function weeklyReport(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $report = $this->journalService->generateWeeklyReport(
            $request->user()->school_id ?? 1,
            $request->user_id,
            $request->start_date,
            $request->end_date
        );

        return response()->json($report);
    }

    public function monthlyReport(Request $request)
    {
        $request->validate([
            'year' => 'required|integer|min:2020|max:2030',
            'month' => 'required|integer|min:1|max:12',
        ]);

        $report = $this->journalService->generateMonthlyReport(
            $request->user()->school_id ?? 1,
            $request->user_id,
            (int) $request->year,
            (int) $request->month
        );

        return response()->json($report);
    }

    public function calendar(Request $request)
    {
        $month = $request->get('month', now()->month);
        $year = $request->get('year', now()->year);

        $startDate = Carbon::createFromDate($year, $month, 1)->startOfMonth();
        $endDate = Carbon::createFromDate($year, $month, 1)->endOfMonth();

        $journals = DailyJournal::where('user_id', $request->user()->id)
            ->whereBetween('journal_date', [$startDate, $endDate])
            ->select('id', 'journal_date', 'status', 'total_duration_minutes')
            ->get();

        return response()->json($journals);
    }
}


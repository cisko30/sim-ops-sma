<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\OpsEvent;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class CalendarController extends Controller
{
    public function index(Request $request)
    {
        $schoolId = $request->user()->school_id ?? 1;

        $events = OpsEvent::with('assignee:id,name')
            ->where('school_id', $schoolId)
            ->orderBy('deadline_date')
            ->get();

        return response()->json($events);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'deadline_date' => 'required|date',
            'priority' => 'required|in:Low,Medium,High,Urgent',
            'description' => 'nullable|string',
            'assigned_to' => 'nullable|exists:users,id',
        ]);

        $validated['school_id'] = $request->user()->school_id ?? 1;
        $event = OpsEvent::create($validated);

        ActivityLog::log('CREATE', 'CALENDAR', OpsEvent::class, $event->id);

        return response()->json([
            'message' => 'Agenda operasional berhasil ditambahkan.',
            'event' => $event,
        ], 201);
    }

    public function update(Request $request, int $id)
    {
        $event = OpsEvent::findOrFail($id);
        $event->update($request->all());

        ActivityLog::log('UPDATE', 'CALENDAR', OpsEvent::class, $event->id);

        return response()->json([
            'message' => 'Agenda operasional diperbarui.',
            'event' => $event,
        ]);
    }

    public function destroy(int $id)
    {
        $event = OpsEvent::findOrFail($id);
        $event->delete();

        ActivityLog::log('DELETE', 'CALENDAR', OpsEvent::class, $id);

        return response()->json([
            'message' => 'Agenda operasional dihapus.',
        ]);
    }
}


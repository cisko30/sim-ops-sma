<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JournalActivity extends Model
{
    use HasFactory;

    protected $fillable = [
        'daily_journal_id',
        'category',
        'activity_title',
        'description',
        'start_time',
        'end_time',
        'duration_minutes',
        'result',
        'obstacle',
        'follow_up',
        'follow_up_date',
        'priority',
        'status',
        'related_module',
        'sort_order',
    ];

    protected $casts = [
        'duration_minutes' => 'integer',
        'follow_up_date' => 'date',
        'sort_order' => 'integer',
    ];

    public function dailyJournal()
    {
        return $this->belongsTo(DailyJournal::class);
    }

    public function attachments()
    {
        return $this->hasMany(JournalAttachment::class);
    }
}


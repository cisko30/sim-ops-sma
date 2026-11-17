<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DailyJournal extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_id',
        'user_id',
        'journal_date',
        'unit_name',
        'daily_summary',
        'total_duration_minutes',
        'status',
        'submitted_at',
        'reviewer_id',
        'reviewed_at',
        'review_notes',
    ];

    protected $casts = [
        'journal_date' => 'date',
        'total_duration_minutes' => 'integer',
        'submitted_at' => 'datetime',
        'reviewed_at' => 'datetime',
    ];

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    public function activities()
    {
        return $this->hasMany(JournalActivity::class)->orderBy('sort_order')->orderBy('start_time');
    }

    public function reviews()
    {
        return $this->hasMany(JournalReview::class);
    }

    public function revisions()
    {
        return $this->hasMany(JournalRevision::class);
    }

    public function isLocked(): bool
    {
        return in_array($this->status, ['Submitted', 'Under Review', 'Approved']);
    }

    public function recalculateDuration(): void
    {
        $this->total_duration_minutes = $this->activities()->sum('duration_minutes');
        $this->save();
    }
}


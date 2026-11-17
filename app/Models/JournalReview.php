<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JournalReview extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'daily_journal_id',
        'reviewer_id',
        'action',
        'comments',
        'reviewed_at',
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
    ];

    public function dailyJournal()
    {
        return $this->belongsTo(DailyJournal::class);
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }
}


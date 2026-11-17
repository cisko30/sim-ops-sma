<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JournalRevision extends Model
{
    use HasFactory;

    protected $fillable = [
        'daily_journal_id',
        'modified_by',
        'previous_values',
        'new_values',
        'reason',
    ];

    protected $casts = [
        'previous_values' => 'array',
        'new_values' => 'array',
    ];

    public function dailyJournal()
    {
        return $this->belongsTo(DailyJournal::class);
    }

    public function modifier()
    {
        return $this->belongsTo(User::class, 'modified_by');
    }
}


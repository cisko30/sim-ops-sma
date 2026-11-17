<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SyncHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_id',
        'user_id',
        'sync_type',
        'started_at',
        'completed_at',
        'status',
        'response_summary',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'response_summary' => 'array',
    ];

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}


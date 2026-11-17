<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OpsEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_id',
        'title',
        'category',
        'description',
        'deadline_date',
        'priority',
        'assigned_to',
        'status',
        'reminder_settings',
    ];

    protected $casts = [
        'deadline_date' => 'date',
        'reminder_settings' => 'array',
    ];

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}


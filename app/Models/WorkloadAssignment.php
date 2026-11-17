<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkloadAssignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'semester_id',
        'teacher_id',
        'subject_id',
        'classroom_id',
        'weekly_jtm',
        'is_linear',
        'notes',
    ];

    protected $casts = [
        'weekly_jtm' => 'integer',
        'is_linear' => 'boolean',
    ];

    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function classroom()
    {
        return $this->belongsTo(Classroom::class);
    }
}


<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdditionalDuty extends Model
{
    use HasFactory;

    protected $fillable = [
        'teacher_id',
        'semester_id',
        'duty_type',
        'equivalency_jtm',
        'sk_reference',
        'effective_from',
        'effective_until',
    ];

    protected $casts = [
        'equivalency_jtm' => 'integer',
        'effective_from' => 'date',
        'effective_until' => 'date',
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }
}


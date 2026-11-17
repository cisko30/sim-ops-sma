<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_id',
        'subject_code',
        'name',
        'phase',
        'standard_jtm',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'standard_jtm' => 'integer',
    ];

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function workloadAssignments()
    {
        return $this->hasMany(WorkloadAssignment::class);
    }
}


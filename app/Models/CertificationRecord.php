<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CertificationRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'teacher_id',
        'certification_subject_code',
        'certification_number',
        'certification_year',
        'certification_status',
        'verification_status',
        'notes',
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }
}


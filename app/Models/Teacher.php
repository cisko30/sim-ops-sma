<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_id',
        'user_id',
        'nuptk',
        'nip',
        'nik',
        'name',
        'title_front',
        'title_back',
        'gender',
        'employment_status',
        'education',
        'email',
        'phone',
        'is_certified',
        'nrg',
        'certification_subject_code',
        'is_active',
    ];

    protected $casts = [
        'is_certified' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function certificationRecords()
    {
        return $this->hasMany(CertificationRecord::class);
    }

    public function workloadAssignments()
    {
        return $this->hasMany(WorkloadAssignment::class);
    }

    public function additionalDuties()
    {
        return $this->hasMany(AdditionalDuty::class);
    }

    public function homeroomClassrooms()
    {
        return $this->hasMany(Classroom::class, 'homeroom_teacher_id');
    }

    public function getFullNameAttribute(): string
    {
        $front = $this->title_front ? "{$this->title_front} " : '';
        $back = $this->title_back ? ", {$this->title_back}" : '';
        return "{$front}{$this->name}{$back}";
    }
}


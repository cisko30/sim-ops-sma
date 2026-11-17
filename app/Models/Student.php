<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_id',
        'user_id',
        'nisn',
        'nik',
        'no_kk',
        'nipd',
        'name',
        'gender',
        'birth_place',
        'birth_date',
        'religion',
        'address',
        'rt',
        'rw',
        'village',
        'district',
        'regency',
        'parent_name',
        'parent_phone',
        'kip_status',
        'kip_number',
        'pkh_status',
        'is_active',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'kip_status' => 'boolean',
        'pkh_status' => 'boolean',
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

    public function classroomStudents()
    {
        return $this->hasMany(ClassroomStudent::class);
    }

    public function pipRecords()
    {
        return $this->hasMany(PipRecord::class);
    }

    public function documents()
    {
        return $this->morphMany(Document::class, 'owner');
    }
}


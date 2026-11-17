<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Classroom extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_id',
        'academic_year_id',
        'grade_level',
        'phase',
        'name',
        'specialization',
        'homeroom_teacher_id',
        'student_capacity',
    ];

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function homeroomTeacher()
    {
        return $this->belongsTo(Teacher::class, 'homeroom_teacher_id');
    }

    public function classroomStudents()
    {
        return $this->hasMany(ClassroomStudent::class);
    }

    public function students()
    {
        return $this->belongsToMany(Student::class, 'classroom_students');
    }

    public function workloadAssignments()
    {
        return $this->hasMany(WorkloadAssignment::class);
    }
}


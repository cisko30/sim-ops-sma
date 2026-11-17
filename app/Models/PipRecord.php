<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PipRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_id',
        'student_id',
        'fiscal_year',
        'assistance_stage',
        'sk_type',
        'sk_number',
        'nominal_amount',
        'bank_name',
        'account_number_encrypted',
        'activation_status',
        'disbursement_status',
        'proof_document_id',
    ];

    protected $casts = [
        'nominal_amount' => 'decimal:2',
        'account_number_encrypted' => 'encrypted',
    ];

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function histories()
    {
        return $this->hasMany(PipStatusHistory::class)->orderBy('changed_at', 'desc');
    }

    public function proofDocument()
    {
        return $this->belongsTo(Document::class, 'proof_document_id');
    }
}


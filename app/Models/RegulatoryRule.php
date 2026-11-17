<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegulatoryRule extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_id',
        'rule_category',
        'rule_name',
        'rule_value',
        'effective_from',
        'effective_until',
        'reference_document',
        'is_active',
    ];

    protected $casts = [
        'effective_from' => 'date',
        'effective_until' => 'date',
        'is_active' => 'boolean',
    ];

    public function school()
    {
        return $this->belongsTo(School::class);
    }
}


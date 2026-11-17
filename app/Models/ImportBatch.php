<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImportBatch extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_id',
        'user_id',
        'data_type',
        'original_filename',
        'stored_filepath',
        'total_rows',
        'successful_rows',
        'failed_rows',
        'status',
        'error_report_path',
        'rollback_metadata',
    ];

    protected $casts = [
        'rollback_metadata' => 'array',
        'total_rows' => 'integer',
        'successful_rows' => 'integer',
        'failed_rows' => 'integer',
    ];

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function logs()
    {
        return $this->hasMany(ImportLog::class);
    }
}


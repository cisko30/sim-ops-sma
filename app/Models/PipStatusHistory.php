<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PipStatusHistory extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'pip_record_id',
        'status_field',
        'old_status',
        'new_status',
        'changed_by',
        'notes',
        'changed_at',
    ];

    protected $casts = [
        'changed_at' => 'datetime',
    ];

    public function pipRecord()
    {
        return $this->belongsTo(PipRecord::class);
    }

    public function changer()
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}


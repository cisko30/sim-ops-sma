<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'school_id',
        'user_id',
        'action',
        'module',
        'record_type',
        'record_id',
        'old_values',
        'new_values',
        'ip_address',
        'user_agent',
        'created_at',
    ];

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
        'created_at' => 'datetime',
    ];

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public static function log(
        string $action,
        string $module,
        ?string $recordType = null,
        ?int $recordId = null,
        ?array $oldValues = null,
        ?array $newValues = null
    ): self {
        // Sanitize sensitive attributes
        $forbidden = ['password', 'token', 'remember_token', 'secret', 'account_number_encrypted'];
        $cleanOld = $oldValues ? array_diff_key($oldValues, array_flip($forbidden)) : null;
        $cleanNew = $newValues ? array_diff_key($newValues, array_flip($forbidden)) : null;

        return self::create([
            'school_id' => auth()->user()?->school_id,
            'user_id' => auth()->id(),
            'action' => strtoupper($action),
            'module' => strtoupper($module),
            'record_type' => $recordType,
            'record_id' => $recordId,
            'old_values' => $cleanOld,
            'new_values' => $cleanNew,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'created_at' => now(),
        ]);
    }
}


<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SkApproval extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'sk_document_id',
        'reviewer_id',
        'action',
        'notes',
        'acted_at',
    ];

    protected $casts = [
        'acted_at' => 'datetime',
    ];

    public function skDocument()
    {
        return $this->belongsTo(SkDocument::class);
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }
}


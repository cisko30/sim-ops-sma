<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JournalAttachment extends Model
{
    use HasFactory;

    protected $fillable = [
        'journal_activity_id',
        'original_name',
        'stored_path',
        'mime_type',
        'file_size',
        'uploaded_by',
    ];

    public function activity()
    {
        return $this->belongsTo(JournalActivity::class, 'journal_activity_id');
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}


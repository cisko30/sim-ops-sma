<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_id',
        'document_type_id',
        'owner_type',
        'owner_id',
        'original_name',
        'stored_name',
        'file_path',
        'mime_type',
        'file_size',
        'checksum',
        'verification_status',
        'uploaded_by',
        'verified_by',
        'verified_at',
        'verification_notes',
    ];

    protected $casts = [
        'file_size' => 'integer',
        'verified_at' => 'datetime',
    ];

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function documentType()
    {
        return $this->belongsTo(DocumentType::class);
    }

    public function owner()
    {
        return $this->morphTo();
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function versions()
    {
        return $this->hasMany(DocumentVersion::class)->orderBy('version_number', 'desc');
    }
}


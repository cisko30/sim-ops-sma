<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'allowed_extensions',
        'max_file_size_kb',
        'is_mandatory',
    ];

    protected $casts = [
        'is_mandatory' => 'boolean',
        'max_file_size_kb' => 'integer',
    ];

    public function documents()
    {
        return $this->hasMany(Document::class);
    }
}


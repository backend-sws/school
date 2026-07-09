<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ImportLog extends Model
{
    protected $fillable = [
        'institution_id',
        'module',
        'file_name',
        'file_path',
        'file_disk',
        'file_hash',
        'total_rows',
        'imported_rows',
        'skipped_rows',
        'error_rows',
        'errors',
        'status',
        'progress',
        'uploaded_by',
    ];

    protected $casts = [
        'errors' => 'array',
        'total_rows' => 'integer',
        'imported_rows' => 'integer',
        'skipped_rows' => 'integer',
        'error_rows' => 'integer',
        'progress' => 'integer',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}

<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LibraryIssue extends Model
{
    use BelongsToDefaultInstitution;

    protected $fillable = [
        'institution_id',
        'library_copy_id',
        'user_id',
        'issued_at',
        'due_at',
        'returned_at',
        'issued_by',
        'remarks',
    ];

    protected $casts = [
        'issued_at' => 'datetime',
        'due_at' => 'date',
        'returned_at' => 'datetime',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function copy(): BelongsTo
    {
        return $this->belongsTo(LibraryCopy::class, 'library_copy_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function issuedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'issued_by');
    }

    public function scopeOpen(Builder $query): Builder
    {
        return $query->whereNull('returned_at');
    }

    public function scopeOverdue(Builder $query): Builder
    {
        return $query->whereNull('returned_at')->where('due_at', '<', now());
    }
}

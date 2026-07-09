<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LibraryCopy extends Model
{
    use BelongsToDefaultInstitution;

    protected $fillable = [
        'institution_id',
        'library_book_id',
        'barcode',
        'shelf_location',
        'condition',
        'is_available',
    ];

    protected $casts = [
        'is_available' => 'boolean',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function book(): BelongsTo
    {
        return $this->belongsTo(LibraryBook::class, 'library_book_id');
    }

    public function issues(): HasMany
    {
        return $this->hasMany(LibraryIssue::class, 'library_copy_id');
    }
}

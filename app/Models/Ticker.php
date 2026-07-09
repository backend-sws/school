<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\Auditable;

class Ticker extends Model
{
    use Auditable;

    use BelongsToDefaultInstitution;

    public $timestamps = false;

    protected $table = 'home_tickers';

    protected $fillable = [
        'institution_id',
        'title',
        'tag',
        'url',
        'sort_order',
        'status',
        'content', // mapped to title
        'tags',   // mapped to tag (comma-separated)
    ];

    protected $casts = [
        'status' => 'integer',
        'created_at' => 'datetime',
    ];

    /** API/frontend use "content"; DB column is title */
    public function getContentAttribute(): ?string
    {
        return $this->attributes['title'] ?? null;
    }

    /** API/frontend use "tags" array; DB column is tag (comma-separated) */
    public function getTagsAttribute(): array
    {
        $tag = $this->attributes['tag'] ?? null;
        return $tag ? array_map('trim', explode(',', $tag)) : [];
    }

    public function setContentAttribute(?string $value): void
    {
        $this->attributes['title'] = $value;
    }

    /** @param array<string>|string|null $value */
    public function setTagsAttribute($value): void
    {
        $this->attributes['tag'] = is_array($value) ? implode(',', $value) : $value;
    }

    /** Append content and tags for JSON/API so frontend keeps working */
    protected $appends = ['content', 'tags'];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

}

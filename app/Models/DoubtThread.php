<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DoubtThread extends Model
{
    protected $table = 'doubt_threads';

    protected $fillable = [
        'institution_id',
        'user_id',
        'lms_class_id',
        'class_subject_allocation_id',
        'title',
        'body',
        'status',
        'upvotes',
        'reply_count',
        'is_pinned',
        'tags',
    ];

    protected $casts = [
        'upvotes' => 'integer',
        'reply_count' => 'integer',
        'is_pinned' => 'boolean',
    ];

    // ── Scopes ─────────────────────────────────────────────────────

    public function scopeForInstitution($query, int $id)
    {
        return $query->where('institution_id', $id);
    }

    public function scopeOpen($query)
    {
        return $query->where('status', 'open');
    }

    public function scopeResolved($query)
    {
        return $query->where('status', 'resolved');
    }

    // ── Relationships ──────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function lmsClass(): BelongsTo
    {
        return $this->belongsTo(LmsClass::class, 'lms_class_id');
    }

    public function classSubjectAllocation(): BelongsTo
    {
        return $this->belongsTo(ClassSubjectAllocation::class, 'class_subject_allocation_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(DoubtReply::class)->oldest();
    }

    public function acceptedReply()
    {
        return $this->hasOne(DoubtReply::class)->where('is_accepted', true);
    }

    // ── Helpers ────────────────────────────────────────────────────

    public function markResolved(): void
    {
        $this->update(['status' => 'resolved']);
    }

    public function getTagsArray(): array
    {
        return $this->tags ? array_map('trim', explode(',', $this->tags)) : [];
    }
}

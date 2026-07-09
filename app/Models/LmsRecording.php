<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LmsRecording extends Model
{
    protected $table = 'lms_recordings';

    protected $fillable = [
        'lms_class_id',
        'class_subject_allocation_id',
        'lms_live_session_id',
        'title',
        'description',
        'video_url',
        'file_path',
        'duration_seconds',
        'thumbnail_url',
        'published_at',
        'sort_order',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'duration_seconds' => 'integer',
        'sort_order' => 'integer',
    ];

    public function lmsClass(): BelongsTo
    {
        return $this->belongsTo(LmsClass::class, 'lms_class_id');
    }

    public function classSubjectAllocation(): BelongsTo
    {
        return $this->belongsTo(ClassSubjectAllocation::class, 'class_subject_allocation_id');
    }

    public function lmsLiveSession(): BelongsTo
    {
        return $this->belongsTo(LmsLiveSession::class, 'lms_live_session_id');
    }

    /**
     * Videos linked via the polymorphic videoables pivot.
     * Enables self-hosted video streaming alongside external video_url links.
     */
    public function videos()
    {
        return $this->morphToMany(Video::class, 'videoable');
    }

    /**
     * Check if this recording has a linked Video Engine video.
     */
    public function hasVideoEngine(): bool
    {
        return $this->videos()->exists();
    }
}

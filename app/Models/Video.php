<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Video extends Model
{
    protected $fillable = [
        'institution_id',
        'uploaded_by',
        'title',
        'description',
        'status',
        'file_name',
        'raw_path',
        'hls_path',
        'thumbnail_path',
        'duration_seconds',
        'file_size_bytes',
        'resolution_original',
        'resolutions_available',
        'metadata',
        'upload_id',
        'upload_parts',
        'upload_progress',
        'error_message',
    ];

    protected $casts = [
        'duration_seconds' => 'integer',
        'file_size_bytes' => 'integer',
        'upload_progress' => 'integer',
        'resolutions_available' => 'array',
        'metadata' => 'array',
        'upload_parts' => 'array',
    ];

    // ── Status Constants ───────────────────────────────────────────
    public const STATUS_UPLOADING = 'uploading';
    public const STATUS_PROCESSING = 'processing';
    public const STATUS_READY = 'ready';
    public const STATUS_FAILED = 'failed';

    // ── Relationships ──────────────────────────────────────────────
    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function videoables(): HasMany
    {
        return $this->hasMany(Videoable::class);
    }

    // ── Scopes ─────────────────────────────────────────────────────
    public function scopeReady($query)
    {
        return $query->where('status', self::STATUS_READY);
    }

    public function scopeProcessing($query)
    {
        return $query->where('status', self::STATUS_PROCESSING);
    }

    public function scopeFailed($query)
    {
        return $query->where('status', self::STATUS_FAILED);
    }

    public function scopeForInstitution($query, int $institutionId)
    {
        return $query->where('institution_id', $institutionId);
    }

    // ── Helpers ─────────────────────────────────────────────────────
    public function isReady(): bool
    {
        return $this->status === self::STATUS_READY;
    }

    public function isProcessing(): bool
    {
        return $this->status === self::STATUS_PROCESSING;
    }

    public function isFailed(): bool
    {
        return $this->status === self::STATUS_FAILED;
    }

    public function markProcessing(): void
    {
        $this->update(['status' => self::STATUS_PROCESSING]);
    }

    public function markReady(array $data = []): void
    {
        $this->update(array_merge(['status' => self::STATUS_READY, 'error_message' => null], $data));
    }

    public function markFailed(string $error): void
    {
        $this->update(['status' => self::STATUS_FAILED, 'error_message' => $error]);
    }

    public function getFormattedDuration(): ?string
    {
        if (!$this->duration_seconds) {
            return null;
        }

        $hours = floor($this->duration_seconds / 3600);
        $minutes = floor(($this->duration_seconds % 3600) / 60);
        $seconds = $this->duration_seconds % 60;

        if ($hours > 0) {
            return sprintf('%d:%02d:%02d', $hours, $minutes, $seconds);
        }

        return sprintf('%d:%02d', $minutes, $seconds);
    }

    public function getFormattedSize(): ?string
    {
        if (!$this->file_size_bytes) {
            return null;
        }

        $units = ['B', 'KB', 'MB', 'GB'];
        $bytes = $this->file_size_bytes;

        for ($i = 0; $bytes >= 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }
}

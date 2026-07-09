<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Unified communication log — every outbound message (SMS, WhatsApp, Email)
 * is tracked here with full lifecycle (queued → sent → delivered → read/failed).
 */
class CommunicationLog extends Model
{
    use HasFactory;

    protected $table = 'communication_logs';

    protected $fillable = [
        'institution_id',
        'channel',
        'sent_by',
        'recipient_phone',
        'recipient_email',
        'recipient_name',
        'recipient_user_id',
        'subject',
        'message',
        'template_id',
        'media_url',
        'media_type',
        'status',
        'provider',
        'provider_message_id',
        'error_message',
        'retry_count',
        'category',
        'cost',
        'sent_at',
        'delivered_at',
        'read_at',
    ];

    protected $casts = [
        'cost'         => 'decimal:4',
        'sent_at'      => 'datetime',
        'delivered_at' => 'datetime',
        'read_at'      => 'datetime',
        'retry_count'  => 'integer',
    ];

    // ── Channel Constants ────────────────────────────────────────

    public const CHANNEL_SMS      = 'sms';
    public const CHANNEL_WHATSAPP = 'whatsapp';
    public const CHANNEL_EMAIL    = 'email';

    // ── Scopes ───────────────────────────────────────────────────

    public function scopeForInstitution($query, int $id)
    {
        return $query->where('institution_id', $id);
    }

    public function scopeByStatus($query, string $s)
    {
        return $query->where('status', $s);
    }

    public function scopeByChannel($query, string $channel)
    {
        return $query->where('channel', $channel);
    }

    public function scopeSms($query)
    {
        return $query->where('channel', self::CHANNEL_SMS);
    }

    public function scopeWhatsapp($query)
    {
        return $query->where('channel', self::CHANNEL_WHATSAPP);
    }

    public function scopeEmail($query)
    {
        return $query->where('channel', self::CHANNEL_EMAIL);
    }

    // ── Relationships ────────────────────────────────────────────

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sent_by');
    }

    public function recipientUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recipient_user_id');
    }

    // ── Status Transitions ───────────────────────────────────────

    public function markSent(string $providerId): void
    {
        $this->update([
            'status'              => 'sent',
            'provider_message_id' => $providerId,
            'sent_at'             => now(),
        ]);
    }

    public function markDelivered(): void
    {
        $this->update([
            'status'       => 'delivered',
            'delivered_at' => now(),
        ]);
    }

    public function markRead(): void
    {
        $this->update([
            'status'  => 'read',
            'read_at' => now(),
        ]);
    }

    public function markFailed(string $error): void
    {
        $this->update([
            'status'        => 'failed',
            'error_message' => $error,
        ]);
    }

    public function incrementRetry(): void
    {
        $this->increment('retry_count');
    }
}

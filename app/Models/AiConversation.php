<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiConversation extends Model
{
    protected $fillable = [
        'institution_id',
        'user_id',
        'sutra_conversation_id',
        'agent_type',
        'title',
        'context_type',
        'context_id',
        'message_count',
        'last_message_at',
    ];

    protected $casts = [
        'sutra_conversation_id' => 'integer',
        'message_count'         => 'integer',
        'last_message_at'       => 'datetime',
    ];

    // ── Scopes ─────────────────────────────────────────────────────

    public function scopeForInstitution($query, int $id)
    {
        return $query->where('institution_id', $id);
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeForContext($query, string $type, int $id)
    {
        return $query->where('context_type', $type)->where('context_id', $id);
    }

    // ── Relationships ──────────────────────────────────────────────

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // ── Helpers ────────────────────────────────────────────────────

    public function incrementMessageCount(): void
    {
        $this->increment('message_count');
        $this->update(['last_message_at' => now()]);
    }
}

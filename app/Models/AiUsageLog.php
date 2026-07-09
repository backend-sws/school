<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiUsageLog extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'institution_id',
        'user_id',
        'agent_type',
        'endpoint',
        'prompt_preview',
        'tokens_used',
        'model_used',
        'response_status',
        'latency_ms',
        'metadata',
        'created_at',
    ];

    protected $casts = [
        'tokens_used'  => 'integer',
        'latency_ms'   => 'integer',
        'metadata'     => 'array',
        'created_at'   => 'datetime',
    ];

    // ── Scopes ─────────────────────────────────────────────────────

    public function scopeForInstitution($query, int $id)
    {
        return $query->where('institution_id', $id);
    }

    public function scopeThisMonth($query)
    {
        return $query->where('created_at', '>=', now()->startOfMonth());
    }

    public function scopeByAgent($query, string $agentType)
    {
        return $query->where('agent_type', $agentType);
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
}

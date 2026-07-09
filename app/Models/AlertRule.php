<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AlertRule extends Model
{
    protected $table = 'alert_rules';

    protected $fillable = [
        'institution_id',
        'created_by',
        'name',
        'trigger_event',
        'conditions',
        'channel',
        'message_template',
        'recipient_type',
        'is_active',
        'frequency',
        'last_triggered_at',
        'trigger_count',
    ];

    protected $casts = [
        'conditions' => 'array',
        'is_active' => 'boolean',
        'last_triggered_at' => 'datetime',
        'trigger_count' => 'integer',
    ];

    public const TRIGGER_EVENTS = [
        'fee_overdue',
        'attendance_absent',
        'exam_score_low',
        'assignment_due',
        'fee_payment_received',
        'enrollment_confirmed',
        'custom',
    ];

    public function scopeForInstitution($query, int $id)
    {
        return $query->where('institution_id', $id);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeForEvent($query, string $event)
    {
        return $query->where('trigger_event', $event);
    }

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function recordTrigger(): void
    {
        $this->update([
            'last_triggered_at' => now(),
            'trigger_count' => $this->trigger_count + 1,
        ]);
    }

    /**
     * Replace template variables with actual values.
     * Template: "Dear {{name}}, your fee of {{amount}} is overdue."
     */
    public function renderMessage(array $variables): string
    {
        $message = $this->message_template;
        foreach ($variables as $key => $value) {
            $message = str_replace("{{{$key}}}", (string) $value, $message);
        }
        return $message;
    }
}

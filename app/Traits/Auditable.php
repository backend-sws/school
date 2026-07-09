<?php

namespace App\Traits;

use App\Models\AuditLog;

/**
 * Auto-logs created / updated / deleted events to audit_logs.
 *
 * Usage:  use Auditable;   in any Eloquent model.
 */
trait Auditable
{
    public static function bootAuditable(): void
    {
        static::created(fn($model) => $model->logAudit('created'));
        static::updated(fn($model) => $model->logAudit('updated'));
        static::deleted(fn($model) => $model->logAudit('deleted'));
    }

    /**
     * Write one row to audit_logs.
     */
    protected function logAudit(string $action): void
    {
        // Skip if running seeders or migrations to avoid massive noise
        if (
            app()->runningInConsole() && (
                str_contains(implode(' ', $_SERVER['argv'] ?? []), 'db:seed') ||
                str_contains(implode(' ', $_SERVER['argv'] ?? []), 'migrate')
            )
        ) {
            return;
        }

        $oldValues = null;
        $newValues = null;

        if ($action === 'created') {
            $newValues = $this->getAttributes();
        } elseif ($action === 'updated') {
            $oldValues = collect($this->getOriginal())
                ->only(array_keys($this->getDirty()))
                ->toArray();
            $newValues = $this->getDirty();
        } elseif ($action === 'deleted') {
            $oldValues = $this->getOriginal();
        }

        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => $action,
            'entity_type' => class_basename($this),
            'entity_id' => $this->getKey(),
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => request()?->ip(),
            'user_agent' => request()?->userAgent(),
        ]);
    }
}

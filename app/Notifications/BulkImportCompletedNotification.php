<?php

namespace App\Notifications;

use App\Models\ImportLog;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

/**
 * Sent via database channel when a bulk import job completes or fails.
 * Shows in the notification bell on the frontend.
 */
class BulkImportCompletedNotification extends Notification
{
    use Queueable;

    public function __construct(
        protected ImportLog $importLog,
        protected string $status,
    ) {}

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        $log = $this->importLog;
        $moduleName = ucfirst(str_replace('_', ' ', $log->module));

        $message = $this->status === 'completed'
            ? "{$moduleName} import completed: {$log->imported_rows} imported, {$log->skipped_rows} skipped, {$log->error_rows} errors."
            : "{$moduleName} import failed. Please check the error details and try again.";

        return [
            'type'           => 'bulk_import_' . $this->status,
            'import_log_id'  => $log->id,
            'module'         => $log->module,
            'status'         => $this->status,
            'file_name'      => $log->file_name,
            'imported_rows'  => $log->imported_rows ?? 0,
            'skipped_rows'   => $log->skipped_rows ?? 0,
            'error_rows'     => $log->error_rows ?? 0,
            'message'        => $message,
        ];
    }
}

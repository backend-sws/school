<?php

namespace App\Jobs;

use App\Models\ImportLog;
use App\Models\User;
use App\Notifications\BulkImportCompletedNotification;
use App\Services\ImportPipeline;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\Middleware\WithoutOverlapping;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;

/**
 * Generic, throttled bulk import processor.
 *
 * - Reads CSV/Excel from S3
 * - Delegates to the appropriate importer class via ImportPipeline
 * - Updates ImportLog progress
 * - Sends notification on completion
 * - Throttled: max 2 concurrent per institution (WithoutOverlapping)
 */
class ProcessBulkImportJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Max attempts before permanently failing.
     */
    public int $tries = 3;

    /**
     * Job timeout in seconds (10 min for large files).
     */
    public int $timeout = 600;

    public function __construct(
        public ImportLog $importLog
    ) {
        // Force Redis connection if available — imports MUST run async via Horizon in production.
        // On environments without Redis (like local development), fallback to the default queue connection.
        $hasRedis = class_exists(\Redis::class) || class_exists(\Predis\Client::class);
        if ($hasRedis && config('queue.connections.redis')) {
            $this->onConnection('redis');
        } else {
            $this->onConnection(config('queue.default'));
        }
        $this->onQueue('imports');
    }

    /**
     * Exponential backoff: 1min, 5min, 10min.
     */
    public function backoff(): array
    {
        return [60, 300, 600];
    }

    /**
     * Throttle: max 2 concurrent import jobs per institution.
     * Releases lock after 10 minutes (matches timeout).
     */
    public function middleware(): array
    {
        return [
            (new WithoutOverlapping("import-inst-{$this->importLog->institution_id}"))
                ->releaseAfter(600)
                ->expireAfter(660),
        ];
    }

    public function handle(): void
    {
        // Disable PHP time limit — bulk imports with bcrypt can exceed 30s
        set_time_limit(0);

        $importLog = $this->importLog;

        // Guard: skip if already processed (idempotency)
        if (in_array($importLog->status, ['completed', 'failed'])) {
            return;
        }

        // Guard: file-content hash idempotency — prevent re-importing the same data
        try {
            $disk = $importLog->file_disk ?? 's3';
            $fileHash = md5(Storage::disk($disk)->get($importLog->file_path));
            $duplicateImport = ImportLog::where('institution_id', $importLog->institution_id)
                ->where('module', $importLog->module)
                ->where('id', '!=', $importLog->id)
                ->where('status', 'completed')
                ->where('imported_rows', '>', 0)
                ->where('file_hash', $fileHash)
                ->exists();

            if ($duplicateImport) {
                $importLog->update([
                    'status' => 'completed',
                    'progress' => 100,
                    'errors' => ['File already imported (identical content detected). No duplicate records created.'],
                ]);
                Log::info('BulkImport skipped — duplicate file hash', ['module' => $importLog->module, 'hash' => $fileHash]);
                return;
            }

            // Store hash for future dedup checks
            $importLog->update(['file_hash' => $fileHash]);
        } catch (\Throwable $e) {
            // Non-critical: if hash check fails, proceed with import
            Log::warning('File hash check failed, proceeding with import', ['error' => $e->getMessage()]);
        }

        $importLog->update(['status' => 'processing', 'progress' => 0]);

        try {
            $disk = $importLog->file_disk ?? 's3';
            $filePath = $importLog->file_path;

            // ── 1. Create importer ──
            $importer = ImportPipeline::createImporter(
                $importLog->module,
                $importLog->institution_id,
                $importLog->uploaded_by,
                $filePath,
                $disk
            );

            // Pass ImportLog reference for live progress updates
            if (method_exists($importer, 'setImportLog')) {
                $importer->setImportLog($importLog);
            }

            // Pre-count total rows for progress percentage
            if (method_exists($importer, 'setTotalRowEstimate')) {
                $totalRows = $this->countDataRows($disk, $filePath, $importer);
                if ($totalRows > 0) {
                    $importer->setTotalRowEstimate($totalRows);
                }
            }

            Log::info("BulkImport Starting", ['module' => $importLog->module, 'disk' => $disk, 'path' => $filePath]);

            // ── 2. Run import from disk — explicitly pass reader type ──
            // When reading from S3/R2, Maatwebsite downloads to a temp file without
            // the original extension. PhpSpreadsheet can't auto-detect the format,
            // resulting in 0 rows. We explicitly resolve the reader type from the
            // original file extension to prevent this.
            $readerType = $this->resolveReaderType($filePath);
            Excel::import($importer, $filePath, $disk, $readerType);

            // ── 4. Collect results ──
            $importedCount = method_exists($importer, 'getImportedCount') ? $importer->getImportedCount() : 0;
            $skippedCount  = method_exists($importer, 'getSkippedCount')  ? $importer->getSkippedCount()  : 0;
            $dedupSkipped  = method_exists($importer, 'getDedupSkipped')  ? $importer->getDedupSkipped()  : 0;
            $rowErrors     = method_exists($importer, 'getRowErrors')     ? $importer->getRowErrors()     : [];

            // Collect validation failures from SkipsFailures
            $failures = method_exists($importer, 'failures') ? $importer->failures() : collect();
            $validationErrors = [];
            foreach ($failures as $failure) {
                $validationErrors[] = "Row {$failure->row()}: " . implode(', ', $failure->errors());
            }

            $allErrors  = array_merge($rowErrors, $validationErrors);
            $errorCount = count($allErrors);

            // ── 5. Update ImportLog ──
            $importLog->update([
                'total_rows'    => $importedCount + $skippedCount + $errorCount,
                'imported_rows' => $importedCount,
                'skipped_rows'  => $skippedCount,
                'error_rows'    => $errorCount,
                'errors'        => !empty($allErrors) ? array_slice($allErrors, 0, 100) : null,
                'status'        => 'completed',
                'progress'      => 100,
            ]);

            // ── 7. Cleanup S3 file (processed successfully) ──
            Storage::disk($disk)->delete($filePath);

            // ── 8. Notify user ──
            $this->notifyUploader($importLog, 'completed');

            Log::info("BulkImport [{$importLog->module}] completed", [
                'import_log_id' => $importLog->id,
                'imported'      => $importedCount,
                'skipped'       => $skippedCount,
                'errors'        => $errorCount,
            ]);

        } catch (\Throwable $e) {

            Log::error("BulkImport [{$importLog->module}] failed", [
                'import_log_id' => $importLog->id,
                'error'         => $e->getMessage(),
            ]);

            $importLog->update([
                'status' => 'failed',
                'errors' => [$e->getMessage()],
            ]);

            $this->notifyUploader($importLog, 'failed');

            throw $e; // Re-throw for retry
        }
    }

    /**
     * Count total data rows in the file (excluding header).
     * This is slightly expensive but necessary for progress percentages.
     */
    protected function countDataRows(string $disk, string $filePath, object $importer): int
    {
        try {
            // Get local path
            $tempPath = tempnam(sys_get_temp_dir(), 'import_row_count');
            file_put_contents($tempPath, Storage::disk($disk)->get($filePath));

            $reader = \PhpOffice\PhpSpreadsheet\IOFactory::createReaderForFile($tempPath);
            $reader->setReadDataOnly(true);
            $spreadsheet = $reader->load($tempPath);
            $worksheet = $spreadsheet->getActiveSheet();
            $highestRow = $worksheet->getHighestRow();

            unlink($tempPath);

            // Subtract heading row offset
            $headingRow = method_exists($importer, 'headingRow') ? $importer->headingRow() : 1;
            return max(0, $highestRow - $headingRow);
        } catch (\Throwable $e) {
            Log::warning("BulkImport row count failed", ['error' => $e->getMessage()]);
            return 0;
        }
    }

    /**
     * Send database notification to the uploader.
     */
    protected function notifyUploader(ImportLog $importLog, string $status): void
    {
        try {
            $user = User::find($importLog->uploaded_by);
            if ($user) {
                $user->notify(new BulkImportCompletedNotification($importLog, $status));
            }
        } catch (\Throwable $e) {
            Log::warning('BulkImport notification failed', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Handle permanent failure after all retries exhausted.
     */
    public function failed(\Throwable $exception): void
    {
        $this->importLog->update([
            'status' => 'failed',
            'errors' => [$exception->getMessage()],
        ]);

        $this->notifyUploader($this->importLog, 'failed');
    }

    /**
     * Resolve the Maatwebsite Excel reader type from the original file path extension.
     *
     * When reading from S3/R2, the temp file loses its extension, preventing
     * PhpSpreadsheet from auto-detecting the format. This method ensures the
     * correct reader is used.
     */
    protected function resolveReaderType(string $filePath): ?string
    {
        $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));

        return match ($extension) {
            'csv'  => \Maatwebsite\Excel\Excel::CSV,
            'xlsx' => \Maatwebsite\Excel\Excel::XLSX,
            'xls'  => \Maatwebsite\Excel\Excel::XLS,
            default => null,
        };
    }
}

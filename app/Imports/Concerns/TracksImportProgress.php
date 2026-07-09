<?php

namespace App\Imports\Concerns;

use App\Models\ImportLog;

/**
 * Generic trait for live import progress tracking.
 *
 * Usage:
 *   class MyImport implements ToModel, WithChunkReading {
 *       use TracksImportProgress;
 *   }
 *
 * The ProcessBulkImportJob automatically calls setImportLog() before import starts.
 * Progress is written to the import_logs.progress column (0–100) periodically.
 *
 * Call $this->tickProgress() inside your model() method to update progress.
 * The trait throttles DB writes to every N rows to avoid excessive queries.
 */
trait TracksImportProgress
{
    protected ?ImportLog $importLog = null;
    protected int $totalRowEstimate = 0;
    protected int $processedRowCount = 0;
    protected int $progressUpdateInterval = 25; // Write to DB every N rows

    /**
     * Set the ImportLog reference for progress tracking.
     * Called by ProcessBulkImportJob before import starts.
     */
    public function setImportLog(ImportLog $importLog): void
    {
        $this->importLog = $importLog;
    }

    /**
     * Set the estimated total row count for percentage calculation.
     * Called by ProcessBulkImportJob after pre-counting the file.
     */
    public function setTotalRowEstimate(int $total): void
    {
        $this->totalRowEstimate = $total;
    }

    /**
     * Call this in your model() method to track progress.
     * Throttles DB writes to every $progressUpdateInterval rows.
     */
    protected function tickProgress(): void
    {
        $this->processedRowCount++;

        if (!$this->importLog || $this->totalRowEstimate <= 0) {
            return;
        }

        // Only write to DB every N rows to avoid excessive queries
        if ($this->processedRowCount % $this->progressUpdateInterval !== 0) {
            return;
        }

        $percent = min(99, (int) round(($this->processedRowCount / $this->totalRowEstimate) * 100));

        // Use direct query to avoid model event overhead
        $this->importLog->newQuery()
            ->where('id', $this->importLog->id)
            ->update(['progress' => $percent]);
    }
}

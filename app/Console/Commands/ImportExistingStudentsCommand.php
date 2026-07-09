<?php

namespace App\Console\Commands;

use App\Imports\ExistingStudentBulkImport;
use App\Models\ImportLog;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;

/**
 * Run student import synchronously from a local file path.
 * Bypasses queue, R2, and Docker entirely.
 *
 * Usage: php artisan import:existing-students storage/pds_students_clean_import.csv
 */
class ImportExistingStudentsCommand extends Command
{
    protected $signature = 'import:existing-students
                            {file : Path to the CSV file (relative to project root or absolute)}
                            {--institution=1 : Institution ID}';

    protected $description = 'Import existing students from a local CSV file (synchronous, no queue)';

    public function handle(): int
    {
        $filePath = $this->argument('file');
        $institutionId = (int) $this->option('institution');

        // Resolve relative paths
        if (!str_starts_with($filePath, '/')) {
            $filePath = base_path($filePath);
        }

        if (!file_exists($filePath)) {
            $this->error("File not found: {$filePath}");
            return 1;
        }

        $this->info("Importing from: {$filePath}");
        $this->info("Institution ID: {$institutionId}");
        $this->info("File size: " . number_format(filesize($filePath)) . " bytes");
        $this->info("Lines: " . count(file($filePath)));
        $this->newLine();

        // Create importer — pass null for filePath/fileDisk since we're reading locally
        $importer = new ExistingStudentBulkImport(
            institutionId: $institutionId,
            filePath: $filePath,
            fileDisk: null
        );

        $this->info("Heading row: " . $importer->headingRow());
        $this->info("Starting import...");
        $this->newLine();

        $bar = $this->output->createProgressBar();
        $bar->start();

        try {
            // Import directly from local file, explicitly passing CSV type
            Excel::import($importer, $filePath, null, \Maatwebsite\Excel\Excel::CSV);

            $bar->finish();
            $this->newLine(2);

            // Results
            $importedCount = $importer->getImportedCount();
            $skippedCount = $importer->getSkippedCount();
            $dedupSkipped = $importer->getDedupSkipped();
            $rowErrors = $importer->getRowErrors();
            $failures = $importer->failures();

            $this->info("✅ Import completed!");
            $this->table(
                ['Metric', 'Count'],
                [
                    ['Imported', $importedCount],
                    ['Skipped', $skippedCount],
                    ['Dedup Skipped', $dedupSkipped],
                    ['Row Errors', count($rowErrors)],
                    ['Validation Failures', count($failures)],
                ]
            );

            // Show row errors
            if (!empty($rowErrors)) {
                $this->newLine();
                $this->warn("Row Errors (first 20):");
                foreach (array_slice($rowErrors, 0, 20) as $err) {
                    $this->line("  ⚠ {$err}");
                }
            }

            // Show validation failures
            if (count($failures) > 0) {
                $this->newLine();
                $this->warn("Validation Failures (first 20):");
                foreach ($failures->take(20) as $f) {
                    $this->line("  ✗ Row {$f->row()}: " . implode(', ', $f->errors()));
                }
            }

            // Create ImportLog record for tracking
            ImportLog::create([
                'institution_id' => $institutionId,
                'module' => 'existing_students',
                'file_name' => basename($filePath),
                'file_path' => $filePath,
                'file_disk' => 'local',
                'file_hash' => md5_file($filePath),
                'total_rows' => $importedCount + $skippedCount + $dedupSkipped + count($rowErrors) + count($failures),
                'imported_rows' => $importedCount,
                'skipped_rows' => $skippedCount + $dedupSkipped,
                'error_rows' => count($rowErrors) + count($failures),
                'errors' => !empty($rowErrors) ? array_slice($rowErrors, 0, 100) : null,
                'status' => 'completed',
                'progress' => 100,
                'uploaded_by' => 1,
            ]);

            return 0;

        } catch (\Throwable $e) {
            $bar->finish();
            $this->newLine(2);
            $this->error("Import failed: {$e->getMessage()}");
            $this->error("File: {$e->getFile()}:{$e->getLine()}");
            Log::error("ImportExistingStudents command failed", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return 1;
        }
    }
}

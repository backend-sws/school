<?php

namespace App\Services;

use App\Imports\DepartmentImport;
use App\Imports\ExistingStudentBulkImport;
use App\Imports\FeePaymentImport;
use App\Imports\FeeTypeImport;
use App\Imports\StaffBulkImport;
use App\Imports\StreamImport;
use App\Imports\StudentBulkImport;
use App\Imports\SubjectImport;
use App\Jobs\ProcessBulkImportJob;
use App\Models\ImportLog;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

/**
 * Generic Import Pipeline — Software Factory pattern.
 *
 * Single registry maps module keys → importer classes.
 * Adding a new import module:
 *   1. Create the Importer class (implements ToModel, WithHeadingRow, etc.)
 *   2. Register it in IMPORTERS below
 *   3. Add template in ImportTemplateExport::TEMPLATES
 *
 * Usage:
 *   ImportPipeline::dispatch('existing_students', $file, $institutionId, $userId);
 */
class ImportPipeline
{
    /**
     * Module → Importer class registry.
     * Each class receives ($institutionId) in constructor.
     * FeePaymentImport receives ($institutionId, $collectedBy).
     */
    protected const IMPORTERS = [
        'departments'       => DepartmentImport::class,
        'streams'           => StreamImport::class,
        'subjects'          => SubjectImport::class,
        'students'          => StudentBulkImport::class,
        'existing_students' => ExistingStudentBulkImport::class,
        'staff'             => StaffBulkImport::class,
        'fee_types'         => FeeTypeImport::class,
        'fee_payments'      => FeePaymentImport::class,
    ];

    /**
     * Disk to store import files.
     */
    protected static function disk(): string
    {
        return env('FILESYSTEM_DISK', 's3');
    }

    /**
     * Upload file to S3, create ImportLog, dispatch background job.
     *
     * Returns the ImportLog immediately (status = 'queued').
     */
    public static function dispatch(
        string $module,
        UploadedFile $file,
        int $institutionId,
        int $userId,
    ): ImportLog {
        $fileName = $file->getClientOriginalName();
        $disk = static::disk();

        // Store to S3: imports/{institution_id}/{timestamp}_{filename}
        $path = $file->storeAs(
            "imports/{$institutionId}",
            time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $fileName),
            $disk
        );

        // Create import log
        $importLog = ImportLog::create([
            'institution_id' => $institutionId,
            'module'         => $module,
            'file_name'      => $fileName,
            'file_path'      => $path,
            'file_disk'      => $disk,
            'status'         => 'queued',
            'uploaded_by'    => $userId,
        ]);

        // Dispatch to queue — throttled per institution
        ProcessBulkImportJob::dispatch($importLog)
            ->onQueue('imports');

        return $importLog;
    }

    /**
     * Create the correct importer instance for a module.
     */
    public static function createImporter(string $module, int $institutionId, ?int $collectedBy = null, ?string $filePath = null, ?string $fileDisk = null): object
    {
        $class = static::IMPORTERS[$module] ?? null;

        if (!$class) {
            throw new \InvalidArgumentException("Unknown import module: {$module}");
        }

        // FeePaymentImport has a second constructor arg
        if ($module === 'fee_payments') {
            return new $class($institutionId, $collectedBy);
        }

        // ExistingStudentBulkImport needs filePath/disk for heading auto-detect
        if ($module === 'existing_students') {
            return new $class($institutionId, $filePath, $fileDisk);
        }

        return new $class($institutionId);
    }

    /**
     * Check if a module is registered.
     */
    public static function isValidModule(string $module): bool
    {
        return isset(static::IMPORTERS[$module]);
    }

    /**
     * Get all registered module keys.
     */
    public static function getRegisteredModules(): array
    {
        return array_keys(static::IMPORTERS);
    }
}

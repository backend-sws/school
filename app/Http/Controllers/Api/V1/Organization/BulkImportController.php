<?php

namespace App\Http\Controllers\Api\V1\Organization;

use App\Exports\ImportTemplateExport;
use App\Http\Controllers\Api\V1\BaseController;
use App\Models\ImportLog;
use App\Services\ImportPipeline;
use App\Support\ApiErrorMap;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class BulkImportController extends BaseController
{
    /**
     * Download an Excel template for a given module.
     */
    public function downloadTemplate(string $module)
    {
        if (!ImportTemplateExport::isValidModule($module)) {
            return ApiErrorMap::respond('import.invalid_module');
        }

        $fileName = "import_template_{$module}.xlsx";
        return Excel::download(new ImportTemplateExport($module), $fileName);
    }

    /**
     * Upload a CSV/Excel file for async import processing.
     *
     * Flow:
     *   1. Validate file
     *   2. Store to S3
     *   3. Create ImportLog (status = 'queued')
     *   4. Dispatch ProcessBulkImportJob to 'imports' queue
     *   5. Return 202 immediately (non-blocking)
     *
     * User can upload multiple files back-to-back without waiting.
     */
    public function upload(Request $request, string $module): JsonResponse
    {
        if (!ImportPipeline::isValidModule($module)) {
            return ApiErrorMap::respond('import.invalid_module');
        }

        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv|max:20480', // 20MB max
        ]);

        $user = $request->user();
        $institutionId = $this->resolveInstitutionId($user);

        if (!$institutionId) {
            return ApiErrorMap::respond('import.institution_context_missing');
        }

        $file = $request->file('file');

        // Dispatch to queue via ImportPipeline (stores to S3 + creates ImportLog)
        $importLog = ImportPipeline::dispatch(
            $module,
            $file,
            $institutionId,
            $user->id,
        );

        return $this->success([
            'import_log_id' => $importLog->id,
            'module'        => $module,
            'file_name'     => $importLog->file_name,
            'status'        => 'queued',
        ], 'Import queued for processing. You will be notified when it completes.', 202);
    }

    /**
     * Get real-time status of a specific import job.
     *
     * Frontend can poll this endpoint for live progress.
     */
    public function status(Request $request, int $importLogId): JsonResponse
    {
        $user = $request->user();
        $institutionId = $this->resolveInstitutionId($user);

        if (!$institutionId) {
            return ApiErrorMap::respond('import.institution_context_missing');
        }

        $importLog = ImportLog::where('institution_id', $institutionId)
            ->where('id', $importLogId)
            ->first();

        if (!$importLog) {
            return ApiErrorMap::respond('import.log_not_found');
        }

        return $this->success([
            'id'            => $importLog->id,
            'module'        => $importLog->module,
            'file_name'     => $importLog->file_name,
            'status'        => $importLog->status,
            'total_rows'    => $importLog->total_rows,
            'imported_rows' => $importLog->imported_rows,
            'skipped_rows'  => $importLog->skipped_rows,
            'error_rows'    => $importLog->error_rows,
            'errors'        => $importLog->errors,
            'created_at'    => $importLog->created_at,
            'updated_at'    => $importLog->updated_at,
        ]);
    }

    /**
     * Get import history for the current institution.
     */
    public function history(Request $request): JsonResponse
    {
        $user = $request->user();
        $institutionId = $this->resolveInstitutionId($user);

        if (!$institutionId) {
            return ApiErrorMap::respond('import.institution_context_missing');
        }

        $logs = ImportLog::where('institution_id', $institutionId)
            ->with('uploader:id,name')
            ->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 20));

        return $this->paginated($logs);
    }

    /**
     * Get available modules for import.
     */
    public function modules(): JsonResponse
    {
        $modules = [
            [
                'key' => 'departments',
                'name' => 'Departments',
                'description' => 'Academic departments (e.g., Computer Science, Mathematics)',
                'icon' => 'Building2',
                'depends_on' => [],
            ],
            [
                'key' => 'streams',
                'name' => 'Streams / Courses',
                'description' => 'Programs and courses under departments',
                'icon' => 'GraduationCap',
                'depends_on' => ['departments'],
            ],
            [
                'key' => 'subjects',
                'name' => 'Subjects',
                'description' => 'Academic subjects mapped to streams',
                'icon' => 'BookOpen',
                'depends_on' => ['streams'],
            ],
            [
                'key' => 'students',
                'name' => 'Students',
                'description' => 'Student records with profiles and guardians',
                'icon' => 'Users',
                'depends_on' => [],
            ],
            [
                'key' => 'staff',
                'name' => 'Staff / Faculty',
                'description' => 'Teaching and non-teaching staff',
                'icon' => 'UserCog',
                'depends_on' => [],
            ],
            [
                'key' => 'fee_types',
                'name' => 'Fee Types',
                'description' => 'Fee categories and types',
                'icon' => 'IndianRupee',
                'depends_on' => [],
            ],
            [
                'key' => 'fee_payments',
                'name' => 'Fee Payments (Ledger)',
                'description' => 'Import past fee payments for existing students',
                'icon' => 'Receipt',
                'depends_on' => ['students', 'fee_types'],
            ],
            [
                'key' => 'existing_students',
                'name' => 'Existing Students (Direct Enrollment)',
                'description' => 'Import already-admitted students directly as enrolled — skips admission workflow',
                'icon' => 'UserCheck',
                'depends_on' => [],
            ],
        ];

        return $this->success($modules);
    }

    /**
     * Resolve the active institution ID from user context.
     */
    protected function resolveInstitutionId($user): ?int
    {
        return \App\Support\InstitutionContext::getActiveInstitutionId($user);
    }
}

<?php

namespace App\Console\Commands;

use App\Models\Institution;
use App\Models\StudentProfile;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Safely purge students and all their associated records (fee payments, ledgers,
 * admissions, enrollments, user accounts, etc.) for a clean re-import.
 *
 * Usage:
 *   php artisan students:purge --institution=1 --dry-run
 *   php artisan students:purge --institution=1 --all --force
 *   php artisan students:purge --institution=1 --session_id=2 --force
 */
class PurgeStudentsCommand extends Command
{
    protected $signature = 'students:purge
                            {--institution=1 : Institution ID}
                            {--session_id= : Filter by academic session ID}
                            {--stream_id= : Filter by stream / class ID}
                            {--all : Confirm purging all students in the institution}
                            {--clear-import-logs : Also delete student import logs}
                            {--dry-run : Simulate deletion and display record counts without deleting}
                            {--force : Bypass interactive confirmation}';

    protected $description = 'Purge imported students, fee records, and associated user accounts for a clean re-import';

    public function handle(): int
    {
        $institutionId = (int) $this->option('institution');
        $sessionId = $this->option('session_id') ? (int) $this->option('session_id') : null;
        $streamId = $this->option('stream_id') ? (int) $this->option('stream_id') : null;
        $all = (bool) $this->option('all');
        $dryRun = (bool) $this->option('dry-run');
        $force = (bool) $this->option('force');
        $clearImportLogs = (bool) $this->option('clear-import-logs');

        $institution = Institution::find($institutionId);
        if (!$institution) {
            $this->error("Institution ID {$institutionId} not found.");
            return 1;
        }

        $this->info("=== Student Purge Tool ===");
        $this->line("Institution: <comment>{$institution->name} (ID: {$institutionId})</comment>");

        if (!$all && !$sessionId && !$streamId) {
            $this->error("Safety check: You must specify --all, --session_id=<id>, or --stream_id=<id>.");
            $this->line("Examples:");
            $this->line("  php artisan students:purge --institution={$institutionId} --all --dry-run");
            $this->line("  php artisan students:purge --institution={$institutionId} --all --force");
            return 1;
        }

        // 1. Identify student profiles
        $profileQuery = DB::table('student_profiles')
            ->where('institution_id', $institutionId);

        if ($sessionId) {
            $profileQuery->where('session_id', $sessionId);
            $this->line("Filter Session ID: <comment>{$sessionId}</comment>");
        }
        if ($streamId) {
            $profileQuery->where('stream_id', $streamId);
            $this->line("Filter Stream ID: <comment>{$streamId}</comment>");
        }

        $studentProfiles = $profileQuery->get(['id', 'user_id']);
        $profileUserIds = $studentProfiles->pluck('user_id')->filter()->unique()->values()->all();
        $studentProfileIds = $studentProfiles->pluck('id')->filter()->unique()->values()->all();

        // If --all, also include users with 'student' or 'candidate' role in this institution
        $roleUserIds = [];
        if ($all) {
            $roleUserIds = DB::table('user_roles')
                ->join('roles', 'user_roles.role_id', '=', 'roles.id')
                ->where('user_roles.institution_id', $institutionId)
                ->whereIn('roles.key', ['student', 'candidate'])
                ->pluck('user_roles.user_id')
                ->unique()
                ->values()
                ->all();
        }

        $targetUserIds = array_values(array_unique(array_merge($profileUserIds, $roleUserIds)));

        // SAFETY: Never delete staff / admin accounts
        $protectedStaffUserIds = DB::table('user_roles')
            ->join('roles', 'user_roles.role_id', '=', 'roles.id')
            ->whereIn('roles.key', [
                'super_admin', 'college_admin', 'institution_admin',
                'principal', 'teacher', 'accountant', 'librarian', 'staff'
            ])
            ->pluck('user_roles.user_id')
            ->unique()
            ->all();

        $targetUserIds = array_values(array_diff($targetUserIds, $protectedStaffUserIds));

        if (empty($targetUserIds) && empty($studentProfileIds)) {
            $this->warn("No students found matching the specified criteria.");
            return 0;
        }

        // 2. Count records to delete
        $counts = $this->gatherCounts($targetUserIds, $studentProfileIds, $institutionId, $clearImportLogs);

        $this->newLine();
        $this->table(
            ['Record Type', 'Count to Delete'],
            collect($counts)->map(fn($count, $type) => [ucwords(str_replace('_', ' ', $type)), number_format($count)])->values()->all()
        );

        if ($dryRun) {
            $this->info("🔎 DRY RUN complete. No records were deleted.");
            return 0;
        }

        // Confirmation
        if (!$force) {
            $confirm = $this->confirm(
                "Are you SURE you want to permanently delete {$counts['student_users']} students and all related fee/academic records?",
                false
            );
            if (!$confirm) {
                $this->warn("Operation cancelled by user.");
                return 0;
            }
        }

        // 3. Execute Deletion in DB Transaction
        $this->newLine();
        $this->info("Purging student data...");

        try {
            DB::transaction(function () use ($targetUserIds, $studentProfileIds, $institutionId, $clearImportLogs) {
                // Delete child records with ON DELETE RESTRICT first:

                // A. Fee Payments
                if (!empty($targetUserIds)) {
                    DB::table('fee_payments')->whereIn('user_id', $targetUserIds)->delete();
                }

                // B. Admission Applications & child records
                if (!empty($targetUserIds)) {
                    $appIds = DB::table('admission_applications')->whereIn('user_id', $targetUserIds)->pluck('id')->all();
                    if (!empty($appIds)) {
                        DB::table('admission_verification_data')->whereIn('admission_application_id', $appIds)->delete();
                        DB::table('admission_application_subjects')->whereIn('admission_application_id', $appIds)->delete();
                        DB::table('admission_applications')->whereIn('id', $appIds)->delete();
                    }
                }

                // C. Certificate Applications
                if (!empty($targetUserIds)) {
                    DB::table('certificate_applications')->whereIn('user_id', $targetUserIds)->delete();
                }

                // D. Support / Feedback / Audit logs / Transactions
                if (!empty($targetUserIds)) {
                    DB::table('transactions')->whereIn('user_id', $targetUserIds)->delete();
                    DB::table('feedbacks')->whereIn('user_id', $targetUserIds)->delete();
                    DB::table('support_messages')->whereIn('user_id', $targetUserIds)->delete();
                    DB::table('support_tickets')->whereIn('user_id', $targetUserIds)->delete();
                    DB::table('audit_logs')->whereIn('user_id', $targetUserIds)->delete();
                }

                // E. ID Cards & Notifications
                if (!empty($targetUserIds)) {
                    DB::table('id_cards')->whereIn('user_id', $targetUserIds)->delete();
                    DB::table('notifications')
                        ->where('notifiable_type', 'App\\Models\\User')
                        ->whereIn('notifiable_id', $targetUserIds)
                        ->delete();
                }

                // F. Guardian links and orphaned guardian accounts
                if (!empty($targetUserIds)) {
                    $guardianIds = DB::table('guardian_students')->whereIn('user_id', $targetUserIds)->pluck('guardian_id')->all();
                    DB::table('guardian_students')->whereIn('user_id', $targetUserIds)->delete();

                    if (!empty($guardianIds)) {
                        $stillUsedGuardianIds = DB::table('guardian_students')->whereIn('guardian_id', $guardianIds)->pluck('guardian_id')->all();
                        $orphanGuardianIds = array_diff($guardianIds, $stillUsedGuardianIds);

                        if (!empty($orphanGuardianIds)) {
                            $parentUserIds = DB::table('guardians')
                                ->whereIn('id', $orphanGuardianIds)
                                ->whereNotNull('user_id')
                                ->pluck('user_id')
                                ->all();

                            DB::table('guardians')->whereIn('id', $orphanGuardianIds)->delete();

                            if (!empty($parentUserIds)) {
                                DB::table('user_roles')->whereIn('user_id', $parentUserIds)->delete();
                                DB::table('users')->whereIn('id', $parentUserIds)->delete();
                            }
                        }
                    }
                }

                // G. Delete student profiles directly if any profile lacked a user_id
                if (!empty($studentProfileIds)) {
                    DB::table('student_profiles')->whereIn('id', $studentProfileIds)->delete();
                }

                // H. Delete User accounts (Cascades: fee_balances, lms_enrollments, attendance, exam_marks, addresses, roles, etc.)
                if (!empty($targetUserIds)) {
                    foreach (array_chunk($targetUserIds, 500) as $chunk) {
                        DB::table('users')->whereIn('id', $chunk)->delete();
                    }
                }

                // I. Clear import logs if requested
                if ($clearImportLogs) {
                    DB::table('import_logs')
                        ->where('institution_id', $institutionId)
                        ->whereIn('module', ['students', 'existing_students', 'student_bulk_import'])
                        ->delete();
                }
            });

            $this->info("✅ Successfully purged {$counts['student_users']} students and their associated data.");
            $this->info("You can now safely re-import your updated Excel sheet!");
            return 0;

        } catch (\Throwable $e) {
            $this->error("Purge failed: " . $e->getMessage());
            Log::error("Student purge failed", [
                'institution_id' => $institutionId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return 1;
        }
    }

    protected function gatherCounts(array $userIds, array $profileIds, int $institutionId, bool $clearImportLogs): array
    {
        $counts = [
            'student_users'              => count($userIds),
            'student_profiles'           => count($profileIds),
            'fee_payments'               => !empty($userIds) ? DB::table('fee_payments')->whereIn('user_id', $userIds)->count() : 0,
            'fee_period_balances'        => !empty($userIds) ? DB::table('student_fee_period_balances')->whereIn('user_id', $userIds)->count() : 0,
            'ad_hoc_fee_charges'         => !empty($userIds) ? DB::table('student_ad_hoc_charges')->whereIn('user_id', $userIds)->count() : 0,
            'admission_applications'     => !empty($userIds) ? DB::table('admission_applications')->whereIn('user_id', $userIds)->count() : 0,
            'lms_class_enrollments'      => !empty($userIds) ? DB::table('lms_class_enrollments')->whereIn('user_id', $userIds)->count() : 0,
            'attendance_records'         => !empty($userIds) ? DB::table('attendance_records')->whereIn('user_id', $userIds)->count() : 0,
            'guardian_student_links'     => !empty($userIds) ? DB::table('guardian_students')->whereIn('user_id', $userIds)->count() : 0,
            'notifications'              => !empty($userIds) ? DB::table('notifications')->where('notifiable_type', 'App\\Models\\User')->whereIn('notifiable_id', $userIds)->count() : 0,
        ];

        if ($clearImportLogs) {
            $counts['import_logs'] = DB::table('import_logs')
                ->where('institution_id', $institutionId)
                ->whereIn('module', ['students', 'existing_students', 'student_bulk_import'])
                ->count();
        }

        return $counts;
    }
}

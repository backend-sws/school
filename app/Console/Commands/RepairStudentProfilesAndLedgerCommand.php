<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Models\AdmissionApplication;
use App\Models\FeePayment;
use App\Models\StudentProfile;
use App\Models\User;

class RepairStudentProfilesAndLedgerCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'student:repair-profiles
                            {--dry-run : Simulate repair without writing to database}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Repair student profiles missing father details from applications and clean up corrupted enrollments for Ayush Kumar';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $isDryRun = (bool) $this->option('dry-run');

        if ($isDryRun) {
            $this->warn('*** DRY RUN MODE — No database changes will be committed ***');
        }

        DB::beginTransaction();

        try {
            // ─── 1. Fix Missing Father Details in Student Profiles ───────────────────
            $this->info('1. Checking student profiles with missing father details...');
            $profiles = StudentProfile::withoutGlobalScopes()
                ->where(function ($q) {
                    $q->whereNull('father_name')
                      ->orWhere('father_name', '')
                      ->orWhereNull('father_mobile')
                      ->orWhere('father_mobile', '');
                })->get();

            $repairedProfiles = 0;
            foreach ($profiles as $profile) {
                $app = AdmissionApplication::withoutGlobalScopes()
                    ->where('user_id', $profile->user_id)
                    ->latest('id')
                    ->first();

                if (!$app) {
                    continue;
                }

                $updates = [];
                if ((empty($profile->father_name) || trim($profile->father_name) === '') && !empty($app->father_name)) {
                    $updates['father_name'] = trim($app->father_name);
                }
                if ((empty($profile->father_mobile) || trim($profile->father_mobile) === '') && !empty($app->father_mobile)) {
                    $updates['father_mobile'] = trim($app->father_mobile);
                }
                if ((empty($profile->father_occupation) || trim($profile->father_occupation) === '') && !empty($app->father_occupation)) {
                    $updates['father_occupation'] = trim($app->father_occupation);
                }

                if (!empty($updates)) {
                    $this->line("  [Profile #{$profile->id}] User #{$profile->user_id} ({$app->applicant_name}): updating " . json_encode($updates));
                    if (!$isDryRun) {
                        $profile->update($updates);
                    }
                    $repairedProfiles++;
                }
            }
            $this->info("Repaired {$repairedProfiles} student profiles with father details.");

            // ─── 2. Clean up Corrupted Enrollments for User 1018 ───────────────────────
            $this->info("\n2. Checking User 1018 (Ayush Kumar) bogus Session 2 enrollments...");
            $bogusEnrollments = DB::table('lms_class_enrollments')
                ->where('user_id', 1018)
                ->whereIn('lms_class_id', [2, 5, 6])
                ->get();

            if ($bogusEnrollments->count() > 0) {
                foreach ($bogusEnrollments as $enr) {
                    $this->line("  Deleting bogus enrollment #{$enr->id} (Class ID: {$enr->lms_class_id}) from User 1018");
                }
                if (!$isDryRun) {
                    DB::table('lms_class_enrollments')
                        ->where('user_id', 1018)
                        ->whereIn('lms_class_id', [2, 5, 6])
                        ->delete();
                }
                $this->info("Removed {$bogusEnrollments->count()} corrupted enrollments from User 1018.");
            } else {
                $this->line("  No bogus enrollments found on User 1018.");
            }

            // Check orphan Payment 3125 on User 1018
            $p3125 = FeePayment::withoutGlobalScopes()->find(3125);
            if ($p3125 && (int) $p3125->user_id === 1018 && $p3125->payment_status === 'pending') {
                $this->line("  Deleting orphaned pending payment #3125 (₹{$p3125->amount}) from User 1018");
                if (!$isDryRun) {
                    $p3125->delete();
                }
            }

            // ─── 3. Invalidate Period Balances Cache ─────────────────────────────────
            $this->info("\n3. Clearing cached period balances for affected students...");
            $affectedUserIds = [1018, 1341, 1376, 1329, 1331, 1333, 1339];
            $deletedBalances = DB::table('student_fee_period_balances')
                ->whereIn('user_id', $affectedUserIds)
                ->delete();
            $this->line("  Deleted {$deletedBalances} cached period balance records.");

            if ($isDryRun) {
                DB::rollBack();
                $this->warn("\nDry run completed successfully. No changes written.");
            } else {
                DB::commit();
                $this->info("\nRepair completed and committed successfully!");
            }

            return 0;
        } catch (\Throwable $e) {
            DB::rollBack();
            $this->error("\nRepair failed with error: " . $e->getMessage());
            $this->error($e->getTraceAsString());
            return 1;
        }
    }
}

<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Models\AdmissionApplication;
use App\Models\StudentProfile;
use App\Models\User;

class MergeDuplicateStudentCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'student:merge-readmission
                            {--orig-reg= : Original student registration number (e.g. PDSEDU2025000328)}
                            {--dup-reg= : Duplicate new student registration number (e.g. PDSEDU2026000074)}
                            {--app-id= : Re-admission application ID (e.g. APP2026000168)}
                            {--dry-run : Simulate the merge without making changes to the database}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Merge a duplicate student user/profile created during re-admission back into the original student account';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $origReg = $this->option('orig-reg');
        $dupReg = $this->option('dup-reg');
        $appId = $this->option('app-id');
        $isDryRun = (bool) $this->option('dry-run');

        if (!$origReg && !$dupReg && !$appId) {
            $this->error('Please provide --orig-reg and either --dup-reg or --app-id.');
            $this->line('Example: php artisan student:merge-readmission --orig-reg=PDSEDU2025000328 --dup-reg=PDSEDU2026000074');
            return 1;
        }

        // 1. Resolve Application if app-id provided
        $app = null;
        if ($appId) {
            $app = AdmissionApplication::withoutGlobalScopes()
                ->where('application_id', $appId)
                ->orWhere('id', $appId)
                ->first();
            if (!$app) {
                $this->error("Application not found for: {$appId}");
                return 1;
            }
        }

        // 2. Resolve Duplicate Profile & User
        $dupProfile = null;
        if ($dupReg) {
            $dupProfile = StudentProfile::withoutGlobalScopes()->where('reg_no', $dupReg)->first();
        } elseif ($app) {
            $dupProfile = StudentProfile::withoutGlobalScopes()->where('user_id', $app->user_id)->first();
        }

        if (!$dupProfile) {
            $this->error("Duplicate student profile not found. Please verify --dup-reg or --app-id.");
            return 1;
        }

        $dupUser = User::withoutGlobalScopes()->find($dupProfile->user_id);
        if (!$dupUser) {
            $this->error("Duplicate user record not found for profile ID: {$dupProfile->id}");
            return 1;
        }

        // If application wasn't specified, find re-admission application for duplicate user
        if (!$app) {
            $app = AdmissionApplication::withoutGlobalScopes()
                ->where('user_id', $dupUser->id)
                ->where('application_type', 're-admission')
                ->latest('id')
                ->first();
        }

        // 3. Resolve Original Profile & User
        $origProfile = null;
        if ($origReg) {
            $origProfile = StudentProfile::withoutGlobalScopes()->where('reg_no', $origReg)->first();
        }

        if (!$origProfile) {
            $this->error("Original student profile not found for Reg No: {$origReg}");
            return 1;
        }

        $origUser = User::withoutGlobalScopes()->find($origProfile->user_id);
        if (!$origUser) {
            $this->error("Original user record not found for profile ID: {$origProfile->id}");
            return 1;
        }

        if ($origUser->id === $dupUser->id) {
            $this->error("Original and duplicate resolve to the exact same user ID ({$origUser->id}). Nothing to merge.");
            return 1;
        }

        $this->info("══════════════════════════════════════════════════════════");
        $this->info("  Re-admission Student Merge Tool");
        $this->info("══════════════════════════════════════════════════════════");
        $this->table(
            ['Role', 'User ID', 'Name', 'Reg No', 'Email', 'Mobile', 'Session ID'],
            [
                ['ORIGINAL (Keep)', $origUser->id, $origUser->name, $origProfile->reg_no, $origUser->email, $origUser->mobile, $origProfile->session_id],
                ['DUPLICATE (Merge & Delete)', $dupUser->id, $dupUser->name, $dupProfile->reg_no, $dupUser->email, $dupUser->mobile, $dupProfile->session_id],
            ]
        );

        if ($app) {
            $this->line("Target Re-admission Application: #{$app->application_id} (ID: {$app->id})");
        }

        // Inspect records to be moved
        $feePaymentsCount = DB::table('fee_payments')->where('user_id', $dupUser->id)->count();
        $feePaymentsSum = DB::table('fee_payments')->where('user_id', $dupUser->id)->sum('amount');
        $txnsCount = DB::table('transactions')->where('user_id', $dupUser->id)->count();
        $transitionsCount = DB::table('student_transitions')->where('user_id', $dupUser->id)->count();
        $enrollmentsCount = DB::table('lms_class_enrollments')->where('user_id', $dupUser->id)->count();
        $chargesCount = DB::table('student_ad_hoc_charges')->where('user_id', $dupUser->id)->count();
        $addressesCount = DB::table('student_addresses')->where('user_id', $dupUser->id)->count();

        $this->line("\nRecords to transfer from User {$dupUser->id} -> User {$origUser->id}:");
        $this->line("  • Fee Payments: {$feePaymentsCount} (Total: ₹{$feePaymentsSum})");
        $this->line("  • Transactions: {$txnsCount}");
        $this->line("  • Transitions: {$transitionsCount}");
        $this->line("  • Class Enrollments: {$enrollmentsCount}");
        $this->line("  • Ad Hoc Charges: {$chargesCount}");
        $this->line("  • Address Records: {$addressesCount}");

        if ($isDryRun) {
            $this->warn("\n[DRY RUN MODE] No changes were written to the database.");
            $this->info("Remove --dry-run flag to execute the merge.");
            return 0;
        }

        if (!$this->confirm("Are you sure you want to merge duplicate student {$dupProfile->reg_no} into {$origProfile->reg_no}?", true)) {
            $this->warn("Merge aborted by user.");
            return 0;
        }

        DB::beginTransaction();
        try {
            $prevSessionId = $origProfile->session_id;
            $prevClassId = DB::table('lms_class_enrollments')
                ->join('lms_classes', 'lms_class_enrollments.lms_class_id', '=', 'lms_classes.id')
                ->where('lms_class_enrollments.user_id', $origUser->id)
                ->where('lms_classes.session_id', $prevSessionId)
                ->value('lms_classes.id');

            // 1. Update Admission Application
            if ($app) {
                $prefs = is_array($app->subject_preferences) ? $app->subject_preferences : (json_decode($app->subject_preferences, true) ?? []);
                $prefs['student_profile_id'] = $origProfile->id;
                $prefs['from_session_id'] = $prevSessionId;
                if ($prevClassId) {
                    $prefs['from_class_id'] = $prevClassId;
                }
                DB::table('admission_applications')->where('id', $app->id)->update([
                    'user_id' => $origUser->id,
                    'subject_preferences' => json_encode($prefs),
                ]);
            }

            // 2. Move Fee Payments
            DB::table('fee_payments')->where('user_id', $dupUser->id)->update([
                'user_id' => $origUser->id,
            ]);

            // 3. Move Transactions
            DB::table('transactions')->where('user_id', $dupUser->id)->update([
                'user_id' => $origUser->id,
            ]);

            // 4. Move Student Transitions
            $transitionUpdate = [
                'user_id' => $origUser->id,
                'student_profile_id' => $origProfile->id,
            ];
            if ($prevClassId) {
                $transitionUpdate['from_class_id'] = $prevClassId;
            }
            DB::table('student_transitions')->where('user_id', $dupUser->id)->update($transitionUpdate);

            // 5. Update LMS Class Enrollments
            if ($prevClassId) {
                DB::table('lms_class_enrollments')
                    ->where('user_id', $origUser->id)
                    ->where('lms_class_id', $prevClassId)
                    ->update(['status' => 'readmitted']);
            }

            // Move duplicate user's new active enrollment to original user
            $dupEnrollments = DB::table('lms_class_enrollments')->where('user_id', $dupUser->id)->get();
            foreach ($dupEnrollments as $enr) {
                $exists = DB::table('lms_class_enrollments')
                    ->where('user_id', $origUser->id)
                    ->where('lms_class_id', $enr->lms_class_id)
                    ->exists();
                if (!$exists) {
                    DB::table('lms_class_enrollments')->where('id', $enr->id)->update(['user_id' => $origUser->id]);
                } else {
                    DB::table('lms_class_enrollments')->where('id', $enr->id)->delete();
                }
            }

            // 6. Student Ad Hoc Charges
            DB::table('student_ad_hoc_charges')->where('user_id', $dupUser->id)->update([
                'user_id' => $origUser->id,
            ]);

            // 7. Student Addresses
            // If original had empty addresses, delete them in favor of the duplicate's filled ones
            $origEmptyAddrs = DB::table('student_addresses')
                ->where('user_id', $origUser->id)
                ->whereNull('village_mohalla')
                ->whereNull('address')
                ->pluck('id');
            if ($origEmptyAddrs->isNotEmpty()) {
                DB::table('student_addresses')->whereIn('id', $origEmptyAddrs)->delete();
            }

            DB::table('student_addresses')->where('user_id', $dupUser->id)->update([
                'user_id' => $origUser->id,
                'student_profile_id' => $origProfile->id,
            ]);

            // 8. Guardian Links
            $existingGuardianIds = DB::table('guardian_students')->where('user_id', $origUser->id)->pluck('guardian_id')->toArray();
            $dupGuardianLinks = DB::table('guardian_students')->where('user_id', $dupUser->id)->get();
            foreach ($dupGuardianLinks as $link) {
                if (!in_array($link->guardian_id, $existingGuardianIds)) {
                    DB::table('guardian_students')->where('id', $link->id)->update(['user_id' => $origUser->id]);
                } else {
                    DB::table('guardian_students')->where('id', $link->id)->delete();
                    // Sync updated contact info to existing guardian record if blank
                    if (!empty($dupUser->mobile)) {
                        DB::table('guardians')->where('id', $link->guardian_id)->whereNull('mobile')->update([
                            'mobile' => $dupUser->mobile,
                        ]);
                    }
                }
            }

            // 9. Notifications, Audit Logs, Communication Logs
            DB::table('notifications')
                ->where('notifiable_type', 'App\Models\User')
                ->where('notifiable_id', $dupUser->id)
                ->update(['notifiable_id' => $origUser->id]);

            DB::table('audit_logs')->where('user_id', $dupUser->id)->update(['user_id' => $origUser->id]);
            DB::table('communication_logs')->where('recipient_user_id', $dupUser->id)->update(['recipient_user_id' => $origUser->id]);

            // 10. User Roles for duplicate user
            DB::table('user_roles')->where('user_id', $dupUser->id)->delete();

            // 11. Update Original Profile with the new session and academic info from duplicate
            $profileUpdate = [
                'session_id' => $dupProfile->session_id,
                'stream_id' => $dupProfile->stream_id,
                'roll_no' => $dupProfile->roll_no,
                'father_name' => $dupProfile->father_name ?? $origProfile->father_name,
                'mother_name' => $dupProfile->mother_name ?? $origProfile->mother_name,
                'father_occupation' => $dupProfile->father_occupation ?? $origProfile->father_occupation,
                'dob' => $dupProfile->dob ?? $origProfile->dob,
                'gender' => $dupProfile->gender ?? $origProfile->gender,
                'category' => $dupProfile->category ?? $origProfile->category,
                'religion' => $dupProfile->religion ?? $origProfile->religion,
                'mobile' => $dupProfile->mobile ?? $origProfile->mobile,
                'address' => $dupProfile->address ?? $origProfile->address,
                'city' => $dupProfile->city ?? $origProfile->city,
                'state' => $dupProfile->state ?? $origProfile->state,
                'pincode' => $dupProfile->pincode ?? $origProfile->pincode,
                'fee_regulation_profile_id' => $dupProfile->fee_regulation_profile_id ?? $origProfile->fee_regulation_profile_id,
                'previous_school_name' => $dupProfile->previous_school_name ?? $origProfile->previous_school_name,
                'app_no' => $app?->application_id ?? $origProfile->app_no,
            ];
            if (!empty($dupProfile->guardian_snapshot)) {
                $profileUpdate['guardian_snapshot'] = $dupProfile->guardian_snapshot;
            }
            DB::table('student_profiles')->where('id', $origProfile->id)->update($profileUpdate);

            // 12. Delete Duplicate Profile
            DB::table('student_profiles')->where('id', $dupProfile->id)->delete();

            // 13. Release duplicate credentials and update original user contact details
            $newEmail = $dupUser->email;
            $newMobile = $dupUser->mobile;

            DB::table('users')->where('id', $dupUser->id)->update([
                'email' => 'deleted-' . $dupUser->id . '-' . uniqid() . '@internal.local',
                'mobile' => null,
            ]);

            $userUpdate = [];
            if (!empty($newMobile)) {
                $userUpdate['mobile'] = $newMobile;
            }
            if (!empty($newEmail) && !str_contains($newEmail, '@internal.local')) {
                $userUpdate['email'] = $newEmail;
                $userUpdate['contact_email'] = $newEmail;
            }
            if (!empty($userUpdate)) {
                DB::table('users')->where('id', $origUser->id)->update($userUpdate);
            }

            // 14. Delete Duplicate User
            DB::table('users')->where('id', $dupUser->id)->delete();

            DB::commit();
            $this->info("\n✓ Successfully merged duplicate student into original student record!");
            $this->info("✓ Original Reg No [{$origProfile->reg_no}] preserved with updated Session [{$dupProfile->session_id}].");
            $this->info("✓ All fee payments, ledger, and enrollments transferred to User ID: {$origUser->id}.");
            return 0;
        } catch (\Throwable $e) {
            DB::rollBack();
            $this->error("\nMerge failed! Transaction rolled back completely: " . $e->getMessage());
            return 1;
        }
    }
}

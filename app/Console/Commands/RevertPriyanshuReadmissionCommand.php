<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Models\AdmissionApplication;
use App\Models\FeePayment;
use App\Models\LmsClassEnrollment;
use App\Models\StudentProfile;
use App\Models\StudentTransition;
use App\Models\ReadmissionDetail;

class RevertPriyanshuReadmissionCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admission:revert-duplicate-readmission {--app_id=APP2026000299} {--reg_no=PDSEDU2026000020}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Revert duplicate re-admission for Priyanshu Kumar (or specified app_id/reg_no) back to Class IV';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $appId = $this->option('app_id');
        $regNo = $this->option('reg_no');

        $this->info("Looking up duplicate re-admission application (App: {$appId}, RegNo: {$regNo})...");

        $app = AdmissionApplication::where('application_id', $appId)
            ->orWhere('id', 334)
            ->first();

        if (!$app && $regNo) {
            $profile = StudentProfile::where('reg_no', $regNo)->first();
            if ($profile) {
                $app = AdmissionApplication::where('user_id', $profile->user_id)
                    ->where('application_type', 're-admission')
                    ->latest('id')
                    ->first();
            }
        }

        if (!$app) {
            $this->error("No duplicate re-admission application found for App ID: {$appId} / Reg No: {$regNo}");
            return 1;
        }

        $userId = $app->user_id;
        $this->info("Found Application #{$app->application_id} (ID: {$app->id}) for User ID: {$userId}");

        DB::transaction(function () use ($app, $userId) {
            // 1. Reject / cancel duplicate application
            $app->update([
                'process_status' => 'rejected',
                'remarks' => 'Reverted duplicate re-admission for Class VI. Student restored to Class IV.',
            ]);
            $this->line("• Application #{$app->application_id} marked as rejected.");

            // 2. Cancel linked payments for this duplicate application
            $cancelledPayments = FeePayment::where('payable_entity_type', 'admission_application')
                ->where('payable_entity_id', $app->id)
                ->update([
                    'payment_status' => 'cancelled',
                    'remarks' => 'Cancelled: duplicate re-admission payment for Class VI reverted.',
                ]);
            $this->line("• {$cancelledPayments} payment(s) marked as cancelled.");

            // 3. Remove Class VI enrollment
            $deletedEnr = LmsClassEnrollment::where('user_id', $userId)
                ->where('lms_class_id', 9) // Class VI
                ->delete();
            $this->line("• Class VI enrollment removed ({$deletedEnr} record).");

            // 4. Ensure Class IV enrollment is active
            $enr4 = LmsClassEnrollment::where('user_id', $userId)
                ->where('lms_class_id', 7) // Class IV
                ->first();
            if ($enr4) {
                $enr4->update(['status' => 'active']);
                $this->line("• Class IV enrollment #{$enr4->id} set to active.");
            }

            // 5. Restore StudentProfile to Class IV
            StudentProfile::where('user_id', $userId)->update([
                'stream_id' => 7,
                'fee_regulation_profile_id' => 27,
            ]);
            $this->line("• StudentProfile restored to Class IV (Stream 7, FeeProfile 27).");

            // 6. Restore StudentTransition to Class IV
            StudentTransition::where('user_id', $userId)
                ->where('to_session_id', 2)
                ->update([
                    'to_class_id' => 7,
                    'remarks' => 'Re-admission via application APP2026000295',
                ]);
            $this->line("• StudentTransition to_class_id updated to 7.");

            // 7. Delete ReadmissionDetail for this application
            ReadmissionDetail::where('admission_application_id', $app->id)->delete();
            $this->line("• ReadmissionDetail for App #{$app->id} removed.");
        });

        $this->info("✓ Successfully reverted duplicate re-admission! Student restored to Class IV – Section A.");
        return 0;
    }
}

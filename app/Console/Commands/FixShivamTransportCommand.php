<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\AdmissionApplication;
use App\Models\StudentProfile;

class FixShivamTransportCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admission:fix-shivam-transport {--reg_no=PDSEDU2025000236}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fix expired transport amount prefilled in admission application for Shivam Kumar (or specified reg_no)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $regNo = $this->option('reg_no');
        $this->info("Searching student profile with Reg No: {$regNo}...");

        $sp = StudentProfile::where('reg_no', $regNo)->first();
        if (!$sp) {
            $this->error("Student profile not found for Reg No: {$regNo}");
            return 1;
        }

        $this->info("Found student: {$sp->user?->name} (User ID: {$sp->user_id})");

        $app = AdmissionApplication::where('user_id', $sp->user_id)
            ->where('application_type', 're-admission')
            ->latest('id')
            ->first();

        if (!$app) {
            $this->error("No re-admission application found for user ID: {$sp->user_id}");
            return 1;
        }

        $this->info("Found Application #{$app->application_id} (ID: {$app->id})");
        $this->line("Current Amount: {$app->amount} | Transport Amount: {$app->transport_amount} | Due: {$app->due_amount}");

        if ($app->transport_amount <= 0) {
            $this->info("Transport amount is already 0. No changes needed.");
            return 0;
        }

        // Clean transport from fee_breakdown
        $cleanBreakdown = array_values(array_filter($app->fee_breakdown ?? [], function ($item) {
            $name = strtolower(is_array($item['name'] ?? '') ? ($item['name']['en'] ?? '') : ($item['name'] ?? ''));
            return ($item['type'] ?? '') !== 'transport' && ($item['category'] ?? '') !== 'services' && !str_contains($name, 'transport');
        }));

        $paid = (float) ($app->cash_amount + $app->online_amount);
        $newTotal = 5880.00; // Books (3250) + Re-Reg (1000) + Copy (330) + Monthly (1300)
        $newDue = max(0, $newTotal - (float) ($app->discount_amount ?? 0) - $paid);

        $app->update([
            'transport_amount' => 0,
            'transport_route_id' => null,
            'transport_stop_id' => null,
            'amount' => $newTotal,
            'due_amount' => $newDue,
            'fee_breakdown' => $cleanBreakdown,
        ]);

        $this->info("SUCCESS: Application #{$app->application_id} updated.");
        $this->line("New Total: {$app->amount} | Transport: 0 | Paid: {$paid} | Due: {$app->due_amount}");
        return 0;
    }
}

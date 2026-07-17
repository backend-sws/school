<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\FeeRegulationProfile;

class AssignFeeProfileCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'student:assign-fee-profile {student_name} {profile_name}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Manually assign a specific fee regulation profile to a student by name';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $studentName = $this->argument('student_name');
        $profileName = $this->argument('profile_name');

        // Find Profile
        $profile = FeeRegulationProfile::where('name', 'LIKE', "%{$profileName}%")->first();
        if (!$profile) {
            $this->error("Fee Profile matching '{$profileName}' not found.");
            return;
        }
        
        $this->info("Found Fee Profile: {$profile->name}");

        // Find Student
        $users = User::whereHas('roles', function($q) {
                $q->where('key', 'student');
            })
            ->where('name', 'LIKE', "%{$studentName}%")
            ->get();
            
        if ($users->isEmpty()) {
            $this->error("No student found matching '{$studentName}'.");
            return;
        }

        if ($users->count() > 1) {
            $this->warn("Found multiple students matching '{$studentName}':");
            foreach ($users as $u) {
                $this->line("- {$u->name} (Reg: {$u->studentProfile->reg_no})");
            }
            $this->error("Please provide a more specific name.");
            return;
        }

        $user = $users->first();
        $this->info("Found Student: {$user->name}");

        // Update Profile
        if ($user->studentProfile) {
            $user->studentProfile->fee_regulation_profile_id = $profile->id;
            $user->studentProfile->save();
            
            // Delete unpaid generated fee balances so they recalculate with the new profile
            $deleted = \App\Models\StudentFeePeriodBalance::where('user_id', $user->id)
                ->where('paid_amount', '<=', 0)
                ->delete();
                
            $this->info("Successfully assigned '{$profile->name}' to '{$user->name}'.");
            if ($deleted > 0) {
                $this->info("Cleared {$deleted} unpaid fee ledgers. The ledger will automatically recalculate with the new fee profile upon next visit.");
            }
        } else {
            $this->error("Student does not have a profile.");
        }
    }
}

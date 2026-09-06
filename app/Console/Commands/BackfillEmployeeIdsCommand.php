<?php

namespace App\Console\Commands;

use App\Models\StaffProfile;
use Illuminate\Console\Command;

class BackfillEmployeeIdsCommand extends Command
{
    protected $signature = 'staff:backfill-employee-ids';
    protected $description = 'Backfill missing employee IDs for staff profiles';

    public function handle(): int
    {
        $this->info('Starting Employee ID backfill...');

        $institutions = StaffProfile::withoutGlobalScopes()
            ->select('institution_id')
            ->distinct()
            ->pluck('institution_id');

        $totalUpdated = 0;

        foreach ($institutions as $instId) {
            if (!$instId) continue;

            $profiles = StaffProfile::withoutGlobalScopes()
                ->where('institution_id', $instId)
                ->orderBy('id', 'asc')
                ->get();

            // Find current max number
            $maxNumber = 0;
            foreach ($profiles as $p) {
                if ($p->employee_id && preg_match('/EMP-(\d+)/i', $p->employee_id, $matches)) {
                    $num = (int) $matches[1];
                    if ($num > $maxNumber) {
                        $maxNumber = $num;
                    }
                }
            }

            foreach ($profiles as $p) {
                if (empty(trim($p->employee_id ?? ''))) {
                    $maxNumber++;
                    $newId = sprintf('EMP-%03d', $maxNumber);
                    $p->employee_id = $newId;
                    $p->saveQuietly();
                    $totalUpdated++;
                    $this->line("Assigned {$newId} to user ID {$p->user_id} (Profile {$p->id})");
                }
            }
        }

        $this->info("Completed! Total {$totalUpdated} staff profiles updated with Employee IDs.");
        return Command::SUCCESS;
    }
}

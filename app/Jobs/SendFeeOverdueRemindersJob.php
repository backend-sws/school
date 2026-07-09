<?php

namespace App\Jobs;

use App\Models\LmsClassEnrollment;
use App\Notifications\FeeOverdueReminderNotification;
use App\Services\FeeCollectionService;
use App\Services\FeeRecipientResolver;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendFeeOverdueRemindersJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct()
    {
        $this->onQueue('notifications');
    }

    public function handle(FeeCollectionService $feeCollectionService, FeeRecipientResolver $recipientResolver): void
    {
        $institutionIds = $feeCollectionService->getInstitutionIdsWithFeeCollection();
        if (empty($institutionIds)) {
            return;
        }

        foreach ($institutionIds as $institutionId) {
            $settings = $feeCollectionService->getSettings($institutionId);
            $cutoffDate = now()->startOfDay()->subDays((int) ($settings['overdue_reminder_after_days'] ?? 7));

            $enrollments = LmsClassEnrollment::query()
                ->where('role', 'student')
                ->where('status', 'active')
                ->whereHas('lmsClass', fn ($q) => $q->where('institution_id', $institutionId))
                ->with('user')
                ->get();

            foreach ($enrollments as $enrollment) {
                $student = $enrollment->user;
                $matrixResult = $feeCollectionService->getStudentLedgerMatrix($student, $institutionId);
                if (isset($matrixResult['error'])) {
                    continue;
                }

                foreach (($matrixResult['matrix'] ?? []) as $row) {
                    $dueDate = \Carbon\Carbon::parse($row['due_date']);
                    if ($dueDate->gte($cutoffDate)) {
                        continue;
                    }
                    if ((float) ($row['balance'] ?? 0) <= 0) {
                        continue;
                    }

                    $periodDues = $feeCollectionService->getPeriodDuesForStudent(
                        $student,
                        (string) $row['month_key'],
                        (float) ($matrixResult['periodExpected'] ?? 0),
                        $matrixResult
                    );
                    $ledger = $feeCollectionService->ledgerBreakdownForReminder($periodDues);
                    $recipients = $recipientResolver->recipientsForStudent($student);
                    foreach ($recipients as $notifiable) {
                        $notifiable->notify(new FeeOverdueReminderNotification(
                            $student,
                            (string) $row['month_key'],
                            $dueDate,
                            (float) ($periodDues['expected'] ?? 0),
                            (float) ($periodDues['balance'] ?? 0),
                            $institutionId,
                            $ledger,
                        ));
                    }
                }
            }
        }
    }
}

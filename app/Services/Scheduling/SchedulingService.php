<?php

namespace App\Services\Scheduling;

use App\Models\Timetable;
use App\Models\TimetableEntry;
use App\Contracts\ScheduleableActivity;
use Illuminate\Support\Facades\DB;
use Exception;

class SchedulingService
{
    protected ConflictChecker $conflictChecker;

    public function __construct(ConflictChecker $conflictChecker)
    {
        $this->conflictChecker = $conflictChecker;
    }

    /**
     * Bulk save timetable entries for a specific timetable.
     */
    public function saveEntries(Timetable $timetable, array $entries): array
    {
        return DB::transaction(function () use ($timetable, $entries) {
            $results = [
                'saved' => 0,
                'errors' => []
            ];

            foreach ($entries as $index => $data) {
                try {
                    // 1. Validation Logic
                    $conflicts = $this->conflictChecker->getConflicts(
                        $timetable->institution_id,
                        $data['period_slot_id'],
                        $data['day_of_week'],
                        $data['teacher_id'] ?? null,
                        $data['room_id'] ?? null,
                        null, // Target Group ID from timetable
                        $data['id'] ?? null
                    );

                    if ($conflicts->isNotEmpty()) {
                        $results['errors'][] = [
                            'index' => $index,
                            'message' => $conflicts->first()['message'],
                            'conflicts' => $conflicts
                        ];
                        continue;
                    }

                    // 2. Persist
                    $entry = TimetableEntry::updateOrCreate(
                        ['id' => $data['id'] ?? null],
                        [
                            'timetable_id' => $timetable->id,
                            'period_slot_id' => $data['period_slot_id'],
                            'day_of_week' => $data['day_of_week'],
                            'room_id' => $data['room_id'] ?? null,
                            'activity_type' => $data['activity_type'],
                            'activity_id' => $data['activity_id'],
                            'teacher_id' => $data['teacher_id'] ?? null,
                        ]
                    );

                    $results['saved']++;
                } catch (Exception $e) {
                    $results['errors'][] = [
                        'index' => $index,
                        'message' => $e->getMessage()
                    ];
                }
            }

            return $results;
        });
    }

    /**
     * Clone an existing timetable to a new session or class.
     */
    public function cloneTimetable(Timetable $source, array $overrides): Timetable
    {
        return DB::transaction(function () use ($source, $overrides) {
            $newTimetable = $source->replicate()->fill($overrides);
            $newTimetable->status = 'draft';
            $newTimetable->save();

            foreach ($source->entries as $entry) {
                $newEntry = $entry->replicate();
                $newEntry->timetable_id = $newTimetable->id;
                $newEntry->save();
            }

            return $newTimetable;
        });
    }
}

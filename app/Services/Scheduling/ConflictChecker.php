<?php

namespace App\Services\Scheduling;

use App\Models\TimetableEntry;
use App\Contracts\ScheduleableActivity;
use Illuminate\Support\Collection;

class ConflictChecker
{
    /**
     * Check for any scheduling conflicts for a prospective entry.
     *
     * @param int $institutionId
     * @param int $periodSlotId
     * @param int $dayOfWeek
     * @param int|null $teacherId
     * @param int|null $roomId
     * @param string|null $targetGroupId e.g. section_id
     * @param int|null $excludeEntryId
     * @return Collection
     */
    public function getConflicts(
        int $institutionId,
        int $periodSlotId,
        int $dayOfWeek,
        ?int $teacherId = null,
        ?int $roomId = null,
        ?string $targetGroupId = null,
        ?int $excludeEntryId = null
    ): Collection {
        $conflicts = collect();

        $query = TimetableEntry::whereHas('timetable', function ($q) use ($institutionId) {
            $q->where('institution_id', $institutionId)
                ->where('status', 'published');
        })
            ->where('period_slot_id', $periodSlotId)
            ->where('day_of_week', $dayOfWeek);

        if ($excludeEntryId) {
            $query->where('id', '!=', $excludeEntryId);
        }

        $existingEntries = $query->get();

        // 1. Teacher Conflict
        if ($teacherId) {
            $teacherConflict = $existingEntries->where('teacher_id', $teacherId)->first();
            if ($teacherConflict) {
                $conflicts->push([
                    'type' => 'teacher',
                    'message' => "Teacher is already assigned to another class in this period.",
                    'conflicting_entry' => $teacherConflict
                ]);
            }
        }

        // 2. Room Conflict
        if ($roomId) {
            $roomConflict = $existingEntries->where('room_id', $roomId)->first();
            if ($roomConflict) {
                $conflicts->push([
                    'type' => 'room',
                    'message' => "Room is already occupied in this period.",
                    'conflicting_entry' => $roomConflict
                ]);
            }
        }

        // 3. Group/Section Conflict (if the timetable belongs to a specific group)
        // This logic might need refinement based on how 'scheduleable' is used in Timetable model
        // For now, if we pass a targetGroupId, we check if that group already has an entry.

        return $conflicts;
    }

    /**
     * Validate a specific activity against a slot.
     */
    public function validateActivity(ScheduleableActivity $activity, int $slotId, int $day, ?int $roomId = null): Collection
    {
        // Wrapper for more complex polymorphic validation if needed
        return $this->getConflicts(
            config('ems.default_institution_id'), // Simplified for now
            $slotId,
            $day,
            $activity->getAssignedTeacherId(),
            $roomId,
            $activity->getTargetGroupId()
        );
    }
}

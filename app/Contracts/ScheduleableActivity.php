<?php

namespace App\Contracts;

/**
 * Interface for any activity that can be scheduled on a timetable.
 * e.g., ClassSubjectAllocation, ExamPaper, SpecialEvent
 */
interface ScheduleableActivity
{
    /**
     * Get the type of activity for conflict checking (e.g., 'academic', 'exam').
     */
    public function getSchedulingType(): string;

    /**
     * Get the teacher/performer assigned to this activity.
     */
    public function getAssignedTeacherId(): ?int;

    /**
     * Get the duration in minutes.
     */
    public function getDurationMinutes(): int;

    /**
     * Get unique identifier for the group being scheduled (e.g., section id).
     */
    public function getTargetGroupId(): string;

    /**
     * Get human-readable label for the activity.
     */
    public function getActivityLabel(): string;
}

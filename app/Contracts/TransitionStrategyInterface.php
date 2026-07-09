<?php

namespace App\Contracts;

use App\Models\StudentProfile;
use App\Models\StudentTransition;

interface TransitionStrategyInterface
{
    /**
     * Validate that the student can undergo this transition.
     *
     * @throws \InvalidArgumentException
     */
    public function validate(StudentProfile $student, array $data): void;

    /**
     * Execute the transition: update profile, enrollments, and create detail record.
     */
    public function execute(StudentTransition $transition, array $data): void;

    /**
     * Rollback the transition: restore previous state.
     */
    public function rollback(StudentTransition $transition): void;
}

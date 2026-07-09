<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Collection;

/**
 * Resolve notifiable recipients for fee-related notifications (guardian + student).
 */
class FeeRecipientResolver
{
    /**
     * Get users that should receive fee notifications for a student.
     * Prefer guardian (linked user_id); also include student so both get in-app + push.
     *
     * @return Collection<int, User>
     */
    public function recipientsForStudent(User $student): Collection
    {
        $recipients = collect();

        $guardians = $student->guardians()->with('user')->get();
        foreach ($guardians as $guardian) {
            if ($guardian->user_id && $guardian->user) {
                $recipients->push($guardian->user);
            }
        }

        $recipients = $recipients->unique('id')->values();

        if ($recipients->isEmpty()) {
            $recipients->push($student);
        } else {
            $recipients->push($student);
            $recipients = $recipients->unique('id')->values();
        }

        return $recipients;
    }
}

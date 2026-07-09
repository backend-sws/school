<?php

namespace App\Services;

use App\Models\StudentProfile;
use App\Models\TransportAssignment;
use App\Models\TransportRouteStop;
use App\Support\InstitutionContext;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class TransportAssignmentService
{
    /**
     * Validate that the stop belongs to the route (exists in transport_route_stops).
     */
    public function stopBelongsToRoute(int $transportRouteId, int $transportStopId): bool
    {
        return TransportRouteStop::where('transport_route_id', $transportRouteId)
            ->where('transport_stop_id', $transportStopId)
            ->exists();
    }

    /**
     * Validate that the user belongs to the active institution (students only: has StudentProfile).
     */
    public function userBelongsToInstitution(int $userId, ?int $institutionId = null): bool
    {
        $institutionId = $institutionId ?? InstitutionContext::getActiveInstitutionId();

        return StudentProfile::where('user_id', $userId)
            ->where('institution_id', $institutionId)
            ->exists();
    }

    /**
     * Auto-end any active assignment for the user before creating a new one.
     * Sets effective_until to the day before new effective_from.
     */
    public function autoEndPreviousAssignment(int $userId, string $effectiveFrom, ?int $institutionId = null): void
    {
        $institutionId = $institutionId ?? InstitutionContext::getActiveInstitutionId();
        $dayBefore = Carbon::parse($effectiveFrom)->subDay()->format('Y-m-d');

        TransportAssignment::where('institution_id', $institutionId)
            ->where('user_id', $userId)
            ->where(function ($q) {
                $q->whereNull('effective_until')
                    ->orWhere('effective_until', '>=', now()->toDateString());
            })
            ->update(['effective_until' => $dayBefore]);
    }

    /**
     * Create assignment with validation and auto-end of previous.
     *
     * @return TransportAssignment
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function createAssignment(array $data, ?int $institutionId = null): TransportAssignment
    {
        $institutionId = $institutionId ?? InstitutionContext::getActiveInstitutionId();

        if (! $this->stopBelongsToRoute($data['transport_route_id'], $data['transport_stop_id'])) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'transport_stop_id' => ['The selected stop does not belong to this route.'],
            ]);
        }

        if (! $this->userBelongsToInstitution($data['user_id'], $institutionId)) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'user_id' => ['The selected user is not a student of this institution.'],
            ]);
        }

        $this->autoEndPreviousAssignment($data['user_id'], $data['effective_from'], $institutionId);

        $data['institution_id'] = $institutionId;

        // Fetch stop fare on route
        $routeStop = \App\Models\TransportRouteStop::where('transport_route_id', $data['transport_route_id'])
            ->where('transport_stop_id', $data['transport_stop_id'])
            ->first();
        $data['monthly_amount'] = $routeStop ? (float) $routeStop->fare : 0.00;

        return TransportAssignment::create($data);
    }
}

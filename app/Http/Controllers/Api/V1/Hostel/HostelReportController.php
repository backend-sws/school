<?php

namespace App\Http\Controllers\Api\V1\Hostel;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\Hostel;
use App\Models\HostelRoom;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HostelReportController extends BaseController
{
    public function summary(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('view_hostel_reports')) {
            return $this->forbidden('You do not have permission to view hostel reports.');
        }

        $currentInstitutionId = \App\Support\InstitutionContext::getActiveInstitutionId();

        $summary = [
            'total_hostels' => Hostel::where('institution_id', $currentInstitutionId)->count(),
            'total_rooms' => HostelRoom::where('institution_id', $currentInstitutionId)->count(),
            'total_capacity' => HostelRoom::where('institution_id', $currentInstitutionId)->sum('bed_count') ?? 0,
            'occupied_beds' => DB::table('hostel_beds')
                ->join('hostel_rooms', 'hostel_beds.hostel_room_id', '=', 'hostel_rooms.id')
                ->where('hostel_rooms.institution_id', $currentInstitutionId)
                ->where('hostel_beds.status', 'occupied')
                ->count(),
            'maintenance_beds' => DB::table('hostel_beds')
                ->join('hostel_rooms', 'hostel_beds.hostel_room_id', '=', 'hostel_rooms.id')
                ->where('hostel_rooms.institution_id', $currentInstitutionId)
                ->where('hostel_beds.status', 'maintenance')
                ->count(),
            'by_type' => Hostel::select('type', DB::raw('count(*) as count'))
                ->where('institution_id', $currentInstitutionId)
                ->groupBy('type')
                ->get(),
        ];

        $summary['vacant_beds'] = $summary['total_capacity'] - $summary['occupied_beds'] - $summary['maintenance_beds'];
        $summary['occupancy_rate'] = $summary['total_capacity'] > 0 
            ? round(($summary['occupied_beds'] / $summary['total_capacity']) * 100, 1) 
            : 0;

        return $this->success($summary);
    }

    public function occupancy(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('view_hostel_reports')) {
            return $this->forbidden('You do not have permission to view hostel reports.');
        }

        $currentInstitutionId = \App\Support\InstitutionContext::getActiveInstitutionId();

        // Get occupancy per hostel
        $hostels = Hostel::where('institution_id', $currentInstitutionId)
            ->select('id', 'name', 'code', 'type')
            ->withCount(['rooms', 'beds'])
            ->withCount(['beds as occupied_beds_count' => function ($q) {
                $q->where('status', 'occupied');
            }])
            ->get()
            ->map(function ($hostel) {
                $capacity = $hostel->beds_count;
                $occupied = $hostel->occupied_beds_count;
                return [
                    'id' => $hostel->id,
                    'name' => $hostel->name,
                    'code' => $hostel->code,
                    'type' => $hostel->type,
                    'capacity' => $capacity,
                    'occupied' => $occupied,
                    'vacant' => $capacity - $occupied,
                    'occupancy_pct' => $capacity > 0 ? round(($occupied / $capacity) * 100, 1) : 0,
                ];
            });

        return $this->success(['hostels' => $hostels]);
    }
}

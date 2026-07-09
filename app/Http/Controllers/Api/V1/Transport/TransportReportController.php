<?php

namespace App\Http\Controllers\Api\V1\Transport;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\TransportAssignment;
use App\Models\TransportRoute;
use App\Models\TransportVehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransportReportController extends BaseController
{
    public function manifest(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('view_transport_reports')) {
            return $this->forbidden('You do not have permission to view transport reports.');
        }

        $request->validate([
            'route_id' => 'required|exists:transport_routes,id',
            'date' => 'nullable|date',
        ]);

        $routeId = $request->route_id;
        $date = $request->date ?? now()->toDateString();

        $route = TransportRoute::with(['routeStops' => function ($q) {
            $q->with('transportStop')->orderBy('sequence');
        }])->findOrFail($routeId);

        $assignments = TransportAssignment::where('transport_route_id', $routeId)
            ->where('effective_from', '<=', $date)
            ->where(function ($q) use ($date) {
                $q->whereNull('effective_until')->orWhere('effective_until', '>=', $date);
            })
            ->with(['user:id,name,email', 'transportStop:id,name,code'])
            ->get();

        $byStop = [];
        foreach ($route->routeStops as $rs) {
            $byStop[$rs->transport_stop_id] = [
                'sequence' => $rs->sequence,
                'stop' => $rs->transportStop,
                'arrival_time' => $rs->arrival_time,
                'departure_time' => $rs->departure_time,
                'students' => [],
            ];
        }
        foreach ($assignments as $a) {
            if (isset($byStop[$a->transport_stop_id])) {
                $byStop[$a->transport_stop_id]['students'][] = [
                    'user_id' => $a->user_id,
                    'name' => $a->user->name ?? '',
                    'email' => $a->user->email ?? null,
                ];
            }
        }
        ksort($byStop);

        return $this->success([
            'route' => $route->only(['id', 'name', 'code']),
            'date' => $date,
            'stops' => array_values($byStop),
        ]);
    }

    public function occupancy(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('view_transport_reports')) {
            return $this->forbidden('You do not have permission to view transport reports.');
        }

        $date = $request->date ?? now()->toDateString();

        $vehicles = TransportVehicle::with(['transportRoute:id,name,code'])
            ->whereNotNull('transport_route_id')
            ->get();

        $counts = TransportAssignment::where('effective_from', '<=', $date)
            ->where(function ($q) use ($date) {
                $q->whereNull('effective_until')->orWhere('effective_until', '>=', $date);
            })
            ->whereIn('transport_route_id', $vehicles->pluck('transport_route_id')->filter()->unique())
            ->select('transport_route_id', DB::raw('count(*) as assigned_count'))
            ->groupBy('transport_route_id')
            ->pluck('assigned_count', 'transport_route_id');

        $result = $vehicles->map(function ($v) use ($counts) {
            $assigned = $counts->get($v->transport_route_id, 0);

            return [
                'id' => $v->id,
                'registration_number' => $v->registration_number,
                'capacity' => $v->capacity,
                'route' => $v->transportRoute ? $v->transportRoute->only(['id', 'name', 'code']) : null,
                'assigned_count' => $assigned,
                'occupancy_pct' => $v->capacity > 0 ? round($assigned / $v->capacity * 100, 1) : 0,
            ];
        });

        return $this->success([
            'date' => $date,
            'vehicles' => $result,
        ]);
    }
}

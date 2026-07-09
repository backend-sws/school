<?php

namespace App\Http\Controllers\Api\V1\Transport;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\TransportRoute;
use App\Models\TransportRouteStop;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TransportRouteController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('view_transport_routes')) {
            return $this->forbidden('You do not have permission to view transport routes.');
        }

        $query = TransportRoute::query()->withCount('routeStops');

        if ($request->filled('search')) {
            $search = '%' . strtolower($request->search) . '%';
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(name) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(COALESCE(code, \'\')) LIKE ?', [$search]);
            });
        }

        if ($request->filled('is_active') && $request->input('is_active') !== 'all') {
            $query->where('is_active', $request->boolean('is_active'));
        }

        if ($request->filled('stop_id') && $request->input('stop_id') !== 'all') {
            $query->whereHas('stops', function ($q) use ($request) {
                $q->where('transport_stops.id', $request->input('stop_id'));
            });
        }

        return $this->paginatedWithMap(
            $query->orderBy('name', 'asc')->paginate($request->input('per_page', 15)),
            'passthrough'
        );
    }

    public function store(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('create_transport_routes')) {
            return $this->forbidden('You do not have permission to create transport routes.');
        }
        $currentInstitutionId = \App\Support\InstitutionContext::getActiveInstitutionId();

        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'code' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('transport_routes', 'code')->where('institution_id', $currentInstitutionId),
            ],
            'description' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        $route = TransportRoute::create($validated);

        return $this->created($route, 'Route created successfully');
    }

    public function show(Request $request, TransportRoute $transport_route): JsonResponse
    {
        if (! $request->user()->hasAbility('view_transport_routes')) {
            return $this->forbidden('You do not have permission to view transport routes.');
        }

        $transport_route->load(['routeStops.transportStop']);

        return $this->successWithMap($transport_route, 'passthrough');
    }

    public function update(Request $request, TransportRoute $transport_route): JsonResponse
    {
        if (! $request->user()->hasAbility('update_transport_routes')) {
            return $this->forbidden('You do not have permission to update transport routes.');
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:150',
            'code' => [
                'sometimes',
                'nullable',
                'string',
                'max:50',
                Rule::unique('transport_routes', 'code')
                    ->where('institution_id', $transport_route->institution_id)
                    ->ignore($transport_route->id),
            ],
            'description' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        $transport_route->update($validated);

        return $this->successWithMap($transport_route, 'passthrough', 'Route updated successfully');
    }

    public function destroy(Request $request, TransportRoute $transport_route): JsonResponse
    {
        if (! $request->user()->hasAbility('delete_transport_routes')) {
            return $this->forbidden('You do not have permission to delete transport routes.');
        }

        if ($transport_route->assignments()->exists()) {
            return $this->error('Cannot delete route that has assignments. Reassign or end assignments first.', 422);
        }

        $transport_route->delete();

        return $this->success(null, 'Route deleted');
    }

    /** Route stops (pivot) */
    public function indexStops(Request $request, TransportRoute $transport_route): JsonResponse
    {
        if (! $request->user()->hasAbility('view_transport_routes')) {
            return $this->forbidden('You do not have permission to view transport routes.');
        }

        $stops = $transport_route->routeStops()->with('transportStop')->orderBy('sequence')->get();

        return $this->success($stops);
    }

    public function storeStop(Request $request, TransportRoute $transport_route): JsonResponse
    {
        if (! $request->user()->hasAbility('update_transport_routes')) {
            return $this->forbidden('You do not have permission to update transport routes.');
        }

        $validated = $request->validate([
            'transport_stop_id' => 'required|exists:transport_stops,id',
            'sequence' => 'required|integer|min:1',
            'arrival_time' => 'nullable|date_format:H:i',
            'departure_time' => 'nullable|date_format:H:i',
            'fare' => 'nullable|numeric|min:0',
        ]);

        $validated['transport_route_id'] = $transport_route->id;

        $routeStop = TransportRouteStop::create($validated);

        return $this->created($routeStop->load('transportStop'), 'Stop added to route');
    }

    public function updateStops(Request $request, TransportRoute $transport_route): JsonResponse
    {
        if (! $request->user()->hasAbility('update_transport_routes')) {
            return $this->forbidden('You do not have permission to update transport routes.');
        }

        $validated = $request->validate([
            'stops' => 'required|array',
            'stops.*.transport_stop_id' => 'required|exists:transport_stops,id',
            'stops.*.sequence' => 'required|integer|min:1',
            'stops.*.arrival_time' => 'nullable|string',
            'stops.*.departure_time' => 'nullable|string',
            'stops.*.fare' => 'nullable|numeric|min:0',
        ]);

        $transport_route->routeStops()->delete();

        foreach ($validated['stops'] as $i => $row) {
            TransportRouteStop::create([
                'transport_route_id' => $transport_route->id,
                'transport_stop_id' => $row['transport_stop_id'],
                'sequence' => $row['sequence'],
                'arrival_time' => $row['arrival_time'] ?? null,
                'departure_time' => $row['departure_time'] ?? null,
                'fare' => $row['fare'] ?? 0.00,
            ]);
        }

        $stops = $transport_route->routeStops()->with('transportStop')->orderBy('sequence')->get();

        return $this->success($stops, 'Route stops updated');
    }

    public function destroyStop(Request $request, TransportRoute $transport_route, int $route_stop_id): JsonResponse
    {
        if (! $request->user()->hasAbility('update_transport_routes')) {
            return $this->forbidden('You do not have permission to update transport routes.');
        }

        $routeStop = TransportRouteStop::where('transport_route_id', $transport_route->id)
            ->where('id', $route_stop_id)
            ->firstOrFail();

        $routeStop->delete();

        return $this->success(null, 'Stop removed from route');
    }
}

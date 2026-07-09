<?php

namespace App\Http\Controllers\Api\V1\Transport;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\TransportAssignment;
use App\Services\TransportAssignmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TransportAssignmentController extends BaseController
{
    public function __construct(
        protected TransportAssignmentService $assignmentService
    ) {}

    public function index(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('view_transport_assignments')) {
            return $this->forbidden('You do not have permission to view transport assignments.');
        }

        $institutionId = \App\Support\InstitutionContext::getActiveInstitutionId();
        if (!$institutionId) {
            return $this->error('Institution context required.', 422);
        }

        $query = TransportAssignment::query()
            ->with([
                'user:id,name,email',
                'user.studentProfile',
                'user.studentProfile.currentEnrollments.lmsClass:id,name,code',
                'transportRoute:id,name,code',
                'transportStop:id,name,code'
            ])
            ->where('institution_id', $institutionId);

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('route_id') && $request->route_id !== 'all') {
            $query->where('transport_route_id', $request->route_id);
        }

        if ($request->filled('stop_id') && $request->stop_id !== 'all') {
            $query->where('transport_stop_id', $request->stop_id);
        }

        if ($request->filled('class_id') && $request->class_id !== 'all') {
            $classId = $request->class_id;
            $query->whereHas('user', function ($q) use ($classId) {
                $q->whereHas('studentProfile.currentEnrollments', function ($q2) use ($classId) {
                    $q2->where('lms_class_id', $classId);
                });
            });
        }

        if ($request->filled('vehicle_id') && $request->vehicle_id !== 'all') {
            $vehicleRouteIds = \App\Models\TransportVehicle::where('id', $request->vehicle_id)->pluck('transport_route_id');
            $query->whereIn('transport_route_id', $vehicleRouteIds);
        }

        if ($request->filled('search')) {
            $search = '%' . strtolower($request->search) . '%';
            $query->whereHas('user', function ($q) use ($search) {
                $q->whereRaw('LOWER(name) LIKE ?', [$search]);
            });
        }

        if ($request->filled('effective_on')) {
            $date = $request->effective_on;
            $query->where('effective_from', '<=', $date)
                ->where(function ($q) use ($date) {
                    $q->whereNull('effective_until')->orWhere('effective_until', '>=', $date);
                });
        }

        $paginator = $query->orderBy('effective_from', 'desc')->paginate($request->input('per_page', 15));
        
        $data = app(\App\Services\ApiResponseMapService::class)->filterCollection($paginator->items(), 'passthrough');

        // Apply fallback route stop fare if monthly_amount is 0 or null
        foreach ($paginator->items() as $index => $item) {
            $monthlyAmount = (float) ($item->monthly_amount ?? 0);
            if ($monthlyAmount === 0.0) {
                $routeStop = \App\Models\TransportRouteStop::where('transport_route_id', $item->transport_route_id)
                    ->where('transport_stop_id', $item->transport_stop_id)
                    ->first();
                $monthlyAmount = $routeStop ? (float) $routeStop->fare : 0.00;
            }
            if (isset($data[$index])) {
                $data[$index]['monthly_amount'] = $monthlyAmount;
            }
        }

        // Analytics calculation
        $activeAssignments = TransportAssignment::where('institution_id', $institutionId)
            ->where(function ($q) {
                $q->whereNull('effective_until')->orWhere('effective_until', '>=', now()->toDateString());
            })->get();

        $monthlyRevenue = 0.0;
        foreach ($activeAssignments as $assign) {
            $amount = (float) ($assign->monthly_amount ?? 0);
            if ($amount === 0.0) {
                $routeStop = \App\Models\TransportRouteStop::where('transport_route_id', $assign->transport_route_id)
                    ->where('transport_stop_id', $assign->transport_stop_id)
                    ->first();
                $amount = $routeStop ? (float) $routeStop->fare : 0.00;
            }
            $monthlyRevenue += $amount;
        }

        $stats = [
            'total_assignments' => $activeAssignments->count(),
            'monthly_revenue' => $monthlyRevenue,
            'total_routes' => (int) \App\Models\TransportRoute::where('institution_id', $institutionId)->where('is_active', true)->count(),
            'total_vehicles' => (int) \App\Models\TransportVehicle::where('institution_id', $institutionId)->where('status', 'active')->count(),
        ];

        return response()->json([
            'success' => true,
            'message' => 'Success',
            'data' => $data,
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'stats' => $stats,
            ],
        ]);
    }

    public function export(Request $request)
    {
        if (! $request->user()->hasAbility('view_transport_assignments')) {
            return $this->forbidden('You do not have permission to view transport assignments.');
        }

        $institutionId = \App\Support\InstitutionContext::getActiveInstitutionId();
        if (!$institutionId) {
            return $this->error('Institution context required.', 422);
        }

        return \Maatwebsite\Excel\Facades\Excel::download(
            new \App\Exports\TransportAssignmentExport($institutionId, $request->all()),
            'transport_assignments.xlsx'
        );
    }

    public function store(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('create_transport_assignments')) {
            return $this->forbidden('You do not have permission to create transport assignments.');
        }

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'transport_route_id' => 'required|exists:transport_routes,id',
            'transport_stop_id' => 'required|exists:transport_stops,id',
            'effective_from' => 'required|date',
            'effective_until' => 'nullable|date|after_or_equal:effective_from',
            'remarks' => 'nullable|string',
        ]);

        try {
            $assignment = $this->assignmentService->createAssignment($validated);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationError($e->errors(), $e->getMessage());
        }

        $assignment->load(['user:id,name,email', 'transportRoute:id,name,code', 'transportStop:id,name,code']);

        return $this->created($assignment, 'Assignment created successfully');
    }

    public function show(Request $request, TransportAssignment $transport_assignment): JsonResponse
    {
        if (! $request->user()->hasAbility('view_transport_assignments')) {
            return $this->forbidden('You do not have permission to view transport assignments.');
        }

        $transport_assignment->load(['user', 'transportRoute', 'transportStop']);

        return $this->successWithMap($transport_assignment, 'passthrough');
    }

    public function update(Request $request, TransportAssignment $transport_assignment): JsonResponse
    {
        if (! $request->user()->hasAbility('update_transport_assignments')) {
            return $this->forbidden('You do not have permission to update transport assignments.');
        }

        $validated = $request->validate([
            'transport_route_id' => 'sometimes|exists:transport_routes,id',
            'transport_stop_id' => 'sometimes|exists:transport_stops,id',
            'effective_from' => 'sometimes|date',
            'effective_until' => 'nullable|date',
            'remarks' => 'nullable|string',
        ]);

        if (isset($validated['transport_route_id'], $validated['transport_stop_id'])) {
            if (! $this->assignmentService->stopBelongsToRoute($validated['transport_route_id'], $validated['transport_stop_id'])) {
                return $this->validationError(['transport_stop_id' => ['The selected stop does not belong to this route.']], 'Validation failed');
            }
            $routeStop = \App\Models\TransportRouteStop::where('transport_route_id', $validated['transport_route_id'])
                ->where('transport_stop_id', $validated['transport_stop_id'])
                ->first();
            $validated['monthly_amount'] = $routeStop ? (float) $routeStop->fare : 0.00;
        } else if (isset($validated['transport_route_id'])) {
            $routeStop = \App\Models\TransportRouteStop::where('transport_route_id', $validated['transport_route_id'])
                ->where('transport_stop_id', $transport_assignment->transport_stop_id)
                ->first();
            if ($routeStop) {
                $validated['monthly_amount'] = (float) $routeStop->fare;
            }
        } else if (isset($validated['transport_stop_id'])) {
            $routeStop = \App\Models\TransportRouteStop::where('transport_route_id', $transport_assignment->transport_route_id)
                ->where('transport_stop_id', $validated['transport_stop_id'])
                ->first();
            if ($routeStop) {
                $validated['monthly_amount'] = (float) $routeStop->fare;
            }
        }

        $transport_assignment->update($validated);

        return $this->successWithMap($transport_assignment->fresh(['user', 'transportRoute', 'transportStop']), 'passthrough', 'Assignment updated successfully');
    }

    public function destroy(Request $request, TransportAssignment $transport_assignment): JsonResponse
    {
        if (! $request->user()->hasAbility('delete_transport_assignments')) {
            return $this->forbidden('You do not have permission to delete transport assignments.');
        }

        $transport_assignment->delete();

        return $this->success(null, 'Assignment deleted');
    }
}

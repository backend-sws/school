<?php

namespace App\Http\Controllers\Api\V1\Hostel;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\HostelMessPlan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HostelMessPlanController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('view_hostel_mess_plans')) {
            return $this->forbidden('You do not have permission to view mess plans.');
        }

        $institutionId = \App\Support\InstitutionContext::getActiveInstitutionId();
        if (!$institutionId) {
            return $this->error('Institution context required.', 422);
        }

        $query = HostelMessPlan::query()->where('institution_id', $institutionId);

        if ($request->filled('search')) {
            $search = '%' . strtolower($request->search) . '%';
            $query->whereRaw('LOWER(name) LIKE ?', [$search]);
        }

        if ($request->filled('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        if ($request->filled('is_active') && $request->is_active !== 'all') {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $paginator = $query->orderBy('name', 'asc')->paginate($request->input('per_page', 15));

        $data = app(\App\Services\ApiResponseMapService::class)->filterCollection($paginator->items(), 'passthrough');

        // Dynamic stats calculations
        $stats = [
            'total_plans' => (int) HostelMessPlan::where('institution_id', $institutionId)->count(),
            'active_plans' => (int) HostelMessPlan::where('institution_id', $institutionId)->where('is_active', true)->count(),
            'veg_plans' => (int) HostelMessPlan::where('institution_id', $institutionId)->where('type', 'veg')->count(),
            'non_veg_plans' => (int) HostelMessPlan::where('institution_id', $institutionId)->whereIn('type', ['non-veg', 'both'])->count(),
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
        if (! $request->user()->hasAbility('view_hostel_mess_plans')) {
            return $this->forbidden('You do not have permission to view mess plans.');
        }

        $institutionId = \App\Support\InstitutionContext::getActiveInstitutionId();
        if (!$institutionId) {
            return $this->error('Institution context required.', 422);
        }

        return \Maatwebsite\Excel\Facades\Excel::download(
            new \App\Exports\HostelMessPlanExport($institutionId, $request->all()),
            'hostel_mess_plans.xlsx'
        );
    }

    public function store(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('create_hostel_mess_plans')) {
            return $this->forbidden('You do not have permission to create mess plans.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'type' => 'required|string|in:veg,non-veg,both',
            'monthly_fee' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'meal_schedule' => 'nullable|array',
            'is_active' => 'nullable|boolean',
        ]);

        $currentInstitutionId = \App\Support\InstitutionContext::getActiveInstitutionId();
        $validated['institution_id'] = $currentInstitutionId;

        $messPlan = HostelMessPlan::create($validated);

        return $this->created($messPlan, 'Mess plan created successfully');
    }

    public function show(Request $request, HostelMessPlan $hostel_mess_plan): JsonResponse
    {
        if (! $request->user()->hasAbility('view_hostel_mess_plans')) {
            return $this->forbidden('You do not have permission to view mess plans.');
        }

        return $this->successWithMap($hostel_mess_plan, 'passthrough');
    }

    public function update(Request $request, HostelMessPlan $hostel_mess_plan): JsonResponse
    {
        if (! $request->user()->hasAbility('update_hostel_mess_plans')) {
            return $this->forbidden('You do not have permission to update mess plans.');
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:150',
            'type' => 'sometimes|string|in:veg,non-veg,both',
            'monthly_fee' => 'sometimes|numeric|min:0',
            'description' => 'nullable|string',
            'meal_schedule' => 'nullable|array',
            'is_active' => 'nullable|boolean',
        ]);

        $hostel_mess_plan->update($validated);

        return $this->successWithMap($hostel_mess_plan, 'passthrough', 'Mess plan updated successfully');
    }

    public function destroy(Request $request, HostelMessPlan $hostel_mess_plan): JsonResponse
    {
        if (! $request->user()->hasAbility('delete_hostel_mess_plans')) {
            return $this->forbidden('You do not have permission to delete mess plans.');
        }

        $hostel_mess_plan->delete();

        return $this->success(null, 'Mess plan deleted');
    }
}

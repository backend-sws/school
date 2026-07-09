<?php

namespace App\Http\Controllers\Api\V1\Hostel;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\HostelAllocation;
use App\Models\HostelBed;
use App\Models\HostelRoom;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HostelAllocationController extends BaseController
{
    public function index(Request $request, \App\Services\FeeCollectionService $feeCollectionService): JsonResponse
    {
        if (! $request->user()->hasAbility('view_hostel_allocations')) {
            return $this->forbidden('You do not have permission to view hostel allocations.');
        }

        $institutionId = \App\Support\InstitutionContext::getActiveInstitutionId();
        if (!$institutionId) {
            return $this->error('Institution context required.', 422);
        }

        $query = HostelAllocation::query()
            ->where('institution_id', $institutionId)
            ->with([
                'user:id,name,email',
                'user.studentProfile',
                'user.studentProfile.stream:id,name,code',
                'user.studentProfile.currentEnrollments.lmsClass:id,name,code',
                'room:id,room_number,hostel_id,type,monthly_fee',
                'room.hostel:id,name,code',
                'bed:id,bed_label'
            ]);

        if ($request->filled('hostel_id')) {
            $query->whereHas('room', function ($q) use ($request) {
                $q->where('hostel_id', $request->hostel_id);
            });
        }

        if ($request->filled('hostel_room_id')) {
            $query->where('hostel_room_id', $request->hostel_room_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = '%' . strtolower($request->search) . '%';
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', function ($q2) use ($search) {
                    $q2->whereRaw('LOWER(name) LIKE ?', [$search])
                        ->orWhereRaw('LOWER(email) LIKE ?', [$search]);
                })->orWhereHas('room', function ($q3) use ($search) {
                    $q3->whereRaw('LOWER(room_number) LIKE ?', [$search]);
                });
            });
        }

        $paginator = $query->orderBy('created_at', 'desc')->paginate($request->input('per_page', 15));

        $data = app(\App\Services\ApiResponseMapService::class)->filterCollection($paginator->items(), 'passthrough');

        foreach ($data as $index => $item) {
            $allocation = $paginator->items()[$index];
            $student = $allocation->user;
            if ($student) {
                $matrix = $feeCollectionService->getStudentLedgerMatrix($student, $institutionId);
                $due = isset($matrix['error']) ? 0.0 : (float) ($matrix['total_pending'] ?? 0.0);
                $data[$index]['due_amount'] = $due;
            } else {
                $data[$index]['due_amount'] = 0.0;
            }
        }

        // Dynamic stats calculations (Option 1: COALESCE fallback)
        $stats = [
            'total_allocations' => (int) HostelAllocation::where('institution_id', $institutionId)->where('status', 'active')->count(),
            'monthly_revenue' => (float) HostelAllocation::where('hostel_allocations.institution_id', $institutionId)
                ->where('hostel_allocations.status', 'active')
                ->leftJoin('hostel_rooms', 'hostel_allocations.hostel_room_id', '=', 'hostel_rooms.id')
                ->sum(DB::raw('COALESCE(hostel_allocations.monthly_amount, hostel_rooms.monthly_fee, 0)')),
            'new_this_month' => (int) HostelAllocation::where('institution_id', $institutionId)
                ->where('status', 'active')
                ->where('check_in_date', '>=', now()->startOfMonth()->toDateString())
                ->count(),
            'total_beds_capacity' => (int) \App\Models\HostelBed::whereHas('room.hostel', function($q) use ($institutionId) {
                $q->where('institution_id', $institutionId);
            })->count(),
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
        if (! $request->user()->hasAbility('view_hostel_allocations')) {
            return $this->forbidden('You do not have permission to view hostel allocations.');
        }

        $institutionId = \App\Support\InstitutionContext::getActiveInstitutionId();
        if (!$institutionId) {
            return $this->error('Institution context required.', 422);
        }

        return \Maatwebsite\Excel\Facades\Excel::download(
            new \App\Exports\HostelAllocationExport($institutionId, $request->all()),
            'hostel_allocations.xlsx'
        );
    }

    public function store(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('create_hostel_allocations')) {
            return $this->forbidden('You do not have permission to create hostel allocations.');
        }

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'hostel_room_id' => 'required|exists:hostel_rooms,id',
            'hostel_bed_id' => 'nullable|exists:hostel_beds,id',
            'check_in_date' => 'required|date',
            'remarks' => 'nullable|string',
        ]);

        $currentInstitutionId = \App\Support\InstitutionContext::getActiveInstitutionId();
        $validated['institution_id'] = $currentInstitutionId;
        $validated['status'] = 'active';

        // Check if user already has an active allocation
        $existingAllocation = HostelAllocation::where('user_id', $validated['user_id'])
            ->active()
            ->first();

        if ($existingAllocation) {
            return $this->error('User already has an active hostel allocation.', 422);
        }

        return DB::transaction(function () use ($validated) {
            // Check room capacity
            $room = HostelRoom::withCount(['beds as occupied_beds_count' => function ($q) {
                $q->where('status', 'occupied');
            }])->lockForUpdate()->findOrFail($validated['hostel_room_id']);

            if ($room->occupied_beds_count >= $room->bed_count) {
                return $this->error('The selected room is fully occupied.', 422);
            }

            // Assign monthly_amount from the room's fee
            $validated['monthly_amount'] = (float) ($room->monthly_fee ?? 0.0);

            // If bed is specified, check if it's vacant
            if (isset($validated['hostel_bed_id'])) {
                $bed = HostelBed::where('hostel_room_id', $room->id)
                    ->where('id', $validated['hostel_bed_id'])
                    ->lockForUpdate()
                    ->firstOrFail();

                if ($bed->status !== 'vacant') {
                    return $this->error('The selected bed is not vacant.', 422);
                }
            } else {
                // Auto-assign first vacant bed
                $bed = HostelBed::where('hostel_room_id', $room->id)
                    ->where('status', 'vacant')
                    ->lockForUpdate()
                    ->first();
                
                if (!$bed) {
                    return $this->error('No vacant beds found in the selected room.', 422);
                }
                
                $validated['hostel_bed_id'] = $bed->id;
            }

            // Update bed status
            $bed->update(['status' => 'occupied']);

            // Create allocation
            $allocation = HostelAllocation::create($validated);

            $allocation->load([
                'user:id,name,email',
                'room:id,room_number,hostel_id,type',
                'room.hostel:id,name,code',
                'bed:id,bed_label'
            ]);

            return $this->created($allocation, 'Allocation created successfully');
        });
    }

    public function show(Request $request, HostelAllocation $hostel_allocation): JsonResponse
    {
        if (! $request->user()->hasAbility('view_hostel_allocations')) {
            return $this->forbidden('You do not have permission to view hostel allocations.');
        }

        $hostel_allocation->load([
            'user',
            'room',
            'room.hostel',
            'bed'
        ]);

        return $this->successWithMap($hostel_allocation, 'passthrough');
    }

    public function update(Request $request, HostelAllocation $hostel_allocation): JsonResponse
    {
        if (! $request->user()->hasAbility('update_hostel_allocations')) {
            return $this->forbidden('You do not have permission to update hostel allocations.');
        }

        $validated = $request->validate([
            'check_out_date' => 'nullable|date|after_or_equal:check_in_date',
            'status' => 'sometimes|string|in:active,checked_out,cancelled',
            'remarks' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($validated, $hostel_allocation) {
            $oldStatus = $hostel_allocation->status;
            
            $hostel_allocation->update($validated);

            // Handle bed status based on allocation status changes
            if (isset($validated['status']) && $oldStatus === 'active' && in_array($validated['status'], ['checked_out', 'cancelled'])) {
                if ($hostel_allocation->hostel_bed_id) {
                    HostelBed::where('id', $hostel_allocation->hostel_bed_id)->update(['status' => 'vacant']);
                }
                
                // If checking out and no date provided, set it to today
                if ($validated['status'] === 'checked_out' && empty($hostel_allocation->check_out_date)) {
                    $hostel_allocation->update(['check_out_date' => now()->toDateString()]);
                }
            }

            return $this->successWithMap($hostel_allocation, 'passthrough', 'Allocation updated successfully');
        });
    }

    public function destroy(Request $request, HostelAllocation $hostel_allocation): JsonResponse
    {
        if (! $request->user()->hasAbility('delete_hostel_allocations')) {
            return $this->forbidden('You do not have permission to delete hostel allocations.');
        }

        return DB::transaction(function () use ($hostel_allocation) {
            // Free up the bed if the allocation is active
            if ($hostel_allocation->status === 'active' && $hostel_allocation->hostel_bed_id) {
                HostelBed::where('id', $hostel_allocation->hostel_bed_id)->update(['status' => 'vacant']);
            }

            $hostel_allocation->delete();

            return $this->success(null, 'Allocation deleted');
        });
    }
}

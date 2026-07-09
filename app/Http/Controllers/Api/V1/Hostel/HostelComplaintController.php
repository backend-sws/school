<?php

namespace App\Http\Controllers\Api\V1\Hostel;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\HostelComplaint;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HostelComplaintController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('view_hostel_complaints')) {
            return $this->forbidden('You do not have permission to view hostel complaints.');
        }

        $institutionId = \App\Support\InstitutionContext::getActiveInstitutionId();
        if (!$institutionId) {
            return $this->error('Institution context required.', 422);
        }

        $query = HostelComplaint::query()
            ->where('institution_id', $institutionId)
            ->with([
                'user:id,name,email',
                'user.studentProfile',
                'user.studentProfile.stream:id,name,code',
                'room:id,room_number,hostel_id',
                'room.hostel:id,name,code'
            ]);

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('hostel_id') && $request->hostel_id !== 'all') {
            $query->whereHas('room', function ($q) use ($request) {
                $q->where('hostel_id', $request->hostel_id);
            });
        }
        
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('search')) {
            $search = '%' . strtolower($request->search) . '%';
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(subject) LIKE ?', [$search])
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->whereRaw('LOWER(name) LIKE ?', [$search]);
                    });
            });
        }

        $paginator = $query->orderBy('created_at', 'desc')->paginate($request->input('per_page', 15));

        $data = app(\App\Services\ApiResponseMapService::class)->filterCollection($paginator->items(), 'passthrough');

        // Dynamic stats calculations
        $stats = [
            'total_complaints' => (int) HostelComplaint::where('institution_id', $institutionId)->count(),
            'open_complaints' => (int) HostelComplaint::where('institution_id', $institutionId)->where('status', 'open')->count(),
            'in_progress_complaints' => (int) HostelComplaint::where('institution_id', $institutionId)->where('status', 'in_progress')->count(),
            'resolved_complaints' => (int) HostelComplaint::where('institution_id', $institutionId)->whereIn('status', ['resolved', 'closed'])->count(),
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
        if (! $request->user()->hasAbility('view_hostel_complaints')) {
            return $this->forbidden('You do not have permission to view hostel complaints.');
        }

        $institutionId = \App\Support\InstitutionContext::getActiveInstitutionId();
        if (!$institutionId) {
            return $this->error('Institution context required.', 422);
        }

        return \Maatwebsite\Excel\Facades\Excel::download(
            new \App\Exports\HostelComplaintExport($institutionId, $request->all()),
            'hostel_complaints.xlsx'
        );
    }

    public function store(Request $request): JsonResponse
    {
        // Users can create complaints for themselves, admins can create for anyone
        if (! $request->user()->hasAbility('create_hostel_complaints') && ! $request->user()->hasAbility('portal')) {
            return $this->forbidden('You do not have permission to create hostel complaints.');
        }

        $validated = $request->validate([
            'user_id' => 'sometimes|exists:users,id',
            'hostel_room_id' => 'required|exists:hostel_rooms,id',
            'subject' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $currentInstitutionId = \App\Support\InstitutionContext::getActiveInstitutionId();
        $validated['institution_id'] = $currentInstitutionId;
        $validated['status'] = 'open';
        
        // If from student portal, force user_id to self
        if (! $request->user()->hasAbility('create_hostel_complaints')) {
            $validated['user_id'] = $request->user()->id;
        } elseif (!isset($validated['user_id'])) {
            $validated['user_id'] = $request->user()->id;
        }

        $complaint = HostelComplaint::create($validated);

        return $this->created($complaint, 'Complaint logged successfully');
    }

    public function show(Request $request, HostelComplaint $hostel_complaint): JsonResponse
    {
        if (! $request->user()->hasAbility('view_hostel_complaints') && $hostel_complaint->user_id !== $request->user()->id) {
            return $this->forbidden('You do not have permission to view this complaint.');
        }

        $hostel_complaint->load([
            'user:id,name,email',
            'room:id,room_number,hostel_id',
            'room.hostel:id,name,code'
        ]);

        return $this->successWithMap($hostel_complaint, 'passthrough');
    }

    public function update(Request $request, HostelComplaint $hostel_complaint): JsonResponse
    {
        if (! $request->user()->hasAbility('update_hostel_complaints')) {
            return $this->forbidden('You do not have permission to update hostel complaints.');
        }

        $validated = $request->validate([
            'status' => 'required|string|in:open,in_progress,resolved,closed',
        ]);

        if (in_array($validated['status'], ['resolved', 'closed']) && !in_array($hostel_complaint->status, ['resolved', 'closed'])) {
            $validated['resolved_at'] = now();
        } elseif (in_array($validated['status'], ['open', 'in_progress'])) {
            $validated['resolved_at'] = null;
        }

        $hostel_complaint->update($validated);

        return $this->successWithMap($hostel_complaint, 'passthrough', 'Complaint status updated');
    }

    public function destroy(Request $request, HostelComplaint $hostel_complaint): JsonResponse
    {
        if (! $request->user()->hasAbility('update_hostel_complaints')) { // Typically delete uses update or specific delete perm
            return $this->forbidden('You do not have permission to delete hostel complaints.');
        }

        $hostel_complaint->delete();

        return $this->success(null, 'Complaint deleted');
    }
}

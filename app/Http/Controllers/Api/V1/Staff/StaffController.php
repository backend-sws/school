<?php

namespace App\Http\Controllers\Api\V1\Staff;

use App\Http\Controllers\Api\V1\BaseController;
use App\Services\StaffService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StaffController extends BaseController
{
    public function __construct(
        protected StaffService $staffService
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $paginator = $this->staffService->listStaff($request);
        return $this->paginatedWithMap($paginator, 'passthrough');
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'email' => 'required|email|unique:users',
            'password' => 'nullable|string|min:8',
            'role_id' => 'required|exists:roles,id',
            'category' => 'required|integer',
            'mobile' => 'nullable|string|max:15',
            'photo_url' => 'nullable|string|max:500',
            'status' => 'nullable|integer|in:0,1,2',
            'send_invitation' => 'nullable|boolean',
            'department_ids' => 'nullable|array',
            'department_ids.*' => 'integer|exists:departments,id',
            'subject_ids' => 'nullable|array',
            'subject_ids.*' => 'integer|exists:subjects,id',
        ]);

        $staff = $this->staffService->createStaff($validated);
        return $this->created($staff, 'Staff created successfully');
    }

    public function show(int $staff): JsonResponse
    {
        $user = $this->staffService->show($staff);
        return $this->successWithMap($user, 'passthrough');
    }

    public function update(Request $request, int $staff): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:150',
            'mobile' => 'nullable|string|max:15',
            'status' => 'sometimes|integer|in:0,1,2',
            'photo_url' => 'nullable|string|max:500',
            'role_id' => 'sometimes|nullable|exists:roles,id',
            'category' => 'sometimes|nullable|integer',
            'department_ids' => 'nullable|array',
            'department_ids.*' => 'integer|exists:departments,id',
            'subject_ids' => 'nullable|array',
            'subject_ids.*' => 'integer|exists:subjects,id',
        ]);

        $user = $this->staffService->update($staff, $validated);
        return $this->successWithMap($user, 'passthrough', 'Staff updated successfully');
    }

    public function resendInvitation(int $staff): JsonResponse
    {
        $user = $this->staffService->resendInvitation($staff);
        return $this->success($user, 'Invitation email resent successfully');
    }

    public function destroy(int $staff): JsonResponse
    {
        $this->staffService->delete($staff);
        return $this->success(null, 'Staff deleted successfully');
    }
}

<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Api\V1\BaseController;
use App\Enums\InstitutionType;
use App\Models\Institution;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserController extends BaseController
{
    /**
     * @OA\Get(
     * path="/users",
     * summary="List all users with roles and filters",
     * tags={"Users"},
     * @OA\Parameter(name="status", in="query", @OA\Schema(type="integer", enum={0,1,2})),
     * @OA\Parameter(name="role", in="query", description="Filter by role key (e.g., admin, student)", @OA\Schema(type="string")),
     * @OA\Parameter(name="search", in="query", @OA\Schema(type="string")),
     * @OA\Response(response=200, description="List of users")
     * )
     */
    public function index(Request $request): JsonResponse
    {

        $query = User::with(['roles', 'studentProfile.stream']);

        // 0. Scope to current institution via users.institution_id
        $institutionId = $request->input('institution_id', config('ems.default_institution_id'));
        if ($institutionId) {
            $query->where('users.institution_id', $institutionId);
            
            if ($request->filled('role')) {
                $query->whereHas('roles', function ($q) use ($request) {
                    $q->where('roles.key', $request->role);
                });
            }
        } elseif ($request->filled('role')) {
            // No institution scope — just filter by role (fallback for super-admin views)
            $roleKey = $request->role;
            $query->whereHas('roles', function ($q) use ($roleKey) {
                $q->where('key', $roleKey);
            });
        }

        // 1. Filter by Status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // 2. Search by Name or Email 
        if ($request->filled('search')) {
            $search = '%' . strtolower($request->search) . '%';
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(name) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(email) LIKE ?', [$search]);
            });
        }

        return $this->paginatedWithMap(
            $query->latest()->paginate($request->input('per_page', 15)),
            'passthrough'
        );
    }

    /**
     * @OA\Post(
     * path="/users",
     * summary="Create a user",
     * tags={"Users"},
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"name", "email", "password"},
     * @OA\Property(property="name", type="string", example="John Doe"),
     * @OA\Property(property="email", type="string", example="oK9v3@example.com"),
     * @OA\Property(property="password", type="string", example="password"),
     * @OA\Property(property="mobile", type="string", example="1234567890"),
     * @OA\Property(property="designation", type="string", example="Manager"),
     * @OA\Property(property="status", type="integer", example=1)
     * )
     * ),
     * @OA\Response(response=201, description="User created")
     * )
     */
    public function store(Request $request): JsonResponse
    {

        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
            'mobile' => 'nullable|string|max:15',
            'status' => 'nullable|integer|in:0,1,2',
            'photo_url' => 'nullable|string|max:500',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $user = User::create($validated);

        return $this->successWithMap($user, 'passthrough', 'User created successfully', 201);
    }

    /**
     * @OA\Get(
     *     path="/users/{id}",
     *     summary="Get a user",
     *     tags={"Users"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="User details")
     * )
     */
    public function show(User $user): JsonResponse
    {
        return $this->successWithMap($user->load('roles'), 'passthrough');
    }

    /**
     * @OA\Put(
     *     path="/users/{id}",
     *     summary="Update a user",
     *     tags={"Users"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/User")),
     *     @OA\Response(response=200, description="User updated")
     * )     
     * @OA\Schema(
     *     schema="User",
     *     @OA\Property(property="name", type="string", example="John Doe"),
     *     @OA\Property(property="email", type="string", example="oK9v3@example.com"),
     *     @OA\Property(property="password", type="string", example="password"),
     *     @OA\Property(property="mobile", type="string", example="1234567890"),
     *     @OA\Property(property="designation", type="string", example="Manager"),
     *     @OA\Property(property="status", type="integer", example=1)
     * )
     */
    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:150',
            'email' => 'sometimes|email|max:255',
            'password' => 'sometimes|string|min:8',
            'mobile' => 'nullable|string|max:15',
            'status' => 'sometimes|integer|in:0,1,2',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return $this->successWithMap($user, 'passthrough', 'User updated successfully');
    }

    /**
     * @OA\Delete(
     *     path="/users/{id}",
     *     summary="Delete a user",
     *     tags={"Users"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="User deleted")
     * )
     */
    public function destroy(User $user): JsonResponse
    {
        if ($user->id === auth()->id()) {
            return $this->error('You cannot delete your own account.', 403);
        }
        $user->delete();
        return $this->success(null, 'User deleted successfully');
    }

    /**
     * @OA\Post(
     * path="/users/{user}/roles",
     * summary="Assign a role to a specific user",
     * description="Assigns a role (like Admin, HOD, Staff) with an optional scope (Global, Institution, Department).",
     * tags={"Users"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(
     * name="user",
     * in="path",
     * description="ID of the user",
     * required=true,
     * @OA\Schema(type="integer", example=1)
     * ),
     * @OA\RequestBody(
     * required=true,
     * description="Role assignment details",
     * @OA\JsonContent(
     * required={"role_id"},
     * @OA\Property(property="role_id", type="integer", example=3, description="ID from roles table"),
     * @OA\Property(property="institution_id", type="integer", nullable=true, example=1, description="ID of the institution to scope this role to; null for global")
 * )
 * ),
     * @OA\Response(
     * response=200,
     * description="Role assigned successfully",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=true),
     * @OA\Property(property="message", type="string", example="Role assigned successfully")
     * )
     * ),
     * @OA\Response(response=422, description="Validation Error"),
     * @OA\Response(response=404, description="User not found")
     * )
     */
    public function assignRole(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'role_id' => 'required|exists:roles,id',
            'institution_id' => 'nullable|integer|exists:institutions,id',
        ]);

        $role = Role::findOrFail($validated['role_id']);

        $protectedRoleKeys = ['super_admin', 'college_admin'];
        if (in_array($role->key, $protectedRoleKeys, true)) {
            return $this->error('This role cannot be assigned via the API.', 403);
        }

        $institutionId = $validated['institution_id'] ?? null;

        // Super admin is the only role allowed global scope; all others must be institution-scoped.
        if ($role->key === 'super_admin') {
            $institutionId = null;
        } elseif ($institutionId === null) {
            return $this->error('Non–super-admin roles require an institution_id.', 422);
        }

        DB::table('user_roles')->insertOrIgnore([
            'user_id' => $user->id,
            'role_id' => $validated['role_id'],
            'institution_id' => $institutionId,
            'assigned_by' => $request->user()->id,
        ]);

        return $this->success(null, 'Role assigned successfully');
    }

    /**
     * @OA\Delete(
     *     path="/users/{user}/roles/{role}",
     *     summary="Remove role from user",
     *     tags={"Users"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Response(response=200, description="Role removed")
     * )
     */
    public function removeRole(User $user, int $role): JsonResponse
    {
        DB::table('user_roles')
            ->where('user_id', $user->id)
            ->where('role_id', $role)
            ->delete();

        return $this->success(null, 'Role removed successfully');
    }
}

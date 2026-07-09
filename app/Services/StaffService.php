<?php

namespace App\Services;

use App\Models\Institution;
use App\Models\Role;
use App\Models\User;
use App\Support\InstitutionContext;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

use App\Notifications\Support\StaffInvitationNotification;

class StaffService
{
    /** Role keys that cannot be assigned to staff via this service. */
    private const PROTECTED_ROLE_KEYS = ['super_admin', 'institution_admin', 'student', 'candidate'];

    public function createStaff(array $data): User
    {
        $collegeId = InstitutionContext::getActiveInstitutionId(auth()->user());
        if (!$collegeId) {
            abort(422, 'A valid college context is required to create staff.');
        }

        $institution = Institution::find($collegeId);
        if (!$institution) {
            abort(422, 'Institution not found.');
        }

        $institutionType = $institution->type?->value ?? config('ems.default_institution_type');
        $isSchool = $institutionType === 'school';

        $roleId = (int) ($data['role_id'] ?? 0);
        if ($roleId > 0) {
            $role = Role::find($roleId);
            if (!$role) {
                abort(422, 'Selected role does not exist.');
            }
            if (in_array($role->key, self::PROTECTED_ROLE_KEYS, true)) {
                abort(403, 'This role cannot be assigned to staff.');
            }
        }

        $sendInvitation = !empty($data['send_invitation']);
        $password = isset($data['password']) && $data['password'] !== ''
            ? Hash::make($data['password'])
            : Hash::make(Str::random(16));

        $user = DB::transaction(function () use ($data, $collegeId, $isSchool, $roleId, $password, $sendInvitation) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $password,
                'mobile' => $data['mobile'] ?? null,
                'photo_url' => $data['photo_url'] ?? null,
                'status' => $sendInvitation ? 2 : (isset($data['status']) ? (int) $data['status'] : 1),
            ]);

            if ($roleId > 0) {
                $this->assignRoleToUser($user->id, $roleId, auth()->id(), $collegeId);
            }

            $category = isset($data['category']) ? (int) $data['category'] : null;
            $staffProfileId = DB::table('staff_profiles')->insertGetId([
                'user_id' => $user->id,
                'institution_id' => $collegeId,
                'category' => $category,
                'status' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            if (!$isSchool) {
                $this->syncStaffProfileLinks($staffProfileId, $data);
            }

            return $user;
        });

        if ($sendInvitation && $institution) {
            try {
                $user->notify(new StaffInvitationNotification($institution));
            } catch (\Throwable $e) {
                report($e);
            }
        }

        return $user->load('roles');
    }

    /**
     * Insert staff_profile_links for department_ids and subject_ids (batch).
     */
    private function syncStaffProfileLinks(int $staffProfileId, array $data): void
    {
        $now = now();
        $rows = [];

        $departmentIds = isset($data['department_ids']) && is_array($data['department_ids'])
            ? array_values(array_filter(array_map('intval', $data['department_ids']), fn ($id) => $id > 0))
            : [];
        foreach ($departmentIds as $linkId) {
            $rows[] = [
                'staff_profile_id' => $staffProfileId,
                'link_type' => 'department',
                'link_id' => $linkId,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        $subjectIds = isset($data['subject_ids']) && is_array($data['subject_ids'])
            ? array_values(array_filter(array_map('intval', $data['subject_ids']), fn ($id) => $id > 0))
            : [];
        foreach ($subjectIds as $linkId) {
            $rows[] = [
                'staff_profile_id' => $staffProfileId,
                'link_type' => 'subject',
                'link_id' => $linkId,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        if ($rows !== []) {
            DB::table('staff_profile_links')->insert($rows);
        }
    }

    public function listStaff(Request $request): LengthAwarePaginator
    {
        $perPage = (int) $request->input('per_page', 15);
        $collegeId = InstitutionContext::getActiveInstitutionId(auth()->user());

        $query = User::query()
            ->with(['roles' => fn($q) => $q->withoutGlobalScope('institution_scope')])
            ->whereHas('roles') // ensure they have at least one role
            ->whereDoesntHave('roles', function ($q) {
                $q->withoutGlobalScope('institution_scope')->whereIn('roles.key', self::PROTECTED_ROLE_KEYS);
            });

        if ($collegeId) {
            $query->whereExists(function ($q) use ($collegeId) {
                $q->select(DB::raw(1))
                    ->from('staff_profiles')
                    ->whereColumn('staff_profiles.user_id', 'users.id')
                    ->where('staff_profiles.institution_id', $collegeId);
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('role')) {
            $roleKey = $request->role;
            $query->whereHas('roles', function ($q) use ($roleKey) {
                $q->withoutGlobalScope('institution_scope')->where('roles.key', $roleKey);
            });
        }

        if ($request->filled('search')) {
            $search = '%' . strtolower($request->search) . '%';
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(name) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(email) LIKE ?', [$search]);
            });
        }

        if ($collegeId) {
            $institutionType = Institution::find($collegeId)?->type?->value ?? config('ems.default_institution_type');
            $isSchool = $institutionType === 'school';

            if (!$isSchool && $request->filled('department_id')) {
                $deptId = (int) $request->department_id;
                $query->whereExists(function ($q) use ($collegeId, $deptId) {
                    $q->select(DB::raw(1))
                        ->from('staff_profiles as sp')
                        ->join('staff_profile_links as spl', 'spl.staff_profile_id', '=', 'sp.id')
                        ->whereColumn('sp.user_id', 'users.id')
                        ->where('sp.institution_id', $collegeId)
                        ->where('spl.link_type', 'department')
                        ->where('spl.link_id', $deptId);
                });
            }
            if (!$isSchool && $request->filled('subject_id')) {
                $subjId = (int) $request->subject_id;
                $query->whereExists(function ($q) use ($collegeId, $subjId) {
                    $q->select(DB::raw(1))
                        ->from('staff_profiles as sp')
                        ->join('staff_profile_links as spl', 'spl.staff_profile_id', '=', 'sp.id')
                        ->whereColumn('sp.user_id', 'users.id')
                        ->where('sp.institution_id', $collegeId)
                        ->where('spl.link_type', 'subject')
                        ->where('spl.link_id', $subjId);
                });
            }
            if ($request->filled('category')) {
                $category = (int) $request->category;
                $query->whereExists(function ($q) use ($collegeId, $category) {
                    $q->select(DB::raw(1))
                        ->from('staff_profiles as sp')
                        ->whereColumn('sp.user_id', 'users.id')
                        ->where('sp.institution_id', $collegeId)
                        ->where('sp.category', $category);
                });
            }
        }

        $paginator = $query->latest()->paginate($perPage);

        if ($collegeId && $paginator->count() > 0) {
            $userIds = $paginator->getCollection()->pluck('id')->all();
            $profiles = DB::table('staff_profiles')
                ->where('institution_id', $collegeId)
                ->whereIn('user_id', $userIds)
                ->get()
                ->keyBy('user_id');
            foreach ($paginator->getCollection() as $user) {
                $profile = $profiles->get($user->id);
                $user->setAttribute('category', $profile?->category);
            }
        }

        return $paginator;
    }

    public function show(int $id): User
    {
        $user = User::with(['roles' => fn($q) => $q->withoutGlobalScope('institution_scope')])->findOrFail($id);
        $hasStaffRole = $user->roles()->withoutGlobalScope('institution_scope')->whereNotIn('key', self::PROTECTED_ROLE_KEYS)->exists();
        if (!$hasStaffRole) {
            abort(404, 'Staff member not found.');
        }

        $collegeId = InstitutionContext::getActiveInstitutionId(auth()->user());
        if ($collegeId) {
            $profile = DB::table('staff_profiles')->where('user_id', $user->id)->where('institution_id', $collegeId)->first();
            if ($profile) {
                $institutionType = Institution::find($collegeId)?->type?->value ?? config('ems.default_institution_type');
                $isSchool = $institutionType === 'school';

                $user->setAttribute('category', $profile->category);

                if (!$isSchool) {
                    $links = DB::table('staff_profile_links')->where('staff_profile_id', $profile->id)->get();
                    $user->setAttribute('department_ids', $links->where('link_type', 'department')->pluck('link_id')->values()->all());
                    $user->setAttribute('subject_ids', $links->where('link_type', 'subject')->pluck('link_id')->values()->all());
                } else {
                    $user->setAttribute('department_ids', []);
                    $user->setAttribute('subject_ids', []);
                }
            }
        }

        return $user;
    }

    public function update(int $id, array $data): User
    {
        $user = User::with(['roles' => fn($q) => $q->withoutGlobalScope('institution_scope')])->findOrFail($id);
        $hasStaffRole = $user->roles()->withoutGlobalScope('institution_scope')->whereNotIn('key', self::PROTECTED_ROLE_KEYS)->exists();
        if (!$hasStaffRole) {
            abort(404, 'Staff member not found.');
        }

        $allowed = ['name', 'mobile', 'status', 'photo_url'];
        $update = array_intersect_key($data, array_flip($allowed));
        if (!empty($update)) {
            $user->update($update);
        }

        if (array_key_exists('role_id', $data) && (int) $data['role_id'] > 0) {
            $role = Role::find((int) $data['role_id']);
            if ($role && !in_array($role->key, self::PROTECTED_ROLE_KEYS, true)) {
                DB::table('user_roles')->where('user_id', $user->id)->delete();
                $this->assignRoleToUser($user->id, $role->id, auth()->id());
            }
        }

        $collegeId = InstitutionContext::getActiveInstitutionId(auth()->user());
        if ($collegeId) {
            $profile = DB::table('staff_profiles')->where('user_id', $user->id)->where('institution_id', $collegeId)->first();
            if ($profile) {
                $institutionType = Institution::find($collegeId)?->type?->value ?? config('ems.default_institution_type');
                $isSchool = $institutionType === 'school';

                if (array_key_exists('category', $data)) {
                    DB::table('staff_profiles')->where('id', $profile->id)->update([
                        'category' => (int) $data['category'],
                        'updated_at' => now(),
                    ]);
                }

                if (!$isSchool) {
                    DB::table('staff_profile_links')->where('staff_profile_id', $profile->id)->delete();
                    $this->syncStaffProfileLinks((int) $profile->id, $data);
                }
            }
        }

        return $user->fresh('roles');
    }

    public function resendInvitation(int $id): User
    {
        $user = User::findOrFail($id);
        $hasStaffRole = $user->roles()->withoutGlobalScope('institution_scope')->whereNotIn('key', self::PROTECTED_ROLE_KEYS)->exists();
        if (!$hasStaffRole) {
            abort(404, 'Staff member not found.');
        }

        if ($user->status != 2) {
            abort(422, 'Only staff with pending verification can receive invitation links.');
        }

        $collegeId = InstitutionContext::getActiveInstitutionId(auth()->user());
        if (!$collegeId || !($institution = Institution::find($collegeId))) {
            abort(422, 'A valid college context is required to resend invitations.');
        }

        $user->notify(new StaffInvitationNotification($institution));

        return $user;
    }

    public function delete(int $id): void
    {
        if ((int) $id === auth()->id()) {
            abort(403, 'You cannot delete your own account.');
        }
        $user = User::findOrFail($id);
        $hasStaffRole = $user->roles()->withoutGlobalScope('institution_scope')->whereNotIn('key', self::PROTECTED_ROLE_KEYS)->exists();
        if (!$hasStaffRole) {
            abort(404, 'Staff member not found.');
        }
        $user->delete();
    }

    /**
     * @param  int  $userId
     * @param  int  $roleId
     * @param  int|null  $assignedBy
     * @param  int|null  $collegeId  When provided (e.g. from createStaff), avoids extra DB queries inside an open transaction.
     */
    private function assignRoleToUser(int $userId, int $roleId, ?int $assignedBy, ?int $collegeId = null): void
    {
        // Avoid institution_scope global scope so we don't run Institution::find inside an open transaction
        $role = Role::withoutGlobalScope('institution_scope')->findOrFail($roleId);
        if (in_array($role->key, self::PROTECTED_ROLE_KEYS, true)) {
            abort(403, 'This role cannot be assigned to staff.');
        }

        if ($collegeId === null) {
            $collegeId = InstitutionContext::getActiveInstitutionId(auth()->user());
        }
        if (!$collegeId) {
            abort(422, 'A valid college context is required to assign staff roles.');
        }

        DB::table('user_roles')->insertOrIgnore([
            'user_id' => $userId,
            'role_id' => $roleId,
            'institution_id' => $collegeId,
            'assigned_by' => $assignedBy,
            'assigned_at' => now(),
        ]);
    }
}

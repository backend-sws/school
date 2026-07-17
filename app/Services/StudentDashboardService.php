<?php

namespace App\Services;

use App\Models\Institution;
use App\Models\Stream;
use App\Models\StudentProfile;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class StudentDashboardService
{
    /**
     * Get comprehensive dashboard stats
     */
    public function getDashboardStats(int $collegeId, int $year, int $page = 1, int $perPage = 10): array
    {
        // --- Summary Stats ---
        $summary = $this->getSummaryStats($collegeId, $year);

        // --- Table Stats ---
        $tableData = $this->getStreamTableData($collegeId, $year, $page, $perPage);

        return [
            'selected_year' => $year,
            'summary' => $summary,
            'stream_table' => $tableData['items'],
            'pagination' => $tableData['pagination']
        ];
    }

    private function getSummaryStats(int $collegeId, int $year): array
    {
        $query = StudentProfile::join('users', 'student_profiles.user_id', '=', 'users.id')
            ->where('student_profiles.institution_id', $collegeId)
            ->whereYear('student_profiles.created_at', $year);

        $total = (clone $query)->count();
        $verified = (clone $query)->where('student_profiles.verified', true)->count();

        return [
            'total_students' => $total,
            'verified_accounts' => $verified,
            'unverified_accounts' => $total - $verified,
            'disabled_accounts' => (clone $query)->where('users.status', 0)->count(),
        ];
    }

    private function getStreamTableData(int $collegeId, int $year, int $page = 1, int $perPage = 10): array
    {
        $query = Stream::select(
            'streams.id',
            'streams.name as stream_name',
            'main_streams.name as main_stream_name'
        )
            ->join('main_streams', 'streams.main_stream_id', '=', 'main_streams.id')
            ->where('streams.institution_id', $collegeId)
            ->withCount([
                'studentProfiles as total' => function ($query) use ($year, $collegeId) {
                    $query->whereYear('student_profiles.created_at', $year)
                        ->where('student_profiles.institution_id', $collegeId);
                },
                'studentProfiles as unverified' => function ($query) use ($year, $collegeId) {
                    $query->whereYear('student_profiles.created_at', $year)
                        ->where('student_profiles.verified', false)
                        ->where('student_profiles.institution_id', $collegeId);
                },
                'studentProfiles as disabled' => function ($query) use ($year, $collegeId) {
                    $query->whereYear('student_profiles.created_at', $year)
                        ->where('student_profiles.institution_id', $collegeId)
                        ->whereHas('user', function ($u) {
                            $u->where('users.status', 0);
                        });
                }
            ]);

        $paginated = $query->paginate($perPage, ['*'], 'page', $page);

        $items = collect($paginated->items())->map(fn($item, $index) => [
            'sl_no' => (($paginated->currentPage() - 1) * $paginated->perPage()) + $index + 1,
            'main_stream' => $item->main_stream_name,
            'stream' => $item->stream_name,
            'total_students' => (int) $item->total,
            'unverified_students' => (int) $item->unverified,
            'disabled_students' => (int) $item->disabled,
        ])->toArray();

        return [
            'items' => $items,
            'pagination' => [
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
            ]
        ];
    }

    /**
     * Get candidates list for the given college only (role scoped to college).
     *
     * @param  array<string, mixed>  $filters
     * @param  int|null  $collegeId  Active college ID; only users with candidate role for this college are returned. Null returns empty.
     */
    public function getCandidatesList($filters, ?int $collegeId = null): LengthAwarePaginator
    {
        $perPage = $filters['per_page'] ?? 15;

        if ($collegeId === null) {
            return new \Illuminate\Pagination\LengthAwarePaginator([], 0, $perPage);
        }

        $query = User::whereHas('roles', function ($q) use ($collegeId) {
            $q->where('roles.key', 'candidate')
                ->where('user_roles.institution_id', $collegeId);
        })->select('users.name', 'users.email', 'users.mobile', 'users.email_verified_at', 'users.status', 'users.id');

        if (!empty($filters['name'])) {
            $query->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($filters['name']) . '%']);
        }

        if (!empty($filters['email'])) {
            $query->whereRaw('LOWER(email) LIKE ?', ['%' . strtolower($filters['email']) . '%']);
        }

        if (!empty($filters['mobile'])) {
            $query->where('mobile', 'like', "%{$filters['mobile']}%");
        }

        if (isset($filters['is_verified'])) {
            $filters['is_verified']
                ? $query->whereNotNull('email_verified_at')
                : $query->whereNull('email_verified_at');
        }

        return $query->latest()->paginate($perPage);
    }

    /**
     * Get students list for the given college only (role scoped to college).
     *
     * @param  array<string, mixed>  $filters
     * @param  int|null  $collegeId  Active college ID; only users with student role for this college are returned. Null returns empty.
     */
    public function getStudentsList($filters, ?int $collegeId = null): LengthAwarePaginator
    {
        $perPage = $filters['per_page'] ?? 15;

        if ($collegeId === null) {
            return new \Illuminate\Pagination\LengthAwarePaginator([], 0, $perPage);
        }

        $query = User::whereHas('roles', function ($q) use ($collegeId) {
            $q->where('roles.key', 'student')
                ->where('user_roles.institution_id', $collegeId);
        })->with([
                    'studentProfile' => function ($q) use ($collegeId) {
                        $q->with(['session', 'stream'])->where('student_profiles.institution_id', $collegeId);
                    },
                    'guardians' => fn($q) => $q->whereNotNull('email')->where('email', '!=', ''),
                ]);

        // 1. Basic Filters: Name, Email, Mobile
        if (!empty($filters['name']) && is_string($filters['name'])) {
            $query->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($filters['name']) . '%']);
        }

        if (!empty($filters['email']) && is_string($filters['email'])) {
            $query->whereRaw('LOWER(email) LIKE ?', ['%' . strtolower($filters['email']) . '%']);
        }

        if (!empty($filters['mobile']) && is_string($filters['mobile'])) {
            $query->where('mobile', 'like', "%{$filters['mobile']}%");
        }

        if (!empty($filters['reg_no']) && is_string($filters['reg_no'])) {
            $query->whereHas('studentProfile', function ($q) use ($filters, $collegeId) {
                $q->where('student_profiles.institution_id', $collegeId)->where('reg_no', 'like', "%{$filters['reg_no']}%");
            });
        }

        if (!empty($filters['academic_session_id'])) {
            $query->whereHas('studentProfile', function ($q) use ($filters, $collegeId) {
                $q->where('student_profiles.institution_id', $collegeId)->where('session_id', $filters['academic_session_id']);
            });
        }

        if (!empty($filters['stream_id'])) {
            $query->whereHas('studentProfile', function ($q) use ($filters, $collegeId) {
                $q->where('student_profiles.institution_id', $collegeId)->where('stream_id', $filters['stream_id']);
            });
        }

        if (!empty($filters['gender'])) {
            $query->whereHas('studentProfile', function ($q) use ($filters, $collegeId) {
                $q->where('student_profiles.institution_id', $collegeId)->whereRaw('LOWER(gender) = ?', [strtolower($filters['gender'])]);
            });
        }

        if (!empty($filters['category'])) {
            $query->whereHas('studentProfile', function ($q) use ($filters, $collegeId) {
                $q->where('student_profiles.institution_id', $collegeId)->whereRaw('LOWER(category) = ?', [strtolower($filters['category'])]);
            });
        }

        if (!empty($filters['lms_class_id'])) {
            $query->whereIn('id', function ($q) use ($filters) {
                $q->select('user_id')
                  ->from('lms_class_enrollments')
                  ->where('lms_class_id', $filters['lms_class_id'])
                  ->where('role', 'student')
                  ->where('status', 'active');
            });
        }

        // 2. Verified / Non-Verified Filter
        // Note: This is a boolean filter
        if (isset($filters['is_verified'])) {
            // If is_verified is set, filter by email_verified_at status
            $filters['is_verified']
                ? $query->whereNotNull('email_verified_at')
                : $query->whereNull('email_verified_at');
        }

        // 3. Status Filter
        // Note: This is a boolean filter
        if (isset($filters['status'])) {
            // If status is set, filter by status
            $query->where('status', $filters['status']);
        }

        // 4. Government Portal (ABC ID) Status Filter
        if (!empty($filters['abc_status'])) {
            if ($filters['abc_status'] === 'registered') {
                $query->whereHas('studentProfile', function ($q) use ($collegeId) {
                    $q->where('student_profiles.institution_id', $collegeId)
                      ->whereNotNull('abc_id')
                      ->where('abc_id', '!=', '');
                });
            } elseif ($filters['abc_status'] === 'not_registered') {
                $query->where(function ($q) use ($collegeId) {
                    $q->whereHas('studentProfile', function ($sub) use ($collegeId) {
                        $sub->where('student_profiles.institution_id', $collegeId)
                            ->where(function ($sub2) {
                                $sub2->whereNull('abc_id')->orWhere('abc_id', '');
                            });
                    })->orWhereDoesntHave('studentProfile');
                });
            }
        }

        // 5. Hostel Status Filter
        if (!empty($filters['hostel_status'])) {
            if ($filters['hostel_status'] === 'hostel_active') {
                $query->whereHas('hostelAllocations', function ($q) {
                    $q->where('status', 'active');
                });
            } elseif ($filters['hostel_status'] === 'no_hostel') {
                $query->whereDoesntHave('hostelAllocations', function ($q) {
                    $q->where('status', 'active');
                });
            }
        }

        // 6. Transport Status Filter
        if (!empty($filters['transport_status'])) {
            $today = now()->toDateString();
            if ($filters['transport_status'] === 'transport_active') {
                $query->whereHas('transportAssignments', function ($q) use ($today) {
                    $q->where(function ($sub) use ($today) {
                        $sub->whereNull('effective_until')
                            ->orWhere('effective_until', '>=', $today);
                    });
                });
            } elseif ($filters['transport_status'] === 'no_transport') {
                $query->whereDoesntHave('transportAssignments', function ($q) use ($today) {
                    $q->where(function ($sub) use ($today) {
                        $sub->whereNull('effective_until')
                            ->orWhere('effective_until', '>=', $today);
                    });
                });
            }
        }

        return $query->latest()->paginate($perPage);
    }

    /**
     * Get candidate/student details only if the user belongs to the given institution (student or candidate role).
     *
     * @return \App\Models\User|null  User or null if not found or not in this institution.
     */
    public function getCandidateDetails($id, ?int $collegeId = null)
    {
        $user = User::with([
            'studentProfile',
            'studentProfile.permanentAddress',
            'studentProfile.correspondenceAddress',
            'studentProfile.mainStream',
            'studentProfile.stream',
            'studentProfile.session',
            'studentProfile.subject',
            'documents',
            'transportAssignments' => function ($q) {
                $q->where(function($query) {
                    $query->whereNull('effective_until')->orWhere('effective_until', '>=', now());
                })->with(['transportRoute:id,name,code', 'transportStop:id,name,code']);
            },
            'hostelAllocations' => function ($q) {
                $q->where('status', 'active');
            }
        ])->find($id);
        if (!$user || $collegeId === null) {
            return $user;
        }
        $belongsToInstitution = $user->roles()
            ->whereIn('roles.key', ['student', 'candidate'])
            ->where('user_roles.institution_id', $collegeId)
            ->exists();
        if (!$belongsToInstitution) {
            return null;
        }
        
        if ($user->studentProfile) {
            $activeTransport = $user->transportAssignments->first();
            $user->studentProfile->transport_id = $activeTransport?->id;
            $user->studentProfile->hostel_id = $user->hostelAllocations->first()?->id;
            
            $user->studentProfile->has_transport_history = \App\Models\TransportAssignment::where('user_id', $user->id)->exists();
            $user->studentProfile->has_hostel_history = \App\Models\HostelAllocation::where('user_id', $user->id)->exists();
            
            $user->studentProfile->is_transport_stoppable = \App\Models\TransportAssignment::where('user_id', $user->id)->where('institution_id', $collegeId)->whereNull('effective_until')->exists();
            $user->studentProfile->is_hostel_stoppable = \App\Models\HostelAllocation::where('user_id', $user->id)->where('institution_id', $collegeId)->where('status', 'active')->whereNull('check_out_date')->exists();

            $user->studentProfile->transport_status_text = $user->studentProfile->has_transport_history 
                ? ($user->studentProfile->is_transport_stoppable ? 'Active' : 'Stopped') 
                : null;
                
            $user->studentProfile->hostel_status_text = $user->studentProfile->has_hostel_history 
                ? ($user->studentProfile->is_hostel_stoppable ? 'Active' : 'Stopped') 
                : null;

            // Expose active transport route/stop detail
            if ($activeTransport) {
                $routeName = $activeTransport->transportRoute?->name;
                $stopName  = $activeTransport->transportStop?->name;
                $parts = array_filter([$routeName, $stopName]);
                $user->studentProfile->transport_detail = implode(' → ', $parts) ?: null;
                $user->studentProfile->transport_monthly_amount = (float) ($activeTransport->monthly_amount ?? 0);
            } else {
                $user->studentProfile->transport_detail = null;
                $user->studentProfile->transport_monthly_amount = null;
            }
        }
        
        if ($user->studentProfile && $user->studentProfile->mainStream) {
            $user->studentProfile->main_stream_id = $user->studentProfile->mainStream->main_stream_id ?? null;
        }

        return $user;
    }

    // public function updateCandidateStatus($id, $status)
    // {
    //     User::where('id', $id)->update(['status' => $status]);
    //     return User::find($id);
    // }


    /**
     * Toggle candidate/student status only if the user belongs to the given institution (student or candidate role).
     *
     * @return bool|null  New status, or null if user not found or not in this institution.
     */
    public function toggleCandidateStatus($id, ?int $collegeId = null)
    {
        $user = User::find($id);
        if (!$user || $collegeId === null) {
            return null;
        }
        $belongsToInstitution = $user->roles()
            ->whereIn('roles.key', ['student', 'candidate'])
            ->where('user_roles.institution_id', $collegeId)
            ->exists();
        if (!$belongsToInstitution) {
            return null;
        }
        $user->status = !$user->status;
        $user->save();

        return $user->fresh()->status;
    }

    /**
     * Update candidate/student details only if the user belongs to the given institution (student or candidate role).
     *
     * @return \App\Models\User|null  Updated user, or null if not in this institution.
     */
    public function updateCandidateDetails($id, $data, ?int $collegeId = null)
    {
        if ($collegeId === null) {
            return null;
        }
        $user = User::find($id);
        if (!$user) {
            return null;
        }
        $belongsToInstitution = $user->roles()
            ->whereIn('roles.key', ['student', 'candidate'])
            ->where('user_roles.institution_id', $collegeId)
            ->exists();
        if (!$belongsToInstitution) {
            return null;
        }

        return DB::transaction(function () use ($id, $data, $collegeId) {
            $user = User::findOrFail($id);


            // 1. User Update
            $user->update([
                'name' => $data['name'],
                'email' => $data['email'],
                'mobile' => $data['mobile'],
                'password' => isset($data['password']) ? bcrypt($data['password']) : $user->password,
                'photo_url' => $data['photo_url'] ?? $user->photo_url,
                'reg_no' => $data['reg_no'] ?? $user->reg_no,
            ]);

            if (isset($data['student_profile'])) {
                $profileData = $data['student_profile'];

                // 2. Student Profile Update (Excluding addresses)
                $profileFields = collect($profileData)
                    ->except(['permanent_address', 'correspondence_address'])
                    ->toArray();

                $user->studentProfile()->update($profileFields);

                // 3. Permanent Address Update
                if (isset($profileData['permanent_address'])) {
                    $user->studentProfile->permanentAddress()->updateOrCreate(
                        ['address_type' => 'permanent'],
                        array_merge($profileData['permanent_address'], ['user_id' => $user->id])
                    );
                }

                // 4. Correspondence Address Update
                if (isset($profileData['correspondence_address'])) {
                    $user->studentProfile->correspondenceAddress()->updateOrCreate(
                        ['address_type' => 'correspondence'],
                        array_merge($profileData['correspondence_address'], ['user_id' => $user->id])
                    );
                }
            }

            // 5. Update Documents
            if (isset($data['documents']) && is_array($data['documents'])) {
                // Get all valid current doc_types being sent
                $incomingDocTypes = collect($data['documents'])->pluck('doc_type')->filter()->toArray();

                // Delete any documents that are NOT in the incoming list (meaning user removed them)
                if (count($incomingDocTypes) > 0) {
                    \App\Models\StudentDocument::where('user_id', $user->id)
                        ->where('institution_id', $collegeId)
                        ->whereNotIn('doc_type', $incomingDocTypes)
                        ->delete();
                } else {
                    \App\Models\StudentDocument::where('user_id', $user->id)
                        ->where('institution_id', $collegeId)
                        ->delete();
                }

                // Update or create incoming documents
                foreach ($data['documents'] as $doc) {
                    if (isset($doc['doc_type']) && isset($doc['path'])) {
                        \App\Models\StudentDocument::updateOrCreate(
                            [
                                'user_id' => $user->id,
                                'doc_type' => $doc['doc_type'],
                                'institution_id' => $collegeId,
                            ],
                            [
                                'doc_path' => $doc['path'],
                                'document_type' => $doc['doc_type'],
                                'file_url' => $doc['path'],
                                'status' => 'pending',
                            ]
                        );
                    }
                }
            }

            return $user->load(['studentProfile.permanentAddress', 'studentProfile.correspondenceAddress', 'documents']);
        });
    }


}
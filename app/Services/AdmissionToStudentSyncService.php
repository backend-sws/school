<?php

namespace App\Services;

use App\Models\AdmissionApplication;
use App\Models\AdmissionVerificationData;
use App\Models\Institution;
use App\Models\LmsClass;
use App\Models\LmsClassEnrollment;
use App\Models\Role;
use App\Models\Session;
use App\Models\Stream;
use App\Models\StudentAddress;
use App\Models\StudentDocument;
use App\Models\StudentProfile;
use App\Models\User;
use App\Jobs\SendParentOnboardingNotificationJob;
use App\Notifications\StudentOnboardNotification;
use App\Services\GuardianService;
use App\Services\StudentIdentifierService;
use App\Support\VerificationToken;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;

/**
 * Syncs approved admission application data into student profiles, addresses,
 * documents, and class enrollment.
 *
 * Pipeline architecture — each step receives a shared context bag:
 *   AssignRole → SyncGuardian → Notify → ResolveAcademics → SyncProfile
 *   → SyncAddresses → SyncDocuments → SyncPhoto → SyncClassEnrollment
 */
class AdmissionToStudentSyncService
{
    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     * Pipeline Definition
     * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

    private const SYNC_PIPELINE = [
        'stepAssignRole',
        'stepSyncGuardian',
        'stepSendNotification',
        'stepResolveAcademics',
        'stepSyncProfile',
        'stepSyncAddresses',
        'stepSyncDocuments',
        'stepSyncPhoto',
        'stepSyncClassEnrollment',
        'stepSyncServicesAllocations',
    ];

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     * Direct-mapped fields: Application → StudentProfile
     * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

    /** Application columns that map 1:1 to StudentProfile columns. */
    private const PROFILE_DIRECT_MAP = [
        'father_name' => 'father_name',
        'mother_name' => 'mother_name',
        'dob'         => 'dob',
        'gender'      => 'gender',
        'category'    => 'category',
        'caste'       => 'caste',
        'apaar_id'    => 'apaar_id',
        'father_mobile' => 'father_mobile',
        'father_qualification' => 'father_qualification',
        'father_occupation' => 'father_occupation',
        'religion'    => 'religion',
        'nationality' => 'nationality',
        'blood_group' => 'blood_group',
        'mobile'      => 'mobile',
        'aadhaar_no'  => 'aadhar_no',
        'fee_regulation_profile_id' => 'fee_regulation_profile_id',
        'medical_condition' => 'medical_condition',
        'allergy' => 'allergy',
        'previous_school_name' => 'previous_school_name',
        'previous_roll_no' => 'previous_roll_no',
        'previous_board' => 'previous_board',
        'previous_marks' => 'previous_marks',
        'has_tc' => 'has_tc',
        'has_government_portal' => 'has_government_portal',
        'government_portal_name' => 'government_portal_name',
        'abc_id' => 'abc_no',
        'disability' => 'disability_type',
        'guardian_snapshot' => 'guardian_snapshot',
    ];

    /** Address block keys to sync. */
    private const ADDRESS_TYPES = ['correspondence', 'permanent'];

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     * Entry Point
     * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

    /**
     * @throws \Throwable
     */
    public function syncFromApplication(AdmissionApplication $application): void
    {
        $application->load(['admissionHead', 'admissionHead.stream', 'user']);

        $user = User::find((int) $application->user_id);
        if (!$user) {
            return;
        }

        $context = [
            'application' => $application,
            'user'        => $user,
            'profile'     => null,
            'streamId'    => null,
            'sessionId'   => null,
            'halt'        => false,
        ];

        foreach (self::SYNC_PIPELINE as $step) {
            $this->{$step}($context);
            if ($context['halt']) {
                return;
            }
        }
    }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     * Pipeline Steps
     * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

    protected function stepAssignRole(array &$context): void
    {
        $app = $context['application'];
        $applicantId = (int) $app->user_id;

        if ($app->processed_by && (int) $app->processed_by === $applicantId) {
            throw new \RuntimeException(
                'Cannot approve: the applicant is the same as the approving user.'
            );
        }

        $institutionId = $app->institution_id;
        if (!$institutionId) {
            return;
        }

        $role = Role::forInstitution($institutionId)->where('key', 'student')->first()
            ?? Role::withoutGlobalScope('institution_scope')->where('key', 'student')->first();
        if (!$role) {
            return;
        }

        DB::table('user_roles')->insertOrIgnore([
            'user_id'        => $applicantId,
            'role_id'        => $role->id,
            'institution_id' => $institutionId,
            'assigned_at'    => now(),
        ]);
    }

    protected function stepSyncGuardian(array &$context): void
    {
        $app = $context['application'];
        $snapshot = $app->guardian_snapshot ?? [];
        $guardianName = data_get($snapshot, 'name', $app->father_name);
        $relation = data_get($snapshot, 'relation', 'guardian');

        $result = app(GuardianService::class)->resolveOrCreateAndLinkToStudent(
            $app->institution_id,
            $app->email,
            $app->mobile,
            $guardianName,
            (int) $app->user_id,
            $relation
        );

        $context['guardian'] = $result['guardian'] ?? null;
        $context['wasExistingGuardian'] = $result['was_existing'] ?? false;
    }

    protected function stepSendNotification(array &$context): void
    {
        $app = $context['application'];
        $user = $context['user'];
        $guardian = $context['guardian'] ?? null;
        $wasExisting = $context['wasExistingGuardian'] ?? false;

        if ($wasExisting && $guardian && !empty($guardian->email)) {
            $this->notifyExistingGuardian($app, $user, $guardian);
        } else {
            $this->notifyStudent($app, $user);
        }
    }

    protected function stepResolveAcademics(array &$context): void
    {
        $app = $context['application'];

        $streamId = $this->resolveStreamId($app);
        if (!$streamId) {
            $context['halt'] = true;
            return;
        }

        $sessionId = $this->resolveSessionId($app);
        if (!$sessionId) {
            $context['halt'] = true;
            return;
        }

        $context['streamId'] = $streamId;
        $context['sessionId'] = $sessionId;
    }

    protected function stepSyncProfile(array &$context): void
    {
        $app = $context['application'];

        // Extract snapshots
        $address = self::extractPrimaryAddressBlock($app->address_snapshot ?? []);
        $guardian = $app->guardian_snapshot ?? [];
        $fatherName = data_get($guardian, 'name', $app->father_name);

        // Direct-mapped fields from application → profile
        $profileData = [];
        foreach (self::PROFILE_DIRECT_MAP as $appCol => $profileCol) {
            $profileData[$profileCol] = $app->{$appCol};
        }

        // Computed fields
        $identifierService = app(StudentIdentifierService::class);
        $profileData['institution_id']       = $app->institution_id;
        $profileData['stream_id']            = $context['streamId'];
        $profileData['session_id']           = $context['sessionId'];
        $profileData['admission_date']       = $app->admission_date;
        $profileData['app_no']               = $app->application_id;
        $profileData['reg_no']               = $this->resolveRegNumber($app, $identifierService);
        $profileData['roll_no']              = $identifierService->generateRollNumber($app->institution_id, $context['sessionId'], $context['streamId']);
        $profileData['father_name']          = $fatherName;
        $profileData['father_occupation']    = data_get($guardian, 'occupation') ?? $app->father_occupation;
        $profileData['address']              = $address['line'] ?: null;
        $profileData['city']                 = $address['city'];
        $profileData['state']                = $address['state'];
        $profileData['pincode']              = $address['pincode'];
        $profileData['is_differently_abled'] = !empty($app->disability);
        $profileData['verified']             = false;

        $context['profile'] = StudentProfile::updateOrCreate(
            ['user_id' => $app->user_id],
            $profileData
        );
    }

    protected function stepSyncAddresses(array &$context): void
    {
        $snapshot = $context['application']->address_snapshot ?? [];
        if (empty($snapshot)) {
            return;
        }

        $profile = $context['profile'];
        $hasNested = isset($snapshot['correspondence']) || isset($snapshot['permanent']);

        if ($hasNested) {
            foreach (self::ADDRESS_TYPES as $type) {
                $block = $snapshot[$type] ?? null;
                if (is_array($block) && self::isAddressBlockFilled($block)) {
                    self::upsertAddress($profile, $type, $block);
                }
            }
        } elseif (self::isAddressBlockFilled($snapshot)) {
            self::upsertAddress($profile, 'permanent', $snapshot);
        }
    }

    protected function stepSyncDocuments(array &$context): void
    {
        $app = $context['application'];

        AdmissionVerificationData::query()
            ->where('admission_application_id', $app->id)
            ->where('field_type', 'file')
            ->whereNotNull('file_url')
            ->where('file_url', '!=', '')
            ->each(function ($row) use ($app) {
                $docType = $row->field_key ?? 'document';
                StudentDocument::updateOrCreate(
                    ['user_id' => $app->user_id, 'doc_type' => $docType],
                    [
                        'institution_id' => $app->institution_id,
                        'doc_path'       => $row->file_url,
                        'document_type'  => $docType,
                        'file_url'       => $row->file_url,
                        'status'         => 'pending',
                    ]
                );
            });
    }

    protected function stepSyncPhoto(array &$context): void
    {
        $photoUrl = $context['application']->photo_url;
        if (!empty($photoUrl)) {
            $context['user']->update(['photo_url' => $photoUrl]);
        }
    }

    protected function stepSyncClassEnrollment(array &$context): void
    {
        $app = $context['application'];
        $sessionId = $context['sessionId'] ?? null;
        $streamId = $context['streamId'] ?? $this->resolveStreamId($app);

        $resolvedLmsClassIds = [];

        foreach (array_filter(array_unique([$app->class_id, $app->section_id])) as $rawId) {
            $resolved = $this->resolveLmsClassIdForEnrollment($app, (int) $rawId, $sessionId, $streamId);
            if ($resolved) {
                $resolvedLmsClassIds[] = $resolved;
            }
        }

        $resolvedLmsClassIds = array_values(array_unique($resolvedLmsClassIds));

        if (empty($resolvedLmsClassIds)) {
            $autoClass = $this->resolveClassWithLeastEnrollments($app, $sessionId, $streamId);
            if ($autoClass) {
                $resolvedLmsClassIds = [$autoClass->id];
                $app->updateQuietly(['class_id' => $autoClass->id]);
            }
        }

        if (empty($resolvedLmsClassIds)) {
            Log::warning('Admission sync: unable to resolve LmsClass enrollment', [
                'application_id' => $app->id,
                'user_id' => $app->user_id,
                'class_id' => $app->class_id,
                'section_id' => $app->section_id,
                'stream_id' => $streamId,
                'session_id' => $sessionId,
            ]);

            return;
        }

        foreach ($resolvedLmsClassIds as $classId) {
            LmsClassEnrollment::firstOrCreate(
                ['lms_class_id' => $classId, 'user_id' => $app->user_id],
                ['enrolled_at' => now(), 'role' => 'student', 'status' => 'active']
            );
        }
    }

    private function resolveLmsClassIdForEnrollment(
        AdmissionApplication $app,
        int $rawId,
        ?int $sessionId,
        ?int $streamId,
    ): ?int {
        if (LmsClass::where('id', $rawId)->where('institution_id', $app->institution_id)->exists()) {
            return $rawId;
        }

        if (Stream::where('id', $rawId)->where('institution_id', $app->institution_id)->exists()) {
            $class = $this->resolveClassWithLeastEnrollments($app, $sessionId, $rawId);

            return $class?->id;
        }

        return null;
    }

    /**
     * Auto-resolve the LmsClass (section) with the fewest active student enrollments
     * for the given application's stream + session. Load-balanced section assignment.
     */
    private function resolveClassWithLeastEnrollments(
        AdmissionApplication $app,
        ?int $sessionId,
        ?int $streamIdOverride = null,
    ): ?LmsClass {
        $streamId = $streamIdOverride ?? $app->admissionHead?->stream_id;
        if (!$streamId || !$sessionId) {
            return null;
        }

        return LmsClass::where('stream_id', $streamId)
            ->where('session_id', $sessionId)
            ->where('institution_id', $app->institution_id)
            ->where('status', 1)
            ->withCount(['enrollments as active_student_count' => function ($q) {
                $q->where('role', 'student')->where('status', 'active');
            }])
            ->orderBy('active_student_count', 'asc')
            ->first();
    }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     * Resolvers — Polymorphic Reg No Strategy
     * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

    /**
     * Re-admissions preserve existing reg_no; new admissions generate one.
     */
    protected function resolveRegNumber(AdmissionApplication $app, StudentIdentifierService $service): string
    {
        if ($this->isReadmission($app)) {
            $existing = StudentProfile::where('user_id', $app->user_id)->value('reg_no');
            if ($existing) {
                return $existing;
            }
        }

        return $service->generateRegNumber($app->institution_id, (int)$app->session_id);
    }

    protected function isReadmission(AdmissionApplication $app): bool
    {
        return ($app->application_type ?? 'new') === 're-admission';
    }


    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     * Academic Resolvers
     * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

    private function resolveStreamId(AdmissionApplication $app): ?int
    {
        $head = $app->admissionHead;
        $streamId = $head?->stream_id ?? $head?->main_stream_id;

        if (!$streamId && $app->class_id) {
            $streamId = \App\Models\Stream::where('id', $app->class_id)
                ->where('institution_id', $app->institution_id)
                ->exists()
                    ? $app->class_id
                    : LmsClass::where('id', $app->class_id)->value('stream_id');
        }

        return $streamId ? (int) $streamId : null;
    }

    private function resolveSessionId(AdmissionApplication $app): ?int
    {
        if ($app->session_id) {
            return (int) $app->session_id;
        }

        $calendarSession = app(AcademicCalendarService::class)
            ->resolveCurrentSession((int) $app->institution_id);

        if ($calendarSession) {
            return $calendarSession->id;
        }

        return Session::where('institution_id', $app->institution_id)
            ->where('is_current', true)
            ->value('id')
            ?? Session::where('institution_id', $app->institution_id)
                ->orderByDesc('start_year')
                ->value('id');
    }

    private function resolveInstitutionCode(int $institutionId): string
    {
        $institution = Institution::find($institutionId);
        $code = $institution?->code;

        if (empty($code)) {
            $words = preg_split('/[\s\-_]+/', trim($institution?->name ?? 'INST'));
            $code = collect($words)
                ->filter(fn($w) => strlen($w) > 0)
                ->map(fn($w) => strtoupper(mb_substr($w, 0, 1)))
                ->implode('');
        }

        return strtoupper($code);
    }

    private function resolveSessionYear(AdmissionApplication $app): int
    {
        $session = $app->session_id ? Session::find($app->session_id) : null;
        return $session?->start_year ?? now()->year;
    }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     * Address Helpers (static, pure)
     * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

    /**
     * Extract the primary address block from the snapshot (correspondence → legacy flat).
     * Returns a normalized array: ['line', 'city', 'state', 'pincode'].
     */
    private static function extractPrimaryAddressBlock(array $snapshot): array
    {
        $hasNested = isset($snapshot['correspondence']) || isset($snapshot['permanent']);
        $block = $hasNested
            ? ($snapshot['correspondence'] ?? $snapshot['permanent'] ?? [])
            : $snapshot;

        $line = trim(implode(' ', [
            $block['line1'] ?? '',
            $block['line2'] ?? '',
        ]));

        return [
            'line'    => $line,
            'city'    => $block['city'] ?? null,
            'state'   => $block['state'] ?? null,
            'pincode' => $block['pincode'] ?? null,
        ];
    }

    private static function isAddressBlockFilled(array $block): bool
    {
        return collect(['line1', 'line2', 'city', 'state', 'pincode'])
            ->contains(fn($key) => !empty($block[$key] ?? null));
    }

    private static function upsertAddress(StudentProfile $profile, string $type, array $block): void
    {
        StudentAddress::updateOrCreate(
            ['student_profile_id' => $profile->id, 'address_type' => $type],
            [
                'user_id'         => $profile->user_id,
                'village_mohalla' => $block['line1'] ?? null,
                'post_office'     => $block['line2'] ?? null,
                'district'        => $block['city'] ?? null,
                'state'           => $block['state'] ?? null,
                'pincode'         => $block['pincode'] ?? null,
            ]
        );
    }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     * Notification Helpers
     * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     * Services Allocations (Transport/Hostel)
     * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

    private function stepSyncServicesAllocations(array &$context): void
    {
        /** @var AdmissionApplication $app */
        $app = $context['application'];
        $userId = $context['user']->id;

        // Transport Allocation
        if ($app->transport_stop_id && $app->transport_route_id) {
            \App\Models\TransportAssignment::updateOrCreate(
                [
                    'institution_id' => $app->institution_id,
                    'user_id' => $userId,
                ],
                [
                    'transport_route_id' => $app->transport_route_id,
                    'transport_stop_id' => $app->transport_stop_id,
                    'monthly_amount' => $app->transport_amount ?? 0,
                    'effective_from' => $app->admission_date ?? now(),
                    'effective_until' => null, // active
                    'remarks' => 'Assigned during admission',
                ]
            );
        }

        // Hostel Allocation
        if ($app->hostel_required && $app->hostel_room_id) {
            $allocation = \App\Models\HostelAllocation::where('user_id', $userId)
                ->where('status', 'active')
                ->first();

            $bedId = $app->hostel_bed_id;
            if (!$bedId) {
                $bed = \App\Models\HostelBed::where('hostel_room_id', $app->hostel_room_id)
                    ->where('status', 'vacant')
                    ->first();
                $bedId = $bed?->id;
            }

            if ($allocation) {
                // Free old bed if changed
                if ($allocation->hostel_bed_id && $allocation->hostel_bed_id !== $bedId) {
                    \App\Models\HostelBed::where('id', $allocation->hostel_bed_id)->update(['status' => 'vacant']);
                }
                
                $allocation->update([
                    'hostel_room_id' => $app->hostel_room_id,
                    'hostel_bed_id' => $bedId ?? $allocation->hostel_bed_id,
                    'monthly_amount' => $app->hostel_amount ?? 0,
                    'remarks' => 'Updated during readmission',
                ]);
            } else {
                \App\Models\HostelAllocation::create([
                    'institution_id' => $app->institution_id,
                    'user_id' => $userId,
                    'hostel_room_id' => $app->hostel_room_id,
                    'hostel_bed_id' => $bedId,
                    'monthly_amount' => $app->hostel_amount ?? 0,
                    'check_in_date' => $app->admission_date ?? now(),
                    'check_out_date' => null,
                    'status' => 'active',
                    'remarks' => 'Allocated during admission',
                ]);
            }

            if ($bedId) {
                \App\Models\HostelBed::where('id', $bedId)->update(['status' => 'occupied']);
            }
        }
    }

    private function notifyExistingGuardian(AdmissionApplication $app, User $user, $guardian): void
    {
        try {
            $parentUser = User::where('email', $guardian->email)
                ->orWhere('contact_email', $guardian->email)
                ->first();

            $targetUrl = ($parentUser && empty($parentUser->password))
                ? VerificationToken::verifyEmailUrl($parentUser)
                : (Route::has('login') ? route('login') : url('/login'));

            SendParentOnboardingNotificationJob::dispatchSync(
                $guardian->email,
                $app->applicant_name ?? $user->name,
                $targetUrl
            );
        } catch (\Throwable $e) {
            \Log::warning('Parent onboarding notification failed: ' . $e->getMessage());
        }

        // Mark student verified if guardian's primary email is verified
        $isGuardianVerified = User::where(function ($q) use ($guardian) {
                $q->where('email', $guardian->email)->orWhere('contact_email', $guardian->email);
            })
            ->whereNotNull('email_verified_at')
            ->exists();

        if ($isGuardianVerified) {
            $user->update(['email_verified_at' => now()]);
        }
    }

    private function notifyStudent(AdmissionApplication $app, User $user): void
    {
        if ($user->isEmailVerified()) {
            return;
        }

        $regNo = $user->studentProfile?->reg_no ?? $app->application_id ?? '';

        try {
            $user->notify(new StudentOnboardNotification(
                (int) $app->institution_id,
                $regNo,
                $app->email
            ));
        } catch (\Throwable $e) {
            \Log::warning('Student onboard notification failed after approval: ' . $e->getMessage());
        }
    }
}

<?php

namespace App\Http\Controllers\Api\V1\Admission;

use App\Enums\ProcessStatus;
use App\Http\Controllers\Api\V1\BaseController;
use App\Models\AdmissionApplication;
use App\Notifications\AdmissionApplicationSubmittedNotification;
use App\Notifications\AdmissionPaymentRecordedNotification;
use App\Notifications\AdmissionStatusChangedNotification;
use App\Traits\DispatchesRealtimeNotifications;
use App\Models\AdmissionHead;
use App\Models\AdmissionVerificationData;
use App\Services\AdmissionToStudentSyncService;
use App\Services\GuardianService;
use App\Models\FeePayment;
use App\Services\FinancialDocuments\AdmissionFeeBreakdownNormalizer;
use App\Services\FinancialDocuments\AssembleAdmissionInvoice;
use App\Services\FinancialDocuments\FinancialPdfRenderer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Services\AdmissionPaymentService;
use App\Services\FeeCalculationEngine;
use App\Support\ApiErrorMap;
use RuntimeException;

/**
 * @OA\Schema(
 *     schema="AdmissionApplication",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="application_id", type="string"),
 *     @OA\Property(property="user_id", type="integer"),
 *     @OA\Property(property="admission_head_id", type="integer"),
 *     @OA\Property(property="applicant_name", type="string"),
 *     @OA\Property(property="payment_status", type="string", enum={"pending", "paid", "failed"}),
 *     @OA\Property(property="process_status", type="string", enum={"pending", "approved", "rejected"})
 * )
 */
class ApplicationController extends BaseController
{
    use DispatchesRealtimeNotifications;

    private FeeCalculationEngine $engine;
    protected \App\Services\InstitutionBrandingService $brandingService;

    public function __construct(
        FeeCalculationEngine $engine,
        \App\Services\InstitutionBrandingService $brandingService,
        private AdmissionFeeBreakdownNormalizer $admissionFeeBreakdownNormalizer,
        private AssembleAdmissionInvoice $assembleAdmissionInvoice,
        private FinancialPdfRenderer $financialPdfRenderer,
    ) {
        $this->engine = $engine;
        $this->brandingService = $brandingService;
    }

    /**
     * @OA\Get(
     * path="/applications",
     * summary="List all admission applications with advanced filters",
     * tags={"Admission Applications"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="stream_id", in="query", @OA\Schema(type="integer"), description="Filter by Stream ID"),
     * @OA\Parameter(name="status", in="query", @OA\Schema(type="string", enum={"pending", "approved", "rejected"}), description="Filter by process status"),
     * @OA\Parameter(name="payment_status", in="query", @OA\Schema(type="string", enum={"pending", "success", "failed"}), description="Filter by payment status"),
     * @OA\Parameter(name="start_date", in="query", @OA\Schema(type="string", format="date"), description="Submission start date (YYYY-MM-DD)"),
     * @OA\Parameter(name="end_date", in="query", @OA\Schema(type="string", format="date"), description="Submission end date (YYYY-MM-DD)"),
     * @OA\Parameter(name="search_by", in="query", @OA\Schema(type="string", enum={"mobile", "app_id", "name", "email", "university_no"}), description="Field to search by"),
     * @OA\Parameter(name="search_text", in="query", @OA\Schema(type="string"), description="The search term"),
     * @OA\Parameter(name="per_page", in="query", @OA\Schema(type="integer", default=50), description="Results per page"),
     * @OA\Response(response=200, description="Successful retrieval of applications"),
     * @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $institutionId = \App\Support\InstitutionContext::getActiveInstitutionId($request->user());

        $query = AdmissionApplication::with([
            'admissionHead.stream',
            'admissionHead.majorSubject',
            'lmsClass',
            'stream',
            'session',
            'transaction'
        ])->where('institution_id', $institutionId);

        // If the user has the 'portal' permission (student/candidate), scope to their own applications
        if ($request->user()->hasAbility('portal')) {
            $query->where('user_id', $request->user()->id);
        }

        // 1. Filter by Stream (via AdmissionHead relation)
        $query->when($request->filled('stream_id') && $request->stream_id !== 'all', function ($q) use ($request) {
            return $q->whereHas('admissionHead', fn($sq) => $sq->where('stream_id', $request->stream_id));
        });

        // 1b. Filter by Session
        $query->when($request->filled('session_id') && $request->session_id !== 'all', fn($q) => $q->where('session_id', $request->session_id));

        // 1c. Filter by Application Type (new / re-admission)
        $query->when($request->filled('application_type') && $request->application_type !== 'all', fn($q) => $q->where('application_type', $request->application_type));

        // 2. Filter by Process Status (UI "Status" dropdown)
        $query->when($request->filled('status') && $request->status !== 'all', fn($q) => $q->where('process_status', $request->status));

        // 3. Filter by Payment Status (UI "Payment" dropdown)
        $query->when($request->filled('payment_status') && $request->payment_status !== 'all', fn($q) => $q->where('payment_status', $request->payment_status));

        // 4. Filter by Date Range (Submitted On column)
        if ($request->filled('start_date')) {
            $query->where('submitted_at', '>=', $request->start_date . ' 00:00:00');
        }
        if ($request->filled('end_date')) {
            $query->where('submitted_at', '<=', $request->end_date . ' 23:59:59');
        }

        // 5. Search by Field (Mobile, Application ID, Name, Email, University Roll No)
        $query->when($request->filled('search_text'), function ($q) use ($request) {
            $text = $request->search_text;
            switch ($request->search_by) {
                case 'mobile':
                    return $q->where('mobile', 'like', "%$text%");
                case 'app_id':
                    return $q->where('application_id', 'like', "%$text%");
                case 'name':
                    return $q->where('applicant_name', 'like', "%$text%");
                case 'email':
                    return $q->where('email', 'like', "%$text%");
                case 'university_no':
                    // Search by University Roll No
                    return $q->whereHas('user.studentProfile', fn($sq) => $sq->where('university_roll_no', 'like', "%$text%"));
            }
        });

        $perPage = $request->input('per_page', 15);
        $paginator = $query->orderBy('submitted_at', 'desc')->paginate($perPage);

        $data = app(\App\Services\ApiResponseMapService::class)->filterCollection($paginator->items(), 'application_index');

        // Dynamic stats calculations
        $statsQuery = AdmissionApplication::query()->where('institution_id', $institutionId);

        if ($request->filled('session_id') && $request->session_id !== 'all') {
            $statsQuery->where('session_id', $request->session_id);
        }
        if ($request->filled('application_type') && $request->application_type !== 'all') {
            $statsQuery->where('application_type', $request->application_type);
        }
        if ($request->filled('stream_id') && $request->stream_id !== 'all') {
            $statsQuery->whereHas('admissionHead', fn($sq) => $sq->where('stream_id', $request->stream_id));
        }
        if ($request->filled('status') && $request->status !== 'all') {
            $statsQuery->where('process_status', $request->status);
        }
        if ($request->filled('payment_status') && $request->payment_status !== 'all') {
            $statsQuery->where('payment_status', $request->payment_status);
        }
        if ($request->filled('start_date')) {
            $statsQuery->where('submitted_at', '>=', $request->start_date . ' 00:00:00');
        }
        if ($request->filled('end_date')) {
            $statsQuery->where('submitted_at', '<=', $request->end_date . ' 23:59:59');
        }

        $totalApps = (clone $statsQuery)->count();
        $approvedApps = (clone $statsQuery)->whereIn('process_status', ['approved', 'admitted', 'completed'])->count();
        $pendingApps = (clone $statsQuery)->where('process_status', 'pending')->count();
        
        $totalCollection = (clone $statsQuery)
            ->whereIn('payment_status', ['paid', 'success'])
            ->selectRaw('SUM(COALESCE(cash_amount, 0) + COALESCE(online_amount, 0)) as total')
            ->value('total') ?? 0.0;

        $stats = [
            'total_applications' => (int) $totalApps,
            'approved_applications' => (int) $approvedApps,
            'pending_applications' => (int) $pendingApps,
            'total_collection' => (float) $totalCollection,
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



    /**
     * @OA\Get(
     * path="/applications/re-admissions",
     * summary="List all RE-ADMISSION applications with advanced filters",
     * tags={"Admission Applications"},
     * security={{"sanctum":{}}},
     * @OA\Parameter(name="stream_id", in="query", @OA\Schema(type="integer")),
     * @OA\Parameter(name="status", in="query", @OA\Schema(type="string", enum={"pending", "approved", "rejected"})),
     * @OA\Parameter(name="payment_status", in="query", @OA\Schema(type="string", enum={"pending", "success", "failed"})),
     * @OA\Parameter(name="search_by", in="query", @OA\Schema(type="string", enum={"mobile", "app_id", "name", "email", "reg_no", "roll_no", "abc_no"})),
     * @OA\Parameter(name="search_text", in="query", @OA\Schema(type="string")),
     * @OA\Response(response=200, description="Filtered list of re-admission applications")
     * )
     */
    public function reAdmissions(Request $request): JsonResponse
    {

        $query = AdmissionApplication::with([
            'user.studentProfile',
            'admissionHead.stream',
            'transaction'
        ])->where('application_type', 're-admission');

        // Filter by Stream
        $query->when($request->filled('stream_id'), function ($q) use ($request) {
            return $q->whereHas('admissionHead', fn($sq) => $sq->where('stream_id', $request->stream_id));
        });

        // Filter by Process Status (Pending/Approved)
        $query->when($request->filled('status'), fn($q) => $q->where('process_status', $request->status));

        // Filter by Payment Status
        $query->when($request->filled('payment_status'), fn($q) => $q->where('payment_status', $request->payment_status));

        // Filter by Date Range
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('submitted_at', [$request->start_date . ' 00:00:00', $request->end_date . ' 23:59:59']);
        }

        // Filter by Search
        $query->when($request->filled('search_text'), function ($q) use ($request) {
            $text = $request->search_text;
            switch ($request->search_by) {
                case 'mobile':
                    return $q->where('mobile', 'like', "%$text%");
                case 'app_id':
                    return $q->where('application_id', 'like', "%$text%");
                case 'name':
                    return $q->where('applicant_name', 'like', "%$text%");
                case 'email':
                    return $q->where('email', 'like', "%$text%");
                case 'reg_no':
                    return $q->whereHas('user.studentProfile', fn($sq) => $sq->where('reg_no', 'like', "%$text%"));
                case 'roll_no':
                    return $q->whereHas('user.studentProfile', fn($sq) => $sq->where('roll_no', 'like', "%$text%"));
                case 'abc_no':
                    return $q->where('abc_id', 'like', "%$text%");
            }
        });

        return $this->paginatedWithMap(
            $query->orderBy('submitted_at', 'desc')->paginate($request->input('per_page', 15)),
            'application_index'
        );
    }



    /**
     * @OA\Post(
     *     path="/applications",
     *     summary="Submit application",
     *     tags={"Admission Applications"},
     *     security={{"cookieAuth":{}}},
     *     @OA\RequestBody(required=true, @OA\JsonContent(
     *         required={"applicant_name"},
     *         @OA\Property(property="admission_head_id", type="integer", description="Optional. Auto-resolved from stream_id + active session if absent."),
     *         @OA\Property(property="stream_id", type="integer", description="Main stream ID. Required when admission_head_id is not provided."),
     *         @OA\Property(property="applicant_name", type="string"),
     *         @OA\Property(property="father_name", type="string"),
     *         @OA\Property(property="mother_name", type="string"),
     *         @OA\Property(property="dob", type="string", format="date"),
     *         @OA\Property(property="gender", type="string"),
     *         @OA\Property(property="category", type="string"),
     *         @OA\Property(property="mobile", type="string"),
     *         @OA\Property(property="email", type="string")
     *     )),
     *     @OA\Response(response=201, description="Application submitted")
     * )
     *
     * Institution: Uses AdmissionApplication::getActiveInstitutionId() (same as model scope) so created
     * applications are visible on index/show. Fallback to user()->institution_id when active is null.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'admission_head_id' => 'nullable|exists:admission_heads,id',
            'stream_id' => 'required_without:admission_head_id|nullable|integer',
            'applicant_name' => 'required|string|max:150',
            'father_name' => 'nullable|string|max:150',
            'mother_name' => 'nullable|string|max:150',
            'dob' => 'nullable|date',
            'gender' => 'nullable|string|max:20',
            'category' => 'nullable|string|max:30',
            'caste' => 'nullable|string|max:50',
            'religion' => 'nullable|string|max:50',
            'nationality' => 'nullable|string|max:50',
            'blood_group' => 'nullable|string|max:10',
            'aadhaar_no' => 'nullable|string|max:20',
            'abc_id' => 'nullable|string|max:100',
            'apaar_id' => 'nullable|string|max:50',
            'father_mobile' => 'nullable|string|max:15',
            'father_qualification' => 'nullable|string|max:100',
            'previous_school_name' => 'nullable|string|max:200',
            'has_tc' => 'nullable|boolean',
            'has_government_portal' => 'nullable|boolean',
            'government_portal_name' => 'nullable|string|max:200',
            'photo_url' => 'nullable|string|max:500',
            'hostel_required' => 'nullable|boolean',
            'hostel_id' => 'nullable|integer|exists:hostels,id',
            'hostel_room_id' => 'nullable|integer|exists:hostel_rooms,id',
            'hostel_amount' => 'nullable|numeric|min:0',
            'medical_condition' => 'nullable|string|max:200',
            'disability' => 'nullable|string|max:200',
            'allergy' => 'nullable|string|max:200',
            'address_snapshot' => 'nullable|array',
            'guardian_snapshot' => 'nullable|array',
            'admission_date' => 'nullable|date',
            'mobile' => 'nullable|string|max:15',
            'email' => 'nullable|email|max:150',
            'class_id' => 'nullable|integer',
            'section_id' => 'nullable|integer',
            'transport_route_id' => 'nullable|integer',
            'transport_stop_id' => 'nullable|integer',
            'transport_amount' => 'nullable|numeric|min:0',
            'fee_regulation_profile_id' => 'nullable|integer|exists:fee_regulation_profiles,id',
            'fees' => 'nullable|array',
            'inventory_items' => 'nullable|array',
            'subject_preferences' => 'nullable|array',
            'previous_board' => 'nullable|string|max:100',
            'previous_marks' => 'nullable|numeric|between:0,100',
            // Split payment (optional — if provided, marks as paid)
            'cash_amount' => 'nullable|numeric|min:0',
            'online_amount' => 'nullable|numeric|min:0',
            'online_transaction_id' => 'nullable|required_with:online_amount|string|max:100',
            'documents' => 'nullable|array',
            'documents.*.doc_type' => 'required|string|in:birth_certificate,aadhaar,tc,marksheet,caste,parent_signature',
            'documents.*.path' => 'required|string|max:500',
            'discount_amount' => 'nullable|numeric|min:0',
            'discount_reason' => 'nullable|string|max:255',
            'due_amount' => 'nullable|numeric|min:0',
            'application_type' => 'nullable|in:new,re-admission',
            'process_status' => 'nullable|in:draft,pending',
        ]);

        // Use the same institution resolution as the model's global scope (BelongsToDefaultInstitution)
        // so created applications are visible on list/show without mismatch.
        $activeInstitutionId = AdmissionApplication::getActiveInstitutionId($request->user())
            ?? $request->user()->institution_id;

        // Persist draft stream_id so it's never lost during editing
        if (!empty($validated['stream_id'])) {
            $prefs = $validated['subject_preferences'] ?? [];
            $prefs['_draft_stream_id'] = $validated['stream_id'];
            $validated['subject_preferences'] = $prefs;
        }

        // Auto-resolve admission head if not provided (Application Desk flow)
        if (empty($validated['admission_head_id']) && !empty($validated['stream_id'])) {
            $session = app(\App\Services\AcademicCalendarService::class)->resolveCurrentSession($activeInstitutionId);

            if ($session) {
                $head = AdmissionHead::where('main_stream_id', $validated['stream_id'])
                    ->where('session_id', $session->id)
                    ->where('institution_id', $activeInstitutionId)
                    ->first();

                if ($head) {
                    $validated['admission_head_id'] = $head->id;
                }
            }
        }

        // Resolve session/institution from admission head, or fall back to active institution
        if (!empty($validated['admission_head_id'])) {
            $head = AdmissionHead::with('session')->findOrFail($validated['admission_head_id']);
            $validated['institution_id'] = $head->institution_id;
            $validated['session_id'] = $head->session_id;
            $validated['session_name'] = $head->session?->name;
            $validated['application_type'] = $validated['application_type'] ?? $head->course_for;
            $validated['semester'] = $head->semester;
        } else {
            $session = $session ?? app(\App\Services\AcademicCalendarService::class)->resolveCurrentSession($activeInstitutionId);
            $validated['institution_id'] = $activeInstitutionId;
            $validated['session_id'] = $session?->id;
            $validated['session_name'] = $session?->name;
            $validated['application_type'] = $validated['application_type'] ?? 'new';
        }

        $user = $request->user();
        $targetUserId = $user->id;

        // Application Desk flow: If admin/staff submits for a student (email/mobile provided), use the applicant's user — never the logged-in admin.
        // Strategy:
        //   1. Exact match (contact + name) → reuse that user (same student re-applying).
        //   2. Contact exists but name differs → different student sharing guardian's phone/email.
        //      Create a new user WITHOUT the duplicate mobile (mobile belongs to the guardian/existing user).
        //      The GuardianService call below will link them.
        $isDeskSubmitter = $user->hasRole('staff') || $user->hasRole('admin') || $user->hasRole('institution_admin')
            || $user->hasRole('college_admin') || $user->hasRole('principal') || $user->hasRole('super_admin');
        if ($isDeskSubmitter && (!empty($validated['email']) || !empty($validated['mobile']))) {
            $nameNormalized = strtolower(trim((string) ($validated['applicant_name'] ?? '')));

            // Step 1: Try exact match (contact + name) — same student re-applying
            $studentUser = User::query()
                ->where(function ($q) use ($validated) {
                    if (!empty($validated['email'])) {
                        $q->where('email', $validated['email']);
                    }
                    if (!empty($validated['mobile'])) {
                        $q->orWhere('mobile', $validated['mobile']);
                    }
                })
                ->whereRaw('LOWER(TRIM(name)) = ?', [$nameNormalized])
                ->first();

            if ($studentUser) {
                Log::info('Admission desk: reusing existing user', [
                    'existing_user_id' => $studentUser->id,
                    'name' => $studentUser->name,
                    'mobile' => $validated['mobile'] ?? null,
                    'submitted_by' => $user->id,
                ]);
            } else {
                // Step 2: Check if mobile/email already belongs to a different user (guardian's phone)
                $existingMobileUser = !empty($validated['mobile'])
                    ? User::where('mobile', $validated['mobile'])->first()
                    : null;
                $emailAlreadyTaken = !empty($validated['email'])
                    && User::where('email', $validated['email'])->exists();

                // Generate a unique internal email for the new student user
                $email = (!$emailAlreadyTaken && !empty($validated['email']))
                    ? $validated['email']
                    : ('student-' . preg_replace('/\D/', '', (string) ($validated['mobile'] ?? '')) . '-' . strtolower(substr(uniqid(), -6)) . '@internal.local');

                $studentUser = User::create([
                    'name' => $validated['applicant_name'],
                    'email' => $email,
                    'contact_email' => $validated['email'] ?? $email,
                    // Only set mobile if it's not already taken by another user
                    'mobile' => $existingMobileUser ? null : ($validated['mobile'] ?? null),
                    'password' => Hash::make($validated['mobile'] ?? 'password123'),
                    'email_verified_at' => null,
                    'status' => 1,
                ]);

                $role = Role::where('key', 'candidate')->first();
                if ($role) {
                    $studentUser->roles()->attach($role->id, ['assigned_at' => now()]);
                }

                // Auto-upgrade: if mobile belongs to an existing user, promote them to parent
                // and link the new student as their ward so they can switch accounts.
                if ($existingMobileUser) {
                    $institutionId = $validated['institution_id'] ?? null;

                    // 1. Assign parent role to the existing user (idempotent)
                    app(GuardianService::class)->assignParentRoleIfMissing(
                        $existingMobileUser->id,
                        $institutionId
                    );

                    // 2. Ensure a Guardian record exists and is linked to both the existing user
                    //    and the new student, so account switching works.
                    $guardianName = $existingMobileUser->name;
                    $guardianResult = app(GuardianService::class)->resolveOrCreateAndLinkToStudent(
                        $institutionId,
                        $existingMobileUser->email,
                        $validated['mobile'],
                        $guardianName,
                        $studentUser->id,
                        $validated['guardian_snapshot']['relation'] ?? 'guardian'
                    );

                    // 3. Link guardian record to the existing user so they can switch
                    if ($guardianResult['guardian'] && !$guardianResult['guardian']->user_id) {
                        $guardianResult['guardian']->update(['user_id' => $existingMobileUser->id]);
                    }

                    Log::info('Admission desk: auto-upgraded existing user to parent and linked new student', [
                        'parent_user_id' => $existingMobileUser->id,
                        'parent_name' => $existingMobileUser->name,
                        'student_user_id' => $studentUser->id,
                        'student_name' => $validated['applicant_name'],
                        'mobile' => $validated['mobile'],
                        'submitted_by' => $user->id,
                    ]);
                }
            }
            $targetUserId = $studentUser->id;
        }

        $validated['user_id'] = $targetUserId;
        $validated['submitted_at'] = now();
        $validated['process_status'] = $validated['process_status'] ?? 'pending';

        // Generate collision-safe application_id using MAX sequence for the current year
        $yearPrefix = 'APP' . date('Y');
        $lastId = AdmissionApplication::withoutGlobalScopes()
            ->where('application_id', 'like', $yearPrefix . '%')
            ->max('application_id');
        $nextSeq = $lastId ? ((int) substr($lastId, strlen($yearPrefix)) + 1) : 1;
        $validated['application_id'] = $yearPrefix . str_pad($nextSeq, 6, '0', STR_PAD_LEFT);

        // Calculate total amount using FeeCalculationEngine
        $total = 0;
        $feeBreakdown = null;

        if (!empty($validated['admission_head_id'])) {
            // Use the engine for deterministic, profile-aware fee calculation
            $engineResult = $this->engine->calculateAdmissionFee(
                $validated['institution_id'],
                (int) $validated['admission_head_id'],
                $validated['category'] ?? null,
                $validated['gender'] ?? null,
                $validated['student_type'] ?? null,
                $validated['fee_regulation_profile_id'] ?? null
            );
            $total = $engineResult['gross']; // Use gross, discount is tracked separately
            $feeBreakdown = $engineResult['items'];
            if (!empty($engineResult['profile_id'])) {
                $validated['fee_regulation_profile_id'] = $engineResult['profile_id'];
            }
        }

        // Add transport and hostel on top of the engine-computed fee
        if (!empty($validated['transport_amount'])) {
            $transportAmount = (float) $validated['transport_amount'];
            $total += $transportAmount;
            if (is_array($feeBreakdown)) {
                $feeBreakdown[] = [
                    'name'     => 'Transport Fee (Advance)',
                    'amount'   => $transportAmount,
                    'type'     => 'transport',
                    'category' => 'services',
                ];
            }
        }
        if (!empty($validated['hostel_required']) && !empty($validated['hostel_amount'])) {
            $hostelAmount = (float) $validated['hostel_amount'];
            $total += $hostelAmount;
            if (is_array($feeBreakdown)) {
                $feeBreakdown[] = [
                    'name'     => 'Hostel Fee (Advance)',
                    'amount'   => $hostelAmount,
                    'type'     => 'hostel',
                    'category' => 'services',
                ];
            }
        }

        // If engine had no rules (e.g. no admission head), fall back to fees[] array
        if ($feeBreakdown === null && isset($validated['fees']) && is_array($validated['fees'])) {
            $feeBreakdown = $this->admissionFeeBreakdownNormalizer->normalize($validated['fees']);
            $total += array_reduce($feeBreakdown, function ($carry, $item) {
                // For gross total, only sum up positive charges, ignore discount items
                return $carry + (($item['category'] === 'discount') ? 0 : (float) ($item['amount'] ?? 0));
            }, 0);
        }
        if (isset($validated['inventory_items']) && is_array($validated['inventory_items'])) {
            $inventoryTotal = array_reduce($validated['inventory_items'], fn($carry, $item) => $carry + (($item['price'] ?? 0) * ($item['quantity'] ?? 1)), 0);
            $total += $inventoryTotal;

            // Itemize inventory into fee_breakdown for frontend summary logic
            foreach ($validated['inventory_items'] as $item) {
                $itemId = (int) ($item['item_id'] ?? 0);
                $dbItem = \App\Models\InventoryItem::find($itemId);
                $itemName = $dbItem ? $dbItem->name : 'Inventory Item';
                $feeBreakdown[] = [
                    'name'              => $itemName . ' (x' . ($item['quantity'] ?? 1) . ')',
                    'amount'            => (float) ($item['price'] ?? 0) * (int) ($item['quantity'] ?? 1),
                    'type'              => 'inventory',
                    'category'          => 'inventory',
                    'inventory_item_id' => $itemId,
                    'quantity'          => (int) ($item['quantity'] ?? 1),
                    'unit_price'        => (float) ($item['price'] ?? 0),
                ];
            }
        }

        $validated['amount'] = $total;
        $validated['fee_breakdown'] = $feeBreakdown;

        // Handle split payment at creation time
        $cashAmount = $validated['cash_amount'] ?? 0;
        $onlineAmount = $validated['online_amount'] ?? 0;
        $hasSplitPayment = ($cashAmount > 0 || $onlineAmount > 0);

        if ($hasSplitPayment) {
            $validated['cash_amount'] = $cashAmount;
            $validated['online_amount'] = $onlineAmount;
            $validated['payment_mode'] = ($cashAmount > 0 && $onlineAmount > 0) ? 'split' : ($onlineAmount > 0 ? 'online' : 'cash');
            $validated['payment_status'] = \App\Enums\PaymentStatus::SUCCESS->value;
            $validated['payment_date'] = now();
            $validated['transaction_id'] = $validated['online_transaction_id'] ?? ('TXN' . strtoupper(uniqid()));
        }

        // Calculate final due amount using the universal formula
        $discountAmount = $validated['discount_amount'] ?? 0;
        $totalPaid = $cashAmount + $onlineAmount;
        $this->assertNoAdmissionOverpayment((float) $total, (float) $discountAmount, (float) $totalPaid);
        $validated['due_amount'] = $this->engine->calculateDue($total, $discountAmount, $totalPaid);

        try {
            return DB::transaction(function () use ($request, $validated, $hasSplitPayment, $total) {
                $application = AdmissionApplication::create($validated);

                // Guardian: one parent → many students
                $guardianSnapshot = $validated['guardian_snapshot'] ?? [];
                $guardianName = is_array($guardianSnapshot) ? ($guardianSnapshot['name'] ?? null) : null;
                $guardianName = $guardianName ?? $validated['father_name'] ?? null;
                $relation = is_array($guardianSnapshot) ? ($guardianSnapshot['relation'] ?? 'guardian') : 'guardian';
                app(GuardianService::class)->resolveOrCreateAndLinkToStudent(
                    $validated['institution_id'] ?? null,
                    $validated['email'] ?? null,
                    $validated['mobile'] ?? null,
                    $guardianName,
                    (int) $application->user_id,
                    $relation
                );

                // Persist document uploads to admission_verification_data (one row per doc type)
                $documents = $validated['documents'] ?? [];
                foreach ($documents as $doc) {
                    AdmissionVerificationData::updateOrCreate(
                        [
                            'admission_application_id' => $application->id,
                            'field_key' => $doc['doc_type'],
                        ],
                        [
                            'institution_id' => $application->institution_id,
                            'field_type' => 'file',
                            'file_url' => $doc['path'],
                        ]
                    );
                }

                // Create transaction record if payment was made
                if ($hasSplitPayment) {
                    \App\Models\Transaction::create([
                        'user_id' => $application->user_id,
                        'transaction_id' => $application->transaction_id,
                        'type' => 'admission_payment',
                        'payable_type' => get_class($application),
                        'payable_id' => $application->id,
                        'amount' => $application->amount,
                        'payment_mode' => $application->payment_mode,
                        'status' => 'success',
                        'meta' => [
                            'cash_amount' => $application->cash_amount,
                            'online_amount' => $application->online_amount,
                            'online_transaction_id' => $application->online_transaction_id,
                            'recorded_by' => $request->user()->id,
                            'recorded_at' => now()->toDateTimeString(),
                        ],
                    ]);

                    // Dual-write: create FeePayment so admission payment appears in student ledger
                    $totalPaid = ($validated['cash_amount'] ?? 0) + ($validated['online_amount'] ?? 0);
                    FeePayment::create([
                        'institution_id'        => $application->institution_id,
                        'payment_id'            => 'PAY-ADM-' . strtoupper(uniqid()),
                        'user_id'               => $application->user_id,
                        'amount'                => $totalPaid,
                        'total_amount'          => $totalPaid,
                        'payment_mode'          => $application->payment_mode,
                        'payment_status'        => 'paid',
                        'payment_date'          => now(),
                        'collected_by'          => $request->user()->id,
                        'receipt_no'            => 'RCP-ADM-' . strtoupper(uniqid()),
                        'cash_amount'           => $application->cash_amount ?: null,
                        'online_amount'         => $application->online_amount ?: null,
                        'online_transaction_id' => $application->online_transaction_id ?? null,
                        'remarks'               => 'Admission fee (desk)',
                        'payable_entity_type'   => 'admission_application',
                        'payable_entity_id'     => $application->id,
                        'ledger_snapshot'       => [
                            'fees'       => $feeBreakdown ?? ($validated['fees'] ?? []),
                            'discount'   => $validated['discount_amount'] ?? 0,
                            'due'        => $validated['due_amount'] ?? 0,
                            'total_fees' => $total,
                        ],
                    ]);

                    app(AdmissionPaymentService::class)->processInventorySaleForAdmission($application, $totalPaid, $request->user()->id);
                }

                // Note: Student sync happens when admin manually approves (via process endpoint)

                // Notify admission cell users; optionally notify applicant (confirmation)
                $admissionCellUsers = User::withAdmissionCellForInstitution((int) $application->institution_id)->get();
                if ($admissionCellUsers->isNotEmpty()) {
                    $this->notifyRealtimeMany($admissionCellUsers, new AdmissionApplicationSubmittedNotification($application));
                }
                $applicant = $application->user;
                if ($applicant && $applicant->id !== $request->user()?->id) {
                    $this->notifyRealtime($applicant, new AdmissionApplicationSubmittedNotification($application));
                }

                return $this->created($application->fresh(), 'Application submitted');
            });
        } catch (RuntimeException $e) {
            Log::warning('Admission application: blocked overpayment attempt', [
                'error' => $e->getMessage(),
                'mobile' => $validated['mobile'] ?? null,
                'email' => $validated['email'] ?? null,
                'applicant_name' => $validated['applicant_name'] ?? null,
                'submitted_by' => $request->user()->id,
            ]);

            return ApiErrorMap::respond('admission.overpayment_not_allowed');
        } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
            Log::error('Admission application: unique constraint violation during submission', [
                'error' => $e->getMessage(),
                'mobile' => $validated['mobile'] ?? null,
                'email' => $validated['email'] ?? null,
                'applicant_name' => $validated['applicant_name'] ?? null,
                'submitted_by' => $request->user()->id,
            ]);

            return ApiErrorMap::respond('admission.duplicate_record');
        } catch (\Throwable $e) {
            Log::error('Admission application: unexpected error during submission', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'applicant_name' => $validated['applicant_name'] ?? null,
                'submitted_by' => $request->user()->id,
            ]);

            return ApiErrorMap::respond('admission.submission_failed');
        }
    }

public function update(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'admission_head_id' => 'nullable|exists:admission_heads,id',
            'stream_id' => 'required_without:admission_head_id|nullable|integer',
            'applicant_name' => 'required|string|max:150',
            'father_name' => 'nullable|string|max:150',
            'mother_name' => 'nullable|string|max:150',
            'dob' => 'nullable|date',
            'gender' => 'nullable|string|max:20',
            'category' => 'nullable|string|max:30',
            'caste' => 'nullable|string|max:50',
            'religion' => 'nullable|string|max:50',
            'nationality' => 'nullable|string|max:50',
            'blood_group' => 'nullable|string|max:10',
            'aadhaar_no' => 'nullable|string|max:20',
            'abc_id' => 'nullable|string|max:100',
            'apaar_id' => 'nullable|string|max:50',
            'father_mobile' => 'nullable|string|max:15',
            'father_qualification' => 'nullable|string|max:100',
            'previous_school_name' => 'nullable|string|max:200',
            'has_tc' => 'nullable|boolean',
            'has_government_portal' => 'nullable|boolean',
            'government_portal_name' => 'nullable|string|max:200',
            'photo_url' => 'nullable|string|max:500',
            'hostel_required' => 'nullable|boolean',
            'hostel_id' => 'nullable|integer|exists:hostels,id',
            'hostel_room_id' => 'nullable|integer|exists:hostel_rooms,id',
            'hostel_amount' => 'nullable|numeric|min:0',
            'medical_condition' => 'nullable|string|max:200',
            'disability' => 'nullable|string|max:200',
            'allergy' => 'nullable|string|max:200',
            'address_snapshot' => 'nullable|array',
            'guardian_snapshot' => 'nullable|array',
            'admission_date' => 'nullable|date',
            'mobile' => 'nullable|string|max:15',
            'email' => 'nullable|email|max:150',
            'class_id' => 'nullable|integer',
            'section_id' => 'nullable|integer',
            'transport_route_id' => 'nullable|integer',
            'transport_stop_id' => 'nullable|integer',
            'transport_amount' => 'nullable|numeric|min:0',
            'fee_regulation_profile_id' => 'nullable|integer|exists:fee_regulation_profiles,id',
            'fees' => 'nullable|array',
            'inventory_items' => 'nullable|array',
            'subject_preferences' => 'nullable|array',
            'previous_board' => 'nullable|string|max:100',
            'previous_marks' => 'nullable|numeric|between:0,100',
            // Split payment (optional — if provided, marks as paid)
            'cash_amount' => 'nullable|numeric|min:0',
            'online_amount' => 'nullable|numeric|min:0',
            'online_transaction_id' => 'nullable|required_with:online_amount|string|max:100',
            'documents' => 'nullable|array',
            'documents.*.doc_type' => 'required|string|in:birth_certificate,aadhaar,tc,marksheet,caste,parent_signature',
            'documents.*.path' => 'required|string|max:500',
            'discount_amount' => 'nullable|numeric|min:0',
            'discount_reason' => 'nullable|string|max:255',
            'due_amount' => 'nullable|numeric|min:0',
            'application_type' => 'nullable|in:new,re-admission',
            'process_status' => 'nullable|in:draft,pending',
        ]);

        // Use the same institution resolution as the model's global scope (BelongsToDefaultInstitution)
        // so created applications are visible on list/show without mismatch.
        $activeInstitutionId = AdmissionApplication::getActiveInstitutionId($request->user())
            ?? $request->user()->institution_id;

        // Auto-resolve admission head if not provided (Application Desk flow)
        if (empty($validated['admission_head_id']) && !empty($validated['stream_id'])) {
            $session = app(\App\Services\AcademicCalendarService::class)->resolveCurrentSession($activeInstitutionId);

            if ($session) {
                $head = AdmissionHead::where('main_stream_id', $validated['stream_id'])
                    ->where('session_id', $session->id)
                    ->where('institution_id', $activeInstitutionId)
                    ->first();

                if ($head) {
                    $validated['admission_head_id'] = $head->id;
                }
            }
        }

        // Resolve session/institution from admission head, or fall back to active institution
        if (!empty($validated['admission_head_id'])) {
            $head = AdmissionHead::with('session')->findOrFail($validated['admission_head_id']);
            $validated['institution_id'] = $head->institution_id;
            $validated['session_id'] = $head->session_id;
            $validated['session_name'] = $head->session?->name;
            $validated['application_type'] = $validated['application_type'] ?? $head->course_for;
            $validated['semester'] = $head->semester;
        } else {
            $session = $session ?? app(\App\Services\AcademicCalendarService::class)->resolveCurrentSession($activeInstitutionId);
            $validated['institution_id'] = $activeInstitutionId;
            $validated['session_id'] = $session?->id;
            $validated['session_name'] = $session?->name;
            $validated['application_type'] = $validated['application_type'] ?? 'new';
        }

        $user = $request->user();
        $targetUserId = $user->id;

        // Application Desk flow: If admin/staff submits for a student (email/mobile provided), use the applicant's user — never the logged-in admin.
        // Strategy:
        //   1. Exact match (contact + name) → reuse that user (same student re-applying).
        //   2. Contact exists but name differs → different student sharing guardian's phone/email.
        //      Create a new user WITHOUT the duplicate mobile (mobile belongs to the guardian/existing user).
        //      The GuardianService call below will link them.
        $isDeskSubmitter = $user->hasRole('staff') || $user->hasRole('admin') || $user->hasRole('institution_admin')
            || $user->hasRole('college_admin') || $user->hasRole('principal') || $user->hasRole('super_admin');
        if ($isDeskSubmitter && (!empty($validated['email']) || !empty($validated['mobile']))) {
            $nameNormalized = strtolower(trim((string) ($validated['applicant_name'] ?? '')));

            // Step 1: Try exact match (contact + name) — same student re-applying
            $studentUser = User::query()
                ->where(function ($q) use ($validated) {
                    if (!empty($validated['email'])) {
                        $q->where('email', $validated['email']);
                    }
                    if (!empty($validated['mobile'])) {
                        $q->orWhere('mobile', $validated['mobile']);
                    }
                })
                ->whereRaw('LOWER(TRIM(name)) = ?', [$nameNormalized])
                ->first();

            if ($studentUser) {
                Log::info('Admission desk: reusing existing user', [
                    'existing_user_id' => $studentUser->id,
                    'name' => $studentUser->name,
                    'mobile' => $validated['mobile'] ?? null,
                    'submitted_by' => $user->id,
                ]);
            } else {
                // Step 2: Check if mobile/email already belongs to a different user (guardian's phone)
                $existingMobileUser = !empty($validated['mobile'])
                    ? User::where('mobile', $validated['mobile'])->first()
                    : null;
                $emailAlreadyTaken = !empty($validated['email'])
                    && User::where('email', $validated['email'])->exists();

                // Generate a unique internal email for the new student user
                $email = (!$emailAlreadyTaken && !empty($validated['email']))
                    ? $validated['email']
                    : ('student-' . preg_replace('/\D/', '', (string) ($validated['mobile'] ?? '')) . '-' . strtolower(substr(uniqid(), -6)) . '@internal.local');

                $studentUser = User::create([
                    'name' => $validated['applicant_name'],
                    'email' => $email,
                    'contact_email' => $validated['email'] ?? $email,
                    // Only set mobile if it's not already taken by another user
                    'mobile' => $existingMobileUser ? null : ($validated['mobile'] ?? null),
                    'password' => Hash::make($validated['mobile'] ?? 'password123'),
                    'email_verified_at' => null,
                    'status' => 1,
                ]);

                $role = Role::where('key', 'candidate')->first();
                if ($role) {
                    $studentUser->roles()->attach($role->id, ['assigned_at' => now()]);
                }

                // Auto-upgrade: if mobile belongs to an existing user, promote them to parent
                // and link the new student as their ward so they can switch accounts.
                if ($existingMobileUser) {
                    $institutionId = $validated['institution_id'] ?? null;

                    // 1. Assign parent role to the existing user (idempotent)
                    app(GuardianService::class)->assignParentRoleIfMissing(
                        $existingMobileUser->id,
                        $institutionId
                    );

                    // 2. Ensure a Guardian record exists and is linked to both the existing user
                    //    and the new student, so account switching works.
                    $guardianName = $existingMobileUser->name;
                    $guardianResult = app(GuardianService::class)->resolveOrCreateAndLinkToStudent(
                        $institutionId,
                        $existingMobileUser->email,
                        $validated['mobile'],
                        $guardianName,
                        $studentUser->id,
                        $validated['guardian_snapshot']['relation'] ?? 'guardian'
                    );

                    // 3. Link guardian record to the existing user so they can switch
                    if ($guardianResult['guardian'] && !$guardianResult['guardian']->user_id) {
                        $guardianResult['guardian']->update(['user_id' => $existingMobileUser->id]);
                    }

                    Log::info('Admission desk: auto-upgraded existing user to parent and linked new student', [
                        'parent_user_id' => $existingMobileUser->id,
                        'parent_name' => $existingMobileUser->name,
                        'student_user_id' => $studentUser->id,
                        'student_name' => $validated['applicant_name'],
                        'mobile' => $validated['mobile'],
                        'submitted_by' => $user->id,
                    ]);
                }
            }
            $targetUserId = $studentUser->id;
        }

        $validated['user_id'] = $targetUserId;
        $validated['submitted_at'] = now();
        $validated['process_status'] = $validated['process_status'] ?? 'pending';

        // Generate collision-safe application_id using MAX sequence for the current year
        $yearPrefix = 'APP' . date('Y');
        $lastId = AdmissionApplication::withoutGlobalScopes()
            ->where('application_id', 'like', $yearPrefix . '%')
            ->max('application_id');
        $nextSeq = $lastId ? ((int) substr($lastId, strlen($yearPrefix)) + 1) : 1;
        $validated['application_id'] = $yearPrefix . str_pad($nextSeq, 6, '0', STR_PAD_LEFT);

        // Calculate total amount using FeeCalculationEngine
        $total = 0;
        $feeBreakdown = null;

        if (!empty($validated['admission_head_id'])) {
            // Use the engine for deterministic, profile-aware fee calculation
            $engineResult = $this->engine->calculateAdmissionFee(
                $validated['institution_id'],
                (int) $validated['admission_head_id'],
                $validated['category'] ?? null,
                $validated['gender'] ?? null,
                $validated['student_type'] ?? null,
                $validated['fee_regulation_profile_id'] ?? null
            );
            $total = $engineResult['gross']; // Use gross, discount is tracked separately
            $feeBreakdown = $engineResult['items'];
            if (!empty($engineResult['profile_id'])) {
                $validated['fee_regulation_profile_id'] = $engineResult['profile_id'];
            }
        }

        // Add transport and hostel on top of the engine-computed fee
        if (!empty($validated['transport_amount'])) {
            $transportAmount = (float) $validated['transport_amount'];
            $total += $transportAmount;
            if (is_array($feeBreakdown)) {
                $feeBreakdown[] = [
                    'name'     => 'Transport Fee (Advance)',
                    'amount'   => $transportAmount,
                    'type'     => 'transport',
                    'category' => 'services',
                ];
            }
        }
        if (!empty($validated['hostel_required']) && !empty($validated['hostel_amount'])) {
            $hostelAmount = (float) $validated['hostel_amount'];
            $total += $hostelAmount;
            if (is_array($feeBreakdown)) {
                $feeBreakdown[] = [
                    'name'     => 'Hostel Fee (Advance)',
                    'amount'   => $hostelAmount,
                    'type'     => 'hostel',
                    'category' => 'services',
                ];
            }
        }

        // If engine had no rules (e.g. no admission head), fall back to fees[] array
        if ($feeBreakdown === null && isset($validated['fees']) && is_array($validated['fees'])) {
            $feeBreakdown = $this->admissionFeeBreakdownNormalizer->normalize($validated['fees']);
            $total += array_reduce($feeBreakdown, function ($carry, $item) {
                // For gross total, only sum up positive charges, ignore discount items
                return $carry + (($item['category'] === 'discount') ? 0 : (float) ($item['amount'] ?? 0));
            }, 0);
        }
        if (isset($validated['inventory_items']) && is_array($validated['inventory_items'])) {
            $inventoryTotal = array_reduce($validated['inventory_items'], fn($carry, $item) => $carry + (($item['price'] ?? 0) * ($item['quantity'] ?? 1)), 0);
            $total += $inventoryTotal;

            // Itemize inventory into fee_breakdown for frontend summary logic
            foreach ($validated['inventory_items'] as $item) {
                $itemId = (int) ($item['item_id'] ?? 0);
                $dbItem = \App\Models\InventoryItem::find($itemId);
                $itemName = $dbItem ? $dbItem->name : 'Inventory Item';
                $feeBreakdown[] = [
                    'name'              => $itemName . ' (x' . ($item['quantity'] ?? 1) . ')',
                    'amount'            => (float) ($item['price'] ?? 0) * (int) ($item['quantity'] ?? 1),
                    'type'              => 'inventory',
                    'category'          => 'inventory',
                    'inventory_item_id' => $itemId,
                    'quantity'          => (int) ($item['quantity'] ?? 1),
                    'unit_price'        => (float) ($item['price'] ?? 0),
                ];
            }
        }

        $validated['amount'] = $total;
        $validated['fee_breakdown'] = $feeBreakdown;

        // Handle split payment at creation time
        $cashAmount = $validated['cash_amount'] ?? 0;
        $onlineAmount = $validated['online_amount'] ?? 0;
        $hasSplitPayment = ($cashAmount > 0 || $onlineAmount > 0);

        if ($hasSplitPayment) {
            $validated['cash_amount'] = $cashAmount;
            $validated['online_amount'] = $onlineAmount;
            $validated['payment_mode'] = ($cashAmount > 0 && $onlineAmount > 0) ? 'split' : ($onlineAmount > 0 ? 'online' : 'cash');
            $validated['payment_status'] = \App\Enums\PaymentStatus::SUCCESS->value;
            $validated['payment_date'] = now();
            $validated['transaction_id'] = $validated['online_transaction_id'] ?? ('TXN' . strtoupper(uniqid()));
        }

        // Calculate final due amount using the universal formula
        $discountAmount = $validated['discount_amount'] ?? 0;
        $totalPaid = $cashAmount + $onlineAmount;
        $this->assertNoAdmissionOverpayment((float) $total, (float) $discountAmount, (float) $totalPaid);
        $validated['due_amount'] = $this->engine->calculateDue($total, $discountAmount, $totalPaid);

        // Persist draft stream_id so it's never lost during editing
        if (!empty($validated['stream_id'])) {
            $prefs = $validated['subject_preferences'] ?? [];
            $prefs['_draft_stream_id'] = $validated['stream_id'];
            $validated['subject_preferences'] = $prefs;
        }

        try {
            return DB::transaction(function () use ($request, $validated, $hasSplitPayment, $total, $id, $feeBreakdown) {
                $application = AdmissionApplication::findOrFail($id);
                if (!in_array($application->process_status, ['draft', 'pending'])) {
                    throw new RuntimeException('Application cannot be edited in its current status.');
                }
                $application->update($validated);

                // Guardian: one parent → many students
                $guardianSnapshot = $validated['guardian_snapshot'] ?? [];
                $guardianName = is_array($guardianSnapshot) ? ($guardianSnapshot['name'] ?? null) : null;
                $guardianName = $guardianName ?? $validated['father_name'] ?? null;
                $relation = is_array($guardianSnapshot) ? ($guardianSnapshot['relation'] ?? 'guardian') : 'guardian';
                app(GuardianService::class)->resolveOrCreateAndLinkToStudent(
                    $validated['institution_id'] ?? null,
                    $validated['email'] ?? null,
                    $validated['mobile'] ?? null,
                    $guardianName,
                    (int) $application->user_id,
                    $relation
                );

                // Persist document uploads to admission_verification_data (one row per doc type)
                $documents = $validated['documents'] ?? [];
                foreach ($documents as $doc) {
                    AdmissionVerificationData::updateOrCreate(
                        [
                            'admission_application_id' => $application->id,
                            'field_key' => $doc['doc_type'],
                        ],
                        [
                            'institution_id' => $application->institution_id,
                            'field_type' => 'file',
                            'file_url' => $doc['path'],
                        ]
                    );
                }

                // Create transaction record if payment was made
                if ($hasSplitPayment) {
                    \App\Models\Transaction::create([
                        'user_id' => $application->user_id,
                        'transaction_id' => $application->transaction_id,
                        'type' => 'admission_payment',
                        'payable_type' => get_class($application),
                        'payable_id' => $application->id,
                        'amount' => $application->amount,
                        'payment_mode' => $application->payment_mode,
                        'status' => 'success',
                        'meta' => [
                            'cash_amount' => $application->cash_amount,
                            'online_amount' => $application->online_amount,
                            'online_transaction_id' => $application->online_transaction_id,
                            'recorded_by' => $request->user()->id,
                            'recorded_at' => now()->toDateTimeString(),
                        ],
                    ]);

                    // Dual-write: create FeePayment so admission payment appears in student ledger
                    $totalPaid = ($validated['cash_amount'] ?? 0) + ($validated['online_amount'] ?? 0);
                    if (!FeePayment::where('payable_entity_type', 'admission_application')->where('payable_entity_id', $application->id)->exists()) {
                        FeePayment::create([
                        'institution_id'        => $application->institution_id,
                        'payment_id'            => 'PAY-ADM-' . strtoupper(uniqid()),
                        'user_id'               => $application->user_id,
                        'amount'                => $totalPaid,
                        'total_amount'          => $totalPaid,
                        'payment_mode'          => $application->payment_mode,
                        'payment_status'        => 'paid',
                        'payment_date'          => now(),
                        'collected_by'          => $request->user()->id,
                        'receipt_no'            => 'RCP-ADM-' . strtoupper(uniqid()),
                        'cash_amount'           => $application->cash_amount ?: null,
                        'online_amount'         => $application->online_amount ?: null,
                        'online_transaction_id' => $application->online_transaction_id ?? null,
                        'remarks'               => 'Admission fee (desk)',
                        'payable_entity_type'   => 'admission_application',
                        'payable_entity_id'     => $application->id,
                        'ledger_snapshot'       => [
                            'fees'       => $feeBreakdown ?? ($validated['fees'] ?? []),
                            'discount'   => $validated['discount_amount'] ?? 0,
                            'due'        => $validated['due_amount'] ?? 0,
                            'total_fees' => $total,
                        ],
                    ]);
                    }
                }

                // Note: Student sync happens when admin manually approves (via process endpoint)

                // Notify admission cell users; optionally notify applicant (confirmation)
                $admissionCellUsers = User::withAdmissionCellForInstitution((int) $application->institution_id)->get();
                if ($admissionCellUsers->isNotEmpty()) {
                    $this->notifyRealtimeMany($admissionCellUsers, new AdmissionApplicationSubmittedNotification($application));
                }
                $applicant = $application->user;
                if ($applicant && $applicant->id !== $request->user()?->id) {
                    $this->notifyRealtime($applicant, new AdmissionApplicationSubmittedNotification($application));
                }

                return $this->success($application->fresh(), 'Application updated successfully');
            });
        } catch (RuntimeException $e) {
            Log::warning('Admission application: blocked overpayment attempt', [
                'error' => $e->getMessage(),
                'mobile' => $validated['mobile'] ?? null,
                'email' => $validated['email'] ?? null,
                'applicant_name' => $validated['applicant_name'] ?? null,
                'submitted_by' => $request->user()->id,
            ]);

            return ApiErrorMap::respond('admission.overpayment_not_allowed');
        } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
            Log::error('Admission application: unique constraint violation during submission', [
                'error' => $e->getMessage(),
                'mobile' => $validated['mobile'] ?? null,
                'email' => $validated['email'] ?? null,
                'applicant_name' => $validated['applicant_name'] ?? null,
                'submitted_by' => $request->user()->id,
            ]);

            return ApiErrorMap::respond('admission.duplicate_record');
        } catch (\Throwable $e) {
            Log::error('Admission application: unexpected error during submission', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'applicant_name' => $validated['applicant_name'] ?? null,
                'submitted_by' => $request->user()->id,
            ]);

            return ApiErrorMap::respond('admission.submission_failed');
        }
    }

    /**
     * Download admission application invoice as PDF.
     */
    public function invoice(Request $request, AdmissionApplication $application)
    {
        try {
            $application->load(['admissionHead', 'admissionHead.stream']);

            $branding = $this->brandingService->resolve($application->institution_id);

            $isReadmission = ($application->application_type ?? 'new') === 're-admission';
            $filePrefix = $isReadmission ? 'ReAdmission_Receipt_' : 'Admission_Invoice_';

            $document = $this->assembleAdmissionInvoice->assemble($application);
            $fileName = $filePrefix . str_replace('#', '', $application->application_id) . '.pdf';

            if ($request->query('view') === 'print') {
                return $this->financialPdfRenderer->renderInline($document, $branding, $fileName);
            }

            return $this->financialPdfRenderer->renderDownload($document, $branding, $fileName);
        } catch (\Throwable $e) {
            Log::error('Application invoice PDF error: ' . $e->getMessage());
            return $this->error('Unable to generate invoice PDF.', 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/applications/{id}",
     *     summary="Get application",
     *     tags={"Admission Applications"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Application details")
     * )
     */
    public function show(Request $request, AdmissionApplication $application): JsonResponse
    {
        // If student, ensure they own the application
        if ($request->user()->hasAbility('portal') && $application->user_id !== $request->user()->id) {
            return $this->forbidden('You do not have permission to view this application.');
        }

        $application->load([
            'user',
            'admissionHead',
            'admissionHead.mainStream',
            'admissionHead.stream',
            'admissionHead.stream.mainStream',
            'admissionHead.feeStructures',
            'lmsClass',
            'stream',
            'stream.mainStream',
            'session',
        ]);

        return $this->successWithMap($application, 'application_show');
    }

    /**
    /**
     * @OA\Post(
     *     path="/applications/{id}/process",
     *     summary="Process application (approve/reject)",
     *     tags={"Admission Applications"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(required=true, @OA\JsonContent(
     *         required={"status"},
     *         @OA\Property(property="status", type="string", enum={"approved", "rejected"}),
     *         @OA\Property(property="remarks", type="string")
     *     )),
     *     @OA\Response(response=200, description="Application processed")
     * )
     */
    public function process(Request $request, AdmissionApplication $application): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:' . implode(',', [
                ProcessStatus::APPROVED->value,
                ProcessStatus::REJECTED->value
            ]),
            'remarks' => 'nullable|string',
        ]);

        $status = ProcessStatus::from($validated['status']);

        if ($status === ProcessStatus::APPROVED && (int) $application->user_id === (int) $request->user()->id) {
            return $this->error(
                'Cannot approve: the applicant cannot be the same as the approving user. Assign this application to the correct student first.',
                422
            );
        }

        try {
            return DB::transaction(function () use ($request, $application, $validated, $status) {
                $application->update([
                    'process_status' => $status,
                    'remarks' => $validated['remarks'] ?? null,
                    'processed_by' => $request->user()->id,
                    'processed_at' => now(),
                ]);

                if ($status === ProcessStatus::APPROVED) {
                    app(AdmissionToStudentSyncService::class)->syncFromApplication($application);
                }

                // Notify applicant of status change
                $applicant = $application->user;
                if ($applicant) {
                    $this->notifyRealtime($applicant, new AdmissionStatusChangedNotification($application->fresh(), $validated['status']));
                }

                return $this->successWithMap($application->fresh(), 'application_show', 'Application ' . $validated['status']);
            });
        } catch (\RuntimeException $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    /**
     * Record payment for an application (Cash, QR, Online).
     */
    public function recordPayment(Request $request, AdmissionApplication $application): JsonResponse
    {
        $validated = $request->validate([
            'cash_amount' => 'nullable|numeric|min:0',
            'online_amount' => 'nullable|numeric|min:0',
            'online_transaction_id' => 'nullable|required_with:online_amount|string|max:100',
            'transaction_id' => 'nullable|string|max:100',
            'concession_amount' => 'nullable|numeric|min:0',
            'concession_reason' => 'nullable|string|max:500',
            'notes' => 'nullable|string|max:500',
            'discount_amount' => 'nullable|numeric|min:0',
            'discount_reason' => 'nullable|string|max:255',
            'due_amount' => 'nullable|numeric|min:0',
        ]);

        // Normalize concession → discount via engine
        $validated = $this->engine->normalizeDiscount($validated);

        // Ensure payment keys exist with safe defaults so downstream code
        // never encounters "Undefined array key" for cash-only or online-only payments.
        $validated = array_merge([
            'cash_amount'          => 0,
            'online_amount'        => 0,
            'online_transaction_id' => null,
        ], $validated);

        try {
            return DB::transaction(function () use ($request, $application, $validated) {
                $result = app(AdmissionPaymentService::class)->recordPayment(
                    $application,
                    $validated,
                    $request->user()->id,
                );

                // Notify applicant
                $applicant = $result['application']->user;
                if ($applicant) {
                    $this->notifyRealtime($applicant, new AdmissionPaymentRecordedNotification(
                        $result['application'],
                        (string) $result['new_collected'],
                        $result['txn_id'],
                    ));
                }

                return $this->successWithMap(
                    $result['application']->load('transaction'),
                    'application_show',
                    'Payment recorded successfully.',
                );
            });
        } catch (RuntimeException $e) {
            Log::warning('Admission payment: blocked overpayment attempt', [
                'application_id' => $application->id,
                'error' => $e->getMessage(),
                'recorded_by' => $request->user()->id,
            ]);

            return ApiErrorMap::respond('admission.overpayment_not_allowed');
        }
    }

    private function assertNoAdmissionOverpayment(float $totalAmount, float $discountAmount, float $totalPaid): void
    {
        $netPayable = max(0, round($totalAmount - $discountAmount, 2));

        if ($totalPaid > $netPayable) {
            throw new RuntimeException('Admission payment exceeds payable amount.');
        }
    }

    /**
     * @OA\Delete(
     *     path="/applications/{id}",
     *     summary="Delete application",
     *     tags={"Admission Applications"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Application deleted")
     * )
     */
    public function destroy(AdmissionApplication $application): JsonResponse
    {
        $application->delete();
        return $this->success(null, 'Application deleted');
    }
    /**
     * Preview admission fees using the FeeCalculationEngine.
     *
     * Returns an itemized breakdown (items, gross, discount, net, profile_id)
     * for the given admission head + student profile. Single source of truth —
     * the same engine that runs at save-time.
     *
     * GET /applications/preview-fees?admission_head_id=X&category=Y&gender=Z
     *
     * @OA\Get(
     *     path="/admission/applications/preview-fees",
     *     summary="Preview admission fee breakdown before submitting",
     *     tags={"Admission"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Parameter(name="admission_head_id", in="query", required=true, @OA\Schema(type="integer")),
     *     @OA\Parameter(name="category", in="query", required=false, @OA\Schema(type="string")),
     *     @OA\Parameter(name="gender", in="query", required=false, @OA\Schema(type="string")),
     *     @OA\Response(response=200, description="Fee breakdown")
     * )
     */
    public function previewFees(Request $request): JsonResponse
    {
        $request->validate([
            'admission_head_id' => 'required|exists:admission_heads,id',
            'category'          => 'nullable|string',
            'gender'            => 'nullable|string',
            'student_type'      => 'nullable|string',
        ]);

        $head = AdmissionHead::findOrFail($request->admission_head_id);

        $breakdown = $this->engine->calculateAdmissionFee(
            $head->institution_id,
            $head->id,
            $request->category,
            $request->gender,
            $request->student_type
        );

        return $this->success($breakdown, 'Fee preview generated');
    }
}

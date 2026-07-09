<?php

namespace App\Http\Controllers\Api\V1\StudentDashboard;


use App\Http\Controllers\Api\V1\BaseController;
use App\Models\User;
use App\Notifications\AdmissionApplicationSubmittedNotification;
use App\Traits\DispatchesRealtimeNotifications;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Models\{
    AdmissionApplication,
    AdmissionApplicationSubject,
    StudentProfile,
    StudentAddress,
    StudentPreviousExam,
    StudentAcademicInfo,
    StudentDocument,
    AdmissionHead,
    Subject,
    Transaction,
    FeePayment
};
use Illuminate\Http\JsonResponse;
use App\Services\FeeCalculationEngine;
use App\Services\FinancialDocuments\AdmissionFeeBreakdownNormalizer;
use App\Enums\PaymentStatus;
use App\Support\ApiErrorMap;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class AdmissionSubmissionController extends BaseController
{
    use DispatchesRealtimeNotifications;

    private FeeCalculationEngine $engine;

    public function __construct(
        FeeCalculationEngine $engine,
        private AdmissionFeeBreakdownNormalizer $admissionFeeBreakdownNormalizer,
    ) {
        $this->engine = $engine;
    }
    /**
     * @OA\Post(
     * path="/student/admission-form/submit",
     * summary="Submit Full Admission Form",
     * description="Handles multi-table data distribution for student profile, academic info, addresses, and subject selection based on the provided PDF format.",
     * tags={"Student Admission"},
     * security={{"cookieAuth": {}}},
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"admission_head_id", "application_type", "applicant_name", "father_name", "mother_name", "dob", "gender", "category", "mobile", "aadhar_no", "abc_no", "addresses", "last_academic", "previous_exams", "selected_subjects", "documents"},
     * @OA\Property(property="admission_head_id", type="integer", example=1),
     * * @OA\Property(property="applicant_name", type="string", example="RAM KUMAR"),
     * @OA\Property(property="father_name", type="string", example="Baldev Pandit"),
     * @OA\Property(property="mother_name", type="string", example="Anita Devi"),
     * * @OA\Property(property="university_roll_no", type="string", example="24020190", description="Required ONLY if application_type is re-admission"),
     * @OA\Property(property="reg_no", type="string", example="REG123456", description="Required ONLY if application_type is re-admission"),
     * @OA\Property(property="roll_no", type="string", example="24020190", description="Required ONLY if application_type is re-admission"),
     * @OA\Property(property="father_qualification", type="string", example="10th"),
     * @OA\Property(property="father_occupation", type="string", example="self work"),
     * @OA\Property(property="father_mobile", type="string", example="9631074605"),
     * @OA\Property(property="dob", type="string", format="date", example="1991-03-20"),
     * @OA\Property(property="gender", type="string", example="Male"),
     * @OA\Property(property="category", type="string", example="EWS"),
     * @OA\Property(property="caste", type="string", example="yadav"),
     * @OA\Property(property="mobile", type="string", example="9631074605"),
     * @OA\Property(property="aadhar_no", type="string", example="123456780987"),
     * @OA\Property(property="abc_no", type="string", example="123456"),
     * @OA\Property(property="blood_group", type="string", example="B+"),
     * @OA\Property(property="nationality", type="string", example="Indian"),
     * @OA\Property(property="marital_status", type="string", example="Unmarried"),
     * @OA\Property(property="religion", type="string", example="Hindu"),

     * @OA\Property(property="university_confidential_no", type="string", example="UC-2025-001", nullable=true),
     * @OA\Property(property="place", type="string", format="date", example="patna"),
     * @OA\Property(property="is_differently_abled", type="boolean", example=false),
     * * @OA\Property(
     * property="addresses",
     * type="array",
     * @OA\Items(
     * @OA\Property(property="address_type", type="string", enum={"permanent", "correspondence"}),
     * @OA\Property(property="village_mohalla", type="string", example="bhalar munger"),
     * @OA\Property(property="post_office", type="string", example="dhelwan"),
     * @OA\Property(property="police_station", type="string", example="parsa bazar"),
     * @OA\Property(property="district", type="string", example="nalanda"),
     * @OA\Property(property="state", type="string", example="Bihar"),
     * @OA\Property(property="pincode", type="string", example="800002")
     * )
     * ),
     * * @OA\Property(
     * property="last_academic",
     * type="object",
     * @OA\Property(property="institute_name", type="string", example="b.d college patna"),
     * @OA\Property(property="class", type="string", example="12th"),
     * @OA\Property(property="session", type="string", example="22-24"),
     * @OA\Property(property="section", type="string", example="a"),
     * @OA\Property(property="roll_number", type="string", example="24020190")
     * ),
     * * @OA\Property(
     * property="previous_exams",
     * type="array",
     * @OA\Items(
     * @OA\Property(property="exam_name", type="string", example="Matriculation"),
     * @OA\Property(property="board_university", type="string", example="BSEB"),
     * @OA\Property(property="passing_year", type="integer", example=2022),
     * @OA\Property(property="total_marks", type="number", example=500),
     * @OA\Property(property="marks_obtained", type="number", example=400),
     * @OA\Property(property="percentage", type="number", example=80.0),
     * @OA\Property(property="division", type="string", example="1st"),
     * @OA\Property(property="subjects", type="string", example="All"),
     * @OA\Property(property="document_url", type="string", example="r2-bucket-path/marksheet_10.pdf")
     * )
     * ),
     * * @OA\Property(
     * property="selected_subjects",
     * type="array",
     * @OA\Items(
     * @OA\Property(property="subject_id", type="integer", example=10),
     * @OA\Property(property="subject_category_id", type="integer", example=1)
     * )
     * ),
     * * @OA\Property(
     * property="documents",
     * type="array",
     * @OA\Items(
     * @OA\Property(property="doc_type", type="string", example="clc_certificate"),
     * @OA\Property(property="doc_path", type="string", example="r2-bucket-path/student_photo.jpg")
     * )
     * )
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="Successful Submission",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=true),
     * @OA\Property(property="data", type="object",
     * @OA\Property(property="application_id", type="string", example="#00000004"),
     * @OA\Property(property="amount", type="number", example=1500.00),
     * @OA\Property(property="next_step", type="string", example="payment_redirection")
     * )
     * )
     * ),
     * @OA\Response(response=422, description="Validation Error"),
     * @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function submitForm(Request $request)
    {
        $head = AdmissionHead::with('session')->findOrFail($request->admission_head_id);
        $applicationType = $head->course_for; // 'new' or 're-admission'
        // 1. Validation Rules 
        $validator = Validator::make($request->all(), [
            'admission_head_id' => 'required|exists:admission_heads,id',

            'university_roll_no' => ($applicationType === 're-admission') ? 'required|string|max:100' : 'nullable|string|max:100',
            'reg_no' => ($applicationType === 're-admission') ? 'required|string|max:100' : 'nullable|string|max:100',
            'roll_no' => 'nullable|string|max:100',
            'place' => 'required|string|max:100',
            // Personal Details 
            'applicant_name' => 'required|string|max:150',
            'father_name' => 'required|string|max:150',
            'mother_name' => 'required|string|max:150',
            'father_qualification' => 'required|string|max:100',
            'father_occupation' => 'required|string|max:100',
            'father_mobile' => 'required|digits:10',
            'dob' => 'required|date',
            'gender' => 'required|string',
            'category' => 'required|string', // EWS, BC-I etc. 
            'mobile' => 'required|digits:10',
            'aadhar_no' => 'required|digits:12',
            'abc_no' => 'required|string',
            'blood_group' => 'required|string|max:5',
            'nationality' => 'required|string',
            'marital_status' => 'required|string',
            'university_confidential_no' => 'nullable|string|max:100',
            'is_differently_abled' => 'required|boolean',
            'religion' => 'required|string',
            'caste' => 'required|string',
            'signature_url' => 'required|string',
            // Addresses (Array) 
            'addresses' => 'required|array|min:1',
            'addresses.*.address_type' => 'required|in:permanent,correspondence',
            'addresses.*.village_mohalla' => 'required|string',
            'addresses.*.post_office' => 'required|string',
            'addresses.*.police_station' => 'required|string',
            'addresses.*.district' => 'required|string',
            'addresses.*.state' => 'required|string',
            'addresses.*.pincode' => 'required|digits:6',

            // Academic Info 
            'last_academic' => 'required|array',
            'last_academic.institute_name' => 'required|string',
            'last_academic.class' => 'required|string',
            'last_academic.session' => 'required|string',
            'last_academic.section' => 'required|string',
            'last_academic.roll_number' => 'required|string',

            // Previous Exams [cite: 114-139]
            'previous_exams' => 'required|array',
            'previous_exams.*.exam_name' => 'required|string',
            'previous_exams.*.board_university' => 'required|string',
            'previous_exams.*.passing_year' => 'required|digits:4',
            'previous_exams.*.total_marks' => 'required|numeric',
            'previous_exams.*.marks_obtained' => 'required|numeric',
            'previous_exams.*.percentage' => 'required|numeric',
            'previous_exams.*.division' => 'required|string',
            'previous_exams.*.document_url' => 'required|string', // Direct R2 Path from Frontend
            'previous_exams.*.subjects' => 'required|string',

            // Subjects & R2 Documents [cite: 16-22]
            'selected_subjects' => 'required|array|min:1',
            'selected_subjects.*.subject_id' => 'required|exists:subjects,id',
            'selected_subjects.*.subject_category_id' => 'required|exists:subject_categories,id',

            'documents' => ($applicationType === 'new') ? 'required|array' : 'nullable|array',
            'documents.*.doc_type' => ($applicationType === 'new') ? 'required|string' : 'nullable|string',
            'documents.*.doc_path' => ($applicationType === 'new') ? 'required|string' : 'nullable|string',

            // Dynamic Fees & Services
            'transport_amount' => 'nullable|numeric|min:0',
            'transport_route_id' => 'nullable|integer',
            'transport_stop_id' => 'nullable|integer',
            'hostel_required' => 'nullable|boolean',
            'hostel_id' => 'nullable|integer|exists:hostels,id',
            'hostel_room_id' => 'nullable|integer|exists:hostel_rooms,id',
            'hostel_amount' => 'nullable|numeric|min:0',
            'fees' => 'nullable|array',
            'inventory_items' => 'nullable|array',
            'discount_amount' => 'nullable|numeric|min:0',
            'discount_reason' => 'nullable|string|max:255',
            'fee_regulation_profile_id' => 'nullable|integer|exists:fee_regulation_profiles,id',

            // Medical & Guardian
            'medical_condition' => 'nullable|string|max:255',
            'allergy' => 'nullable|string|max:255',
            'disability' => 'nullable|string|max:100',
            'guardian_snapshot' => 'nullable|array',
            'address_snapshot' => 'nullable|array',
            
            // Split Payment (optional)
            'cash_amount' => 'nullable|numeric|min:0',
            'online_amount' => 'nullable|numeric|min:0',
            'online_transaction_id' => 'nullable|required_with:online_amount|string|max:100',
        ]);

        // 2. Check if validation fails
        if ($validator->fails()) {
            return $this->error($validator->errors()->first(), 422, $validator->errors());
        }

        $user = auth()->user();


        // 3. Database Transaction
        try {
            return DB::transaction(function () use ($request, $user, $applicationType, $head) {



            // A. Save/Update Student Profile 
            $profile = StudentProfile::updateOrCreate(
                ['user_id' => $user->id],
                array_merge(
                    $request->only([
                        'father_name',
                        'mother_name',
                        'father_qualification',
                        'father_occupation',
                        'father_mobile',
                        'dob',
                        'gender',
                        'category',
                        'university_confidential_no',
                        'mobile',
                        'aadhar_no',
                        'abc_no',
                        'blood_group',
                        'nationality',
                        'marital_status',
                        'religion',
                        'caste',
                        'is_differently_abled',
                        'university_roll_no',
                        'reg_no',
                        'roll_no',
                        'signature_url',
                        'medical_condition',
                        'allergy',
                        'guardian_snapshot',
                    ]),
                    [
                        'disability_type' => $request->disability, // Model uses disability_type
                        'address_snapshot' => $request->address_snapshot,
                    ]
                )

            );

            // dd($profile->toArray());



            // 1. Latest Application (Locking for prevent duplicates in concurrent requests)
            $lastApplication = AdmissionApplication::lockForUpdate()
                ->orderBy('id', 'desc')
                ->first();

            // 2. Increment logic (#00000001 to #00000002) 
            $nextNumber = $lastApplication ? ($lastApplication->id + 1) : 1;
            $formattedId = '#' . str_pad($nextNumber, 8, '0', STR_PAD_LEFT); // Output: #00000004 [cite: 26]

            // B. Create Admission Application (Snapshot). institution_id must match model scope (getActiveInstitutionId) so list/show find it.
            $application = AdmissionApplication::create([
                'application_id' => $formattedId,
                'application_type' => $applicationType, // 'new' or 're-admission' based on head config
                'user_id' => $user->id,
                'admission_head_id' => $head->id,
                'institution_id' => $head->institution_id,
                'applicant_name' => $request->applicant_name,
                'father_name' => $request->father_name,
                'mother_name' => $request->mother_name,
                'father_mobile' => $request->father_mobile,
                'father_qualification' => $request->father_qualification,
                'father_occupation' => $request->father_occupation,
                'dob' => $request->dob,
                'gender' => $request->gender,
                'category' => $request->category,
                'caste' => $request->caste,
                'mobile' => $request->mobile,
                'email' => $user->email,
                'medical_condition' => $request->medical_condition,
                'allergy' => $request->allergy,
                'disability' => $request->disability,
                'guardian_snapshot' => $request->guardian_snapshot,
                'address_snapshot' => $request->address_snapshot,
                'amount' => 0, // Will be updated below after calculation
                'session_id' => $head->session_id,
                'session_name' => $head->session->name ?? '2025-2029',
                'abc_id' => $request->abc_no,
                'apaar_id' => $request->apaar_id ?? null,
                'previous_roll_no' => $request->previous_roll_no ?? null,
                'semester' => $head->semester ?? '1',
                'place' => $request->place,
                'submitted_at' => now(),
            ]);

            // Calculate itemized admission fee using the engine
            $engineResult = $this->engine->calculateAdmissionFee(
                (int) $head->institution_id,
                (int) $head->id,
                $request->category,
                $request->gender,
                null,
                $request->fee_regulation_profile_id
            );

            $total = (float) $engineResult['gross']; // Use gross, discount is tracked separately
            $feeBreakdown = $engineResult['items'];
            $profileId = $engineResult['profile_id'] ?? null;

            // Add dynamic components
            $total += (float) ($request->transport_amount ?? 0);
            if ($request->hostel_required) {
                $total += (float) ($request->hostel_amount ?? 0);
            }

            // Fallback to fees array if engine had no rules
            if (empty($feeBreakdown) && isset($request->fees) && is_array($request->fees)) {
                $feeBreakdown = $this->admissionFeeBreakdownNormalizer->normalize($request->fees);
                $total += array_reduce($feeBreakdown, function ($carry, $item) {
                    // For gross total, only sum up positive charges, ignore discount items
                    return $carry + (($item['category'] === 'discount') ? 0 : (float) ($item['amount'] ?? 0));
                }, 0);
            }

            // Add inventory items
            if (isset($request->inventory_items) && is_array($request->inventory_items)) {
                $inventoryTotal = array_reduce($request->inventory_items, fn($carry, $item) => $carry + ((float) ($item['price'] ?? 0) * (int) ($item['quantity'] ?? 1)), 0);
                $total += $inventoryTotal;

                foreach ($request->inventory_items as $item) {
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

            // Handle split payment and calculate due
            $cashAmount = (float) ($request->cash_amount ?? 0);
            $onlineAmount = (float) ($request->online_amount ?? 0);
            $totalPaid = $cashAmount + $onlineAmount;
            $discountAmount = (float) ($request->discount_amount ?? 0);
            $this->assertNoAdmissionOverpayment($total, $discountAmount, $totalPaid);
            $dueAmount = $this->engine->calculateDue($total, $discountAmount, $totalPaid);

            $application->update([
                'amount' => $total,
                'fee_breakdown' => $feeBreakdown,
                'due_amount' => $dueAmount,
                'discount_amount' => $discountAmount,
                'discount_reason' => $request->discount_reason,
                'fee_regulation_profile_id' => $profileId,
                'transport_amount' => $request->transport_amount,
                'transport_stop_id' => $request->transport_stop_id,
                'hostel_amount' => $request->hostel_amount,
                'hostel_required' => $request->hostel_required,
                'hostel_id' => $request->hostel_id,
                'hostel_room_id' => $request->hostel_room_id,
                'cash_amount' => $cashAmount ?: null,
                'online_amount' => $onlineAmount ?: null,
                'online_transaction_id' => $request->online_transaction_id,
                'payment_mode' => ($cashAmount > 0 && $onlineAmount > 0) ? 'split' : ($onlineAmount > 0 ? 'online' : 'cash'),
                'payment_status' => $totalPaid >= ($total - $discountAmount) ? PaymentStatus::SUCCESS->value : PaymentStatus::PENDING->value,
                'payment_date' => $totalPaid > 0 ? now() : null,
                'transaction_id' => $request->online_transaction_id ?? ($totalPaid > 0 ? 'TXN' . strtoupper(uniqid()) : null),
            ]);

            // Create Transaction record if payment was made
            if ($totalPaid > 0) {
                Transaction::create([
                    'user_id' => $user->id,
                    'transaction_id' => $application->transaction_id,
                    'type' => 'admission_payment',
                    'payable_type' => get_class($application),
                    'payable_id' => $application->id,
                    'amount' => $totalPaid,
                    'payment_mode' => $application->payment_mode,
                    'status' => 'success',
                    'meta' => [
                        'cash_amount' => $application->cash_amount,
                        'online_amount' => $application->online_amount,
                        'online_transaction_id' => $application->online_transaction_id,
                        'recorded_at' => now()->toDateTimeString(),
                    ],
                ]);

                FeePayment::create([
                    'institution_id'        => $head->institution_id,
                    'payment_id'            => 'PAY-ADM-' . strtoupper(uniqid()),
                    'user_id'               => $user->id,
                    'amount'                => $totalPaid,
                    'total_amount'          => $totalPaid,
                    'payment_mode'          => $application->payment_mode,
                    'payment_status'        => 'paid',
                    'payment_date'          => now(),
                    'collected_by'          => $user->id, // Student self-recorded (for dashboard flow)
                    'receipt_no'            => 'RCP-ADM-' . strtoupper(uniqid()),
                    'cash_amount'           => $application->cash_amount ?: null,
                    'online_amount'         => $application->online_amount ?: null,
                    'online_transaction_id' => $application->online_transaction_id ?? null,
                    'remarks'               => 'Admission fee (online/self)',
                    'payable_entity_type'   => 'admission_application',
                    'payable_entity_id'     => $application->id,
                    'ledger_snapshot'       => [
                        'fees'       => $feeBreakdown,
                        'discount'   => $discountAmount,
                        'due'        => $dueAmount,
                        'total_fees' => $total,
                    ],
                ]);

                app(AdmissionPaymentService::class)->processInventorySaleForAdmission($application, $totalPaid, (int) $user->id);
            }


            // 1. All selected subjects ko collect karein
            $selectedSubjects = collect($request->selected_subjects);

            // 2. Fetch allowed papers for the admission head and key by category for easy validation
            // we are fetching all papers for the head and then keying by category for easy access during validation
            $allowedPapers = $head->papers()->get()->keyBy('subject_category_id');

            // 3. Category wise grouping aur validation
            $groupedSelected = $selectedSubjects->groupBy('subject_category_id');

            foreach ($groupedSelected as $categoryId => $subjects) {
                // Validation: Category check
                if (!$allowedPapers->has($categoryId)) {
                    return $this->error("Subject Category ID: {$categoryId} is not allowed for this admission head.", 422);
                }

                $config = $allowedPapers->get($categoryId);
                $limit = $config->paper_limit ?? 1; // Default 1 if not set

                // Validation: Count check 
                if ($subjects->count() > $limit) {
                    $categoryName = $config->category->name ?? "Category $categoryId";
                    return $this->error("Selection limit exceeded for {$categoryName}. Max allowed is {$limit} subjects.", 422);
                }
            }

            // 4. Compulsory Categories Check (Optional but Recommended)
            // check it all compulsory categories are selected or not
            foreach ($allowedPapers as $catId => $paperConfig) {
                if ($paperConfig->is_compulsory && !$groupedSelected->has($catId)) {
                    return $this->error("The category '{$paperConfig->category->name}' is compulsory but no subject was selected.", 422);
                }
            }

            // 5. Optimization: Fetch Master Subjects in Bulk (to avoid N+1 queries in loop)
            $subjectMasters = Subject::whereIn('id', $selectedSubjects->pluck('subject_id'))->get()->keyBy('id');
            // C. Save Selected Subjects 
            foreach ($request->selected_subjects as $sub) {
                $masterSub = $subjectMasters->get($sub['subject_id']);

                if (!$masterSub) {
                    throw new \Exception("Invalid Subject ID: " . $sub['subject_id']);
                }

                AdmissionApplicationSubject::create([
                    'admission_application_id' => $application->id,
                    'subject_id' => $sub['subject_id'],
                    'subject_category_id' => $sub['subject_category_id'],
                    'subject_name' => $masterSub->name, // [cite: 16-22]
                    'subject_code' => $masterSub->code, // [cite: 16-22]
                ]);
            }
              
            // D. Save Academic History 
            StudentAcademicInfo::updateOrCreate(
                ['user_id' => $user->id],
                array_merge($request->last_academic)
            );

            foreach ($request->previous_exams as $exam) {
                StudentPreviousExam::updateOrCreate(
                    ['user_id' => $user->id, 'exam_type' => $applicationType, 'exam_name' => $exam['exam_name']],
                    array_merge($exam)
                );
            }

            // E. Save Addresses 
            foreach ($request->addresses as $addr) {
                StudentAddress::updateOrCreate(
                    ['student_profile_id' => $profile->id, 'address_type' => $addr['address_type']],
                    $addr
                );
            }
  

            // F. Save R2 Paths for Documents
            if ($request->documents) {


                foreach ($request->documents as $doc) {
                    $docType = $doc['doc_type'] ?? 'document';
                    StudentDocument::updateOrCreate(
                        ['user_id' => $user->id, 'doc_type' => $docType],
                        [
                            'doc_path' => $doc['doc_path'],
                            'document_type' => $docType,
                            'file_url' => $doc['doc_path'],
                            'status' => 'pending',
                        ]
                    );
                    if ($doc['doc_type'] === 'photo') {
                        $user->update([
                            'photo_url' => $doc['doc_path']
                        ]);
                    }
                }
            }

            // Notify admission cell users of new application
            $admissionCellUsers = User::withAdmissionCellForInstitution((int) $head->institution_id)->get();
            if ($admissionCellUsers->isNotEmpty()) {
                $this->notifyRealtimeMany($admissionCellUsers, new AdmissionApplicationSubmittedNotification($application));
            }

            // 4. Final Response
                return $this->success([
                    'id' => $application->id,
                    'application_id' => $application->application_id,
                    'amount' => $application->amount,
                    'next_step' => 'fee_preview'
                ], "Form submitted successfully.");        
            });
        } catch (RuntimeException $e) {
            Log::warning('Student dashboard admission: blocked overpayment attempt', [
                'user_id' => $user->id ?? null,
                'admission_head_id' => $request->admission_head_id,
                'error' => $e->getMessage(),
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
     * @OA\Get(
     * path="/student/admission-applications/{id}/fee-preview",
     * summary="Get detailed fee structure breakdown before payment",
     * tags={"Student Admission"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="ID of the Admission Application",
     * required=true,
     * @OA\Schema(type="integer", example=101)
     * ),
     * @OA\Response(
     * response=200,
     * description="Detailed fee structure",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=true),
     * @OA\Property(
     * property="data",
     * type="object",
     * @OA\Property(property="application_id", type="string", example="ADM-2026-001"),
     * @OA\Property(property="applicant_name", type="string", example="John Doe"),
     * @OA\Property(property="course", type="string", example="B.Sc Computer Science"),
     * @OA\Property(
     * property="fee_breakdown",
     * type="array",
     * @OA\Items(
     * @OA\Property(property="head_name", type="string", example="Tuition Fee"),
     * @OA\Property(property="amount", type="number", format="float", example=5000.00),
     * @OA\Property(property="is_optional", type="boolean", example=false)
     * )
     * ),
     * @OA\Property(
     * property="summary",
     * type="object",
     * @OA\Property(property="application_fee", type="number", example=500.00),
     * @OA\Property(property="admission_fee_subtotal", type="number", example=12000.00),
     * @OA\Property(property="total_payable", type="number", example=12500.00)
     * )
     * )
     * )
     * ),
     * @OA\Response(response=404, description="Application not found or access denied"),
     * @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function getFeePreview($id): JsonResponse
    {

        $application = AdmissionApplication::with([
            'admissionHead.feeStructures.feeType'
        ])->where('user_id', auth()->id())->findOrFail($id);

        // dd($application);
        $head = $application->admissionHead;

        // dd($head->feeStructures);

        return $this->success([
            'id' => $application->id,
            'application_id' => $application->application_id,
            'applicant_name' => $application->applicant_name,
            'course' => $head->title,
            'fee_breakdown' => $head->feeStructures->map(function ($fee) {
                return [
                    'head_name' => $fee->feeType?->name ?? 'Fee',
                    'amount' => $fee->amount,
                ];
            }),
            'summary' => [
                'id'=>$application->id,
                'application_fee' => $head->application_fees,
                'admission_fee_subtotal' => $head->feeStructures->sum('amount'),
                'total_payable' => $head->total_admission_fees
            ]
        ]);
    }
}
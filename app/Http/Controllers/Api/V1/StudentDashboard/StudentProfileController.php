<?php

namespace App\Http\Controllers\Api\V1\StudentDashboard;

use App\Models\Institution;
use App\Models\User;
use App\Services\ApiResponseMapService;
use App\Support\EffectiveStudentContext;
use App\Support\InstitutionContext;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Api\V1\BaseController;

class StudentProfileController extends BaseController
{
    // /**
    //  * @OA\Get(
    //  * path="/student/profile",
    //  * summary="Get logged-in student profile",
    //  * tags={"Student Panel"},
    //  * security={{"cookieAuth":{}}},
    //  * @OA\Response(
    //  * response=200,
    //  * description="Success",
    //  * @OA\JsonContent(
    //  * @OA\Property(property="success", type="boolean", example=true),
    //  * @OA\Property(property="data", ref="#/components/schemas/StudentProfile")
    //  * )
    //  * )
    //  * )
    //  */
    // public function show()
    // {

    //     $student = Auth::user()->load([
    //         'roles:id,name,key',
    //         'studentProfile.session',
    //         'studentProfile.stream',
    //         'studentProfile',
    //         'studentProfile.studentAddress',
    //         'studentProfile.subject'
    //     ]);

    //     return $this->success($student);
    // }

    /**
     * @OA\Get(
     * path="/student/profile",
     * summary="Get complete student profile for dashboard",
     * description="Fetches personal info, addresses, academic history, and uploaded documents of the authenticated student.",
     * tags={"Student Profile"},
     * security={{"cookieAuth":{}}},
     * @OA\Response(
     * response=200,
     * description="Profile data retrieved successfully",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=true),
     * @OA\Property(property="data", type="object",
     * @OA\Property(property="personal_info", type="object"),
     * @OA\Property(property="academic_info", type="object"),
     * @OA\Property(property="addresses", type="array", @OA\Items(type="object")),
     * @OA\Property(property="documents", type="array", @OA\Items(type="object"))
     * )
     * )
     * )
     * )
     */
    public function getProfile(Request $request)
    {
        $authUser = Auth::user();
        $user = EffectiveStudentContext::getEffectiveUser($authUser);
        if (! $user) {
            return $this->error('Unauthorized.', 401);
        }

        // If effective user has no student profile but auth user is a guardian, use first linked student with a profile
        $profile = $user->studentProfile;
        if (! $profile && EffectiveStudentContext::isGuardianUser($authUser)) {
            $firstStudentId = EffectiveStudentContext::getFirstLinkedStudentId($authUser->id);
            if ($firstStudentId !== null) {
                $user = User::with([
                    'studentProfile.stream',
                    'studentProfile.session',
                    'studentProfile.institution',
                    'studentProfile.subject',
                    'studentProfile',
                    'academicInfo',
                    'documents',
                ])->find($firstStudentId);
                $profile = $user?->studentProfile;
            }
        }

         if (! $user) {
            return $this->error('Unauthorized.', 401);
        }

        // No StudentProfile: return minimal profile from User so dashboard shows name/photo instead of 404 and "Student"
        if (! $profile) {
            $activeStatus = (int) ($user->getAttribute('status') ?? 1) === 1 ? 'Active' : 'Inactive';
            $payload = [
                'institution_type' => config('ems.default_institution_type', 'school'),
                'personal_info' => [
                    'name' => $user->name,
                    'email' => $user->email,
                    'father_name' => null,
                    'mother_name' => null,
                    'dob' => null,
                    'gender' => null,
                    'category' => null,
                    'blood_group' => null,
                    'mobile' => $user->mobile ?? null,
                    'aadhar_no' => null,
                    'abc_no' => null,
                    'religion' => null,
                    'caste' => null,
                    'signature_url' => null,
                    'photo_url' => $user->avatar_url ?? $user->getAttribute('photo_url'),
                    'active_status' => $activeStatus,
                    'nationality' => null,
                ],
                'academic_record' => [
                    'university_roll_no' => null,
                    'reg_no' => null,
                    'roll_no' => null,
                    'current_semester' => null,
                    'stream_name' => null,
                    'session_name' => null,
                    'college_name' => null,
                    'subject_name' => null,
                    'admission_date' => null,
                    'app_no' => null,
                    'last_academic' => [],
                ],
                'addresses' => [],
                'documents' => $user->documents ? $user->documents->map(fn ($doc) => [
                    'type' => $doc->doc_type,
                    'url' => $doc->doc_path,
                    'status' => $doc->status,
                ])->values()->all() : [],
            ];
            $data = app(ApiResponseMapService::class)->filter($payload, 'student_dashboard_profile');
            return $this->success($data);
        }

        $user->load([
            'studentProfile.stream',
            'studentProfile.session',
            'studentProfile.institution',
            'studentProfile.subject',
            'studentProfile',
            'academicInfo',
            'documents',
        ]);
        $profile = $user->studentProfile;

        $activeStatus = (int) ($user->getAttribute('status') ?? 1) === 1 ? 'Active' : 'Inactive';
        $institutionId = InstitutionContext::getActiveInstitutionId($user);
        $institutionType = $institutionId !== null
            ? (Institution::find($institutionId)?->type?->value ?? config('ems.default_institution_type'))
            : config('ems.default_institution_type');

        $payload = [
            'institution_type' => $institutionType,
            'personal_info' => [
                'name' => $user->name,
                'email' => $user->email,
                'father_name' => $profile->father_name,
                'mother_name' => $profile->mother_name,
                'dob' => $profile->dob ? $profile->dob->format('d-m-Y') : null,
                'gender' => $profile->gender,
                'category' => $profile->category,
                'blood_group' => $profile->blood_group,
                'mobile' => $profile->mobile,
                'aadhar_no' => $profile->aadhar_no,
                'abc_no' => $profile->abc_no,
                'religion' => $profile->religion,
                'caste' => $profile->caste,
                'signature_url' => $profile->signature_url,
                'photo_url' => $user->avatar_url ?? $user->getAttribute('photo_url'),
                'active_status' => $activeStatus,
                'nationality' => $profile->nationality,
            ],
            'academic_record' => [
                'university_roll_no' => $profile->university_roll_no,
                'reg_no' => $profile->reg_no,
                'roll_no' => $profile->roll_no,
                'current_semester' => $profile->current_semester,
                'stream_name' => $profile->stream?->name,
                'session_name' => $profile->session?->name,
                'college_name' => $profile->institution?->name,
                'subject_name' => $profile->subject?->name,
                'admission_date' => $profile->admission_date ? $profile->admission_date->format('d-m-Y') : null,
                'app_no' => $profile->app_no,
                'last_academic' => $user->academicInfo->map(function ($info) {
                    return [
                        'institute_name' => $info->institute_name,
                        'session' => $info->session,
                        'class' => $info->class,
                        'section' => $info->section,
                        'roll_number' => $info->roll_number,
                    ];
                })->values()->all(),
            ],
            'addresses' => $profile->addresses()->get()->map(function ($addr) {
                return [
                    'address_type' => $addr->address_type,
                    'village_mohalla' => $addr->village_mohalla,
                    'post_office' => $addr->post_office,
                    'police_station' => $addr->police_station,
                    'district' => $addr->district,
                    'state' => $addr->state,
                    'pincode' => $addr->pincode,
                ];
            })->values()->all(),
            'documents' => $user->documents->map(function ($doc) {
                return [
                    'type' => $doc->doc_type,
                    'url' => $doc->doc_path,
                    'status' => $doc->status,
                ];
            })->values()->all(),
        ];

        $data = app(ApiResponseMapService::class)->filter($payload, 'student_dashboard_profile');
        return $this->success($data);
    }
}

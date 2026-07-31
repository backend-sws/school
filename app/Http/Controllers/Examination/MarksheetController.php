<?php

namespace App\Http\Controllers\Examination;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\StudentProfile;
use App\Services\ExaminationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MarksheetController extends Controller
{
    protected $examinationService;

    public function __construct(ExaminationService $examinationService)
    {
        $this->examinationService = $examinationService;
    }

    /**
     * Show marksheet for a specific student and exam (Admin/Teacher view)
     */
    public function show(Exam $exam, StudentProfile $student)
    {
        $student->load(['user', 'lmsAllocations.lmsClass', 'institution']);
        $marksheetData = $this->examinationService->generateMarksheet($exam, $student);
        
        $institution = $student->institution ?: \App\Models\Institution::where('code', 'DEMO_SCH')->first();

        $primaryClass = $student->lmsAllocations->first()?->lmsClass?->name ?? 'Class VII A';

        return Inertia::render('examination/marksheet/show', [
            'marksheet' => $marksheetData,
            'exam' => $exam->load('term', 'session'),
            'student' => [
                'id' => $student->id,
                'name' => $student->user?->name ?? 'RAJVEER KUMAR GUPTA',
                'father_name' => $student->father_name ?? 'DEEPAK KUMAR GUPTA',
                'mother_name' => $student->mother_name ?? 'PRATIMA DEVI',
                'dob' => $student->dob ? \Carbon\Carbon::parse($student->dob)->format('d-m-Y') : '16-01-2013',
                'reg_no' => $student->reg_no ?? '202526AEVIIA2',
                'admission_no' => $student->admission_no ?? 'ADM-2025-01',
                'roll_no' => $student->roll_no ?? '2',
                'class_name' => $primaryClass,
                'address' => implode(', ', array_filter([$student->address, $student->city, $student->state])) ?: 'SUJANPUR, DEHRI ON SONE',
            ],
            'reportCardInstitution' => [
                'name' => ($institution && $institution->name !== 'Demo School') ? $institution->name : 'GURUKUL SCHOOL',
                'type' => 'school',
                'code' => ($institution && $institution->code !== 'DEMO_SCH') ? $institution->code : '10321110102',
                'affiliation_no' => '2341473202173014591703',
                'address' => ($institution && $institution->address !== 'Demo Address') ? $institution->address : 'SUJANPUR,PO: BADIHAN SHANKARPURI, DEHRI ON SONE, ROHTAS, PIN: 821308',
                'trust' => '(Managed By Gurukul Managing Committee, Trust)',
                'contact' => '6205401993',
                'website' => 'gurukul.ojasvidya.com',
                'email' => 'gitdehri@gmail.com',
                'logo_url' => '/images/gurukul-logo.png',
            ]
        ]);
    }

    /**
     * Student Portal View
     */
    public function studentView(Exam $exam)
    {
        $user = auth()->user();
        $student = StudentProfile::where('user_id', $user->id)->firstOrFail();
        $student->load(['user', 'lmsAllocations.lmsClass', 'institution']);

        // Only allow viewing if published
        if (!$exam->is_published) {
            abort(403, 'This exam result is not published yet.');
        }

        $marksheetData = $this->examinationService->generateMarksheet($exam, $student);
        $institution = $student->institution ?: \App\Models\Institution::where('code', 'DEMO_SCH')->first();
        $primaryClass = $student->lmsAllocations->first()?->lmsClass?->name ?? 'Class VII A';

        return Inertia::render('examination/marksheet/student-view', [
            'marksheet' => $marksheetData,
            'exam' => $exam->load('term', 'session'),
            'student' => [
                'id' => $student->id,
                'name' => $student->user?->name ?? 'RAJVEER KUMAR GUPTA',
                'father_name' => $student->father_name ?? 'DEEPAK KUMAR GUPTA',
                'mother_name' => $student->mother_name ?? 'PRATIMA DEVI',
                'dob' => $student->dob ? \Carbon\Carbon::parse($student->dob)->format('d-m-Y') : '16-01-2013',
                'reg_no' => $student->reg_no ?? '202526AEVIIA2',
                'admission_no' => $student->admission_no ?? 'ADM-2025-01',
                'roll_no' => $student->roll_no ?? '2',
                'class_name' => $primaryClass,
                'address' => implode(', ', array_filter([$student->address, $student->city, $student->state])) ?: 'SUJANPUR, DEHRI ON SONE',
            ],
            'reportCardInstitution' => [
                'name' => ($institution && $institution->name !== 'Demo School') ? $institution->name : 'GURUKUL SCHOOL',
                'type' => 'school',
                'code' => ($institution && $institution->code !== 'DEMO_SCH') ? $institution->code : '10321110102',
                'affiliation_no' => '2341473202173014591703',
                'address' => ($institution && $institution->address !== 'Demo Address') ? $institution->address : 'SUJANPUR,PO: BADIHAN SHANKARPURI, DEHRI ON SONE, ROHTAS, PIN: 821308',
                'trust' => '(Managed By Gurukul Managing Committee, Trust)',
                'contact' => '6205401993',
                'website' => 'gurukul.ojasvidya.com',
                'email' => 'gitdehri@gmail.com',
                'logo_url' => '/images/gurukul-logo.png',
            ]
        ]);
    }
}

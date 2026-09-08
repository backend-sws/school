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
        
        $institutionData = $this->examinationService->getReportCardInstitution($exam->institution_id ?: $student->institution_id);
        $primaryClass = $student->lmsAllocations->first()?->lmsClass?->name ?? '—';

        return Inertia::render('examination/marksheet/show', [
            'marksheet' => $marksheetData,
            'exam' => $exam->load('term', 'session'),
            'student' => [
                'id' => $student->id,
                'name' => $student->user?->name ?? '—',
                'father_name' => $student->father_name ?? '—',
                'mother_name' => $student->mother_name ?? '—',
                'dob' => $student->dob ? \Carbon\Carbon::parse($student->dob)->format('d-m-Y') : '—',
                'reg_no' => $student->reg_no ?? $student->admission_no ?? '—',
                'admission_no' => $student->admission_no ?? '—',
                'roll_no' => $student->roll_no ?? '—',
                'class_name' => $primaryClass,
                'address' => implode(', ', array_filter([$student->address, $student->city, $student->state])) ?: '—',
            ],
            'reportCardInstitution' => $institutionData,
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
        $institutionData = $this->examinationService->getReportCardInstitution($exam->institution_id ?: $student->institution_id);
        $primaryClass = $student->lmsAllocations->first()?->lmsClass?->name ?? '—';

        return Inertia::render('examination/marksheet/student-view', [
            'marksheet' => $marksheetData,
            'exam' => $exam->load('term', 'session'),
            'student' => [
                'id' => $student->id,
                'name' => $student->user?->name ?? '—',
                'father_name' => $student->father_name ?? '—',
                'mother_name' => $student->mother_name ?? '—',
                'dob' => $student->dob ? \Carbon\Carbon::parse($student->dob)->format('d-m-Y') : '—',
                'reg_no' => $student->reg_no ?? $student->admission_no ?? '—',
                'admission_no' => $student->admission_no ?? '—',
                'roll_no' => $student->roll_no ?? '—',
                'class_name' => $primaryClass,
                'address' => implode(', ', array_filter([$student->address, $student->city, $student->state])) ?: '—',
            ],
            'reportCardInstitution' => $institutionData,
        ]);
    }
}

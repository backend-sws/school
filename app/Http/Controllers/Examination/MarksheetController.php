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
        $marksheetData = $this->examinationService->generateMarksheet($exam, $student);
        
        return Inertia::render('examination/marksheet/show', [
            'marksheet' => $marksheetData,
            'exam' => $exam->load('term'),
            'student' => $student->load('user'),
        ]);
    }

    /**
     * Student Portal View
     */
    public function studentView(Exam $exam)
    {
        $user = auth()->user();
        $student = StudentProfile::where('user_id', $user->id)->firstOrFail();

        // Only allow viewing if published
        if (!$exam->is_published) {
            abort(403, 'This exam result is not published yet.');
        }

        $marksheetData = $this->examinationService->generateMarksheet($exam, $student);

        return Inertia::render('examination/marksheet/student-view', [
            'marksheet' => $marksheetData,
            'exam' => $exam->load('term'),
            'student' => $student->load('user'),
        ]);
    }
}

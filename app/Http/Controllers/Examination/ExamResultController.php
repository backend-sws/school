<?php

namespace App\Http\Controllers\Examination;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\LmsClass;
use App\Models\LmsClassEnrollment;
use App\Models\StudentProfile;
use App\Services\ExaminationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExamResultController extends Controller
{
    protected $examinationService;

    public function __construct(ExaminationService $examinationService)
    {
        $this->examinationService = $examinationService;
    }

    /**
     * Display a list of all exams for result viewing.
     */
    public function listExams()
    {
        $exams = Exam::with(['term'])->where('institution_id', \App\Support\InstitutionContext::getActiveInstitutionId())->get();
        return Inertia::render('examination/results/list', ['exams' => $exams]);
    }

    /**
     * Display a listing of all students and their results for the exam.
     */
    public function index(Request $request, Exam $exam)
    {
        $exam->load('schedules.lmsClass', 'term');
        
        // Find all unique class IDs associated with this exam's schedules
        $classIds = $exam->schedules->pluck('lms_class_id')->filter()->unique();
        
        // Get all students enrolled in those classes
        $userIds = LmsClassEnrollment::whereIn('lms_class_id', $classIds)
            ->where('role', 'student')
            ->where('status', 'active')
            ->pluck('user_id')
            ->unique();

        $students = StudentProfile::with('user', 'lmsAllocations.lmsClass')
            ->whereIn('user_id', $userIds)
            ->get();
            
        $results = [];
        
        foreach ($students as $student) {
            $marksheet = $this->examinationService->generateMarksheet($exam, $student);
            
            // Get student's primary class for display
            $primaryClass = $student->lmsAllocations->first()?->lmsClass?->name ?? '—';
            
            $results[] = [
                'student_id' => $student->id,
                'name' => $student->user->name ?? 'Unknown',
                'admission_no' => $student->admission_no,
                'class_name' => $primaryClass,
                'total_obtained' => $marksheet['total_obtained'],
                'total_full_marks' => $marksheet['total_full_marks'],
                'overall_percentage' => $marksheet['overall_percentage'],
                'overall_grade' => $marksheet['overall_grade'],
                'result_status' => $marksheet['result_status'],
                'all_passed' => $marksheet['all_passed'],
            ];
        }

        return Inertia::render('examination/results/index', [
            'exam' => $exam,
            'results' => $results,
        ]);
    }

    /**
     * Handle bulk printing of marksheets.
     */
    public function bulkPrint(Request $request, Exam $exam)
    {
        $request->validate([
            'student_ids' => 'required|array',
            'student_ids.*' => 'exists:student_profiles,id',
        ]);
        
        $exam->load('term');
        
        $students = StudentProfile::with('user')
            ->whereIn('id', $request->student_ids)
            ->get();
            
        $marksheets = [];
        
        foreach ($students as $student) {
            $marksheets[] = $this->examinationService->generateMarksheet($exam, $student);
        }

        return Inertia::render('examination/results/bulk-print', [
            'exam' => $exam,
            'marksheets' => $marksheets,
        ]);
    }

    /**
     * Handle bulk printing of result summary.
     */
    public function printSummary(Request $request, Exam $exam)
    {
        $request->validate([
            'student_ids' => 'required|array',
            'student_ids.*' => 'exists:student_profiles,id',
        ]);
        
        $exam->load('term');
        
        $students = StudentProfile::with('user', 'lmsAllocations.lmsClass')
            ->whereIn('id', $request->student_ids)
            ->get();
            
        $results = [];
        
        foreach ($students as $student) {
            $marksheet = $this->examinationService->generateMarksheet($exam, $student);
            
            $primaryClass = $student->lmsAllocations->first()?->lmsClass?->name ?? '—';
            
            $results[] = [
                'student_id' => $student->id,
                'name' => $student->user->name ?? 'Unknown',
                'admission_no' => $student->admission_no,
                'class_name' => $primaryClass,
                'total_obtained' => $marksheet['total_obtained'],
                'total_full_marks' => $marksheet['total_full_marks'],
                'overall_percentage' => $marksheet['overall_percentage'],
                'overall_grade' => $marksheet['overall_grade'],
                'result_status' => $marksheet['result_status'],
            ];
        }

        return Inertia::render('examination/results/print-summary', [
            'exam' => $exam,
            'results' => $results,
        ]);
    }

    /**
     * Handle bulk printing of tabulation broadsheet.
     */
    public function printBroadsheet(Request $request, Exam $exam)
    {
        $request->validate([
            'student_ids' => 'required|array',
            'student_ids.*' => 'exists:student_profiles,id',
        ]);
        
        $exam->load('term');
        
        $students = StudentProfile::with('user', 'lmsAllocations.lmsClass')
            ->whereIn('id', $request->student_ids)
            ->get();
            
        $marksheets = [];
        $allSubjects = [];
        
        foreach ($students as $student) {
            $marksheet = $this->examinationService->generateMarksheet($exam, $student);
            
            foreach ($marksheet['subjects'] as $sub) {
                if (!isset($allSubjects[$sub['subject_name']])) {
                    $allSubjects[$sub['subject_name']] = [
                        'name' => $sub['subject_name'],
                        'full_marks' => $sub['full_marks'],
                        'pass_marks' => $sub['pass_marks']
                    ];
                }
            }
            
            $subjectsByKey = [];
            foreach ($marksheet['subjects'] as $sub) {
                $subjectsByKey[$sub['subject_name']] = $sub;
            }
            
            $marksheets[] = [
                'student' => $student,
                'primary_class' => $student->lmsAllocations->first()?->lmsClass?->name ?? '—',
                'subjects' => $subjectsByKey,
                'total_obtained' => $marksheet['total_obtained'],
                'total_full_marks' => $marksheet['total_full_marks'],
                'overall_percentage' => $marksheet['overall_percentage'],
                'overall_grade' => $marksheet['overall_grade'],
                'result_status' => $marksheet['result_status'],
            ];
        }

        return Inertia::render('examination/results/print-broadsheet', [
            'exam' => $exam,
            'subjects' => array_values($allSubjects),
            'marksheets' => $marksheets,
        ]);
    }
}

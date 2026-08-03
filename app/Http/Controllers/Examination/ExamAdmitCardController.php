<?php

namespace App\Http\Controllers\Examination;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\ExamSchedule;
use App\Models\LmsClass;
use App\Models\LmsClassEnrollment;
use App\Models\StudentProfile;
use App\Models\Institution;
use App\Support\InstitutionContext;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExamAdmitCardController extends Controller
{
    /**
     * Helper to compute ordinal sitting text (1st, 2nd, 3rd, etc.)
     */
    private function getOrdinalString(int $number): string
    {
        $ends = ['th','st','nd','rd','th','th','th','th','th','th'];
        if ((($number % 100) >= 11) && (($number % 100) <= 13)) {
            return $number . 'th';
        }
        return $number . $ends[$number % 10];
    }

    /**
     * Display selection form and students for generating admit cards.
     */
    public function index(Request $request)
    {
        $institutionId = InstitutionContext::getActiveInstitutionId();

        $exams = Exam::with(['term', 'session'])
            ->where('institution_id', $institutionId)
            ->orderBy('id', 'desc')
            ->get();

        $classes = LmsClass::where('institution_id', $institutionId)
            ->where('status', 1)
            ->get();

        $selectedExamId = $request->input('exam_id') ? (int)$request->input('exam_id') : null;
        $selectedClassId = $request->input('lms_class_id') ? (int)$request->input('lms_class_id') : null;

        $schedules = [];
        $students = [];
        $selectedExam = null;
        $selectedClass = null;

        if ($selectedExamId) {
            $selectedExam = Exam::with(['term', 'session'])->find($selectedExamId);
        }

        if ($selectedClassId) {
            $selectedClass = LmsClass::find($selectedClassId);
        }

        if ($selectedExamId && $selectedClassId) {
            // Fetch Schedules for this Exam + Class
            $rawSchedules = ExamSchedule::with('subject')
                ->where('exam_id', $selectedExamId)
                ->where('lms_class_id', $selectedClassId)
                ->orderBy('exam_date')
                ->orderBy('start_time')
                ->get();

            // Group by date to determine sittings (1st, 2nd, etc.)
            $groupedByDate = $rawSchedules->groupBy(function ($item) {
                return $item->exam_date ? $item->exam_date->format('Y-m-d') : 'no-date';
            });

            foreach ($groupedByDate as $dateStr => $dateSchedules) {
                foreach ($dateSchedules as $index => $sched) {
                    $sittingIndex = $index + 1;
                    $sittingLabel = $this->getOrdinalString($sittingIndex);

                    $examDateFormatted = $sched->exam_date ? $sched->exam_date->format('d-m-Y') : '—';
                    $dayName = $sched->exam_date ? strtoupper($sched->exam_date->format('l')) : '—';

                    $startTimeFormatted = $sched->start_time ? date('h:i A', strtotime($sched->start_time)) : '—';
                    $endTimeFormatted = $sched->end_time ? date('h:i A', strtotime($sched->end_time)) : '—';
                    $timing = "{$startTimeFormatted} TO {$endTimeFormatted}";

                    $schedules[] = [
                        'id' => $sched->id,
                        'subject_name' => strtoupper($sched->subject->name ?? '—'),
                        'sitting' => $sittingLabel,
                        'exam_date' => $examDateFormatted,
                        'day' => $dayName,
                        'timing' => $timing,
                    ];
                }
            }

            // Fetch Students in this class
            $enrollments = LmsClassEnrollment::with('lmsClass')
                ->where('lms_class_id', $selectedClassId)
                ->where('role', 'student')
                ->where('status', 'active')
                ->get();

            $userIds = $enrollments->pluck('user_id')->unique();

            $studentProfiles = StudentProfile::with('user')
                ->whereIn('user_id', $userIds)
                ->get();

            foreach ($studentProfiles as $student) {
                $enrollment = $enrollments->firstWhere('user_id', $student->user_id);
                $students[] = [
                    'id' => $student->id,
                    'user_id' => $student->user_id,
                    'name' => strtoupper($student->user->name ?? 'UNKNOWN'),
                    'father_name' => strtoupper($student->father_name ?? '—'),
                    'mother_name' => strtoupper($student->mother_name ?? '—'),
                    'roll_no' => $student->roll_no ?? '—',
                    'reg_no' => $student->reg_no ?? $student->admission_no ?? '—',
                    'admission_no' => $student->admission_no ?? '—',
                    'class_name' => $enrollment?->lmsClass?->name ?? $selectedClass->name ?? '—',
                    'section' => $enrollment?->section ?? 'A',
                    'photo_url' => $student->user->avatar_url ?? null,
                ];
            }
        }

        return Inertia::render('examination/admit-cards/index', [
            'exams' => $exams,
            'classes' => $classes,
            'selectedExamId' => $selectedExamId,
            'selectedClassId' => $selectedClassId,
            'selectedExam' => $selectedExam,
            'selectedClass' => $selectedClass,
            'schedules' => $schedules,
            'students' => $students,
        ]);
    }

    /**
     * Handle bulk printing of Admit Cards.
     */
    public function bulkPrint(Request $request)
    {
        $request->validate([
            'exam_id' => 'required|exists:exams,id',
            'lms_class_id' => 'required|exists:lms_classes,id',
            'student_ids' => 'required|array',
            'student_ids.*' => 'exists:student_profiles,id',
        ]);

        $exam = Exam::with(['term', 'session'])->findOrFail($request->exam_id);
        $lmsClass = LmsClass::findOrFail($request->lms_class_id);

        $rawSchedules = ExamSchedule::with('subject')
            ->where('exam_id', $request->exam_id)
            ->where('lms_class_id', $request->lms_class_id)
            ->orderBy('exam_date')
            ->orderBy('start_time')
            ->get();

        $schedules = [];
        $groupedByDate = $rawSchedules->groupBy(function ($item) {
            return $item->exam_date ? $item->exam_date->format('Y-m-d') : 'no-date';
        });

        foreach ($groupedByDate as $dateStr => $dateSchedules) {
            foreach ($dateSchedules as $index => $sched) {
                $sittingIndex = $index + 1;
                $sittingLabel = $this->getOrdinalString($sittingIndex);

                $examDateFormatted = $sched->exam_date ? $sched->exam_date->format('d-m-Y') : '—';
                $dayName = $sched->exam_date ? strtoupper($sched->exam_date->format('l')) : '—';

                $startTimeFormatted = $sched->start_time ? date('h:i A', strtotime($sched->start_time)) : '—';
                $endTimeFormatted = $sched->end_time ? date('h:i A', strtotime($sched->end_time)) : '—';
                $timing = "{$startTimeFormatted} TO {$endTimeFormatted}";

                $schedules[] = [
                    'id' => $sched->id,
                    'subject_name' => strtoupper($sched->subject->name ?? '—'),
                    'sitting' => $sittingLabel,
                    'exam_date' => $examDateFormatted,
                    'day' => $dayName,
                    'timing' => $timing,
                ];
            }
        }

        $institution = Institution::where('code', 'DEMO_SCH')->first();

        $students = StudentProfile::with('user')
            ->whereIn('id', $request->student_ids)
            ->get();

        $admitCards = [];

        foreach ($students as $student) {
            $enrollment = LmsClassEnrollment::where('user_id', $student->user_id)
                ->where('lms_class_id', $request->lms_class_id)
                ->first();

            $admitCards[] = [
                'student' => [
                    'id' => $student->id,
                    'name' => strtoupper($student->user->name ?? 'UNKNOWN'),
                    'father_name' => strtoupper($student->father_name ?? '—'),
                    'mother_name' => strtoupper($student->mother_name ?? '—'),
                    'roll_no' => $student->roll_no ?? '—',
                    'reg_no' => $student->reg_no ?? $student->admission_no ?? '23414752026325123543',
                    'admission_no' => $student->admission_no ?? '—',
                    'class_name' => $enrollment?->lmsClass?->name ?? $lmsClass->name ?? '—',
                    'section' => $enrollment?->section ?? 'A',
                    'photo_url' => $student->user->avatar_url ?? null,
                ],
                'schedules' => $schedules,
                'institution' => [
                    'name' => $institution?->name ?? 'GURUKUL SCHOOL',
                    'code' => $institution?->code ?? 'DEMO_SCH',
                    'reg_no' => '23414752026325123543',
                    'address' => 'At:Sundarganj, Baknaura, Rohtas, Bihar, 821311',
                    'trust' => '(Managed by Gurukul Managing Committee (Trust), Dehri on Sone)',
                    'contact' => 'Contact: +91 7739018091',
                    'logo_url' => '/images/gurukul-logo.png',
                ],
            ];
        }

        return Inertia::render('examination/admit-cards/print', [
            'exam' => $exam,
            'lmsClass' => $lmsClass,
            'admitCards' => $admitCards,
        ]);
    }
}

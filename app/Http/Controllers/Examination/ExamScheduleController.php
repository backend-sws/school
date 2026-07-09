<?php

namespace App\Http\Controllers\Examination;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\ExamSchedule;
use App\Models\ExamMark;
use App\Models\LmsClass;
use App\Models\Subject;
use App\Models\ClassSubjectAllocation;
use App\Support\InstitutionContext;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ExamScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $institutionId = InstitutionContext::getActiveInstitutionId();
        
        $exams = Exam::where('institution_id', $institutionId)->get();

        $query = ExamSchedule::with(['exam', 'lmsClass', 'subject'])
            ->whereHas('exam', function ($q) use ($institutionId) {
                $q->where('institution_id', $institutionId);
            });

        if ($request->has('exam_id') && $request->exam_id) {
            $query->where('exam_id', $request->exam_id);
        }

        $schedules = $query->get();

        return Inertia::render('examination/schedules/index', [
            'schedules' => $schedules,
            'exams' => $exams,
            'selectedExamId' => $request->exam_id,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $institutionId = InstitutionContext::getActiveInstitutionId();
        
        $exams = Exam::where('institution_id', $institutionId)->get();
        
        $exam = null;
        $classes = collect();
        $subjectsByStream = [];

        if ($request->has('exam_id') && $request->exam_id) {
            $exam = Exam::where('institution_id', $institutionId)->findOrFail($request->exam_id);
            
            $classes = LmsClass::where('institution_id', $institutionId)
                ->where('status', 1)
                ->get();
                
            // Get all allocated subjects for these classes' streams
            $streamIds = $classes->pluck('stream_id')->unique()->filter()->toArray();
            $allocations = ClassSubjectAllocation::whereIn('stream_id', $streamIds)
                ->with('subject')
                ->get();
                
            // Group subjects by stream_id so frontend can easily map class -> stream -> subjects
            foreach ($allocations as $allocation) {
                if ($allocation->subject) {
                    $subjectsByStream[$allocation->stream_id][] = [
                        'id' => $allocation->subject->id,
                        'name' => $allocation->subject->name,
                    ];
                }
            }

            // De-duplicate subjects per stream (since an allocation might map different instructors to the same subject in the same stream)
            foreach ($subjectsByStream as $streamId => $subjects) {
                $uniqueSubjects = collect($subjects)->unique('id')->values()->all();
                $subjectsByStream[$streamId] = $uniqueSubjects;
            }
        }

        return Inertia::render('examination/schedules/create', [
            'exam' => $exam,
            'exams' => $exams,
            'classes' => $classes,
            'subjectsByStream' => $subjectsByStream,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'exam_id' => 'required|exists:exams,id',
            'schedules' => 'required|array',
            'schedules.*.lms_class_id' => 'required|exists:lms_classes,id',
            'schedules.*.subject_id' => 'required|exists:subjects,id',
            'schedules.*.exam_date' => 'required|date',
            'schedules.*.start_time' => 'nullable|date_format:H:i',
            'schedules.*.end_time' => 'nullable|date_format:H:i|after:schedules.*.start_time',
            'schedules.*.full_marks' => 'required|numeric|min:0',
            'schedules.*.pass_marks' => 'required|numeric|min:0|lte:schedules.*.full_marks',
            'schedules.*.type' => 'nullable|string|in:theory,practical,viva',
        ]);

        $exam = Exam::findOrFail($validated['exam_id']);

        DB::transaction(function () use ($validated, $exam) {
            foreach ($validated['schedules'] as $scheduleData) {
                $type = $scheduleData['type'] ?? 'theory';
                
                ExamSchedule::updateOrCreate(
                    [
                        'exam_id' => $exam->id,
                        'lms_class_id' => $scheduleData['lms_class_id'],
                        'subject_id' => $scheduleData['subject_id'],
                        'type' => $type,
                    ],
                    [
                        'exam_date' => $scheduleData['exam_date'],
                        'start_time' => $scheduleData['start_time'] ?? null,
                        'end_time' => $scheduleData['end_time'] ?? null,
                        'full_marks' => $scheduleData['full_marks'],
                        'pass_marks' => $scheduleData['pass_marks'],
                    ]
                );
            }
        });

        return redirect()->route('examination.schedules.index', ['exam_id' => $exam->id])
            ->with('success', 'Schedules created/updated successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ExamSchedule $schedule)
    {
        $schedule->load(['exam', 'lmsClass', 'subject']);
        
        return Inertia::render('examination/schedules/edit', [
            'schedule' => $schedule,
            'exam' => $schedule->exam,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ExamSchedule $schedule)
    {
        $validated = $request->validate([
            'exam_date' => 'required|date',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i|after:start_time',
            'full_marks' => 'required|numeric|min:0',
            'pass_marks' => 'required|numeric|min:0|lte:full_marks',
            'type' => 'nullable|string|in:theory,practical,viva',
        ]);

        $schedule->update($validated);

        return redirect()->route('examination.schedules.index', ['exam_id' => $schedule->exam_id])
            ->with('success', 'Schedule updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ExamSchedule $schedule)
    {
        // Prevent deletion if marks exist
        $marksCount = ExamMark::where('exam_schedule_id', $schedule->id)->count();
        if ($marksCount > 0) {
            return redirect()->back()->with('error', 'Cannot delete schedule because marks have already been entered for it.');
        }

        $examId = $schedule->exam_id;
        $schedule->delete();

        return redirect()->route('examination.schedules.index', ['exam_id' => $examId])
            ->with('success', 'Schedule deleted successfully.');
    }
}

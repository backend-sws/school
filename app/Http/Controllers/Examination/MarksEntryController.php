<?php

namespace App\Http\Controllers\Examination;

use App\Http\Controllers\Controller;
use App\Models\ExamSchedule;
use App\Models\ExamMark;
use App\Models\StudentProfile;
use App\Models\LmsClass;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MarksEntryController extends Controller
{
    /**
     * Display the grid for a specific exam schedule (Class + Subject).
     */
    public function showGrid(ExamSchedule $schedule)
    {
        $schedule->load(['exam', 'lmsClass', 'subject']);
        
        // Fetch all students in the class
        $students = StudentProfile::with('user:id,name,email')
            ->whereHas('currentEnrollments', function ($q) use ($schedule) {
                $q->where('lms_class_id', $schedule->lms_class_id);
            })->get();

        // Fetch existing marks
        $existingMarks = ExamMark::where('exam_schedule_id', $schedule->id)
            ->get()
            ->keyBy('student_profile_id');

        $gridData = $students->map(function ($student) use ($existingMarks) {
            $mark = $existingMarks->get($student->id);
            return [
                'student_profile_id' => $student->id,
                'user_id' => $student->user_id,
                'name' => $student->user->name,
                'admission_no' => $student->admission_no,
                'marks_obtained' => $mark ? $mark->marks_obtained : '',
                'is_absent' => $mark ? (bool)$mark->is_absent : false,
                'remarks' => $mark ? $mark->remarks : '',
            ];
        });

        return Inertia::render('examination/marks-entry/grid', [
            'schedule' => $schedule,
            'gridData' => $gridData,
        ]);
    }

    /**
     * Batch save marks for the schedule.
     */
    public function saveBatch(Request $request, ExamSchedule $schedule)
    {
        $validated = $request->validate([
            'marks' => 'required|array',
            'marks.*.student_profile_id' => 'required|exists:student_profiles,id',
            'marks.*.user_id' => 'required|exists:users,id',
            'marks.*.marks_obtained' => 'nullable|numeric|min:0|max:' . $schedule->full_marks,
            'marks.*.is_absent' => 'required|boolean',
            'marks.*.remarks' => 'nullable|string|max:255',
        ]);

        $graderId = auth()->id();

        foreach ($validated['marks'] as $markData) {
            ExamMark::updateOrCreate(
                [
                    'exam_schedule_id' => $schedule->id,
                    'student_profile_id' => $markData['student_profile_id'],
                ],
                [
                    'user_id' => $markData['user_id'],
                    'marks_obtained' => $markData['is_absent'] ? null : $markData['marks_obtained'],
                    'is_absent' => $markData['is_absent'],
                    'remarks' => $markData['remarks'],
                    'grader_id' => $graderId,
                ]
            );
        }

        return redirect()->back()->with('success', 'Marks saved successfully.');
    }
}

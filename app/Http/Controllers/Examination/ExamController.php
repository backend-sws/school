<?php

namespace App\Http\Controllers\Examination;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\ExamTerm;
use App\Models\ExamSchedule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExamController extends Controller
{
    public function index()
    {
        $exams = Exam::with(['term', 'gradingScale'])->where('institution_id', \App\Support\InstitutionContext::getActiveInstitutionId())->get();
        return Inertia::render('examination/exams/index', ['exams' => $exams]);
    }

    public function create()
    {
        return Inertia::render('examination/exams/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'session_id' => 'required|exists:academic_sessions,id',
            'exam_term_id' => 'nullable|exists:exam_terms,id',
            'exam_grading_scale_id' => 'nullable|exists:exam_grading_scales,id',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'description' => 'nullable|string',
        ]);

        $validated['institution_id'] = \App\Support\InstitutionContext::getActiveInstitutionId();

        Exam::create($validated);

        return redirect()->route('examination.exams.index')->with('success', 'Exam created successfully.');
    }

    public function show(Exam $exam)
    {
        $exam->load(['schedules.lmsClass', 'schedules.subject']);
        return Inertia::render('examination/exams/show', ['exam' => $exam]);
    }

    public function edit(Exam $exam)
    {
        return Inertia::render('examination/exams/edit', ['exam' => $exam]);
    }

    public function update(Request $request, Exam $exam)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'session_id' => 'required|exists:academic_sessions,id',
            'exam_term_id' => 'nullable|exists:exam_terms,id',
            'exam_grading_scale_id' => 'nullable|exists:exam_grading_scales,id',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'description' => 'nullable|string',
        ]);

        $exam->update($validated);

        return redirect()->route('examination.exams.index')->with('success', 'Exam updated successfully.');
    }

    public function destroy(Exam $exam)
    {
        $exam->delete();
        return redirect()->route('examination.exams.index')->with('success', 'Exam deleted successfully.');
    }

    /**
     * Publish or unpublish exam results for student portal visibility.
     */
    public function togglePublish(Exam $exam)
    {
        $exam->update(['is_published' => ! $exam->is_published]);

        $message = $exam->is_published
            ? 'Results published. Students can now view their marksheets in the portal.'
            : 'Results moved back to draft. Students can no longer view marksheets.';

        return back()->with('success', $message);
    }
}

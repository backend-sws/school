<?php

namespace App\Http\Controllers\Examination;

use App\Http\Controllers\Controller;
use App\Models\ExamGradingScale;
use App\Models\ExamGradingRule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GradingScaleController extends Controller
{
    public function index()
    {
        $scales = ExamGradingScale::with('rules')
            ->where('institution_id', \App\Support\InstitutionContext::getActiveInstitutionId())
            ->get();
            
        return Inertia::render('examination/grading-scales/index', ['scales' => $scales]);
    }

    public function create()
    {
        return Inertia::render('examination/grading-scales/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'rules' => 'required|array|min:1',
            'rules.*.grade' => 'required|string|max:10',
            'rules.*.min_percentage' => 'required|numeric|min:0|max:100',
            'rules.*.max_percentage' => 'required|numeric|min:0|max:100|gte:rules.*.min_percentage',
            'rules.*.grade_point' => 'nullable|numeric',
            'rules.*.description' => 'nullable|string',
        ]);

        $scale = ExamGradingScale::create([
            'institution_id' => \App\Support\InstitutionContext::getActiveInstitutionId(),
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
        ]);

        foreach ($validated['rules'] as $ruleData) {
            $scale->rules()->create($ruleData);
        }

        return redirect()->route('examination.grading-scales.index')->with('success', 'Grading scale created successfully.');
    }

    public function edit(ExamGradingScale $scale)
    {
        $scale->load('rules');
        return Inertia::render('examination/grading-scales/edit', ['scale' => $scale]);
    }

    public function update(Request $request, ExamGradingScale $scale)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'rules' => 'required|array|min:1',
            'rules.*.id' => 'nullable|exists:exam_grading_rules,id',
            'rules.*.grade' => 'required|string|max:10',
            'rules.*.min_percentage' => 'required|numeric|min:0|max:100',
            'rules.*.max_percentage' => 'required|numeric|min:0|max:100|gte:rules.*.min_percentage',
            'rules.*.grade_point' => 'nullable|numeric',
            'rules.*.description' => 'nullable|string',
        ]);

        $scale->update([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
        ]);

        // Sync rules: delete removed ones, update existing, create new
        $existingRuleIds = collect($validated['rules'])->filter(fn($r) => isset($r['id']))->pluck('id');
        $scale->rules()->whereNotIn('id', $existingRuleIds)->delete();

        foreach ($validated['rules'] as $ruleData) {
            if (isset($ruleData['id'])) {
                $rule = ExamGradingRule::find($ruleData['id']);
                if ($rule) {
                    $rule->update($ruleData);
                }
            } else {
                $scale->rules()->create($ruleData);
            }
        }

        return redirect()->route('examination.grading-scales.index')->with('success', 'Grading scale updated successfully.');
    }

    public function destroy(ExamGradingScale $scale)
    {
        $scale->delete(); // Cascades to rules if configured, or just deletes scale
        return redirect()->route('examination.grading-scales.index')->with('success', 'Grading scale deleted successfully.');
    }
}

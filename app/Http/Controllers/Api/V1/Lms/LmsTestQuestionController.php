<?php

namespace App\Http\Controllers\Api\V1\Lms;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\LmsClass;
use App\Models\LmsTest;
use App\Models\LmsTestQuestion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LmsTestQuestionController extends BaseController
{
    public function index(Request $request, int $lms_class_id, int $test_id): JsonResponse
    {
        if (!LmsClass::userCanAccessForRead($request->user(), $lms_class_id)) {
            return $this->forbidden('You do not have permission to view questions.');
        }

        $test = LmsTest::where('lms_class_id', $lms_class_id)->find($test_id);
        if (!$test) {
            return $this->error('Test not found.', 404);
        }

        $questions = $test->questions();

        return $this->success($questions->get());
    }

    public function store(Request $request, int $lms_class_id, int $test_id): JsonResponse
    {
        if (!LmsClass::userCanEditContentInClass($request->user(), $lms_class_id)) {
            return $this->forbidden('You do not have permission to add questions.');
        }

        $test = LmsTest::where('lms_class_id', $lms_class_id)->find($test_id);
        if (!$test) {
            return $this->error('Test not found.', 404);
        }

        $validated = $request->validate([
            'question_text' => 'required|string',
            'type' => 'required|string|in:mcq,short_answer,true_false,essay',
            'options' => 'nullable|array',
            'correct_answer' => 'nullable|string|max:500',
            'points' => 'nullable|numeric|min:0',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $validated['lms_test_id'] = $test_id;
        $question = LmsTestQuestion::create($validated);

        return $this->created($question, 'Question added successfully');
    }

    public function update(Request $request, int $lms_class_id, int $test_id, int $id): JsonResponse
    {
        if (!LmsClass::userCanEditContentInClass($request->user(), $lms_class_id)) {
            return $this->forbidden('You do not have permission to update questions.');
        }

        $question = LmsTestQuestion::where('lms_test_id', $test_id)->find($id);
        if (!$question) {
            return $this->error('Question not found.', 404);
        }

        $validated = $request->validate([
            'question_text' => 'sometimes|string',
            'type' => 'sometimes|string|in:mcq,short_answer,true_false,essay',
            'options' => 'nullable|array',
            'correct_answer' => 'nullable|string|max:500',
            'points' => 'nullable|numeric|min:0',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $question->update($validated);

        return $this->successWithMap($question, 'passthrough', 'Question updated successfully');
    }

    public function destroy(Request $request, int $lms_class_id, int $test_id, int $id): JsonResponse
    {
        if (!LmsClass::userCanEditContentInClass($request->user(), $lms_class_id)) {
            return $this->forbidden('You do not have permission to delete questions.');
        }

        $question = LmsTestQuestion::where('lms_test_id', $test_id)->find($id);
        if (!$question) {
            return $this->error('Question not found.', 404);
        }

        $question->delete();

        return $this->success(null, 'Question deleted');
    }
}

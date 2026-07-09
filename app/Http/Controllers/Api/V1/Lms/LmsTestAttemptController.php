<?php

namespace App\Http\Controllers\Api\V1\Lms;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\LmsClass;
use App\Models\LmsTest;
use App\Models\LmsTestAttempt;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Carbon\Carbon;

class LmsTestAttemptController extends BaseController
{
    public function start(Request $request, int $lms_class_id, int $test_id): JsonResponse
    {
        if (!LmsClass::userCanAccessForRead($request->user(), $lms_class_id)) {
            return $this->forbidden('You do not have permission to take this test.');
        }

        $test = LmsTest::where('lms_class_id', $lms_class_id)->find($test_id);
        if (!$test) {
            return $this->error('Test not found.', 404);
        }

        // Check if attempts left
        $attemptCount = LmsTestAttempt::where('lms_test_id', $test_id)
            ->where('user_id', $request->user()->id)
            ->count();

        if ($attemptCount >= $test->max_attempts) {
            return $this->error('Maximum attempts reached.', 400);
        }

        // Check availability
        $now = Carbon::now();
        if ($test->available_from && $now->lt($test->available_from)) {
            return $this->error('Test is not available yet.', 400);
        }
        if ($test->available_until && $now->gt($test->available_until)) {
            return $this->error('Test has expired.', 400);
        }

        $attempt = LmsTestAttempt::create([
            'lms_test_id' => $test_id,
            'user_id' => $request->user()->id,
            'started_at' => $now,
            'status' => 'in_progress',
        ]);

        // Return test details and questions (hide correct answers)
        $questions = $test->questions()->get()->map(function ($q) {
            return [
                'id' => $q->id,
                'question_text' => $q->question_text,
                'type' => $q->type,
                'options' => $q->options,
                'points' => $q->points,
            ];
        });

        if ($test->shuffle_questions) {
            $questions = $questions->shuffle();
        }

        return $this->success([
            'attempt' => $attempt,
            'test' => [
                'title' => $test->title,
                'duration_minutes' => $test->duration_minutes,
            ],
            'questions' => $questions,
        ]);
    }

    public function submit(Request $request, int $lms_class_id, int $test_id, int $id): JsonResponse
    {
        $attempt = LmsTestAttempt::where('lms_test_id', $test_id)
            ->where('user_id', $request->user()->id)
            ->find($id);

        if (!$attempt || $attempt->status !== 'in_progress') {
            return $this->error('Invalid attempt.', 400);
        }

        $validated = $request->validate([
            'answers' => 'required|array', // { question_id: answer }
        ]);

        $score = 0;
        $test = $attempt->lmsTest;
        $questions = $test->questions->keyBy('id');

        foreach ($validated['answers'] as $qId => $answer) {
            if (isset($questions[$qId])) {
                $q = $questions[$qId];

                // Auto-grading for MCQ, True/False
                if (in_array($q->type, ['mcq', 'true_false'])) {
                    if (strcasecmp(trim($q->correct_answer), trim((string) $answer)) === 0) {
                        $score += $q->points;
                    }
                }
            }
        }

        $attempt->update([
            'submitted_at' => Carbon::now(),
            'score' => $score,
            'answers_snapshot' => $validated['answers'],
            'status' => 'submitted',
        ]);

        return $this->successWithMap($attempt, 'passthrough', 'Test submitted successfully');
    }

    public function myAttempts(Request $request, int $lms_class_id, int $test_id): JsonResponse
    {
        $attempts = LmsTestAttempt::where('lms_test_id', $test_id)
            ->where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->get();

        return $this->success($attempts);
    }
}

<?php

namespace App\Services;

use App\Models\Exam;
use App\Models\LmsClass;
use App\Models\StudentProfile;

class ExaminationService
{
    /**
     * Generate the structured marksheet data for a specific student and exam.
     */
    public function generateMarksheet(Exam $exam, StudentProfile $student)
    {
        $exam->loadMissing('gradingScale.rules', 'schedules.subject', 'schedules.marks');

        $gradingRules = $exam->gradingScale ? $exam->gradingScale->rules->sortByDesc('min_percentage') : collect();

        $classIds = $student->currentEnrollments()->pluck('lms_class_id')->toArray();
        $schedules = count($classIds) > 0
            ? $exam->schedules->whereIn('lms_class_id', $classIds)
            : $exam->schedules;

        $subjectsData = [];
        $totalObtained = 0;
        $totalFullMarks = 0;
        $allPassed = true;
        $hasMissingMarks = false;

        foreach ($schedules as $schedule) {
            $mark = $schedule->marks->where('student_profile_id', $student->id)->first();
            
            $obtained = $mark ? ($mark->is_absent ? 0 : $mark->marks_obtained) : null;
            $isAbsent = $mark ? $mark->is_absent : false;
            
            $subjectPercentage = null;
            $subjectGrade = null;
            $subjectGradePoint = null;
            $isPass = false;

            if ($obtained === null) {
                $hasMissingMarks = true;
            } elseif ($obtained >= $schedule->pass_marks) {
                $isPass = true;
            }

            if (!$isPass && $obtained !== null) {
                $allPassed = false;
            }

            if ($obtained !== null && $schedule->full_marks > 0) {
                $subjectPercentage = ($obtained / $schedule->full_marks) * 100;

                $totalObtained += $obtained;
                $totalFullMarks += $schedule->full_marks;

                if ($gradingRules->isNotEmpty()) {
                    $rule = $gradingRules->first(function ($r) use ($subjectPercentage) {
                        return $subjectPercentage >= $r->min_percentage && $subjectPercentage <= $r->max_percentage;
                    });
                    
                    if ($rule) {
                        $subjectGrade = $rule->grade;
                        $subjectGradePoint = $rule->grade_point;
                    }
                }
            }

            $subjectsData[] = [
                'subject_id' => $schedule->subject_id,
                'subject_name' => $schedule->subject->name,
                'type' => $schedule->type,
                'full_marks' => $schedule->full_marks,
                'pass_marks' => $schedule->pass_marks,
                'marks_obtained' => $obtained,
                'is_absent' => $isAbsent,
                'percentage' => $subjectPercentage,
                'grade' => $subjectGrade,
                'grade_point' => $subjectGradePoint,
                'is_pass' => $isPass,
            ];
        }

        $overallPercentage = $totalFullMarks > 0 ? ($totalObtained / $totalFullMarks) * 100 : 0;
        $overallGrade = null;
        if ($gradingRules->isNotEmpty()) {
            $rule = $gradingRules->first(function ($r) use ($overallPercentage) {
                return $overallPercentage >= $r->min_percentage && $overallPercentage <= $r->max_percentage;
            });
            if ($rule) {
                $overallGrade = $rule->grade;
            }
        }

        $resultStatus = '—';
        if ($schedules->count() > 0) {
            if ($hasMissingMarks) {
                $resultStatus = '—';
            } else {
                $resultStatus = $allPassed ? 'PASS' : 'FAIL';
            }
        }

        return [
            'student' => $student,
            'exam' => $exam,
            'subjects' => $subjectsData,
            'total_obtained' => $totalObtained,
            'total_full_marks' => $totalFullMarks,
            'overall_percentage' => $overallPercentage,
            'overall_grade' => $overallGrade,
            'all_passed' => $allPassed,
            'result_status' => $resultStatus,
        ];
    }
}

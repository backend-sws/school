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
            
            $fa1 = $mark ? ($mark->is_absent ? 0 : $mark->fa1) : null;
            $fa2 = $mark ? ($mark->is_absent ? 0 : $mark->fa2) : null;
            $sa1 = $mark ? ($mark->is_absent ? 0 : $mark->sa1) : null;
            $fa3 = $mark ? ($mark->is_absent ? 0 : $mark->fa3) : null;
            $fa4 = $mark ? ($mark->is_absent ? 0 : $mark->fa4) : null;
            $sa2 = $mark ? ($mark->is_absent ? 0 : $mark->sa2) : null;

            $term1Total = (float)$fa1 + (float)$fa2 + (float)$sa1;
            $term2Total = (float)$fa3 + (float)$fa4 + (float)$sa2;
            $hasTermMarks = ($fa1 !== null || $fa2 !== null || $sa1 !== null || $fa3 !== null || $fa4 !== null || $sa2 !== null);
            
            $finalSubjectMarks = $hasTermMarks ? ($term1Total + $term2Total) : ($obtained ?? 0);
            $finalSubjectFullMarks = $hasTermMarks ? ($schedule->full_marks > 0 ? $schedule->full_marks * 2 : 200) : $schedule->full_marks;

            $subjectPercentage = null;
            $subjectGrade = null;
            $subjectGradePoint = null;
            $grade1 = null;
            $grade2 = null;
            $finalGrade = null;
            $isPass = false;

            if ($obtained === null && !$hasTermMarks) {
                $hasMissingMarks = true;
            } elseif ($obtained >= $schedule->pass_marks || $finalSubjectMarks >= ($schedule->pass_marks * 2)) {
                $isPass = true;
            }

            if (!$isPass && ($obtained !== null || $hasTermMarks)) {
                $allPassed = false;
            }

            if ($finalSubjectFullMarks > 0) {
                $subjectPercentage = ($finalSubjectMarks / $finalSubjectFullMarks) * 100;

                $totalObtained += $finalSubjectMarks;
                $totalFullMarks += $finalSubjectFullMarks;

                if ($gradingRules->isNotEmpty()) {
                    $rule = $gradingRules->first(function ($r) use ($subjectPercentage) {
                        return $subjectPercentage >= $r->min_percentage && $subjectPercentage <= $r->max_percentage;
                    });
                    
                    if ($rule) {
                        $subjectGrade = $rule->grade;
                        $subjectGradePoint = $rule->grade_point;
                    }

                    // Term 1 and Term 2 grades out of 100
                    $rule1 = $gradingRules->first(function ($r) use ($term1Total) {
                        return $term1Total >= $r->min_percentage && $term1Total <= $r->max_percentage;
                    });
                    if ($rule1) $grade1 = $rule1->grade;

                    $rule2 = $gradingRules->first(function ($r) use ($term2Total) {
                        return $term2Total >= $r->min_percentage && $term2Total <= $r->max_percentage;
                    });
                    if ($rule2) $grade2 = $rule2->grade;

                    $finalGrade = $subjectGrade;
                } else {
                    // Fallback CBSE grading
                    $calcGrade = function($pct) {
                        if ($pct >= 90) return 'A1';
                        if ($pct >= 80) return 'A2';
                        if ($pct >= 70) return 'B1';
                        if ($pct >= 60) return 'B2';
                        if ($pct >= 50) return 'C1';
                        if ($pct >= 40) return 'C2';
                        if ($pct >= 33) return 'D';
                        return 'E';
                    };
                    $grade1 = $calcGrade($term1Total);
                    $grade2 = $calcGrade($term2Total);
                    $finalGrade = $calcGrade($subjectPercentage);
                    $subjectGrade = $finalGrade;
                }
            }

            $subjectsData[] = [
                'subject_id' => $schedule->subject_id,
                'subject_name' => $schedule->subject->name,
                'type' => $schedule->type,
                'full_marks' => $schedule->full_marks,
                'pass_marks' => $schedule->pass_marks,
                'marks_obtained' => $obtained,
                'fa1' => $fa1,
                'fa2' => $fa2,
                'sa1' => $sa1,
                'fa3' => $fa3,
                'fa4' => $fa4,
                'sa2' => $sa2,
                'term1_total' => $term1Total,
                'term2_total' => $term2Total,
                'final_marks' => $finalSubjectMarks,
                'grade1' => $grade1,
                'grade2' => $grade2,
                'final_grade' => $finalGrade,
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
        if (!$overallGrade) {
            if ($overallPercentage >= 90) $overallGrade = 'A1';
            elseif ($overallPercentage >= 80) $overallGrade = 'A2';
            elseif ($overallPercentage >= 70) $overallGrade = 'B1';
            elseif ($overallPercentage >= 60) $overallGrade = 'B2';
            elseif ($overallPercentage >= 50) $overallGrade = 'C1';
            elseif ($overallPercentage >= 40) $overallGrade = 'C2';
            elseif ($overallPercentage >= 33) $overallGrade = 'D';
            else $overallGrade = 'E';
        }

        $resultStatus = '—';
        if ($schedules->count() > 0) {
            if ($hasMissingMarks) {
                $resultStatus = '—';
            } else {
                $resultStatus = $allPassed ? 'PASS' : 'FAIL';
            }
        }

        // Compute Rank in class dynamically
        $rank = 1;
        if (count($classIds) > 0) {
            $userIds = \App\Models\LmsClassEnrollment::whereIn('lms_class_id', $classIds)
                ->where('role', 'student')
                ->where('status', 'active')
                ->pluck('user_id')
                ->filter()
                ->unique();

            if ($userIds->count() > 1) {
                $classStudentIds = \App\Models\StudentProfile::whereIn('user_id', $userIds)->pluck('id');
                $studentTotals = [];
                foreach ($classStudentIds as $cStudentId) {
                    $cTotal = 0;
                    foreach ($schedules as $sched) {
                        $cMark = $sched->marks->where('student_profile_id', $cStudentId)->first();
                        if ($cMark && !$cMark->is_absent) {
                            $cTerm1 = (float)$cMark->fa1 + (float)$cMark->fa2 + (float)$cMark->sa1;
                            $cTerm2 = (float)$cMark->fa3 + (float)$cMark->fa4 + (float)$cMark->sa2;
                            $hasCTerm = ($cMark->fa1 !== null || $cMark->fa2 !== null || $cMark->sa1 !== null || $cMark->fa3 !== null || $cMark->fa4 !== null || $cMark->sa2 !== null);
                            $cFinal = $hasCTerm ? ($cTerm1 + $cTerm2) : (float)$cMark->marks_obtained;
                            $cTotal += $cFinal;
                        }
                    }
                    $studentTotals[$cStudentId] = $cTotal;
                }
                arsort($studentTotals);
                $rankedStudentIds = array_keys($studentTotals);
                $studentIndex = array_search($student->id, $rankedStudentIds);
                if ($studentIndex !== false) {
                    $rank = $studentIndex + 1;
                }
            }
        }

        return [
            'student' => $student,
            'exam' => $exam,
            'subjects' => $subjectsData,
            'total_obtained' => $totalObtained,
            'total_full_marks' => $totalFullMarks,
            'overall_percentage' => round($overallPercentage, 2),
            'overall_grade' => $overallGrade,
            'rank' => $rank,
            'all_passed' => $allPassed,
            'result_status' => $resultStatus,
        ];
    }
}

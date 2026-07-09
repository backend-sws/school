<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentPreviousExam extends Model
{
    use BelongsToDefaultInstitution;
    protected $table = 'student_previous_exams';

    protected $fillable = [
        'user_id',
        'institution_id',
        'exam_type',        // 'new_admission' (10th/12th) ya 'readmission' (Sem-1, 2)
        'exam_name',        // Matriculation, Intermediate, SEM-5
        'board_university', // BSEB, CBSE, Patliputra University
        'subjects',         // ALL, SCI, ARTS, COMM
        'passing_year',     // 2023, 2025
        'roll_no',          // Exam Roll Number
        'total_marks',      // Total Marks (e.g., 500)
        'marks_obtained',   // Obtained Marks (e.g., 326)
        'percentage',       // 65.2%
        'division',         // 1ST, 2ND, 3RD
        'document_url'     // Marksheet/Admit Card file path
    ];

    /**
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo
     */
    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

}
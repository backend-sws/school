<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\Auditable;

class ExamMark extends Model
{
    use HasFactory, Auditable;

    protected $fillable = [
        'exam_schedule_id',
        'student_profile_id',
        'user_id',
        'marks_obtained',
        'is_absent',
        'remarks',
        'grader_id',
    ];

    protected $casts = [
        'marks_obtained' => 'float',
        'is_absent' => 'boolean',
    ];

    public function schedule()
    {
        return $this->belongsTo(ExamSchedule::class, 'exam_schedule_id');
    }

    public function studentProfile()
    {
        return $this->belongsTo(StudentProfile::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function grader()
    {
        return $this->belongsTo(User::class, 'grader_id');
    }
}

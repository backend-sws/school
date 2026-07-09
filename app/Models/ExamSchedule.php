<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\Auditable;

class ExamSchedule extends Model
{
    use HasFactory, Auditable;

    protected $fillable = [
        'exam_id',
        'lms_class_id',
        'subject_id',
        'exam_date',
        'start_time',
        'end_time',
        'full_marks',
        'pass_marks',
        'type',
        'status',
    ];

    protected $casts = [
        'exam_date' => 'date',
        'full_marks' => 'float',
        'pass_marks' => 'float',
    ];

    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }

    public function lmsClass()
    {
        return $this->belongsTo(LmsClass::class, 'lms_class_id');
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function marks()
    {
        return $this->hasMany(ExamMark::class);
    }
}

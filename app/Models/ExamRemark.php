<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\Auditable;

class ExamRemark extends Model
{
    use HasFactory, Auditable;

    protected $fillable = [
        'exam_id',
        'lms_class_id',
        'student_profile_id',
        'user_id',
        'class_teacher_remark',
        'principal_remark',
    ];

    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }

    public function lmsClass()
    {
        return $this->belongsTo(LmsClass::class, 'lms_class_id');
    }

    public function studentProfile()
    {
        return $this->belongsTo(StudentProfile::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

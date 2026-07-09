<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\BelongsToDefaultInstitution;
use App\Traits\Auditable;

class Exam extends Model
{
    use HasFactory, BelongsToDefaultInstitution, Auditable;

    protected $fillable = [
        'institution_id',
        'session_id',
        'exam_term_id',
        'exam_grading_scale_id',
        'name',
        'description',
        'start_date',
        'end_date',
        'is_published',
        'status',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_published' => 'boolean',
    ];

    public function session()
    {
        return $this->belongsTo(Session::class);
    }

    public function term()
    {
        return $this->belongsTo(ExamTerm::class, 'exam_term_id');
    }

    public function gradingScale()
    {
        return $this->belongsTo(ExamGradingScale::class, 'exam_grading_scale_id');
    }

    public function schedules()
    {
        return $this->hasMany(ExamSchedule::class);
    }
}

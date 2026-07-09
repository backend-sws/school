<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\Auditable;

class ExamGradingRule extends Model
{
    use HasFactory, Auditable;

    protected $fillable = [
        'exam_grading_scale_id',
        'grade',
        'min_percentage',
        'max_percentage',
        'grade_point',
        'description',
    ];

    protected $casts = [
        'min_percentage' => 'float',
        'max_percentage' => 'float',
        'grade_point' => 'float',
    ];

    public function scale()
    {
        return $this->belongsTo(ExamGradingScale::class, 'exam_grading_scale_id');
    }
}

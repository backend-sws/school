<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

use App\Traits\BelongsToDefaultInstitution;
use App\Traits\Auditable;

class ExamTerm extends Model
{
    use HasFactory, BelongsToDefaultInstitution, Auditable;

    protected $fillable = [
        'institution_id',
        'session_id',
        'name',
        'description',
        'status',
    ];

    public function session()
    {
        return $this->belongsTo(Session::class);
    }

    public function exams()
    {
        return $this->hasMany(Exam::class);
    }
}

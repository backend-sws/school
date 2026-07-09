<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;

class StudentAcademicInfo extends Model
{
    use BelongsToDefaultInstitution;
    protected $table = 'student_academic_info';

    protected $fillable = [
        'user_id',
        'institution_id',
        'stream_id',
        'session_id',
        'semester',
        'institute_name',
        'session',
        'class',
        'section',
        'roll_number',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function institution(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function studentProfile()
    {
        return $this->belongsTo(StudentProfile::class);
    }
}

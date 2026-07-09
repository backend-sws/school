<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentAddress extends Model
{
    protected $fillable = [
        'user_id',
        'student_profile_id',
        'address_type',
        'village_mohalla',
        'post_office',
        'police_station',
        'district',
        'state',
        'pincode',
    ];

    public function studentProfile(): BelongsTo
    {
        return $this->belongsTo(StudentProfile::class);
    }
}

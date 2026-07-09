<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LmsClassEnrollment extends Model
{
    protected $table = 'lms_class_enrollments';

    protected $fillable = [
        'lms_class_id',
        'user_id',
        'enrolled_at',
        'role',
        'status',
    ];

    protected $casts = [
        'enrolled_at' => 'datetime',
    ];

    public function lmsClass(): BelongsTo
    {
        return $this->belongsTo(LmsClass::class, 'lms_class_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

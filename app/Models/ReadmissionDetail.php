<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class ReadmissionDetail extends Model
{
    protected $fillable = [
        'admission_application_id',
        'dropout_reason',
        'gap_duration_months',
        'previous_enrollment_status',
    ];

    protected $casts = [
        'gap_duration_months' => 'integer',
    ];

    /**
     * Get the parent transition record.
     */
    public function transition(): MorphOne
    {
        return $this->morphOne(StudentTransition::class, 'transitionable');
    }

    /**
     * The linked admission application (if re-admission went through the admission flow).
     */
    public function admissionApplication(): BelongsTo
    {
        return $this->belongsTo(AdmissionApplication::class);
    }
}

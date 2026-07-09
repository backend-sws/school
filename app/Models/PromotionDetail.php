<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class PromotionDetail extends Model
{
    protected $fillable = [
        'is_detained',
        'detention_reason',
        'academic_result',
    ];

    protected $casts = [
        'is_detained' => 'boolean',
    ];

    /**
     * Get the parent transition record.
     */
    public function transition(): MorphOne
    {
        return $this->morphOne(StudentTransition::class, 'transitionable');
    }
}

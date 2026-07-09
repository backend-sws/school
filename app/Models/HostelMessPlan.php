<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HostelMessPlan extends Model
{
    use BelongsToDefaultInstitution;

    protected $fillable = [
        'institution_id',
        'name',
        'type',
        'monthly_fee',
        'description',
        'meal_schedule',
        'is_active',
    ];

    protected $casts = [
        'monthly_fee' => 'decimal:2',
        'meal_schedule' => 'array',
        'is_active' => 'boolean',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }
}

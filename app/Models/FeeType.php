<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FeeType extends Model
{
    use BelongsToDefaultInstitution;

    protected $fillable = [
        'institution_id',
        'name',
        'category',
        'profile_type',
        'reservation_category',
        'gender',
        'display_order',
    ];

    protected $casts = [
        'display_order' => 'integer',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function feeStructures(): HasMany
    {
        return $this->hasMany(FeeStructureRule::class, 'fee_type_id');
    }

    public function getTitleAttribute()
    {
        return $this->name;
    }
}

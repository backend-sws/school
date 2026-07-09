<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FeeRegulationProfile extends Model
{
    use BelongsToDefaultInstitution;

    protected $table = 'fee_regulation_profiles';

    protected $fillable = [
        'institution_id',
        'name',
        'profile_type',
        'gender',
        'category',
        'description',
        'is_default',
        'fee_collection_frequency',
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(FeeRegulationProfileItem::class, 'profile_id');
    }
}

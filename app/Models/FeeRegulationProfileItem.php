<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FeeRegulationProfileItem extends Model
{
    protected $table = 'fee_regulation_profile_items';

    protected $fillable = [
        'profile_id',
        'fee_type_id',
        'amount',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    public function profile(): BelongsTo
    {
        return $this->belongsTo(FeeRegulationProfile::class, 'profile_id');
    }

    public function feeType(): BelongsTo
    {
        return $this->belongsTo(FeeType::class, 'fee_type_id');
    }
}

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
        'session_id',
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
        'session_id' => 'integer',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function session(): BelongsTo
    {
        return $this->belongsTo(Session::class, 'session_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(FeeRegulationProfileItem::class, 'profile_id');
    }

    public function scopeForSession($query, ?int $sessionId)
    {
        if (!$sessionId) {
            return $query;
        }

        return $query->where(function ($q) use ($sessionId) {
            $q->where('session_id', $sessionId)
              ->orWhereNull('session_id');
        });
    }
}


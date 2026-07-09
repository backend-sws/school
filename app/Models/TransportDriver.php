<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TransportDriver extends Model
{
    use BelongsToDefaultInstitution;

    protected $fillable = [
        'institution_id',
        'name',
        'license_number',
        'license_valid_until',
        'mobile',
        'email',
        'user_id',
        'is_active',
    ];

    protected $casts = [
        'license_valid_until' => 'date',
        'is_active' => 'boolean',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function vehicles(): HasMany
    {
        return $this->hasMany(TransportVehicle::class, 'transport_driver_id');
    }
}

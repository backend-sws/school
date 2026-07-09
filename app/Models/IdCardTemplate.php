<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class IdCardTemplate extends Model
{
    use HasFactory, BelongsToDefaultInstitution;

    protected $fillable = [
        'institution_id',
        'name',
        'card_type',
        'front_layout',
        'back_layout',
        'background_color',
        'background_image_url',
        'logo_url',
        'color_scheme',
        'is_default',
        'is_active',
    ];

    protected $casts = [
        'front_layout' => 'array',
        'back_layout'  => 'array',
        'color_scheme'  => 'array',
        'is_default'    => 'boolean',
        'is_active'     => 'boolean',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function idCards(): HasMany
    {
        return $this->hasMany(IdCard::class, 'template_id');
    }
}

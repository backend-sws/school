<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InventoryCategory extends Model
{
    use BelongsToDefaultInstitution;

    protected $fillable = [
        'institution_id',
        'name',
        'code',
        'description',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(InventoryItem::class, 'inventory_category_id');
    }
}

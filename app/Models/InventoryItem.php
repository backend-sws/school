<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InventoryItem extends Model
{
    use BelongsToDefaultInstitution;

    protected $fillable = [
        'institution_id',
        'inventory_category_id',
        'name',
        'code',
        'unit',
        'min_stock',
        'current_quantity',
        'location',
        'description',
        'is_active',
        'selling_price',
        'purchase_price',
        'margin_percentage',
        'gst_rate',
        'hsn_code',
    ];

    protected $casts = [
        'min_stock' => 'decimal:3',
        'current_quantity' => 'decimal:3',
        'is_active' => 'boolean',
        'selling_price' => 'decimal:2',
        'purchase_price' => 'decimal:2',
        'margin_percentage' => 'decimal:2',
        'gst_rate' => 'decimal:2',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(InventoryCategory::class, 'inventory_category_id');
    }

    public function movements(): HasMany
    {
        return $this->hasMany(InventoryMovement::class, 'inventory_item_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryPurchaseLine extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'inventory_purchase_id',
        'inventory_item_id',
        'quantity',
        'unit_cost',
        'amount',
        'movement_id',
    ];

    protected $casts = [
        'quantity' => 'decimal:3',
        'unit_cost' => 'decimal:2',
        'amount' => 'decimal:2',
    ];

    public function purchase(): BelongsTo
    {
        return $this->belongsTo(InventoryPurchase::class, 'inventory_purchase_id');
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(InventoryItem::class, 'inventory_item_id');
    }

    public function movement(): BelongsTo
    {
        return $this->belongsTo(InventoryMovement::class, 'movement_id');
    }
}

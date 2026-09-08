<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InventoryBatch extends Model
{
    use BelongsToDefaultInstitution;

    protected $fillable = [
        'institution_id',
        'inventory_item_id',
        'batch_no',
        'purchase_line_id',
        'received_quantity',
        'remaining_quantity',
        'unit_cost',
        'received_at',
        'supplier_name',
        'status',
    ];

    protected $casts = [
        'received_quantity'  => 'decimal:3',
        'remaining_quantity' => 'decimal:3',
        'unit_cost'          => 'decimal:2',
        'received_at'        => 'date',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(InventoryItem::class, 'inventory_item_id');
    }

    public function purchaseLine(): BelongsTo
    {
        return $this->belongsTo(InventoryPurchaseLine::class, 'purchase_line_id');
    }

    public function issueBatches(): HasMany
    {
        return $this->hasMany(InventoryIssueBatch::class, 'inventory_batch_id');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active')->where('remaining_quantity', '>', 0);
    }

    public function scopeFifo(Builder $query): Builder
    {
        return $query->orderBy('received_at', 'asc')->orderBy('id', 'asc');
    }
}

<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryIssue extends Model
{
    use BelongsToDefaultInstitution;

    public const UPDATED_AT = null;

    protected $fillable = [
        'institution_id',
        'inventory_item_id',
        'quantity',
        'quantity_after',
        'issued_to_user_id',
        'issued_to_name',
        'department',
        'purpose',
        'returned_quantity',
        'issued_by',
        'issued_at',
        'remarks',
        'movement_id',
    ];

    protected $casts = [
        'quantity' => 'decimal:3',
        'quantity_after' => 'decimal:3',
        'returned_quantity' => 'decimal:3',
        'issued_at' => 'date',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(InventoryItem::class, 'inventory_item_id');
    }

    public function issuedToUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'issued_to_user_id');
    }

    public function issuedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'issued_by');
    }

    public function movement(): BelongsTo
    {
        return $this->belongsTo(InventoryMovement::class, 'movement_id');
    }

    /**
     * Net outstanding quantity (not yet returned)
     */
    public function getOutstandingAttribute(): float
    {
        return (float) $this->quantity - (float) $this->returned_quantity;
    }
}

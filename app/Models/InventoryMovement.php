<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryMovement extends Model
{
    use BelongsToDefaultInstitution;

    public const UPDATED_AT = null;

    protected $fillable = [
        'institution_id',
        'inventory_item_id',
        'type',
        'quantity',
        'quantity_after',
        'reference_type',
        'reference_id',
        'performed_by',
        'remarks',
    ];

    protected $casts = [
        'quantity' => 'decimal:3',
        'quantity_after' => 'decimal:3',
        'reference_id' => 'integer',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(InventoryItem::class, 'inventory_item_id');
    }

    public function performer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'performed_by');
    }
}

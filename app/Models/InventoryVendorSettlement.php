<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InventoryVendorSettlement extends Model
{
    use BelongsToDefaultInstitution, Auditable;

    protected $fillable = [
        'institution_id',
        'inventory_vendor_id',
        'settlement_date',
        'amount',
        'payment_mode',
        'reference_number',
        'notes',
        'created_by',
        'expense_id',
    ];

    protected $casts = [
        'settlement_date' => 'date',
        'amount'          => 'decimal:2',
    ];

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(InventoryVendor::class, 'inventory_vendor_id');
    }

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function expense(): BelongsTo
    {
        return $this->belongsTo(Expense::class, 'expense_id');
    }

    /** Purchases marked against this settlement */
    public function purchases(): HasMany
    {
        return $this->hasMany(InventoryPurchase::class, 'inventory_vendor_settlement_id');
    }
}

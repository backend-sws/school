<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InventoryPurchase extends Model
{
    use BelongsToDefaultInstitution;

    protected $fillable = [
        'institution_id',
        'bill_no',
        'supplier_name',
        'inventory_vendor_id',
        'purchased_at',
        'total_cost',
        'payment_mode',
        'payment_status',
        'settled_at',
        'inventory_vendor_settlement_id',
        'purchased_by',
        'remarks',
        'reverted_at',
        'reverted_by',
        'revert_reason',
        'expense_id',
    ];

    protected $casts = [
        'total_cost'   => 'decimal:2',
        'purchased_at' => 'date',
        'settled_at'   => 'datetime',
        'reverted_at'  => 'datetime',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(InventoryVendor::class, 'inventory_vendor_id');
    }

    public function settlement(): BelongsTo
    {
        return $this->belongsTo(InventoryVendorSettlement::class, 'inventory_vendor_settlement_id');
    }

    public function purchasedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'purchased_by');
    }

    public function revertedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reverted_by');
    }

    public function expense(): BelongsTo
    {
        return $this->belongsTo(Expense::class, 'expense_id');
    }

    public function lines(): HasMany
    {
        return $this->hasMany(InventoryPurchaseLine::class, 'inventory_purchase_id');
    }
}

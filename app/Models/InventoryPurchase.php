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
        'purchased_at',
        'total_cost',
        'payment_mode',
        'purchased_by',
        'remarks',
        'expense_id',
    ];

    protected $casts = [
        'total_cost' => 'decimal:2',
        'purchased_at' => 'date',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function purchasedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'purchased_by');
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

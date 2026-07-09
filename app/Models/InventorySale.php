<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InventorySale extends Model
{
    use BelongsToDefaultInstitution;

    public const UPDATED_AT = null;

    public const BUYER_TYPES = ['student', 'parent', 'other'];

    protected $fillable = [
        'institution_id',
        'fee_payment_id',
        'user_id',
        'buyer_type',
        'buyer_name',
        'total_amount',
        'payment_status',
        'collected_by',
        'remarks',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function feePayment(): BelongsTo
    {
        return $this->belongsTo(FeePayment::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function collectedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'collected_by');
    }

    public function lines(): HasMany
    {
        return $this->hasMany(InventorySaleLine::class, 'inventory_sale_id');
    }
}

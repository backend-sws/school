<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryIssueBatch extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'inventory_issue_id',
        'inventory_batch_id',
        'quantity',
        'unit_cost',
        'amount',
        'created_at',
    ];

    protected $casts = [
        'quantity'   => 'decimal:3',
        'unit_cost'  => 'decimal:2',
        'amount'     => 'decimal:2',
        'created_at' => 'datetime',
    ];

    public function issue(): BelongsTo
    {
        return $this->belongsTo(InventoryIssue::class, 'inventory_issue_id');
    }

    public function batch(): BelongsTo
    {
        return $this->belongsTo(InventoryBatch::class, 'inventory_batch_id');
    }
}

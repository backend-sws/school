<?php

namespace App\Models;


use App\Models\Transaction;
use App\Models\User;
use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\Auditable;

class FeePayment extends Model
{
    use Auditable, BelongsToDefaultInstitution;

    protected $table = 'fee_payments';
    public $timestamps = false;
    protected $fillable = [
        'institution_id',
        'payment_id',
        'user_id',
        'fee_head_id',
        'amount',
        'late_fee_applied',
        'total_amount',
        'payment_mode',
        'payment_status',
        'transaction_id',
        'gateway_response',
        'payment_date',
        'collected_by',
        'process_status',
        'remarks',
        'processed_by',
        'processed_at',
        'cash_amount',
        'online_amount',
        'online_transaction_id',
        'cheque_number',
        'bank_name',
        'for_month',
        'receipt_no',
        'ledger_snapshot',
        'payable_entity_type',
        'payable_entity_id',
    ];


    protected $casts = [
        'amount' => 'decimal:2',
        'late_fee_applied' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'cash_amount' => 'decimal:2',
        'online_amount' => 'decimal:2',
        'gateway_response' => 'array',
        'payment_date' => 'datetime',
        'ledger_snapshot' => 'array',
        'payable_entity_id' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function feeHead(): BelongsTo
    {
        return $this->belongsTo(FeeType::class, 'fee_head_id');
    }




    public function collectedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'collected_by');
    }

    public function transaction()
    {

        return $this->hasOne(Transaction::class, 'txn_id', 'transaction_id');
    }


    public function processor()
    {

        return $this->belongsTo(User::class, 'processed_by');
    }

    public function inventorySale(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(InventorySale::class, 'fee_payment_id');
    }

    public function payableEntity()
    {
        return $this->morphTo('payable_entity', 'payable_entity_type', 'payable_entity_id');
    }

    // ─── Status Helpers ─────────────────────────────────────────────────

    public function isPaid(): bool { return in_array($this->payment_status, ['paid', 'success'], true); }

    public function isPending(): bool { return $this->payment_status === 'pending'; }

    public function isFailed(): bool { return $this->payment_status === 'failed'; }

    public function isProcessed(): bool { return $this->process_status === 'approved'; }

    public function markPaid(string $txnId, ?string $mode = null): void
    {
        $this->update([
            'payment_status' => 'paid',
            'transaction_id' => $txnId,
            'payment_date' => now(),
            'payment_mode' => $mode ?? $this->payment_mode,
        ]);
    }

    // ─── Scopes ─────────────────────────────────────────────────────────

    public function scopePaid($query) { return $query->whereIn('payment_status', ['paid', 'success']); }

    public function scopePending($query) { return $query->where('payment_status', 'pending'); }

    public function scopeForMonth($query, string $month) { return $query->where('for_month', $month); }
}


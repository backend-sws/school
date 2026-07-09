<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $table = 'transactions';

    protected $fillable = [
        'user_id',
        'transaction_id',
        'type',
        'payable_type',
        'payable_id',
        'amount',
        'payment_mode',
        'status',
        'meta',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'meta' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function feePayment()
    {
        return $this->belongsTo(FeePayment::class);
    }

    public function admissionApplication()
    {
        return $this->belongsTo(AdmissionApplication::class);
    }

    public function payable()
    {
        return $this->morphTo();
    }


}

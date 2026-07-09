<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentFeePeriodBalance extends Model
{
    use BelongsToDefaultInstitution;

    protected $table = 'student_fee_period_balances';

    protected $fillable = [
        'institution_id',
        'user_id',
        'session_id',
        'period_key',
        'opening_balance',
        'period_fee',
        'discount',
        'late_fee',
        'total_payable',
        'paid_amount',
        'closing_balance',
        'frequency',
        'version_hash',
    ];

    protected $casts = [
        'opening_balance' => 'decimal:2',
        'period_fee' => 'decimal:2',
        'discount' => 'decimal:2',
        'late_fee' => 'decimal:2',
        'total_payable' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'closing_balance' => 'decimal:2',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function session(): BelongsTo
    {
        return $this->belongsTo(Session::class, 'session_id');
    }
}

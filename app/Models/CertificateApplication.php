<?php

namespace App\Models;

use App\Enums\PaymentStatus;
use App\Enums\ProcessStatus;
use App\Models\CertificateHead;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\BelongsToDefaultInstitution;
use App\Traits\Auditable;

class CertificateApplication extends Model
{
    use Auditable, BelongsToDefaultInstitution;

    protected $table = 'certificate_applications';

    public $timestamps = false;

    protected $guarded = ['id'];

    protected $casts = [
        'payment_status' => PaymentStatus::class,
        'process_status' => ProcessStatus::class,
        'submitted_at' => 'datetime',
        'completed_at' => 'datetime',
        'academic_info_snapshot' => 'array',
        'permanent_address_snapshot' => 'array',
        'subjects_taken_snapshot' => 'array',
        'custom_fields_data' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function certificateHead(): BelongsTo
    {
        return $this->belongsTo(CertificateHead::class);
    }

    public function issuedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'issued_by');
    }

    /**
     * Relationship to the central transactions table.
     */
    public function transaction()
    {
        return $this->hasOne(Transaction::class, 'txn_id', 'application_id');
    }
}

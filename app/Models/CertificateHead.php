<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Traits\Auditable;

class CertificateHead extends Model
{
    use Auditable;

    use BelongsToDefaultInstitution;

    protected $table = 'certificate_heads';

    public $timestamps = false;
    protected $fillable = [
        'institution_id',
        'title',
        'description',
        'main_stream_id',
        'stream_id',
        'fee_amount',
        'payment_processor',
        'header_image',
        'web_certificate_required',
        'custom_fields',
        'processing_days',
        'status',
        'certificate_template',
    ];

    protected $casts = [
        'custom_fields' => 'array',
        'web_certificate_required' => 'boolean',
        'fee_amount' => 'decimal:2',
        'status' => 'integer'
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function applications(): HasMany
    {
        return $this->hasMany(CertificateApplication::class);
    }

    public function stream(): BelongsTo
    {
        return $this->belongsTo(Stream::class, 'stream_id');
    }

    public function mainStream(): BelongsTo
    {
        return $this->belongsTo(MainStream::class);
    }
}

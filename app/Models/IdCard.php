<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IdCard extends Model
{
    use HasFactory, BelongsToDefaultInstitution;

    protected $fillable = [
        'institution_id',
        'template_id',
        'user_id',
        'session_id',
        'card_type',
        'verification_token',
        'snapshot_data',
        'photo_url',
        'pdf_path',
        'status',
        'valid_from',
        'valid_until',
        'generated_at',
        'printed_at',
    ];

    protected $casts = [
        'snapshot_data' => 'array',
        'valid_from'    => 'date',
        'valid_until'   => 'date',
        'generated_at'  => 'datetime',
        'printed_at'    => 'datetime',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(IdCardTemplate::class, 'template_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function session(): BelongsTo
    {
        return $this->belongsTo(Session::class);
    }

    /**
     * Full public verification URL for QR code.
     */
    public function getVerificationUrlAttribute(): string
    {
        $domain = $this->institution?->full_domain ?? config('app.url');
        return "https://{$domain}/verify/id/{$this->verification_token}";
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * A payment card stored for a user.
 * Sensitive fields (expiry, token) are AES-256 encrypted via Laravel Crypt.
 *
 * @property int    $id
 * @property int    $user_id
 * @property string $label
 * @property string $card_last_four
 * @property string $card_holder_name
 * @property string $card_expiry_encrypted
 * @property string $card_token_encrypted
 * @property bool   $is_default
 */
class PaymentCard extends Model
{
    protected $fillable = [
        'user_id',
        'label',
        'card_last_four',
        'card_holder_name',
        'card_expiry_encrypted',
        'card_token_encrypted',
        'is_default',
    ];

    protected $hidden = [
        'card_expiry_encrypted',
        'card_token_encrypted',
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

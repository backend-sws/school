<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\Auditable;

class Grievance extends Model
{
    use Auditable;

    use BelongsToDefaultInstitution;

    public $timestamps = false;
   protected $fillable = [
        'institution_id',
        'ticket_no',
        'user_id',
        'name',
        'email',
        'mobile',
        'category',
        'subject',
        'description',
        'status',
        'priority',
        'assigned_to',
        'resolution',
        'resolved_at',
    ];

    protected $casts = [
        'resolved_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}

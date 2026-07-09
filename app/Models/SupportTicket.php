<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;
use App\Traits\Auditable;

class SupportTicket extends Model
{
    use Auditable;

    use BelongsToDefaultInstitution;

    protected $guarded = [];

    public function messages()
    {
        return $this->hasMany(SupportMessage::class);
    }

    public function closedBy()
    {
        return $this->belongsTo(User::class, 'closed_by');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

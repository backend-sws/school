<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\Auditable;

class Contact extends Model
{
    use Auditable;

    use BelongsToDefaultInstitution;

    protected $table = 'contact_submissions';

    public $timestamps = false;
    protected $fillable = [
        'institution_id',
        'name',
        'email',
        'mobile',
        'subject',
        'message',
        'is_read',
        'status',
    ];

    protected $casts = [
        'is_read' => 'boolean',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

}

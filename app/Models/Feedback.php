<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;
use App\Traits\Auditable;

class Feedback extends Model
{
    use Auditable;

    use BelongsToDefaultInstitution;
    protected $table = 'feedbacks';

    protected $fillable = [
        'institution_id',
        'user_id',
        'name',
        'email',
        'mobile',
        'subject',
        'message',
        'rating',
        'status',
        'is_read',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'rating' => 'integer',
    ];


}

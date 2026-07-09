<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;
use App\Traits\Auditable;

class Notice extends Model
{
    use Auditable;

    use BelongsToDefaultInstitution;

    protected $guarded = [];



    public function targets()
    {
        return $this->hasMany(NoticeTarget::class, 'notice_id');
    }


    protected $casts = [
        'created_at' => 'datetime:Y-m-d H:i:s',
        'updated_at' => 'datetime:Y-m-d H:i:s',
        'is_published' => 'boolean',
        'final_publish' => 'boolean',
        'scheduled_at' => 'datetime:Y-m-d H:i:s',
        'published_at' => 'datetime:Y-m-d H:i:s',
        'expired_at' => 'datetime:Y-m-d H:i:s',
    ];

}

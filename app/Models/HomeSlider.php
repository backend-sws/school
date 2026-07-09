<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\Auditable;

class HomeSlider extends Model
{
    use Auditable;

    use BelongsToDefaultInstitution;

    public $timestamps = false;
    protected $table = 'home_sliders';

    protected $fillable = ['institution_id', 'title', 'description', 'image_url', 'button_caption', 'button_url', 'status', 'sort_order', 'created_by'];

    protected $casts = [
        'sort_order' => 'integer',
        'status' => 'integer',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

}

<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\Auditable;

class GalleryImage extends Model
{
    use Auditable, BelongsToDefaultInstitution;

    protected $table = 'gallery_images';

    public $timestamps = false;
    protected $fillable = [
        'institution_id',
        'gallery_id',
        'media_type',
        'image_url',
        'caption',
        'sort_order',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    public function gallery(): BelongsTo
    {
        return $this->belongsTo(Gallery::class);
    }


}

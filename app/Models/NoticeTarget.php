<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NoticeTarget extends Model
{
    protected $guarded = [];
    protected $casts = [
        'created_at' => 'datetime:Y-m-d H:i:s',
        'updated_at' => 'datetime:Y-m-d H:i:s',
    ];

    // Relationship with Stream
    public function stream()
    {
        return $this->belongsTo(Stream::class, 'stream_id');
    }

    // Relationship with Session
    public function session()
    {
        return $this->belongsTo(Session::class, 'session_id');
    }
    public function notice()
    {
        return $this->belongsTo(Notice::class);
    }

    public function targetable()
    {
        return $this->morphTo();
    }
}

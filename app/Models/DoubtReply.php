<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DoubtReply extends Model
{
    protected $table = 'doubt_replies';

    protected $fillable = [
        'doubt_thread_id',
        'user_id',
        'body',
        'is_accepted',
        'upvotes',
    ];

    protected $casts = [
        'is_accepted' => 'boolean',
        'upvotes' => 'integer',
    ];

    public function thread(): BelongsTo
    {
        return $this->belongsTo(DoubtThread::class, 'doubt_thread_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function markAccepted(): void
    {
        // Un-accept all other replies for this thread
        self::where('doubt_thread_id', $this->doubt_thread_id)
            ->where('id', '!=', $this->id)
            ->update(['is_accepted' => false]);

        $this->update(['is_accepted' => true]);
        $this->thread->update(['status' => 'answered']);
    }
}

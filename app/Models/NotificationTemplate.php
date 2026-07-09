<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotificationTemplate extends Model
{
    protected $fillable = [
        'key',
        'channel',
        'name',
        'subject',
        'content',
        'provider_template_id',
        'variables',
        'is_active',
    ];

    protected $casts = [
        'variables' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Render the template by replacing {variable} placeholders.
     */
    public function render(array $data): string
    {
        $message = $this->content;

        foreach ($data as $key => $value) {
            $message = str_replace('{' . $key . '}', (string) $value, $message);
        }

        return $message;
    }

    /**
     * Find an active template by key + channel.
     */
    public static function findByKeyAndChannel(string $key, string $channel): ?self
    {
        return static::where('key', $key)
            ->where('channel', $channel)
            ->where('is_active', true)
            ->first();
    }

    /**
     * Get all active templates for a notification key (all channels).
     */
    public static function allForKey(string $key): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('key', $key)->where('is_active', true)->get();
    }
}

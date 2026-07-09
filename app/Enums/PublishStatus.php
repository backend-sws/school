<?php

namespace App\Enums;

/**
 * Generic publish status for content (galleries, sliders, news, tickers, etc.)
 * API/frontend uses string; DB stores int (seq after 100). Extend MAP to add new statuses.
 */
final class PublishStatus
{
    public const DRAFT = 100;
    public const PUBLISHED = 101;
    public const ARCHIVED = 102;
    public const SCHEDULED = 103;

    /** @var array<string, int> Extend this map to add new statuses */
    private static array $stringToInt = [
        'draft' => self::DRAFT,
        'published' => self::PUBLISHED,
        'archived' => self::ARCHIVED,
        'scheduled' => self::SCHEDULED,
    ];

    public static function fromString(?string $value): int
    {
        if ($value !== null && isset(self::$stringToInt[$value])) {
            return self::$stringToInt[$value];
        }
        return self::DRAFT;
    }

    public static function toString(int $value): string
    {
        $intToString = array_flip(self::$stringToInt);
        return $intToString[$value] ?? 'draft';
    }
}

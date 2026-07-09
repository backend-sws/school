<?php

namespace App\Enums;

enum ScopeType: string
{
    case GLOBAL = 'global';
    case ORGANIZATION = 'organization';
    case INSTITUTION = 'institution';

    public function label(): string
    {
        return match ($this) {
            self::GLOBAL => 'Global',
            self::ORGANIZATION => 'Organization',
            self::INSTITUTION => 'Institution',
        };
    }

    /** Check if this scope type points to an entity (has a scope_id). */
    public function hasEntity(): bool
    {
        return $this !== self::GLOBAL;
    }

    /** @return list<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}

<?php

namespace App\Enums;

enum LocationType: string
{
    case RURAL = 'rural';
    case URBAN = 'urban';

    public function label(): string
    {
        return match ($this) {
            self::RURAL => 'Rural',
            self::URBAN => 'Urban',
        };
    }

    /** @return list<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}

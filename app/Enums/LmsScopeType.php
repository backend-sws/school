<?php

namespace App\Enums;

enum LmsScopeType: string
{
    case GLOBAL = 'global';
    case DEPARTMENT = 'department';
    case STREAM = 'stream';
    case SESSION = 'session';

    /** @return list<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}

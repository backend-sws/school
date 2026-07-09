<?php

namespace App\Enums;

enum InstitutionType: string
{
    case SCHOOL = 'school';
    case COLLEGE = 'college';
    case COACHING = 'coaching';
    case UNIVERSITY = 'university';

    public function label(): string
    {
        return match ($this) {
            self::SCHOOL => 'School',
            self::COLLEGE => 'College',
            self::COACHING => 'Coaching',
            self::UNIVERSITY => 'University',
        };
    }

    /** @return list<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}

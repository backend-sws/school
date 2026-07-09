<?php

namespace App\Enums;

enum AppointmentType: string
{
    case REGULAR = 'regular';
    case CONTRACT = 'contract';
    case PART_TIME = 'part_time';
    case GUEST = 'guest';
    case PARA_TEACHER = 'para_teacher';

    public function label(): string
    {
        return match ($this) {
            self::REGULAR => 'Regular',
            self::CONTRACT => 'Contractual',
            self::PART_TIME => 'Part-Time',
            self::GUEST => 'Guest Faculty',
            self::PARA_TEACHER => 'Para-Teacher',
        };
    }

    /** @return list<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}

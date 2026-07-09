<?php

namespace App\Enums;

enum TransportMode: string
{
    case SCHOOL_BUS = 'school_bus';
    case PUBLIC_TRANSPORT = 'public_transport';
    case PRIVATE_VEHICLE = 'private_vehicle';
    case BICYCLE = 'bicycle';
    case ON_FOOT = 'on_foot';
    case OTHER = 'other';

    public function label(): string
    {
        return match ($this) {
            self::SCHOOL_BUS => 'School Bus',
            self::PUBLIC_TRANSPORT => 'Public Transport',
            self::PRIVATE_VEHICLE => 'Private Vehicle',
            self::BICYCLE => 'Bicycle',
            self::ON_FOOT => 'On Foot',
            self::OTHER => 'Other',
        };
    }

    /** @return list<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}

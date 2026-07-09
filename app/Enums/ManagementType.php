<?php

namespace App\Enums;

enum ManagementType: string
{
    case GOVERNMENT = 'government';
    case PRIVATE_UNAIDED = 'private_unaided';
    case PRIVATE_AIDED = 'private_aided';
    case CENTRAL_GOVT = 'central_govt';
    case LOCAL_BODY = 'local_body';
    case OTHER = 'other';

    public function label(): string
    {
        return match ($this) {
            self::GOVERNMENT => 'Government',
            self::PRIVATE_UNAIDED => 'Private Unaided',
            self::PRIVATE_AIDED => 'Private Aided',
            self::CENTRAL_GOVT => 'Central Government',
            self::LOCAL_BODY => 'Local Body',
            self::OTHER => 'Other',
        };
    }

    /** @return list<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}

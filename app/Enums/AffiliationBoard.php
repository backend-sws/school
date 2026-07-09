<?php

namespace App\Enums;

enum AffiliationBoard: string
{
    case CBSE = 'cbse';
    case ICSE = 'icse';
    case STATE = 'state';
    case NIOS = 'nios';
    case IB = 'ib';
    case CAMBRIDGE = 'cambridge';
    case OTHER = 'other';

    public function label(): string
    {
        return match ($this) {
            self::CBSE => 'CBSE',
            self::ICSE => 'ICSE',
            self::STATE => 'State Board',
            self::NIOS => 'NIOS',
            self::IB => 'International Baccalaureate',
            self::CAMBRIDGE => 'Cambridge (IGCSE)',
            self::OTHER => 'Other',
        };
    }

    /** @return list<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}

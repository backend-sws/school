<?php

namespace App\Enums;

enum MediumOfInstruction: string
{
    case HINDI = 'hindi';
    case ENGLISH = 'english';
    case REGIONAL = 'regional';
    case BILINGUAL = 'bilingual';
    case OTHER = 'other';

    public function label(): string
    {
        return match ($this) {
            self::HINDI => 'Hindi',
            self::ENGLISH => 'English',
            self::REGIONAL => 'Regional Language',
            self::BILINGUAL => 'Bilingual',
            self::OTHER => 'Other',
        };
    }

    /** @return list<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}

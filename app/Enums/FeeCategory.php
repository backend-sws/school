<?php

namespace App\Enums;

enum FeeCategory: string
{
    case RECURRING = 'recurring';
    case ONE_TIME = 'one_time';
    case VARIABLE = 'variable';
    case MANDATORY = 'mandatory';
    case OPTIONAL = 'optional';
    case REFUNDABLE = 'refundable';
    case FINE = 'fine';
    case DISCOUNT = 'discount';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}

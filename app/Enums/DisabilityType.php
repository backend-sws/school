<?php

namespace App\Enums;

enum DisabilityType: string
{
    case VISUAL = 'visual';
    case HEARING = 'hearing';
    case SPEECH = 'speech';
    case LOCOMOTOR = 'locomotor';
    case MENTAL = 'mental';
    case MULTIPLE = 'multiple';
    case AUTISM = 'autism';
    case CEREBRAL_PALSY = 'cerebral_palsy';
    case OTHER = 'other';

    public function label(): string
    {
        return match ($this) {
            self::VISUAL => 'Visual Impairment',
            self::HEARING => 'Hearing Impairment',
            self::SPEECH => 'Speech Impairment',
            self::LOCOMOTOR => 'Locomotor Disability',
            self::MENTAL => 'Mental Illness',
            self::MULTIPLE => 'Multiple Disabilities',
            self::AUTISM => 'Autism Spectrum',
            self::CEREBRAL_PALSY => 'Cerebral Palsy',
            self::OTHER => 'Other',
        };
    }

    /** @return list<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}

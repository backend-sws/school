<?php

namespace App\Enums;

/**
 * Fee structure slot: which applicability variant applies (profile type, category, or gender).
 * When fee_structures.fee_slot is null = default for the class.
 * When set = override for that slot (e.g. RTE waiver, EWS rate, gender-specific).
 */
enum FeeSlot: string
{
    case DEFAULT = 'default';

    // Profile type
    case STANDARD = 'standard';
    case WAIVER = 'waiver';

    // Category (reservation/social)
    case GENERAL = 'general';
    case OBC = 'obc';
    case SC = 'sc';
    case ST = 'st';
    case EWS = 'ews';
    case RTE = 'rte';

    // Gender
    case MALE = 'male';
    case FEMALE = 'female';
    case OTHER = 'other';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /** Slots that are profile-type options (for UI grouping). */
    public static function profileTypes(): array
    {
        return [self::DEFAULT, self::STANDARD, self::WAIVER];
    }

    /** Slots that are category options (for UI grouping). */
    public static function categories(): array
    {
        return [self::GENERAL, self::OBC, self::SC, self::ST, self::EWS, self::RTE];
    }

    /** Slots that are gender options (for UI grouping). */
    public static function genders(): array
    {
        return [self::MALE, self::FEMALE, self::OTHER];
    }

    /**
     * Resolve a profile category string (e.g. from student_profile.category) to a FeeSlot or null.
     * Returns null for default/unknown so ledger falls back to default fee structure.
     */
    public static function resolveFromProfile(?string $category): ?self
    {
        if ($category === null || $category === '') {
            return null;
        }
        $normalized = strtolower(trim($category));
        if ($normalized === '' || $normalized === 'default') {
            return null;
        }
        foreach (self::cases() as $case) {
            if ($case->value === $normalized) {
                return $case;
            }
        }
        return match (true) {
            str_contains($normalized, 'rte') => self::RTE,
            str_contains($normalized, 'ews') => self::EWS,
            str_contains($normalized, 'sc') => self::SC,
            str_contains($normalized, 'st') => self::ST,
            str_contains($normalized, 'obc') => self::OBC,
            str_contains($normalized, 'bc') => self::OBC,
            str_contains($normalized, 'general') => self::GENERAL,
            default => null,
        };
    }

    /**
     * Resolve a gender string (e.g. from student_profile.gender) to a FeeSlot or null.
     */
    public static function resolveFromGender(?string $gender): ?self
    {
        if ($gender === null || $gender === '') {
            return null;
        }
        $normalized = strtolower(trim($gender));
        return match (true) {
            $normalized === 'male' => self::MALE,
            $normalized === 'female' => self::FEMALE,
            in_array($normalized, ['other', 'transgender', 'tg'], true) => self::OTHER,
            default => null,
        };
    }

    /** Human-readable label for dropdown/list. */
    public function label(): string
    {
        return match ($this) {
            self::DEFAULT => 'Default',
            self::STANDARD => 'Standard',
            self::WAIVER => 'Waiver',
            self::GENERAL => 'General',
            self::OBC => 'OBC',
            self::SC => 'SC',
            self::ST => 'ST',
            self::EWS => 'EWS',
            self::RTE => 'RTE',
            self::MALE => 'Male',
            self::FEMALE => 'Female',
            self::OTHER => 'Other',
        };
    }
}

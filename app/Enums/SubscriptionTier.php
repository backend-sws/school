<?php

namespace App\Enums;

enum SubscriptionTier: string
{
    case STARTER = 'starter';
    case PROFESSIONAL = 'professional';
    case ENTERPRISE = 'enterprise';
    case PLUS = 'plus';

    public function label(): string
    {
        return match ($this) {
            self::STARTER => 'Foundation',
            self::PROFESSIONAL => 'Professional',
            self::ENTERPRISE => 'Enterprise',
            self::PLUS => 'Institution Plus',
        };
    }

    /** Maximum institutions included in this tier. */
    public function maxInstitutions(): int
    {
        return match ($this) {
            self::STARTER => 1,
            self::PROFESSIONAL => 5,
            self::ENTERPRISE => 20,
            self::PLUS => PHP_INT_MAX,
        };
    }

    /** Maximum total users (students + staff) across all institutions. */
    public function maxUsers(): int
    {
        return match ($this) {
            self::STARTER => 100,
            self::PROFESSIONAL => PHP_INT_MAX,
            self::ENTERPRISE => PHP_INT_MAX,
            self::PLUS => PHP_INT_MAX,
        };
    }

    /** Maximum staff accounts. */
    public function maxStaff(): int
    {
        return match ($this) {
            self::STARTER => 5,
            self::PROFESSIONAL => 50,
            self::ENTERPRISE => PHP_INT_MAX,
            self::PLUS => PHP_INT_MAX,
        };
    }

    /** Maximum emails per month. */
    public function maxEmailsPerMonth(): int
    {
        return match ($this) {
            self::STARTER => 500,
            self::PROFESSIONAL => 10000,
            self::ENTERPRISE => PHP_INT_MAX,
            self::PLUS => PHP_INT_MAX,
        };
    }

    /** Storage quota in GB. */
    public function storageQuotaGb(): int
    {
        return match ($this) {
            self::STARTER => 1,
            self::PROFESSIONAL => 25,
            self::ENTERPRISE => 100,
            self::PLUS => 500,
        };
    }

    /** Monthly price in INR. 0 = free, -1 = custom. */
    public function monthlyPriceInr(): int
    {
        return match ($this) {
            self::STARTER => 1499,
            self::PROFESSIONAL => 3999,
            self::ENTERPRISE => 7999,
            self::PLUS => 14999,
        };
    }

    /** Annual price per month in INR. */
    public function annualPricePerMonthInr(): int
    {
        return match ($this) {
            self::STARTER => 1249,
            self::PROFESSIONAL => 3332,
            self::ENTERPRISE => 6666,
            self::PLUS => 12499,
        };
    }

    /**
     * Human-readable feature highlights for the pricing card.
     * @return list<string>
     */
    public function highlights(): array
    {
        return match ($this) {
            self::STARTER => [
                'Up to 100 Students',
                'Basic Academic Hub',
                'Manual Fee Tracking',
                'Standard Support',
            ],
            self::PROFESSIONAL => [
                'Unlimited Students',
                'Full Financial Terminal',
                'Analytics Suite',
                'Advanced Operations',
                'Priority Email Support',
            ],
            self::ENTERPRISE => [
                'Multi-Organization Support',
                'Dedicated Success Manager',
                'SSO & Advanced Security',
                'API Access',
                'Custom Onboarding',
            ],
            self::PLUS => [
                'All Enterprise Features',
                'White-label Branding',
                'High Priority 24/7 SLA',
                'On-premise deployment option',
            ],
        };
    }

    /** Price display string for the pricing card. */
    public function priceDisplay(): string
    {
        return '₹' . number_format($this->monthlyPriceInr());
    }

    /**
     * Modules accessible at this tier.
     * @return list<string>
     */
    public function modules(): array
    {
        $foundation = [
            'core',
            'dashboard',
            'academics',
            'student_portal',
            'notifications_basic',
        ];

        $professional = [
            'lms',
            'fee_management',
            'admissions',
            'certificates',
            'library',
            'grievances',
            'website_cms',
            'notifications_push',
            'inventory',
            'transport',
            'hostel',
            'advanced_analytics',
            'question_bank',
        ];

        $enterprise = [
            'multi_campus',
            'training_placement',
            'white_label',
            'api_access',
            'sso',
        ];

        return match ($this) {
            self::STARTER => $foundation,
            self::PROFESSIONAL => array_merge($foundation, $professional),
            self::ENTERPRISE => array_merge($foundation, $professional, $enterprise),
            self::PLUS => array_merge($foundation, $professional, $enterprise, ['on_premise', 'white_label_plus']),
        };
    }

    /** Check if a specific module is accessible at this tier. */
    public function hasModule(string $module): bool
    {
        return in_array($module, $this->modules(), true);
    }

    /**
     * Get all limits as a key-value array.
     */
    public function limits(): array
    {
        return [
            'institutions' => $this->maxInstitutions(),
            'users' => $this->maxUsers(),
            'staff' => $this->maxStaff(),
            'emails' => $this->maxEmailsPerMonth(),
            'storage' => $this->storageQuotaGb(),
        ];
    }

    /** Price for monthly billing. */
    public function monthlyPrice(): int
    {
        return $this->monthlyPriceInr();
    }

    /** Total price for annual billing. */
    public function annualPrice(): int
    {
        $perMonth = $this->annualPricePerMonthInr();
        return $perMonth > 0 ? $perMonth * 12 : $perMonth;
    }

    /** @return list<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}

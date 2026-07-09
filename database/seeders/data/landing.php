<?php

/**
 * Landing page content data.
 * Used by MainLandingController to render the product landing page.
 */
return [
    'hero' => [
        'badge' => 'Operations Integrated',
        'title' => 'The Operating System for Modern Education.',
        'description' => 'A clinical, high-performance platform designed to automate administrative workflows, scale institutional governance, and provide 360° operational visibility.',
        'cta_primary' => 'Launch Free Instance',
        'cta_secondary' => 'Request Demo',
    ],
    'stats' => [
        ['label' => 'Active Students', 'value' => 24800, 'icon' => 'Users', 'suffix' => '+'],
        ['label' => 'Partner Schools', 'value' => 500, 'icon' => 'Building2', 'suffix' => '+'],
        ['label' => 'Transactions', 'value' => 1200000, 'icon' => 'ReceiptIndianRupee', 'suffix' => '+', 'prefix' => '₹'],
        ['label' => 'Audit Score', 'value' => 99, 'icon' => 'ShieldCheck', 'suffix' => '%'],
    ],
    'audience' => [
        [
            'title' => 'Schools (K-12)',
            'description' => 'Comprehensive management for CBSE, ICSE, and state boards with strict academic compliance.',
            'icon' => 'School',
        ],
        [
            'title' => 'Colleges & Universities',
            'description' => 'Scalable infrastructure for higher education, from autonomous colleges to large university systems.',
            'icon' => 'University',
        ],
        [
            'title' => 'Coaching Institutes',
            'description' => 'High-performance tools for test prep centers and skill-development workshops.',
            'icon' => 'Zap',
        ],
        [
            'title' => 'Multi-Campus Groups',
            'description' => 'Centralized governance for educational chains and multi-state institutional networks.',
            'icon' => 'Globe',
        ],
    ],
    'features' => [
        [
            'title' => 'Academic Automation',
            'description' => 'Automated scheduling, precision attendance tracking, and advanced timetable generation that eliminates conflicts before they happen.',
            'icon' => 'LayoutDashboard',
            'category' => 'Core',
            'stat' => ['value' => '98%', 'label' => 'Schedule accuracy'],
            'highlights' => [
                'Auto-resolve timetable conflicts across departments',
                'Biometric & geo-fenced attendance with real-time sync',
                'Exam scheduling with hall & invigilator allocation',
                'Grade-book analytics with student performance trends',
            ],
        ],
        [
            'title' => 'Digital Treasury',
            'description' => 'Eliminate revenue leakage with automated fee ledgers, multi-gateway payments, and real-time bank reconciliation.',
            'icon' => 'ReceiptIndianRupee',
            'category' => 'Finance',
            'stat' => ['value' => '₹0', 'label' => 'Fee leakage'],
            'highlights' => [
                'Auto-generated fee challans & due reminders',
                'Real-time ledger reconciliation with bank feeds',
                'Multi-gateway (UPI, cards, net banking) collection',
            ],
        ],
        [
            'title' => 'Operational Wing',
            'description' => 'Total control over inventory, transport routes, and library logistics — all from a single unified interface.',
            'icon' => 'Layers',
            'category' => 'Logistics',
            'stat' => ['value' => '3x', 'label' => 'Faster ops'],
            'highlights' => [
                'GPS-tracked transport with live parent updates',
                'Barcode-driven inventory & asset management',
                'Library catalog with digital lending workflows',
            ],
        ],
        [
            'title' => 'Enterprise Governance',
            'description' => 'Manage hundreds of institutions with hierarchical role controls and unified cross-campus reporting dashboards.',
            'icon' => 'Globe',
            'category' => 'Scale',
            'stat' => ['value' => '500+', 'label' => 'Institutions'],
            'highlights' => [
                'Hierarchical role-based access across campuses',
                'Consolidated cross-institution analytics',
                'Centralized policy enforcement & audit trails',
            ],
        ],
        [
            'title' => 'Audit & Compliance',
            'description' => 'Every transaction logged, every action verified. Institutional transparency built into every workflow.',
            'icon' => 'ShieldCheck',
            'category' => 'Security',
            'stat' => ['value' => '99%', 'label' => 'Audit score'],
            'highlights' => [
                'Immutable transaction logs with full audit trail',
                'Automated compliance checks per regulatory board',
                'Role-based approval workflows for sensitive ops',
            ],
        ],
        [
            'title' => 'Unified Experience',
            'description' => 'Single sign-on, consolidated communications, and a unified portal for students, parents, and staff.',
            'icon' => 'Sparkles',
            'category' => 'Platform',
            'stat' => ['value' => '1', 'label' => 'Login for all'],
            'highlights' => [
                'SSO across web, mobile, and kiosk interfaces',
                'Push, email, SMS — one notification engine',
                'Parent portal with real-time academic feeds',
            ],
        ],
    ],
    'testimonials' => [
        [
            'quote' => 'Rishi Vidya has completely transformed our multi-campus operations. The governance tools are surgical in their precision.',
            'name' => 'Dr. Arvind Sharma',
            'role' => 'Director',
            'institution' => 'Global Academy Group',
        ],
        [
            'quote' => 'The financial automation alone saved us 15% in operational overhead in the first quarter.',
            'name' => 'Meera Iyer',
            'role' => 'Administrator',
            'institution' => 'St. Mary\'s College',
        ],
        [
            'quote' => 'Finally, an OS that actually understands the complexities of Indian educational institutions.',
            'name' => 'Rahul Verma',
            'role' => 'Chairman',
            'institution' => 'Verma Education Chain',
        ],
        [
            'quote' => 'Our admission cycle went from 3 weeks to 3 days. The parents love the transparent portal.',
            'name' => 'Priya Nair',
            'role' => 'Principal',
            'institution' => 'Sunrise International School',
        ],
        [
            'quote' => 'Fee reconciliation used to take our finance team an entire week. Now it happens in real-time.',
            'name' => 'Sanjay Gupta',
            'role' => 'CFO',
            'institution' => 'Vidya Bharati Trust',
        ],
        [
            'quote' => 'The attendance system with geo-fencing finally solved our proxy attendance problem across campuses.',
            'name' => 'Dr. Lakshmi Rao',
            'role' => 'Vice Chancellor',
            'institution' => 'Southern State University',
        ],
    ],
    'results' => [
        [
            'metric' => '90%',
            'label' => 'Reduction in Paperwork',
            'description' => 'From manual records to fully digital audit-ready workflows.',
        ],
        [
            'metric' => '3x',
            'label' => 'Faster Admissions',
            'description' => 'Streamlined processing from application to final enrollment.',
        ],
        [
            'metric' => '₹0',
            'label' => 'Fee Leakage',
            'description' => '100% reconciliation of every transaction across all branches.',
        ],
    ],
    'plans' => [
        [
            'name' => 'Starter',
            'monthly' => '₹1,499',
            'annual' => '₹1,249',
            'is_popular' => false,
            'limits' => [
                ['label' => 'Institutions', 'value' => '1'],
                ['label' => 'Users (total)', 'value' => '200'],
                ['label' => 'Staff accounts', 'value' => '5'],
                ['label' => 'Emails/month', 'value' => '1,000'],
                ['label' => 'Storage', 'value' => '2 GB'],
            ],
            'modules' => [
                ['name' => 'Core Platform & Dashboard', 'included' => true],
                ['name' => 'Academics & LMS', 'included' => true],
                ['name' => 'Fee Management', 'included' => true],
                ['name' => 'Student Portal (basic)', 'included' => true],
                ['name' => 'Notifications (email + in-app)', 'included' => true],
                ['name' => 'Admissions', 'included' => false],
                ['name' => 'Certificates', 'included' => false],
            ],
        ],
        [
            'name' => 'Professional',
            'monthly' => '₹3,999',
            'annual' => '₹3,332',
            'is_popular' => true,
            'limits' => [
                ['label' => 'Institutions', 'value' => '3'],
                ['label' => 'Users (total)', 'value' => '1,000'],
                ['label' => 'Staff accounts', 'value' => '20'],
                ['label' => 'Emails/month', 'value' => '5,000'],
                ['label' => 'Storage', 'value' => '10 GB'],
            ],
            'modules' => [
                ['name' => 'Core Platform & Dashboard', 'included' => true],
                ['name' => 'Academics & LMS', 'included' => true],
                ['name' => 'Fee Management', 'included' => true],
                ['name' => 'Notifications (email + in-app)', 'included' => true],
                ['name' => 'Admissions', 'included' => true],
                ['name' => 'Certificates', 'included' => true],
                ['name' => 'WebPush Notifications', 'included' => true],
            ],
        ],
        [
            'name' => 'Enterprise',
            'monthly' => '₹7,999',
            'annual' => '₹6,666',
            'is_popular' => false,
            'limits' => [
                ['label' => 'Institutions', 'value' => '10'],
                ['label' => 'Users (total)', 'value' => '5,000'],
                ['label' => 'Staff accounts', 'value' => 'Unlimited'],
                ['label' => 'Emails/month', 'value' => '20,000'],
                ['label' => 'Storage', 'value' => '50 GB'],
            ],
            'modules' => [
                ['name' => 'Everything in Professional', 'included' => true],
                ['name' => 'Inventory & Sales', 'included' => true],
                ['name' => 'Transport', 'included' => true],
                ['name' => 'Training & Placement', 'included' => true],
                ['name' => 'Multi-campus management', 'included' => false],
                ['name' => 'White-label branding', 'included' => false],
            ],
        ],
        [
            'name' => 'Plus',
            'monthly' => '₹14,999',
            'annual' => '₹12,499',
            'is_popular' => false,
            'limits' => [
                ['label' => 'Institutions', 'value' => 'Unlimited'],
                ['label' => 'Users (total)', 'value' => 'Unlimited'],
                ['label' => 'Staff accounts', 'value' => 'Unlimited'],
                ['label' => 'Emails/month', 'value' => 'Unlimited'],
                ['label' => 'Storage', 'value' => '200 GB'],
            ],
            'modules' => [
                ['name' => 'Everything in Enterprise', 'included' => true],
                ['name' => 'Multi-campus management', 'included' => true],
                ['name' => 'White-label branding', 'included' => true],
                ['name' => 'API access', 'included' => true],
                ['name' => 'Priority 24/7 Support', 'included' => true],
            ],
        ],
    ],
    'addOns' => [
        ['name' => 'Extra Institution', 'price' => '₹999/mo each', 'icon' => 'Building2'],
        ['name' => 'SMS Notifications', 'price' => '₹499/mo + cost', 'icon' => 'Zap'],
        ['name' => 'Payment Gateway', 'price' => '₹999/mo + 2%', 'icon' => 'ReceiptIndianRupee'],
        ['name' => 'Custom Domain', 'price' => '₹499/mo', 'icon' => 'Globe'],
    ],
    'onboardingSteps' => [
        [
            'step'        => 1,
            'title'       => 'Create Your Account',
            'description' => 'Sign up with your name, email, and password. Takes 30 seconds.',
            'icon'        => 'User',
            'route'       => '/register',
        ],
        [
            'step'        => 2,
            'title'       => 'Verify Your Email',
            'description' => 'Click the verification link sent to your inbox.',
            'icon'        => 'MailCheck',
            'route'       => '/onboarding/verify-notice',
        ],
        [
            'step'        => 3,
            'title'       => 'Choose Your Plan',
            'description' => 'Pick from Starter, Professional, Enterprise, or Plus — all with a 14-day free trial.',
            'icon'        => 'CreditCard',
            'route'       => '/onboarding/plan',
        ],
        [
            'step'        => 4,
            'title'       => 'Payment Details',
            'description' => 'Add a card for future billing. You won\'t be charged now. This step can be skipped.',
            'icon'        => 'Wallet',
            'route'       => '/onboarding/card',
        ],
        [
            'step'        => 5,
            'title'       => 'Setup Your Organization',
            'description' => 'Enter your institution name, type, location, and choose a brand theme.',
            'icon'        => 'Building2',
            'route'       => '/onboarding/setup',
        ],
        [
            'step'        => 6,
            'title'       => 'Import Your Data',
            'description' => 'Auto-seed defaults or upload your own data via Excel templates.',
            'icon'        => 'Upload',
            'route'       => '/onboarding/data-import',
        ],
        [
            'step'        => 7,
            'title'       => 'Go Live!',
            'description' => 'Your platform is provisioned. Start managing your institution immediately.',
            'icon'        => 'Rocket',
            'route'       => '/onboarding/platform-setup',
        ],
    ],
    'faqs' => [
        [
            'question' => 'How secure is our institutional data?',
            'answer' => 'We employ bank-grade encryption, regular security audits, and dedicated storage volumes for each organization to ensure maximum data isolation and protection.',
        ],
        [
            'question' => 'Can we manage multiple campuses?',
            'answer' => 'Yes, our Escalable Governance module is explicitly built for multi-campus management with centralized oversight and individual campus autonomy.',
        ],
        [
            'question' => 'Do you provide migration assistance?',
            'answer' => 'Absolutely. Our engineering team assists in migrating data from legacy ERPs, spreadsheets, or other platforms with zero data loss.',
        ],
        [
            'question' => 'Is there a limit on student records?',
            'answer' => 'Each plan has a defined user limit. If you exceed the Enterprise limits, the Plus plan offers unlimited student records.',
        ],
        [
            'question' => 'How long does the initial setup take?',
            'answer' => 'Most institutions are fully operational within 48 hours. Our onboarding wizard guides you through academic structure, fee configuration, and user setup step by step.',
        ],
        [
            'question' => 'Can we customize the platform to match our branding?',
            'answer' => 'The Plus plan includes full white-label branding — custom domain, logo, colors, and email templates. Professional and Enterprise plans also support basic theme customization.',
        ],
        [
            'question' => 'What kind of support is available?',
            'answer' => 'All plans include email and in-app support. Professional plans get priority response within 4 hours. Enterprise and Plus plans have dedicated account managers and 24/7 phone support.',
        ],
        [
            'question' => 'Do you offer a free trial?',
            'answer' => 'Yes, every plan includes a 14-day free trial with full access to all features. No credit card required to get started.',
        ],
    ],
];

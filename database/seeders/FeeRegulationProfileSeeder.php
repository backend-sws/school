<?php

namespace Database\Seeders;

use App\Models\FeeRegulationProfile;
use App\Models\FeeRegulationProfileItem;
use App\Models\FeeType;
use App\Models\Institution;
use App\Models\Stream;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FeeRegulationProfileSeeder extends Seeder
{
    public function run(): void
    {
        $institutions = Institution::all();

        if ($institutions->isEmpty()) {
            $this->command->warn('No institutions found. Skipping FeeRegulationProfileSeeder.');
            return;
        }

        foreach ($institutions as $institution) {
            $this->command->info("Seeding Fee Profiles for Institution #{$institution->id} ({$institution->name})...");
            $this->seedForInstitution($institution->id);
        }

        $this->command->info('✅ Fee Regulation Profiles seeded successfully!');
    }

    public function seedForInstitution(int $institutionId): void
    {
        // 1. Create standard fee types
        $feeTypeDefs = [
            ['name' => 'Admission Fee',            'category' => 'one_time',  'display_order' => 1],
            ['name' => 'Registration Fee',         'category' => 'one_time',  'display_order' => 2],
            ['name' => 'Annual Development Fee',   'category' => 'one_time',  'display_order' => 3],
            ['name' => 'Tuition Fee',              'category' => 'recurring', 'display_order' => 4],
            ['name' => 'Examination Fee',          'category' => 'recurring', 'display_order' => 5],
            ['name' => 'Computer / ICT Fee',       'category' => 'recurring', 'display_order' => 6],
            ['name' => 'Sports & Activity Fee',    'category' => 'recurring', 'display_order' => 7],
            ['name' => 'Science Lab Fee',          'category' => 'recurring', 'display_order' => 8],
        ];

        $feeTypes = [];
        foreach ($feeTypeDefs as $def) {
            $feeTypes[$def['name']] = FeeType::withoutGlobalScope('institution_scope')->updateOrCreate(
                ['institution_id' => $institutionId, 'name' => $def['name']],
                [
                    'category'      => $def['category'],
                    'display_order' => $def['display_order'],
                ]
            );
        }

        // 2. Profile Definitions for all standard classes
        $profilesConfig = [
            // Pre-Primary
            [
                'name' => 'Nursery Fee Profile',
                'profile_type' => 'NUR',
                'description' => 'Fee structure for Nursery / Pre-KG',
                'is_default' => false,
                'items' => [
                    ['fee' => 'Admission Fee', 'amount' => 5000],
                    ['fee' => 'Registration Fee', 'amount' => 1000],
                    ['fee' => 'Tuition Fee', 'amount' => 1500],
                    ['fee' => 'Sports & Activity Fee', 'amount' => 300],
                ],
            ],
            [
                'name' => 'LKG Fee Profile',
                'profile_type' => 'LKG',
                'description' => 'Fee structure for Lower KG',
                'is_default' => false,
                'items' => [
                    ['fee' => 'Admission Fee', 'amount' => 5000],
                    ['fee' => 'Registration Fee', 'amount' => 1000],
                    ['fee' => 'Tuition Fee', 'amount' => 1600],
                    ['fee' => 'Sports & Activity Fee', 'amount' => 300],
                ],
            ],
            [
                'name' => 'UKG Fee Profile',
                'profile_type' => 'UKG',
                'description' => 'Fee structure for Upper KG',
                'is_default' => false,
                'items' => [
                    ['fee' => 'Admission Fee', 'amount' => 5000],
                    ['fee' => 'Registration Fee', 'amount' => 1000],
                    ['fee' => 'Tuition Fee', 'amount' => 1800],
                    ['fee' => 'Sports & Activity Fee', 'amount' => 300],
                ],
            ],

            // Primary Classes (I - V)
            [
                'name' => 'Class I Fee Profile',
                'profile_type' => 'I',
                'description' => 'Standard fee structure for Class 1',
                'is_default' => false,
                'items' => [
                    ['fee' => 'Admission Fee', 'amount' => 6000],
                    ['fee' => 'Annual Development Fee', 'amount' => 1500],
                    ['fee' => 'Tuition Fee', 'amount' => 2000],
                    ['fee' => 'Examination Fee', 'amount' => 400],
                    ['fee' => 'Computer / ICT Fee', 'amount' => 250],
                ],
            ],
            [
                'name' => 'Class II Fee Profile',
                'profile_type' => 'II',
                'description' => 'Standard fee structure for Class 2',
                'is_default' => false,
                'items' => [
                    ['fee' => 'Admission Fee', 'amount' => 6000],
                    ['fee' => 'Annual Development Fee', 'amount' => 1500],
                    ['fee' => 'Tuition Fee', 'amount' => 2100],
                    ['fee' => 'Examination Fee', 'amount' => 400],
                    ['fee' => 'Computer / ICT Fee', 'amount' => 250],
                ],
            ],
            [
                'name' => 'Class III Fee Profile',
                'profile_type' => 'III',
                'description' => 'Standard fee structure for Class 3',
                'is_default' => false,
                'items' => [
                    ['fee' => 'Admission Fee', 'amount' => 6000],
                    ['fee' => 'Annual Development Fee', 'amount' => 1500],
                    ['fee' => 'Tuition Fee', 'amount' => 2200],
                    ['fee' => 'Examination Fee', 'amount' => 400],
                    ['fee' => 'Computer / ICT Fee', 'amount' => 250],
                ],
            ],
            [
                'name' => 'Class IV Fee Profile',
                'profile_type' => 'IV',
                'description' => 'Standard fee structure for Class 4',
                'is_default' => false,
                'items' => [
                    ['fee' => 'Admission Fee', 'amount' => 6000],
                    ['fee' => 'Annual Development Fee', 'amount' => 1500],
                    ['fee' => 'Tuition Fee', 'amount' => 2300],
                    ['fee' => 'Examination Fee', 'amount' => 400],
                    ['fee' => 'Computer / ICT Fee', 'amount' => 250],
                ],
            ],
            [
                'name' => 'Class V Fee Profile',
                'profile_type' => 'V',
                'description' => 'Standard fee structure for Class 5',
                'is_default' => false,
                'items' => [
                    ['fee' => 'Admission Fee', 'amount' => 6000],
                    ['fee' => 'Annual Development Fee', 'amount' => 1500],
                    ['fee' => 'Tuition Fee', 'amount' => 2400],
                    ['fee' => 'Examination Fee', 'amount' => 400],
                    ['fee' => 'Computer / ICT Fee', 'amount' => 250],
                ],
            ],

            // Middle Classes (VI - VIII)
            [
                'name' => 'Class VI Fee Profile',
                'profile_type' => 'VI',
                'description' => 'Standard fee structure for Class 6',
                'is_default' => false,
                'items' => [
                    ['fee' => 'Admission Fee', 'amount' => 7000],
                    ['fee' => 'Annual Development Fee', 'amount' => 2000],
                    ['fee' => 'Tuition Fee', 'amount' => 2600],
                    ['fee' => 'Examination Fee', 'amount' => 500],
                    ['fee' => 'Computer / ICT Fee', 'amount' => 300],
                    ['fee' => 'Science Lab Fee', 'amount' => 200],
                ],
            ],
            [
                'name' => 'Class VII Fee Profile',
                'profile_type' => 'VII',
                'description' => 'Standard fee structure for Class 7',
                'is_default' => false,
                'items' => [
                    ['fee' => 'Admission Fee', 'amount' => 7000],
                    ['fee' => 'Annual Development Fee', 'amount' => 2000],
                    ['fee' => 'Tuition Fee', 'amount' => 2800],
                    ['fee' => 'Examination Fee', 'amount' => 500],
                    ['fee' => 'Computer / ICT Fee', 'amount' => 300],
                    ['fee' => 'Science Lab Fee', 'amount' => 200],
                ],
            ],
            [
                'name' => 'Class VIII Fee Profile',
                'profile_type' => 'VIII',
                'description' => 'Standard fee structure for Class 8',
                'is_default' => false,
                'items' => [
                    ['fee' => 'Admission Fee', 'amount' => 7000],
                    ['fee' => 'Annual Development Fee', 'amount' => 2000],
                    ['fee' => 'Tuition Fee', 'amount' => 3000],
                    ['fee' => 'Examination Fee', 'amount' => 500],
                    ['fee' => 'Computer / ICT Fee', 'amount' => 300],
                    ['fee' => 'Science Lab Fee', 'amount' => 200],
                ],
            ],

            // Secondary Classes (IX - X)
            [
                'name' => 'Class IX Fee Profile',
                'profile_type' => 'IX',
                'description' => 'Standard fee structure for Class 9',
                'is_default' => false,
                'items' => [
                    ['fee' => 'Admission Fee', 'amount' => 8000],
                    ['fee' => 'Annual Development Fee', 'amount' => 2500],
                    ['fee' => 'Tuition Fee', 'amount' => 3400],
                    ['fee' => 'Examination Fee', 'amount' => 600],
                    ['fee' => 'Computer / ICT Fee', 'amount' => 400],
                    ['fee' => 'Science Lab Fee', 'amount' => 400],
                ],
            ],
            [
                'name' => 'Class X Fee Profile',
                'profile_type' => 'X',
                'description' => 'Standard fee structure for Class 10',
                'is_default' => false,
                'items' => [
                    ['fee' => 'Admission Fee', 'amount' => 8000],
                    ['fee' => 'Annual Development Fee', 'amount' => 2500],
                    ['fee' => 'Tuition Fee', 'amount' => 3600],
                    ['fee' => 'Examination Fee', 'amount' => 600],
                    ['fee' => 'Computer / ICT Fee', 'amount' => 400],
                    ['fee' => 'Science Lab Fee', 'amount' => 400],
                ],
            ],

            // Senior Secondary Classes (XI - XII)
            [
                'name' => 'Class XI - Science Fee Profile',
                'profile_type' => 'XI',
                'description' => 'Fee structure for Class 11 Science Stream',
                'is_default' => false,
                'items' => [
                    ['fee' => 'Admission Fee', 'amount' => 10000],
                    ['fee' => 'Annual Development Fee', 'amount' => 3000],
                    ['fee' => 'Tuition Fee', 'amount' => 4200],
                    ['fee' => 'Examination Fee', 'amount' => 800],
                    ['fee' => 'Science Lab Fee', 'amount' => 600],
                ],
            ],
            [
                'name' => 'Class XI - Commerce Fee Profile',
                'profile_type' => 'XI',
                'description' => 'Fee structure for Class 11 Commerce Stream',
                'is_default' => false,
                'items' => [
                    ['fee' => 'Admission Fee', 'amount' => 9000],
                    ['fee' => 'Annual Development Fee', 'amount' => 3000],
                    ['fee' => 'Tuition Fee', 'amount' => 3800],
                    ['fee' => 'Examination Fee', 'amount' => 800],
                    ['fee' => 'Computer / ICT Fee', 'amount' => 500],
                ],
            ],
            [
                'name' => 'Class XII - Science Fee Profile',
                'profile_type' => 'XII',
                'description' => 'Fee structure for Class 12 Science Stream',
                'is_default' => false,
                'items' => [
                    ['fee' => 'Admission Fee', 'amount' => 10000],
                    ['fee' => 'Annual Development Fee', 'amount' => 3000],
                    ['fee' => 'Tuition Fee', 'amount' => 4500],
                    ['fee' => 'Examination Fee', 'amount' => 800],
                    ['fee' => 'Science Lab Fee', 'amount' => 600],
                ],
            ],
            [
                'name' => 'Class XII - Commerce Fee Profile',
                'profile_type' => 'XII',
                'description' => 'Fee structure for Class 12 Commerce Stream',
                'is_default' => false,
                'items' => [
                    ['fee' => 'Admission Fee', 'amount' => 9000],
                    ['fee' => 'Annual Development Fee', 'amount' => 3000],
                    ['fee' => 'Tuition Fee', 'amount' => 4000],
                    ['fee' => 'Examination Fee', 'amount' => 800],
                    ['fee' => 'Computer / ICT Fee', 'amount' => 500],
                ],
            ],

            // Master Default Fallback Profile
            [
                'name' => 'Default School Fee Profile',
                'profile_type' => 'default',
                'description' => 'Master fallback fee profile for any unmapped class or NC',
                'is_default' => true,
                'items' => [
                    ['fee' => 'Admission Fee', 'amount' => 5000],
                    ['fee' => 'Annual Development Fee', 'amount' => 1500],
                    ['fee' => 'Tuition Fee', 'amount' => 2000],
                    ['fee' => 'Examination Fee', 'amount' => 500],
                ],
            ],
        ];

        foreach ($profilesConfig as $config) {
            $profile = FeeRegulationProfile::withoutGlobalScope('institution_scope')->updateOrCreate(
                [
                    'institution_id' => $institutionId,
                    'name'           => $config['name'],
                ],
                [
                    'profile_type'             => $config['profile_type'],
                    'description'              => $config['description'],
                    'is_default'               => $config['is_default'],
                    'fee_collection_frequency' => 'monthly',
                ]
            );

            // Sync items
            foreach ($config['items'] as $item) {
                $feeTypeModel = $feeTypes[$item['fee']] ?? null;
                if ($feeTypeModel) {
                    FeeRegulationProfileItem::updateOrCreate(
                        [
                            'profile_id'  => $profile->id,
                            'fee_type_id' => $feeTypeModel->id,
                        ],
                        [
                            'amount' => $item['amount'],
                        ]
                    );
                }
            }
        }
    }
}

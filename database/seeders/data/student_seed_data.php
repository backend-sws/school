<?php

/**
 * Comprehensive student seed data — users, profiles, addresses, academic info, documents, previous exams.
 * Used by StudentSeeder. Each student can have full profile + addresses + academic_info + documents + previous_exams.
 * Optional: stream_code, session_years, section for LMS class enrollment (current session).
 *
 * Institution is determined by the seeder (e.g. PDSEDU). stream_code/session must exist for that institution.
 */
return [
    [
        'name' => 'Aarav Sharma',
        'email' => 'aarav.student@pdseducation.tech',
        'password' => 'password',
        'role' => 'student',

        'profile' => [
            'reg_no' => 'REG-PDSE-0001',
            'app_no' => 'APP-2026-001',
            'roll_no' => '1',
            'university_roll_no' => null,
            'admission_date' => '2024-04-01',
            'current_semester' => 1,
            'father_name' => 'Rajesh Sharma',
            'father_mobile' => '9876543210',
            'father_qualification' => 'B.Com',
            'father_occupation' => 'Business',
            'mother_name' => 'Sunita Sharma',
            'dob' => '2012-05-15',
            'gender' => 'Male',
            'category' => 'General',
            'religion' => 'Hindu',
            'caste' => null,
            'blood_group' => 'B+',
            'nationality' => 'Indian',
            'marital_status' => 'single',
            'mobile' => '9876500001',
            'aadhar_no' => '123456789012',
            'abc_no' => 'ABC-PDSE-001',
            'address' => 'House 12, Sector 5',
            'city' => 'Patna',
            'state' => 'Bihar',
            'pincode' => '800001',
            'verified' => true,
        ],

        'addresses' => [
            [
                'address_type' => 'permanent',
                'village_mohalla' => 'Sector 5, Ward 12',
                'post_office' => 'Patna GPO',
                'police_station' => 'Kotwali',
                'district' => 'Patna',
                'state' => 'Bihar',
                'pincode' => '800001',
            ],
            [
                'address_type' => 'correspondence',
                'village_mohalla' => 'Same as permanent',
                'post_office' => 'Patna GPO',
                'police_station' => 'Kotwali',
                'district' => 'Patna',
                'state' => 'Bihar',
                'pincode' => '800001',
            ],
        ],

        'academic_info' => [
            [
                'institute_name' => 'ABC Primary School',
                'session' => '2023-2024',
                'class' => '5',
                'section' => 'A',
                'roll_number' => '12',
            ],
        ],

        'documents' => [
            ['doc_type' => 'aadhar', 'doc_path' => '/uploads/students/aadhar_placeholder.pdf', 'status' => 'verified'],
            ['doc_type' => 'photo', 'doc_path' => '/uploads/students/photo_placeholder.jpg', 'status' => 'verified'],
        ],

        'previous_exams' => [
            [
                'exam_type' => 'new_admission',
                'exam_name' => 'Class 5 Annual',
                'board_university' => 'BSEB',
                'subjects' => 'ALL',
                'passing_year' => 2024,
                'roll_no' => 'BSEB-2024-001',
                'total_marks' => 500,
                'marks_obtained' => 398,
                'percentage' => 79.6,
                'division' => '1ST',
            ],
        ],

        'lms_enrollment' => ['stream_code' => 'CLS-6', 'session_start_year' => 2026, 'session_end_year' => 2027, 'section' => 'A'],
    ],

    [
        'name' => 'Diya Patel',
        'email' => 'diya.student@pdseducation.tech',
        'password' => 'password',
        'role' => 'student',

        'profile' => [
            'reg_no' => 'REG-PDSE-0002',
            'app_no' => 'APP-2026-002',
            'roll_no' => '2',
            'admission_date' => '2024-04-02',
            'current_semester' => 1,
            'father_name' => 'Amit Patel',
            'father_mobile' => '9876543211',
            'father_qualification' => 'B.Tech',
            'father_occupation' => 'Engineer',
            'mother_name' => 'Kavita Patel',
            'dob' => '2012-08-20',
            'gender' => 'Female',
            'category' => 'OBC',
            'religion' => 'Hindu',
            'blood_group' => 'O+',
            'nationality' => 'Indian',
            'mobile' => '9876500002',
            'aadhar_no' => '123456789013',
            'verified' => true,
        ],

        'addresses' => [
            [
                'address_type' => 'permanent',
                'village_mohalla' => 'Gandhi Nagar',
                'post_office' => 'Patna City',
                'police_station' => 'Patna City',
                'district' => 'Patna',
                'state' => 'Bihar',
                'pincode' => '800008',
            ],
        ],

        'academic_info' => [
            [
                'institute_name' => 'St. Mary School',
                'session' => '2023-2024',
                'class' => '5',
                'section' => 'B',
                'roll_number' => '8',
            ],
        ],

        'documents' => [
            ['doc_type' => 'aadhar', 'doc_path' => '/uploads/students/diya_aadhar.pdf', 'status' => 'verified'],
        ],

        'previous_exams' => [],

        'lms_enrollment' => ['stream_code' => 'CLS-6', 'session_start_year' => 2026, 'session_end_year' => 2027, 'section' => 'A'],
    ],

    [
        'name' => 'Rohan Kumar',
        'email' => 'rohan.student@pdseducation.tech',
        'password' => 'password',
        'role' => 'student',

        'profile' => [
            'reg_no' => 'REG-PDSE-0003',
            'roll_no' => '3',
            'admission_date' => '2024-04-03',
            'current_semester' => 1,
            'father_name' => 'Vikash Kumar',
            'mother_name' => 'Rekha Devi',
            'dob' => '2011-03-10',
            'gender' => 'Male',
            'category' => 'General',
            'blood_group' => 'A+',
            'nationality' => 'Indian',
            'mobile' => '9876500003',
            'verified' => true,
        ],

        'addresses' => [],
        'academic_info' => [],
        'documents' => [],
        'previous_exams' => [],

        'lms_enrollment' => ['stream_code' => 'CLS-7', 'session_start_year' => 2026, 'session_end_year' => 2027, 'section' => 'A'],
    ],

    [
        'name' => 'Ananya Singh',
        'email' => 'ananya.student@pdseducation.tech',
        'password' => 'password',
        'role' => 'student',

        'profile' => [
            'reg_no' => 'REG-PDSE-0004',
            'roll_no' => '4',
            'father_name' => 'Ranveer Singh',
            'mother_name' => 'Pooja Singh',
            'dob' => '2012-11-22',
            'gender' => 'Female',
            'category' => 'General',
            'mobile' => '9876500004',
            'verified' => true,
        ],

        'addresses' => [],
        'academic_info' => [],
        'documents' => [],
        'previous_exams' => [],
        'lms_enrollment' => null,
    ],

    [
        'name' => 'Ishaan Verma',
        'email' => 'ishaan.student@pdseducation.tech',
        'password' => 'password',
        'role' => 'student',

        'profile' => [
            'reg_no' => 'REG-PDSE-0005',
            'roll_no' => '5',
            'father_name' => 'Suresh Verma',
            'mother_name' => 'Neha Verma',
            'dob' => '2012-01-08',
            'gender' => 'Male',
            'category' => 'SC',
            'mobile' => '9876500005',
            'verified' => true,
        ],

        'addresses' => [],
        'academic_info' => [],
        'documents' => [],
        'previous_exams' => [],
        'lms_enrollment' => null,
    ],

    [
        'name' => 'Priya Gupta',
        'email' => 'priya.student@pdseducation.tech',
        'password' => 'password',
        'role' => 'student',

        'profile' => [
            'reg_no' => 'REG-PDSE-0006',
            'roll_no' => '6',
            'father_name' => 'Manoj Gupta',
            'mother_name' => 'Anita Gupta',
            'dob' => '2012-07-14',
            'gender' => 'Female',
            'category' => 'General',
            'mobile' => '9876500006',
            'verified' => true,
        ],

        'addresses' => [],
        'academic_info' => [],
        'documents' => [],
        'previous_exams' => [],
        'lms_enrollment' => null,
    ],
];

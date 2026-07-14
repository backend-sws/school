<?php

/**
 * Default seed data for onboarding, keyed by institution type.
 *
 * Each category has data arrays per type: school, college, coaching, university.
 * OnboardingDataSeederService resolves the type and loads the matching data.
 *
 * To add a new category: add a key here + a seed method in OnboardingDataSeederService.
 */
return [

    // ── Fee Types ──────────────────────────────────────────────────
    'fee_types' => [
        'school' => [
            ['name' => 'Tuition Fee', 'category' => 'recurring'],
            ['name' => 'Admission Fee', 'category' => 'one_time'],
            ['name' => 'Annual Charges', 'category' => 'recurring'],
            ['name' => 'Examination Fee', 'category' => 'recurring'],
            ['name' => 'Lab Fee', 'category' => 'recurring'],
            ['name' => 'Library Fee', 'category' => 'recurring'],
            ['name' => 'Transport Fee', 'category' => 'recurring'],
            ['name' => 'Activity Fee', 'category' => 'recurring'],
            ['name' => 'Computer Fee', 'category' => 'recurring'],
            ['name' => 'Sports Fee', 'category' => 'recurring'],
        ],
        'college' => [
            ['name' => 'Tuition Fee', 'category' => 'recurring'],
            ['name' => 'Admission Fee', 'category' => 'one_time'],
            ['name' => 'Development Fee', 'category' => 'recurring'],
            ['name' => 'Examination Fee', 'category' => 'recurring'],
            ['name' => 'Library Fee', 'category' => 'recurring'],
            ['name' => 'Lab Fee', 'category' => 'recurring'],
            ['name' => 'Sports Fee', 'category' => 'recurring'],
            ['name' => 'Transport Fee', 'category' => 'recurring'],
        ],
        'coaching' => [
            ['name' => 'Tuition Fee', 'category' => 'recurring'],
            ['name' => 'Registration Fee', 'category' => 'one_time'],
            ['name' => 'Study Material Fee', 'category' => 'recurring'],
            ['name' => 'Test Series Fee', 'category' => 'recurring'],
        ],
        'university' => [
            ['name' => 'Tuition Fee', 'category' => 'recurring'],
            ['name' => 'Admission Fee', 'category' => 'one_time'],
            ['name' => 'Examination Fee', 'category' => 'recurring'],
            ['name' => 'Library Fee', 'category' => 'recurring'],
            ['name' => 'Development Fee', 'category' => 'recurring'],
        ],
    ],

    // ── Main Streams / Classes ──────────────────────────────────────
    'streams' => [
        'school' => [
            ['name' => 'Pre-Primary',      'code' => 'PRE-PRI'],
            ['name' => 'Primary',          'code' => 'PRI'],
            ['name' => 'Middle School',    'code' => 'MID'],
            ['name' => 'Secondary',        'code' => 'SEC'],
            ['name' => 'Senior Secondary', 'code' => 'S-SEC'],
        ],
        'college' => [
            ['name' => 'Undergraduate (UG)', 'code' => 'UG'],
            ['name' => 'Postgraduate (PG)',  'code' => 'PG'],
            ['name' => 'Diploma',            'code' => 'DIP'],
            ['name' => 'Certificate Course', 'code' => 'CERT'],
        ],
        'coaching' => [
            ['name' => 'Foundation',  'code' => 'FND'],
            ['name' => 'Target',      'code' => 'TGT'],
            ['name' => 'Crash Course', 'code' => 'CC'],
        ],
        'university' => [
            ['name' => 'Undergraduate (UG)', 'code' => 'UG'],
            ['name' => 'Postgraduate (PG)',  'code' => 'PG'],
            ['name' => 'Doctoral (PhD)',     'code' => 'PHD'],
            ['name' => 'Diploma',            'code' => 'DIP'],
            ['name' => 'Certificate Course', 'code' => 'CERT'],
        ],
    ],

    // ── Classes / Sections ──────────────────────────────────────────
    'classes' => [
        'school' => [
            ['name' => 'Nursery',             'code' => 'NUR',        'main_stream' => 'Pre-Primary'],
            ['name' => 'LKG',                 'code' => 'LKG',        'main_stream' => 'Pre-Primary'],
            ['name' => 'UKG',                 'code' => 'UKG',        'main_stream' => 'Pre-Primary'],
            ['name' => 'Class I',             'code' => 'CLS-1',      'main_stream' => 'Primary'],
            ['name' => 'Class II',            'code' => 'CLS-2',      'main_stream' => 'Primary'],
            ['name' => 'Class III',           'code' => 'CLS-3',      'main_stream' => 'Primary'],
            ['name' => 'Class IV',            'code' => 'CLS-4',      'main_stream' => 'Primary'],
            ['name' => 'Class V',             'code' => 'CLS-5',      'main_stream' => 'Primary'],
            ['name' => 'Class VI',            'code' => 'CLS-6',      'main_stream' => 'Middle School'],
            ['name' => 'Class VII',           'code' => 'CLS-7',      'main_stream' => 'Middle School'],
            ['name' => 'Class VIII',          'code' => 'CLS-8',      'main_stream' => 'Middle School'],
            ['name' => 'Class IX',            'code' => 'CLS-9',      'main_stream' => 'Secondary'],
            ['name' => 'Class X',             'code' => 'CLS-10',     'main_stream' => 'Secondary'],
            ['name' => 'Class XI Science',    'code' => 'CLS-11-SCI', 'main_stream' => 'Senior Secondary'],
            ['name' => 'Class XI Commerce',   'code' => 'CLS-11-COM', 'main_stream' => 'Senior Secondary'],
            ['name' => 'Class XII Science',   'code' => 'CLS-12-SCI', 'main_stream' => 'Senior Secondary'],
            ['name' => 'Class XII Commerce',  'code' => 'CLS-12-COM', 'main_stream' => 'Senior Secondary'],
        ],
        'college' => [
            ['name' => 'B.A. Year I',   'code' => 'BA-Y1',   'main_stream' => 'Undergraduate (UG)'],
            ['name' => 'B.Sc. Year I',  'code' => 'BSC-Y1',  'main_stream' => 'Undergraduate (UG)'],
            ['name' => 'B.Com. Year I', 'code' => 'BCOM-Y1', 'main_stream' => 'Undergraduate (UG)'],
            ['name' => 'BCA Year I',    'code' => 'BCA-Y1',  'main_stream' => 'Undergraduate (UG)'],
            ['name' => 'BBA Year I',    'code' => 'BBA-Y1',  'main_stream' => 'Undergraduate (UG)'],
            ['name' => 'M.A. Sem I',    'code' => 'MA-S1',   'main_stream' => 'Postgraduate (PG)'],
            ['name' => 'M.Sc. Sem I',   'code' => 'MSC-S1',  'main_stream' => 'Postgraduate (PG)'],
        ],
        'coaching' => [
            ['name' => 'Foundation Batch', 'code' => 'FND', 'main_stream' => 'Foundation'],
            ['name' => 'Target Batch',     'code' => 'TGT', 'main_stream' => 'Target'],
            ['name' => 'Crash Course',     'code' => 'CC',  'main_stream' => 'Crash Course'],
        ],
        'university' => [
            ['name' => 'B.A. Sem I',   'code' => 'BA-S1',  'main_stream' => 'Undergraduate (UG)'],
            ['name' => 'B.Sc. Sem I',  'code' => 'BSC-S1', 'main_stream' => 'Undergraduate (UG)'],
            ['name' => 'M.A. Sem I',   'code' => 'MA-S1',  'main_stream' => 'Postgraduate (PG)'],
            ['name' => 'Ph.D. Year I', 'code' => 'PHD-Y1', 'main_stream' => 'Doctoral (PhD)'],
        ],
    ],

    // ── Subjects ────────────────────────────────────────────────────
    'subjects' => [
        'school' => [
            ['name' => 'English',           'code' => 'ENG',  'type' => 'theory'],
            ['name' => 'Hindi',             'code' => 'HIN',  'type' => 'theory'],
            ['name' => 'Mathematics',       'code' => 'MATH', 'type' => 'theory'],
            ['name' => 'Science',           'code' => 'SCI',  'type' => 'theory'],
            ['name' => 'Social Science',    'code' => 'SST',  'type' => 'theory'],
            ['name' => 'Computer Science',  'code' => 'CS',   'type' => 'practical'],
            ['name' => 'Physical Education','code' => 'PE',   'type' => 'practical'],
            ['name' => 'Art & Craft',       'code' => 'ART',  'type' => 'practical'],
            ['name' => 'General Knowledge', 'code' => 'GK',   'type' => 'theory'],
            ['name' => 'Moral Science',     'code' => 'MS',   'type' => 'theory'],
        ],
        'college' => [
            ['name' => 'English',             'code' => 'ENG',   'type' => 'theory'],
            ['name' => 'Hindi',               'code' => 'HIN',   'type' => 'theory'],
            ['name' => 'Physics',             'code' => 'PHY',   'type' => 'theory'],
            ['name' => 'Chemistry',           'code' => 'CHEM',  'type' => 'theory'],
            ['name' => 'Mathematics',         'code' => 'MATH',  'type' => 'theory'],
            ['name' => 'Biology',             'code' => 'BIO',   'type' => 'theory'],
            ['name' => 'Computer Science',    'code' => 'CS',    'type' => 'practical'],
            ['name' => 'Economics',           'code' => 'ECO',   'type' => 'theory'],
            ['name' => 'Political Science',   'code' => 'POL',   'type' => 'theory'],
            ['name' => 'History',             'code' => 'HIST',  'type' => 'theory'],
            ['name' => 'Accountancy',         'code' => 'ACC',   'type' => 'theory'],
            ['name' => 'Business Studies',    'code' => 'BS',    'type' => 'theory'],
        ],
        'coaching' => [
            ['name' => 'Physics',      'code' => 'PHY',  'type' => 'theory'],
            ['name' => 'Chemistry',    'code' => 'CHEM', 'type' => 'theory'],
            ['name' => 'Mathematics',  'code' => 'MATH', 'type' => 'theory'],
            ['name' => 'Biology',      'code' => 'BIO',  'type' => 'theory'],
            ['name' => 'Reasoning',    'code' => 'RSN',  'type' => 'theory'],
            ['name' => 'General Studies', 'code' => 'GS', 'type' => 'theory'],
        ],
        'university' => [
            ['name' => 'English',             'code' => 'ENG',   'type' => 'theory'],
            ['name' => 'Hindi',               'code' => 'HIN',   'type' => 'theory'],
            ['name' => 'Physics',             'code' => 'PHY',   'type' => 'theory'],
            ['name' => 'Chemistry',           'code' => 'CHEM',  'type' => 'theory'],
            ['name' => 'Mathematics',         'code' => 'MATH',  'type' => 'theory'],
            ['name' => 'Computer Science',    'code' => 'CS',    'type' => 'practical'],
            ['name' => 'Economics',           'code' => 'ECO',   'type' => 'theory'],
            ['name' => 'Political Science',   'code' => 'POL',   'type' => 'theory'],
        ],
    ],

    // ── Departments ─────────────────────────────────────────────────
    'departments' => [
        'school' => [],
        'college' => [
            ['name' => 'Computer Science',   'code' => 'CS'],
            ['name' => 'Mathematics',        'code' => 'MATH'],
            ['name' => 'Physics',            'code' => 'PHY'],
            ['name' => 'Chemistry',          'code' => 'CHEM'],
            ['name' => 'English',            'code' => 'ENG'],
            ['name' => 'Commerce',           'code' => 'COM'],
            ['name' => 'Economics',          'code' => 'ECO'],
            ['name' => 'Political Science',  'code' => 'POL'],
            ['name' => 'History',            'code' => 'HIST'],
        ],
        'coaching' => [],
        'university' => [
            ['name' => 'Computer Science & Engineering', 'code' => 'CSE'],
            ['name' => 'Mathematics',                    'code' => 'MATH'],
            ['name' => 'Physics',                        'code' => 'PHY'],
            ['name' => 'Chemistry',                      'code' => 'CHEM'],
            ['name' => 'English',                        'code' => 'ENG'],
            ['name' => 'Commerce',                       'code' => 'COM'],
            ['name' => 'Economics',                      'code' => 'ECO'],
            ['name' => 'Management & Business',          'code' => 'MBA'],
            ['name' => 'Law',                            'code' => 'LAW'],
        ],
    ],

    // ── Certificate Heads ───────────────────────────────────────────
    'certificate_heads' => [
        'school' => [
            ['title' => 'Transfer Certificate (TC)',    'description' => 'Issued when student leaves the school permanently',   'fee_amount' => 100,  'processing_days' => 7],
            ['title' => 'Character Certificate',        'description' => 'Certifies good conduct and behaviour of the student', 'fee_amount' => 50,   'processing_days' => 3],
            ['title' => 'Bonafide Certificate',         'description' => 'Proof that the student is enrolled in the school',    'fee_amount' => 50,   'processing_days' => 3],
            ['title' => 'School Leaving Certificate',   'description' => 'Issued upon completion of studies or withdrawal',     'fee_amount' => 100,  'processing_days' => 7],
            ['title' => 'Migration Certificate',        'description' => 'Required for change of board or higher studies',      'fee_amount' => 200,  'processing_days' => 10],
        ],
        'college' => [
            ['title' => 'Migration Certificate',       'description' => 'Certificate for students migrating to another institution', 'fee_amount' => 0,   'processing_days' => 7],
            ['title' => 'Character Certificate',       'description' => 'Character and conduct certificate for students',            'fee_amount' => 0,   'processing_days' => 5],
            ['title' => 'Bonafide Certificate',        'description' => 'Bonafide student certificate for official purposes',       'fee_amount' => 0,   'processing_days' => 3],
            ['title' => 'Degree Certificate',          'description' => 'Degree certificate issued after course completion',         'fee_amount' => 500, 'processing_days' => 14],
            ['title' => 'Transcript / Mark Sheet',     'description' => 'Academic transcript or consolidated mark sheet',            'fee_amount' => 300, 'processing_days' => 10],
            ['title' => 'Provisional Certificate',     'description' => 'Provisional degree certificate before convocation',        'fee_amount' => 200, 'processing_days' => 7],
        ],
        'coaching' => [
            ['title' => 'Course Completion Certificate', 'description' => 'Issued after successful completion of the course',         'fee_amount' => 0, 'processing_days' => 5],
            ['title' => 'Bonafide Certificate',          'description' => 'Proof that the student is enrolled in the coaching center', 'fee_amount' => 0, 'processing_days' => 3],
        ],
        'university' => [
            ['title' => 'Migration Certificate',       'description' => 'Certificate for students migrating to another institution', 'fee_amount' => 200, 'processing_days' => 10],
            ['title' => 'Character Certificate',       'description' => 'Character and conduct certificate for students',            'fee_amount' => 50,  'processing_days' => 5],
            ['title' => 'Bonafide Certificate',        'description' => 'Bonafide student certificate for official purposes',       'fee_amount' => 50,  'processing_days' => 3],
            ['title' => 'Degree Certificate',          'description' => 'Degree certificate issued after course completion',         'fee_amount' => 500, 'processing_days' => 14],
            ['title' => 'Transcript / Mark Sheet',     'description' => 'Academic transcript or consolidated mark sheet',            'fee_amount' => 300, 'processing_days' => 10],
            ['title' => 'Provisional Certificate',     'description' => 'Provisional degree certificate before convocation',        'fee_amount' => 200, 'processing_days' => 7],
            ['title' => 'PhD Certificate',             'description' => 'Doctoral degree certificate',                              'fee_amount' => 1000, 'processing_days' => 30],
        ],
    ],

    // ── Subject Groups ──────────────────────────────────────────────
    'subject_groups' => [
        'school' => [
            ['name' => 'Science',    'code' => 'SCI'],
            ['name' => 'Commerce',   'code' => 'COM'],
            ['name' => 'Arts',       'code' => 'ARTS'],
            ['name' => 'Languages',  'code' => 'LANG'],
            ['name' => 'Co-Curricular', 'code' => 'CO-CUR'],
        ],
        'college' => [
            ['name' => 'Science',    'code' => 'SCI'],
            ['name' => 'Commerce',   'code' => 'COM'],
            ['name' => 'Arts',       'code' => 'ARTS'],
            ['name' => 'Languages',  'code' => 'LANG'],
            ['name' => 'Vocational', 'code' => 'VOC'],
            ['name' => 'Electives',  'code' => 'ELEC'],
        ],
        'coaching' => [
            ['name' => 'Science',   'code' => 'SCI'],
            ['name' => 'Aptitude',  'code' => 'APT'],
        ],
        'university' => [
            ['name' => 'Science',       'code' => 'SCI'],
            ['name' => 'Commerce',      'code' => 'COM'],
            ['name' => 'Arts',          'code' => 'ARTS'],
            ['name' => 'Languages',     'code' => 'LANG'],
            ['name' => 'Professional',  'code' => 'PROF'],
            ['name' => 'Electives',     'code' => 'ELEC'],
            ['name' => 'Open Electives','code' => 'OE'],
        ],
    ],

    // ── Rooms / Halls ───────────────────────────────────────────────
    'rooms' => [
        'school' => [
            ['name' => 'Room 101',       'code' => 'R101',  'building' => 'Main', 'floor' => 'Ground', 'capacity' => 40, 'type' => 'classroom'],
            ['name' => 'Room 102',       'code' => 'R102',  'building' => 'Main', 'floor' => 'Ground', 'capacity' => 40, 'type' => 'classroom'],
            ['name' => 'Room 201',       'code' => 'R201',  'building' => 'Main', 'floor' => 'First',  'capacity' => 40, 'type' => 'classroom'],
            ['name' => 'Room 202',       'code' => 'R202',  'building' => 'Main', 'floor' => 'First',  'capacity' => 40, 'type' => 'classroom'],
            ['name' => 'Room 301',       'code' => 'R301',  'building' => 'Main', 'floor' => 'Second', 'capacity' => 40, 'type' => 'classroom'],
            ['name' => 'Computer Lab',   'code' => 'CLAB',  'building' => 'Main', 'floor' => 'Ground', 'capacity' => 30, 'type' => 'lab'],
            ['name' => 'Science Lab',    'code' => 'SLAB',  'building' => 'Main', 'floor' => 'First',  'capacity' => 30, 'type' => 'lab'],
            ['name' => 'Library Hall',   'code' => 'LIB',   'building' => 'Main', 'floor' => 'Ground', 'capacity' => 50, 'type' => 'hall'],
            ['name' => 'Assembly Hall',  'code' => 'ASMBLY','building' => 'Main', 'floor' => 'Ground', 'capacity' => 200,'type' => 'hall'],
            ['name' => 'Sports Ground',  'code' => 'GRND',  'building' => null,   'floor' => null,     'capacity' => 100,'type' => 'outdoor'],
        ],
        'college' => [
            ['name' => 'Lecture Hall 1',  'code' => 'LH-1',  'building' => 'Academic Block', 'floor' => 'Ground', 'capacity' => 60, 'type' => 'classroom'],
            ['name' => 'Lecture Hall 2',  'code' => 'LH-2',  'building' => 'Academic Block', 'floor' => 'Ground', 'capacity' => 60, 'type' => 'classroom'],
            ['name' => 'Lecture Hall 3',  'code' => 'LH-3',  'building' => 'Academic Block', 'floor' => 'First',  'capacity' => 60, 'type' => 'classroom'],
            ['name' => 'Seminar Hall',    'code' => 'SH',    'building' => 'Academic Block', 'floor' => 'First',  'capacity' => 100,'type' => 'hall'],
            ['name' => 'Computer Lab',    'code' => 'CLAB',  'building' => 'Science Block',  'floor' => 'Ground', 'capacity' => 40, 'type' => 'lab'],
            ['name' => 'Physics Lab',     'code' => 'PLAB',  'building' => 'Science Block',  'floor' => 'First',  'capacity' => 30, 'type' => 'lab'],
            ['name' => 'Chemistry Lab',   'code' => 'CHLAB', 'building' => 'Science Block',  'floor' => 'First',  'capacity' => 30, 'type' => 'lab'],
            ['name' => 'Auditorium',      'code' => 'AUD',   'building' => 'Admin Block',    'floor' => 'Ground', 'capacity' => 300,'type' => 'hall'],
        ],
        'coaching' => [
            ['name' => 'Classroom A', 'code' => 'CA', 'building' => 'Main', 'floor' => 'Ground', 'capacity' => 50, 'type' => 'classroom'],
            ['name' => 'Classroom B', 'code' => 'CB', 'building' => 'Main', 'floor' => 'Ground', 'capacity' => 50, 'type' => 'classroom'],
            ['name' => 'Classroom C', 'code' => 'CC', 'building' => 'Main', 'floor' => 'First',  'capacity' => 50, 'type' => 'classroom'],
            ['name' => 'Test Hall',   'code' => 'TH', 'building' => 'Main', 'floor' => 'First',  'capacity' => 100,'type' => 'hall'],
        ],
        'university' => [
            ['name' => 'Lecture Hall A',  'code' => 'LH-A',  'building' => 'Block A', 'floor' => 'Ground', 'capacity' => 80,  'type' => 'classroom'],
            ['name' => 'Lecture Hall B',  'code' => 'LH-B',  'building' => 'Block A', 'floor' => 'First',  'capacity' => 80,  'type' => 'classroom'],
            ['name' => 'Lecture Hall C',  'code' => 'LH-C',  'building' => 'Block B', 'floor' => 'Ground', 'capacity' => 80,  'type' => 'classroom'],
            ['name' => 'Seminar Room 1',  'code' => 'SR-1',  'building' => 'Block B', 'floor' => 'First',  'capacity' => 40,  'type' => 'classroom'],
            ['name' => 'Computer Lab',    'code' => 'CLAB',  'building' => 'IT Block','floor' => 'Ground', 'capacity' => 50,  'type' => 'lab'],
            ['name' => 'Research Lab',    'code' => 'RLAB',  'building' => 'IT Block','floor' => 'First',  'capacity' => 20,  'type' => 'lab'],
            ['name' => 'Auditorium',      'code' => 'AUD',   'building' => 'Admin',   'floor' => 'Ground', 'capacity' => 500, 'type' => 'hall'],
            ['name' => 'Conference Hall', 'code' => 'CONF',  'building' => 'Admin',   'floor' => 'First',  'capacity' => 100, 'type' => 'hall'],
        ],
    ],
];

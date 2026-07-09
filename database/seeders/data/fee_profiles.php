<?php

/**
 * Common fee profiles for different institution types.
 * Each type has 10 industry-standard profiles.
 */
return [
    'school' => [
        [
            'name' => 'K-12 Standard Primary',
            'category' => 'Standard',
            'description' => 'Standard annual fee structure for Primary classes (I-V).',
            'is_default' => true,
            'items' => [
                ['name' => 'Tuition Fee', 'amount' => 45000, 'category' => 'recurring'],
                ['name' => 'Annual Charges', 'amount' => 12000, 'category' => 'one_time'],
                ['name' => 'Examination Fee', 'amount' => 1500, 'category' => 'recurring'],
                ['name' => 'ICT/Computer Fee', 'amount' => 3000, 'category' => 'recurring'],
                ['name' => 'Activity & Sports Fee', 'amount' => 2500, 'category' => 'recurring'],
            ]
        ],
        [
            'name' => 'Nursery/Prep Admission Bundle',
            'category' => 'Admission',
            'description' => 'Comprehensive bundle for new pre-nursery and nursery admissions.',
            'is_default' => false,
            'items' => [
                ['name' => 'Admission Fee', 'amount' => 25000, 'category' => 'one_time'],
                ['name' => 'Tuition Fee', 'amount' => 35000, 'category' => 'recurring'],
                ['name' => 'Security Deposit (Refundable)', 'amount' => 5000, 'category' => 'one_time'],
                ['name' => 'ID Card & Diary', 'amount' => 500, 'category' => 'one_time'],
                ['name' => 'Annual Charges', 'amount' => 10000, 'category' => 'one_time'],
            ]
        ],
        [
            'name' => 'Secondary (IX-X) Standard',
            'category' => 'Standard',
            'description' => 'Base fee structure for secondary level students.',
            'is_default' => false,
            'items' => [
                ['name' => 'Tuition Fee', 'amount' => 55000, 'category' => 'recurring'],
                ['name' => 'Lab Maintenance Fee', 'amount' => 4000, 'category' => 'recurring'],
                ['name' => 'Annual Charges', 'amount' => 15000, 'category' => 'one_time'],
                ['name' => 'Library Fund', 'amount' => 2000, 'category' => 'recurring'],
                ['name' => 'Examination Fee', 'amount' => 2000, 'category' => 'recurring'],
            ]
        ],
        [
            'name' => 'Sr. Secondary Science (XI-XII)',
            'category' => 'Specialized',
            'description' => 'Higher secondary science stream fee with laboratory and specialized charges.',
            'is_default' => false,
            'items' => [
                ['name' => 'Tuition Fee', 'amount' => 75000, 'category' => 'recurring'],
                ['name' => 'Science Lab Fee (PCB/PCM)', 'amount' => 8000, 'category' => 'recurring'],
                ['name' => 'Annual Charges', 'amount' => 18000, 'category' => 'one_time'],
                ['name' => 'Examination Fee', 'amount' => 3000, 'category' => 'recurring'],
                ['name' => 'Career Guidance & Counseling', 'amount' => 5000, 'category' => 'one_time'],
            ]
        ],
        [
            'name' => 'Staff Ward Scholarship',
            'category' => 'Scholarship',
            'description' => '50% tuition waiver for children of institution staff.',
            'is_default' => false,
            'items' => [
                ['name' => 'Tuition Fee', 'amount' => 22500, 'category' => 'recurring'],
                ['name' => 'Annual Charges', 'amount' => 6000, 'category' => 'one_time'],
                ['name' => 'Activity & Sports Fee', 'amount' => 1250, 'category' => 'recurring'],
            ]
        ],
        [
            'name' => 'Merit-Based Excellence Profile',
            'category' => 'Scholarship',
            'description' => 'Full tuition waiver for top-performing students based on academic rank.',
            'is_default' => false,
            'items' => [
                ['name' => 'Tuition Fee', 'amount' => 0, 'category' => 'recurring'],
                ['name' => 'Annual Charges', 'amount' => 12000, 'category' => 'one_time'],
                ['name' => 'Activity & Sports Fee', 'amount' => 0, 'category' => 'recurring'],
            ]
        ],
        [
            'name' => 'Sibling Discount Profile',
            'category' => 'Discount',
            'description' => '25% tuition discount for second and subsequent siblings.',
            'is_default' => false,
            'items' => [
                ['name' => 'Tuition Fee', 'amount' => 33750, 'category' => 'recurring'],
                ['name' => 'Annual Charges', 'amount' => 12000, 'category' => 'one_time'],
                ['name' => 'Transport (Optional Component)', 'amount' => 0, 'category' => 'variable'],
            ]
        ],
        [
            'name' => 'RTE/EWS Managed Profile',
            'category' => 'Government',
            'description' => 'Zero-fee structure for students under Right to Education (RTE) / EWS category.',
            'is_default' => false,
            'items' => [
                ['name' => 'Tuition Fee', 'amount' => 0, 'category' => 'recurring'],
                ['name' => 'Admission Fee', 'amount' => 0, 'category' => 'one_time'],
                ['name' => 'Annual Charges', 'amount' => 0, 'category' => 'one_time'],
            ]
        ],
        [
            'name' => 'Boarders (Hostel) Supplement',
            'category' => 'Residential',
            'description' => 'Supplementary fee structure for residential students.',
            'is_default' => false,
            'items' => [
                ['name' => 'Hostel Rent', 'amount' => 60000, 'category' => 'recurring'],
                ['name' => 'Mess/Dining Charges', 'amount' => 45000, 'category' => 'recurring'],
                ['name' => 'Laundry & Maintenance', 'amount' => 5000, 'category' => 'recurring'],
                ['name' => 'Night Prep/Supervision', 'amount' => 10000, 'category' => 'recurring'],
            ]
        ],
        [
            'name' => 'Co-Curricular/Sports Academy',
            'category' => 'Activity',
            'description' => 'Specialized profile for students enrolled in professional sports or arts training.',
            'is_default' => false,
            'items' => [
                ['name' => 'Academy Membership', 'amount' => 15000, 'category' => 'recurring'],
                ['name' => 'Expert Coaching Fee', 'amount' => 10000, 'category' => 'recurring'],
                ['name' => 'Equipment/Kit Fee', 'amount' => 5000, 'category' => 'one_time'],
            ]
        ],
    ],
    'college' => [
        [
            'name' => 'B.A./B.Com Standard (Annual)',
            'category' => 'Standard',
            'description' => 'Annual base fee for general undergraduate arts and commerce courses.',
            'is_default' => true,
            'items' => [
                ['name' => 'University Tuition Fee', 'amount' => 15000, 'category' => 'recurring'],
                ['name' => 'Development Fund', 'amount' => 5000, 'category' => 'recurring'],
                ['name' => 'Library & Resource Fee', 'amount' => 3000, 'category' => 'recurring'],
                ['name' => 'Examination Charges', 'amount' => 2500, 'category' => 'recurring'],
                ['name' => 'Student Union & Welfare', 'amount' => 1000, 'category' => 'recurring'],
            ]
        ],
        [
            'name' => 'B.Sc. Science Lab Bundle',
            'category' => 'Standard',
            'description' => 'Standard fee for science undergraduates including lab and practical charges.',
            'is_default' => false,
            'items' => [
                ['name' => 'University Tuition Fee', 'amount' => 18000, 'category' => 'recurring'],
                ['name' => 'Laboratory Maintenance', 'amount' => 6000, 'category' => 'recurring'],
                ['name' => 'Practical Exam Fee', 'amount' => 2000, 'category' => 'recurring'],
                ['name' => 'Science Journal/Resources', 'amount' => 1000, 'category' => 'one_time'],
                ['name' => 'Development Fund', 'amount' => 5000, 'category' => 'recurring'],
            ]
        ],
        [
            'name' => 'BCA/Vocational Professional',
            'category' => 'Self-Financed',
            'description' => 'Fee structure for high-demand vocational/professional undergraduate courses.',
            'is_default' => false,
            'items' => [
                ['name' => 'Professional Course Fee', 'amount' => 45000, 'category' => 'recurring'],
                ['name' => 'Computer Lab & High Speed Internet', 'amount' => 10000, 'category' => 'recurring'],
                ['name' => 'Industry Interaction/Seminars', 'amount' => 5000, 'category' => 'one_time'],
                ['name' => 'Placement Training Cell', 'amount' => 4000, 'category' => 'recurring'],
            ]
        ],
        [
            'name' => 'Post-Graduate (M.A./M.Sc.) Standard',
            'category' => 'Post-Graduate',
            'description' => 'Standard fee for master level courses.',
            'is_default' => false,
            'items' => [
                ['name' => 'Graduate Tuition Fee', 'amount' => 25000, 'category' => 'recurring'],
                ['name' => 'Research & Seminar Fund', 'amount' => 5000, 'category' => 'recurring'],
                ['name' => 'Thesis/Dissertation Support', 'amount' => 3000, 'category' => 'one_time'],
                ['name' => 'Advanced Library Access', 'amount' => 2000, 'category' => 'recurring'],
            ]
        ],
        [
            'name' => 'Hosteler (General Intake)',
            'category' => 'Hostel',
            'description' => 'Accomodation and related charges for college boarders.',
            'is_default' => false,
            'items' => [
                ['name' => 'Hostel Admission', 'amount' => 5000, 'category' => 'one_time'],
                ['name' => 'Hostel Room Rent', 'amount' => 24000, 'category' => 'recurring'],
                ['name' => 'Electricity & Water Maintenance', 'amount' => 6000, 'category' => 'recurring'],
                ['name' => 'Common Room & Recreation', 'amount' => 2000, 'category' => 'recurring'],
            ]
        ],
        [
            'name' => 'ST/SC State Scholarship',
            'category' => 'Government',
            'description' => 'Nominal fee structure as per state scholarship/waiver guidelines for ST/SC students.',
            'is_default' => false,
            'items' => [
                ['name' => 'University Tuition Fee', 'amount' => 0, 'category' => 'recurring'],
                ['name' => 'Examination Charges', 'amount' => 100, 'category' => 'recurring'],
                ['name' => 'Identity Card Fee', 'amount' => 50, 'category' => 'one_time'],
            ]
        ],
        [
            'name' => 'Distance Education (ODL)',
            'category' => 'Distance',
            'description' => 'Fee structure for students in Open and Distance Learning mode.',
            'is_default' => false,
            'items' => [
                ['name' => 'Study Material/SLM Fee', 'amount' => 4000, 'category' => 'one_time'],
                ['name' => 'Contact Program Fee', 'amount' => 2000, 'category' => 'recurring'],
                ['name' => 'Examination Fee', 'amount' => 1500, 'category' => 'recurring'],
                ['name' => 'ODL Processing Fee', 'amount' => 500, 'category' => 'one_time'],
            ]
        ],
        [
            'name' => 'Lateral Entry (Professional)',
            'category' => 'Admission',
            'description' => 'Profile for second-year (lateral) entry students in B.Tech/BCA etc.',
            'is_default' => false,
            'items' => [
                ['name' => 'Lateral Entry Admission', 'amount' => 15000, 'category' => 'one_time'],
                ['name' => 'Course Fee (Pro-rata)', 'amount' => 40000, 'category' => 'recurring'],
                ['name' => 'Bridge Course Material', 'amount' => 2000, 'category' => 'one_time'],
            ]
        ],
        [
            'name' => 'Sports Quota / Active Player',
            'category' => 'Scholarship',
            'description' => 'Tuition waiver for students representing the college in national/state sports.',
            'is_default' => false,
            'items' => [
                ['name' => 'University Tuition Fee', 'amount' => 0, 'category' => 'recurring'],
                ['name' => 'Development Fund', 'amount' => 2500, 'category' => 'recurring'],
                ['name' => 'Player Health Insurance', 'amount' => 1000, 'category' => 'recurring'],
            ]
        ],
        [
            'name' => 'Final Year Graduation Bundle',
            'category' => 'Graduation',
            'description' => 'Final year charges including convocation and placement support.',
            'is_default' => false,
            'items' => [
                ['name' => 'Convocation Fee', 'amount' => 3000, 'category' => 'one_time'],
                ['name' => 'Alumni Fund Membership', 'amount' => 1000, 'category' => 'one_time'],
                ['name' => 'Final Transcript & Degree Charges', 'amount' => 1500, 'category' => 'one_time'],
                ['name' => 'Placement Registration', 'amount' => 2000, 'category' => 'one_time'],
            ]
        ],
    ],
    'coaching' => [
        [
            'name' => 'JEE/NEET 2-Year Foundation',
            'category' => 'Premium',
            'description' => 'Comprehensive 2-year classroom program for competitive exams.',
            'is_default' => true,
            'items' => [
                ['name' => 'Course Tuition Fee', 'amount' => 180000, 'category' => 'recurring'],
                ['name' => 'Study Material & Test Series', 'amount' => 15000, 'category' => 'one_time'],
                ['name' => 'Online Support/Doubt Portal', 'amount' => 5000, 'category' => 'recurring'],
                ['name' => 'Registration Fee', 'amount' => 5000, 'category' => 'one_time'],
            ]
        ],
        [
            'name' => '1-Year Repeater/Target Batch',
            'category' => 'Standard',
            'description' => 'Intensive one-year program for students dedicated to re-attempting competitive exams.',
            'is_default' => false,
            'items' => [
                ['name' => 'Course Tuition Fee', 'amount' => 110000, 'category' => 'recurring'],
                ['name' => 'Intensive Test Series', 'amount' => 8000, 'category' => 'one_time'],
                ['name' => 'Study Material', 'amount' => 5000, 'category' => 'one_time'],
            ]
        ],
        [
            'name' => 'Crash Course (3 Months)',
            'category' => 'Short-Term',
            'description' => 'Revision and shortcuts focused fast-track program prior to exams.',
            'is_default' => false,
            'items' => [
                ['name' => 'Crash Course Program Fee', 'amount' => 35000, 'category' => 'one_time'],
                ['name' => 'Formula Booklets & Quick Revision Notes', 'amount' => 2000, 'category' => 'one_time'],
                ['name' => 'Mock Exam Bundle', 'amount' => 3000, 'category' => 'one_time'],
            ]
        ],
        [
            'name' => 'Digital/Online Only Batch',
            'category' => 'Digital',
            'description' => 'Purely online distance-learning program via Live and Recorded sessions.',
            'is_default' => false,
            'items' => [
                ['name' => 'Online Tuition Fee', 'amount' => 25000, 'category' => 'recurring'],
                ['name' => 'Platform Access Fee', 'amount' => 2000, 'category' => 'recurring'],
                ['name' => 'Digital Study material (PDF Only)', 'amount' => 0, 'category' => 'one_time'],
            ]
        ],
        [
            'name' => 'Academic Support (Boards Only)',
            'category' => 'Standard',
            'description' => 'Targeting School Board Excellence (CBSE/ICSE) for XI-XII.',
            'is_default' => false,
            'items' => [
                ['name' => 'Subject Tuition (PCMB/Accounts)', 'amount' => 40000, 'category' => 'recurring'],
                ['name' => 'Syllabus Coverage Tests', 'amount' => 3000, 'category' => 'recurring'],
                ['name' => 'Board Pattern Answer-Writing Workshop', 'amount' => 2000, 'category' => 'one_time'],
            ]
        ],
        [
            'name' => 'Entrance Merit Scholarship (100% Waiver)',
            'category' => 'Scholarship',
            'description' => 'For students who qualified via Entrance Cum Scholarship Test (EST).',
            'is_default' => false,
            'items' => [
                ['name' => 'Course Tuition Fee', 'amount' => 0, 'category' => 'recurring'],
                ['name' => 'Study Material & Test Series', 'amount' => 15000, 'category' => 'one_time'],
                ['name' => 'Registration Fee', 'amount' => 5000, 'category' => 'one_time'],
            ]
        ],
        [
            'name' => 'Early Bird (Pre-Booking) Profile',
            'category' => 'Discount',
            'description' => '20% discount on tuition for admissions booked before March.',
            'is_default' => false,
            'items' => [
                ['name' => 'Course Tuition Fee (Discounted)', 'amount' => 144000, 'category' => 'recurring'],
                ['name' => 'Study Material', 'amount' => 15000, 'category' => 'one_time'],
            ]
        ],
        [
            'name' => 'Individual Subject/Modular Learning',
            'category' => 'Modular',
            'description' => 'Profile for students taking only one subject (e.g., Only Mathematics).',
            'is_default' => false,
            'items' => [
                ['name' => 'Single Subject Tuition', 'amount' => 18000, 'category' => 'recurring'],
                ['name' => 'Subject Specific Notes', 'amount' => 1000, 'category' => 'one_time'],
            ]
        ],
        [
            'name' => 'Weekend Enrichment / Doubt Clearing',
            'category' => 'Part-Time',
            'description' => 'Profile for self-studying students attending only weekend doubt/enrichment classes.',
            'is_default' => false,
            'items' => [
                ['name' => 'Weekend Class Charges', 'amount' => 20000, 'category' => 'recurring'],
                ['name' => 'Doubt Forum Access', 'amount' => 2000, 'category' => 'recurring'],
            ]
        ],
        [
            'name' => 'International Olympiad Training',
            'category' => 'Specialized',
            'description' => 'Specialized training for IMO, IPhO, IChO, etc.',
            'is_default' => false,
            'items' => [
                ['name' => 'Olympiad Expert Coaching', 'amount' => 50000, 'category' => 'one_time'],
                ['name' => 'Advanced Problem Resource Set', 'amount' => 5000, 'category' => 'one_time'],
                ['name' => 'Mock National/International Tests', 'amount' => 10000, 'category' => 'one_time'],
            ]
        ],
    ],
    'university' => [
        [
            'name' => 'Undergraduate (Non-Professional) Semester',
            'category' => 'Standard',
            'description' => 'Standard semester fee for B.A., B.Sc., B.Com programs.',
            'is_default' => true,
            'items' => [
                ['name' => 'Semester Tuition Fee', 'amount' => 35000, 'category' => 'recurring'],
                ['name' => 'University Registration & Admin', 'amount' => 5000, 'category' => 'one_time'],
                ['name' => 'Campus Maintenance Fund', 'amount' => 4000, 'category' => 'recurring'],
                ['name' => 'Library & Knowledge Center', 'amount' => 2000, 'category' => 'recurring'],
            ]
        ],
        [
            'name' => 'MBA/Professional Management Semester',
            'category' => 'Professional',
            'description' => 'Fee structure for professional post-grad programs like MBA/PGDM.',
            'is_default' => false,
            'items' => [
                ['name' => 'Professional Tuition Fee', 'amount' => 250000, 'category' => 'recurring'],
                ['name' => 'Industry Networking & Corporate Cell', 'amount' => 25000, 'category' => 'recurring'],
                ['name' => 'International Immersion Fund', 'amount' => 50000, 'category' => 'one_time'],
                ['name' => 'Soft Skills & Leadership Training', 'amount' => 10000, 'category' => 'recurring'],
            ]
        ],
        [
            'name' => 'Post-Graduate (MS/M.Tech) Research Focus',
            'category' => 'Research',
            'description' => 'Higher level engineering/technical post-grad standard.',
            'is_default' => false,
            'items' => [
                ['name' => 'Technical Tuition Fee', 'amount' => 85000, 'category' => 'recurring'],
                ['name' => 'Advanced Lab Usage (High End)', 'amount' => 15000, 'category' => 'recurring'],
                ['name' => 'Publication & Research Support', 'amount' => 10000, 'category' => 'recurring'],
                ['name' => 'Library (Advanced Journals)', 'amount' => 5000, 'category' => 'recurring'],
            ]
        ],
        [
            'name' => 'Ph.D. Scholar Profile',
            'category' => 'Doctoral',
            'description' => 'Fee for doctoral candidates (Full-time).',
            'is_default' => false,
            'items' => [
                ['name' => 'Candidacy Maintenance Fee', 'amount' => 15000, 'category' => 'recurring'],
                ['name' => 'Research Lab & Instrumentation', 'amount' => 10000, 'category' => 'recurring'],
                ['name' => 'Doctoral Thesis Submission/Evaluation', 'amount' => 30000, 'category' => 'one_time'],
            ]
        ],
        [
            'name' => 'International Student - Global Admissions',
            'category' => 'International',
            'description' => 'Fee USD equivalent for students with foreign nationality.',
            'is_default' => false,
            'items' => [
                ['name' => 'Global Tuition Premium', 'amount' => 650000, 'category' => 'recurring'],
                ['name' => 'International Student Wing Support', 'amount' => 20000, 'category' => 'recurring'],
                ['name' => 'FRO/Visa Processing Assistance', 'amount' => 5000, 'category' => 'one_time'],
            ]
        ],
        [
            'name' => 'Hostel & Residential (Premium Twin)',
            'category' => 'Residential',
            'description' => 'University accommodation with high-speed wifi and laundry.',
            'is_default' => false,
            'items' => [
                ['name' => 'Hostel Accommodation Charges', 'amount' => 120000, 'category' => 'recurring'],
                ['name' => 'Mess/Global Cuisine Charges', 'amount' => 80000, 'category' => 'recurring'],
                ['name' => 'High Speed Campus Wifi', 'amount' => 5000, 'category' => 'recurring'],
                ['name' => 'Laundry Services', 'amount' => 5000, 'category' => 'recurring'],
            ]
        ],
        [
            'name' => 'Part-Time Professional Diploma',
            'category' => 'Part-Time',
            'description' => 'Specialized skill-upgradtion programs for working professionals.',
            'is_default' => false,
            'items' => [
                ['name' => 'Executive Course Fee', 'amount' => 60000, 'category' => 'one_time'],
                ['name' => 'LMS Access & Material', 'amount' => 5000, 'category' => 'one_time'],
            ]
        ],
        [
            'name' => 'Alumni Child / Internal Continuity Discount',
            'category' => 'Scholarship',
            'description' => '10% tuition waiver for alumni children or internal PG progression.',
            'is_default' => false,
            'items' => [
                ['name' => 'Semester Tuition Fee (Loyalty Discount)', 'amount' => 31500, 'category' => 'recurring'],
                ['name' => 'University Registration & Admin', 'amount' => 5000, 'category' => 'one_time'],
            ]
        ],
        [
            'name' => 'Research Assistant / RA (Fee Waiver)',
            'category' => 'Scholarship',
            'description' => 'Waiver for students working as Research Assistants in funded projects.',
            'is_default' => false,
            'items' => [
                ['name' => 'Semester Tuition Fee', 'amount' => 0, 'category' => 'recurring'],
                ['name' => 'Mandatory Admin Charges', 'amount' => 10000, 'category' => 'recurring'],
            ]
        ],
        [
            'name' => 'Convocation & Final Year Clearance',
            'category' => 'Graduation',
            'description' => 'Final year exit charges.',
            'is_default' => false,
            'items' => [
                ['name' => 'Convocation Gown & Event', 'amount' => 5000, 'category' => 'one_time'],
                ['name' => 'Final Diploma/Degree Silk Folder', 'amount' => 2000, 'category' => 'one_time'],
                ['name' => 'Permanent Alumni Membership', 'amount' => 10000, 'category' => 'one_time'],
            ]
        ],
    ],
];

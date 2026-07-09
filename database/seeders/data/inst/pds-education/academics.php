<?php

/**
 * PDS Education academic structure.
 * Pre-Primary (NUR, LKG, UKG) + Primary (I-V) + Middle (VI-VIII) + Secondary (IX-X) + Sr. Secondary (XI-XII).
 */
return [
    'main_streams' => [
        ['name' => 'Pre-Primary (NUR-UKG)', 'code' => 'PREPRI'],
        ['name' => 'Primary (I-V)', 'code' => 'PRI'],
        ['name' => 'Middle (VI-VIII)', 'code' => 'MID'],
        ['name' => 'Secondary (IX-X)', 'code' => 'SEC'],
        ['name' => 'Sr. Secondary (XI-XII)', 'code' => 'SRSEC'],
    ],
    'groups' => [
        ['name' => 'Core Subject', 'code' => 'CORE'],
        ['name' => 'Language', 'code' => 'LANG'],
        ['name' => 'Elective', 'code' => 'ELEC'],
    ],
    'streams' => [
        // Pre-Primary
        ['main_stream_code' => 'PREPRI', 'name' => 'Nursery', 'code' => 'NUR', 'duration' => 1],
        ['main_stream_code' => 'PREPRI', 'name' => 'LKG', 'code' => 'LKG', 'duration' => 1],
        ['main_stream_code' => 'PREPRI', 'name' => 'UKG', 'code' => 'UKG', 'duration' => 1],
        // Primary
        ['main_stream_code' => 'PRI', 'name' => 'Class I', 'code' => 'CLS-1', 'duration' => 1],
        ['main_stream_code' => 'PRI', 'name' => 'Class II', 'code' => 'CLS-2', 'duration' => 1],
        ['main_stream_code' => 'PRI', 'name' => 'Class III', 'code' => 'CLS-3', 'duration' => 1],
        ['main_stream_code' => 'PRI', 'name' => 'Class IV', 'code' => 'CLS-4', 'duration' => 1],
        ['main_stream_code' => 'PRI', 'name' => 'Class V', 'code' => 'CLS-5', 'duration' => 1],
        // Middle
        ['main_stream_code' => 'MID', 'name' => 'Class VI', 'code' => 'CLS-6', 'duration' => 1],
        ['main_stream_code' => 'MID', 'name' => 'Class VII', 'code' => 'CLS-7', 'duration' => 1],
        ['main_stream_code' => 'MID', 'name' => 'Class VIII', 'code' => 'CLS-8', 'duration' => 1],
        // Secondary
        ['main_stream_code' => 'SEC', 'name' => 'Class IX', 'code' => 'CLS-9', 'duration' => 1],
        ['main_stream_code' => 'SEC', 'name' => 'Class X', 'code' => 'CLS-10', 'duration' => 1],
        // Sr. Secondary
        ['main_stream_code' => 'SRSEC', 'name' => 'Class XI - Science', 'code' => 'CLS-11-SCI', 'duration' => 1],
        ['main_stream_code' => 'SRSEC', 'name' => 'Class XI - Commerce', 'code' => 'CLS-11-COM', 'duration' => 1],
        ['main_stream_code' => 'SRSEC', 'name' => 'Class XII - Science', 'code' => 'CLS-12-SCI', 'duration' => 1],
        ['main_stream_code' => 'SRSEC', 'name' => 'Class XII - Commerce', 'code' => 'CLS-12-COM', 'duration' => 1],
    ],
    'sessions' => [
        ['name' => '2025-2026', 'start_year' => 2025, 'end_year' => 2026, 'is_current' => false],
        ['name' => '2026-2027', 'start_year' => 2026, 'end_year' => 2027, 'is_current' => true],
    ],
    'subjects' => [
        'NUR' => ['English', 'Hindi', 'Mathematics', 'Drawing', 'Rhymes'],
        'LKG' => ['English', 'Hindi', 'Mathematics', 'Drawing', 'Rhymes', 'GK'],
        'UKG' => ['English', 'Hindi', 'Mathematics', 'Drawing', 'GK', 'Computer'],
        'CLS-1' => ['English', 'Hindi', 'Mathematics', 'EVS', 'Art', 'Physical Education'],
        'CLS-2' => ['English', 'Hindi', 'Mathematics', 'EVS', 'Art', 'Physical Education'],
        'CLS-3' => ['English', 'Hindi', 'Mathematics', 'EVS', 'Art', 'Physical Education'],
        'CLS-4' => ['English', 'Hindi', 'Mathematics', 'EVS', 'Art', 'Physical Education'],
        'CLS-5' => ['English', 'Hindi', 'Mathematics', 'EVS', 'Computer Science', 'Physical Education'],
        'CLS-6' => ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Sanskrit', 'Physical Education'],
        'CLS-7' => ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Sanskrit', 'Physical Education'],
        'CLS-8' => ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Sanskrit', 'Computer Science', 'Physical Education'],
        'CLS-9' => ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Computer Applications', 'Physical Education'],
        'CLS-10' => ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Computer Applications', 'Physical Education'],
        'CLS-11-SCI' => ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'PE'],
        'CLS-11-COM' => ['Accountancy', 'Business Studies', 'Economics', 'Mathematics', 'English', 'PE'],
        'CLS-12-SCI' => ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'PE'],
        'CLS-12-COM' => ['Accountancy', 'Business Studies', 'Economics', 'Mathematics', 'English', 'PE'],
    ],
    'classrooms' => [
        ['stream_code' => 'NUR', 'section' => 'A'],
        ['stream_code' => 'LKG', 'section' => 'A'],
        ['stream_code' => 'UKG', 'section' => 'A'],
        ['stream_code' => 'CLS-1', 'section' => 'A'],
        ['stream_code' => 'CLS-2', 'section' => 'A'],
        ['stream_code' => 'CLS-3', 'section' => 'A'],
        ['stream_code' => 'CLS-4', 'section' => 'A'],
        ['stream_code' => 'CLS-5', 'section' => 'A'],
        ['stream_code' => 'CLS-6', 'section' => 'A'],
        ['stream_code' => 'CLS-7', 'section' => 'A'],
        ['stream_code' => 'CLS-8', 'section' => 'A'],
        ['stream_code' => 'CLS-9', 'section' => 'A'],
        ['stream_code' => 'CLS-10', 'section' => 'A'],
        ['stream_code' => 'CLS-11-SCI', 'section' => 'A'],
        ['stream_code' => 'CLS-11-COM', 'section' => 'A'],
        ['stream_code' => 'CLS-12-SCI', 'section' => 'A'],
        ['stream_code' => 'CLS-12-COM', 'section' => 'A'],
    ],
];

<?php

return [
    'rooms' => [
        ['name' => 'Lecture Hall 1', 'code' => 'LH1', 'capacity' => 60, 'type' => 'Classroom'],
        ['name' => 'Lecture Hall 2', 'code' => 'LH2', 'capacity' => 60, 'type' => 'Classroom'],
        ['name' => 'Chemistry Lab', 'code' => 'CHEMLAB', 'capacity' => 25, 'type' => 'Laboratory'],
        ['name' => 'Biology Lab', 'code' => 'BIOLAB', 'capacity' => 25, 'type' => 'Laboratory'],
        ['name' => 'Conference Room', 'code' => 'CONF', 'capacity' => 15, 'type' => 'Other'],
    ],

    'templates' => [
        [
            'name' => 'Main Academic Schedule',
            'type' => 'Academic',
            'is_active' => true,
            'is_default' => true,
            'periods' => [
                ['name' => 'First Session', 'start_time' => '10:00', 'end_time' => '11:00', 'type' => 'Class', 'sort_order' => 1],
                ['name' => 'Second Session', 'start_time' => '11:00', 'end_time' => '12:00', 'type' => 'Class', 'sort_order' => 2],
                ['name' => 'Tea Break', 'start_time' => '12:00', 'end_time' => '12:15', 'type' => 'Break', 'sort_order' => 3],
                ['name' => 'Third Session', 'start_time' => '12:15', 'end_time' => '13:15', 'type' => 'Class', 'sort_order' => 4],
                ['name' => 'Lunch', 'start_time' => '13:15', 'end_time' => '14:00', 'type' => 'Break', 'sort_order' => 5],
                ['name' => 'Fourth Session', 'start_time' => '14:00', 'end_time' => '15:00', 'type' => 'Class', 'sort_order' => 6],
            ]
        ]
    ]
];

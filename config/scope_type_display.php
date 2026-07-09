<?php

/**
 * Scope-type (institution type) display config.
 *
 * Similar to api_response_maps: defines how to present data per scope type
 * (school, college, coaching, university). Use when rendering labels and
 * formatting values so school sees "Class"/"Term", college "Stream"/"Semester", etc.
 *
 * Backend can expose this via API (e.g. Inertia shared or /api/scope-type-display);
 * frontend should mirror this config and use it for every API and content that
 * shows scope-dependent labels/values.
 */
return [
    /*
    |--------------------------------------------------------------------------
    | Student profile / student show context
    |--------------------------------------------------------------------------
    */
    'student_profile' => [
        'school' => [
            'section_titles' => ['academic' => 'Class & session'],
            'field_labels' => [
                'stream' => 'Class',
                'session' => 'Session',
                'subject' => 'Subject',
                'current_semester' => 'Current Term',
            ],
            'value_format' => ['current_semester' => 'term'],
        ],
        'college' => [
            'section_titles' => ['academic' => 'Stream & session'],
            'field_labels' => [
                'stream' => 'Stream',
                'session' => 'Session',
                'subject' => 'Subject',
                'current_semester' => 'Current Semester',
            ],
            'value_format' => ['current_semester' => 'semester'],
        ],
        'coaching' => [
            'section_titles' => ['academic' => 'Batch & session'],
            'field_labels' => [
                'stream' => 'Batch',
                'session' => 'Session',
                'subject' => 'Subject',
                'current_semester' => 'Current Term',
            ],
            'value_format' => ['current_semester' => 'term'],
        ],
        'university' => [
            'section_titles' => ['academic' => 'Stream & session'],
            'field_labels' => [
                'stream' => 'Stream',
                'session' => 'Session',
                'subject' => 'Subject',
                'current_semester' => 'Current Semester',
            ],
            'value_format' => ['current_semester' => 'semester'],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Student list (manage) – columns, filters, guidance
    |--------------------------------------------------------------------------
    */
    'student_list' => [
        'school' => [
            'column_stream_session' => 'Class / Session',
            'filter_stream_placeholder' => 'Class',
            'filter_stream_option_all' => 'All Classes',
            'guidance_stream_phrase' => 'class',
        ],
        'college' => [
            'column_stream_session' => 'Stream / Session',
            'filter_stream_placeholder' => 'Stream',
            'filter_stream_option_all' => 'All Streams',
            'guidance_stream_phrase' => 'stream',
        ],
        'coaching' => [
            'column_stream_session' => 'Batch / Session',
            'filter_stream_placeholder' => 'Batch',
            'filter_stream_option_all' => 'All Batches',
            'guidance_stream_phrase' => 'batch',
        ],
        'university' => [
            'column_stream_session' => 'Stream / Session',
            'filter_stream_placeholder' => 'Stream',
            'filter_stream_option_all' => 'All Streams',
            'guidance_stream_phrase' => 'stream',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Student analytics – table title and column headers
    |--------------------------------------------------------------------------
    */
    'student_analytics' => [
        'school' => [
            'table_title_suffix' => 'Class / Course',
            'column_main_stream' => 'Main Class',
            'column_stream_course' => 'Class / Course',
        ],
        'college' => [
            'table_title_suffix' => 'Stream / Course',
            'column_main_stream' => 'Main Stream',
            'column_stream_course' => 'Stream / Course',
        ],
        'coaching' => [
            'table_title_suffix' => 'Batch / Course',
            'column_main_stream' => 'Main Batch',
            'column_stream_course' => 'Batch / Course',
        ],
        'university' => [
            'table_title_suffix' => 'Stream / Course',
            'column_main_stream' => 'Main Stream',
            'column_stream_course' => 'Stream / Course',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Certificate heads / stream filter
    |--------------------------------------------------------------------------
    */
    'certificate_heads' => [
        'school' => [
            'filter_stream_option_all' => 'All Classes',
            'filter_main_stream_option_all' => 'All Main Classes',
        ],
        'college' => [
            'filter_stream_option_all' => 'All Streams',
            'filter_main_stream_option_all' => 'All Main Streams',
        ],
        'coaching' => [
            'filter_stream_option_all' => 'All Batches',
            'filter_main_stream_option_all' => 'All Main Batches',
        ],
        'university' => [
            'filter_stream_option_all' => 'All Streams',
            'filter_main_stream_option_all' => 'All Main Streams',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Student edit form – field labels and payload (API shape unchanged)
    |--------------------------------------------------------------------------
    */
    'student_edit_form' => [
        'school' => [
            'field_labels' => [
                'main_stream_id' => 'Main Class',
                'stream_id' => 'Class',
                'session_id' => 'Session',
                'subject_id' => 'Subject',
                'current_semester' => 'Current Term',
            ],
        ],
        'college' => [
            'field_labels' => [
                'main_stream_id' => 'Main Stream',
                'stream_id' => 'Stream',
                'session_id' => 'Session',
                'subject_id' => 'Subject',
                'current_semester' => 'Current Semester',
            ],
        ],
        'coaching' => [
            'field_labels' => [
                'main_stream_id' => 'Main Batch',
                'stream_id' => 'Batch',
                'session_id' => 'Session',
                'subject_id' => 'Subject',
                'current_semester' => 'Current Term',
            ],
        ],
        'university' => [
            'field_labels' => [
                'main_stream_id' => 'Main Stream',
                'stream_id' => 'Stream',
                'session_id' => 'Session',
                'subject_id' => 'Subject',
                'current_semester' => 'Current Semester',
            ],
        ],
    ],
];

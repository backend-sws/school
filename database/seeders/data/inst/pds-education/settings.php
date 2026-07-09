<?php

/**
 * PDS Education institutional settings.
 */
return [
    // ── General ─────────────────────────────────────────────
    ['setting_key' => 'college_name', 'setting_value' => 'PDS Education', 'setting_group' => 'general'],
    ['setting_key' => 'college_short_name', 'setting_value' => 'PDS Edu', 'setting_group' => 'general'],
    ['setting_key' => 'college_motto', 'setting_value' => 'Empowering Education, Building Futures', 'setting_group' => 'general'],
    ['setting_key' => 'college_code', 'setting_value' => 'PDSEDU', 'setting_group' => 'general'],
    ['setting_key' => 'established_year', 'setting_value' => '2020', 'setting_group' => 'general'],
    ['setting_key' => 'college_logo', 'setting_value' => '/assets/logo.png', 'setting_group' => 'general'],
    ['setting_key' => 'college_affiliation', 'setting_value' => '', 'setting_group' => 'general'],

    // ── Social / Contact ────────────────────────────────────
    ['setting_key' => 'contact_email', 'setting_value' => 'info@pdseducation.tech', 'setting_group' => 'social'],
    ['setting_key' => 'contact_phone', 'setting_value' => '', 'setting_group' => 'social'],
    ['setting_key' => 'full_address', 'setting_value' => '', 'setting_group' => 'social'],
    ['setting_key' => 'college_website', 'setting_value' => 'pdseducation.tech', 'setting_group' => 'social'],

    // ── Auth Panel ──────────────────────────────────────────
    ['setting_key' => 'auth_quote_message', 'setting_value' => 'Education is the most powerful weapon which you can use to change the world.', 'setting_group' => 'auth_panel'],
    ['setting_key' => 'auth_quote_author', 'setting_value' => 'Nelson Mandela', 'setting_group' => 'auth_panel'],
    [
        'setting_key' => 'auth_features',
        'setting_value' => [
            ['label' => 'Online Admission', 'href' => '/academics#admission'],
            ['label' => 'Parent Portal', 'href' => '/student-portal/login'],
            ['label' => 'Fee Payment', 'href' => '/student-portal/login'],
            ['label' => 'Student Dashboard', 'href' => '/student-portal/login'],
        ],
        'setting_group' => 'auth_panel'
    ],

    // ── About / Vision / Mission ────────────────────────────
    ['setting_key' => 'about_title', 'setting_value' => 'Welcome to PDS Education', 'setting_group' => 'general'],
    ['setting_key' => 'about_content', 'setting_value' => '<p>PDS Education is a premier educational institution committed to delivering world-class learning experiences.</p>', 'setting_group' => 'general'],
    ['setting_key' => 'mission_statement', 'setting_value' => '<p>To provide accessible, high-quality education that empowers students with knowledge, skills, and values.</p>', 'setting_group' => 'general'],
    ['setting_key' => 'vision_statement', 'setting_value' => '<p>To be a leading educational institution recognized for transformative learning and innovation.</p>', 'setting_group' => 'general'],

    // ── Admission ───────────────────────────────────────────
    ['setting_key' => 'enable_re_admission', 'setting_value' => 'true', 'setting_group' => 'admission'],
    ['setting_key' => 'admission_readmission_enabled', 'setting_value' => '1', 'setting_group' => 'admission'],
    ['setting_key' => 'admission_new_instruction', 'setting_value' => '<p>Register your ward online through the school portal. Upload required documents and complete the fee payment.</p>', 'setting_group' => 'admission'],

    // ── Payment ─────────────────────────────────────────────
    ['setting_key' => 'payment_gateway', 'setting_value' => 'sabpaisa', 'setting_group' => 'payment'],
];

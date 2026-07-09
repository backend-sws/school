<?php

/**
 * Base institution records – one per type (school, college, coaching, university).
 * Used by InstitutionSeeder. Keys: type, name, code, city, state, address, etc.
 * Optional: organization_id links institution to an organization (run OrganizationSeeder first).
 */
return [
    [
        'id' => 1,
        'type' => 'school',
        'name' => 'PDS Education',
        'code' => 'PDSEDU',
        'city' => '',
        'state' => 'Bihar',
        'address' => '',
        'pincode' => '',
        'phone' => '',
        'email' => 'info@pdseducation.tech',
        'website' => 'https://pdseducation.tech',
        'domain' => 'pdseducation.tech',
        'logo_url' => null,
        'status' => 1,
    ],
];

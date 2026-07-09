<?php

/**
 * Optional organization records (parent). One organization can have many institutions (schools/colleges/universities).
 * Used by OrganizationSeeder. After seeding, assign institutions to an organization via
 * PUT /api/v1/institutions/{id} with { "organization_id": 1 } or via InstitutionSeeder data.
 */
return [
    [
        'id' => 1,
        'name' => 'PDS Education',
        'code' => 'PDSEDU',
        'city' => '',
        'state' => 'Bihar',
        'address' => '',
        'pincode' => '',
        'phone' => '',
        'email' => 'info@pdseducation.tech',
        'website' => 'https://pdseducation.tech',
        'logo_url' => null,
        'status' => 1,
    ],
];

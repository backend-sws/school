<?php

/**
 * EMS Branding Configuration
 *
 * Centralises all EMS_* branding/footer environment variables
 * so they are never called via env() outside this config file.
 *
 * Usage: config('ems_branding.brand_name'), config('ems_branding.powered_by'), etc.
 */

return [
    'brand_name' => env('EMS_BRAND_NAME', env('APP_NAME', 'Laravel')),
    'powered_by' => env('EMS_POWERED_BY', 'StartupWebSupport'),
    'powered_by_url' => env('EMS_POWERED_BY_URL', 'https://startupwebsupport.com'),
    'designed_by' => env('EMS_DESIGNED_BY', ''),
    'designed_by_url' => env('EMS_DESIGNED_BY_URL', '#'),
    'copyright_by' => env('EMS_COPYRIGHT_BY', ''),
    'site_url' => env('EMS_SITE_URL', env('APP_URL', '/')),
];

<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'payu' => [
        'key' => env('PAYU_MERCHANT_KEY'),
        'salt' => env('PAYU_SALT'),
        'mode' => env('PAYU_MODE', 'test'),
        'url' => env('PAYU_MODE', 'test') == 'test' ? 'https://sandboxsecure.payu.in' : 'https://secure.payu.in',
        'surl' => env('APP_URL') . '/api/' . env('API_VERSION', 'v1') . '/payments/payu/callback',
        'furl' => env('APP_URL') . '/api/' . env('API_VERSION', 'v1') . '/payments/payu/callback',
    ],

      '2factor' => [
        'api_key' => env('TWO_FACTOR_API_KEY'),
    ],

    'sms' => [
        'api_key'        => env('SMS_API_KEY'),
        'sender_id'      => env('SMS_SENDER_ID'),
        'template_id'    => env('SMS_TEMPLATE_ID'),
        'base_url'       => env('SMS_BASE_URL', 'http://web.adcruxmedia.in/vb/apikey.php'),
        'short_url_base' => env('SMS_SHORT_URL_BASE'), // e.g. https://pds.in — for compact short URLs in SMS
    ],

    'whatsapp' => [
        'provider'                => env('WHATSAPP_PROVIDER', 'msg91'),
        'msg91_auth_key'          => env('WHATSAPP_MSG91_AUTH_KEY'),
        'msg91_integrated_number' => env('WHATSAPP_MSG91_INTEGRATED_NUMBER'),
        'msg91_default_template'  => env('WHATSAPP_MSG91_DEFAULT_TEMPLATE', 'default_notification_v1'),
        'webhook_secret'          => env('WHATSAPP_WEBHOOK_SECRET'),
    ],


    'google' => [
        'analytics_id' => env('GA_MEASUREMENT_ID'),
    ],

];

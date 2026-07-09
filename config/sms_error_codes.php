<?php

/**
 * Adcrux SMS Provider — Response Code Map.
 *
 * Maps Adcrux HTTP API response codes to human-readable descriptions.
 * Used by SmsService::dispatchToProvider() to enrich error messages
 * in logs and CommunicationLog records.
 *
 * Code "011" = success — everything else is a failure reason.
 *
 * @see App\Services\SmsService::dispatchToProvider()
 * @see https://web.adcruxmedia.in (provider docs)
 */
return [

    // ─── Success ───────────────────────────────────────────────────────
    '011' => 'Success',

    // ─── Delivery Failures ─────────────────────────────────────────────
    '001' => 'Invalid Number',
    '002' => 'Absent Subscriber',
    '003' => 'Memory Capacity Exceeded',
    '004' => 'Mobile Equipment Error',
    '005' => 'Network Error',
    '006' => 'Barring',
    '007' => 'Invalid Sender ID',
    '008' => 'Dropped',
    '009' => 'NDNC Failed',
    '010' => 'Unknown Subscriber',

    // ─── General / Account ─────────────────────────────────────────────
    '100' => 'Misc. Error',
    '101' => 'Insufficient Balance',
    '102' => 'Invalid URL / Malformed Request',
    '103' => 'DND',

    // ─── DLT / Entity ──────────────────────────────────────────────────
    '111' => 'Entity not registered',
    '112' => 'Entity Inactive',
    '113' => 'Header not mapped to Entity',
    '114' => 'Invalid Telemarketer',
    '115' => 'CLI Mismatch with Template',
    '116' => 'Header Inactive',
    '117' => 'Header Blacklisted',
    '118' => 'Template not found',
    '119' => 'Template Inactive',
    '120' => 'Template not Matched',
    '121' => 'Template blacklisted',
    '122' => 'Invalid Consent',
    '123' => 'General Consent error',
    '124' => 'DLT Miscellaneous error',
    '125' => 'TEMPLATE_VARIABLE_EXCEEDED',
    '126' => 'Invalid Template id',
    '127' => 'Header not found',
    '128' => 'Entity blacklisted',
    '129' => 'Entity not found',

    // ─── PE-TM / Hash ──────────────────────────────────────────────────
    '614' => 'PE TM HASH NOT RECEIVED',
    '615' => 'PE_TM_HASH_NOT_REGISTERED',

    // ─── CTA / Whitelisting ────────────────────────────────────────────
    '642' => 'CTA_NOT_WHITELISTED',
    '700' => 'No CTA whitelisted',
    '701' => 'URL CTA not matched with whitelisted data',

    // ─── PE-TM Chain ───────────────────────────────────────────────────
    '811' => 'PE-TM chain is inactive',
    '812' => 'Invalid PE-TM hash',
    '813' => 'Hash does not match with PE-TM Chain',

];

<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Re-Admission Eligible Statuses
    |--------------------------------------------------------------------------
    |
    | Enrollment statuses that qualify a student for re-admission.
    | 'dropout' statuses  → traditional re-admission (dropped/transferred/alumni)
    | 'session' statuses  → session-to-session re-admission (active/promoted)
    |
    */

    'readmission_eligible_statuses' => [
        // Traditional dropout re-admission
        'dropped',
        'transferred',
        'alumni',
        // Session-to-session re-admission
        'active',
        'promoted',
    ],

    /*
    |--------------------------------------------------------------------------
    | Dropout-Only Re-Admission Statuses
    |--------------------------------------------------------------------------
    |
    | Subset of statuses for the dropout re-admission workflow (original flow).
    |
    */

    'dropout_readmission_statuses' => [
        'dropped',
        'transferred',
        'alumni',
    ],

];

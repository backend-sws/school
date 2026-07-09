<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Admission Email Content — Config-Driven Copy
    |--------------------------------------------------------------------------
    |
    | All user-facing strings for admission notification emails live here.
    | Change the copy without touching notification classes.
    |
    | Keys: new = fresh admission, readmission = returning student
    |
    */

    // ── Application Submitted ───────────────────────────────────────────

    'submitted' => [
        'new' => [
            'greeting' => 'Hello :name!',
            'closing'  => 'Thank you for applying! You will be notified when the status changes.',
            'cta_label' => 'Set Your Password',
            'cta_url'   => '/set-password',
        ],
        'readmission' => [
            'greeting' => 'Welcome back, :name!',
            'closing'  => 'We are glad to have you back. You will be notified when the status changes.',
            'cta_label' => 'Login to Student Dashboard',
            'cta_url'   => '/login',
        ],
    ],

    // ── Payment Recorded ────────────────────────────────────────────────

    'payment' => [
        'new' => [
            'greeting' => 'Hello :name!',
            'closing'  => 'Thank you for your payment!',
            'cta_label' => 'Set Your Password',
            'cta_url'   => '/set-password',
        ],
        'readmission' => [
            'greeting' => 'Hello :name!',
            'closing'  => 'Thank you for your payment!',
            'cta_label' => 'Login to Student Dashboard',
            'cta_url'   => '/login',
        ],
    ],

    // ── Status Changed ──────────────────────────────────────────────────

    'status' => [
        'new' => [
            'greeting' => 'Hello :name!',
            'closing_approved'  => 'Congratulations! Please complete the admission formalities.',
            'closing_rejected'  => 'If you have questions, please contact the admission office.',
            'closing_default'   => 'You will be notified of further updates.',
            'cta_label' => 'Set Your Password',
            'cta_url'   => '/set-password',
        ],
        'readmission' => [
            'greeting' => 'Welcome back, :name!',
            'closing_approved'  => 'We are glad to have you back! Please complete the admission formalities.',
            'closing_rejected'  => 'If you have questions, please contact the admission office.',
            'closing_default'   => 'You will be notified of further updates.',
            'cta_label' => 'Login to Student Dashboard',
            'cta_url'   => '/login',
        ],
    ],

];

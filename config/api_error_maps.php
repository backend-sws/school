<?php

/**
 * Centralized API error map.
 *
 * Usage:
 *   ApiErrorMap::respond('onboarding.domain_taken')       → JsonResponse
 *   ApiErrorMap::respond('auth.unauthorized', ['extra'])   → with extra payload
 *   ApiErrorMap::abort('generic.not_found')                → throws HttpException
 *   ApiErrorMap::message('billing.invalid_plan')           → string
 *   ApiErrorMap::status('generic.forbidden')               → int
 *   ApiErrorMap::validationError('onboarding.domain_taken', 'slug') → back() with withErrors
 *
 * Group keys by domain (auth, onboarding, billing, attendance, storage, generic).
 */
return [

    // ─── Generic ────────────────────────────────────────────────────────
    'generic.not_found' => [
        'message' => 'The requested resource was not found.',
        'status' => 404,
    ],
    'generic.forbidden' => [
        'message' => 'You do not have permission to perform this action.',
        'status' => 403,
    ],
    'generic.unauthorized' => [
        'message' => 'Authentication required.',
        'status' => 401,
    ],
    'generic.server_error' => [
        'message' => 'An unexpected error occurred. Please try again later.',
        'status' => 500,
    ],
    'generic.invalid_request' => [
        'message' => 'The request is invalid.',
        'status' => 400,
    ],

    // ─── Auth ───────────────────────────────────────────────────────────
    'auth.invalid_credentials' => [
        'message' => 'Invalid email or password.',
        'status' => 401,
    ],
    'auth.email_not_verified' => [
        'message' => 'Please verify your email address before proceeding.',
        'status' => 403,
    ],
    'auth.account_disabled' => [
        'message' => 'Your account has been disabled. Contact your administrator.',
        'status' => 403,
    ],
    'auth.token_expired' => [
        'message' => 'Your session has expired. Please log in again.',
        'status' => 401,
    ],

    // ─── Onboarding ─────────────────────────────────────────────────────
    'onboarding.domain_taken' => [
        'message' => 'This workspace domain is already taken.',
        'status' => 422,
    ],
    'onboarding.verification_expired' => [
        'message' => 'Invalid or expired verification link. Please register again.',
        'status' => 422,
    ],
    'onboarding.resend_failed' => [
        'message' => 'Unable to resend verification email.',
        'status' => 422,
    ],
    'onboarding.unknown_category' => [
        'message' => 'Unknown data category.',
        'status' => 404,
    ],

    // ─── Billing / Subscription ─────────────────────────────────────────
    'billing.invalid_plan' => [
        'message' => 'Invalid subscription plan selected.',
        'status' => 422,
    ],
    'billing.org_not_found' => [
        'message' => 'Organization not found.',
        'status' => 404,
    ],
    'billing.institution_limit' => [
        'message' => 'You have reached the maximum number of institutions for your current plan.',
        'status' => 403,
    ],
    'billing.user_limit' => [
        'message' => 'You have reached the maximum number of users for your current plan.',
        'status' => 403,
    ],
    'billing.staff_limit' => [
        'message' => 'You have reached the maximum number of staff for your current plan.',
        'status' => 403,
    ],
    'billing.email_quota_exceeded' => [
        'message' => 'Monthly email quota exceeded for your current plan.',
        'status' => 403,
    ],

    // ─── Attendance ─────────────────────────────────────────────────────
    'attendance.class_access_denied' => [
        'message' => 'You do not have access to this class for attendance.',
        'status' => 403,
    ],
    'attendance.subject_mismatch' => [
        'message' => 'You can only manage attendance for your assigned subject.',
        'status' => 403,
    ],
    'attendance.invalid_allocation' => [
        'message' => 'Invalid allocation for this class.',
        'status' => 403,
    ],

    // ─── Storage / Upload ───────────────────────────────────────────────
    'storage.invalid_path' => [
        'message' => 'Invalid file path.',
        'status' => 422,
    ],

    // ─── Institution / Organization ─────────────────────────────────────
    'institution.not_found' => [
        'message' => 'Institution not found.',
        'status' => 404,
    ],
    'institution.domain_not_found' => [
        'message' => 'Institution not found for this domain.',
        'status' => 404,
    ],

    // ─── Documents ──────────────────────────────────────────────────────
    'document.not_found' => [
        'message' => 'The requested document was not found.',
        'status' => 404,
    ],

    // ─── SMS ────────────────────────────────────────────────────────────
    'sms.quota_exceeded' => [
        'message' => 'SMS quota exceeded. Please contact your administrator to increase your limit.',
        'status' => 429,
    ],
    'whatsapp.quota_exceeded' => [
        'message' => 'WhatsApp messaging quota exceeded. Please contact your administrator to increase your limit.',
        'status' => 429,
    ],


    // ─── Question Bank ─────────────────────────────────────────────────
    'question_bank.not_found' => [
        'message' => 'Question not found.',
        'status' => 404,
    ],
    'question_bank.category_not_found' => [
        'message' => 'Question category not found.',
        'status' => 404,
    ],

    // ─── Import ─────────────────────────────────────────────────────────
    'import.invalid_module' => [
        'message' => 'The selected module is invalid for import.',
        'status' => 422,
    ],
    'import.log_not_found' => [
        'message' => 'The requested import log was not found.',
        'status' => 404,
    ],
    'import.institution_context_missing' => [
        'message' => 'No institution context found. Please ensure you are logged into an active institution.',
        'status' => 422,
    ],

    // ─── Admission ─────────────────────────────────────────────────────
    'admission.duplicate_record' => [
        'message' => 'A duplicate record was detected. This mobile number or email is already linked to another account. Please verify the applicant details and try again.',
        'status' => 422,
    ],
    'admission.submission_failed' => [
        'message' => 'Something went wrong while submitting the application. Please try again or contact support.',
        'status' => 500,
    ],
    'admission.overpayment_not_allowed' => [
        'message' => 'Collected amount cannot exceed payable amount for admission.',
        'status' => 422,
    ],

];

@extends('emails.layouts.base', [
    'preheader' => 'Verify your email to link your parent account at ' . $institutionName,
    'headerIcon' => '🔗',
    'institutionName' => $institutionName,
    'institutionLogo' => $institutionLogo ?? null,
    'subtitle' => 'Account Verification',
    'title' => 'Verify email to link parent account – ' . $institutionName,
])

@section('content')
@php($t = \App\Support\EmailTemplate::tokens())

<h2 style="margin:0 0 8px; font-size:22px; font-weight:700; color:{{ $t['primary'] }}; text-align:center; line-height:1.3;">Link Your Parent Account</h2>
<p style="margin:0 0 24px; font-size:15px; color:{{ $t['text_muted'] }}; text-align:center; line-height:1.6;">
    You requested to link your account as a parent/guardian. Click the button below to verify this email address.
    Once verified, you will be able to view your linked students and access the parent dashboard.
</p>

@include('emails.partials.button', ['url' => $verifyUrl, 'label' => 'Verify Email & Link Account'])

@include('emails.partials.info-box', [
    'icon' => '⏱️',
    'text' => 'This link expires in <strong style="color:' . $t['text'] . ';">24 hours</strong>. If you did not request this, you can safely ignore this email.',
])

@include('emails.partials.link-fallback', ['url' => $verifyUrl])

<p style="margin:24px 0 0; font-size:13px; color:{{ $t['text_faint'] }}; text-align:center; line-height:1.5;">
    If you did not request this, you can safely ignore this email.
</p>
@endsection
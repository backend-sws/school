@extends('emails.layouts.base', [
    'preheader'       => 'Set your password and access your account at ' . $collegeName,
    'headerIcon'      => '🔐',
    'institutionName' => $collegeName,
    'institutionLogo' => $collegeLogo ?? null,
    'subtitle'        => 'Student Portal',
    'title'           => 'Verify your account – ' . $collegeName,
])

@section('content')
@php($t = \App\Support\EmailTemplate::tokens())

<h2 style="margin:0 0 8px; font-size:22px; font-weight:700; color:{{ $t['primary'] }}; text-align:center; line-height:1.3;">Set Your Password</h2>
<p style="margin:0 0 24px; font-size:15px; color:{{ $t['text_muted'] }}; text-align:center; line-height:1.6;">
    Dear <strong style="color:{{ $t['text'] }};">{{ $userName }}</strong>, your account has been verified. Please set your password to access the student portal.
</p>

@include('emails.partials.button', ['url' => $verifyUrl, 'label' => 'Set Password & Login'])

@include('emails.partials.info-box', [
    'icon' => '⏱️',
    'text' => 'This link expires in <strong style="color:' . $t['text'] . ';">7 days</strong>. After setting your password, you\'ll be redirected to your dashboard.',
])

@include('emails.partials.link-fallback', ['url' => $verifyUrl])

<p style="margin:24px 0 0; font-size:13px; color:{{ $t['text_faint'] }}; text-align:center; line-height:1.5;">
    If you did not apply for admission, you can safely ignore this email.
</p>
@endsection
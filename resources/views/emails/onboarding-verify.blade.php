@extends('emails.layouts.base', [
    'preheader' => 'Verify your email to continue setting up your workspace',
    'headerIcon' => '📧',
    'institutionName' => config('app.name'),
    'subtitle' => 'Institutional Operating System',
    'title' => 'Verify Your Email — ' . config('app.name'),
])

@section('content')
@php($t = \App\Support\EmailTemplate::tokens())

<h2 style="margin:0 0 8px; font-size:22px; font-weight:700; color:{{ $t['primary'] }}; text-align:center; line-height:1.3;">Verify Your Email</h2>
<p style="margin:0 0 24px; font-size:15px; color:{{ $t['text_muted'] }}; text-align:center; line-height:1.6;">
    Hi <strong style="color:{{ $t['text'] }};">{{ $user->name }}</strong>, thanks for signing up!
    Please click the button below to verify your email and continue setting up your workspace.
</p>

@include('emails.partials.button', ['url' => $verifyUrl, 'label' => 'Verify Email & Continue'])

@include('emails.partials.info-box', [
    'icon' => '✅',
    'text' => '<strong style="color:' . $t['text'] . ';">You can open this link in any browser or device.</strong> The registration page will automatically redirect you to plan selection once verified.',
])

@include('emails.partials.link-fallback', ['url' => $verifyUrl])

<p style="margin:24px 0 0; font-size:13px; color:{{ $t['text_faint'] }}; text-align:center; line-height:1.5;">
    If you didn't create an account, you can safely ignore this email.
</p>
@endsection
@extends('emails.layouts.base', [
    'preheader' => 'You have been invited to join ' . ($institutionName ?? config('app.name')) . ' as a staff member',
    'headerIcon' => '✉️',
    'institutionName' => $institutionName ?? config('app.name'),
    'subtitle' => 'Staff Invitation',
    'title' => 'Staff Invitation – ' . ($institutionName ?? config('app.name')),
])

@section('content')
@php($t = \App\Support\EmailTemplate::tokens())

<h2 style="margin:0 0 8px; font-size:22px; font-weight:700; color:{{ $t['primary'] }}; text-align:center; line-height:1.3;">You're Invited!</h2>
<p style="margin:0 0 24px; font-size:15px; color:{{ $t['text_muted'] }}; text-align:center; line-height:1.6;">
    Hello <strong style="color:{{ $t['text'] }};">{{ $recipientName }}</strong>, you have been invited to join
    <strong style="color:{{ $t['text'] }};">{{ $institutionName }}</strong> as a staff member.
    Click below to set up your account and password.
</p>

@include('emails.partials.button', ['url' => $url, 'label' => 'Set Up Account'])

@include('emails.partials.info-box', [
    'icon' => '⏱️',
    'text' => 'This invitation expires in <strong style="color:' . $t['text'] . ';">' . $expiryDays . ' days</strong>. After setting your password, you\'ll be redirected to your dashboard.',
])

@include('emails.partials.link-fallback', ['url' => $url])

<p style="margin:24px 0 0; font-size:13px; color:{{ $t['text_faint'] }}; text-align:center; line-height:1.5;">
    If you did not expect this invitation, no further action is required.
</p>
@endsection
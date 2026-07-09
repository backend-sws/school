@extends('emails.layouts.base', [
    'preheader' => 'Your student ' . $studentName . ' has been onboarded at ' . $institutionName,
    'headerIcon' => '🎉',
    'institutionName' => $institutionName,
    'institutionLogo' => $institutionLogo ?? null,
    'subtitle' => 'Parent Notification',
    'title' => 'Your student is onboarded – ' . $institutionName,
])

@section('content')
@php($t = \App\Support\EmailTemplate::tokens())

<h2 style="margin:0 0 8px; font-size:22px; font-weight:700; color:{{ $t['primary'] }}; text-align:center; line-height:1.3;">Student Onboarded!</h2>
<p style="margin:0 0 24px; font-size:15px; color:{{ $t['text_muted'] }}; text-align:center; line-height:1.6;">
    Dear Parent / Guardian, your student <strong style="color:{{ $t['text'] }};">{{ $studentName }}</strong>
    has been onboarded. You can access your parent panel using the ID and password you set before.
    After logging in, you will be taken to your parent dashboard where you can view all your linked students.
</p>

@include('emails.partials.button', ['url' => $loginUrl, 'label' => 'Log In to Your Panel'])

@include('emails.partials.link-fallback', ['url' => $loginUrl])
@endsection
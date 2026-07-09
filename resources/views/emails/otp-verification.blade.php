@extends('emails.layouts.base', [
    'preheader'       => 'Your OTP Verification Code for ' . $collegeName,
    'headerIcon'      => '🔐',
    'institutionName' => $collegeName,
    'institutionLogo' => $collegeLogo ?? null,
    'subtitle'        => 'Verification Code',
    'title'           => 'Your OTP Code – ' . $collegeName,
])

@section('content')
@php($t = \App\Support\EmailTemplate::tokens())

<h2 style="margin:0 0 8px; font-size:22px; font-weight:700; color:{{ $t['primary'] }}; text-align:center; line-height:1.3;">Login Verification</h2>
<p style="margin:0 0 24px; font-size:15px; color:{{ $t['text_muted'] }}; text-align:center; line-height:1.6;">
    You requested an OTP to login. Please use the following One-Time Password to complete your verification.
</p>

<div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 24px;">
    <h1 style="margin: 0; font-size: 32px; letter-spacing: 4px; color: {{$t['primary']}}">{{ $otp }}</h1>
</div>

@include('emails.partials.info-box', [
    'icon' => '⏱️',
    'text' => 'This OTP is valid for <strong style="color:' . $t['text'] . ';">10 minutes</strong>. Do not share this code with anyone.',
])

<p style="margin:24px 0 0; font-size:13px; color:{{ $t['text_faint'] }}; text-align:center; line-height:1.5;">
    If you did not request this OTP, you can safely ignore this email.
</p>
@endsection

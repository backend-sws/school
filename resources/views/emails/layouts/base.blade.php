{{--
Shared base layout for all EMS transactional emails.

Usage:
@extends('emails.layouts.base', [
'preheader' => 'Hidden preview text',
'headerIcon' => '🔐', // emoji or omit for logo
'institutionName' => $collegeName,
'institutionLogo' => $collegeLogo, // optional URL
'subtitle' => 'Student Portal', // optional subtitle under name
])

@section('content') ... @endsection
--}}
@php($t = \App\Support\EmailTemplate::tokens())
<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>{{ $title ?? ($institutionName ?? config('app.name')) }}</title>
</head>

<body
    style="margin:0; padding:0; background-color:{{ $t['bg'] }}; font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; -webkit-font-smoothing:antialiased;">

    {{-- Preheader (hidden preview text) --}}
    @if(!empty($preheader))
        <div style="display:none; max-height:0; overflow:hidden; font-size:1px; line-height:1px; color:{{ $t['bg'] }};">
            {{ $preheader }}
        </div>
    @endif

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:{{ $t['bg'] }};">
        <tr>
            <td align="center" style="padding:40px 16px;">
                <table role="presentation" width="560" cellpadding="0" cellspacing="0"
                    style="max-width:560px; width:100%; background:{{ $t['card'] }}; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">

                    {{-- ── Header ──────────────────────────────── --}}
                    <tr>
                        <td style="background:{{ $t['gradient'] }}; padding:36px 32px; text-align:center;">
                            @if(!empty($institutionLogo))
                                <img src="{{ $institutionLogo }}" alt="{{ $institutionName ?? '' }}" width="72" height="72"
                                    style="display:block; margin:0 auto 16px; border-radius:14px; border:2px solid rgba(255,255,255,0.15);">
                            @endif
                            <h1
                                style="margin:0; color:#ffffff; font-size:20px; font-weight:700; letter-spacing:0.3px; line-height:1.3;">
                                {{ $institutionName ?? config('app.name') }}
                            </h1>
                            @if(!empty($subtitle))
                                <p
                                    style="margin:6px 0 0; color:rgba(255,255,255,0.5); font-size:11px; letter-spacing:2px; text-transform:uppercase;">
                                    {{ $subtitle }}
                                </p>
                            @endif
                        </td>
                    </tr>

                    {{-- ── Floating Icon Badge ─────────────────── --}}
                    @if(!empty($headerIcon))
                        <tr>
                            <td align="center" style="padding:0;">
                                <div
                                    style="width:56px; height:56px; margin:-28px auto 0; background:{{ $t['card'] }}; border-radius:50%; box-shadow:0 4px 12px rgba(0,0,0,0.1); line-height:56px; font-size:24px; text-align:center;">
                                    {{ $headerIcon }}
                                </div>
                            </td>
                        </tr>
                    @endif

                    {{-- ── Content (provided by child) ─────────── --}}
                    <tr>
                        <td style="padding:{{ !empty($headerIcon) ? '20px' : '36px' }} 36px 40px;">
                            @yield('content')
                        </td>
                    </tr>

                    {{-- ── Footer ──────────────────────────────── --}}
                    <tr>
                        <td style="background:{{ $t['footer_bg'] }}; padding:24px 32px; text-align:center;">
                            <p style="margin:0; font-size:12px; color:{{ $t['footer_text'] }}; line-height:1.6;">
                                &copy; {{ date('Y') }}
                                <strong>{{ $t['copyright_by'] ?? $institutionName ?? config('app.name') }}</strong>. All
                                rights reserved.
                            </p>
                            @if(!empty($t['site_url']))
                                <p style="margin:6px 0 0; font-size:11px;">
                                    <a href="{{ $t['site_url'] }}"
                                        style="color:{{ $t['footer_text'] }}; text-decoration:underline;">{{ preg_replace('#^https?://#', '', $t['site_url']) }}</a>
                                </p>
                            @endif
                            @if(!empty($t['designed_by']))
                                <p
                                    style="margin:6px 0 0; font-size:9px; color:{{ $t['footer_faint'] }}; text-transform:uppercase; letter-spacing:1.5px;">
                                    Designed by @if(!empty($t['designed_by_url']))<a href="{{ $t['designed_by_url'] }}"
                                    style="color:{{ $t['footer_faint'] }}; text-decoration:underline;">{{ $t['designed_by'] }}</a>@else{{ $t['designed_by'] }}@endif
                                </p>
                            @endif
                            <p
                                style="margin:4px 0 0; font-size:9px; color:{{ $t['footer_faint'] }}; text-transform:uppercase; letter-spacing:1.5px;">
                                Powered by @if(!empty($t['powered_by_url']))<a href="{{ $t['powered_by_url'] }}"
                                style="color:{{ $t['footer_faint'] }}; text-decoration:underline;">{{ $t['powered_by'] }}</a>@else{{ $t['powered_by'] }}@endif
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>

</html>
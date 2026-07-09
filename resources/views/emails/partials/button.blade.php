{{--
Reusable CTA button partial for email templates.
Usage: @include('emails.partials.button', ['url' => $url, 'label' => 'Set Password'])
--}}
@php($t = \App\Support\EmailTemplate::tokens())
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
        <td align="center" style="padding:8px 0 24px;">
            <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:separate;">
                <tr>
                    <td align="center" bgcolor="{{ $t['primary'] }}"
                        style="background-color:{{ $t['primary'] }}; border-radius:10px;">
                        <a href="{{ $url }}" target="_blank"
                            style="display:inline-block; color:#ffffff; text-decoration:none; font-weight:700; font-size:15px; padding:14px 40px; border-radius:10px; letter-spacing:0.3px; mso-padding-alt:0; text-underline-color:#ffffff;">
                            {{ $label ?? 'Continue' }} &rarr;
                        </a>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
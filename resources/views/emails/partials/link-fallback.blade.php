{{--
Reusable link-fallback partial for email templates.
Usage: @include('emails.partials.link-fallback', ['url' => $url])
--}}
@php($t = \App\Support\EmailTemplate::tokens())
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
    <tr>
        <td style="background:{{ $t['fallback_bg'] }}; border-radius:8px; padding:14px 16px;">
            <p
                style="margin:0 0 4px; font-size:11px; font-weight:600; color:{{ $t['text_faint'] }}; text-transform:uppercase; letter-spacing:0.5px;">
                Can't click the button?</p>
            <p style="margin:0; font-size:12px; color:{{ $t['text'] }}; word-break:break-all; line-height:1.5;">
                <a href="{{ $url }}" style="color:{{ $t['primary_end'] }}; text-decoration:none;">{{ $url }}</a>
            </p>
        </td>
    </tr>
</table>
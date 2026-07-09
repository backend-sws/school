{{--
Reusable info box partial for email templates.
Usage: @include('emails.partials.info-box', ['icon' => '⏱️', 'text' => 'This link expires...'])
--}}
@php($t = \App\Support\EmailTemplate::tokens())
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
        <td
            style="background:{{ $t['info_bg'] }}; border:1px solid {{ $t['border'] }}; border-radius:10px; padding:16px 20px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    @if(!empty($icon))
                        <td width="32" valign="top" style="font-size:16px; padding-right:12px;">{{ $icon }}</td>
                    @endif
                    <td style="font-size:13px; color:{{ $t['text_muted'] }}; line-height:1.5;">{!! $text !!}</td>
                </tr>
            </table>
        </td>
    </tr>
</table>
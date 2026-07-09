<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Demo Request</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
                    {{-- Header --}}
                    <tr>
                        <td style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 32px 40px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700;">🎓 New Demo Request</h1>
                            <p style="margin: 8px 0 0; color: rgba(255,255,255,0.7); font-size: 14px;">via PDS Education AI Chat</p>
                        </td>
                    </tr>

                    {{-- Body --}}
                    <tr>
                        <td style="padding: 32px 40px;">
                            <p style="margin: 0 0 24px; color: #555; font-size: 14px; line-height: 1.6;">
                                A visitor has requested a product demo through the PDS Education AI assistant. Here are their details:
                            </p>

                            <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
                                <tr style="background-color: #f8f9fa;">
                                    <td style="padding: 12px 16px; font-size: 13px; color: #888; font-weight: 600; width: 130px; border-bottom: 1px solid #eee;">Name</td>
                                    <td style="padding: 12px 16px; font-size: 14px; color: #333; font-weight: 600; border-bottom: 1px solid #eee;">{{ $leadName }}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 16px; font-size: 13px; color: #888; font-weight: 600; border-bottom: 1px solid #eee;">Organization</td>
                                    <td style="padding: 12px 16px; font-size: 14px; color: #333; font-weight: 600; border-bottom: 1px solid #eee;">{{ $organization }}</td>
                                </tr>
                                <tr style="background-color: #f8f9fa;">
                                    <td style="padding: 12px 16px; font-size: 13px; color: #888; font-weight: 600; border-bottom: 1px solid #eee;">Email</td>
                                    <td style="padding: 12px 16px; font-size: 14px; border-bottom: 1px solid #eee;">
                                        <a href="mailto:{{ $leadEmail }}" style="color: #3b82f6; text-decoration: none;">{{ $leadEmail }}</a>
                                    </td>
                                </tr>
                                @if($phone)
                                <tr>
                                    <td style="padding: 12px 16px; font-size: 13px; color: #888; font-weight: 600; border-bottom: 1px solid #eee;">Phone</td>
                                    <td style="padding: 12px 16px; font-size: 14px; color: #333; font-weight: 600; border-bottom: 1px solid #eee;">{{ $phone }}</td>
                                </tr>
                                @endif
                                @if($leadMessage)
                                <tr style="background-color: #f8f9fa;">
                                    <td style="padding: 12px 16px; font-size: 13px; color: #888; font-weight: 600; vertical-align: top;">Message</td>
                                    <td style="padding: 12px 16px; font-size: 14px; color: #333; line-height: 1.5;">{{ $leadMessage }}</td>
                                </tr>
                                @endif
                            </table>

                            <div style="margin-top: 28px; padding: 16px; background-color: #f0fdf4; border-radius: 8px; border-left: 4px solid #22c55e;">
                                <p style="margin: 0; font-size: 13px; color: #16a34a; font-weight: 600;">
                                    💡 Follow up within 24 hours for highest conversion.
                                </p>
                            </div>
                        </td>
                    </tr>

                    {{-- Footer --}}
                    <tr>
                        <td style="padding: 20px 40px; background-color: #f8f9fa; text-align: center; border-top: 1px solid #eee;">
                            <p style="margin: 0; font-size: 12px; color: #999;">
                                Sent by PDS Education AI · {{ now()->format('d M Y, h:i A') }}
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>

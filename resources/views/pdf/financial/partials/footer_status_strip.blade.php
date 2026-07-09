<div style="margin-top: 12px; padding: 12px; background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 4px;">
    <table border="0" cellpadding="0" cellspacing="0" class="w-full">
        <tr>
            <td width="60%" style="border:none; vertical-align: middle; padding: 0;">
                <span style="font-size: 8px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px;">{{ $section['left_title'] }}</span><br>
                <span style="font-size: 10px; font-weight: bold; text-transform: uppercase;" class="{{ !empty($section['left_highlight']) ? 'brand-accent-text' : '' }}">
                    {{ $section['left_value'] }}
                </span>
            </td>
            <td width="40%" class="text-right" style="border:none; vertical-align: middle; padding: 0;">
                <span style="font-size: 8px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px;">{{ $section['right_title'] }}</span><br>
                <span style="font-size: 10px; font-weight: bold; color: #111827; text-transform: uppercase;">
                    {{ $section['right_value'] }}
                </span>
            </td>
        </tr>
    </table>
</div>

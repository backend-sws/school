<div style="margin-bottom: 20px;">
    <table border="0" cellpadding="5" cellspacing="0" class="w-full" style="border-collapse: collapse; font-size: 10px;">
        <thead>
            <tr style="border-bottom: 1px solid #000000;">
                <th width="70%" class="text-left" style="padding-bottom: 5px; font-weight: bold; text-transform: uppercase;">Description</th>
                <th width="30%" class="text-right" style="padding-bottom: 5px; font-weight: bold; text-transform: uppercase;">Amount</th>
            </tr>
        </thead>
        <tbody>
            @foreach($section['rows'] as $row)
                <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 8px 0; text-align: left;">{{ $row['description'] }}</td>
                    <td class="text-right" style="padding: 8px 0;">{{ $row['amount'] }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</div>

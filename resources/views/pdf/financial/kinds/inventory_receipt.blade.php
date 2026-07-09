<div style="margin-bottom: 25px;">
    <table border="0" cellpadding="0" cellspacing="0" class="w-full">
        <tr>
            <td width="60%">
                <div style="margin-bottom: 5px; font-size: 8px; text-transform: uppercase; color: #6b7280; font-weight: bold;">Billed To</div>
                <div style="font-size: 16px; font-weight: bold; color: #000000; margin-bottom: 5px;">{{ $document->extra['buyer_name'] }}</div>
                <div style="font-size: 9px; color: #4b5563; line-height: 1.4;">
                    Type: <span class="uppercase font-bold" style="color: #000000;">{{ $document->extra['buyer_type'] }}</span><br>
                    Collected By: {{ $document->extra['collector_name'] }}
                </div>
            </td>
            <td width="40%" style="vertical-align: top;">
                <div style="background: #f9fafb; padding: 10px 12px; border: 1px solid #e5e7eb; border-radius: 6px;">
                    <table border="0" cellpadding="0" cellspacing="0" class="w-full" style="margin:0;">
                        <tr>
                            <td style="border:none; padding:0; font-size: 8px; text-transform: uppercase; color: #6b7280; font-weight: bold;">Date</td>
                            <td style="border:none; padding:0; font-size: 8px; text-transform: uppercase; color: #6b7280; font-weight: bold;" class="text-right">Status</td>
                        </tr>
                        <tr>
                            <td style="border:none; padding:4px 0 0 0; font-weight: bold; color: #000000;">{{ $document->extra['date_display'] }}</td>
                            <td style="border:none; padding:4px 0 0 0; font-weight: bold; color: {{ !empty($document->extra['status_paid']) ? '#16a34a' : '#d97706' }};" class="text-right uppercase">{{ $document->extra['payment_status'] }}</td>
                        </tr>
                    </table>
                </div>
            </td>
        </tr>
    </table>
</div>

<div style="margin-bottom: 30px;">
    <table border="0" cellpadding="5" cellspacing="0" class="w-full" style="border-collapse: collapse; font-size: 10px;">
        <thead>
            <tr style="border-bottom: 1px solid #000000;">
                <th width="45%" class="text-left" style="padding-bottom: 5px; font-weight: bold; text-transform: uppercase;">Description</th>
                <th width="20%" class="text-center" style="padding-bottom: 5px; font-weight: bold; text-transform: uppercase;">Rate</th>
                <th width="15%" class="text-center" style="padding-bottom: 5px; font-weight: bold; text-transform: uppercase;">Qty</th>
                <th width="20%" class="text-right" style="padding-bottom: 5px; font-weight: bold; text-transform: uppercase;">Amount</th>
            </tr>
        </thead>
        <tbody>
            @foreach($document->extra['line_rows'] as $line)
                <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 8px 0; text-align: left; font-weight: bold;">
                        {{ $line['name'] }}
                        @if(!empty($line['code']))
                            <div style="font-size: 8px; font-weight: normal; color: #6b7280; margin-top: 2px;">CODE: {{ $line['code'] }}</div>
                        @endif
                    </td>
                    <td class="text-center" style="padding: 8px 0;">{{ $line['rate'] }}</td>
                    <td class="text-center" style="padding: 8px 0;">{{ $line['qty'] }}</td>
                    <td class="text-right font-bold" style="padding: 8px 0;">{{ $line['amount'] }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div style="margin-top: 20px;">
        <table border="0" cellpadding="0" cellspacing="0" class="w-full">
            <tr>
                <td width="55%" style="vertical-align: top; border:none; padding-right: 20px;">
                    @if(!empty($document->extra['remarks']))
                        <div style="background: #f9fafb; padding: 12px; border-radius: 4px; border: 1px solid #e5e7eb; font-style: italic; color: #4b5563; font-size: 9px; line-height: 1.4;">
                            <div style="font-weight: bold; font-style: normal; margin-bottom: 3px; text-transform: uppercase; color: #000000;">Remarks:</div>
                            {{ $document->extra['remarks'] }}
                        </div>
                    @else
                        <div style="font-size: 9px; color: #6b7280; line-height: 1.4;">
                            <div style="font-weight: bold; margin-bottom: 3px; text-transform: uppercase; color: #000000;">Declaration:</div>
                            • This is a computer-generated receipt.<br>
                            • No physical signature is required.
                        </div>
                    @endif
                </td>
                <td width="45%" style="vertical-align: top; border:none;">
                    <table border="0" cellpadding="0" cellspacing="0" class="w-full" style="margin:0; font-size: 10px; line-height: 1.6;">
                        <tr>
                            <td style="border:none; padding: 3px 0;" class="text-right">Subtotal:</td>
                            <td style="border:none; padding: 3px 0;" width="100" class="text-right">{{ $document->extra['subtotal'] }}</td>
                        </tr>
                        <tr>
                            <td style="border:none; padding: 3px 0;" class="text-right">Tax / Discount:</td>
                            <td style="border:none; padding: 3px 0;" class="text-right">₹0.00</td>
                        </tr>
                        <tr style="font-size: 14px;">
                            <td style="border:none; padding: 8px 0 3px 0; border-top: 1px solid #000000;" class="text-right font-bold">Total:</td>
                            <td style="border:none; padding: 8px 0 3px 0; border-top: 1px solid #000000; color: #000000;" class="text-right font-bold">{{ $document->extra['total'] }}</td>
                        </tr>
                        @if(!empty($document->extra['amount_paid']))
                            <tr style="font-size: 14px;">
                                <td style="border:none; padding: 5px 0; color: #16a34a;" class="text-right font-bold uppercase">Amount Paid:</td>
                                <td style="border:none; padding: 5px 0; color: #16a34a; border-bottom: 2px double #16a34a;" class="text-right font-bold">{{ $document->extra['amount_paid'] }}</td>
                            </tr>
                        @endif
                    </table>
                </td>
            </tr>
        </table>
    </div>
</div>
